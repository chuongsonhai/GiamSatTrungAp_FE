import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { Router } from '@angular/router';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';
import { BienBanKS } from 'src/app/modules/models/base.model';
import { BienBanKSService } from '../../../../services/bienbanks.service';
import { CommonService } from 'src/app/modules/services/base.service';
import { ThanhPhanDaiDienKS } from '../../../../models/thanhphanks.model';

@Component({
  selector: 'app-create-bien-ban-khao-sat',
  templateUrl: './create-bien-ban-khao-sat.component.html',
  styleUrls: ['./create-bien-ban-khao-sat.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe

  ]
})
export class CreateBienBanKhaoSatComponent implements OnInit {
  @Input() _bienBanKS: BienBanKS;
  EMPTY: any;
  ChiTietEmty: any;
  BienBanKS: BienBanKS
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  formGroup: FormGroup;
  dataTable: FormGroup;
  private subscriptions: Subscription[] = [];
  submited: boolean;

  constructor(
    public service: BienBanKSService,
    public commonService: CommonService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private router: Router,
    private datePipe: DatePipe
  ) {

    this.EMPTY = {
      ID: 0,
      BranchCode: undefined,
      CongVanID: 0,
      SoCongVan: undefined,
      NgayCongVan: undefined,
      MaKH: undefined,
      SoBienBan: undefined,
      TenCongTrinh: undefined,
      DiaDiemXayDung: undefined,
      KHTen: undefined,
      KHDaiDien: undefined,
      KHChucDanh: undefined,
      EVNDonVi: undefined,
      EVNDaiDien: undefined,
      EVNChucDanh: undefined,
      NgayDuocGiao: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      MaTroNgai: '',
      NgayKhaoSat: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      CapDienAp: undefined,
      TenLoDuongDay: undefined,
      DiemDauDuKien: undefined,
      DayDan: undefined,
      SoTramBienAp: 1,
      SoMayBienAp: 1,
      TongCongSuat: 0,
      ThoaThuanKyThuat: undefined,
      ThuanLoi: true,
      Data: undefined,
    }
    this.ChiTietEmty = {
      DaiDien: undefined,
      ChucVu: undefined,
      Loai: 0,
    };
    this.dataTable = this.fb.group({
      tableEVNDD: this.fb.array([]),
      tableKHDD: this.fb.array([])
    });
  }
  startDate = new Date();

  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    this.BienBanKS = Object.assign(new BienBanKS(), this.EMPTY);
    const example = merge(
      this.commonService.getTroNgais()
    );

