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
import { MetadataService } from 'src/app/modules/services/metadata.service';



@Component({
  selector: 'app-create-thoa-thuan-dam-bao',
  templateUrl: './create-thoa-thuan-dam-bao.component.html',
  styleUrls: ['./create-thoa-thuan-dam-bao.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe

  ]
})
export class CreateThoaThuanDamBaoComponent implements OnInit {

  @Input() _ThoaThuanDamBao: ThoaThuanDamBao;
  EMPTY: any;
  ChiTietEmty: any;
  ThoaThuanDamBao: ThoaThuanDamBao
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
    public ThoaThuanDamBaoService: ThoaThuanDamBaoService,
    public commonService: CommonService,
    public MetadataService:MetadataService,
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
    this.ThoaThuanDamBao = Object.assign(new ThoaThuanDamBao(), this.EMPTY);
    this.loadForm();
    this.MetadataService.getUQs().subscribe(re=>{
      this.MetadataService.listUQ$.pipe().subscribe(  (res) => {
        var item=res[0];
        if(item){
          this.ThoaThuanDamBao.VanBanUQ=item.soUquyen;
          this.ThoaThuanDamBao.NgayKyUQ=DateTimeUtil.convertDateToStringVNDefaulDateNow(item.ngayUquyen);
          this.ThoaThuanDamBao.NgayUQ=DateTimeUtil.convertDateToStringVNDefaulDateNow(item.ngayUquyen);
          this.ThoaThuanDamBao.NguoiKyUQ=item.tnguoiUquyen;
          this.ThoaThuanDamBao.ChucVuUQ=item.cvuUquyen;
          this.ThoaThuanDamBao.DaiDien=item.tenUquyen;
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
    });
   
   
    if (this._ThoaThuanDamBao !== null) {
      this.ThoaThuanDamBao = Object.assign(new ThoaThuanDamBao(), this._ThoaThuanDamBao);
      this.loadForm();
      var listTTDB = this.ThoaThuanDamBao.GiaTriDamBao;
      if (listTTDB.length > 0) {
        const control = this.dataTable.get('tableRows') as FormArray;
        listTTDB.forEach(tp => {
          const group = this.fb.group({
            MucDich: [tp.MucDich],
            SLTrungBinh: [tp.SLTrungBinh],
            SoNgayDamBao: [tp.SoNgayDamBao],
            GiaBanDien: [tp.GiaBanDien],
            ThanhTien: [tp.ThanhTien],
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
        Gio: [this.ThoaThuanDamBao.Gio],
        Phut: [this.ThoaThuanDamBao.Phut],
        NgayLap: [this.ThoaThuanDamBao.NgayLap],
        DiaDiem: [this.ThoaThuanDamBao.DiaDiem],

        DonVi: [this.ThoaThuanDamBao.DonVi],
        MaSoThue: [this.ThoaThuanDamBao.MaSoThue],
        DaiDien: [this.ThoaThuanDamBao.DaiDien],
        ChucVu: [this.ThoaThuanDamBao.ChucVu],
        VanBanUQ: [this.ThoaThuanDamBao.VanBanUQ],
        NgayUQ: [this.ThoaThuanDamBao.NgayUQ],
        NguoiKyUQ: [this.ThoaThuanDamBao.NguoiKyUQ],
        NgayKyUQ: [this.ThoaThuanDamBao.NgayKyUQ],
        ChucVuUQ: [this.ThoaThuanDamBao.ChucVuUQ],
        DiaChi: [this.ThoaThuanDamBao.DiaChi],
        DienThoai: [this.ThoaThuanDamBao.DienThoai],
        Email: [this.ThoaThuanDamBao.Email],
        DienThoaiCSKH: [this.ThoaThuanDamBao.DienThoaiCSKH],
        SoTaiKhoan: [this.ThoaThuanDamBao.SoTaiKhoan],
        NganHang: [this.ThoaThuanDamBao.NganHang],
        KHMa: [this.ThoaThuanDamBao.KHMa],
        KHTen: [this.ThoaThuanDamBao.KHTen],
        KHDaiDien: [this.ThoaThuanDamBao.KHDaiDien],
        KHDiaChi: [this.ThoaThuanDamBao.KHDiaChi],
        KHDienThoai: [this.ThoaThuanDamBao.KHDienThoai],
        KHEmail: [this.ThoaThuanDamBao.KHEmail],
        KHSoTK: [this.ThoaThuanDamBao.KHSoTK],
        KHNganHang: [this.ThoaThuanDamBao.KHNganHang],
        KHSoGiayTo: [this.ThoaThuanDamBao.KHSoGiayTo],
        KHChucVu :  [this.ThoaThuanDamBao.KHChucVu],
        KHMaSoThue :  [this.ThoaThuanDamBao.KHMaSoThue],
        KHDangKyKD : [this.ThoaThuanDamBao.KHDangKyKD],

        NgayCap:  [this.ThoaThuanDamBao.NgayCap],
        NoiCap:  [this.ThoaThuanDamBao.NoiCap],
    
        KHVanBanUQ: [this.ThoaThuanDamBao.KHVanBanUQ],
        KHNguoiUQ: [this.ThoaThuanDamBao.KHNguoiUQ],
        KHNgayUQ: [this.ThoaThuanDamBao.KHNgayUQ],

        GiaTriTien: [this.ThoaThuanDamBao.GiaTriTien],
        TienBangChu: [this.ThoaThuanDamBao.TienBangChu],

        TuNgay: [this.ThoaThuanDamBao.TuNgay],
        DenNgay: [this.ThoaThuanDamBao.DenNgay],

        HinhThuc: [this.ThoaThuanDamBao.HinhThuc],
        GhiChu: [this.ThoaThuanDamBao.GhiChu],
        Data: [this.ThoaThuanDamBao.Data],
        GiaTriDamBao: [this.ThoaThuanDamBao.GiaTriDamBao],

      });
    }
    catch (error) {

    }
  }
  private prepareSave() {
    this.formGroup.markAllAsTouched();
    const formValues = this.formGroup.value;
    this.ThoaThuanDamBao = Object.assign(this.ThoaThuanDamBao, formValues);
    this.ThoaThuanDamBao.GiaTriDamBao = [];
    this.dataTable.markAllAsTouched();
    const control = this.dataTable.get('tableRows') as FormArray;

    control.controls.forEach(control => {
      const formValue = control.value;
      var ChiTietDamBao = Object.assign({}, formValue);
      if (ChiTietDamBao.MucDich != null && ChiTietDamBao.MucDich != "") {
        this.ThoaThuanDamBao.GiaTriDamBao.push(ChiTietDamBao);
      }
    });
  }
  save() {
    this.prepareSave();
    if (this.ThoaThuanDamBao.ID > 0) {
      this.edit();
    }
    else {
      this.create();
    }
  }


  edit() {
    const sbUpdate = this.ThoaThuanDamBaoService.update(this.ThoaThuanDamBao).pipe(
      tap(() => {
        this.ThoaThuanDamBao = Object.assign(new ThoaThuanDamBao(), this.EMPTY);
        this.loadForm();
        this.toastr.success('Lập biên bản thành công', 'Thông báo');
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.toastr.error('Có lỗi xảy ra', 'Thông báo');
        this.modal.dismiss(errorMessage);
        return of(this.ThoaThuanDamBao);
      }),
    ).subscribe(res => this.ThoaThuanDamBao = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.ThoaThuanDamBaoService.create(this.ThoaThuanDamBao).pipe(
      tap(() => {
        this.ThoaThuanDamBao = Object.assign(new ThoaThuanDamBao(), this.EMPTY);
        this.loadForm();
        this.toastr.success('Lập biên bản thành công', 'Thông báo');
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.toastr.error('Có lỗi xảy ra', 'Thông báo');
        this.modal.dismiss(errorMessage);
        return of(this.ThoaThuanDamBao);
      }),
    ).subscribe((res: ThoaThuanDamBao) => this.ThoaThuanDamBao = res);
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
  tinhthanhtien(index: number, group: FormGroup) {
   
        const control = this.dataTable.get('tableRows') as FormArray;
        var sltb=Number.isNaN(parseFloat(control.controls[index].get('SLTrungBinh').value))?0:parseFloat(control.controls[index].get('SLTrungBinh').value);
        var sndb=Number.isNaN(parseFloat(control.controls[index].get('SoNgayDamBao').value))?0:parseFloat(control.controls[index].get('SoNgayDamBao').value);;
        var gbd=Number.isNaN(parseFloat(control.controls[index].get('GiaBanDien').value))?0:parseFloat(control.controls[index].get('GiaBanDien').value);;
        control.controls[index].get('ThanhTien').setValue(sltb*sndb*gbd);
        this.tinhtong();
   
  }
tinhtong(){
  var tong=0;
  const control = this.dataTable.get('tableRows') as FormArray;

  control.controls.forEach(control => {
    var tt = Number.isNaN(parseFloat(control.get('ThanhTien').value))?0:parseFloat(control.get('ThanhTien').value);
    tong=tong+tt;
  });
  this.ThoaThuanDamBao.GiaTriTien=tong;
  this.formGroup = this.fb.group({
    GiaTriTien: [this.ThoaThuanDamBao.GiaTriTien],
  });
}

getUQData(event){
  const value = event.target.value;
  this.MetadataService.listUQ$.pipe().subscribe(  (res) => {
  var item=res.filter(x=>x.tnguoiUquyen===value)[0];
  if(item){
    this.ThoaThuanDamBao.VanBanUQ=item.soUquyen;
    this.ThoaThuanDamBao.NgayKyUQ=DateTimeUtil.convertDateToStringVNDefaulDateNow(item.ngayUquyen);
    this.ThoaThuanDamBao.NgayUQ=DateTimeUtil.convertDateToStringVNDefaulDateNow(item.ngayUquyen);
    this.ThoaThuanDamBao.NguoiKyUQ=item.tnguoiUquyen;
    this.ThoaThuanDamBao.ChucVuUQ=item.cvuUquyen;
    this.ThoaThuanDamBao.DaiDien=item.tenUquyen;
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
