import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, interval, merge, of, Subscription, timer } from 'rxjs';
import { catchError, finalize, first, takeWhile, tap } from 'rxjs/operators';
import * as _moment from 'moment';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';

import { FormGroup } from '@angular/forms';
import { CommonService } from 'src/app/modules/services/common.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { BienBanKSService } from 'src/app/modules/services/bienbanks.service';
import { CongVanYeuCau } from 'src/app/modules/models/congvanyeucau.model';
import { BienBanKSData } from 'src/app/modules/models/bienbanksdata.model';
import { ApproveModel, CancelModel, SignModel, SignRemoteModel } from 'src/app/modules/models/bienbanks.model';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CreateBienBanKhaoSatComponent } from '../create-bien-ban-khao-sat/create-bien-ban-khao-sat.component';
import { ApproveDocumentTemplateComponent } from 'src/app/modules/share-component/approve-document/approve-document.component';
import { MetadataService } from 'src/app/modules/services/metadata.service';
import { TienTrinhData } from 'src/app/modules/models/tientrinhdata.model';
import { CauHinhCViec } from 'src/app/modules/models/cauhinhcviec.model';
import { CancelBusinessComponent } from 'src/app/modules/share-component/cancel-business/cancel-business.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import * as signer from 'src/app/modules/services/SignHubExt.js';
import { ChangeDetectorRef } from '@angular/core';
import * as $ from "jquery";
declare var SignHubExt: any;
declare var SignService: any;
@Component({
  selector: 'app-bien-ban-khao-sat',
  templateUrl: './bien-ban-khao-sat.component.html',
  styleUrls: ['./bien-ban-khao-sat.component.scss']
})
export class BienBanKSComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: CongVanYeuCau;
  @Output() public reloadData: EventEmitter<boolean>;
  EMPTY: any;
  formGroup: FormGroup;
  BienBanKSData: BienBanKSData;
  signRemoteModel: SignRemoteModel;
  approveModel: ApproveModel;
  startDate = new Date();
  allowCancel = new BehaviorSubject<boolean>(false);
  allowApprove = new BehaviorSubject<boolean>(false);
  allowSign = new BehaviorSubject<boolean>(false);

  txtFileBase64Sign = '';

  constructor(
    private auth: AuthenticationService,
    public service: BienBanKSService,
    public metadataService: MetadataService,
    private confirmationDialogService: ConfirmationDialogService,
    public commonService: CommonService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private ref: ChangeDetectorRef
  ) {
    this.allowCancel.next(auth.isSysAdmin() || auth.checkPermission('YCDN-HUYKQ'));
    this.allowApprove.next(auth.isSysAdmin() || auth.checkPermission('YCDN-DUYETBBKS'));
    this.allowSign.next(auth.isSysAdmin() || auth.checkPermission('YCDN-KYBBKS'));
    this.reloadData = new EventEmitter<boolean>();
    this.EMPTY = {
      id: 0,
      deptId: undefined,
      staffCode: undefined,
      ngayHen: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      noiDung: undefined
    }
  }

  tabs = {
    KetQuaKS: 1,
    BienBanKS: 2
  };

  activeTabId = this.tabs.BienBanKS;
  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  safeSrc: SafeResourceUrl;
  height: string;

  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 2000);
    if (this.congVanYeuCau.MaYeuCau !== undefined) {
      this.loadData();
      debugger;
    }
  }

  srcBienBanKS: string;
  base64String: string;
  FileBase64: string;
  getPDFBBKS(path: string) {
    this.commonService.getPDF(path).subscribe((response) => {
      var binary_string = window.atob(response);
      this.FileBase64 = response;
      this.base64String = binary_string;
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      let file = new Blob([bytes.buffer], { type: 'application/pdf' });

      this.srcBienBanKS = URL.createObjectURL(file);
      this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.srcBienBanKS);
    });
  }

  getUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.srcBienBanKS);
  }

  tienTrinhData: TienTrinhData;
  congViecs: CauHinhCViec[];

  reloadYCau(reload: boolean) {
    if (reload) {
      this.loadData();
      this.reloadData.emit(reload);
    }
  }

  loadData() {
    this.isLoadingForm$.next(true);
    this.BienBanKSData = Object.assign(new BienBanKSData(), this.EMPTY);
    const sb = this.service.getItem(this.congVanYeuCau.MaYeuCau).pipe(
      first(),
      catchError((errorMessage) => {
        this.isLoadingForm$.next(false);
        return of(this.BienBanKSData);
      })
    ).subscribe((result) => {
      if (result.success) {
        this.BienBanKSData = result.data;
        this.safeSrc = null;
        this.getPDFBBKS(this.BienBanKSData.BienBanKS.Data);
        setTimeout(() => {
          this.isLoadingForm$.next(false);
        }, 2000);
      }
    });
  }

  cancelModel: CancelModel;

  huyKQua() {
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
          this.confirmationDialogService.confirm('Thông báo', 'Sau khi hủy hồ sơ sẽ bị trả lại khách hàng, bạn có muốn hủy?')
            .then((confirmed) => {
              if (confirmed) {
                this.submited.next(true);
                const sbSign = this.service.huyKetQua(this.cancelModel).pipe(
                  tap(() => {
                    this.isLoadingForm$.next(true);
                    this.loadData();
                    //this.changeTab(this.tabs.KetQuaKS);
                    this.reloadData.emit(true);
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
                    this.toastr.success("Đã hủy kết quả khảo sát lưới điện", "Thành công");
                  }
                  else
                    this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                });
              }
            });
        }
      });
  }

  cancel() {
    
          this.confirmationDialogService.confirm('Thông báo', 'Bạn có muốn khảo sát lại?')
            .then((confirmed) => {
              if (confirmed) {
                this.submited.next(true);
                debugger;
                const sbSign = this.service.khaoSatLai(this.BienBanKSData.BienBanKS).pipe(
                  tap(() => {
                    debugger;
                    this.isLoadingForm$.next(true);
                    this.reloadData.emit(true);
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
                    this.toastr.success("Đã hủy kết quả khảo sát lưới điện", "Thành công");
                  }
                  else
                    this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                });
              }
            });
      
  }

  create() {
    this.edit(undefined);
  }

  edit(id: number) {
    const modalRef = this.modalService.open(CreateBienBanKhaoSatComponent, { size: 'xl' });
    modalRef.componentInstance._bienBanKS = this.BienBanKSData.BienBanKS;
    modalRef.result.then(
      () => {
        this.isLoadingForm$.next(true);
        this.loadData();
        this.isLoadingForm$.next(false);
      }
    );
  }
  submited = new BehaviorSubject<boolean>(false);

  sign() {
    const modalRef = this.modalService.open(ApproveDocumentTemplateComponent, { size: 'lg' });
    modalRef.componentInstance.congVanYeuCau = this.congVanYeuCau;
    modalRef.componentInstance.approveModel.subscribe((resultModel) => {
      if (resultModel) {
        this.submited.next(true);
        this.approveModel = Object.assign(new ApproveModel(), this.EMPTY);
        this.approveModel.id = this.BienBanKSData.BienBanKS.ID;
        this.approveModel.deptId = resultModel.deptId;
        this.approveModel.staffCode = resultModel.staffCode;
        this.approveModel.ngayHen = resultModel.ngayHen;
        this.approveModel.noiDung = resultModel.noiDung;
        this.approveModel.maCViec = resultModel.maCViec;
      }
    });
    modalRef.result.then(
      () => {
        this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn gửi yêu cầu?')
          .then((confirmed) => {
            if (confirmed) {
              this.submited.next(true);
              if (this.approveModel) {
                const sbSign = this.service.sign(this.approveModel).pipe(
                  catchError((errorMessage) => {
                    this.submited.next(false);
                    this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                    return of(this.BienBanKSData);
                  }),
                  finalize(() => {
                    this.isLoadingForm$.next(true);
                    this.loadData();
                    this.reloadData.emit(true);
                    this.isLoadingForm$.next(false);
                  })).subscribe((res) => {
                    this.submited.next(false);
                    if (res.success) {
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

  kySoNhanVien() {
    var Sign = new SignHubExt();
    Sign.initialize("BAN KỸ THUẬT/ PHÒNG KỸ THUẬT", this.FileBase64);

    var timer = interval(1000)
      .pipe(takeWhile(val => val < 20))
      .subscribe(() => {
        if ($('#txtFileBase64Sign').val().toString() != "") {
          timer.unsubscribe();
          this.guiXacNhan();
        }

      });
  }

  guiXacNhan() {
    const modalRef = this.modalService.open(ApproveDocumentTemplateComponent, { size: 'lg' });
    modalRef.componentInstance.congVanYeuCau = this.congVanYeuCau;
    modalRef.componentInstance.approveModel.subscribe((resultModel) => {
      if (resultModel) {
        this.submited.next(true);
        this.signRemoteModel = Object.assign(new SignRemoteModel(), this.EMPTY);
        this.signRemoteModel.id = this.BienBanKSData.BienBanKS.ID;
        this.signRemoteModel.deptId = resultModel.deptId;
        this.signRemoteModel.staffCode = resultModel.staffCode;
        this.signRemoteModel.ngayHen = resultModel.ngayHen;
        this.signRemoteModel.noiDung = resultModel.noiDung;
        this.signRemoteModel.maCViec = resultModel.maCViec;
      }
    });
    modalRef.result.then(
      () => {
        this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn gửi yêu cầu?')
          .then((confirmed) => {
            if (confirmed) {
              this.submited.next(true);
              if (this.signRemoteModel) {
                this.txtFileBase64Sign = $('#txtFileBase64Sign').val().toString();
                if (this.txtFileBase64Sign != null && this.txtFileBase64Sign != "") {
                  this.signRemoteModel.binary_string = this.txtFileBase64Sign;
                  const sbSign = this.service.signRemote(this.signRemoteModel).pipe(
                    catchError((errorMessage) => {
                      this.submited.next(false);
                      this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                      return of(this.BienBanKSData);
                    }),
                    finalize(() => {
                      this.isLoadingForm$.next(true);
                      this.loadData();
                      this.reloadData.emit(true);
                      this.isLoadingForm$.next(false);
                    })).subscribe((res) => {
                      this.submited.next(false);
                      if (res.success) {
                        this.toastr.success("Đã gửi yêu cầu", "Thành công");
                      }
                      else
                        this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                    });

                }
              }
            }
          });
      }
    );

    modalRef.componentInstance.huyChuKy.subscribe((huyChuKy) => {
      debugger;
      if (huyChuKy) {
        this.clearChuKy();
      }
    })
  }

  clearChuKy() {
    $('#txtFileBase64Sign').val('');
  }


  signInit() {

    var Sign = new SignHubExt();
    Sign.initialize("BÊN BÁN ĐIỆN", this.FileBase64);
    this.txtFileBase64Sign = $('#txtFileBase64Sign').val().toString();
    return this.txtFileBase64Sign;

  }


  approve() {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn gửi yêu cầu kiểm tra, xác nhận biên bản đến khách hàng?')
      .then((confirmed) => {
        if (confirmed) {
          this.submited.next(true);
          this.approveModel = Object.assign(new ApproveModel(), this.EMPTY);
          this.approveModel.id = this.BienBanKSData.BienBanKS.ID;
          const sbSign = this.service.approve(this.approveModel).pipe(
            catchError((errorMessage) => {
              this.submited.next(false);
              this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
              return of(this.BienBanKSData);
            }),
            finalize(() => {
              this.isLoadingForm$.next(true);
              this.loadData();
              this.isLoadingForm$.next(false);
            })).subscribe((res) => {
              this.submited.next(false);
              if (res.success) {
                this.toastr.success("Đã gửi yêu cầu", "Thành công");
              }
              else
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
            });
        }
      });
  }

  private subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