    this.isLoadingForm$.next(true);
    const subscribe = example.pipe(
      catchError(err => {
        return of(undefined);
      }),
      finalize(() => {
        this.isLoadingForm$.next(false);
      })).subscribe();
    this.subscriptions.push(subscribe);
    this.loadForm();
    if (this._bienBanKS !== null) {
      this.BienBanKS = Object.assign(new BienBanKS(), this._bienBanKS);
      this.loadForm();
      if (this.BienBanKS.ThanhPhans.length > 0) {
        var thanhphanEVN = this.BienBanKS.ThanhPhans.filter(x => x.Loai == 0).map(x => x);
        var thanhphanKH = this.BienBanKS.ThanhPhans.filter(x => x.Loai == 1).map(x => x);
        if (thanhphanEVN.length > 0) {
          const control = this.dataTable.get('tableEVNDD') as FormArray;
          thanhphanEVN.forEach(tp => {
            const group = this.fb.group({
              DaiDien: [tp.DaiDien],
              ChucVu: [tp.ChucVu],
              Loai: [tp.Loai],
              AddRow: [false],
            })
            control.push(group);
          });
        }
        if (thanhphanKH.length > 0) {
          const control = this.dataTable.get('tableKHDD') as FormArray;
          thanhphanKH.forEach(tp => {
            const group = this.fb.group({
              DaiDien: [tp.DaiDien],
              ChucVu: [tp.ChucVu],
              Loai: [tp.Loai],
              AddRow: [false],
            })
            control.push(group);
          });
        }
      }

    }
    this.addRowEVN();
    this.addRowKH();
    this.isLoadingForm$.next(false);
  }
  loadForm() {
    try {
      this.formGroup = this.fb.group({
        SoCongVan: [this.BienBanKS.SoCongVan],
        NgayCongVan: [this.BienBanKS.NgayCongVan],
        MaKH: [this.BienBanKS.MaKH],
        SoBienBan: [this.BienBanKS.SoBienBan],
        TenCongTrinh: [this.BienBanKS.TenCongTrinh],
        DiaDiemXayDung: [this.BienBanKS.DiaDiemXayDung],
        KHTen: [this.BienBanKS.KHTen],
        KHDaiDien: [this.BienBanKS.KHDaiDien],
        KHChucDanh: [this.BienBanKS.KHChucDanh],
        EVNDonVi: [this.BienBanKS.EVNDonVi],
        EVNDaiDien: [this.BienBanKS.EVNDaiDien],
        EVNChucDanh: [this.BienBanKS.EVNChucDanh],
        NgayDuocGiao: [this.BienBanKS.NgayDuocGiao, Validators.required],
        MaTroNgai: [this.BienBanKS.MaTroNgai],
        NgayKhaoSat: [this.BienBanKS.NgayKhaoSat, Validators.required],
        CapDienAp: [this.BienBanKS.CapDienAp],
        TenLoDuongDay: [this.BienBanKS.TenLoDuongDay],
        DiemDauDuKien: [this.BienBanKS.DiemDauDuKien],
        DayDan: [this.BienBanKS.DayDan],
        SoTramBienAp: [this.BienBanKS.SoTramBienAp],
        SoMayBienAp: [this.BienBanKS.SoMayBienAp],
        TongCongSuat: [this.BienBanKS.TongCongSuat],
        ThoaThuanKyThuat: [this.BienBanKS.ThoaThuanKyThuat],
        ThuanLoi: [this.BienBanKS.ThuanLoi],
        TroNgai: [this.BienBanKS.TroNgai],
        ThanhPhans: [this.BienBanKS.ThanhPhans]
      });
    }
    catch (error) {

    }
  }
  save() {
    this.submited = true;
    this.isLoadingForm$.next(true);
    this.formGroup.markAllAsTouched();
    const formValues = this.formGroup.value;
    this.BienBanKS.NgayDuocGiao = DateTimeUtil.convertStringVNToStringISO(formValues.NgayDuocGiao);
    this.BienBanKS.NgayKhaoSat = DateTimeUtil.convertStringVNToStringISO(formValues.NgayKhaoSat);
    this.BienBanKS = Object.assign(this.BienBanKS, formValues);
    this.BienBanKS.ThanhPhans = [];
    this.dataTable.markAllAsTouched();

    const controlEVN = this.dataTable.get('tableEVNDD') as FormArray;
    const controlKH = this.dataTable.get('tableKHDD') as FormArray;

    controlEVN.controls.forEach(control => {
      const formEVNValues = control.value;
      var envThanhPhan = Object.assign(new ThanhPhanDaiDienKS, null);
      envThanhPhan = Object.assign(envThanhPhan, formEVNValues);
      if (envThanhPhan.DaiDien != null && envThanhPhan.DaiDien != "") {
        envThanhPhan.Loai = 0;
        this.BienBanKS.ThanhPhans.push(envThanhPhan);
      }

    });
    controlKH.controls.forEach(control => {
      const formKHValues = control.value;
      var khThanhPhan = Object.assign(new ThanhPhanDaiDienKS, null);
      khThanhPhan = Object.assign(khThanhPhan, formKHValues);
      if (khThanhPhan.DaiDien != null && khThanhPhan.DaiDien != "") {
        khThanhPhan.Loai = 1;
        this.BienBanKS.ThanhPhans.push(khThanhPhan);
      }

    });

    this.update();
  }

  update() {
    const sbUpdate = this.service.create(this.BienBanKS).pipe(
      tap(() => {
        this.submited = false;
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.BienBanKS);
      }),
    ).subscribe(res => this.BienBanKS = res);
    this.subscriptions.push(sbUpdate);
  }

  initiateForm(ThanhPhanDaiDien: ThanhPhanDaiDienKS): FormGroup {
    var form = this.fb.group({
      DaiDien: [ThanhPhanDaiDien.DaiDien],
      ChucVu: [ThanhPhanDaiDien.ChucVu],
      Loai: [ThanhPhanDaiDien.Loai],
      AddRow: [false],
    });
    return form;
  }

  addRowKH() {
    const control = this.dataTable.get('tableKHDD') as FormArray;
    var formgroup = this.initiateForm(Object.assign(new ThanhPhanDaiDienKS(), this.ChiTietEmty));
    formgroup.controls.DaiDien.valueChanges.subscribe(c => {
      if (!formgroup.controls.AddRow.value) {
        ;
        formgroup.controls.AddRow.setValue(true);
        this.addRowKH();
      }
    });

    control.push(formgroup);
  }
  deleteRowKH(index: number, group: FormGroup) {
    if (index > 0) {
      if (!group.value.AddRow) {
        const control = this.dataTable.get('tableKHDD') as FormArray;
        control.removeAt(index);
        control.controls[index - 1].get('AddRow').setValue(false);
      }
    }
  }
  get getFormControlsKH() {
    const control = this.dataTable.get('tableKHDD') as FormArray;
    return control;
  }

  addRowEVN() {
    const control = this.dataTable.get('tableEVNDD') as FormArray;
    var formgroup = this.initiateForm(Object.assign(new ThanhPhanDaiDienKS(), this.ChiTietEmty));
    formgroup.controls.DaiDien.valueChanges.subscribe(c => {
      if (!formgroup.controls.AddRow.value) {
        formgroup.controls.AddRow.setValue(true);
        this.addRowEVN();
      }
    });

    control.push(formgroup);
  }

  deleteRowEVN(index: number, group: FormGroup) {
    if (index > 0) {
      if (!group.value.AddRow) {
        const control = this.dataTable.get('tableEVNDD') as FormArray;
        control.removeAt(index);
        control.controls[index - 1].get('AddRow').setValue(false);
      }
    }
  }
  get getFormControlsEVN() {
    const control = this.dataTable.get('tableEVNDD') as FormArray;
    return control;
  }
}
