import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription, merge, of } from 'rxjs';
import { CanhBaoGiamSatService } from '../../services/canhbaogiamsat.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { KhaoSat, PhanHoi } from '../../models/canhbaochitiet.model';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { UserModel } from 'src/app/_models/usermodel';
import { catchError, first, tap } from 'rxjs/operators';
import { PhanHoiService } from '../../services/phanhoitraodoi.service';
import { KhaoSatGiamSatService } from '../../services/khaosatgiamsat.service';

@Component({
  selector: 'app-khao-sat-canh-bao',
  templateUrl: './khao-sat-canh-bao.component.html',
  styleUrls: ['./khao-sat-canh-bao.component.scss']
})
export class KhaoSatCanhBaoComponent implements OnInit {

  @Input() maYeuCau: string;
  @Input() idKhaoSat: number;
  @Input() isPhanHoiDv: boolean;

  
    EMPTY: any;
    user:UserModel
    listTrangThai: any = [];
    noiDungCauHoi: string;
    phanHoiKhachHang: string;
    phanHoiDonVi: string;
    ketQua: string;
    khaoSat: KhaoSat;
    isLoadingForm$ = new BehaviorSubject<boolean>(false);
    isHasFile$ = new BehaviorSubject<boolean>(false);
    formGroup: FormGroup;
    fileToUpload: any;
    File: string;

    DGCD_TH_CHUONGTRINH: number;
    DGCD_TH_DANGKY: number;
    DGCD_KH_PHANHOI: number;
    CHENH_LECH: number;
    DGYC_DK_DEDANG: number;
    DGYC_XACNHAN_NCHONG_KTHOI: number;
    DGYC_THAIDO_CNGHIEP: number;
    DGKS_TDO_KSAT: number;
    DGKS_MINH_BACH: number;
    DGKS_CHU_DAO: number;
    DGNT_THUAN_TIEN: number;
    DGNT_MINH_BACH: number;
    DGNT_CHU_DAO: number;
    KSAT_CHI_PHI: number;
    DGHL_CAPDIEN: number;
    TRANGTHAI_GOI: number;
    Y_KIEN_KH: string;
    NOIDUNG: string;
    PHAN_HOI: string;
    GHI_CHU: string;

    private subscriptions: Subscription[] = [];

    constructor(
        private auth: AuthenticationService,
        public service: CanhBaoGiamSatService,
        public KSservice: KhaoSatGiamSatService,
        public commonService: CommonService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        public modal: NgbActiveModal,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.EMPTY = {
            ID: undefined,
            MA_CVIEC_TRUOC: undefined,
            MA_CVIEC_TIEP: undefined,
            MA_LOAI_YCAU: undefined,
            MA_CVIEC_XLY: undefined,
            TRANG_THAI: 1,
            ORDERNUMBER: undefined,
            TTHAI_YCAU: undefined
        }
    }

    ngOnInit(): void {
      this.user=this.auth.currentUserValue;
        this.isLoadingForm$.next(true);
        setTimeout(() => {
            this.isLoadingForm$.next(false);
        }, 1000);
        this.isLoadingForm$.next(true);
        this.loadForm();
        if(this.idKhaoSat != undefined) {
          this.loadData();
        }
        
        
    }

