import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { APIResult } from 'src/app/modules/models/apiresult.model';
import { ChiTietThietBiTreo, MayBienDong, MayBienDienAp, ChiSo, CongTo, CongToData, MayBienDienApData, MayBienDongData } from 'src/app/modules/models/bienbantt.model';
import { CommonService } from 'src/app/modules/services/base.service';
import { BienBanTTService } from 'src/app/modules/services/bienbantt.service';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';

@Component({
  selector: 'app-chi-tiet-thiet-bi-treo',
  templateUrl: './chi-tiet-thiet-bi-treo.component.html',
  styleUrls: ['./chi-tiet-thiet-bi-treo.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})
export class ChiTietThietBiTreoComponent implements OnInit {

  @Input() chitiettreo: ChiTietThietBiTreo;
  @Input() maDVQL: string;
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
    public toastr: ToastrService

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
      LOAI: 1,

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
      TI_THAO: false,
    };
    this.service.dataTableTreo = this.fb.group({
      tableMBD: this.fb.array([]),
      tableMBDA: this.fb.array([]),
      tableChiSo: this.fb.array([]),
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
    if (this.chitiettreo !== null) {
      var listMBD = this.chitiettreo.MayBienDongs
      var listMBDA = this.chitiettreo.MayBienDienAps
      var listChiSo = this.chitiettreo.CongTo.ChiSos
      if (listChiSo.length > 0) {
        const control = this.service.dataTableTreo.get('tableChiSo') as FormArray;
        listChiSo.forEach(tp => {
          var group = this.initiateFormChiSo(Object.assign(new ChiSo(), tp));
          control.push(group);
        });
      }

      if (listMBD.length > 0) {
        const control = this.service.dataTableTreo.get('tableMBD') as FormArray;
        listMBD.forEach(tp => {
          const group = this.fb.group({
            SO_TBI: [tp.SO_TBI],
            NAM_SX: [tp.NAM_SX],
            NGAY_KDINH: [tp.NGAY_KDINH],
            LOAI: [tp.LOAI],
            TYSO_TI: [tp.TYSO_TI],
            CHIHOP_VIEN: [tp.CHIHOP_VIEN],
            TEM_KD_VIEN: [tp.TEM_KD_VIEN],
            TI_THAO: false,
            AddRow: [false],
          })
          control.push(group);
        });
      }
      if (listMBDA.length > 0) {
        const control = this.service.dataTableTreo.get('tableMBDA') as FormArray;
        listMBDA.forEach(tp => {
          const group = this.fb.group({
            SO_TBI: [tp.SO_TBI],
            NAM_SX: [tp.NAM_SX],
            NGAY_KDINH: [tp.NGAY_KDINH],
            LOAI: [tp.LOAI],
            TYSO_TU: [tp.TYSO_TU],
            CHIHOP_VIEN: [tp.CHIHOP_VIEN],
            TEM_KD_VIEN: [tp.TEM_KD_VIEN],
            TU_THAO: false,
            AddRow: [false],
          })
          control.push(group);
        });
      }

      this.loadForm();
    }
    // this.addRowMBD();
    // this.addRowMBDA();
    this.isLoadingForm$.next(false);
  }
  loadForm() {
    try {
      this.service.ChiTietThietBiTreoForm = this.fb.group({

        SO_CT: [this.chitiettreo.CongTo.SO_CT],
        NAMSX_CTO: [this.chitiettreo.CongTo.NAMSX_CTO],
        MAHIEU_CTO: [this.chitiettreo.CongTo.MAHIEU_CTO],
        PHA_CTO: [this.chitiettreo.CongTo.PHA_CTO],
        LOAI_CTO: [this.chitiettreo.CongTo.LOAI_CTO],
        TSO_BIENDONG: [this.chitiettreo.CongTo.TSO_BIENDONG],
        TSO_BIENAP: [this.chitiettreo.CongTo.TSO_BIENAP],
        NGAY_KDINH: [this.chitiettreo.CongTo.NGAY_KDINH],
        TDIEN_LTRINH: [this.chitiettreo.CongTo.TDIEN_LTRINH],
        SOLAN_LTRINH: [this.chitiettreo.CongTo.SOLAN_LTRINH],
        MA_CHIHOP: [this.chitiettreo.CongTo.MA_CHIHOP],
        SO_VIENHOP: [this.chitiettreo.CongTo.SO_VIENHOP],
        MA_CHITEM: [this.chitiettreo.CongTo.MA_CHITEM],
        SO_VIENTEM: [this.chitiettreo.CongTo.SO_VIENTEM],
        SO_BIEUGIA: [this.chitiettreo.CongTo.SO_BIEUGIA],
        CHIEU_DODEM: [this.chitiettreo.CongTo.CHIEU_DODEM],
        DO_XA: [this.chitiettreo.CongTo.DO_XA],
        DONVI_HIENTHI: [this.chitiettreo.CongTo.DONVI_HIENTHI],
        HSO_MHINH: [this.chitiettreo.CongTo.HSO_MHINH],
        HSO_HTDODEM: [this.chitiettreo.CongTo.HSO_HTDODEM],
        CHI_SO: [this.chitiettreo.CongTo.CHI_SO],
        IsCongTo: [this.chitiettreo.IsCongTo],
        IsMBD: [this.chitiettreo.IsMBD],
        IsMBDA: [this.chitiettreo.IsMBDA],


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
    const control = this.service.dataTableTreo.get('tableChiSo') as FormArray;
    return control;
  }

  initiateFormMBD(MayBienDong: MayBienDong): FormGroup {
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
  initiateFormMBDA(MayBienDienAp: MayBienDienAp): FormGroup {
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
    const control = this.service.dataTableTreo.get('tableMBD') as FormArray;
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
        const control = this.service.dataTableTreo.get('tableMBD') as FormArray;
        control.removeAt(index);
        control.controls[index - 1].get('AddRow').setValue(false);
      }
    }
  }

  get getFormControlsMBD() {
    const control = this.service.dataTableTreo.get('tableMBD') as FormArray;
    return control;
  }

  addRowMBDA() {
    const control = this.service.dataTableTreo.get('tableMBDA') as FormArray;
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
        const control = this.service.dataTableTreo.get('tableMBDA') as FormArray;
        control.removeAt(index);
        control.controls[index - 1].get('AddRow').setValue(false);
      }
    }
  }

  get getFormControlsMBDA() {
    const control = this.service.dataTableTreo.get('tableMBDA') as FormArray;
    return control;
  }
  getCongTo(soCongTo: string) {

    this.isLoadingForm$.next(true);
    var data = {
      "maDViQLy": this.maDVQL,
      "soTBi": soCongTo
    }
    const sb = this.service.getCongTo(data).pipe(
      first(),
      catchError((errorMessage) => {
        this.toastr.error("Dữ liệu không hợp lệ, vui lòng thực hiện lại", "Thông báo");
        return of(null);
      }),
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((apiResult: APIResult) => {
      if (apiResult.success) {

        if (apiResult.data.length > 0) {
          var congTodata = Object.assign(new CongToData(), apiResult.data[0]) as CongToData;
          this.chitiettreo.CongTo.SO_CT = congTodata.SO_CTO;
          this.chitiettreo.CongTo.NAMSX_CTO = congTodata.NAM_SX;
          this.chitiettreo.CongTo.MAHIEU_CTO = congTodata.MA_CTO;
          this.chitiettreo.CongTo.PHA_CTO = congTodata.SO_PHA;
          this.chitiettreo.CongTo.LOAI_CTO = congTodata.VH_CONG;
          this.chitiettreo.CongTo.TSO_BIENDONG = congTodata.TYSO_TI;
          this.chitiettreo.CongTo.TSO_BIENAP = congTodata.TYSO_TU;
          this.chitiettreo.CongTo.NGAY_KDINH = congTodata.NGAY_KDINH;
          this.chitiettreo.CongTo.TDIEN_LTRINH = congTodata.NGAY_LTRINH;
          this.chitiettreo.CongTo.SOLAN_LTRINH = congTodata.SLAN_LT;
          this.chitiettreo.CongTo.MA_CHITEM=congTodata.MTEM_KD;
          this.loadForm();
          this.isLoadingForm$.next(false);
        }
      }
    });

    this.subscriptions.push(sb);
  };
  addMBD(soTI: string) {

    this.isLoadingForm$.next(true);
    var data = {
      "maDViQLy": this.maDVQL,
      "soTBi": soTI
    }
    const sb = this.service.getMBD(data).pipe(
      first(),
      catchError((errorMessage) => {
        this.toastr.error("Dữ liệu không hợp lệ, vui lòng thực hiện lại", "Thông báo");
        return of(null);
      }),
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((apiResult: APIResult) => {

      if (apiResult.success) {

        if (apiResult.data.length > 0) {
          const control = this.service.dataTableTreo.get('tableMBD') as FormArray;

          var mBDData = Object.assign(new MayBienDongData(), apiResult.data[0]) as MayBienDongData;
          var mbd = Object.assign(new MayBienDongData(), this.ChiTietEmty) as MayBienDong;
          mbd.SO_TBI = soTI;
          mbd.NAM_SX = mBDData.NAM_SX;
          mbd.NGAY_KDINH = mBDData.NGAY_KDINH;
          mbd.TYSO_TI = mBDData.TYSO_DAU;
          var formgroup = this.initiateFormMBD(Object.assign(new MayBienDong(), apiResult.data[0]));
          control.push(formgroup);
        }
      }


    });

    this.subscriptions.push(sb);
  };
  addMBDA(soTU) {

    this.isLoadingForm$.next(true);
    var data = {
      "maDViQLy": this.maDVQL,
      "soTBi": soTU
    }
    const sb = this.service.getMBDA(data).pipe(
      first(),
      catchError((errorMessage) => {

        this.toastr.error("Dữ liệu không hợp lệ, vui lòng thực hiện lại", "Thông báo");
        return of(undefined);
      }),
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((apiResult: APIResult) => {

      if (apiResult.success) {

        if (apiResult.data.length > 0) {

          const control = this.service.dataTableTreo.get('tableMBDA') as FormArray;
          var mBDAData = Object.assign(new MayBienDienApData(), apiResult.data[0]) as MayBienDienApData;
          var mbda = Object.assign(new MayBienDienAp(), this.ChiTietEmty) as MayBienDienAp;
          mbda.SO_TBI = soTU;
          mbda.NAM_SX = mBDAData.NAM_SX;
          mbda.NGAY_KDINH = mBDAData.NGAY_KDINH
          mbda.TYSO_TU = mBDAData.TYSO_DAU


          var formgroup = this.initiateFormMBDA(Object.assign(new MayBienDienAp(), mbda));
          control.push(formgroup);
          this.isLoadingForm$.next(false);
        }
      }



    });

    this.subscriptions.push(sb);
  };

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.service.ChiTietThietBiTreoForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.service.ChiTietThietBiTreoForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.service.ChiTietThietBiTreoForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.service.ChiTietThietBiTreoForm.controls[controlName];
    return control.dirty || control.touched;
  }

}
