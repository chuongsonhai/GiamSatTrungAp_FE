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
import { CauHinhCanhBao, SystemConfig } from 'src/app/modules/models/systemconfig.model';
import { CauHinhCanhBaoService } from 'src/app/modules/services/cauhinhcanhbao.service';

@Component({
  selector: 'app-update-cau-hinh-canh-bao',
  templateUrl: './update-cau-hinh-canh-bao.component.html',
  styleUrls: ['./update-cau-hinh-canh-bao.component.scss']
})

export class UpdateCauHinhCanhBaoComponent implements OnInit {
  @Input() id: string;
  EMPTY: any;
  CauHinhCanhBao: CauHinhCanhBao;

  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  constructor(
      public service: CauHinhCanhBaoService,
      private fb: FormBuilder,
      public modal: NgbActiveModal,
      private router: Router,
      private toastr: ToastrService
  ) {
      this.EMPTY = {
        maLoaiCanhBao: 0,
        tenLoaiCanhbao: undefined,
        chuKy: undefined,
      }
  }

  ngOnInit(): void {
      this.isLoadingForm$.next(true);
      setTimeout(() => {
          this.isLoadingForm$.next(false);
      }, 1000);

      this.CauHinhCanhBao = Object.assign(new CauHinhCanhBao(), this.EMPTY);
      this.loadForm();
      if (this.id !== undefined) {
          this.isLoadingForm$.next(true);
          const sb = this.service.getItemById(this.id).pipe(
              first(),
              catchError((errorMessage) => {
                  return of(this.CauHinhCanhBao);
              })
          ).subscribe((res) => {
              if (res) {
                  this.isLoadingForm$.next(true);
                  this.CauHinhCanhBao = res.data;
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
            maLoaiCanhBao: [this.CauHinhCanhBao.maLoaiCanhBao],
            chuKy: [this.CauHinhCanhBao.chuKy, Validators.required],
            tenLoaiCanhbao: [this.CauHinhCanhBao.tenLoaiCanhbao, Validators.required],
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
      this.CauHinhCanhBao = Object.assign(this.CauHinhCanhBao, formValues);
      if ( this.CauHinhCanhBao.maLoaiCanhBao > 0) {
          this.edit();
      }
      else
          this.create();
  }

  create() {
      const sbUpdate = this.service.create(this.CauHinhCanhBao).pipe(
          tap(() => {
              this.CauHinhCanhBao = Object.assign(new CauHinhCanhBao(), this.EMPTY);
              this.modal.close();
          }),
          catchError((errorMessage) => {
              this.modal.dismiss(errorMessage);
              return of(this.CauHinhCanhBao);
          }),
      ).subscribe(res => this.CauHinhCanhBao = res);
      this.subscriptions.push(sbUpdate);
  }

  edit() {
      const sbUpdate = this.service.updateCauHinh(this.CauHinhCanhBao).pipe(
          tap(() => {
              this.modal.close();
          }),
          catchError((errorMessage) => {
              this.modal.dismiss(errorMessage);
              return of(this.CauHinhCanhBao);
          }),
      ).subscribe(res => {
        if (res.success) {
          this.toastr.success("Cập nhật thành công", "Thông báo");
        }
        else {
          this.toastr.error(res.message, "Thông báo");
          return of(this.CauHinhCanhBao);
        }
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