    loadData() {
      const sb = this.KSservice.getItemById(this.idKhaoSat).pipe(
        first(),
        catchError((errorMessage) => {
          return of(this.khaoSat);
        })
      ).subscribe((res) => {
        // debugger;
        if (res) {
          this.formGroup = this.fb.group({
            ID: this.idKhaoSat,
            MA_YCAU: res.data.MA_YCAU,
            NGUOI_KS: this.user.username,
            DGCD_TH_CHUONGTRINH: res.data.DGCD_TH_CHUONGTRINH,
            DGCD_TH_DANGKY: res.data.DGCD_TH_DANGKY,
            DGCD_KH_PHANHOI: res.data.DGCD_KH_PHANHOI,
            CHENH_LECH: res.data.CHENH_LECH,
            DGYC_DK_DEDANG: res.data.DGYC_DK_DEDANG,
            DGYC_XACNHAN_NCHONG_KTHOI: res.data.DGYC_XACNHAN_NCHONG_KTHOI,
            DGYC_THAIDO_CNGHIEP: res.data.DGYC_THAIDO_CNGHIEP,
            DGKS_TDO_KSAT: res.data.DGKS_TDO_KSAT,
            DGKS_MINH_BACH: res.data.DGKS_MINH_BACH,
            DGKS_CHU_DAO: res.data.DGKS_CHU_DAO,
            DGNT_THUAN_TIEN: res.data.DGNT_THUAN_TIEN,
            DGNT_MINH_BACH: res.data.DGNT_MINH_BACH,
            DGNT_CHU_DAO: res.data.DGNT_CHU_DAO,
            KSAT_CHI_PHI: res.data.KSAT_CHI_PHI,
            DGHL_CAPDIEN: res.data.DGHL_CAPDIEN,
            TRANGTHAI_GOI: res.data.TRANGTHAI_GOI,
            Y_KIEN_KH: res.data.Y_KIEN_KH,
            NOIDUNG: res.data.NOIDUNG,
            PHAN_HOI: res.data.PHAN_HOI,
            GHI_CHU: res.data.GHI_CHU,
          });
          this.khaoSat = res.data;
          this.isLoadingForm$.next(false);
        }
      });
    }
    loadForm() {
      this.formGroup = this.fb.group({
        MA_YCAU: this.maYeuCau,
        DGCD_TH_CHUONGTRINH: [this.DGCD_TH_CHUONGTRINH, Validators.required],
        DGCD_TH_DANGKY: [this.DGCD_TH_DANGKY, Validators.required],
        DGCD_KH_PHANHOI: [this.DGCD_KH_PHANHOI],
        CHENH_LECH: [this.CHENH_LECH],
        DGYC_DK_DEDANG: [this.DGYC_DK_DEDANG, Validators.required],
        DGYC_XACNHAN_NCHONG_KTHOI: [this.DGYC_XACNHAN_NCHONG_KTHOI, Validators.required],
        DGYC_THAIDO_CNGHIEP: [this.DGYC_THAIDO_CNGHIEP, Validators.required],
        DGKS_TDO_KSAT: [this.DGKS_TDO_KSAT, Validators.required],
        DGKS_MINH_BACH: [this.DGKS_MINH_BACH, Validators.required],
        DGKS_CHU_DAO: [this.DGKS_CHU_DAO, Validators.required],
        DGNT_THUAN_TIEN: [this.DGNT_THUAN_TIEN, Validators.required],
        DGNT_MINH_BACH: [this.DGNT_MINH_BACH, Validators.required],
        DGNT_CHU_DAO: [this.DGNT_CHU_DAO, Validators.required],
        KSAT_CHI_PHI: [this.KSAT_CHI_PHI, Validators.required],
        DGHL_CAPDIEN: [this.DGHL_CAPDIEN, Validators.required],
        TRANGTHAI_GOI: [this.TRANGTHAI_GOI, Validators.required],
        NGUOI_KSAT: this.user.username,
        Y_KIEN_KH: [this.Y_KIEN_KH, Validators.required],
        NOIDUNG: [this.NOIDUNG, Validators.required],
        PHAN_HOI: [this.PHAN_HOI],
        GHI_CHU: [this.GHI_CHU, Validators.required],
    });
    }


    closeModal() {
        this.modal.close();
    }
    dismissModal() {
        this.modal.dismiss();
    }

    save() {
        this.formGroup.markAllAsTouched();
        const formValues = this.formGroup.value;
        this.khaoSat = Object.assign(new KhaoSat(), formValues);
      if(this.idKhaoSat) {
        this.khaoSat.ID = this.idKhaoSat;
        const sbUpdate = this.KSservice.updateKhaoSat( this.khaoSat).pipe(
          tap(() => {
            this.modal.close();
          }),
          catchError((errorMessage) => {
            this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
            return of(this.khaoSat);
          }),
        ).subscribe(res => {
          if (res.success) {
            this.toastr.success("Cập nhật thành công", "Thông báo");
            this.khaoSat = res;
          }
          else {
            this.toastr.error(res.message, "Thông báo");
            return of(this.khaoSat);
          }
        });
        this.subscriptions.push(sbUpdate);
      } else {
        const sbUpdate = this.KSservice.createKhaoSat(this.khaoSat).pipe(
          tap(() => {
            this.modal.close();
          }),
          catchError((errorMessage) => {
            this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
            return of(this.khaoSat);
          }),
        ).subscribe(res => {
          if (res.success) {
            this.toastr.success("Tạo mới phản hồi thành công", "Thông báo");
            this.khaoSat = res;
          }
          else {
            this.toastr.error(res.message, "Thông báo");
            return of(this.khaoSat);
          }
        });
        this.subscriptions.push(sbUpdate);
      }
        
      
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
