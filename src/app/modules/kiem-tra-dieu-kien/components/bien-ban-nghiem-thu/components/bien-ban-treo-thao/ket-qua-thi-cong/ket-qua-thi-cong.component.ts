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
import { KetQuaTCService } from 'src/app/modules/services/ketquatc.service';
import { KetQuaTC } from 'src/app/modules/models/ketquatc.model';
import { MetadataService } from 'src/app/modules/services/metadata.service';
import { TienTrinhData } from 'src/app/modules/models/tientrinhdata.model';
import { CauHinhCViec } from 'src/app/modules/models/base.model';
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';

@Component({
  selector: 'app-ket-qua-thi-cong',
  templateUrl: './ket-qua-thi-cong.component.html',
  styleUrls: ['./ket-qua-thi-cong.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})

export class KetQuaTCComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: YeuCauNghiemThu;
  @Output() public reloadData: EventEmitter<boolean>;

  EMPTY: any;
  KetQuaTC: KetQuaTC;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    public service: KetQuaTCService,
    public metadataService: MetadataService,
    public commonService: CommonService,
    private confirmationDialogService: ConfirmationDialogService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {

    this.reloadData = new EventEmitter<boolean>();
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
      THUAN_LOI: 1
    }
  }
  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 2000);
    if (this.congVanYeuCau.MaYeuCau) {
      this.loadData();
    }
  }

  tienTrinhData: TienTrinhData;
  congViecs: CauHinhCViec[];

  submited = new BehaviorSubject<boolean>(false);

  loadData() {
    this.isLoadingForm$.next(true);
    this.tienTrinhData = Object.assign(new TienTrinhData(), this.EMPTY);
    this.KetQuaTC = Object.assign(new KetQuaTC(), this.EMPTY);
    this.loadForm();
    const sb = this.service.getItem(this.congVanYeuCau.MaYeuCau).pipe(
      first(),
      catchError((errorMessage) => {
        this.isLoadingForm$.next(false);
        return of(this.KetQuaTC);
      }),
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((result: KetQuaTC) => {
      if (result) {
        this.KetQuaTC = result;
        this.KetQuaTC.MA_CVIEC_TRUOC = "TC";
        const sb = this.metadataService.getCongViecs(this.KetQuaTC.MA_YCAU_KNAI, this.KetQuaTC.MA_CVIEC_TRUOC).pipe(
          catchError((errorMessage) => {
            return of(this.tienTrinhData);
          }), finalize(() => {
            this.loadForm();
            this.isLoadingForm$.next(false);
          })
        ).subscribe(res => {
          if (res.success) {
            this.tienTrinhData = res.data;
            var renhanh = this.KetQuaTC.THUAN_LOI === 0;
            this.congViecs = this.tienTrinhData.congViecs.filter(p => p.CoReNhanh === renhanh);
            if (this.congViecs.length === 0)
              this.congViecs = this.tienTrinhData.congViecs;
            this.KetQuaTC.MA_BPHAN_NHAN = this.tienTrinhData.deptId;
            this.KetQuaTC.MA_NVIEN_NHAN = this.tienTrinhData.staffCode;
            if (!this.KetQuaTC.MA_CVIEC || this.KetQuaTC.MA_CVIEC === undefined)
              this.KetQuaTC.MA_CVIEC = this.congViecs[0].MaCViecTiep;
            this.loadStaffs(this.tienTrinhData.deptId);
            this.showTroNgais(this.KetQuaTC.THUAN_LOI == 1 ? "1" : "0");
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
    });
  }

  loadCViecs(maTNgai: string) {
    if (maTNgai && maTNgai !== undefined) {
      const sb = this.metadataService.getTNgaiCViecs(this.KetQuaTC.MA_CVIEC_TRUOC, maTNgai).pipe(
        catchError((errorMessage) => {
          return of(undefined);
        })
      ).subscribe(res => {
        if (res.success) {
          this.congViecs = res.data;
        }
      });
    }
  }

  showTroNgais(thuanLoi: string) {
    this.hasTroNgai = thuanLoi === "0";
    if (!this.hasTroNgai) {
      this.congViecs = this.tienTrinhData.congViecs.filter(p => !p.CoReNhanh);
      this.KetQuaTC.MA_TNGAI = '';
    }
    else
      this.congViecs = this.tienTrinhData.congViecs.filter(p => p.CoReNhanh);
    this.KetQuaTC.THUAN_LOI = thuanLoi == "0" ? 0 : 1;
    if (this.congViecs.length > 0)
      this.KetQuaTC.MA_CVIEC = this.congViecs[0].MaCViecTiep;
    this.loadForm();
  }

  hasTroNgai: boolean = false;

  loadForm() {
    try {
      this.formGroup = this.fb.group({
        MA_YCAU_KNAI: [this.KetQuaTC.MA_YCAU_KNAI],
        MA_LOAI_YCAU: [this.KetQuaTC.MA_LOAI_YCAU],
        NDUNG_XLY: [this.KetQuaTC.NDUNG_XLY],

        MA_BPHAN_NHAN: [this.KetQuaTC.MA_BPHAN_NHAN, Validators.required],
        MA_NVIEN_NHAN: [this.KetQuaTC.MA_NVIEN_NHAN, Validators.required],

        NGAY_HEN: [this.KetQuaTC.NGAY_HEN, Validators.required],
        NGAY_BDAU: [this.KetQuaTC.NGAY_BDAU],
        NGAY_KTHUC: [this.KetQuaTC.NGAY_KTHUC],
        MA_CVIEC_TRUOC: [this.KetQuaTC.MA_CVIEC_TRUOC],
        MA_CVIEC: [this.KetQuaTC.MA_CVIEC, Validators.required],

        TRANG_THAI: [this.KetQuaTC.TRANG_THAI],
        THUAN_LOI: [this.KetQuaTC.THUAN_LOI]
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
          this.KetQuaTC = Object.assign(this.KetQuaTC, formValues);
          this.KetQuaTC.TRANG_THAI = 0;
          if (this.KetQuaTC.ID > 0) {
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
          this.KetQuaTC = Object.assign(this.KetQuaTC, formValues);
          this.KetQuaTC.TRANG_THAI = 1;
          if (this.KetQuaTC.ID > 0) {
            this.edit();
          }
          else {
            this.create();
          }
        }
      });
  }

  edit() {
    const sbUpdate = this.service.update(this.KetQuaTC).pipe(
      catchError((errorMessage) => {
        this.submited.next(false);
        this.loadData();
        this.isLoadingForm$.next(false);
        this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
        return of(this.KetQuaTC);
      }),
    ).subscribe(res => {
      this.submited.next(false);
      this.reloadData.emit(true);
      this.isLoadingForm$.next(false);
      if (res !== null && res !== undefined) {
        this.KetQuaTC = res;
        this.toastr.success("Gửi yêu cầu thành công", "Thông báo");
      }
      else
        this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.service.create(this.KetQuaTC).pipe(
      catchError((errorMessage) => {
        this.submited.next(false);
        this.loadData();
        this.isLoadingForm$.next(false);
        this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
        return of(this.KetQuaTC);
      }),
    ).subscribe((res: KetQuaTC) => {
      this.submited.next(false);
      this.reloadData.emit(true);
      this.isLoadingForm$.next(false);
      if (res !== null && res !== undefined) {
        this.KetQuaTC = res;
        this.toastr.success("Gửi yêu cầu thành công", "Thông báo");
      }
      else
        this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
    });
    this.subscriptions.push(sbCreate);
  }

  loadStaffs(deptId: string) {
    if (deptId && deptId !== undefined) {
      const sb = this.commonService.getNhanViens(this.KetQuaTC.MA_DVIQLY, deptId).pipe(
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