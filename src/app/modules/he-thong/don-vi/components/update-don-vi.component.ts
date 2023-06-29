import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { Router } from '@angular/router';
import { Organization } from 'src/app/modules/models/base.model';
import { ToastrService } from 'ngx-toastr';
import { DonViService } from 'src/app/modules/services/donvi.service';

@Component({
    selector: 'app-update-don-vi',
    templateUrl: './update-don-vi.component.html',
    styleUrls: ['./update-don-vi.component.scss'],
    providers: [
        { provide: NgbDateAdapter, useClass: CustomAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
        DatePipe
    ]
})
export class UpdateDonViComponent implements OnInit {
    @Input() id: number;

    EMPTY: any;
    donVi: Organization;

    isLoadingForm$ = new BehaviorSubject<boolean>(false);
    formGroup: FormGroup;
    private subscriptions: Subscription[] = [];
    constructor(
        public service: DonViService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        public modal: NgbActiveModal,
        private router: Router,
        private toastr: ToastrService
    ) {
        this.EMPTY = {
            orgId: 0,
            orgCode: undefined,
            orgName: undefined,
            address: undefined,
            phone: undefined,
            email: undefined,
            daiDien: undefined,
            chucVu: undefined,
            taxCode: undefined,
            soTaiKhoan: undefined,
            nganHang: undefined
        }
    }

    ngOnInit(): void {
        this.isLoadingForm$.next(true);
        setTimeout(() => {
            this.isLoadingForm$.next(false);
        }, 1000);

        this.donVi = Object.assign(new Organization(), this.EMPTY);
        this.loadForm();
        if (this.id !== undefined) {
            this.isLoadingForm$.next(true);
            const sb = this.service.getItemById(this.id).pipe(
                first(),
                catchError((errorMessage) => {
                    return of(this.donVi);
                })
            ).subscribe((donVi: Organization) => {
                if (donVi) {
                    this.isLoadingForm$.next(true);
                    this.donVi = donVi;
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
                orgId: [this.donVi.orgId, Validators.required],
                orgCode: [this.donVi.orgCode, Validators.required],
                orgName: [this.donVi.orgName, Validators.required],
                address: [this.donVi.address, Validators.required],
                phone: [this.donVi.phone],
                email: [this.donVi.email],
                daiDien: [this.donVi.daiDien, Validators.required],
                chucVu: [this.donVi.chucVu, Validators.required],
                taxCode: [this.donVi.taxCode, Validators.required],
                soTaiKhoan: [this.donVi.soTaiKhoan],
                nganHang: [this.donVi.nganHang],
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
        this.donVi = Object.assign(this.donVi, formValues);
        this.edit();
    }

    edit() {
        const sbUpdate = this.service.update(this.donVi).pipe(
            tap(() => {
                this.donVi = Object.assign(new Organization(), this.EMPTY);
                this.modal.close();
            }),
            catchError((errorMessage) => {
                this.modal.dismiss(errorMessage);
                return of(this.donVi);
            }),
        ).subscribe(res => {
            this.toastr.success("Cập nhật thành công", "Thông báo");
            this.donVi = res;
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
