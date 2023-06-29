import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { Router } from '@angular/router';
import { BienBanDN, Organization } from 'src/app/modules/models/base.model';
import { BienBanDNService } from 'src/app/modules/services/bienbandn.service';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';
import { TramBienAp } from '../../../../models/trambienap.model';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-upload-du-thao-dau-noi',
  templateUrl: './upload-du-thao-dau-noi.component.html',
  styleUrls: ['./upload-du-thao-dau-noi.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    DatePipe

  ]
})
export class UploadDuThaoDNComponent implements OnInit {
  @Input() bienBanDN: BienBanDN;

  isLoadingForm$ = new BehaviorSubject<boolean>(false)
  private subscriptions: Subscription[] = [];
  startDate = new Date();
  formGroup: FormGroup;

  constructor(
    public service: BienBanDNService,
    public commonsrv: CommonService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    this.loadForm();

    if (this.bienBanDN !== null) {
      this.loadForm();
      this.isLoadingForm$.next(false);
    }
  }

  public upload(event) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.handleFileInput(event.target.files);
    }
  }

  fileToUpload: any;

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }

  loadForm() {
    try {
      this.formGroup = this.fb.group({
        MaKH: [this.bienBanDN.MaKH],
        SoBienBan: [this.bienBanDN.SoBienBan],
        NgayBienBan: [this.bienBanDN.NgayBienBan],                
        File: undefined,
      });
    }
    catch (error) {

    }
  }

  submited = new BehaviorSubject<boolean>(false);
  save() {
    if (this.fileToUpload) {
      this.submited.next(true);
      this.formGroup.markAllAsTouched();
      const formValues = this.formGroup.value;
      this.bienBanDN = Object.assign(this.bienBanDN, formValues);
      const sbUpdate = this.service.upload(this.fileToUpload, this.bienBanDN).pipe(
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
          this.toastr.success("Upload dự thảo thỏa thuận thành công", "Thông báo");
          this.bienBanDN = res;
        }
        else {
          this.toastr.error(res.message, "Thông báo");
          return of(this.bienBanDN);
        }
      });
      this.subscriptions.push(sbUpdate);
    } else {
      this.toastr.error("Chưa chọn file biên bản", "Thông báo");
    }
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