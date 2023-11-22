import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription, merge, of } from 'rxjs';
import { CanhBaoGiamSatService } from '../../services/canhbaogiamsat.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PhanHoi } from '../../models/canhbaochitiet.model';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { UserModel } from 'src/app/_models/usermodel';
import { catchError, first, tap } from 'rxjs/operators';
import { PhanHoiService } from '../../services/phanhoitraodoi.service';

@Component({
  selector: 'app-phan-hoi-canh-bao',
  templateUrl: './phan-hoi-canh-bao.component.html',
  styleUrls: ['./phan-hoi-canh-bao.component.scss']
})
export class PhanHoiCanhBaoComponent implements OnInit {

  @Input() id: number;
  @Input() idPhanHoi: number;

  
    EMPTY: any;
    user:UserModel
    listTrangThai: any = [];
    noiDungPhanHoi: string;
    NOIDUNG_PHANHOI_X3: string;
    phanHoi: PhanHoi;
    isLoadingForm$ = new BehaviorSubject<boolean>(false);
    isHasFile$ = new BehaviorSubject<boolean>(false);
    formGroup: FormGroup;
    fileToUpload: any;
    File: string;
    private subscriptions: Subscription[] = [];

    constructor(
        private auth: AuthenticationService,
        public service: CanhBaoGiamSatService,
        public PHservice: PhanHoiService,
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
        this.loadData();
        
    }

    loadData() {
      const sb = this.PHservice.getItemById(this.idPhanHoi).pipe(
        first(),
        catchError((errorMessage) => {
          return of(this.phanHoi);
        })
      ).subscribe((res) => {
        // debugger;
        if (res) {
          console.log(res);
          this.formGroup = this.fb.group({
            CANHBAO_ID : res.data.CANHBAO_ID,
            NOIDUNG_PHANHOI: res.data.NOIDUNG_PHANHOI,
            PHANHOI_TRAODOI_ID: res.data.PHANHOI_TRAODOI_ID,
            NOIDUNG_PHANHOI_X3: res.data.NOIDUNG_PHANHOI_X3,
            NGUOI_PHANHOI_X3: this.user.username,
            NGUOI_GUI: this.user.username,
            FILE_DINHKEM:'',
          });
          this.phanHoi = res.data;
          this.isHasFile$.next(true);
          this.isLoadingForm$.next(false);
        }
      });
    }
    loadForm() {

      this.formGroup = this.fb.group({
        CANHBAO_ID: [this.id],
        NOIDUNG_PHANHOI: this.noiDungPhanHoi,
        NOIDUNG_PHANHOI_X3: [this.NOIDUNG_PHANHOI_X3, Validators.required],
        DONVI_QLY: this.user.maDViQLy,
        NGUOI_GUI: this.user.username,
        NGUOI_PHANHOI_X3: this.user.username,
        FILE_DINHKEM: '',
    });
 
    }
   
    public upload(event) {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            this.handleFileInput(event.target.files);
        }
    }
    
    handleFileInput(file: FileList) {
      this.fileToUpload = file.item(0);
      let reader = new FileReader();
      reader.onload = ((event: any) => {
          this.File = event.target.result;
      });
      reader.readAsDataURL(this.fileToUpload);
      //reader.onloadend = function (e) {};
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
        debugger;
        console.log(this.formGroup.value)
        this.phanHoi = Object.assign(new PhanHoi(), formValues);
      if(this.idPhanHoi) {
        this.phanHoi.ID = this.idPhanHoi;
        const sbUpdate = this.service.updatePhanHoi(this.fileToUpload, this.phanHoi).pipe(
          tap(() => {
            this.modal.close();
          }),
          catchError((errorMessage) => {
            this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
            return of(this.phanHoi);
          }),
        ).subscribe(res => {
          if (res.success) {
            this.toastr.success("Cập nhật phản hồi thành công", "Thông báo");
            this.phanHoi = res;
          }
          else {
            this.toastr.error(res.message, "Thông báo");
            return of(this.phanHoi);
          }
        });
        this.subscriptions.push(sbUpdate);
      } else {
        const sbUpdate = this.service.createPhanHoi(this.fileToUpload, this.phanHoi).pipe(
          tap(() => {
            this.modal.close();
          }),
          catchError((errorMessage) => {
            this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
            return of(this.phanHoi);
          }),
        ).subscribe(res => {
          if (res.success) {
            this.toastr.success("Tạo mới phản hồi thành công", "Thông báo");
            this.phanHoi = res;
          }
          else {
            this.toastr.error(res.message, "Thông báo");
            return of(this.phanHoi);
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
