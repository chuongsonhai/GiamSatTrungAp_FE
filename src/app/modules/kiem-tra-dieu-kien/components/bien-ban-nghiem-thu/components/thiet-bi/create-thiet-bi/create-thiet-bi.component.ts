import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { ResponseModel } from 'src/app/modules/models/response.model';
import { Router } from '@angular/router';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';
import { CommonService } from 'src/app/modules/services/base.service';
import { ThietBi, ThietBiChiTiet } from 'src/app/modules/models/thietbi.model';
import { ThietBiService } from 'src/app/modules/services/thietbi.service';

@Component({
  selector: 'app-create-thiet-bi',
  templateUrl: './create-thiet-bi.component.html',
  styleUrls: ['./create-thiet-bi.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe

  ]
})
export class CreateThietBiComponent implements OnInit {

  @Input() _ThietBi: ThietBi;
  EMPTY: any;
  ChiTietEmty: any;
  ThietBi: ThietBi
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  formGroup: FormGroup;
  //list item
  dataTable: FormGroup;
  control: FormArray;
  mode: boolean;
  startDate = new Date();
  private subscriptions: Subscription[] = [];
  constructor(
    public ThietBiService: ThietBiService,
    public commonService: CommonService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private router: Router,
    private datePipe: DatePipe
  ) {

    this.EMPTY = {
      ID: 0,
      CongVanID: 0,
      HopDongID: 0,
      Ten: undefined,
      KHTen: undefined,
      DiaChiDungDien: undefined,
      TongCongSuat: 0,
      TrangThai: 0,
      NgayLap: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      NguoiLap: undefined,
      NgayKy: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      NguoiKy: undefined,
      Data: undefined,
      ThietBiChiTiets: [],
    };
    this.dataTable = this.fb.group({
      tableRows: this.fb.array([])
    });
    this.ChiTietEmty = {
      ID: 0,
      ThietBiID: 0, 
      HopDongID: 0,
      Ten: undefined,
      CongSuat: 0,
      SoLuong: 0,
      HeSoDongThoi: 0,
      SoGio: 0,
      SoNgay: 0,
      TongCongSuat: 0,
      GhiChu: undefined,
    }
  }


  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    this.ThietBi = Object.assign(new ThietBi(), this.EMPTY);
    this.loadForm();
    this.addRow();
    if (this._ThietBi !== null) {
      this.ThietBi = Object.assign(new ThietBi(), this._ThietBi);
      this.loadForm();
      this.isLoadingForm$.next(false);
    }
  }
  loadForm() {
    try {
      this.formGroup = this.fb.group({
        Ten: [this.ThietBi.Ten],
        KHTen: [this.ThietBi.KHTen],
        DiaChiDungDien: [this.ThietBi.DiaChiDungDien],
        TongCongSuat: [this.ThietBi.TongCongSuat],
        NgayLap: [this.ThietBi.NgayLap, Validators.required],
        NguoiLap: [this.ThietBi.NguoiLap],
        NgayKy: [this.ThietBi.NgayKy, Validators.required],
        NguoiKy: [this.ThietBi.NguoiKy],
        Data: [this.ThietBi.Data],
        ThietBiChiTiets: [this.ThietBi.ThietBiChiTiets],
      });
    }
    catch (error) {

    }
  }
  private prepareSave() {
    this.formGroup.markAllAsTouched();
    const formValues = this.formGroup.value;
    this.ThietBi = Object.assign(this.ThietBi, formValues);
    const tabelValues = this.dataTable.get('tableRows').value;
    if (!this.ThietBi.ThietBiChiTiets) this.ThietBi.ThietBiChiTiets = [];
    this.dataTable.markAllAsTouched();
    const control = this.dataTable.get('tableRows') as FormArray;

    var touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    touchedRows.forEach(element => {
      if (element.AddRow) {
        //InventoryDocumentContent
        var ThietBiChiTiet = Object.assign({}, element);
        this.ThietBi.ThietBiChiTiets.push(ThietBiChiTiet);
      }

    });
  }
  save() {
    this.prepareSave();
    if (this.ThietBi.ID > 0) {
      this.edit();
    }
    else {
      this.create();
    }
  }


  edit() {
    const sbUpdate = this.ThietBiService.update(this.ThietBi).pipe(
      tap(() => {
        this.ThietBi = Object.assign(new ThietBi(), this.EMPTY);
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.ThietBi);
      }),
    ).subscribe(res => this.ThietBi = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.ThietBiService.create(this.ThietBi).pipe(
      tap(() => {
        this.ThietBi = Object.assign(new ThietBi(), this.EMPTY);
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.ThietBi);
      }),
    ).subscribe((res: ThietBi) => this.ThietBi = res);
    this.subscriptions.push(sbCreate);
  }


  initiateForm(ThietBiChiTiet: ThietBiChiTiet): FormGroup {
    var form = this.fb.group({


      Ten: [ThietBiChiTiet.Ten],
      CongSuat: [ThietBiChiTiet.CongSuat],
      SoLuong: [ThietBiChiTiet.SoLuong],
      HeSoDongThoi: [ThietBiChiTiet.HeSoDongThoi],
      SoGio: [ThietBiChiTiet.SoGio],
      SoNgay: [ThietBiChiTiet.SoNgay],
      TongCongSuat: [ThietBiChiTiet.TongCongSuat],
      GhiChu: [ThietBiChiTiet.GhiChu],
      AddRow: [false],
    });
    return form;
  }
  addRow() {
    const control = this.dataTable.get('tableRows') as FormArray;
    var formgroup = this.initiateForm(Object.assign(new ThietBiChiTiet(), this.ChiTietEmty));
    formgroup.controls.Ten.valueChanges.subscribe(c => {
      if (!formgroup.controls.AddRow.value) {
        formgroup.controls.AddRow.setValue(true);
        this.addRow();
      }
    });

    control.push(formgroup);
  }
  deleteRow(index: number, group: FormGroup) {
    if (index > 0) {
      if (!group.value.isCreateNewRow) {
        const control = this.dataTable.get('tableRows') as FormArray;
        control.removeAt(index);
        control.controls[index - 1].get('AddRow').setValue(false);
      }
    }
  }
  get getFormControls() {
    const control = this.dataTable.get('tableRows') as FormArray;
    return control;
  }

}

