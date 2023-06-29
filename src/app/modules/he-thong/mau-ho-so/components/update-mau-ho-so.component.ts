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
import { MauHoSo } from 'src/app/modules/models/mauhoso.model';
import { MauHoSoService } from 'src/app/modules/services/mauhoso.service';

@Component({
    selector: 'app-update-mau-ho-so',
    templateUrl: './update-mau-ho-so.component.html',
    styleUrls: ['./update-mau-ho-so.component.scss'],
    providers: [
        { provide: NgbDateAdapter, useClass: CustomAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
        DatePipe
    ]
})
export class UpdateMauHoSoComponent implements OnInit {
    @Input() id: string;

    EMPTY: any;
    template: MauHoSo;
    File: string;
    isLoadingForm$ = new BehaviorSubject<boolean>(false);
    formGroup: FormGroup;
    private subscriptions: Subscription[] = [];
    constructor(
        public service: MauHoSoService,
        private fb: FormBuilder,
        public modal: NgbActiveModal,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.EMPTY = {
            Code: undefined,
            Name: undefined,
            TrangThai: 0,
            File: undefined,
        }
    }

    ngOnInit(): void {
        this.isLoadingForm$.next(true);
        setTimeout(() => {
            this.isLoadingForm$.next(false);
        }, 1000);

        this.template = Object.assign(new MauHoSo(), this.EMPTY);
        this.loadForm();
        if (this.id !== undefined) {
            this.isLoadingForm$.next(true);
            const sb = this.service.getItemById(this.id).pipe(
                first(),
                catchError((errorMessage) => {
                    return of(this.template);
                })
            ).subscribe((template: MauHoSo) => {
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
                TrangThai: [this.template.TrangThai],
                File: undefined,
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
            this.template = Object.assign(new MauHoSo(), this.EMPTY);
            this.loadForm();
        }
        else
            this.edit();
    }

    edit() {
        const sbUpdate = this.service.updateMau(this.template,this.fileToUpload).pipe(
            tap(() => {
                this.template = Object.assign(new MauHoSo(), this.EMPTY);
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
    public upload(event) {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            this.handleFileInput(event.target.files);
        }
    }

    fileToUpload: any;

    handleFileInput(file: FileList) {
        this.fileToUpload = file.item(0);
        let reader = new FileReader();
        reader.onload = ((event: any) => {
            this.File = event.target.result;
        });
        reader.readAsDataURL(this.fileToUpload);
        //reader.onloadend = function (e) {};
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
