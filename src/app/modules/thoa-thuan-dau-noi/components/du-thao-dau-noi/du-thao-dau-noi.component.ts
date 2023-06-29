import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CongVanYeuCau } from 'src/app/modules/models/congvanyeucau.model';
import { BienBanDNData } from 'src/app/modules/models/thoathuandaunoi.model';
import { CommonService } from '../../../services/common.service';
import { BienBanDNService } from 'src/app/modules/services/bienbandn.service';
import { ApproveModel } from 'src/app/modules/models/bienbanks.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { ApproveDocumentTemplateComponent } from 'src/app/modules/share-component/approve-document/approve-document.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { UploadDuThaoDNComponent } from './components/upload-du-thao-dau-noi.component';
import { ApproveDuThaoComponent } from './approve-du-thao/approve-du-thao.component';

@Component({
  selector: 'app-du-thao-dau-noi',
  templateUrl: './du-thao-dau-noi.component.html',
  styleUrls: ['./du-thao-dau-noi.component.scss']
})
export class DuThaoDauNoiComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: CongVanYeuCau;
  @Output() public reloadForm: EventEmitter<boolean>;

  EMPTY: any;
  formGroup: FormGroup;

  bienBanDNData: BienBanDNData;

  approveModel: ApproveModel;
  allowApprove = new BehaviorSubject<boolean>(false);
  allowSign = new BehaviorSubject<boolean>(false);

  constructor(
    private auth: AuthenticationService,
    public service: BienBanDNService,
    private sanitizer: DomSanitizer,
    public CommonService: CommonService,
    private confirmationDialogService: ConfirmationDialogService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.allowApprove.next(auth.isSysAdmin() || auth.checkPermission('YCDN-DUYETTTDN'));
    this.allowSign.next(auth.isSysAdmin() || auth.checkPermission('YCDN-KYTTDN'));
    this.reloadForm = new EventEmitter<boolean>();
    this.EMPTY = {
      position: undefined,
      signPage: 1,
    }
  }

  isLoadingForm$ = new BehaviorSubject<boolean>(false);

  srcCV: string;
  safeSrcCV: SafeResourceUrl;

  srcBBDN: string;
  safeSrcBBDN: SafeResourceUrl;

  tabs = {
    CongVan: 1,
    BienBanKhaoSat: 3,
    TaiLieuKhac: 4,
    YKienPhanHoi: 5,
    DuThaoThoaThuan: 6,
    HoSoKemTheo: 7
  };

  activeTabId = this.tabs.CongVan; // 0 => Basic info;
  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnInit() {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    this.isLoadingForm$.next(true);
    if (this.congVanYeuCau.MaYeuCau !== undefined) {
      this.getPDF(this.congVanYeuCau.Data, "CVYC");
      this.loadData();
    }
  }

  loadData() {
    this.isLoadingForm$.next(true);
    const sb = this.service.getItem(this.congVanYeuCau.ID).pipe(
      first(),
      catchError((errorMessage) => {
        return of(this.bienBanDNData);
      }),
      finalize(() => {
        this.isLoadingForm$.next(false);
      })
    ).subscribe((result: BienBanDNData) => {
      if (result) {
        this.bienBanDNData = result;
        this.congVanYeuCau = result.CongVanYeuCau;
        this.getPDF(result.BienBanDN.Data, "BBDN");
        this.isLoadingForm$.next(true);
        setTimeout(() => {
          this.isLoadingForm$.next(false);
        }, 2000);
      }
    });
  }

  getPDF(path: string, key: string): any {
    this.CommonService.getPDF(path).subscribe((response) => {
      var binary_string = window.atob(response);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      let file = new Blob([bytes.buffer], { type: 'application/pdf' });
      var src = URL.createObjectURL(file);

      if (key === "CVYC") this.srcCV = src;
      if (key === "BBDN") this.srcBBDN = src;

      var safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
      if (key === "CVYC") this.safeSrcCV = safeSrc;
      if (key === "BBDN") this.safeSrcBBDN = safeSrc;
    });
  }

  getUrl(key: string) {
    if (key === "CVYC") return this.sanitizer.bypassSecurityTrustResourceUrl(this.srcCV);
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.srcBBDN);
  }

  upload() {
    const modalRef = this.modalService.open(UploadDuThaoDNComponent, { size: 'lg' });
    modalRef.componentInstance.bienBanDN = this.bienBanDNData.BienBanDN;
    modalRef.result.then(
      () => {
        this.submited.next(false);
        this.isLoadingForm$.next(true);
        this.loadData();
        this.isLoadingForm$.next(false);
      }
    );
  }

  submited = new BehaviorSubject<boolean>(false);

  hoanThanh() {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn gửi yêu cầu?')
      .then((confirmed) => {
        if (confirmed) {

          this.approveModel = Object.assign(new ApproveModel(), this.EMPTY);
          this.approveModel.id = this.bienBanDNData.BienBanDN.ID;
          this.submited.next(true);
          const sbSign = this.service.complete(this.approveModel).pipe(
            catchError((errorMessage) => {
              this.submited.next(false);
              this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
              return of(this.bienBanDNData.BienBanDN);
            }), finalize(() => {
              this.isLoadingForm$.next(true);
              this.reloadForm.emit(true);
              this.isLoadingForm$.next(false);
            })).subscribe((res) => {
              this.submited.next(false);
              if (res.success) {
                this.toastr.success("Đã gửi yêu cầu", "Thành công");
              }
              else
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
            });
          this.subscriptions.push(sbSign);
        }
      });
  }

  confirm() {
    this.confirmationDialogService.confirm('Thông báo', 'Khách hàng đã ký, xác nhận dự thảo thỏa thuận đấu nối?')
      .then((confirmed) => {
        if (confirmed) {
          this.submited.next(true);          
          const sbSign = this.service.confirm(this.bienBanDNData.BienBanDN).pipe(
            catchError((errorMessage) => {
              this.submited.next(false);
              this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
              return of(this.bienBanDNData.BienBanDN);
            }), finalize(() => {
              this.isLoadingForm$.next(true);
              this.reloadForm.emit(true);
              this.isLoadingForm$.next(false);
            })).subscribe((res) => {
              this.submited.next(false);
              if (res.success) {
                this.toastr.success("Thực hiện thành công", "Thành công");
              }
              else
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
            });
          this.subscriptions.push(sbSign);
        }
      });
  }

  approve() {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn duyệt dự thảo thỏa thuận đấu nối?')
      .then((confirmed) => {
        if (confirmed) {
          this.submited.next(true);
          const modalRef = this.modalService.open(ApproveDuThaoComponent, { size: 'xl' });
          modalRef.componentInstance.bienBanDN = this.bienBanDNData.BienBanDN;
          modalRef.result.then(
            () => {
              this.submited.next(false);
              this.isLoadingForm$.next(true);
              this.loadData();
              this.isLoadingForm$.next(false);
            }
          );
        }
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  private subscriptions: Subscription[] = [];
}
