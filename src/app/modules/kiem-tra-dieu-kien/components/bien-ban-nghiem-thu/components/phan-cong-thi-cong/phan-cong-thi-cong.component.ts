import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/modules/services/common.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { Options } from 'select2';
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { PhanCongTCService } from 'src/app/modules/services/phancongtc.service';
import { PhanCongTC } from 'src/app/modules/models/phancongtc.model';
import { MetadataService } from 'src/app/modules/services/metadata.service';
import { TienTrinhData } from 'src/app/modules/models/tientrinhdata.model';
import { CauHinhCViec } from 'src/app/modules/models/base.model';
import { ResponseModel } from 'src/app/modules/models/response.model';

@Component({
  selector: 'app-phan-cong-thi-cong',
  templateUrl: './phan-cong-thi-cong.component.html',
  styleUrls: ['./phan-cong-thi-cong.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe

  ]
})
export class PhanCongTCComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: YeuCauNghiemThu;

  public options: Options;
  public optionsNV: Options;
  EMPTY: any;
  PhanCongTC: PhanCongTC;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    public service: PhanCongTCService,
    public metadataService: MetadataService,
    public commonService: CommonService,
    private confirmationDialogService: ConfirmationDialogService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.EMPTY = {
      ID: 0,
      MA_DVIQLY: undefined,
      MA_YCAU_KNAI: undefined,
      MA_DDO_DDIEN: undefined,
      NDUNG_XLY: undefined,
      MA_TNGAI: '',
      MA_BPHAN_GIAO: undefined,
      MA_NVIEN_GIAO: undefined,

      MA_BPHAN_NHAN: '',
      MA_NVIEN_NHAN: '',

      NGAY_HEN: undefined,
      NGAY_BDAU: undefined,
      NGAY_KTHUC: undefined,

      MA_CVIEC_TRUOC: undefined,
      MA_CVIEC: '',
      MA_LOAI_YCAU: undefined,

      TRANG_THAI: 0,
      LOAI: 1
    }

    this.options = {
      placeholder: "--- Bộ phận tiếp nhận ---",
      allowClear: true,
      width: "100%",
    };
    this.optionsNV = {
      placeholder: "--- Nhân viên tiếp nhận ---",
      allowClear: true,
      width: "100%",
    };
  }
  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    if (this.congVanYeuCau && this.congVanYeuCau.ID > 0) {
      this.loadData();
    }
  }

  tienTrinhData: TienTrinhData;
  congViecs: CauHinhCViec[];

  submited = new BehaviorSubject<boolean>(false);

  loadData() {
    this.isLoadingForm$.next(true);
    this.PhanCongTC = Object.assign(new PhanCongTC(), this.EMPTY);
    this.loadForm();
    const sb = this.service.getData(this.congVanYeuCau.MaYeuCau, 1).pipe(
      first(),
      catchError((errorMessage) => {
        return of(this.PhanCongTC);
      })
    ).subscribe((PhanCongTC: PhanCongTC) => {
      if (PhanCongTC) {
        this.PhanCongTC = PhanCongTC;
        this.PhanCongTC.MA_CVIEC_TRUOC = 'PC';
        const sb = this.metadataService.getCongViecs(this.congVanYeuCau.MaYeuCau, this.PhanCongTC.MA_CVIEC_TRUOC).pipe(
          catchError((errorMessage) => {
            return of(this.tienTrinhData);
          }), finalize(() => {
            this.isLoadingForm$.next(false);
          })
        ).subscribe(res => {
          if (res.success) {
            this.tienTrinhData = res.data;
            this.congViecs = this.tienTrinhData.congViecs;
            this.PhanCongTC.MA_BPHAN_NHAN = this.tienTrinhData.deptId;
            this.PhanCongTC.MA_NVIEN_NHAN = this.tienTrinhData.staffCode;
            // this.PhanCongTC.MA_NVIEN_KS = this.tienTrinhData.staffCode;   
            if (!this.PhanCongTC.MA_CVIEC || this.PhanCongTC.MA_CVIEC === undefined)
              this.PhanCongTC.MA_CVIEC = this.tienTrinhData.maCViec;
            this.loadStaffs(this.tienTrinhData.deptId);
          }
        });
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    try {
      this.formGroup = this.fb.group({
        MA_YCAU_KNAI: [this.PhanCongTC.MA_YCAU_KNAI],
        MA_LOAI_YCAU: [this.PhanCongTC.MA_LOAI_YCAU],
        NDUNG_XLY: [this.PhanCongTC.NDUNG_XLY, Validators.required],

        MA_BPHAN_NHAN: [this.PhanCongTC.MA_BPHAN_NHAN, Validators.required],
        MA_NVIEN_NHAN: [this.PhanCongTC.MA_NVIEN_NHAN, Validators.required],

        MA_NVIEN_KS: [this.PhanCongTC.MA_NVIEN_KS, Validators.required],

        NGAY_HEN: [this.PhanCongTC.NGAY_HEN, Validators.required],
        NGAY_BDAU: [this.PhanCongTC.NGAY_BDAU],
        NGAY_KTHUC: [this.PhanCongTC.NGAY_KTHUC],
        MA_CVIEC_TRUOC: [this.PhanCongTC.MA_CVIEC_TRUOC],
        MA_CVIEC: [this.PhanCongTC.MA_CVIEC, Validators.required],

        TRANG_THAI: [this.PhanCongTC.TRANG_THAI]
      });
    }
    catch (error) {

    }
  }

  saveDraft() {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn lưu kết quả thi công?')
      .then((confirmed) => {
        if (confirmed) {
          this.submited.next(true);
          this.formGroup.markAllAsTouched();
          const formValues = this.formGroup.value;
          this.PhanCongTC = Object.assign(this.PhanCongTC, formValues);
          this.PhanCongTC.TRANG_THAI = 0;
          if (this.PhanCongTC.ID > 0) {
            this.edit();
          }
          else {
            this.create();
          }
        }
      });
  }

  save() {
    this.confirmationDialogService.confirm('Thông báo', 'Dữ liệu sẽ không được sửa đổi sau khi lưu, bạn muốn lưu kết quả thi công?')
      .then((confirmed) => {
        if (confirmed) {
          this.submited.next(true);
          this.formGroup.markAllAsTouched();
          const formValues = this.formGroup.value;
          this.PhanCongTC = Object.assign(this.PhanCongTC, formValues);
          this.PhanCongTC.TRANG_THAI = 1;
          if (this.PhanCongTC.ID > 0) {
            this.edit();
          }
          else {
            this.create();
          }
        }
      });
  }

  
  cancel() {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn phân công lại?')
      .then((confirmed) => {
        if (confirmed) {
          this.submited.next(true);
          this.isLoadingForm$.next(true);
          const sbUpdate = this.service.phanCongLai(this.PhanCongTC).pipe(
            tap(() => {
              this.loadData();
            }),
            catchError((errorMessage) => {
              this.submited.next(false);
              this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
              return of(this.PhanCongTC);
            }),
            finalize(() => {
             
              this.isLoadingForm$.next(false);
            })).subscribe((res: ResponseModel) => {
              this.submited.next(false);
              if (res.success) {
                this.toastr.success("Thực hiện thành công", "Thông báo");
              }
              else
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
            });
          this.subscriptions.push(sbUpdate);
        }
      });
  }

  edit() {
    const sbUpdate = this.service.update(this.PhanCongTC).pipe(
      tap(() => {
        this.submited.next(false);
        this.PhanCongTC = Object.assign(new PhanCongTC(), this.EMPTY);
      }),
      catchError((errorMessage) => {
        return of(this.PhanCongTC);
      }),
    ).subscribe(res => {
      if (res !== null && res !== undefined) {
        this.PhanCongTC = res;
        this.toastr.success("Gửi yêu cầu thành công", "Thông báo");
      }
      else
        this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.service.create(this.PhanCongTC).pipe(
      tap(() => {
        this.submited.next(false);
        this.PhanCongTC = Object.assign(new PhanCongTC(), this.EMPTY);
      }),
      catchError((errorMessage) => {
        return of(this.PhanCongTC);
      }),
    ).subscribe((res: PhanCongTC) => {
      if (res !== null && res !== undefined) {
        this.PhanCongTC = res;
        this.toastr.success("Gửi yêu cầu thành công", "Thông báo");
      }
      else
        this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
    });
    this.subscriptions.push(sbCreate);
  }
  checkSelect(ma){
    if(ma!=null){
      return this.formGroup.value.MA_NVIEN_KS==ma;
    }
  }
  loadStaffs(deptId: string) {
    if (deptId && deptId !== undefined) {
      const sb = this.commonService.getNhanViens(this.congVanYeuCau.MaDViQLy, "TT").pipe(
        catchError((errorMessage) => {
          return of(this.tienTrinhData);
        }), finalize(() => {
          this.loadForm();
          this.isLoadingForm$.next(false);
        })
      ).subscribe(res => {
        if (res.success) {
          this.tienTrinhData.nhanViens = res.data;
          if(this.PhanCongTC.MA_NVIEN_KS==null){
            this.PhanCongTC.MA_NVIEN_KS=this.tienTrinhData.nhanViens[0].MA_NVIEN;
          }
        }
      });
    }
  }

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
