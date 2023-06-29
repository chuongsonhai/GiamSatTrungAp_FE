import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../_metronic/core';
import { DatePipe, formatDate } from '@angular/common';
import * as _moment from 'moment';
import { CommonService } from 'src/app/modules/services/base.service';
import { Options } from 'select2';
import { TroNgai } from 'src/app/modules/models/trongai.model';
import { TroNgaiService } from 'src/app/modules/services/trongai.service';

var EMPTY: {
  username: undefined,
  fullName: undefined,
  email: undefined,
};

@Component({
  selector: 'app-edit-tro-ngai',
  templateUrl: './edit-tro-ngai.component.html',
  styleUrls: ['./edit-tro-ngai.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})
export class EditTroNgaiComponent implements OnInit, OnDestroy {
  @Input() id: string;
  isLoading$;
  TroNgai: TroNgai;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  congviecs: string[] = [];

  public options: Options;
  public optionsNV: Options;

  constructor(
    private service: TroNgaiService,
    public commonService: CommonService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private datePipe: DatePipe
  ) {

  }
  
  ngOnInit(): void {
    this.isLoading$ = this.service.isLoading$;
    this.TroNgai = Object.assign(new TroNgai(), EMPTY);
    this.loadForm();
    if (this.id) {
      this.loadData();
    }
  }

  loadData() {
    const sb = this.service.getItemById(this.id).pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(undefined);
      })
    ).subscribe((TroNgai: TroNgai) => {
      if (TroNgai) {
        this.TroNgai = TroNgai;
        this.congviecs = this.TroNgai.CongViecs;
        const example = merge(
          this.commonService.getCongViecs()
        );

        const subscribe = example.pipe(
          catchError(err => {
            return of(undefined);
          }),
          finalize(() => {
            this.loadForm();
          })).subscribe();
        this.subscriptions.push(subscribe);
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    try {
      this.formGroup = this.fb.group({
        MA_TNGAI: [this.TroNgai.MA_TNGAI],
        TEN_TNGAI: [this.TroNgai.TEN_TNGAI],
      });
    }
    catch (error) {

    }
  }

  save() {
    this.prepareUser();
    this.TroNgai.CongViecs = [];
    this.TroNgai.CongViecs = this.congviecs;
    if (this.TroNgai.MA_TNGAI) {
      this.edit();
    }
  }

  edit() {
    const sbUpdate = this.service.update(this.TroNgai).pipe(
      tap(() => {
        this.TroNgai = Object.assign(new TroNgai(), EMPTY);
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.TroNgai);
      }),
    ).subscribe(res => this.TroNgai = res);
    this.subscriptions.push(sbUpdate);
  }

  private prepareUser() {
    const formValues = this.formGroup.value;
    this.TroNgai = Object.assign(this.TroNgai, formValues);
  }

  selectRow(code: string) {
    const index = this.congviecs.indexOf(code);
    if (index !== -1) this.congviecs.splice(index, 1);
    else
      this.congviecs.push(code);
  }

  isRowSelected(code: string): boolean {
    return this.congviecs.indexOf(code) >= 0;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  };

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
