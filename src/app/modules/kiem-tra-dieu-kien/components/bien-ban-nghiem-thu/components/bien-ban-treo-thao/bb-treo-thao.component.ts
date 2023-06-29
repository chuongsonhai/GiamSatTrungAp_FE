import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { CommonService } from 'src/app/modules/services/base.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { ApproveModel, CancelModel, SignBienBanTT } from 'src/app/modules/models/bienbanks.model';
import { BienBanTT, BienBanTTData } from 'src/app/modules/models/bienbantt.model';
import { BienBanTTService } from 'src/app/modules/services/bienbantt.service';
import { BienBanTreoThaoComponent } from '../../../treo-thao-cong-to/componets/bien-ban-treo-thao/bien-ban-treo-thao.component';
import { CancelBusinessComponent } from 'src/app/modules/share-component/cancel-business/cancel-business.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-bb-treo-thao',
  templateUrl: './bb-treo-thao.component.html',
  styleUrls: ['./bb-treo-thao.component.scss']
})
export class BBTreoThaoComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: YeuCauNghiemThu;
  @Output() public reloadForm: EventEmitter<boolean>;

  EMPTY: any;

  allowCancel = new BehaviorSubject<boolean>(false);
  allowApprove = new BehaviorSubject<boolean>(false);

  constructor(
    private auth: AuthenticationService,
    public commonService: CommonService,
    public service: BienBanTTService,
    private confirmationDialogService: ConfirmationDialogService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService) {

    this.allowCancel.next(auth.isSysAdmin() || auth.checkPermission('YCNT-HUYKQTT'));
    this.allowApprove.next(auth.isSysAdmin() || auth.checkPermission('YCNT-DUYETBBTT'));
    this.reloadForm = new EventEmitter<boolean>();
    this.EMPTY = {
      deptId: 0,
      staffCode: '',
      ngayHen: '',
      noiDung: '',
      maCViec: ''
    }
  }

  tabs = {
    KetQuaTC: 1,
    BienBanTT: 2
  };

  activeTabId = this.tabs.KetQuaTC;

  BienBanTTData: BienBanTTData;

  src: string;
  safeSrc: SafeResourceUrl;

  isLoadingForm$ = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    if (this.congVanYeuCau.MaYeuCau !== undefined) {
      this.isLoadingForm$.next(true);
      if (this.congVanYeuCau.TrangThai === 8)
        this.activeTabId = this.tabs.BienBanTT;
      this.loadData();
      setTimeout(() => {
        this.isLoadingForm$.next(false);
      }, 2000);
    }
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  loadData() {
    this.isLoadingForm$.next(true);
    const sb = this.service.getItem(this.congVanYeuCau.ID).pipe(
      first(),
      catchError((errorMessage) => {
        this.isLoadingForm$.next(false);
        return of(this.BienBanTTData);
      }),
    ).subscribe((result) => {
      if (result) {
        this.isLoadingForm$.next(false);
        this.BienBanTTData = result;
        if (this.BienBanTTData.BienBanTT.ID > 0) {
          this.isLoadingForm$.next(true);
          this.safeSrc = null;
          this.loadPdf();
        }
      }
    });
  }

  loadPdf() {
    this.isLoadingForm$.next(true);
    const sb = this.service.getPdf(this.congVanYeuCau.ID).pipe(
      first(),
      catchError((errorMessage) => {
        return of(this.BienBanTTData);
      })
    ).subscribe(response => {
      if (response === undefined) {
        this.isLoadingForm$.next(false);
        this.safeSrc = null;
      } else {
        var binary_string = window.atob(response);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        let file = new Blob([bytes.buffer], { type: 'application/pdf' });
        var src = URL.createObjectURL(file);
        var safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(src);
        this.src = src;
        this.safeSrc = safeSrc;
        this.isLoadingForm$.next(false);
      }
    });
    this.subscriptions.push(sb);
  }

  getUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }

  approveModel: ApproveModel;
  submited = new BehaviorSubject<boolean>(false);

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
          this.confirmationDialogService.confirm('Thông báo', 'Sau khi hủy cần thực hiện lại biên bản treo tháo, bạn có muốn hủy?')
            .then((confirmed) => {
              if (confirmed) {
                this.submited.next(true);
                const sbSign = this.service.huyKetQua(this.cancelModel).pipe(
                  tap(() => {
                    this.isLoadingForm$.next(true);
                    this.loadData();
                    this.changeTab(this.tabs.KetQuaTC);
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
                    this.toastr.success("Đã hủy kết quả thi công, treo tháo", "Thành công");
                  }
                  else
                    this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                });
              }
            });
        }
      });
  }

  approve() {
    this.approveModel = Object.assign(new ApproveModel(), this.EMPTY);
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn xác nhận biên bản treo tháo?')
      .then((confirmed) => {
        if (confirmed) {
          this.submited.next(true);
          this.isLoadingForm$.next(true);
          this.approveModel.id = this.BienBanTTData.BienBanTT.ID;
          const sbSign = this.service.approve(this.approveModel).pipe(
            catchError((errorMessage) => {
              this.submited.next(false);
              this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
              return of(this.BienBanTTData);
            }),
            finalize(() => {
              this.isLoadingForm$.next(false);
              this.loadData();
            })
          ).subscribe((res) => {
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

  signBienBanTT: SignBienBanTT;
  signNVien(nvtt: boolean){
    this.signBienBanTT = Object.assign(new SignBienBanTT(), this.EMPTY);
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn ký xác nhận biên bản treo tháo?')
      .then((confirmed) => {
        if (confirmed) {
          this.submited.next(true);
          this.isLoadingForm$.next(true);
          this.signBienBanTT.id = this.BienBanTTData.BienBanTT.ID;
          this.signBienBanTT.SignTT = nvtt;
          const sbSign = this.service.signNVien(this.signBienBanTT).pipe(
            catchError((errorMessage) => {
              this.submited.next(false);
              this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
              return of(this.BienBanTTData);
            }),
            finalize(() => {
              this.isLoadingForm$.next(false);
              this.loadData();
            })
          ).subscribe((res) => {
            this.submited.next(false);
            if (res.success) {
              this.toastr.success("Thực hiện thành công", "Thành công");
            }
            else
              this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
          });
        }
      });
  }
  public reloadData(reload: boolean) {
    if (reload)
      this.loadData();
  }

  create() {
    const modalRef = this.modalService.open(BienBanTreoThaoComponent, { size: 'xl' });
    modalRef.componentInstance.congVanYeuCau = this.congVanYeuCau;
    modalRef.componentInstance.bienbantreothao = this.BienBanTTData.BienBanTT;
    modalRef.componentInstance.reloadData.subscribe(($event) => {
      console.log($event);
    })
    modalRef.result.then(
      () => {
        this.isLoadingForm$.next(true);
        this.reloadForm.emit(true);
        this.loadData();
        this.isLoadingForm$.next(false);
      }
    );
  }

  private subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
