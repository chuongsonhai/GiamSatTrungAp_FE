import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { YeuCauNghiemThuService } from 'src/app/modules/services/yeucaunghiemthu.service';
import { BoPhanService, CommonService, UserService } from 'src/app/modules/services/base.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { ApproveModel, CancelModel } from 'src/app/modules/models/bienbanks.model';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { ApproveNghiemThuTemplateComponent } from 'src/app/modules/share-component/approve-nghiem-thu/approve-nghiem-thu.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { UserModel } from 'src/app/_models/usermodel';
import { Userdata } from 'src/app/modules/models/userdata.model';
import { BoPhan } from 'src/app/modules/models/bophan.model';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';
import { CancelBusinessComponent } from 'src/app/modules/share-component/cancel-business/cancel-business.component';

@Component({
  selector: 'app-kiem-tra-ho-so',
  templateUrl: './kiem-tra-ho-so.component.html',
  styleUrls: ['./kiem-tra-ho-so.component.scss']
})
export class KiemTraHoSoComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: YeuCauNghiemThu;
  @Output() public reloadForm: EventEmitter<boolean>;

  EMPTY: any;

  formGroup: FormGroup;
  tabs = {
    ThoaThuanDauNoi: 1,
    YeuCauKiemTra: 2,
    HoSoKemTheo: 3,
    DuThaoHopDong: 4,
    PhuLucHopDong:5
  };

  srcCV: string;
  safeSrcCV: SafeResourceUrl;

  srcTTDN: string;
  safeSrcTTDN: SafeResourceUrl;

  _user$: UserModel;
  _userData:Userdata;
  _boPhan:BoPhan;

  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  allowApprove = new BehaviorSubject<boolean>(false);
  allowTiepNhan = new BehaviorSubject<boolean>(false);

  private subscriptions: Subscription[] = [];
  constructor(
    public commonService: CommonService,
    private auth: AuthenticationService,
    public service: YeuCauNghiemThuService,
    public UserSrv:UserService,
    public BPSrv:BoPhanService,
    private confirmationDialogService: ConfirmationDialogService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService) {
    this.reloadForm = new EventEmitter<boolean>();
    this.EMPTY = {
      deptId: 0,
      staffCode: '',
      ngayHen: '',
      noiDung: '',
      maCViec: ''
    }
    this.allowApprove.next(auth.isSysAdmin() || auth.checkPermission('YCNT-YCPCKT'));
    this.allowTiepNhan.next(auth.isSysAdmin() || auth.checkPermission('YCNT-TN'));
  }

  activeTabId = this.tabs.ThoaThuanDauNoi;
  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnInit() {
    this._user$ = this.auth.currentUserValue;
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    if (this.congVanYeuCau.SoCongVan !== undefined) {
      this.isLoadingForm$.next(true);
      this.getPDF(this.congVanYeuCau.PdfBienBanDN, "BBDN");
      if (this.congVanYeuCau.Data && this.congVanYeuCau.Data !== undefined)
        this.getPDF(this.congVanYeuCau.Data, "CVYC");
      this.isLoadingForm$.next(true);
      setTimeout(() => {
        this.isLoadingForm$.next(false);
      }, 2000);
    }
  }
  getUrl(key: string) {
    if (key === 'CVYC') return this.sanitizer.bypassSecurityTrustResourceUrl(this.srcCV);
    if (key === 'BBDN') return this.sanitizer.bypassSecurityTrustResourceUrl(this.srcTTDN);
  }

  approveModel: ApproveModel;
  submited = new BehaviorSubject<boolean>(false);

  xacNhanHoSo() {
    if(this.congVanYeuCau.MaDViQLy!=="HN"){
      const modalRef = this.modalService.open(ApproveNghiemThuTemplateComponent, { size: 'lg' });
      modalRef.componentInstance.congVanYeuCau = this.congVanYeuCau;
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
          this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn xác nhận yêu cầu?')
            .then((confirmed) => {
              if (confirmed) {
                this.isLoadingForm$.next(true);
                this.submited.next(true);
                if (this.approveModel) {
                  this.isLoadingForm$.next(true);
                  const sbSign = this.service.approve(this.approveModel).pipe(
                    catchError((errorMessage) => {
                      this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                      this.submited.next(false);
                      return of(this.congVanYeuCau);
                    }),
                    finalize(() => {
                      this.reloadForm.emit(true);
                      this.isLoadingForm$.next(false);
                    })
                  ).subscribe((res) => {
                    this.submited.next(false);
                    if (res.success) {
                      this.congVanYeuCau = res.data;
                      this.toastr.success("Đã gửi yêu cầu kiểm tra điều kiện đóng điện", "Thành công");
                    }
                    else
                      this.toastr.error(res.message, "Thông báo");
                  });
                }
              }
            });
        }
      );
    }
    else{
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
          this.approveModel.maCViec = "TVB";
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
            this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn xác nhận yêu cầu?')
            .then((confirmed) => {
              if (confirmed) {
                this.isLoadingForm$.next(true);
                this.submited.next(true);
                if (this.approveModel) {
                  this.isLoadingForm$.next(true);
                  const sbSign = this.service.approve(this.approveModel).pipe(
                    catchError((errorMessage) => {
                      this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                      this.submited.next(false);
                      return of(this.congVanYeuCau);
                    }),
                    finalize(() => {
                      this.reloadForm.emit(true);
                      this.isLoadingForm$.next(false);
                    })
                  ).subscribe((res) => {
                    this.submited.next(false);
                    if (res.success) {
                      this.congVanYeuCau = res.data;
                      this.toastr.success("Đã gửi yêu cầu kiểm tra điều kiện đóng điện", "Thành công");
                    }
                    else
                      this.toastr.error(res.message, "Thông báo");
                  });
                }
              }
            });
          }

        }
      });
          



   
    }
    
  }

  yeuCauKiemTra() {
    const modalRef = this.modalService.open(ApproveNghiemThuTemplateComponent, { size: 'lg' });
    modalRef.componentInstance.congVanYeuCau = this.congVanYeuCau;
    modalRef.componentInstance.truongBoPhan = !this.congVanYeuCau.GiaoB4;
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
        this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn xác nhận yêu cầu?')
          .then((confirmed) => {
            if (confirmed) {
              if (this.approveModel) {
                this.submited.next(true);
                this.isLoadingForm$.next(true);
                const sbSign = this.service.yeuCauKiemTra(this.approveModel).pipe(
                  catchError((errorMessage) => {
                    this.submited.next(false);
                    this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                    return of(this.congVanYeuCau);
                  }),
                  finalize(() => {
                    this.submited.next(false);
                    this.reloadForm.emit(true);
                    this.isLoadingForm$.next(false);
                  })
                ).subscribe((res: YeuCauNghiemThu) => {
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
    );
  }

  yeuCauKiemTraLai() {
    this.approveModel = Object.assign(new ApproveModel(), this.EMPTY);
    this.approveModel.id = this.congVanYeuCau.ID;
 
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn yêu cầu kiểm tra lại?')
      .then((confirmed) => {
        if (confirmed) {
          if (this.approveModel) {
            this.submited.next(true);
            this.isLoadingForm$.next(true);
            const sbSign = this.service.yeuCauKiemTraLai(this.approveModel).pipe(
              catchError((errorMessage) => {
                this.submited.next(false);
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                return of(this.congVanYeuCau);
              }),
              finalize(() => {
                this.submited.next(false);
                this.reloadForm.emit(true);
                this.isLoadingForm$.next(false);
              })
            ).subscribe((res: YeuCauNghiemThu) => {
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


  getPDF(path: string, key: string): any {
    this.isLoadingForm$.next(true);
    this.commonService.getPDF(path).subscribe((response) => {
      var binary_string = window.atob(response);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      let file = new Blob([bytes.buffer], { type: 'application/pdf' });
      var src = URL.createObjectURL(file);
      var safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
      if (key === "CVYC") {
        this.srcCV = src;
        this.safeSrcCV = safeSrc;
      }
      if (key === "BBDN") {
        this.srcTTDN = src;
        this.safeSrcTTDN = safeSrc;
      }
    }), finalize(() => this.isLoadingForm$.next(false))
  }


  ngOnDestroy() {

  }
}
