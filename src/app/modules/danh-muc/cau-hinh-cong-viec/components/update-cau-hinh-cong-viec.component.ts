import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { Router } from '@angular/router';
import { CauHinhDK } from 'src/app/modules/models/base.model';
import { CommonService, CongVanYeuCauService } from 'src/app/modules/services/base.service';
import { ToastrService } from 'ngx-toastr';
import { CauHinhDKService } from 'src/app/modules/services/cauhinhdk.service';
import { TrangThaiCongVan, TrangThaiMap } from 'src/app/modules/models/enum';

@Component({
    selector: 'app-update-cau-hinh-cong-viec',
    templateUrl: './update-cau-hinh-cong-viec.component.html',
    styleUrls: ['./update-cau-hinh-cong-viec.component.scss'],
    providers: [
        { provide: NgbDateAdapter, useClass: CustomAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
        DatePipe
    ]
})
export class UpdateCauHinhCVComponent implements OnInit {
    @Input() id: number;

    EMPTY: any;
    listTrangThai: any = [];
    cauHinhDK: CauHinhDK;

    isLoadingForm$ = new BehaviorSubject<boolean>(false);
    formGroup: FormGroup;
    private subscriptions: Subscription[] = [];

    constructor(
        public service: CauHinhDKService,
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
        const example = merge(
            this.commonService.getCongViecs()
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

        this.cauHinhDK = Object.assign(new CauHinhDK(), this.EMPTY);
        this.loadForm();
        if (this.id !== undefined) {
            this.isLoadingForm$.next(true);
            const sb = this.service.getItemById(this.id).pipe(
                first(),
                catchError((errorMessage) => {
                    return of(this.cauHinhDK);
                })
            ).subscribe((cauHinhDK: CauHinhDK) => {
                if (cauHinhDK) {
                    this.isLoadingForm$.next(true);
                    this.cauHinhDK = cauHinhDK;
                    this.loadForm();
                    this.isLoadingForm$.next(false);
                }
            });

            this.subscriptions.push(sb);
        }
    }
    loadForm() {
        if (this.cauHinhDK.LOAI === 0)
            this.listTrangThai = [
                { TrangThai: 0, MoTa: "Mới tạo" },
                { TrangThai: 1, MoTa: "Tiếp nhận" },
                { TrangThai: 2, MoTa: "Phân công khảo sát" },
                { TrangThai: 3, MoTa: "Ghi nhận kết quả khảo sát" },
                { TrangThai: 5, MoTa: "Lập dự thảo thỏa thuận" },
                { TrangThai: 13, MoTa: "Hủy yêu cầu" }
            ];
        if (this.cauHinhDK.LOAI === 1)
            this.listTrangThai = [
                { TrangThai: 0, MoTa: "Mới tạo" },
                { TrangThai: 1, MoTa: "Tiếp nhận" },
                { TrangThai: 2, MoTa: "Kiểm tra điều kiện đóng điện điểm đấu nối" },
                { TrangThai: 3, MoTa: "Ghi nhận kết quả kiểm tra" },
                { TrangThai: 5, MoTa: "Phân công thi công" },
                { TrangThai: 6, MoTa: "Thi công lắp đặt" },
                { TrangThai: 13, MoTa: "Hủy yêu cầu" },                
            ]
        try {
            this.formGroup = this.fb.group({
                ID: [this.cauHinhDK.ID],
                MA_CVIEC_TRUOC: [this.cauHinhDK.MA_CVIEC_TRUOC, Validators.required],
                MA_CVIEC_TIEP: [this.cauHinhDK.MA_CVIEC_TIEP, Validators.required],
                MA_LOAI_YCAU: [this.cauHinhDK.MA_LOAI_YCAU, Validators.required],
                TRANG_THAI_TIEP: [this.cauHinhDK.TRANG_THAI_TIEP],
                ORDERNUMBER: [this.cauHinhDK.ORDERNUMBER],
                TTHAI_YCAU: [this.cauHinhDK.TTHAI_YCAU],
                LOAI: [this.cauHinhDK.LOAI]
            });
        }
        catch (error) {

        }
    }

    closeModal() {
        this.modal.close();
    }
    dismissModal() {
        this.modal.dismiss();
    }

    save() {
        const formValues = this.formGroup.value;
        this.cauHinhDK = Object.assign(this.cauHinhDK, formValues);
        this.edit();
    }

    edit() {
        const sbUpdate = this.service.update(this.cauHinhDK).pipe(
            tap(() => {
                this.cauHinhDK = Object.assign(new CauHinhDK(), this.EMPTY);
                this.modal.close();
            }),
            catchError((errorMessage) => {
                this.modal.dismiss(errorMessage);
                return of(this.cauHinhDK);
            }),
        ).subscribe(res => this.cauHinhDK = res);
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
