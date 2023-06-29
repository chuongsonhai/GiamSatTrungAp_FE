import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../_metronic/core';
import { DatePipe, formatDate } from '@angular/common';
import * as _moment from 'moment';
import { BoPhanService, CommonService, UserService } from 'src/app/modules/services/base.service';
import { Options } from 'select2';
import { BoPhan } from 'src/app/modules/models/bophan.model';

var EMPTY: {
  username: undefined,
  fullName: undefined,
  email: undefined,
};

@Component({
  selector: 'app-edit-bo-phan',
  templateUrl: './edit-bo-phan.component.html',
  styleUrls: ['./edit-bo-phan.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})
export class EditBoPhanComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  BoPhan: BoPhan;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  congviecs: string[] = [];

  public options: Options;
  public optionsNV: Options;

  constructor(
    private service: BoPhanService,
    public commonService: CommonService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private datePipe: DatePipe
  ) {

  }

  tabs = {
    BASIC_TAB: 0,
    GROUPS_TAB: 1
  };

  activeTabId = this.tabs.BASIC_TAB;

  changeTab(item: number) {
    this.activeTabId = item;
  }
  ngOnInit(): void {
    this.isLoading$ = this.service.isLoading$;
    this.BoPhan = Object.assign(new BoPhan(), EMPTY);
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
    ).subscribe((BoPhan: BoPhan) => {
      if (BoPhan) {
        this.BoPhan = BoPhan;
        this.congviecs = this.BoPhan.CongViecs;
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
        ID: [this.BoPhan.ID],
        MA_DVIQLY: [this.BoPhan.MA_DVIQLY],
        MA_BPHAN: [this.BoPhan.MA_BPHAN],
        TEN_BPHAN: [this.BoPhan.TEN_BPHAN],
        MO_TA: [this.BoPhan.MO_TA],
        GHI_CHU: [this.BoPhan.GHI_CHU]
      });
    }
    catch (error) {

    }
  }

  save() {
    this.prepareUser();
    this.BoPhan.CongViecs = [];
    this.BoPhan.CongViecs = this.congviecs;
    if (this.BoPhan.ID) {
      this.edit();
    }
  }

  edit() {
    const sbUpdate = this.service.update(this.BoPhan).pipe(
      tap(() => {
        this.BoPhan = Object.assign(new BoPhan(), EMPTY);
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.BoPhan);
      }),
    ).subscribe(res => this.BoPhan = res);
    this.subscriptions.push(sbUpdate);
  }

  private prepareUser() {
    const formValues = this.formGroup.value;
    this.BoPhan = Object.assign(this.BoPhan, formValues);
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
