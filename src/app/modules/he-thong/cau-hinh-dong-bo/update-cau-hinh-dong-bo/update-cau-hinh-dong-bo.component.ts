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
import { CauHinhDongBo } from 'src/app/modules/models/cauhinhdongbo.model';
import { CauHinhDongBoService } from 'src/app/modules/services/cauhinhdongbo.service';

@Component({
  selector: 'app-update-cau-hinh-dong-bo',
  templateUrl: './update-cau-hinh-dong-bo.component.html',
  styleUrls: ['./update-cau-hinh-dong-bo.component.scss'],
  providers: [
      { provide: NgbDateAdapter, useClass: CustomAdapter },
      { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
      DatePipe
  ]
})
export class UpdateCauHinhDongBoComponent implements OnInit {

  @Input() id: string;
  EMPTY: any;
  cauhinhdongbo: CauHinhDongBo;

  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  startDate = new Date();
  constructor(
    public service: CauHinhDongBoService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.EMPTY = {
      MA:undefined,
      MO_TA: undefined,
      NGAY_KTHUC: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),        
  }
   }

   ngOnInit(): void {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
        this.isLoadingForm$.next(false);
    }, 1000);

    this.cauhinhdongbo = Object.assign(new CauHinhDongBo(), this.EMPTY);
    this.loadForm();
    if (this.id !== undefined) {
        this.isLoadingForm$.next(true);
        const sb = this.service.getItemById(this.id).pipe(
            first(),
            catchError((errorMessage) => {
                return of(this.cauhinhdongbo);
            })
        ).subscribe((cauhinhdongbo: CauHinhDongBo) => {
            if (cauhinhdongbo) {
                this.isLoadingForm$.next(true);
                this.cauhinhdongbo = cauhinhdongbo;
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
          MA: [this.cauhinhdongbo.MA, Validators.required],
          MO_TA: [this.cauhinhdongbo.MO_TA, Validators.required],   
          NGAY_KTHUC: [this.cauhinhdongbo.NGAY_KTHUC, Validators.required],             
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
    this.cauhinhdongbo = Object.assign(this.cauhinhdongbo, formValues);
    this.edit();
}

edit() {
    const sbUpdate = this.service.update(this.cauhinhdongbo).pipe(
        tap(() => {
            this.cauhinhdongbo = Object.assign(new CauHinhDongBo(), this.EMPTY);
            this.modal.close();
        }),
        catchError((errorMessage) => {
            this.modal.dismiss(errorMessage);
            return of(this.cauhinhdongbo);
        }),
    ).subscribe(res => this.cauhinhdongbo = res);
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
