import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { Router } from '@angular/router';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';
import { CommonService, CongVanYeuCauService } from 'src/app/modules/services/base.service';
import { CongVanYeuCau } from 'src/app/modules/models/congvanyeucau.model';
import { ToastrService } from 'ngx-toastr';
import { ApproveModel } from '../../models/bienbanks.model';
import { MetadataService } from '../../services/metadata.service';
import { TienTrinhData } from '../../models/tientrinhdata.model';

@Component({
    selector: 'app-approve-document',
    templateUrl: './approve-document.component.html',
    styleUrls: ['./approve-document.component.scss'],
    providers: [
        { provide: NgbDateAdapter, useClass: CustomAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
        DatePipe
    ]
})
export class ApproveDocumentTemplateComponent implements OnInit {
    @Input() congVanYeuCau: CongVanYeuCau;
    @Input() truongBoPhan: boolean = false;
    @Output() public approveModel: EventEmitter<ApproveModel>;
    @Output() public huyChuKy :EventEmitter<boolean>;

    EMPTY: any;
    isLoadingForm$ = new BehaviorSubject<boolean>(false);
    formGroup: FormGroup;
    isCloseModal: boolean = false;
    
    startDate = new Date();

    constructor(
        public commonService: CommonService,
        public metadataService: MetadataService,
        private fb: FormBuilder,
        public modal: NgbActiveModal,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.approveModel = new EventEmitter<ApproveModel>();
        this.huyChuKy=new EventEmitter<boolean>();
        this.EMPTY = {
            id: 0,
            deptId: '',
            staffCode: '',
            ngayHen: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
            noiDung: undefined,
            maCViec: ''
        }
    }
    approveData: ApproveModel;
    tienTrinhData: TienTrinhData;

    submited= new BehaviorSubject<boolean>(false);
    ngOnInit(): void {
        this.isLoadingForm$.next(true);
        setTimeout(() => {
            this.isLoadingForm$.next(false);
        }, 2000);

        this.tienTrinhData = Object.assign(new TienTrinhData(), this.EMPTY);
        this.loadForm();

        if (this.congVanYeuCau !== undefined && this.congVanYeuCau.ID > 0) {
            this.isLoadingForm$.next(true);
            const sb = this.metadataService.getTienTrinhs(this.congVanYeuCau.MaYeuCau, false, this.truongBoPhan).pipe(
                catchError((errorMessage) => {
                    return of(this.tienTrinhData);
                }), finalize(() => {
                    this.loadForm();
                    this.isLoadingForm$.next(false);
                })
            ).subscribe(res => {
                if (res.success) {
                    this.tienTrinhData = res.data;
                    this.loadStaffs(this.tienTrinhData.deptId);
                }
            });
        }
    }

    loadForm() {
        try {
            this.formGroup = this.fb.group({
                deptId: [this.tienTrinhData.deptId, Validators.required],
                staffCode: [this.tienTrinhData.staffCode, Validators.required],
                ngayHen: [DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate)],
                noiDung: [""],
                maCViec: [this.tienTrinhData.maCViec, Validators.required]
            });
        }
        catch (error) {

        }
    }

    loadStaffs(deptId: string) {
        if (deptId && deptId !== undefined) {
            const sb = this.commonService.getListNViens(this.congVanYeuCau.MaDViQLy, deptId, this.truongBoPhan).pipe(
                catchError((errorMessage) => {
                    return of(this.tienTrinhData);
                }), finalize(() => {
                    // this.loadForm();
                    this.isLoadingForm$.next(false);
                })
            ).subscribe(res => {
                if (res.success) {
                    this.tienTrinhData.nhanViens = res.data;
                }
            });
        }
    }

    closeModal() {
        this.submited.next(false);
        this.isCloseModal = true;
        this.huyChuKy.emit(true);
        this.modal.dismiss();
    }

    close() {
        this.submited.next(false);
        this.isCloseModal = true;
        this.modal.close();
    }

    save() {
        this.submited.next(true);
        let approveModel = Object.assign(new ApproveModel(), this.EMPTY);
        this.formGroup.markAllAsTouched();
        const formValues = this.formGroup.value;
        this.approveModel.emit(Object.assign(approveModel, formValues));
        this.close();
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
