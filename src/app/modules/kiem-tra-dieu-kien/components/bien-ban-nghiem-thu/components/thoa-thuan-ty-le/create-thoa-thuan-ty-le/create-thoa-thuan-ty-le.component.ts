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
import { ChiTietDamBao, ThoaThuanDamBao } from 'src/app/modules/models/thoathuandambao.model';
import { ThoaThuanDamBaoService } from 'src/app/modules/services/thoathuandambao.service';
import { ToastrService } from 'ngx-toastr';
import { ThoaThuanTyLe } from 'src/app/modules/models/thoathuantyle.model';
import { ThoaThuanTyLeService } from 'src/app/modules/services/thoathuantyle.service';



@Component({
  selector: 'app-create-thoa-thuan-ty-le',
  templateUrl: './create-thoa-thuan-ty-le.component.html',
  styleUrls: ['./create-thoa-thuan-ty-le.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe

  ]
})
export class CreateThoaThuanTyLeComponent implements OnInit {

  @Input() _ThoaThuanTyLe: ThoaThuanTyLe;
  EMPTY: any;
  ChiTietEmty: any;
  ThoaThuanTyLe: ThoaThuanTyLe
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    public service: ThoaThuanTyLeService,
    public commonService: CommonService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private router: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {

    this.EMPTY = {
      ID: 0,
      CongVanID: 0,
      Gio: 0,
      Phut: 0,
      NgayLap: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      DiaDiem: undefined,

      DonVi: undefined,
      MaSoThue: undefined,
      DaiDien: undefined,
      ChucVu: undefined,
      VanBanUQ: undefined,
      NgayUQ: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      NguoiKyUQ: undefined,
      NgayKyUQ: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      ChucVuUQ: undefined,
      DiaChi: undefined,
      DienThoai: undefined,
      Email: undefined,
      DienThoaiCSKH: undefined,
      SoTaiKhoan: undefined,
      NganHang: undefined,
      KHMa: undefined,
      KHTen: undefined,
      KHDaiDien: undefined,
      KHDiaChi: undefined,
      KHDienThoai: undefined,
      KHEmail: undefined,
      KHSoTK: undefined,
      KHNganHang: undefined,
      KHVanBanUQ: undefined,
      KHNguoiUQ: undefined,
      KHNgayUQ: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),

      GiaTriTien: 0,
      TienBangChu: undefined,

      TuNgay: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      DenNgay: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),

      HinhThuc: undefined,
      GhiChu: undefined,
      TrangThai: 0,

      Data: undefined,

