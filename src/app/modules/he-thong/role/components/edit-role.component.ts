import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../_metronic/core';
import { DatePipe, formatDate } from '@angular/common';
import * as _moment from 'moment';
import DateTimeUtil from "../../../../_metronic/shared/datetime.util";
import { Role } from '../../../../_models/role';
import { RoleService } from '../../../services/role.service';
import { CommonService } from 'src/app/modules/services/common.service';
import { GroupingState } from 'src/app/_metronic/shared/crud-table';

var EMPTY: {  
  groupName: undefined,
  description: undefined,
  isSysadmin: false,
  Permission: []
};

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})
export class EditRoleComponent implements OnInit, OnDestroy {
  @Input() id: number;
  Role: Role;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  permissioncodes: string[] = [];

  constructor(
    private RoleService: RoleService,
    public CommonService: CommonService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private datePipe: DatePipe
  ) {
  }

  isLoading$ = new BehaviorSubject<boolean>(false);
  ngOnInit(): void {
    this.loadData();

    var mer = merge(
      this.CommonService.getModules()
    );

    const resultConcat = concat(mer);
    resultConcat.pipe(catchError(err => {
      return undefined;
    })
    ).subscribe();
  }

  loadData() {
    if (!this.id) {
      this.Role = Object.assign(new Role(), EMPTY);
      this.loadForm();
    } else {
      const sb = this.RoleService.getItemById(this.id).pipe(
        first(),
        catchError((errorMessage) => {
          this.modal.dismiss(errorMessage);
          return of(undefined);
        })
      ).subscribe((Role: Role) => {
        if (Role) {          
          this.Role = Role;
          this.permissioncodes = this.Role.Permissions;
          this.loadForm();
        }
      });
      this.subscriptions.push(sb);
    }
  }

  loadForm() {
    try {
      this.formGroup = this.fb.group({
        groupName: [this.Role.groupName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
        description: [this.Role.description, Validators.compose([Validators.minLength(3), Validators.maxLength(150)])],
        isSysadmin: [this.Role.isSysadmin],
        Permissions: [this.Role.Permissions]
      });
    }
    catch (error) {

    }
  }

  save() {    
    this.prepareUser();
    this.Role.Permissions = [];
    this.Role.Permissions = this.permissioncodes;
    if (this.Role.groupId) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    const sbUpdate = this.RoleService.update(this.Role).pipe(
      tap(() => {
        this.Role = Object.assign(new Role(), EMPTY);
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.Role);
      }),
    ).subscribe(res => this.Role = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    const sbCreate = this.RoleService.create(this.Role).pipe(
      tap(() => {
        this.Role = Object.assign(new Role(), EMPTY);
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.Role);
      }),
    ).subscribe((res: Role) => this.Role = res);
    this.subscriptions.push(sbCreate);
  }

  private prepareUser() {
    const formValues = this.formGroup.value;
    this.Role = Object.assign(this.Role, formValues);
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
