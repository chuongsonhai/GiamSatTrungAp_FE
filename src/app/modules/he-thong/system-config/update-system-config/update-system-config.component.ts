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
import { SystemConfig } from 'src/app/modules/models/systemconfig.model';
import { SystemConfigService } from 'src/app/modules/services/systemconfig.service';


@Component({
    selector: 'app-update-system-config',
    templateUrl: './update-system-config.component.html',
    styleUrls: ['./update-system-config.component.scss'],
    providers: [
        { provide: NgbDateAdapter, useClass: CustomAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
        DatePipe
    ]
})
export class UpdateSystemConfigComponent implements OnInit {
    @Input() id: string;
    EMPTY: any;
    systemconfig: SystemConfig;

    isLoadingForm$ = new BehaviorSubject<boolean>(false);
    formGroup: FormGroup;
    private subscriptions: Subscription[] = [];
    constructor(
        public service: SystemConfigService,
        private fb: FormBuilder,
        public modal: NgbActiveModal,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.EMPTY = {
            ID: 0,
            Code: undefined,
            Value: undefined,
        }
    }

    ngOnInit(): void {
        this.isLoadingForm$.next(true);
        setTimeout(() => {
            this.isLoadingForm$.next(false);
        }, 1000);

        this.systemconfig = Object.assign(new SystemConfig(), this.EMPTY);
        this.loadForm();
        if (this.id !== undefined) {
            this.isLoadingForm$.next(true);
            const sb = this.service.getItemById(this.id).pipe(
                first(),
                catchError((errorMessage) => {
                    return of(this.systemconfig);
                })
            ).subscribe((systemconfig: SystemConfig) => {
                if (systemconfig) {
                    this.isLoadingForm$.next(true);
                    this.systemconfig = systemconfig;
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
                ID: [this.systemconfig.ID],
                Code: [this.systemconfig.Code, Validators.required],
                Value: [this.systemconfig.Value, Validators.required],
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
        this.systemconfig = Object.assign(this.systemconfig, formValues);
        if (this.systemconfig.ID !== undefined || this.systemconfig.ID > 0) {
            this.edit();
        }
        else
            this.create();
    }

    create() {
        const sbUpdate = this.service.create(this.systemconfig).pipe(
            tap(() => {
                this.systemconfig = Object.assign(new SystemConfig(), this.EMPTY);
                this.modal.close();
            }),
            catchError((errorMessage) => {
                this.modal.dismiss(errorMessage);
                return of(this.systemconfig);
            }),
        ).subscribe(res => this.systemconfig = res);
        this.subscriptions.push(sbUpdate);
    }

    edit() {
        const sbUpdate = this.service.update(this.systemconfig).pipe(
            tap(() => {
                this.systemconfig = Object.assign(new SystemConfig(), this.EMPTY);
                this.modal.close();
            }),
            catchError((errorMessage) => {
                this.modal.dismiss(errorMessage);
                return of(this.systemconfig);
            }),
        ).subscribe(res => this.systemconfig = res);
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
