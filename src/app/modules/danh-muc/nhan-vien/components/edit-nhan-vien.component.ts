import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from '../../../../_metronic/core';
import { DatePipe, formatDate } from '@angular/common';
import * as _moment from 'moment';
import { BoPhanService, CommonService } from 'src/app/modules/services/base.service';
import { Options } from 'select2';
import { NhanVienService } from 'src/app/modules/services/nhanvien.service';
import { NhanVien } from 'src/app/modules/models/nhanvien.model';

var EMPTY: {
  username: undefined,
  fullName: undefined,
  email: undefined,
};

@Component({
  selector: 'app-edit-nhan-vien',
  templateUrl: './edit-nhan-vien.component.html',
  styleUrls: ['./edit-nhan-vien.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe
  ]
})
export class EditNhanVienComponent implements OnInit, OnDestroy {
  @Input() id: number;
  isLoading$;
  NhanVien: NhanVien;
  congviecs: string[] = [];
  bophans: string[] = [];
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];

  public options: Options;
  public optionsNV: Options;

  constructor(
    private service: NhanVienService,
    public commonService: CommonService,
    public boPhanService:BoPhanService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private datePipe: DatePipe
  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.service.isLoading$;
    this.NhanVien = Object.assign(new NhanVien(), EMPTY);
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
    ).subscribe((NhanVien: NhanVien) => {
      if (NhanVien) {
        this.NhanVien = NhanVien;
        if (this.NhanVien.CVIEC)
          this.congviecs = this.NhanVien.CVIEC.split(',');
          this.bophans = this.NhanVien.MA_BPHAN.split(',');
        this.loadForm();
        const example = merge(
          this.commonService.getCongViecs(),
          this.boPhanService.getListBoPhan(this.NhanVien.MA_DVIQLY)
        );

        const subscribe = example.pipe(
          catchError(err => {
            return of(undefined);
          })).subscribe();
        this.subscriptions.push(subscribe);
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    try {
      this.formGroup = this.fb.group({
        ID: [this.NhanVien.ID],
        MA_DVIQLY: [this.NhanVien.MA_DVIQLY],
        MA_BPHAN: [this.NhanVien.MA_BPHAN],
        TEN_NVIEN: [this.NhanVien.TEN_NVIEN],
        DIA_CHI: [this.NhanVien.DIA_CHI],
        DIEN_THOAI: [this.NhanVien.DIEN_THOAI],
        EMAIL: [this.NhanVien.EMAIL],
        TRUONG_BPHAN: [this.NhanVien.TRUONG_BPHAN],
        CVIEC: [this.NhanVien.CVIEC]
      });
    }
    catch (error) {

    }
  }

  save() {
    this.prepareUser();
    this.NhanVien.CVIEC = "";
    this.NhanVien.MA_BPHAN = "";
    this.NhanVien.CVIEC = this.congviecs.join(",");
    this.NhanVien.MA_BPHAN=this.bophans.join(",");
    debugger;
    if (this.NhanVien.ID) {
      this.edit();
    }
  }

  edit() {
    const sbUpdate = this.service.update(this.NhanVien).pipe(
      tap(() => {
        this.NhanVien = Object.assign(new NhanVien(), EMPTY);
        this.loadForm();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        this.modal.dismiss(errorMessage);
        return of(this.NhanVien);
      }),
    ).subscribe(res => this.NhanVien = res);
    this.subscriptions.push(sbUpdate);
  }

  private prepareUser() {
    const formValues = this.formGroup.value;
    this.NhanVien = Object.assign(this.NhanVien, formValues);
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

  selectRowBP(code: string) {
    const index = this.bophans.indexOf(code);
    if (index !== -1) this.bophans.splice(index, 1);
    else
      this.bophans.push(code);
  }

  isRowSelectedBP(code: string): boolean {
    return this.bophans.indexOf(code) >= 0;
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
