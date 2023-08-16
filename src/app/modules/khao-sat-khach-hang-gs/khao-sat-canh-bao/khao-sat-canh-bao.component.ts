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

  @Input() id: number;
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
            CANHBAO_ID : res.data.CANHBAO_ID,
            NOIDUNG_CAUHOI: res.data.NOIDUNG_CAUHOI,
            PHANHOI_KH: res.data.PHANHOI_KH,
            KETQUA: res.data.KETQUA,
            ID: this.idKhaoSat,
            NGUOI_KS: this.user.username,
            PHANHOI_DV: res.data.PHANHOI_DV,
          });
          this.khaoSat = res.data;
          this.isLoadingForm$.next(false);
        }
      });
    }
    loadForm() {
      this.formGroup = this.fb.group({
        CANHBAO_ID: [this.id],
        NOIDUNG_CAUHOI: [this.noiDungCauHoi, Validators.required],
        PHANHOI_KH: [this.phanHoiKhachHang, Validators.required],
        PHANHOI_DV: [this.phanHoiDonVi],
        KETQUA: [this.ketQua, Validators.required],
        NGUOI_KS: this.user.username,
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
