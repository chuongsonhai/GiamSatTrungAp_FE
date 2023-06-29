import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, merge, of, Subscription } from 'rxjs';
import { CongVanYeuCau } from 'src/app/modules/models/congvanyeucau.model';
import { CommonService } from 'src/app/modules/services/common.service';
import { BienBanDNService } from 'src/app/modules/services/bienbandn.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { ThoaThuanDauNoi } from 'src/app/modules/models/thoathuandaunoi.model';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { ChuyenTiep } from 'src/app/modules/models/chuyentiep.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import { Options } from 'select2';
import { MetadataService } from 'src/app/modules/services/metadata.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hoan-thanh',
  templateUrl: './hoan-thanh.component.html',
  styleUrls: ['./hoan-thanh.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})
export class HoanThanhComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: CongVanYeuCau;

  thoaThuanDauNoi: ThoaThuanDauNoi;
  EMPTY: any;

  constructor(
    public service: BienBanDNService,
    private confirmationDialogService: ConfirmationDialogService,
    public commonService: CommonService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private toastr: ToastrService) {
    this.EMPTY = {
      ID: 0,
      MA_DVIQLY: undefined,
      NDUNG_XLY: undefined,

      MA_BPHAN_NHAN: '',
      MA_NVIEN_NHAN: '',

      NGAY_HEN: undefined,
      MA_CVIEC: '',
      TRANG_THAI: 0,
    }
  }

  tabs = {
    DuThaoThoaThuan: 1,
    ChuyenTiep: 2
  };

  activeTabId = this.tabs.DuThaoThoaThuan; // 0 => Basic info;

  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  srcCV: string;
  safeSrcCV: SafeResourceUrl;

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnInit() {
    this.loadForm();
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    this.isLoadingForm$.next(true);
    if (this.congVanYeuCau.MaYeuCau !== undefined) {
      const example = merge(
        this.commonService.getDonVis(),
      );
      const subscribe = example.pipe(
        catchError(err => {
          return of(undefined);
        }),
        finalize(() => {
          this.loadData();
          this.isLoadingForm$.next(false);
        })).subscribe();

    }
  }

  loadData() {
    this.isLoadingForm$.next(true);
    const sb = this.service.getItem(this.congVanYeuCau.ID).pipe(
      first(),
      catchError((errorMessage) => {
        return of(this.thoaThuanDauNoi);
      }),
      finalize(() => {
        this.isLoadingForm$.next(false);
      })
    ).subscribe((result: ThoaThuanDauNoi) => {
      if (result) {
        this.isLoadingForm$.next(true);
        this.thoaThuanDauNoi = result;
        this.congVanYeuCau = result.CongVanYeuCau;
        this.loadForm();
        this.getPDF(result.BienBanDN.Data);
        setTimeout(() => {
          this.isLoadingForm$.next(false);
        }, 2000);
      }
    });
  }

  getPDF(path: string): any {
    this.commonService.getPDF(path).subscribe((response) => {
      var binary_string = window.atob(response);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      let file = new Blob([bytes.buffer], { type: 'application/pdf' });
      var src = URL.createObjectURL(file);

      this.srcCV = src;
      var safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
      this.safeSrcCV = safeSrc;
    });
  }

  getUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.srcCV);
  }

  formGroup: FormGroup;
  loadForm() {
    try {
      this.formGroup = this.fb.group({
        MA_DVIQLY: [this.congVanYeuCau.MaDViQLy]
      });
    }
    catch (error) {

    }
  }

  submited = new BehaviorSubject<boolean>(false);

  chuyenYCau() {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn chuyển yêu cầu cho đơn vị xử lý tiếp?')
      .then((confirmed) => {
        if (confirmed) {
          this.submited.next(true);
          this.formGroup.markAllAsTouched();
          const formValues = this.formGroup.value;
          let maDViTNhan = formValues["MA_DVIQLY"];
          const sb = this.service.chuyentiep(this.congVanYeuCau.MaYeuCau, maDViTNhan).pipe(
            tap(() => {
              this.isLoadingForm$.next(true);
              this.loadData();
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
              this.toastr.success("Đã chuyển tiếp cho đơn vị", "Thành công");
            }
            else
              this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
          });
          this.subscriptions.push(sb);
        }
      });
  }

  private subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
