import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/modules/services/base.service';
import { CancelModel } from 'src/app/modules/models/bienbanks.model';

@Component({
    selector: 'app-cancel-business',
    templateUrl: './cancel-business.component.html',
    styleUrls: ['./cancel-business.component.scss'],
    providers: [
        { provide: NgbDateAdapter, useClass: CustomAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
        DatePipe
    ]
})
export class CancelBusinessComponent implements OnInit {
    @Output() public cancelModel: EventEmitter<CancelModel>;

    EMPTY: any;
    isLoadingForm$ = new BehaviorSubject<boolean>(false);
    formGroup: FormGroup;
    isCloseModal: boolean = false;
    
    startDate = new Date();

    constructor(
        public commonService: CommonService,
        private fb: FormBuilder,
        public modal: NgbActiveModal,
    ) {
        this.cancelModel = new EventEmitter<CancelModel>();
        this.EMPTY = {
            id: 0,
            noiDung: undefined
        }
    }

    submited= new BehaviorSubject<boolean>(false);
    ngOnInit(): void {
        this.loadForm();
    }

    loadForm() {
        try {
            this.formGroup = this.fb.group({
                noiDung: [""]
            });
        }
        catch (error) {

        }
    }

    closeModal() {
        this.submited.next(false);
        this.isCloseModal = true;
        this.modal.dismiss();
    }

    close() {
        this.submited.next(false);
        this.isCloseModal = true;
        this.modal.close();
    }

    save() {
        this.submited.next(true);
        let calcelModel = Object.assign(new CancelModel(), this.EMPTY);
        this.formGroup.markAllAsTouched();
        const formValues = this.formGroup.value;
        this.cancelModel.emit(Object.assign(calcelModel, formValues));
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
