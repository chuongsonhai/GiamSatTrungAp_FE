import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

import {
  NgbActiveModal,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";
import { BehaviorSubject, concat, merge, of, Subscription } from "rxjs";
import { catchError, finalize, first, tap } from "rxjs/operators";
import {
  CustomAdapter,
  CustomDateParserFormatter,
} from "src/app/_metronic/core";
import { DatePipe } from "@angular/common";
import * as _moment from "moment";
import { ResponseModel } from "src/app/modules/models/response.model";
import { Router } from "@angular/router";
import DateTimeUtil from "src/app/_metronic/shared/datetime.util";
import { CommonService } from "src/app/modules/services/base.service";
import {
  GiaDienTheoMucDich,
  MucDichThucTeSDD,
  ThoaThuanTyLe,
} from "src/app/modules/models/thoathuantyle.model";
import { ThoaThuanTyLeService } from "src/app/modules/services/thoathuantyle.service";
import { ToastrService } from "ngx-toastr";
import { MetadataService } from "src/app/modules/services/metadata.service";
import { GiaNhomData } from "src/app/modules/models/gianhomdata.model";
import { Options } from "select2";
@Component({
  selector: "app-thoa-thuan-ty-le",
  templateUrl: "./thoa-thuan-ty-le.component.html",
  styleUrls: ["./thoa-thuan-ty-le.component.scss"],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe,
  ],
})
export class ThoaThuanTyLeComponent implements OnInit {
  @Input() _ThoaThuanTyLe: ThoaThuanTyLe;
  EMPTY: any;
  MucDichEmty: any;
  GiaDienEmty: any;
  ThoaThuanTyLe: ThoaThuanTyLe;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  formGroup: FormGroup;
  dataTable: FormGroup;
  control: FormArray;
  mode: boolean;
  startDate = new Date();
  private subscriptions: Subscription[] = [];
  public options: Options;
  constructor(
    public ThoaThuanTyLeService: ThoaThuanTyLeService,
    public commonService: CommonService,
    public MetadataService: MetadataService,
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
      MaYeuCau: undefined,
      MaDViQLy: undefined,
      Data: undefined,
      NgayLap: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      DiaDiem: undefined,
      DiaChiGiaoDich: undefined,
      DonVi: undefined,
      MaSoThue: undefined,
      SoTaiKhoan: undefined,
      NganHang: undefined,
      DienThoai: undefined,
      Fax: undefined,
      Email: undefined,
      DienThoaiCSKH: undefined,
      Website: undefined,
      DaiDien: undefined,
      ChucVu: undefined,
      SoGiayTo: undefined,
      NgayCap: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      NoiCap: undefined,
      VanBanUQ: undefined,
      NgayUQ: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      NguoiKyUQ: undefined,
      NgayKyUQ: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      ChucVuUQ: undefined,
      KHTen: undefined,
      KHMa: undefined,
      KHDiaChiGiaoDich: undefined,
      KHDiaChiDungDien: undefined,
      KHDangKyKD: undefined,
      KHNoiCapDangKyKD: undefined,
      KHNgayCaoDangKyKD: DateTimeUtil.convertDateToStringVNDefaulDateNow(
        this.startDate
      ),
      KHMaSoThue: undefined,
      KHSoTK: undefined,
      KHNganHang: undefined,
      KHDienThoai: undefined,
      KHFax: undefined,
      KHEmail: undefined,
      KHDaiDien: undefined,
      KHChucVu: undefined,
      KHSoGiayTo: undefined,
      KHNgayCap: DateTimeUtil.convertDateToStringVNDefaulDateNow(
        this.startDate
      ),
      KHNoiCap: undefined,
      KHVanBanUQ: undefined,
      KHNgayUQ: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      KHNguoiKyUQ: undefined,
      KHNgayKyUQ: DateTimeUtil.convertDateToStringVNDefaulDateNow(
        this.startDate
      ),
      UngDung: undefined,
      TrangThai: 0,
      MucDichThucTeSDD: [],
      GiaDienTheoMucDich: [],
    };
    this.dataTable = this.fb.group({
      tableGiaDienRows: this.fb.array([]),
      tableMucDichRows: this.fb.array([]),
    });
    this.MucDichEmty = {
      ID: 0,
      ThoaThuanID: 0,
      TenThietBi: undefined,
      CongSuat: 0,
      SoLuong: 0,
      HeSoDongThoi: 0,
      SoGio: 0,
      SoNgay: 0,
      TongCongSuatSuDung: 0,
      DienNangSuDung: 0,
      MucDichSDD: undefined,
    };
    this.GiaDienEmty = {
      ID: 0,
      ThoaThuanID: 0,
      SoCongTo: undefined,
      MaGhiChiSo: undefined,
      ApDungTuChiSo: undefined,
      MucDichSuDung: undefined,
      TyLe: undefined,
      GDKhongTheoTG: "",
      GDGioBT: "",
      GDGioCD: "",
      GDGioTD: "",
    };
    this.options = {
      placeholder: "--- Chọn đơn giá ---",
      allowClear: true,
      width: "100px",
    };
  }

  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    this.ThoaThuanTyLe = Object.assign(new ThoaThuanTyLe(), this.EMPTY);

    this.loadForm();
    this.MetadataService.getUQs().subscribe((re) => {
      this.MetadataService.listUQ$.pipe().subscribe((res) => {
        var item = res[0];
        if (item) {
          this.ThoaThuanTyLe.VanBanUQ = item.soUquyen;
          this.ThoaThuanTyLe.NgayKyUQ =
            DateTimeUtil.convertDateToStringVNDefaulDateNow(item.ngayUquyen);
          this.ThoaThuanTyLe.NgayUQ =
            DateTimeUtil.convertDateToStringVNDefaulDateNow(item.ngayUquyen);
          this.ThoaThuanTyLe.NguoiKyUQ = item.tnguoiUquyen;
          this.ThoaThuanTyLe.ChucVuUQ = item.cvuUquyen;
          this.ThoaThuanTyLe.DaiDien = item.tenUquyen;
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
      });
    });

    if (this._ThoaThuanTyLe !== null) {
      this.ThoaThuanTyLe = Object.assign(
        new ThoaThuanTyLe(),
        this._ThoaThuanTyLe
      );
      this.loadForm();
      var listMucDich = this.ThoaThuanTyLe.MucDichThucTeSDD;
      var listGiaDien = this.ThoaThuanTyLe.GiaDienTheoMucDich;
      if (listMucDich.length > 0) {
        const control = this.dataTable.get("tableMucDichRows") as FormArray;
        listMucDich.forEach((tp) => {
          const group = this.fb.group({
            TenThietBi: [tp.TenThietBi],
            CongSuat: [tp.CongSuat],
            SoLuong: [tp.SoLuong],
            HeSoDongThoi: [tp.HeSoDongThoi],
            SoGio: [tp.SoGio],
            SoNgay: [tp.SoNgay],
            TongCongSuatSuDung: [tp.TongCongSuatSuDung],
            DienNangSuDung: [tp.DienNangSuDung],
            MucDichSDD: [tp.MucDichSDD],
            AddRow: [false],
          });
          control.push(group);
        });
      }
      if (listGiaDien.length > 0) {
        const control = this.dataTable.get("tableGiaDienRows") as FormArray;
        listGiaDien.forEach((tp) => {
          const group = this.fb.group({
            SoCongTo: [tp.SoCongTo],
            MaGhiChiSo: [tp.MaGhiChiSo],
            ApDungTuChiSo: [tp.ApDungTuChiSo],
            MucDichSuDung: [tp.MucDichSuDung],
            TyLe: [tp.TyLe],
            GDKhongTheoTG: [tp.GDKhongTheoTG],
            GDGioBT: [tp.GDGioBT],
            GDGioCD: [tp.GDGioCD],
            GDGioTD: [tp.GDGioTD],
            AddRow: [false],
          });
          control.push(group);
        });
      }
      this.isLoadingForm$.next(false);
    }
    this.addRowMucDich();
    this.addRowGiaDien();
  }
  loadForm() {
    try {
      this.formGroup = this.fb.group({
        MaYeuCau: [this.ThoaThuanTyLe.MaYeuCau],
        MaDViQLy: [this.ThoaThuanTyLe.MaDViQLy],
        Data: [this.ThoaThuanTyLe.Data],
        NgayLap: [this.ThoaThuanTyLe.NgayLap],
        DiaDiem: [this.ThoaThuanTyLe.DiaDiem],
        DiaChiGiaoDich: [this.ThoaThuanTyLe.DiaChiGiaoDich],
        DonVi: [this.ThoaThuanTyLe.DonVi],
        MaSoThue: [this.ThoaThuanTyLe.MaSoThue],
        SoTaiKhoan: [this.ThoaThuanTyLe.SoTaiKhoan],
        NganHang: [this.ThoaThuanTyLe.NganHang],
        DienThoai: [this.ThoaThuanTyLe.DienThoai],
        Fax: [this.ThoaThuanTyLe.Fax],
        Email: [this.ThoaThuanTyLe.Email],
        DienThoaiCSKH: [this.ThoaThuanTyLe.DienThoaiCSKH],
        Website: [this.ThoaThuanTyLe.Website],
        DaiDien: [this.ThoaThuanTyLe.DaiDien],
        ChucVu: [this.ThoaThuanTyLe.ChucVu],
        SoGiayTo: [this.ThoaThuanTyLe.SoGiayTo],
        NgayCap: [this.ThoaThuanTyLe.NgayCap],
        NoiCap: [this.ThoaThuanTyLe.NoiCap],

        NguoiKyUQ: [this.ThoaThuanTyLe.NguoiKyUQ],

        KHTen: [this.ThoaThuanTyLe.KHTen],
        KHMa: [this.ThoaThuanTyLe.KHMa],
        KHDiaChiGiaoDich: [this.ThoaThuanTyLe.KHDiaChiGiaoDich],
        KHDiaChiDungDien: [this.ThoaThuanTyLe.KHDiaChiDungDien],
        KHDangKyKD: [this.ThoaThuanTyLe.KHDangKyKD],
        KHNoiCapDangKyKD: [this.ThoaThuanTyLe.KHNoiCapDangKyKD],
        KHNgayCaoDangKyKD: [this.ThoaThuanTyLe.KHNgayCaoDangKyKD],
        KHMaSoThue: [this.ThoaThuanTyLe.KHMaSoThue],
        KHSoTK: [this.ThoaThuanTyLe.KHSoTK],
        KHNganHang: [this.ThoaThuanTyLe.KHNganHang],
        KHDienThoai: [this.ThoaThuanTyLe.KHDienThoai],
        KHFax: [this.ThoaThuanTyLe.KHFax],
        KHEmail: [this.ThoaThuanTyLe.KHEmail],
        KHDaiDien: [this.ThoaThuanTyLe.KHDaiDien],
        KHChucVu: [this.ThoaThuanTyLe.KHChucVu],
        KHSoGiayTo: [this.ThoaThuanTyLe.KHSoGiayTo],
        KHNgayCap: [this.ThoaThuanTyLe.KHNgayCap],
        KHNoiCap: [this.ThoaThuanTyLe.KHNoiCap],
        KHVanBanUQ: [this.ThoaThuanTyLe.KHVanBanUQ],
        KHNgayUQ: [this.ThoaThuanTyLe.KHNgayUQ],
        KHNguoiKyUQ: [this.ThoaThuanTyLe.KHNguoiKyUQ],
        KHNgayKyUQ: [this.ThoaThuanTyLe.KHNgayKyUQ],
        UngDung: [this.ThoaThuanTyLe.UngDung],
        TrangThai: [this.ThoaThuanTyLe.TrangThai],
        MucDichThucTeSDD: [this.ThoaThuanTyLe.MucDichThucTeSDD],
        GiaDienTheoMucDich: [this.ThoaThuanTyLe.GiaDienTheoMucDich],

        VanBanUQ: [this.ThoaThuanTyLe.VanBanUQ],
        NgayUQ: [this.ThoaThuanTyLe.NgayUQ],
        NgayKyUQ: [this.ThoaThuanTyLe.NgayKyUQ],
        ChucVuUQ: [this.ThoaThuanTyLe.ChucVuUQ],
      });
    } catch (error) {}
  }
  private prepareSave() {
    this.formGroup.markAllAsTouched();
    const formValues = this.formGroup.value;
    console.log(formValues);
    console.log(this.formGroup.value);
    this.ThoaThuanTyLe = Object.assign(this.ThoaThuanTyLe, formValues);
    this.ThoaThuanTyLe.MucDichThucTeSDD = [];
    this.ThoaThuanTyLe.GiaDienTheoMucDich = [];
    this.dataTable.markAllAsTouched();
    const controlMucDich = this.dataTable.get("tableMucDichRows") as FormArray;

    controlMucDich.controls.forEach((control) => {
      const formValue = control.value;
      var ChiTietMucDich = Object.assign({}, formValue);
      if (
        ChiTietMucDich.TenThietBi != null &&
        ChiTietMucDich.TenThietBi != ""
      ) {
        this.ThoaThuanTyLe.MucDichThucTeSDD.push(ChiTietMucDich);
      }
    });
    const controlGiaDien = this.dataTable.get("tableGiaDienRows") as FormArray;

    controlGiaDien.controls.forEach((control) => {
      const formValue = control.value;
      var ChiTietGiaDien = Object.assign({}, formValue);
      if (
        ChiTietGiaDien.MucDichSuDung != null &&
        ChiTietGiaDien.MucDichSuDung != ""
      ) {
        this.ThoaThuanTyLe.GiaDienTheoMucDich.push(ChiTietGiaDien);
      }
    });
  }
  save() {
    this.prepareSave();
    if (this.ThoaThuanTyLe.ID > 0) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.ThoaThuanTyLeService.update(this.ThoaThuanTyLe)
      .pipe(
        tap(() => {
          this.ThoaThuanTyLe = Object.assign(new ThoaThuanTyLe(), this.EMPTY);
          this.loadForm();
          this.toastr.success("Lập biên bản thành công", "Thông báo");
          this.modal.close();
        }),
        catchError((errorMessage) => {
          this.toastr.error("Có lỗi xảy ra", "Thông báo");
          this.modal.dismiss(errorMessage);
          return of(this.ThoaThuanTyLe);
        })
      )
      .subscribe((res) => (this.ThoaThuanTyLe = res));
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.ThoaThuanTyLeService.create(this.ThoaThuanTyLe)
      .pipe(
        tap(() => {
          this.ThoaThuanTyLe = Object.assign(new ThoaThuanTyLe(), this.EMPTY);
          this.loadForm();
          this.toastr.success("Lập biên bản thành công", "Thông báo");
          this.modal.close();
        }),
        catchError((errorMessage) => {
          this.toastr.error("Có lỗi xảy ra", "Thông báo");
          this.modal.dismiss(errorMessage);
          return of(this.ThoaThuanTyLe);
        })
      )
      .subscribe((res: ThoaThuanTyLe) => (this.ThoaThuanTyLe = res));
    this.subscriptions.push(sbCreate);
  }

  initiateFormMucDich(ChiTietMucDich: MucDichThucTeSDD): FormGroup {
    var form = this.fb.group({
      TenThietBi: [ChiTietMucDich.TenThietBi],
      CongSuat: [ChiTietMucDich.CongSuat],
      SoLuong: [ChiTietMucDich.SoLuong],
      HeSoDongThoi: [ChiTietMucDich.HeSoDongThoi],
      SoGio: [ChiTietMucDich.SoGio],
      SoNgay: [ChiTietMucDich.SoNgay],
      TongCongSuatSuDung: [ChiTietMucDich.TongCongSuatSuDung],
      DienNangSuDung: [ChiTietMucDich.DienNangSuDung],
      MucDichSDD: [ChiTietMucDich.MucDichSDD],

      AddRow: [false],
    });
    return form;
  }
  addRowMucDich() {
    const control = this.dataTable.get("tableMucDichRows") as FormArray;
    var formgroup = this.initiateFormMucDich(
      Object.assign(new MucDichThucTeSDD(), this.MucDichEmty)
    );
    formgroup.controls.TenThietBi.valueChanges.subscribe((c) => {
      if (!formgroup.controls.AddRow.value) {
        formgroup.controls.AddRow.setValue(true);
        this.addRowMucDich();
      }
    });

    control.push(formgroup);
  }
  deleteRowMucDich(index: number, group: FormGroup) {
    if (index > 0) {
      if (!group.value.isCreateNewRow) {
        const control = this.dataTable.get("tableMucDichRows") as FormArray;
        control.removeAt(index);
        control.controls[index - 1].get("AddRow").setValue(false);
      }
    }
  }
  get getFormMucDichControls() {
    const control = this.dataTable.get("tableMucDichRows") as FormArray;
    return control;
  }

  initiateFormGiaDien(ChiTietGiaDien: GiaDienTheoMucDich): FormGroup {
    var form = this.fb.group({
      SoCongTo: [ChiTietGiaDien.SoCongTo],
      MaGhiChiSo: [ChiTietGiaDien.MaGhiChiSo],
      ApDungTuChiSo: [ChiTietGiaDien.ApDungTuChiSo],
      MucDichSuDung: [ChiTietGiaDien.MucDichSuDung],
      TyLe: [ChiTietGiaDien.TyLe],
      GDKhongTheoTG: [ChiTietGiaDien.GDKhongTheoTG],
      GDGioBT: [ChiTietGiaDien.GDGioBT],
      GDGioCD: [ChiTietGiaDien.GDGioCD],
      GDGioTD: [ChiTietGiaDien.GDGioTD],

      AddRow: [false],
    });
    return form;
  }
  addRowGiaDien() {
    const control = this.dataTable.get("tableGiaDienRows") as FormArray;
    var formgroup = this.initiateFormGiaDien(
      Object.assign(new GiaDienTheoMucDich(), this.GiaDienEmty)
    );
    formgroup.controls.SoCongTo.valueChanges.subscribe((c) => {
      if (!formgroup.controls.AddRow.value) {
        formgroup.controls.AddRow.setValue(true);
        this.addRowGiaDien();
      }
    });

    control.push(formgroup);
  }
  deleteRowGiaDien(index: number, group: FormGroup) {
    if (index > 0) {
      if (!group.value.isCreateNewRow) {
        const control = this.dataTable.get("tableGiaDienRows") as FormArray;
        control.removeAt(index);
        control.controls[index - 1].get("AddRow").setValue(false);
      }
    }
  }

  changeKT(index: number, group: FormGroup) {
    if (!group.value.isCreateNewRow) {
      const control = this.dataTable.get("tableGiaDienRows") as FormArray;
      control.controls[index].get("GDGioBT").setValue("");
      control.controls[index].get("GDGioCD").setValue("");
      control.controls[index].get("GDGioTD").setValue("");
    }
  }
  // changeTTG(index: number, group: FormGroup,value:string) {

  //     if (!group.value.isCreateNewRow) {
  //       const control = this.dataTable.get('tableGiaDienRows') as FormArray;
  //       control.controls[index].get('GDKhongTheoTG').setValue("");
  //       control.controls[index].get('GDGioBT').setValue(value);
  //       control.controls[index].get('GDGioCD').setValue(value);
  //       control.controls[index].get('GDGioTD').setValue(value);
  //     }

  // }
  changeBT(index: number, group: FormGroup, value: string) {
    if (!group.value.isCreateNewRow) {
      const control = this.dataTable.get("tableGiaDienRows") as FormArray;
      control.controls[index].get("GDKhongTheoTG").setValue("");
      control.controls[index].get("GDGioBT").setValue(value);
    }
  }
  changeCD(index: number, group: FormGroup, value: string) {
    if (!group.value.isCreateNewRow) {
      const control = this.dataTable.get("tableGiaDienRows") as FormArray;
      control.controls[index].get("GDKhongTheoTG").setValue("");
      control.controls[index].get("GDGioCD").setValue(value);
    }
  }
  changeTD(index: number, group: FormGroup, value: string) {
    if (!group.value.isCreateNewRow) {
      const control = this.dataTable.get("tableGiaDienRows") as FormArray;
      control.controls[index].get("GDKhongTheoTG").setValue("");
      control.controls[index].get("GDGioTD").setValue(value);
    }
  }

  get getFormGiaDienControls() {
    const control = this.dataTable.get("tableGiaDienRows") as FormArray;
    return control;
  }
  tinhtong(index: number, group: FormGroup) {
    const control = this.dataTable.get("tableMucDichRows") as FormArray;
    var cs = Number.isNaN(
      parseFloat(control.controls[index].get("CongSuat").value)
    )
      ? 0
      : parseFloat(control.controls[index].get("CongSuat").value);
    var sl = Number.isNaN(
      parseFloat(control.controls[index].get("SoLuong").value)
    )
      ? 0
      : parseFloat(control.controls[index].get("SoLuong").value);
    var hsdt = Number.isNaN(
      parseFloat(control.controls[index].get("HeSoDongThoi").value)
    )
      ? 0
      : parseFloat(control.controls[index].get("HeSoDongThoi").value);
    var sg = Number.isNaN(
      parseFloat(control.controls[index].get("SoGio").value)
    )
      ? 0
      : parseFloat(control.controls[index].get("SoGio").value);
    var sn = Number.isNaN(
      parseFloat(control.controls[index].get("SoNgay").value)
    )
      ? 0
      : parseFloat(control.controls[index].get("SoNgay").value);
    control.controls[index].get("TongCongSuatSuDung").setValue(cs * sl * hsdt);
    control.controls[index]
      .get("DienNangSuDung")
      .setValue(cs * sl * hsdt * sg * sn);
  }

  tinhtongNhom() {
    var tong = 0;
    const control = this.dataTable.get("tableMucDichRows") as FormArray;
    var listMucDich = [];
    control.controls.forEach((control) => {
      var mucdich = new MucDichThucTeSDD();

      var dnsd = Number.isNaN(parseFloat(control.get("DienNangSuDung").value))
        ? 0
        : parseFloat(control.get("DienNangSuDung").value);
      var mdsu = control.get("MucDichSDD").value;
      mucdich.DienNangSuDung = dnsd;
      mucdich.MucDichSDD = mdsu;
      if (mucdich.DienNangSuDung) {
        listMucDich.push(mucdich);
        tong = tong + dnsd;
      }
    });
    const control1 = this.dataTable.get("tableGiaDienRows") as FormArray;
    control1.clear();
    var groupNhom = this.groupByArray(listMucDich, "MucDichSDD");
    groupNhom.forEach((nhom) => {
      var tenNhom = nhom.key;
      var tongNhom = 0;
      nhom.values.forEach((mdn) => {
        tongNhom = tongNhom + mdn.DienNangSuDung;
      });
      var TyLeNhom = (tongNhom / tong) * 100;
      const group = this.fb.group({
        SoCongTo: "",
        MaGhiChiSo: "",
        ApDungTuChiSo: "",
        MucDichSuDung: tenNhom,
        TyLe: TyLeNhom.toFixed(2),
        GDKhongTheoTG: "",
        GDGioBT: "",
        GDGioCD: "",
        GDGioTD: "",
        AddRow: [false],
      });
      control1.push(group);
    });
  }
  groupByArray(xs, key) {
    return xs.reduce(function (rv, x) {
      let v = key instanceof Function ? key(x) : x[key];
      let el = rv.find((r) => r && r.key === v);
      if (el) {
        el.values.push(x);
      } else {
        rv.push({ key: v, values: [x] });
      }
      return rv;
    }, []);
  }

