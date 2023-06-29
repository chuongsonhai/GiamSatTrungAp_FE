import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ChiTietThietBiTreo,MayBienDong,MayBienDienAp,BienBanTT } from 'src/app/modules/models/bienbantt.model';
import { CommonService } from 'src/app/modules/services/base.service';
import { BienBanTTService } from 'src/app/modules/services/bienbantt.service';
import { Options } from 'select2';
@Component({
  selector: 'app-thong-tin-khach-hang',
  templateUrl: './thong-tin-khach-hang.component.html',
  styleUrls: ['./thong-tin-khach-hang.component.scss']
})
export class ThongTinKhachHangComponent implements OnInit {
  @Input() bienbantreothao: BienBanTT;
  EMPTY: any;
  
  isLoadingForm$ = new BehaviorSubject<boolean>(false)
  private subscriptions: Subscription[] = [];
  startDate = new Date();

  public optionsLD: Options;
  public optionsNV: Options;
  constructor(
    public commonService: CommonService,
    public service: BienBanTTService,
    private fb: FormBuilder,
    private router: Router,

  ) {
    this.EMPTY = {
      LY_DO:undefined,
      MA_LDO:undefined,
      MO_TA:undefined,
      TEN_KHACHHANG: undefined,
      SDT_KHACHHANG: undefined,
      NGUOI_DDIEN: undefined,
      DIA_DIEM: undefined,
      MA_DDO: undefined,
      MA_TRAM: undefined,
      MA_GCS: undefined,
      VTRI_LDAT: undefined,
      NVIEN_TTHAO: undefined,
      NVIEN_TTHAO2: undefined,
      NVIEN_TTHAO3: undefined,
      NVIEN_NPHONG: undefined,
      CTIET_VTLD:undefined,
    }
    this.optionsLD = {
      placeholder: "--- Lý do ---",
      allowClear: true,
      width: "100%",
    };
    this.optionsNV = {
      placeholder: "--- Nhân viên ---",
      allowClear: true,
      width: "100%",
    };
  }

  showCTietLDat: boolean = false;

  ngOnInit(): void {
    this.loadStaffs();
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);

    const example = merge(
      this.commonService.getLyDos(1)
    );
    this.showCTietLDat = this.bienbantreothao.VTRI_LDAT === "2";
    this.isLoadingForm$.next(true);
    const subscribe = example.pipe(
      catchError(err => {
        return of(undefined);
      }),
      finalize(() => {
        this.isLoadingForm$.next(false);
      })).subscribe();
    this.subscriptions.push(subscribe);

    this.isLoadingForm$.next(true);
    this.loadForm();
    this.isLoadingForm$.next(false);
  }
  loadForm() {
    try {
      this.service.BienBanTTForm = this.fb.group({
        LY_DO:[this.bienbantreothao.LY_DO],
        MA_LDO:[this.bienbantreothao.MA_LDO],
        MO_TA:[this.bienbantreothao.MO_TA],
        TEN_KHACHHANG: [this.bienbantreothao.TEN_KHACHHANG],
        SDT_KHACHHANG: [this.bienbantreothao.SDT_KHACHHANG],
        NGUOI_DDIEN: [this.bienbantreothao.NGUOI_DDIEN],
        DIA_DIEM: [this.bienbantreothao.DIA_DIEM],
        MA_DDO: [this.bienbantreothao.MA_DDO],
        MA_TRAM: [this.bienbantreothao.MA_TRAM],
        MA_GCS: [this.bienbantreothao.MA_GCS],
        VTRI_LDAT: [this.bienbantreothao.VTRI_LDAT],
        NVIEN_TTHAO: [this.bienbantreothao.NVIEN_TTHAO],
        NVIEN_TTHAO2: [this.bienbantreothao.NVIEN_TTHAO2],
        NVIEN_TTHAO3: [this.bienbantreothao.NVIEN_TTHAO3],
        NVIEN_NPHONG: [this.bienbantreothao.NVIEN_NPHONG],

      });
    }
    catch (error) {

    }
  }  

  loadStaffs() {
      this.isLoadingForm$.next(true);
      const example = merge(
        this.commonService.getSelect2NhanVientts(this.bienbantreothao.MA_DVIQLY, "TT")
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
    
  }
  
  showDetail(vtriLDat: number){
    this.showCTietLDat = vtriLDat === 2;
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.service.BienBanTTForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.service.BienBanTTForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.service.BienBanTTForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.service.BienBanTTForm.controls[controlName];
    return control.dirty || control.touched;
  }

}
