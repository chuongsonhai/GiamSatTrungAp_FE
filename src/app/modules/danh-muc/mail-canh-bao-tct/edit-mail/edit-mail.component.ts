import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../_metronic/core';
import { DatePipe, formatDate } from '@angular/common';
import * as _moment from 'moment';
import DateTimeUtil from "../../../../_metronic/shared/datetime.util";


import { GroupingState } from 'src/app/_metronic/shared/crud-table';
import { MailCanhBaoTCT } from 'src/app/modules/models/mailcanhbaotct.model';
import { MailCanhBaoTCTService } from 'src/app/modules/services/mailcanhbaotct.service';

var EMPTY: {  
  EMAIL: undefined,
  TENNHANVIEN: undefined,
 
};

@Component({
  selector: 'app-edit-mail',
  templateUrl: './edit-mail.component.html',
  styleUrls: ['./edit-mail.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})
export class EditMailComponent implements OnInit, OnDestroy {
  @Input() id: number;
  MailCanhBaoTCT: MailCanhBaoTCT;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  permissioncodes: string[] = [];

  constructor(
    private MailCanhBaoTCTService: MailCanhBaoTCTService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private datePipe: DatePipe
  ) {
  }

  isLoading$ = new BehaviorSubject<boolean>(false);
  ngOnInit(): void {
    this.loadData();

    var mer = merge(
    
    );

    const resultConcat = concat(mer);
    resultConcat.pipe(catchError(err => {
      return undefined;
    })
    ).subscribe();
  }

  loadData() {
    if (!this.id) {
      this.MailCanhBaoTCT = Object.assign(new MailCanhBaoTCT(), EMPTY);
      this.loadForm();
    } else {
      const sb = this.MailCanhBaoTCTService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(undefined);
        })
      ).subscribe((MailCanhBaoTCT: MailCanhBaoTCT) => {
        if (MailCanhBaoTCT) {          
          this.MailCanhBaoTCT = MailCanhBaoTCT;
     
          this.loadForm();
        }
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    try {
      this.formGroup = this.fb.group({
        EMAIL: [this.MailCanhBaoTCT.EMAIL, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(200)])],
        TENNHANVIEN: [this.MailCanhBaoTCT.TENNHANVIEN, Validators.compose([Validators.minLength(3), Validators.maxLength(200)])],
   
      });
    }
    catch (error) {

    }
  }

  save() {    
    this.prepareUser();
    
    if (this.MailCanhBaoTCT.ID) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.MailCanhBaoTCTService.update(this.MailCanhBaoTCT).pipe(
      tap(() => {
        this.MailCanhBaoTCT = Object.assign(new MailCanhBaoTCT(), EMPTY);
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.MailCanhBaoTCT);
      }),
    ).subscribe(res => this.MailCanhBaoTCT = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.MailCanhBaoTCTService.create(this.MailCanhBaoTCT).pipe(
      tap(() => {
        this.MailCanhBaoTCT = Object.assign(new MailCanhBaoTCT(), EMPTY);
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.MailCanhBaoTCT);
      }),
    ).subscribe((res: MailCanhBaoTCT) => this.MailCanhBaoTCT = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareUser() {
    const formValues = this.formGroup.value;
    this.MailCanhBaoTCT = Object.assign(this.MailCanhBaoTCT, formValues);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  };

  selectRow(code: string) {
    const index = this.permissioncodes.indexOf(code);
    if (index !== -1) this.permissioncodes.splice(index, 1);
    else
      this.permissioncodes.push(code);
  }

  isRowSelected(code: string): boolean {
    return this.permissioncodes.indexOf(code) >= 0;
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