      GiaTriDamBao: [],

    };
    this.dataTable = this.fb.group({
      tableRows: this.fb.array([])
    });
    this.ChiTietEmty = {
      ID: 0,
      ThoaThuanID: 0,
      MucDich: undefined,
      SLTrungBinh: 0,
      SoNgayDamBao: 0,
      GiaBanDien: 0,
      ThanhTien: 0,
    }
  }
  //list item
  dataTable: FormGroup;
  control: FormArray;
  mode: boolean;
  startDate = new Date();

  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    this.ThoaThuanTyLe = Object.assign(new ThoaThuanTyLe(), this.EMPTY);
    this.loadForm();
    if (this._ThoaThuanTyLe !== null) {
      this.ThoaThuanTyLe = Object.assign(new ThoaThuanTyLe(), this._ThoaThuanTyLe);
      this.loadForm();
      
      this.isLoadingForm$.next(false);
    }
    this.addRow();

  }
  loadForm() {
    try {
      this.formGroup = this.fb.group({
        
        NgayLap: [this.ThoaThuanTyLe.NgayLap],
        DiaDiem: [this.ThoaThuanTyLe.DiaDiem],

        DonVi: [this.ThoaThuanTyLe.DonVi],
        MaSoThue: [this.ThoaThuanTyLe.MaSoThue],
        DaiDien: [this.ThoaThuanTyLe.DaiDien],
        ChucVu: [this.ThoaThuanTyLe.ChucVu],
        VanBanUQ: [this.ThoaThuanTyLe.VanBanUQ],
        NgayUQ: [this.ThoaThuanTyLe.NgayUQ],
        NguoiKyUQ: [this.ThoaThuanTyLe.NguoiKyUQ],
        NgayKyUQ: [this.ThoaThuanTyLe.NgayKyUQ],
        ChucVuUQ: [this.ThoaThuanTyLe.ChucVuUQ],
        DiaChi: [this.ThoaThuanTyLe.DiaChiGiaoDich],
        DienThoai: [this.ThoaThuanTyLe.DienThoai],
        Email: [this.ThoaThuanTyLe.Email],
        DienThoaiCSKH: [this.ThoaThuanTyLe.DienThoaiCSKH],
        SoTaiKhoan: [this.ThoaThuanTyLe.SoTaiKhoan],
        NganHang: [this.ThoaThuanTyLe.NganHang],
        KHMa: [this.ThoaThuanTyLe.KHMa],
        KHTen: [this.ThoaThuanTyLe.KHTen],
        KHDaiDien: [this.ThoaThuanTyLe.KHDaiDien],
        KHDiaChi: [this.ThoaThuanTyLe.KHDiaChiGiaoDich],
        KHDienThoai: [this.ThoaThuanTyLe.KHDienThoai],
        KHEmail: [this.ThoaThuanTyLe.KHEmail],
        KHSoTK: [this.ThoaThuanTyLe.KHSoTK],
        KHNganHang: [this.ThoaThuanTyLe.KHNganHang],
        KHVanBanUQ: [this.ThoaThuanTyLe.KHVanBanUQ],
        KHNguoiUQ: [this.ThoaThuanTyLe.KHNguoiKyUQ],
        KHNgayUQ: [this.ThoaThuanTyLe.KHNgayUQ],

        Data: [this.ThoaThuanTyLe.Data],
      });
    }
    catch (error) {

    }
  }
  private prepareSave() {
    this.formGroup.markAllAsTouched();
    const formValues = this.formGroup.value;
    this.ThoaThuanTyLe = Object.assign(this.ThoaThuanTyLe, formValues);
    this.dataTable.markAllAsTouched();
    const control = this.dataTable.get('tableRows') as FormArray;
  }
  save() {
    this.prepareSave();
    if (this.ThoaThuanTyLe.ID > 0) {
      this.edit();
    }
    else {
      this.create();
    }
  }


  edit() {
    const sbUpdate = this.service.update(this.ThoaThuanTyLe).pipe(
      tap(() => {
        this.ThoaThuanTyLe = Object.assign(new ThoaThuanTyLe(), this.EMPTY);
        this.loadForm();
        this.toastr.success('Lập biên bản thành công', 'Thông báo');
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.toastr.error('Có lỗi xảy ra', 'Thông báo');
        this.modal.dismiss(errorMessage);
        return of(this.ThoaThuanTyLe);
      }),
    ).subscribe(res => this.ThoaThuanTyLe = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.service.create(this.ThoaThuanTyLe).pipe(
      tap(() => {
        this.ThoaThuanTyLe = Object.assign(new ThoaThuanTyLe(), this.EMPTY);
        this.loadForm();
        this.toastr.success('Lập biên bản thành công', 'Thông báo');
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.toastr.error('Có lỗi xảy ra', 'Thông báo');
        this.modal.dismiss(errorMessage);
        return of(this.ThoaThuanTyLe);
      }),
    ).subscribe((res) => this.ThoaThuanTyLe = res);
    this.subscriptions.push(sbCreate);
  }


  initiateForm(ChiTietDamBao: ChiTietDamBao): FormGroup {
    var form = this.fb.group({


      MucDich: [ChiTietDamBao.MucDich],
      SLTrungBinh: [ChiTietDamBao.SLTrungBinh],
      SoNgayDamBao: [ChiTietDamBao.SoNgayDamBao],
      GiaBanDien: [ChiTietDamBao.GiaBanDien],
      ThanhTien: [ChiTietDamBao.ThanhTien],
      AddRow: [false],
    });
    return form;
  }
  addRow() {
    const control = this.dataTable.get('tableRows') as FormArray;
    var formgroup = this.initiateForm(Object.assign(new ChiTietDamBao(), this.ChiTietEmty));
    formgroup.controls.MucDich.valueChanges.subscribe(c => {
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
