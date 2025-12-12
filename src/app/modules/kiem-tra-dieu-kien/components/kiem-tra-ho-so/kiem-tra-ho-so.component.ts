import {
  Component, OnInit, OnDestroy, Input, Output, EventEmitter
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';

import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { YeuCauNghiemThuService } from 'src/app/modules/services/yeucaunghiemthu.service';
import { BoPhanService, CommonService, UserService } from 'src/app/modules/services/base.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  @Output() public reloadForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  EMPTY: any = {
    deptId: 0,
    staffCode: '',
    ngayHen: '',
    noiDung: '',
    maCViec: ''
  };

  pdfCVYCBlob: Blob | null = null;
  pdfBBDNBlob: Blob | null = null;

  _user$: UserModel;
  _userData: Userdata;
  _boPhan: BoPhan;

  approveModel: ApproveModel;
  cancelModel: CancelModel;

  submited = new BehaviorSubject<boolean>(false);
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  allowApprove = new BehaviorSubject<boolean>(false);
  allowTiepNhan = new BehaviorSubject<boolean>(false);

  tabs = {
    ThoaThuanDauNoi: 1,
    YeuCauKiemTra: 2,
    HoSoKemTheo: 3,
    DuThaoHopDong: 4,
    PhuLucHopDong: 5
  };
  activeTabId = this.tabs.ThoaThuanDauNoi;

  private subscriptions: Subscription[] = [];

  constructor(
    public commonService: CommonService,
    private auth: AuthenticationService,
    public service: YeuCauNghiemThuService,
    public UserSrv: UserService,
    public BPSrv: BoPhanService,
    private confirmationDialogService: ConfirmationDialogService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.allowApprove.next(auth.isSysAdmin() || auth.checkPermission('YCNT-YCPCKT'));
    this.allowTiepNhan.next(auth.isSysAdmin() || auth.checkPermission('YCNT-TN'));
  }

  ngOnInit() {
    this._user$ = this.auth.currentUserValue;
    this.isLoadingForm$.next(true);

    if (this.congVanYeuCau?.SoCongVan) {
      if (this.congVanYeuCau.PdfBienBanDN)
        this.loadPDF(this.congVanYeuCau.PdfBienBanDN, 'BBDN');
      if (this.congVanYeuCau.Data)
        this.loadPDF(this.congVanYeuCau.Data, 'CVYC');
    }

    setTimeout(() => this.isLoadingForm$.next(false), 1500);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  viewPDF(key: string) {
    const blob = key === 'CVYC' ? this.pdfCVYCBlob : this.pdfBBDNBlob;
    if (blob) {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else {
      this.toastr.warning('Không có tệp PDF để hiển thị.', 'Thông báo');
    }
  }

  loadPDF(path: string, key: string) {
    this.isLoadingForm$.next(true);
    this.commonService.getPDF(path).pipe(
      catchError(() => {
        this.toastr.error('Không thể tải file PDF', 'Lỗi');
        return of(null);
      }),
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((response: string) => {
      if (response) {
        const bytes = new Uint8Array([...window.atob(response)].map(c => c.charCodeAt(0)));
        const blob = new Blob([bytes], { type: 'application/pdf' });
        if (key === 'CVYC') this.pdfCVYCBlob = blob;
        if (key === 'BBDN') this.pdfBBDNBlob = blob;
      }
    });
  }

  xacNhanHoSo() {
    if (this.congVanYeuCau.MaDViQLy !== "HN") {
      const modalRef = this.modalService.open(ApproveNghiemThuTemplateComponent, { size: 'lg' });
      modalRef.componentInstance.congVanYeuCau = this.congVanYeuCau;
      modalRef.componentInstance.approveModel.subscribe((model) => {
        if (model) {
          this.approveModel = Object.assign(new ApproveModel(), this.EMPTY);
          Object.assign(this.approveModel, model, { id: this.congVanYeuCau.ID });
        }
      });

      modalRef.result.then(() => {
        this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn xác nhận yêu cầu?').then((confirmed) => {
          if (confirmed && this.approveModel) {
            this.submited.next(true);
            this.isLoadingForm$.next(true);
            this.service.approve(this.approveModel).pipe(
              catchError(() => {
                this.toastr.error('Có lỗi xảy ra', 'Thông báo');
                this.submited.next(false);
                return of(this.congVanYeuCau);
              }),
              finalize(() => {
                this.isLoadingForm$.next(false);
                this.reloadForm.emit(true);
              })
            ).subscribe((res) => {
              this.submited.next(false);
              if (res.success) {
                this.congVanYeuCau = res.data;
                this.toastr.success('Đã gửi yêu cầu kiểm tra', 'Thành công');
              } else {
                this.toastr.error(res.message, 'Thông báo');
              }
            });
          }
        });
      });

    } else {
      this.UserSrv.getItemById(this._user$.userId).pipe(
        first(),
        catchError(() => {
          this.isLoadingForm$.next(false);
          return of();
        })
      ).subscribe(result => {
        if (result) {
          this._userData = result;
          this.approveModel = Object.assign(new ApproveModel(), this.EMPTY, {
            id: this.congVanYeuCau.ID,
            staffCode: result.maNVien,
            ngayHen: DateTimeUtil.convertDateToStringVNDefaulDateNow(new Date()),
            maCViec: 'TVB'
          });

          this.BPSrv.getbymabp(this.congVanYeuCau.MaDViQLy, result.maBPhan).pipe(
            first(),
            catchError(() => of())
          ).subscribe(bp => {
            if (bp) {
              this.approveModel.deptId = bp.ID;
              this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn xác nhận yêu cầu?')
                .then((confirmed) => {
                  if (confirmed) {
                    this.submited.next(true);
                    this.isLoadingForm$.next(true);
                    this.service.approve(this.approveModel).pipe(
                      catchError(() => {
                        this.toastr.error('Có lỗi xảy ra', 'Thông báo');
                        this.submited.next(false);
                        return of(this.congVanYeuCau);
                      }),
                      finalize(() => {
                        this.isLoadingForm$.next(false);
                        this.reloadForm.emit(true);
                      })
                    ).subscribe((res) => {
                      this.submited.next(false);
                      if (res.success) {
                        this.toastr.success('Đã gửi yêu cầu kiểm tra', 'Thành công');
                        this.congVanYeuCau = res.data;
                      } else {
                        this.toastr.error(res.message, 'Thông báo');
                      }
                    });
                  }
                });
            }
          });
        }
      });
    }
  }

  yeuCauKiemTra() {
    const modalRef = this.modalService.open(ApproveNghiemThuTemplateComponent, { size: 'lg' });
    modalRef.componentInstance.congVanYeuCau = this.congVanYeuCau;
    modalRef.componentInstance.truongBoPhan = !this.congVanYeuCau.GiaoB4;
    modalRef.componentInstance.approveModel.subscribe((model) => {
      if (model) {
        this.approveModel = Object.assign(new ApproveModel(), this.EMPTY, model, { id: this.congVanYeuCau.ID });
      }
    });

    modalRef.result.then(() => {
      this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn xác nhận yêu cầu?').then((confirmed) => {
        if (confirmed && this.approveModel) {
          this.submited.next(true);
          this.isLoadingForm$.next(true);
          this.service.yeuCauKiemTra(this.approveModel).pipe(
            catchError(() => {
              this.toastr.error('Có lỗi xảy ra', 'Thông báo');
              return of(this.congVanYeuCau);
            }),
            finalize(() => {
              this.isLoadingForm$.next(false);
              this.reloadForm.emit(true);
              this.submited.next(false);
            })
          ).subscribe(res => {
            if (res) {
              this.toastr.success('Đã gửi yêu cầu', 'Thành công');
              this.congVanYeuCau = res;
            }
          });
        }
      });
    });
  }

  yeuCauKiemTraLai() {
    this.approveModel = Object.assign(new ApproveModel(), this.EMPTY, {
      id: this.congVanYeuCau.ID
    });

    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn yêu cầu kiểm tra lại?')
      .then((confirmed) => {
        if (confirmed) {
          this.submited.next(true);
          this.isLoadingForm$.next(true);
          this.service.yeuCauKiemTraLai(this.approveModel).pipe(
            catchError(() => {
              this.toastr.error('Có lỗi xảy ra', 'Thông báo');
              return of(this.congVanYeuCau);
            }),
            finalize(() => {
              this.isLoadingForm$.next(false);
              this.submited.next(false);
              this.reloadForm.emit(true);
            })
          ).subscribe(res => {
            if (res) {
              this.toastr.success('Đã gửi yêu cầu', 'Thành công');
              this.congVanYeuCau = res;
            }
          });
        }
      });
  }

  traHoSo() {
    const modalRef = this.modalService.open(CancelBusinessComponent, { size: 'lg' });
    modalRef.componentInstance.cancelModel.subscribe((model) => {
      if (model) {
        this.cancelModel = Object.assign(new CancelModel(), this.EMPTY, {
          maYCau: this.congVanYeuCau.MaYeuCau,
          noiDung: model.noiDung
        });
      }
    });

    modalRef.result.then(() => {
      if (this.cancelModel) {
        this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn trả lại hồ sơ yêu cầu?').then((confirmed) => {
          if (confirmed) {
            this.submited.next(true);
            this.service.traHoSo(this.cancelModel).pipe(
              tap(() => {
                this.isLoadingForm$.next(true);
                this.reloadForm.emit(true);
                this.isLoadingForm$.next(false);
              }),
              catchError(() => {
                this.toastr.error('Có lỗi xảy ra', 'Thông báo');
                return of(undefined);
              })
            ).subscribe((res) => {
              this.submited.next(false);
              if (res?.success) {
                this.toastr.success('Đã hủy yêu cầu', 'Thành công');
              } else {
                this.toastr.error('Có lỗi xảy ra', 'Thông báo');
              }
            });
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