getUQData(event: Event) {
  const value = (event.target as HTMLSelectElement).value;

  this.MetadataService.listUQ$.subscribe((res) => {
    const item = res.find(x => String(x.idKey) === String(value));
    if (!item) return;

    this.ThoaThuanTyLe.VanBanUQ = item.soUquyen;
    this.ThoaThuanTyLe.NgayKyUQ = DateTimeUtil.convertDateToStringVNDefaulDateNow(item.ngayUquyen);
    this.ThoaThuanTyLe.NgayUQ   = DateTimeUtil.convertDateToStringVNDefaulDateNow(item.ngayUquyen);
    this.ThoaThuanTyLe.NguoiKyUQ = item.tnguoiUquyen;
    this.ThoaThuanTyLe.ChucVuUQ = item.cvuUquyen;
    this.ThoaThuanTyLe.DaiDien  = item.tenUquyen;

    this.formGroup.controls["VanBanUQ"].setValue(item.soUquyen);
    this.formGroup.controls["NgayKyUQ"].setValue(DateTimeUtil.convertDateToStringVNDefaulDateNow(item.ngayUquyen));
    this.formGroup.controls["NgayUQ"].setValue(DateTimeUtil.convertDateToStringVNDefaulDateNow(item.ngayUquyen));

    // ✅ QUAN TRỌNG: GIỮ SELECT = idKey, KHÔNG ĐÈ BẰNG TÊN
    this.formGroup.controls["NguoiKyUQ"].setValue(item.idKey, { emitEvent: false });

    this.formGroup.controls["ChucVuUQ"].setValue(item.cvuUquyen);
    this.formGroup.controls["DaiDien"].setValue(item.tenUquyen);
  });
}

  getGiaData(event) {
    const value = event.target.value;
    this.MetadataService.getGiaNhoms(value)
      .pipe(
        first(),
        catchError((errorMessage) => {
          return of(null);
        })
      )
      .subscribe();
  }
}
