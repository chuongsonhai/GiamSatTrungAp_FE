import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TemplateService } from 'src/app/modules/services/template.service';
import { Template } from 'src/app/modules/models/template.model';

@Component({
    selector: 'app-update-cau-hinh-mau',
    templateUrl: './update-cau-hinh-mau.component.html',
    styleUrls: ['./update-cau-hinh-mau.component.scss'],
    providers: [
        { provide: NgbDateAdapter, useClass: CustomAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
        DatePipe
    ]
})
export class UpdateCauHinhMauComponent implements OnInit {
    @Input() id: string;

    EMPTY: any;
    template: Template;

    isLoadingForm$ = new BehaviorSubject<boolean>(false);
    formGroup: FormGroup;
    private subscriptions: Subscription[] = [];
    constructor(
        public service: TemplateService,
        private fb: FormBuilder,
        public modal: NgbActiveModal,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.EMPTY = {
            Code: undefined,
            Name: undefined,
            XsltData: undefined,
            XmlData: undefined,
            ChucVuKy: undefined
        }
    }

    ngOnInit(): void {
        this.isLoadingForm$.next(true);
        setTimeout(() => {
            this.isLoadingForm$.next(false);
        }, 1000);

        this.template = Object.assign(new Template(), this.EMPTY);
        this.loadForm();
        if (this.id !== undefined) {
            this.isLoadingForm$.next(true);
            const sb = this.service.getItemById(this.id).pipe(
                first(),
                catchError((errorMessage) => {
                    return of(this.template);
                })
            ).subscribe((template: Template) => {
                if (template) {
                    this.isLoadingForm$.next(true);
                    this.template = template;
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
                Code: [this.template.Code, Validators.required],
                Name: [this.template.Name, Validators.required],
                XsltData: [this.template.XsltData, Validators.required],
                XmlData: [this.template.XmlData],
                ChucVuKy: [this.template.ChucVuKy]
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
        this.template = Object.assign(this.template, formValues);
        if (!this.template.Code || !this.template.Name) {
            this.toastr.error("Cần nhập đủ thông tin", "Thông báo");
            this.template = Object.assign(new Template(), this.EMPTY);
            this.loadForm();
        }
        else
            this.edit();
    }

    edit() {
        const sbUpdate = this.service.update(this.template).pipe(
            tap(() => {
                this.template = Object.assign(new Template(), this.EMPTY);
                this.modal.close();
            }),
            catchError((errorMessage) => {
                this.modal.dismiss(errorMessage);
                return of(this.template);
            }),
        ).subscribe(res => {
            this.toastr.success("Cập nhật thành công", "Thông báo");
            this.template = res;
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
