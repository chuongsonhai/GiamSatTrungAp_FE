import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { MetadataService } from 'src/app/modules/services/metadata.service';
import { BienBanDN } from 'src/app/modules/models/bienbandn.model';
import { BienBanDNService } from 'src/app/modules/services/bienbandn.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonService } from 'src/app/modules/services/base.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';

@Component({
    selector: 'app-approve-du-thao',
    templateUrl: './approve-du-thao.component.html',
    styleUrls: ['./approve-du-thao.component.scss'],
    providers: [
        { provide: NgbDateAdapter, useClass: CustomAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
        DatePipe
    ]
})
export class ApproveDuThaoComponent implements OnInit {
    @Input() bienBanDN: BienBanDN;

    EMPTY: any;
    isLoadingForm$ = new BehaviorSubject<boolean>(false);
    formGroup: FormGroup;
    isCloseModal: boolean = false;

    startDate = new Date();

    constructor(
        public service: BienBanDNService,
        public metadataService: MetadataService,
        public commonService: CommonService,
        private confirmationDialogService: ConfirmationDialogService,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        public modal: NgbActiveModal,
        private toastr: ToastrService
    ) {

    }

    submited = new BehaviorSubject<boolean>(false);
    ngOnInit(): void {
        this.isLoadingForm$.next(true);
        setTimeout(() => {
            this.isLoadingForm$.next(false);
        }, 2000);

        if (this.bienBanDN !== null) {
            this.loadForm();
            this.isLoadingForm$.next(false);
        }
    }

    loadForm() {
        try {
            this.formGroup = this.fb.group({
                MaKH: [this.bienBanDN.MaKH],
                CusSigned: [this.bienBanDN.CusSigned],
                SoBienBan: [this.bienBanDN.SoBienBan, Validators.required],
                NgayBienBan: [this.bienBanDN.NgayBienBan, Validators.required]
            });
        }
        catch (error) {

        }
    }

    closeModal() {
        this.submited.next(false);
        this.isCloseModal = true;
        this.modal.close();
    }

    src: string;
    safeSrc: SafeResourceUrl;

    getPdf() {
        this.isLoadingForm$.next(true);
        this.submited.next(true);
        this.formGroup.markAllAsTouched();
        const formValues = this.formGroup.value;
        this.bienBanDN = Object.assign(this.bienBanDN, formValues);        
        this.service.getPdf(this.bienBanDN).pipe(
            catchError((errorMessage) => {
                this.isLoadingForm$.next(false);
                this.submited.next(false);
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                return of(this.bienBanDN);
            }),
        ).subscribe(res => {
            if (res.success) {
                this.bienBanDN = res.data;
                this.viewPDF(this.bienBanDN.Data);
                this.isLoadingForm$.next(false);
                this.submited.next(false);
            }
            else {
                this.submited.next(false);
                this.isLoadingForm$.next(false);
                this.toastr.error(res.message, "Thông báo");
                return of(this.bienBanDN);
            }
        });
    }

    viewPDF(path: string): any {
        this.commonService.getPDF(path).subscribe((response) => {
            var binary_string = window.atob(response);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            let file = new Blob([bytes.buffer], { type: 'application/pdf' });
            var src = URL.createObjectURL(file);

            this.src = src;
            this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
        });
    }

    getUrl() {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
    }

    save() {
        this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn gửi yêu cầu xác nhận dự thảo thỏa thuận đến khách hàng?')
            .then((confirmed) => {
                if (confirmed) {
                    this.submited.next(true);
                    this.formGroup.markAllAsTouched();
                    const formValues = this.formGroup.value;
                    this.bienBanDN = Object.assign(this.bienBanDN, formValues);
                    this.service.notify(this.bienBanDN).pipe(
                        tap(() => {
                            this.modal.close();
                        }),
                        catchError((errorMessage) => {
                            this.submited.next(false);
                            this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
                            return of(this.bienBanDN);
                        }),
                    ).subscribe(res => {
                        this.submited.next(false);
                        if (res.success) {
                            this.toastr.success("Đã gửi dự thảo thỏa thuận thành công", "Thông báo");
                            this.bienBanDN = res.data;
                        }
                        else {
                            this.toastr.error(res.message, "Thông báo");
                            return of(this.bienBanDN);
                        }
                    });
                }
            });
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
