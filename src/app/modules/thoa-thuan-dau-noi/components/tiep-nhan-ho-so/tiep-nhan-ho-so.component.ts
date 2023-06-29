import { Component, OnInit, OnDestroy, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoPhanService, CongVanYeuCauService, UserService } from 'src/app/modules/services/base.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CongVanYeuCau } from '../../../models/congvanyeucau.model';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { ApproveDocumentTemplateComponent } from 'src/app/modules/share-component/approve-document/approve-document.component';
import { ApproveModel, CancelModel } from 'src/app/modules/models/bienbanks.model';
import { CancelBusinessComponent } from 'src/app/modules/share-component/cancel-business/cancel-business.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { UserModel } from 'src/app/_models/usermodel';
import { NhanVienService } from 'src/app/modules/services/nhanvien.service';
import { NhanVien } from 'src/app/modules/models/nhanvien.model';
import { Userdata } from 'src/app/modules/models/userdata.model';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';
import { BoPhan } from 'src/app/modules/models/bophan.model';

@Component({
  selector: 'app-tiep-nhan-ho-so',
  templateUrl: './tiep-nhan-ho-so.component.html',
  styleUrls: ['./tiep-nhan-ho-so.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe

  ]
})
export class TiepNhanHoSoComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: CongVanYeuCau;
  @Output() public reloadForm: EventEmitter<boolean>;

  EMPTY: any;
  formGroup: FormGroup;
  tabs = {
    CongVan: 1,
    HoSoCongTrinhDien: 2
  };
  _user$: UserModel;
  _userData:Userdata;
  _boPhan:BoPhan;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);

  safeSrc: SafeResourceUrl;
  srcCV: string;
  allowApprove = new BehaviorSubject<boolean>(false);
  allowTiepNhan = new BehaviorSubject<boolean>(false);
  activeTabId = this.tabs.CongVan; // 0 => Basic info;
  private subscriptions: Subscription[] = [];
  constructor(
    public CommonService: CommonService,
    public UserSrv:UserService,
    public BPSrv:BoPhanService,
    public service: CongVanYeuCauService,
    private confirmationDialogService: ConfirmationDialogService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private toastr: ToastrService) {
    this.allowApprove.next(auth.isSysAdmin() || auth.checkPermission('YCDN-YCPC'));
    this.allowTiepNhan.next(auth.isSysAdmin() || auth.checkPermission('YCDN-TN'));

    this.reloadForm = new EventEmitter<boolean>();
    this.EMPTY = {
      ID: 0,
      TrangThai: 0,
      HoSos: [],
    }
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnInit() {
    this._user$ = this.auth.currentUserValue;
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    if (this.congVanYeuCau.MaYeuCau !== undefined) {
      this.getPDF(this.congVanYeuCau.Data);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  getPDF(path: string) {
    this.isLoadingForm$.next(true);
    this.CommonService.getPDF(path).subscribe((response) => {
      if (response === undefined || response === null) {
        this.isLoadingForm$.next(false);
      }
      else {
        var binary_string = window.atob(response);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        let file = new Blob([bytes.buffer], { type: 'application/pdf' });
        this.srcCV = URL.createObjectURL(file);
        this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.srcCV);
        setTimeout(() => {
          this.isLoadingForm$.next(false);
        }, 2000);
      }
    });
  }

  getUrl() {
    let url = this.sanitizer.bypassSecurityTrustResourceUrl(this.srcCV);
    return url;
  }

  approveModel: ApproveModel;
  cancelModel: CancelModel;

  traHoSo() {
    const modalRef = this.modalService.open(CancelBusinessComponent, { size: 'lg' });
    modalRef.componentInstance.cancelModel.subscribe((resultModel) => {
      if (resultModel) {
        this.submited.next(true);
        this.cancelModel = Object.assign(new CancelModel(), this.EMPTY);
        this.cancelModel.maYCau = this.congVanYeuCau.MaYeuCau;
        this.cancelModel.noiDung = resultModel.noiDung;
      }
    });
    modalRef.result.then(
      () => {
        if (this.cancelModel !== undefined) {
          this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn trả lại hồ sơ yêu cầu?')
            .then((confirmed) => {
              if (confirmed) {
                this.submited.next(true);
                const sbSign = this.service.traHoSo(this.cancelModel).pipe(
                  tap(() => {
                    this.isLoadingForm$.next(true);
                    this.reloadForm.emit(true);
                    this.isLoadingForm$.next(false);
                  }),
                  catchError((errorMessage) => {
                    this.submited.next(false);
                    this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                    return of(undefined);
                  }),
                ).subscribe((res) => {
                  this.submited.next(false);
                  if (res.success) {
                    this.toastr.success("Đã hủy yêu cầu", "Thành công");
                  }
                  else
                    this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                });
              }
            });
        }
      });
  }

  submited = new BehaviorSubject<boolean>(false);

  duyetHoSo() {
    if(this.congVanYeuCau.MaDViQLy!=="PD"){
      const modalRef = this.modalService.open(ApproveDocumentTemplateComponent, { size: 'lg' });
      modalRef.componentInstance.congVanYeuCau = this.congVanYeuCau;
      modalRef.componentInstance.truongBoPhan = false;
      modalRef.componentInstance.approveModel.subscribe((resultModel) => {
        if (resultModel) {
          this.submited.next(true);
          this.approveModel = Object.assign(new ApproveModel(), this.EMPTY);
          this.approveModel.id = this.congVanYeuCau.ID;
          this.approveModel.deptId = resultModel.deptId;
          this.approveModel.staffCode = resultModel.staffCode;
          this.approveModel.ngayHen = resultModel.ngayHen;
          this.approveModel.noiDung = resultModel.noiDung;
          this.approveModel.maCViec = resultModel.maCViec;
        }
      });
      modalRef.result.then(
        () => {
          if (this.approveModel !== undefined) {
            this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn duyệt hồ sơ yêu cầu?')
              .then((confirmed) => {
                if (confirmed) {
                  this.submited.next(true);
                  if (this.approveModel && this.approveModel.maCViec != undefined) {
                    const sbSign = this.service.duyetHoSo(this.approveModel).pipe(
                      catchError((errorMessage) => {
                        this.submited.next(false);
                        this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                        return of(undefined);
                      }),
                      finalize(() => {
                        this.isLoadingForm$.next(true);
                        this.reloadForm.emit(true);
                        this.isLoadingForm$.next(false);
                      }))
                      .subscribe((res: CongVanYeuCau) => {
                        this.submited.next(false);
                        if (res !== null && res !== undefined) {
                          this.congVanYeuCau = res;
                          this.toastr.success("Đã tiếp nhận yêu cầu", "Thành công");
                        }
                        else
                          this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                      })
                  }
                }
              });
          }
        }
      );
    }
    else {
      this.UserSrv.getItemById(this._user$.userId).pipe(
        first(),
        catchError((errorMessage) => {
          this.isLoadingForm$.next(false);
          return of();
        })
      ).subscribe((result) => {
        if(result){
          this._userData=result;
          this.approveModel = Object.assign(new ApproveModel(), this.EMPTY);
          this.approveModel.id = this.congVanYeuCau.ID;
          this.approveModel.staffCode = this._userData.maNVien;
          this.approveModel.ngayHen =  DateTimeUtil.convertDateToStringVNDefaulDateNow(new Date());
          this.approveModel.maCViec = "TN";
          this.BPSrv.getbymabp(this.congVanYeuCau.MaDViQLy,this._userData.maBPhan).pipe(
            first(),
            catchError((errorMessage) => {
              this.isLoadingForm$.next(false);
              return of();
            })
          ).subscribe((bp) => {
            if(bp){
              this._boPhan=bp;
              this.approveModel.deptId = this._boPhan.ID;
            }
          })
          if (this.approveModel !== undefined) {
            this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn duyệt hồ sơ yêu cầu?')
              .then((confirmed) => {
                if (confirmed) {
                  this.submited.next(true);
                  if (this.approveModel && this.approveModel.maCViec != undefined) {
                    const sbSign = this.service.duyetHoSo(this.approveModel).pipe(
                      catchError((errorMessage) => {
                        this.submited.next(false);
                        this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                        return of(undefined);
                      }),
                      finalize(() => {
                        this.isLoadingForm$.next(true);
                        this.reloadForm.emit(true);
                        this.isLoadingForm$.next(false);
                      }))
                      .subscribe((res: CongVanYeuCau) => {
                        this.submited.next(false);
                        if (res !== null && res !== undefined) {
                          this.congVanYeuCau = res;
                          this.toastr.success("Đã tiếp nhận yêu cầu", "Thành công");
                        }
                        else
                          this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                      })
                  }
                }
              });
          }
        }
      });
    }
  }

  xacNhanHoSo() {
    const modalRef = this.modalService.open(ApproveDocumentTemplateComponent, { size: 'lg' });
    modalRef.componentInstance.congVanYeuCau = this.congVanYeuCau;
    modalRef.componentInstance.truongBoPhan = true;
    modalRef.componentInstance.approveModel.subscribe((resultModel) => {
      if (resultModel) {
        this.submited.next(true);
        this.approveModel = Object.assign(new ApproveModel(), this.EMPTY);
        this.approveModel.id = this.congVanYeuCau.ID;
        this.approveModel.deptId = resultModel.deptId;
        this.approveModel.staffCode = resultModel.staffCode;
        this.approveModel.ngayHen = resultModel.ngayHen;
        this.approveModel.noiDung = resultModel.noiDung;
        this.approveModel.maCViec = resultModel.maCViec;
      }
    });
    modalRef.result.then(
      () => {
        if (this.approveModel !== undefined) {
          this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn yêu cầu phân công khảo sát lưới điện?')
            .then((confirmed) => {
              if (confirmed) {
                if (this.approveModel) {
                  this.submited.next(true);
                  const sbSign = this.service.yeuCauKhaoSat(this.approveModel).pipe(
                    catchError((errorMessage) => {
                      this.submited.next(false);
                      this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                      return of(this.congVanYeuCau);
                    }),
                    finalize(() => {
                      this.isLoadingForm$.next(true);
                      this.reloadForm.emit(true);
                      this.isLoadingForm$.next(false);
                    })).subscribe((res: CongVanYeuCau) => {
                      this.submited.next(false);
                      if (res !== null && res !== undefined) {
                        this.congVanYeuCau = res;
                        this.toastr.success("Đã gửi yêu cầu", "Thành công");
                      }
                      else
                        this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                    });
                }
              }
            });
        }
      }
    );
  }

  xacNhanHoSoLai() {
    this.approveModel = Object.assign(new ApproveModel(), this.EMPTY);
    this.approveModel.id = this.congVanYeuCau.ID;
      this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn yêu cầu phân công lại khảo sát lưới điện?')
        .then((confirmed) => {
          if (confirmed) {

            if (this.approveModel) {
              this.submited.next(true);
              const sbSign = this.service.yeuCauKhaoSatLai(this.approveModel).pipe(
                catchError((errorMessage) => {
                  this.submited.next(false);
                  this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                  return of(this.congVanYeuCau);
                }),
                finalize(() => {
                  this.isLoadingForm$.next(true);
                  this.reloadForm.emit(true);
                  this.isLoadingForm$.next(false);
                })).subscribe((res: CongVanYeuCau) => {
                  this.submited.next(false);
                  if (res !== null && res !== undefined) {
                    this.congVanYeuCau = res;
                    this.toastr.success("Đã gửi yêu cầu", "Thành công");
                  }
                  else
                    this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                });
            }
          }
        });
    

  }
}
