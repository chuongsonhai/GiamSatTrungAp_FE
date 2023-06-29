import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { ResponseModel } from 'src/app/modules/models/response.model';
import { Router } from '@angular/router';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';

import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { SendMail } from 'src/app/modules/models/sendmail.model';
import { SendMailService } from 'src/app/modules/services/sendmail.service';

@Component({
    selector: 'app-update-mail-thong-bao',
    templateUrl: './update-mail-thong-bao.component.html',
    styleUrls: ['./update-mail-thong-bao.component.scss'],
    providers: [
        { provide: NgbDateAdapter, useClass: CustomAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
        DatePipe
    ]
})
export class UpdateMailThongBaoComponent implements OnInit {
    @Input() id: string;
    EMPTY: any;
    sendmail: SendMail;

    isLoadingForm$ = new BehaviorSubject<boolean>(false);
    formGroup: FormGroup;
    private subscriptions: Subscription[] = [];
    constructor(
        public service: SendMailService,
        private fb: FormBuilder,
        public modal: NgbActiveModal,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.EMPTY = {
            ID: 0,
            EMAIL: undefined,
            TIEUDE: undefined,
            NOIDUNG: undefined,
        }
    }

    ngOnInit(): void {
        this.isLoadingForm$.next(true);
        setTimeout(() => {
            this.isLoadingForm$.next(false);
        }, 1000);

        this.sendmail = Object.assign(new SendMail(), this.EMPTY);
        this.loadForm();
        if (this.id !== undefined) {
            this.isLoadingForm$.next(true);
            const sb = this.service.getItemById(this.id).pipe(
                first(),
                catchError((errorMessage) => {
                    return of(this.sendmail);
                })
            ).subscribe((sendmail: SendMail) => {
                if (sendmail) {
                    this.isLoadingForm$.next(true);
                    this.sendmail = sendmail;
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
                EMAIL: [this.sendmail.EMAIL, Validators.required],
                TIEUDE: [this.sendmail.TIEUDE, Validators.required],
                NOIDUNG: [this.sendmail.NOIDUNG, Validators.required],
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
        this.sendmail = Object.assign(this.sendmail, formValues);
        this.edit();
    }
    send() {
        const formValues = this.formGroup.value;
        this.sendmail = Object.assign(this.sendmail, formValues);
        this.sendmail.TRANG_THAI = 3;
        this.edit();
    }

    edit() {
        const sbUpdate = this.service.update(this.sendmail).pipe(
            tap(() => {
                this.sendmail = Object.assign(new SendMail(), this.EMPTY);
                this.modal.close();
            }),
            catchError((errorMessage) => {
                this.modal.dismiss(errorMessage);
                return of(this.sendmail);
            }),
        ).subscribe(res => this.sendmail = res);
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
