import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../_metronic/core';
import { DatePipe, formatDate } from '@angular/common';
import * as _moment from 'moment';
import { Userdata } from 'src/app/modules/models/userdata.model';
import { CommonService, UserService } from 'src/app/modules/services/base.service';
import { RoleService } from '../../../services/role.service';
import { Options } from 'select2';

var EMPTY: {
  username: undefined,
  fullName: undefined,
  email: undefined,
  password: undefined,
  isactive: true
};

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})
export class EditUserComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() orgCode: string;
  isLoading$;
  Userdata: Userdata;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  rolecodes: string[] = [];

  public options: Options;
  public optionsNV: Options;

  EMPTY: any;
  constructor(
    private UserService: UserService,
    public roleService: RoleService,
    public commonService: CommonService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private datePipe: DatePipe
  ) {
    this.options = {
      placeholder: "--- Bộ phận ---",
      allowClear: true,
      width: "100%",
    };
    this.optionsNV = {
      placeholder: "--- Nhân viên ---",
      allowClear: true,
      width: "100%",
    };
    this.EMPTY = {
      userId: 0,
      username: undefined,
      fullName: undefined,
      email: undefined,
      phoneNumber: undefined,
      maNVien: undefined,
      maDViQLy: undefined,
      maBPhan: undefined,
      NotifyId: undefined,
      password: undefined,
      isactive: true,
    }
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
    this.isLoading$ = this.UserService.isLoading$;
    this.Userdata = Object.assign(new Userdata(), this.EMPTY);
    this.Userdata.maDViQLy = this.orgCode;
    this.loadForm();
    const filter = {};
    this.roleService.patchState({ filter });
    const example = merge(
      this.commonService.getSelect2BoPhans(this.orgCode)
    );
    const subscribe = example.pipe(
      catchError(err => {
        return of(undefined);
      }), finalize(() => {
        this.loadForm();
      })).subscribe();
    this.subscriptions.push(subscribe);

    this.loadForm();
    if (this.id) {
      this.loadUser();
    }
  }

  loadUser() {
    const sb = this.UserService.getItemById(this.id).pipe(
      first(),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(undefined);
      })
    ).subscribe((Userdata: Userdata) => {
      if (Userdata) {
        this.Userdata = Userdata;
        this.rolecodes = this.Userdata.Roles;
        this.loadNhanViens(this.Userdata.maBPhan);
        this.loadForm();
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    try {
      this.formGroup = this.fb.group({
        userId: [this.Userdata.userId],
        username: [this.Userdata.username, Validators.compose([Validators.minLength(3), Validators.maxLength(50)])],
        fullName: [this.Userdata.fullName],
        email: [this.Userdata.email],
        phoneNumber: [this.Userdata.phoneNumber],
        maDViQLy: [this.Userdata.maDViQLy],
        maBPhan: [this.Userdata.maBPhan],
        maNVien: [this.Userdata.maNVien],
        NotifyId: [this.Userdata.NotifyId],
        password: [this.Userdata.password],
        isactive: [this.Userdata.isactive]
      });
    }
    catch (error) {

    }
  }

  loadNhanViens(maBPhan: string) {
    if (maBPhan && maBPhan !== undefined) {
      const example = merge(
        this.commonService.getSelect2NhanViens(this.Userdata.maDViQLy, maBPhan)
      );

      const subscribe = example.pipe(
        catchError(err => {
          return of(undefined);
        })).subscribe();
      this.subscriptions.push(subscribe);
    }
  }

  save() {
    this.prepareUser();
    
    this.Userdata.Roles = [];
    this.Userdata.Roles = this.rolecodes;
    if (this.Userdata.userId) {
      this.edit();
    }
    else
      this.create();
  }

  edit() {
    const sbUpdate = this.UserService.update(this.Userdata).pipe(
      tap(() => {
        this.Userdata = Object.assign(new Userdata(), EMPTY);
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.Userdata);
      }),
    ).subscribe(res => this.Userdata = res.data);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbUpdate = this.UserService.create(this.Userdata).pipe(
      tap(() => {
        this.Userdata = Object.assign(new Userdata(), EMPTY);
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.Userdata);
      }),
    ).subscribe(res => this.Userdata = res.data);
    this.subscriptions.push(sbUpdate);
  }

  private prepareUser() {
    const formValues = this.formGroup.value;
    this.Userdata = Object.assign(this.Userdata, formValues);
  }

  selectRow(code: string) {
    const index = this.rolecodes.indexOf(code);
    if (index !== -1) this.rolecodes.splice(index, 1);
    else
      this.rolecodes.push(code);
  }

  isRowSelected(code: string): boolean {
    return this.rolecodes.indexOf(code) >= 0;
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
