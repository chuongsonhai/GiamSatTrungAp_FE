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
import { UserNhanCanhbao } from '../../models/systemconfig.model';

@Component({
    selector: 'app-user-nhan-canhbao',
    templateUrl: './user-nhan-canhbao.component.html',
    styleUrls: ['./user-nhan-canhbao.component.scss']
})
export class UserNhanCanhbaoComponent implements OnInit {

    @Input() id: number;
    @Input() idPhanHoi: number;


    EMPTY: any;
    UserNhanCanhbao: UserNhanCanhbao;
    user: UserModel[] = [];
    userNhanCanhBaooo: UserModel[] = [];
    username: string;
    maDViQLy: string;
    listTrangThai: any = [];
    madvi: string;
    userNhan: number;
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
        this.isLoadingForm$.next(true);
        setTimeout(() => {
            this.isLoadingForm$.next(false);
        }, 1000);

        this.UserNhanCanhbao = Object.assign(new UserNhanCanhbao(), this.EMPTY);
        this.loadForm();
        const sb1 = this.service.getUserNhanCanhBao(this.id).pipe(
            first(),
            catchError((errorMessage) => {
                return of(this.UserNhanCanhbao);
            })
        ).subscribe((res) => {
            console.log(res)
            if (res) {
                this.isLoadingForm$.next(true);
                this.userNhanCanhBaooo = res.data;
                this.loadForm();
                this.isLoadingForm$.next(false);

            }
        });
        if (this.id !== undefined) {
            this.isLoadingForm$.next(true);
            const sb = this.service.getItemByIduser(this.id).pipe(
                first(),
                catchError((errorMessage) => {
                    return of(this.UserNhanCanhbao);
                })
            ).subscribe((res) => {
                if (res) {
                    this.isLoadingForm$.next(true);
                    this.UserNhanCanhbao = res.data;
                    this.user = res.USER_ID;
                    this.loadForm();
                    this.isLoadingForm$.next(false);

                }
            });
            

            this.subscriptions.push(sb);
        }
    }


    loadForm() {
        try {
            this.formGroup = this.fb.group({

                MA_DVIQLY: [this.UserNhanCanhbao.MA_DVIQLY],
                USER_ID: this.UserNhanCanhbao.USER_ID,
               

            });
        }
        catch (error) {

        }
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

        const formValues = this.formGroup.value;
    
        this.UserNhanCanhbao = Object.assign(this.UserNhanCanhbao, formValues);
        if (this.UserNhanCanhbao.MA_DVIQLY.length > 0 ) {
        this.create();
        }
    }

    create() {
        const sbUpdate = this.service.creatUserNhanCanhBao(this.UserNhanCanhbao).pipe(

            tap(() => {
                this.UserNhanCanhbao = Object.assign(new UserNhanCanhbao(), this.EMPTY);
                this.modal.close();
            }),
            catchError((errorMessage) => {
                this.modal.dismiss(errorMessage);
                return of(this.UserNhanCanhbao);
            }),
        ).subscribe(res => this.UserNhanCanhbao = res);
        this.subscriptions.push(sbUpdate);
    }

    edit() {
        const sbUpdate = this.service.updateUserNhanCanhBao(this.UserNhanCanhbao).pipe(
            tap(() => {
                this.modal.close();
            }),
            catchError((errorMessage) => {
                this.modal.dismiss(errorMessage);
                return of(this.UserNhanCanhbao);
            }),
        ).subscribe(res => {
            if (res.success) {
                this.toastr.success("Cập nhật thành công", "Thông báo");
            }
            else {
                this.toastr.error(res.message, "Thông báo");
                return of(this.UserNhanCanhbao);
            }
        });
        this.subscriptions.push(sbUpdate);
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
