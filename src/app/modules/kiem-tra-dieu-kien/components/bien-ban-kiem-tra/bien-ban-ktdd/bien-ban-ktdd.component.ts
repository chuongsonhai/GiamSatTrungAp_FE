import {
  Component, OnInit, OnDestroy, Input, Output, EventEmitter
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { CommonService } from 'src/app/modules/services/base.service';
import { BienBanKTService } from 'src/app/modules/services/bienbankt.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, interval, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap, takeWhile } from 'rxjs/operators';
import {
  ApproveModel,
  CancelModel,
  SignModel
} from 'src/app/modules/models/bienbanks.model';
import { BienBanKTData } from 'src/app/modules/models/bienbanksdata.model';
import { TaoBienBanKiemTraComponent } from '../tao-bien-ban-kiem-tra/tao-bien-ban-kiem-tra.component';
import { CancelBusinessComponent } from 'src/app/modules/share-component/cancel-business/cancel-business.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';

declare var SignHubExt: any;
declare var $: any;

@Component({
  selector: 'app-bien-ban-ktdd',
  templateUrl: './bien-ban-ktdd.component.html',
  styleUrls: ['./bien-ban-ktdd.component.scss']
})
export class BienBanKTDDComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: YeuCauNghiemThu;
  @Output() public reloadData: EventEmitter<boolean> = new EventEmitter<boolean>();

  EMPTY: any;
  BienBanKTData: BienBanKTData;
  allowCancel = new BehaviorSubject<boolean>(false);
  allowApprove = new BehaviorSubject<boolean>(false);
  allowSign = new BehaviorSubject<boolean>(false);
  txtFileBase64Sign = '';

  constructor(
    private auth: AuthenticationService,
    public commonService: CommonService,
    public service: BienBanKTService,
    private confirmationDialogService: ConfirmationDialogService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.allowCancel.next(auth.isSysAdmin() || auth.checkPermission('YCNT-HUYKQKT'));
    this.allowApprove.next(auth.isSysAdmin() || auth.checkPermission('YCNT-DUYETBBKT'));
    this.allowSign.next(auth.isSysAdmin() || auth.checkPermission('YCNT-KYBBKT'));

    this.EMPTY = {
      deptId: 0,
      staffCode: '',
      ngayHen: '',
      noiDung: '',
      maCViec: ''
    };
  }

  tabs = { KetQuaKT: 1, BienBanKT: 2 };
  src: string;
  safeSrc: SafeResourceUrl;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  activeTabId = this.tabs.KetQuaKT;
  submited = new BehaviorSubject<boolean>(false);
  cancelModel: CancelModel;
  signModel: SignModel;
  SIGN_EMPTY = { id: 0, binary_string: undefined };
  FileBase64: string;
  base64String: string;

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.isLoadingForm$.next(true);
    setTimeout(() => this.isLoadingForm$.next(false), 2000);

    if (this.congVanYeuCau?.MaYeuCau !== undefined) {
      this.loadData();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  loadData() {
    this.isLoadingForm$.next(true);
    this.BienBanKTData = Object.assign(new BienBanKTData(), this.EMPTY);

    const sb = this.service.getItem(this.congVanYeuCau.MaYeuCau).pipe(
      first(),
      catchError(() => {
        this.isLoadingForm$.next(false);
        return of(this.BienBanKTData);
      }),
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((result) => {
      if (result.success) {
        this.BienBanKTData = result.data;
        this.safeSrc = null;
        this.getPDF(this.BienBanKTData.BienBanKT.Data);
      }
    });

    this.subscriptions.push(sb);
  }

  getPDF(path: string): void {
    this.isLoadingForm$.next(true);

    this.commonService.getPDF(path).pipe(
      catchError(err => {
        this.toastr.error("Không thể tải file PDF", "Lỗi");
        return of(null);
      }),
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((response) => {
      if (!response) return;

      try {
        this.FileBase64 = response;
        const binary_string = window.atob(response);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }

        const file = new Blob([bytes.buffer], { type: 'application/pdf' });

        if (file.type === 'application/pdf') {
          const src = URL.createObjectURL(file);
          this.src = src;
          this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(src);
        } else {
          this.toastr.warning('File không đúng định dạng PDF!', 'Cảnh báo');
        }
      } catch {
        this.toastr.error('Lỗi khi xử lý file PDF', 'Lỗi');
      }
    });
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  create() {
    this.submited.next(true);
    const modalRef = this.modalService.open(TaoBienBanKiemTraComponent, { size: 'xl' });
    modalRef.componentInstance.bienBanKT = this.BienBanKTData.BienBanKT;

    modalRef.result.then(() => {
      this.submited.next(false);
      this.isLoadingForm$.next(true);
      this.toastr.success('Lập biên bản thành công', 'Thông báo');
      this.loadData();
      this.isLoadingForm$.next(false);
    });
  }

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

    modalRef.result.then(() => {
      if (this.cancelModel) {
        this.confirmationDialogService.confirm('Thông báo', 'Sau khi hủy cần thực hiện lại kiểm tra điều kiện đóng điện điểm đấu nối, bạn có muốn hủy?')
          .then((confirmed) => {
            if (confirmed) {
              const sbSign = this.service.huyKetQua(this.cancelModel).pipe(
                tap(() => {
                  this.isLoadingForm$.next(true);
                  this.reloadData.emit(true);
                  this.isLoadingForm$.next(false);
                }),
                catchError(() => {
                  this.submited.next(false);
                  this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                  return of(undefined);
                }),
              ).subscribe((res) => {
                this.submited.next(false);
                if (res.success) {
                  this.loadData();
                  this.toastr.success("Đã hủy kết quả kiểm tra", "Thành công");
                } else {
                  this.toastr.error("Có lỗi xảy ra", "Thông báo");
                }
              });
              this.subscriptions.push(sbSign);
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
          const sbSign = this.service.kiemTraLai(this.BienBanKTData.BienBanKT).pipe(
            tap(() => {
              this.isLoadingForm$.next(true);
              this.reloadData.emit(true);
              this.isLoadingForm$.next(false);
            }),
            catchError(() => {
              this.submited.next(false);
              this.toastr.error("Có lỗi xảy ra", "Thông báo");
              return of(undefined);
            }),
          ).subscribe((res) => {
            this.submited.next(false);
            if (res.success) {
              this.toastr.success("Đã hủy kết quả khảo sát", "Thành công");
            } else {
              this.toastr.error("Có lỗi xảy ra", "Thông báo");
            }
          });

          this.subscriptions.push(sbSign);
        }
      });
  }

  approve() {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn duyệt biên bản?')
      .then((confirmed) => {
        if (confirmed) {
          this.isLoadingForm$.next(true);
          this.submited.next(true);

          const approveModel = Object.assign(new ApproveModel(), this.EMPTY);
          approveModel.id = this.BienBanKTData.BienBanKT.ID;

          const sbSign = this.service.approve(approveModel).pipe(
            catchError(() => {
              this.submited.next(false);
              this.toastr.error("Có lỗi xảy ra", "Thông báo");
              return of(this.BienBanKTData);
            }),
            finalize(() => {
              this.isLoadingForm$.next(true);
              this.reloadData.emit(true);
              this.isLoadingForm$.next(false);
            })
          ).subscribe((res) => {
            this.submited.next(false);
            if (res.success) {
              this.loadData();
              this.toastr.success("Đã duyệt biên bản", "Thành công");
            } else {
              this.toastr.error("Có lỗi xảy ra", "Thông báo");
            }
          });

          this.subscriptions.push(sbSign);
        }
      });
  }

  sign() {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn gửi yêu cầu ký biên bản?')
      .then((confirmed) => {
        if (confirmed) {
          this.submited.next(true);
          this.signModel = Object.assign(new SignModel(), this.SIGN_EMPTY);
          this.signModel.id = this.BienBanKTData.BienBanKT.ID;

          const sbSign = this.service.sign(this.signModel).pipe(
            tap(() => {
              this.isLoadingForm$.next(true);
              this.loadData();
              this.reloadData.emit(true);
              this.isLoadingForm$.next(false);
            }),
            catchError(() => {
              this.submited.next(false);
              this.toastr.error("Có lỗi xảy ra", "Thông báo");
              return of(this.BienBanKTData);
            }),
          ).subscribe((res) => {
            this.submited.next(false);
            if (res.success) {
              this.toastr.success("Đã gửi yêu cầu", "Thành công");
            } else {
              this.toastr.error("Có lỗi xảy ra", "Thông báo");
            }
          });

          this.subscriptions.push(sbSign);
        }
      });
  }

  kySoNhanVien() {
    const Sign = new SignHubExt();
    Sign.initialize("NGƯỜI KIỂM TRA", this.FileBase64);

    const timer = interval(1000).pipe(takeWhile(val => val < 20)).subscribe(() => {
      const signed = $('#txtFileBase64Sign').val()?.toString();
      if (signed) {
        timer.unsubscribe();
        this.txtFileBase64Sign = signed;
        this.guiXacNhan();
      }
    });
  }

  guiXacNhan() {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn gửi yêu cầu ký biên bản?')
      .then((confirmed) => {
        if (confirmed && this.txtFileBase64Sign) {
          this.submited.next(true);
          this.signModel = Object.assign(new SignModel(), this.SIGN_EMPTY);
          this.signModel.id = this.BienBanKTData.BienBanKT.ID;
          this.signModel.binary_string = this.txtFileBase64Sign;

          const sbSign = this.service.signRemote(this.signModel).pipe(
            tap(() => {
              this.isLoadingForm$.next(true);
              this.loadData();
              this.reloadData.emit(true);
              this.isLoadingForm$.next(false);
            }),
            catchError(() => {
              this.submited.next(false);
              this.toastr.error("Có lỗi xảy ra", "Thông báo");
              return of(this.BienBanKTData);
            }),
          ).subscribe((res) => {
            this.submited.next(false);
            if (res.success) {
              this.toastr.success("Đã gửi yêu cầu", "Thành công");
            } else {
              this.toastr.error("Có lỗi xảy ra", "Thông báo");
            }
          });

          this.subscriptions.push(sbSign);
        }
      });
  }
}
