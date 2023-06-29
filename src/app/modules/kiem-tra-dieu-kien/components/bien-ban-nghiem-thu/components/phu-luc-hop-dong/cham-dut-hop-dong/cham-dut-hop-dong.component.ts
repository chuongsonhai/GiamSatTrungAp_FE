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
import { ChamDutHopDong, HeThongDDChamDut } from 'src/app/modules/models/chamduthopdong.model';
import { ChamDutHopDongService } from 'src/app/modules/services/chamduthopdong.service';
import { ToastrService } from 'ngx-toastr';
import { MetadataService } from 'src/app/modules/services/metadata.service';


@Component({
  selector: 'app-cham-dut-hop-dong',
  templateUrl: './cham-dut-hop-dong.component.html',
  styleUrls: ['./cham-dut-hop-dong.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe

  ]
})
export class ChamDutHopDongComponent implements OnInit {

  @Input() _ChamDutHopDong: ChamDutHopDong;
  EMPTY: any;
  HTDDEmty: any;
  ChamDutHopDong: ChamDutHopDong
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  formGroup: FormGroup;
  dataTable: FormGroup;
  control: FormArray;
  mode: boolean;
  startDate = new Date();
  private subscriptions: Subscription[] = [];
  constructor(
    public ChamDutHopDongService: ChamDutHopDongService,
    public commonService: CommonService,
    public MetadataService:MetadataService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private router: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe) {
    this.EMPTY = {
      ID: 0,
      CongVanID: 0,
      MaYeuCau: undefined,
      MaDViQLy: undefined,
      CanCu:undefined,
      Data: undefined,
      NgayLap: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      DiaDiem: undefined,
      DonVi: undefined,
      MaSoThue: undefined,
      SoTaiKhoan: undefined,
      NganHang: undefined,


      Email: undefined,
      DienThoaiCSKH: undefined,
      Website: undefined,
      DaiDien: undefined,
      ChucVu: undefined,

      VanBanUQ: undefined,
      NgayUQ: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      NguoiKyUQ: undefined,
      NgayKyUQ: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      ChucVuUQ: undefined,
      KHTen: undefined,
      KHMa: undefined,
      KHDiaChiDungDien: undefined,
      KHDangKyKD: undefined,

      KHSoTK: undefined,
      KHNganHang: undefined,
      KHDienThoai: undefined,
      KHEmail: undefined,
      KHDaiDien: undefined,
      KHChucVu: undefined,
      KHSoGiayTo: undefined,
      KHNgayCap: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      KHNoiCap: undefined,
      KHVanBanUQ: undefined,
      KHNgayUQ: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      KHNguoiKyUQ: undefined,
      KHNgayKyUQ: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      UngDung: undefined,
      NgayChamDut: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      SoHopDong: undefined,
      NgayKyhopDong: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      TrangThai: 0,
      MucDichThucTeSDD: [],
      GiaDienTheoMucDich: []

    };
    this.dataTable = this.fb.group({
      tableRows: this.fb.array([]),
    });
    this.HTDDEmty = {
      ID: 0,
      ThoaThuanID: 0,
      DiemDo: undefined,
      SoCongTo: undefined,
      Loai: undefined,
      TI: undefined,
      TU: undefined,
      HeSoNhan: undefined,
      ChiSoChot: undefined,


    }


  }

  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    this.MetadataService.getUQs().subscribe();
    this.ChamDutHopDong = Object.assign(new ChamDutHopDong(), this.EMPTY);
    this.loadForm();
    if (this._ChamDutHopDong !== null) {
      this.ChamDutHopDong = Object.assign(new ChamDutHopDong(), this._ChamDutHopDong);
      this.loadForm();
      var listHTDD = this.ChamDutHopDong.HeThongDDChamDut;
      if (listHTDD.length > 0) {
        const control = this.dataTable.get('tableRows') as FormArray;
        listHTDD.forEach(tp => {
          const group = this.fb.group({
            DiemDo: [tp.DiemDo],
            SoCongTo: [tp.SoCongTo],
            Loai: [tp.Loai],
            TI: [tp.TI],
            TU: [tp.TU],
            HeSoNhan: [tp.HeSoNhan],
            ChiSoChot: [tp.ChiSoChot],


            AddRow: [false],
          })
          control.push(group);
        });
      }

      this.isLoadingForm$.next(false);
    }
    this.addRow();


  }
  loadForm() {
    try {
      this.formGroup = this.fb.group({
        MaYeuCau: [this.ChamDutHopDong.MaYeuCau],
        MaDViQLy: [this.ChamDutHopDong.MaDViQLy],
        CanCu:[this.ChamDutHopDong.CanCu],
        Data: [this.ChamDutHopDong.Data],
        NgayLap: [this.ChamDutHopDong.NgayLap],
        DiaDiem: [this.ChamDutHopDong.DiaDiem],
        DonVi: [this.ChamDutHopDong.DonVi],
        MaSoThue: [this.ChamDutHopDong.MaSoThue],
        SoTaiKhoan: [this.ChamDutHopDong.SoTaiKhoan],
        NganHang: [this.ChamDutHopDong.NganHang],


        Email: [this.ChamDutHopDong.Email],
        DienThoaiCSKH: [this.ChamDutHopDong.DienThoaiCSKH],
        Website: [this.ChamDutHopDong.Website],
        DaiDien: [this.ChamDutHopDong.DaiDien],
        ChucVu: [this.ChamDutHopDong.ChucVu],

        VanBanUQ: [this.ChamDutHopDong.VanBanUQ],
        NgayUQ: [this.ChamDutHopDong.NgayUQ],
        NguoiKyUQ: [this.ChamDutHopDong.NguoiKyUQ],
        NgayKyUQ: [this.ChamDutHopDong.NgayKyUQ],
        ChucVuUQ: [this.ChamDutHopDong.ChucVuUQ],
        KHTen: [this.ChamDutHopDong.KHTen],
        KHMa: [this.ChamDutHopDong.KHMa],
        KHDiaChiDungDien: [this.ChamDutHopDong.KHDiaChiDungDien],
        KHDangKyKD: [this.ChamDutHopDong.KHDangKyKD],

        KHSoTK: [this.ChamDutHopDong.KHSoTK],
        KHNganHang: [this.ChamDutHopDong.KHNganHang],
        KHDienThoai: [this.ChamDutHopDong.KHDienThoai],
        KHEmail: [this.ChamDutHopDong.KHEmail],
        KHDaiDien: [this.ChamDutHopDong.KHDaiDien],
        KHChucVu: [this.ChamDutHopDong.KHChucVu],
        KHSoGiayTo: [this.ChamDutHopDong.KHSoGiayTo],
        KHNgayCap: [this.ChamDutHopDong.KHNgayCap],
        KHNoiCap: [this.ChamDutHopDong.KHNoiCap],
        KHVanBanUQ: [this.ChamDutHopDong.KHVanBanUQ],
        KHNgayUQ: [this.ChamDutHopDong.KHNgayUQ],
        KHNguoiKyUQ: [this.ChamDutHopDong.KHNguoiKyUQ],
        KHNgayKyUQ: [this.ChamDutHopDong.KHNgayKyUQ],
        UngDung: [this.ChamDutHopDong.UngDung],
        NgayChamDut: [this.ChamDutHopDong.NgayChamDut],
        SoHopDong: [this.ChamDutHopDong.SoHopDong],
        NgayKyhopDong: [this.ChamDutHopDong.NgayKyhopDong],
        TrangThai: [this.ChamDutHopDong.TrangThai],
        HeThongDDChamDut: [this.ChamDutHopDong.HeThongDDChamDut],

    

      });
    }
    catch (error) {

    }
  }
  private prepareSave() {
    this.formGroup.markAllAsTouched();
    const formValues = this.formGroup.value;
    this.ChamDutHopDong = Object.assign(this.ChamDutHopDong, formValues);
    this.ChamDutHopDong.HeThongDDChamDut = [];
    this.dataTable.markAllAsTouched();
    const controlMucDich = this.dataTable.get('tableRows') as FormArray;

    controlMucDich.controls.forEach(control => {
      const formValue = control.value;
      var ChiTietHTDD = Object.assign({}, formValue);
      if (ChiTietHTDD.DiemDo != null && ChiTietHTDD.DiemDo != "") {
        this.ChamDutHopDong.HeThongDDChamDut.push(ChiTietHTDD);
      }
    });

  }
  save() {
    this.prepareSave();
    if (this.ChamDutHopDong.ID > 0) {
      this.edit();
    }
    else {
      this.create();
    }
  }


  edit() {
    const sbUpdate = this.ChamDutHopDongService.update(this.ChamDutHopDong).pipe(
      tap(() => {
        this.ChamDutHopDong = Object.assign(new ChamDutHopDong(), this.EMPTY);
        this.toastr.success('Lập biên bản thành công', 'Thông báo');
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.toastr.error('Có lỗi xảy ra', 'Thông báo');
        this.modal.dismiss(errorMessage);
        return of(this.ChamDutHopDong);
      }),
    ).subscribe(res => this.ChamDutHopDong = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.ChamDutHopDongService.create(this.ChamDutHopDong).pipe(
      tap(() => {
        this.ChamDutHopDong = Object.assign(new ChamDutHopDong(), this.EMPTY);
        this.toastr.success('Lập biên bản thành công', 'Thông báo');
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.toastr.error('Có lỗi xảy ra', 'Thông báo');
        this.modal.dismiss(errorMessage);
        return of(this.ChamDutHopDong);
      }),
    ).subscribe((res: ChamDutHopDong) => this.ChamDutHopDong = res);
    this.subscriptions.push(sbCreate);
  }


  initiateForm(HeThongDDChamDut: HeThongDDChamDut): FormGroup {
    var form = this.fb.group({

      DiemDo: [HeThongDDChamDut.DiemDo],
      SoCongTo: [HeThongDDChamDut.SoCongTo],
      Loai: [HeThongDDChamDut.Loai],
      TI: [HeThongDDChamDut.TI],
      TU: [HeThongDDChamDut.TU],
      HeSoNhan: [HeThongDDChamDut.HeSoNhan],
      ChiSoChot: [HeThongDDChamDut.ChiSoChot],


      AddRow: [false],
    });
    return form;
  }
  addRow() {
    const control = this.dataTable.get('tableRows') as FormArray;
    var formgroup = this.initiateForm(Object.assign(new HeThongDDChamDut(), this.HTDDEmty));
    formgroup.controls.DiemDo.valueChanges.subscribe(c => {
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
  getUQData(event){
    const value = event.target.value;
    this.MetadataService.listUQ$.pipe().subscribe(  (res) => {
    var item=res.filter(x=>x.tnguoiUquyen===value)[0];
    if(item){
      this.ChamDutHopDong.VanBanUQ=item.soUquyen;
      this.ChamDutHopDong.NgayKyUQ=DateTimeUtil.convertDateToStringVNDefaulDateNow(item.ngayUquyen);
      this.ChamDutHopDong.NgayUQ=DateTimeUtil.convertDateToStringVNDefaulDateNow(item.ngayUquyen);
      this.ChamDutHopDong.NguoiKyUQ=item.tnguoiUquyen;
      this.ChamDutHopDong.ChucVuUQ=item.cvuUquyen;
      this.ChamDutHopDong.DaiDien=item.tenUquyen;
      this.formGroup.controls["VanBanUQ"].setValue(item.soUquyen);
      this.formGroup.controls["NgayKyUQ"].setValue(
        DateTimeUtil.convertDateToStringVNDefaulDateNow(item.ngayUquyen)
      );
      this.formGroup.controls["NgayUQ"].setValue(
        DateTimeUtil.convertDateToStringVNDefaulDateNow(item.ngayUquyen)
      );
      this.formGroup.controls["NguoiKyUQ"].setValue(item.tnguoiUquyen);
      this.formGroup.controls["ChucVuUQ"].setValue(item.cvuUquyen);
      this.formGroup.controls["DaiDien"].setValue(item.tenUquyen);
    }
  })
    
  }



}
