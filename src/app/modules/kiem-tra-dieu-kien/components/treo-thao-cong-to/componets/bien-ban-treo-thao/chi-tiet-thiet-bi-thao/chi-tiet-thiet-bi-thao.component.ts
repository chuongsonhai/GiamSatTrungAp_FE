import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ChiTietThietBiThao,MayBienDong,MayBienDienAp, ChiSo } from 'src/app/modules/models/bienbantt.model';
import { CommonService } from 'src/app/modules/services/base.service';
import { BienBanTTService } from 'src/app/modules/services/bienbantt.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';

@Component({
  selector: 'app-chi-tiet-thiet-bi-thao',
  templateUrl: './chi-tiet-thiet-bi-thao.component.html',
  styleUrls: ['./chi-tiet-thiet-bi-thao.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})
export class ChiTietThietBiThaoComponent implements OnInit {

  @Input() chitietthao: ChiTietThietBiThao;
  EMPTY: any;
  ChiTietEmty: any;
  isLoadingForm$ = new BehaviorSubject<boolean>(false)
  private subscriptions: Subscription[] = [];
  startDate = new Date();
  constructor(
    public commonService: CommonService,
    public service: BienBanTTService,
    private fb: FormBuilder,
    private router: Router,

  ) {
    this.EMPTY = {
      ID: 0,
      SO_CT: undefined,
      NAMSX_CTO: undefined,
      MAHIEU_CTO: undefined,
      PHA_CTO: undefined,
      LOAI_CTO: undefined,
      TSO_BIENDONG: undefined,
      TSO_BIENAP: undefined,
      NGAY_KDINH: undefined,
      TDIEN_LTRINH: undefined,
      SOLAN_LTRINH: undefined,
      MA_CHIHOP: undefined,
      SO_VIENHOP: undefined,
      MA_CHITEM: undefined,
      SO_VIENTEM: undefined,
      SO_BIEUGIA: undefined,
      CHIEU_DODEM: undefined,
      DO_XA: undefined,
      DONVI_HIENTHI: undefined,
      HSO_MHINH: undefined,
      HSO_HTDODEM: undefined,
      CHI_SO: undefined,
      LOAI: 0,
    }
    this.ChiTietEmty = {
      ID: 0,
      BBAN_ID: 0,
      SO_TBI: undefined,
      NAM_SX: undefined,
      NGAY_KDINH: undefined,
      LOAI: undefined,
      TYSO_TI: undefined,
      CHIHOP_VIEN: undefined,
      TEM_KD_VIEN: undefined,
      TI_THAO: true,
    };
    this.service.dataTableThao = this.fb.group({
      tableMBD: this.fb.array([]),
      tableMBDA: this.fb.array([]),
      tableChiSo:this.fb.array([]),
    });
  }
  control: FormArray;
  mode: boolean;


  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    this.isLoadingForm$.next(true);
    this.loadForm();
    if (this.chitietthao !== null) {
   
        var listMBD = this.chitietthao.MayBienDongs
        var listMBDA = this.chitietthao.MayBienDienAps
        var listChiSo = this.chitietthao.CongTo.ChiSos
        if (listChiSo.length > 0) {
          const control = this.service.dataTableThao.get('tableChiSo') as FormArray;
          listChiSo.forEach(tp => {
            var group = this.initiateFormChiSo(Object.assign(new ChiSo(), tp));
            control.push(group);
          });
        }
        if (listMBD.length > 0) {
          const control = this.service.dataTableThao.get('tableMBD') as FormArray;
          listMBD.forEach(tp => {
            const group = this.fb.group({
              SO_TBI: [tp.SO_TBI],
              NAM_SX: [tp.NAM_SX],
              NGAY_KDINH: [tp.NGAY_KDINH],
              LOAI: [tp.LOAI],
              TYSO_TI: [tp.TYSO_TI],
              CHIHOP_VIEN: [tp.CHIHOP_VIEN],
              TEM_KD_VIEN: [tp.TEM_KD_VIEN],
              TI_THAO: true,
              AddRow: [false],
            })
            control.push(group);
          });
        }
        if (listMBDA.length > 0) {
          const control = this.service.dataTableThao.get('tableMBDA') as FormArray;
          listMBDA.forEach(tp => {
            const group = this.fb.group({
              SO_TBI: [tp.SO_TBI],
              NAM_SX: [tp.NAM_SX],
              NGAY_KDINH: [tp.NGAY_KDINH],
              LOAI: [tp.LOAI],
              TYSO_TU: [tp.TYSO_TU],
              CHIHOP_VIEN: [tp.CHIHOP_VIEN],
              TEM_KD_VIEN: [tp.TEM_KD_VIEN],
              TU_THAO: true,
              AddRow: [false],
            })
            control.push(group);
          });
        }
      
      this.loadForm();
    }
    this.addRowMBD();
    this.addRowMBDA();
    this.isLoadingForm$.next(false);
  }
  loadForm() {
    try {
      this.service.ChiTietThietBiThaoForm = this.fb.group({

        SO_CT: [this.chitietthao.CongTo.SO_CT],
        NAMSX_CTO: [this.chitietthao.CongTo.NAMSX_CTO],
        MAHIEU_CTO: [this.chitietthao.CongTo.MAHIEU_CTO],
        PHA_CTO: [this.chitietthao.CongTo.PHA_CTO],
        LOAI_CTO: [this.chitietthao.CongTo.LOAI_CTO],
        TSO_BIENDONG: [this.chitietthao.CongTo.TSO_BIENDONG],
        TSO_BIENAP: [this.chitietthao.CongTo.TSO_BIENAP],
        NGAY_KDINH: [this.chitietthao.CongTo.NGAY_KDINH],
        TDIEN_LTRINH: [this.chitietthao.CongTo.TDIEN_LTRINH],
        SOLAN_LTRINH: [this.chitietthao.CongTo.SOLAN_LTRINH],
        MA_CHIHOP: [this.chitietthao.CongTo.MA_CHIHOP],
        SO_VIENHOP: [this.chitietthao.CongTo.SO_VIENHOP],
        MA_CHITEM: [this.chitietthao.CongTo.MA_CHITEM],
        SO_VIENTEM: [this.chitietthao.CongTo.SO_VIENTEM],
        SO_BIEUGIA: [this.chitietthao.CongTo.SO_BIEUGIA],
        CHIEU_DODEM: [this.chitietthao.CongTo.CHIEU_DODEM],
        DO_XA: [this.chitietthao.CongTo.DO_XA],
        DONVI_HIENTHI: [this.chitietthao.CongTo.DONVI_HIENTHI],
        HSO_MHINH: [this.chitietthao.CongTo.HSO_MHINH],
        HSO_HTDODEM: [this.chitietthao.CongTo.HSO_HTDODEM],
        CHI_SO: [this.chitietthao.CongTo.CHI_SO],
       
      });
    }
    catch (error) {

    }
  }


  initiateFormChiSo(ChiSo: ChiSo): FormGroup {
    var form = this.fb.group({
      LOAI_CHISO: [ChiSo.LOAI_CHISO],
      P: [ChiSo.P],
      Q: [ChiSo.Q],
      BT: [ChiSo.BT],
      CD: [ChiSo.CD],
      TD: [ChiSo.TD],
    });
    return form;
  }
  get getFormControlsChiSo() {
    const control = this.service.dataTableThao.get('tableChiSo') as FormArray;
    return control;
  }


  initiateFormMBD(MayBienDong:MayBienDong ): FormGroup {
    var form = this.fb.group({
      SO_TBI: [MayBienDong.SO_TBI],
      NAM_SX: [MayBienDong.NAM_SX],
      NGAY_KDINH: [MayBienDong.NGAY_KDINH],
      LOAI: [MayBienDong.LOAI],
      TYSO_TI: [MayBienDong.TYSO_TI],
      CHIHOP_VIEN: [MayBienDong.CHIHOP_VIEN],
      TEM_KD_VIEN: [MayBienDong.TEM_KD_VIEN],
      AddRow: [false],
    });
    return form;
  }
  initiateFormMBDA(MayBienDienAp:MayBienDienAp ): FormGroup {
    var form = this.fb.group({
      SO_TBI: [MayBienDienAp.SO_TBI],
      NAM_SX: [MayBienDienAp.NAM_SX],
      NGAY_KDINH: [MayBienDienAp.NGAY_KDINH],
      LOAI: [MayBienDienAp.LOAI],
      TYSO_TU: [MayBienDienAp.TYSO_TU],
      CHIHOP_VIEN: [MayBienDienAp.CHIHOP_VIEN],
      TEM_KD_VIEN: [MayBienDienAp.TEM_KD_VIEN],
      AddRow: [false],
    });
    return form;
  }

  addRowMBD() {
    const control = this.service.dataTableThao.get('tableMBD') as FormArray;
    var formgroup = this.initiateFormMBD(Object.assign(new MayBienDong(), this.ChiTietEmty));
    formgroup.controls.SO_TBI.valueChanges.subscribe(c => {
      if (!formgroup.controls.AddRow.value) {
        formgroup.controls.AddRow.setValue(true);
        this.addRowMBD();
      }
    });
    control.push(formgroup);
  }

  deleteRowMBD(index: number, group: FormGroup) {
    if (index > 0) {
      if (!group.value.AddRow) {
        const control = this.service.dataTableThao.get('tableMBD') as FormArray;
        control.removeAt(index);
        control.controls[index - 1].get('AddRow').setValue(false);
      }
    }
  }

  get getFormControlsMBD() {
    const control = this.service.dataTableThao.get('tableMBD') as FormArray;
    return control;
  }

  addRowMBDA() {
    const control = this.service.dataTableThao.get('tableMBDA') as FormArray;
    var formgroup = this.initiateFormMBDA(Object.assign(new MayBienDienAp(), this.ChiTietEmty));
    formgroup.controls.SO_TBI.valueChanges.subscribe(c => {
      if (!formgroup.controls.AddRow.value) {
        formgroup.controls.AddRow.setValue(true);
        this.addRowMBDA();
      }
    });
    control.push(formgroup);
  }

  deleteRowMBDA(index: number, group: FormGroup) {
    if (index > 0) {
      if (!group.value.AddRow) {
        const control = this.service.dataTableThao.get('tableMBDA') as FormArray;
        control.removeAt(index);
        control.controls[index - 1].get('AddRow').setValue(false);
      }
    }
  }

  get getFormControlsMBDA() {
    const control = this.service.dataTableThao.get('tableMBDA') as FormArray;
    return control;
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.service.ChiTietThietBiThaoForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.service.ChiTietThietBiThaoForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.service.ChiTietThietBiThaoForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.service.ChiTietThietBiThaoForm.controls[controlName];
    return control.dirty || control.touched;
  }

}
