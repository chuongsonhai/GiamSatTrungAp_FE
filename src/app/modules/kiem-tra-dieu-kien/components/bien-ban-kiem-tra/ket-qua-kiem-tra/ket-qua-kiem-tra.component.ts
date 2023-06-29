import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KetQuaKTService } from 'src/app/modules/services/ketquakt.service';
import { CommonService } from 'src/app/modules/services/common.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { KetQuaKT } from 'src/app/modules/models/ketquakt.model';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { TienTrinhData } from 'src/app/modules/models/tientrinhdata.model';
import { CauHinhCViec } from 'src/app/modules/models/base.model';
import { MetadataService } from 'src/app/modules/services/metadata.service';
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';

@Component({
  selector: 'app-ket-qua-kiem-tra',
  templateUrl: './ket-qua-kiem-tra.component.html',
  styleUrls: ['./ket-qua-kiem-tra.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe

  ]
})
export class KetQuaKTComponent implements OnInit, OnDestroy {
  @Input() KetQuaKT: KetQuaKT;
  @Output() public reloadData: EventEmitter<boolean>;

  EMPTY: any;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    public service: KetQuaKTService,
    public metadataService: MetadataService,
    public commonService: CommonService,
    private confirmationDialogService: ConfirmationDialogService,
    private fb: FormBuilder,
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
      THUAN_LOI: 1,
      NGUYEN_NHAN: ''
    }
  }

  tienTrinhData: TienTrinhData;
  congViecs: CauHinhCViec[];

  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    if (this.KetQuaKT !== undefined) {
      this.loadData();
    }
  }

  loadData() {
    this.isLoadingForm$.next(true);
    this.tienTrinhData = Object.assign(new TienTrinhData(), this.EMPTY);
    this.loadForm();
    this.KetQuaKT.MA_CVIEC_TRUOC = "KTR";
    const sb = this.metadataService.getCongViecs(this.KetQuaKT.MA_YCAU_KNAI, this.KetQuaKT.MA_CVIEC_TRUOC).pipe(
      catchError((errorMessage) => {
        this.isLoadingForm$.next(false);
        return of(this.tienTrinhData);
      }), finalize(() => {
        this.loadForm();
      })
    ).subscribe(res => {
      if (res.success) {
        this.tienTrinhData = res.data;
        var renhanh = this.KetQuaKT.THUAN_LOI === 0;
        this.congViecs = this.tienTrinhData.congViecs.filter(p => p.CoReNhanh === renhanh);
        if (this.congViecs.length === 0)
          this.congViecs = this.tienTrinhData.congViecs;
        this.showTroNgais(this.KetQuaKT.THUAN_LOI == 1 ? "1" : "0");
        this.KetQuaKT.MA_BPHAN_NHAN = this.tienTrinhData.deptId;
        this.KetQuaKT.MA_NVIEN_NHAN = this.tienTrinhData.staffCode;
        if (!this.KetQuaKT.MA_CVIEC || this.KetQuaKT.MA_CVIEC === undefined)
          this.KetQuaKT.MA_CVIEC = this.congViecs[0].MaCViecTiep;
        this.loadStaffs(this.tienTrinhData.deptId);
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
        MA_YCAU_KNAI: [this.KetQuaKT.MA_YCAU_KNAI],
        MA_LOAI_YCAU: [this.KetQuaKT.MA_LOAI_YCAU],
        NDUNG_XLY: [this.KetQuaKT.NDUNG_XLY],
        MA_TNGAI: [this.KetQuaKT.MA_TNGAI],

        MA_BPHAN_NHAN: [this.KetQuaKT.MA_BPHAN_NHAN, Validators.required],
        MA_NVIEN_NHAN: [this.KetQuaKT.MA_NVIEN_NHAN, Validators.required],

        NGAY_HEN: [this.KetQuaKT.NGAY_HEN, Validators.required],
        NGAY_BDAU: [this.KetQuaKT.NGAY_BDAU],
        NGAY_KTHUC: [this.KetQuaKT.NGAY_KTHUC],
        MA_CVIEC_TRUOC: [this.KetQuaKT.MA_CVIEC_TRUOC],
        MA_CVIEC: [this.KetQuaKT.MA_CVIEC, Validators.required],

        TRANG_THAI: [this.KetQuaKT.TRANG_THAI],
        THUAN_LOI: [this.KetQuaKT.THUAN_LOI]
      });
    }
    catch (error) {

    }
  }

  loadCViecs(maTNgai: string) {
    if (maTNgai && maTNgai !== undefined) {
      const sb = this.metadataService.getTNgaiCViecs(this.KetQuaKT.MA_CVIEC_TRUOC, maTNgai).pipe(
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

  loadStaffs(deptId: string) {
    if (deptId && deptId !== undefined) {
      const sb = this.commonService.getNhanViens(this.KetQuaKT.MA_DVIQLY, deptId).pipe(
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
      this.KetQuaKT.MA_TNGAI = '';
    }
    else
      this.congViecs = this.tienTrinhData.congViecs.filter(p => p.CoReNhanh);
    this.KetQuaKT.THUAN_LOI = thuanLoi == "0" ? 0 : 1;
    if (this.congViecs.length > 0)
      this.KetQuaKT.MA_CVIEC = this.congViecs[0].MaCViecTiep;
    this.loadForm();
  }

  hasTroNgai: boolean = false;
  submited = new BehaviorSubject<boolean>(false);

  saveDraft() {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn lưu kết quả khảo sát?')
      .then((confirmed) => {
        if (confirmed) {
          this.submited.next(true);
          this.formGroup.markAllAsTouched();
          const formValues = this.formGroup.value;
          this.KetQuaKT = Object.assign(this.KetQuaKT, formValues);
          this.KetQuaKT.TRANG_THAI = 0;
          if (this.KetQuaKT.ID > 0) {
            this.edit();
          }
          else {
            this.create();
          }
        }
      });
  }

  save() {
    this.confirmationDialogService.confirm('Thông báo', 'Dữ liệu sẽ không được sửa đổi sau khi lưu, bạn muốn lưu kết quả kiểm tra?')
      .then((confirmed) => {
        if (confirmed) {
          this.submited.next(true);
          this.formGroup.markAllAsTouched();
          const formValues = this.formGroup.value;
          this.KetQuaKT = Object.assign(this.KetQuaKT, formValues);
          this.KetQuaKT.TRANG_THAI = 1;
          if (this.KetQuaKT.ID > 0) {
            this.edit();
          }
          else {
            this.create();
          }
        }
      });
  }

  edit() {
    this.isLoadingForm$.next(true);
    const sbUpdate = this.service.update(this.KetQuaKT).pipe(
      catchError((errorMessage) => {
        this.submited.next(false);
        this.loadData();
        this.isLoadingForm$.next(false);
        this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
        return of(this.KetQuaKT);
      }),
    ).subscribe((res: KetQuaKT) => {
      this.submited.next(false);
      this.reloadData.emit(true);
      this.isLoadingForm$.next(false);
      if (res !== null && res !== undefined) {
        this.KetQuaKT = res;
        this.toastr.success("Gửi yêu cầu thành công", "Thông báo");
      }
      else
        this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
    });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.isLoadingForm$.next(true);
    const sbCreate = this.service.create(this.KetQuaKT).pipe(
      tap(() => {
        this.loadData();
        this.isLoadingForm$.next(false);
      }),
      catchError((errorMessage) => {
        this.submited.next(false);
        this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
        return of(this.KetQuaKT);
      }),
    ).subscribe((res: KetQuaKT) => {
      this.submited.next(false);
      this.reloadData.emit(true);
      this.isLoadingForm$.next(false);
      if (res !== null && res !== undefined) {
        this.KetQuaKT = res;
        this.toastr.success("Gửi yêu cầu thành công", "Thông báo");
      }
      else
        this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
    });
    this.subscriptions.push(sbCreate);
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
