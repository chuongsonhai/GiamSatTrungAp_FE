import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import * as _moment from 'moment';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KetQuaKSService } from 'src/app/modules/services/ketquaks.service';
import { CommonService } from 'src/app/modules/services/common.service';
import { CauHinhCViec, CongVanYeuCau, KetQuaKS } from 'src/app/modules/models/base.model';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { Options } from 'select2';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';
import { MetadataService } from 'src/app/modules/services/metadata.service';
import { TienTrinhData } from 'src/app/modules/models/tientrinhdata.model';

@Component({
  selector: 'app-ket-qua-khao-sat',
  templateUrl: './ket-qua-khao-sat.component.html',
  styleUrls: ['./ket-qua-khao-sat.component.scss']
})
export class KetQuaKSComponent implements OnInit, OnDestroy {
  @Input() KetQuaKS: KetQuaKS;
  @Output() public reloadYCau: EventEmitter<boolean>;

  EMPTY: any;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  public options: Options;
  public optionsNV: Options;
  startDate = new Date();

  constructor(
    public service: KetQuaKSService,
    public metadataService: MetadataService,
    public commonService: CommonService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.reloadYCau = new EventEmitter<boolean>();
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

      NGAY_HEN: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      NGAY_BDAU: undefined,
      NGAY_KTHUC: undefined,

      MA_CVIEC_TRUOC: undefined,
      MA_CVIEC: '',
      MA_LOAI_YCAU: undefined,
      NGUYEN_NHAN: undefined,

      TRANG_THAI: 0,
      THUAN_LOI: 1
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

  tienTrinhData: TienTrinhData;
  congViecs: CauHinhCViec[];

  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 2000);
    if (this.KetQuaKS !== undefined) {
      this.loadData();
    }
  }

  loadData() {
    this.isLoadingForm$.next(true);
    this.tienTrinhData = Object.assign(new TienTrinhData(), this.EMPTY);

    this.loadForm();
    this.KetQuaKS.MA_CVIEC_TRUOC = "KS";
    const sb = this.metadataService.getCongViecs(this.KetQuaKS.MA_YCAU_KNAI, this.KetQuaKS.MA_CVIEC_TRUOC).pipe(
      catchError((errorMessage) => {
        this.isLoadingForm$.next(false);
        return of(this.tienTrinhData);
      }), finalize(() => {
        this.loadForm();
      })
    ).subscribe(res => {
      if (res.success) {
        this.tienTrinhData = res.data;
        var renhanh = this.KetQuaKS.THUAN_LOI === 0;
        this.congViecs = this.tienTrinhData.congViecs.filter(p => p.CoReNhanh === renhanh);
        if (this.congViecs.length === 0)
          this.congViecs = this.tienTrinhData.congViecs;
        this.KetQuaKS.MA_BPHAN_NHAN = this.tienTrinhData.deptId;
        this.KetQuaKS.MA_NVIEN_NHAN = this.tienTrinhData.staffCode;
        if (!this.KetQuaKS.MA_CVIEC || this.KetQuaKS.MA_CVIEC === undefined)
          this.KetQuaKS.MA_CVIEC = this.congViecs[0].MaCViecTiep;
        this.loadStaffs(this.tienTrinhData.deptId);
        this.showTroNgais(this.KetQuaKS.THUAN_LOI == 1 ? "1" : "0");
        this.isLoadingForm$.next(false);
      }
    });

    const example = merge(
      this.commonService.getTroNgais()
    );

    const subscribe = example.pipe(
      catchError(err => {
        return of(undefined);
      })).subscribe();
    this.subscriptions.push(subscribe);
    this.subscriptions.push(sb);
  }

  loadForm() {
    try {
      this.formGroup = this.fb.group({
        MA_YCAU_KNAI: [this.KetQuaKS.MA_YCAU_KNAI],
        MA_LOAI_YCAU: [this.KetQuaKS.MA_LOAI_YCAU],
        NDUNG_XLY: [this.KetQuaKS.NDUNG_XLY],
        MA_TNGAI: [this.KetQuaKS.MA_TNGAI],

        MA_BPHAN_NHAN: [this.KetQuaKS.MA_BPHAN_NHAN, Validators.required],
        MA_NVIEN_NHAN: [this.KetQuaKS.MA_NVIEN_NHAN],

        NGAY_HEN: [this.KetQuaKS.NGAY_HEN, Validators.required],
        NGAY_BDAU: [this.KetQuaKS.NGAY_BDAU],
        NGAY_KTHUC: [this.KetQuaKS.NGAY_KTHUC],
        MA_CVIEC_TRUOC: [this.KetQuaKS.MA_CVIEC_TRUOC],
        MA_CVIEC: [this.KetQuaKS.MA_CVIEC, Validators.required],
        NGUYEN_NHAN: [this.KetQuaKS.NGUYEN_NHAN],

        TRANG_THAI: [this.KetQuaKS.TRANG_THAI],
        THUAN_LOI: [this.KetQuaKS.THUAN_LOI]
      });
    }
    catch (error) {

    }
  }  

  loadCViecs(maTNgai: string) {
    if (maTNgai && maTNgai !== undefined) {
      const sb = this.metadataService.getTNgaiCViecs(this.KetQuaKS.MA_CVIEC_TRUOC, maTNgai).pipe(
        catchError((errorMessage) => {
          return of(undefined);
        })
      ).subscribe(res => {
        if (res.success) {
          this.congViecs = res.data;
          this.KetQuaKS.MA_CVIEC = this.congViecs[0].MaCViecTiep;
          this.loadForm();
        }
      });
    }
  }

  loadStaffs(deptId: string) {
    if (deptId && deptId !== undefined) {
      const sb = this.commonService.getNhanViens(this.KetQuaKS.MA_DVIQLY, deptId).pipe(
        catchError((errorMessage) => {
          return of(this.tienTrinhData);
        }), finalize(() => {
          this.loadForm();
          this.isLoadingForm$.next(false);
        })
      ).subscribe(res => {
        if (res.success) {
          this.tienTrinhData.nhanViens = res.data;
        }
      });
    }
  }

  showTroNgais(thuanLoi: string) {
    this.hasTroNgai = thuanLoi === "0";
    if (!this.hasTroNgai) {
      this.congViecs = this.tienTrinhData.congViecs.filter(p => !p.CoReNhanh);
      this.KetQuaKS.MA_TNGAI = '';
    }
    else
      this.congViecs = this.tienTrinhData.congViecs.filter(p => p.CoReNhanh);
    this.KetQuaKS.THUAN_LOI = thuanLoi == "0" ? 0 : 1;
    if (this.congViecs.length > 0)
      this.KetQuaKS.MA_CVIEC = this.congViecs[0].MaCViecTiep;
    this.loadForm();
  }

  hasTroNgai: boolean = false;

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
