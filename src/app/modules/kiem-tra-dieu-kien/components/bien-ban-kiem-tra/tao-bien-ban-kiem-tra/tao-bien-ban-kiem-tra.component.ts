import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { BienBanKT } from 'src/app/modules/models/bienbankt.model';
import { ThanhPhanDaiDien } from 'src/app/modules/models/thanhphankt.modell';
import { CommonService } from 'src/app/modules/services/base.service';
import { BienBanKTService } from 'src/app/modules/services/bienbankt.service';

@Component({
  selector: 'app-tao-bien-ban-kiem-tra',
  templateUrl: './tao-bien-ban-kiem-tra.component.html',
  styleUrls: ['./tao-bien-ban-kiem-tra.component.scss']
})
export class TaoBienBanKiemTraComponent implements OnInit {
  @Input() bienBanKT: BienBanKT;
  EMPTY: any;
  ChiTietEmty: any;
  formGroup: FormGroup;
  dataTable: FormGroup;
  isLoadingForm$ = new BehaviorSubject<boolean>(false)
  private subscriptions: Subscription[] = [];
  startDate = new Date();
  constructor(
    public commonService: CommonService,
    public service: BienBanKTService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private router: Router,

  ) {
    this.EMPTY = {
      CongVanID: undefined,
      SoBienBan: undefined,
      TenCongTrinh: undefined,
      DiaDiemXayDung: undefined,

      ThoaThuanID: undefined,
      SoThoaThuan: undefined,
      NgayThoaThuan: undefined,
      ThoaThuanDauNoi: undefined,

      DonVi: undefined,
      MaSoThue: undefined,
      DaiDien: undefined,
      ChucVu: undefined,

      KHTen: undefined,
      KHDaiDien: undefined,
      KHChucVu: undefined,
      KHDiaChi: undefined,
      KHDienThoai: undefined,
      KHMaSoThue: undefined,

      QuyMo: undefined,
      HoSoKemTheo: undefined,
      KetQuaKiemTra: undefined,
      TonTai: undefined,
      KienNghi: undefined,
      YKienKhac: undefined,
      KetLuan: undefined,
      ThoiHanDongDien: undefined,
      MaCViec: undefined,
      TrangThai: undefined
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
  control: FormArray;
  mode: boolean;

  tabs = {
    ThongTinChung: 1,
    NoiDungKiemTra: 2
  };
  activeTabId = this.tabs.ThongTinChung; // 0 => Basic info;
  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    this.isLoadingForm$.next(true);
    this.loadForm();
    if (this.bienBanKT !== null) {
      if (this.bienBanKT.ThanhPhans.length > 0) {
        var thanhphanEVN = this.bienBanKT.ThanhPhans.filter(x => x.Loai == 0).map(x => x);
        var thanhphanKH = this.bienBanKT.ThanhPhans.filter(x => x.Loai == 1).map(x => x);
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
      this.loadForm();
    }
    this.addRowEVN();
    this.addRowKH();
    this.isLoadingForm$.next(false);
  }
  loadForm() {
    try {
      this.formGroup = this.fb.group({
        CongVanID: [this.bienBanKT.CongVanID],
        SoBienBan: [this.bienBanKT.SoBienBan],
        TenCongTrinh: [this.bienBanKT.TenCongTrinh, Validators.required],
        DiaDiemXayDung: [this.bienBanKT.DiaDiemXayDung, Validators.required],

        ThoaThuanID: [this.bienBanKT.ThoaThuanID],
        SoThoaThuan: [this.bienBanKT.SoThoaThuan],
        NgayThoaThuan: [this.bienBanKT.NgayThoaThuan],
        ThoaThuanDauNoi: [this.bienBanKT.ThoaThuanDauNoi],

        DonVi: [this.bienBanKT.DonVi],
        MaSoThue: [this.bienBanKT.MaSoThue],
        DaiDien: [this.bienBanKT.DaiDien, Validators.required],
        ChucVu: [this.bienBanKT.ChucVu, Validators.required],

        KHTen: [this.bienBanKT.KHTen, Validators.required],
        KHDaiDien: [this.bienBanKT.KHDaiDien, Validators.required],
        KHChucVu: [this.bienBanKT.KHChucVu, Validators.required],
        KHDiaChi: [this.bienBanKT.KHDiaChi],
        KHDienThoai: [this.bienBanKT.KHDienThoai],
        KHMaSoThue: [this.bienBanKT.KHMaSoThue],

        QuyMo: [this.bienBanKT.QuyMo, Validators.required],
        HoSoKemTheo: [this.bienBanKT.HoSoKemTheo, Validators.required],
        KetQuaKiemTra: [this.bienBanKT.KetQuaKiemTra, Validators.required],
        TonTai: [this.bienBanKT.TonTai],
        KienNghi: [this.bienBanKT.KienNghi],
        YKienKhac: [this.bienBanKT.YKienKhac],
        KetLuan: [this.bienBanKT.KetLuan, Validators.required],
        ThoiHanDongDien: [this.bienBanKT.ThoiHanDongDien, Validators.required],
        MaCViec: [this.bienBanKT.MaCViec],
        TrangThai: [this.bienBanKT.TrangThai],
        ThanhPhans: [this.bienBanKT.ThanhPhans]
      });
    }
    catch (error) {

    }
  }

  save() {
    this.formGroup.markAllAsTouched();
    const formValues = this.formGroup.value;
    this.bienBanKT = Object.assign(this.bienBanKT, formValues);

    this.bienBanKT.ThanhPhans = [];
    this.dataTable.markAllAsTouched();
    const controlEVN = this.dataTable.get('tableEVNDD') as FormArray;
    const controlKH = this.dataTable.get('tableKHDD') as FormArray;

    controlEVN.controls.forEach(control => {
      const formEVNValues = control.value;
      var envThanhPhan = Object.assign(new ThanhPhanDaiDien, null);
      envThanhPhan = Object.assign(envThanhPhan, formEVNValues);
      if (envThanhPhan.DaiDien != null && envThanhPhan.DaiDien != "") {
        envThanhPhan.Loai = 0;
        this.bienBanKT.ThanhPhans.push(envThanhPhan);
      }

    });
    controlKH.controls.forEach(control => {
      const formKHValues = control.value;
      var khThanhPhan = Object.assign(new ThanhPhanDaiDien, null);
      khThanhPhan = Object.assign(khThanhPhan, formKHValues);
      if (khThanhPhan.DaiDien != null && khThanhPhan.DaiDien != "") {
        khThanhPhan.Loai = 1;
        this.bienBanKT.ThanhPhans.push(khThanhPhan);
      }

    });


    if (this.bienBanKT.ID > 0) {
      this.edit();
    }
    else {
      this.create();
    }
  }

  edit() {
    this.isLoadingForm$.next(true);
    const sbUpdate = this.service.update(this.bienBanKT).pipe(
      tap(() => {
        this.bienBanKT = Object.assign(new BienBanKT(), this.EMPTY);
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.bienBanKT);
      }),
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe(res => this.bienBanKT = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.isLoadingForm$.next(true);
    const sbCreate = this.service.create(this.bienBanKT).pipe(
      tap(() => {
        this.bienBanKT = Object.assign(new BienBanKT(), this.EMPTY);
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.bienBanKT);
      }),
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((res: BienBanKT) => this.bienBanKT = res);
    this.subscriptions.push(sbCreate);
  }

  initiateForm(ThanhPhanDaiDien: ThanhPhanDaiDien): FormGroup {
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
    var formgroup = this.initiateForm(Object.assign(new ThanhPhanDaiDien(), this.ChiTietEmty));
    formgroup.controls.DaiDien.valueChanges.subscribe(c => {
      if (!formgroup.controls.AddRow.value) {
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
    var formgroup = this.initiateForm(Object.assign(new ThanhPhanDaiDien(), this.ChiTietEmty));
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
