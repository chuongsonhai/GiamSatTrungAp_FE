import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import * as _moment from 'moment';
import { Router } from '@angular/router';
import DateTimeUtil from 'src/app/_metronic/shared/datetime.util';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/modules/services/common.service';
import { PhanCongKS } from 'src/app/modules/models/phancongks.model';
import { PhanCongKSService } from 'src/app/modules/services/phancongks.service';
import { CongVanYeuCau } from 'src/app/modules/models/congvanyeucau.model';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { MetadataService } from 'src/app/modules/services/metadata.service';
import { TienTrinhData } from 'src/app/modules/models/tientrinhdata.model';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ResponseModel } from 'src/app/modules/models/response.model';

@Component({
  selector: 'app-phan-cong-khao-sat',
  templateUrl: './phan-cong-khao-sat.component.html',
  styleUrls: ['./phan-cong-khao-sat.component.scss']
})
export class PhanCongKSComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: CongVanYeuCau;
  @Output() public reloadData: EventEmitter<boolean>;
  
  EMPTY: any;
  PhanCongKS: PhanCongKS;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  startDate = new Date();

  allowApprove = new BehaviorSubject<boolean>(false);

  constructor(
    private auth: AuthenticationService,
    public service: PhanCongKSService,
    public metadataService: MetadataService,
    public commonService: CommonService,
    private confirmationDialogService: ConfirmationDialogService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.allowApprove.next(auth.isSysAdmin() || auth.checkPermission('YCDN-PC'));
    this.reloadData = new EventEmitter<boolean>();
    this.EMPTY = {
      ID: 0,
      MA_DVIQLY: undefined,
      MA_YCAU_KNAI: undefined,
      MA_DDO_DDIEN: undefined,
      NDUNG_XLY: undefined,

      MA_BPHAN_GIAO: undefined,
      MA_NVIEN_GIAO: undefined,

      MA_BPHAN_NHAN: '',
      MA_NVIEN_NHAN: '',

      NGAY_HEN: DateTimeUtil.convertDateToStringVNDefaulDateNow(this.startDate),
      NGAY_BDAU: undefined,
      NGAY_KTHUC: undefined,
      MA_CVIEC: '',
      MA_LOAI_YCAU: undefined,

      TRANG_THAI: 0,
      MA_NVIEN_KS: ''
    }
  }
  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    if (this.congVanYeuCau.MaYeuCau !== undefined) {
      this.loadData();
    }
  }
  checkSelect(ma){
    if(ma!=null){
      return this.formGroup.value.MA_NVIEN_KS===ma;
    }
  }

  tienTrinhData: TienTrinhData;
  loadData() {
    this.isLoadingForm$.next(true);
    this.PhanCongKS = Object.assign(new PhanCongKS(), this.EMPTY);
    this.tienTrinhData = Object.assign(new TienTrinhData(), this.EMPTY);
    this.loadForm();
    const sb = this.service.getItem(this.congVanYeuCau.ID).pipe(
      first(),
      catchError((errorMessage) => {
        return of(this.PhanCongKS);
      })
    ).subscribe((PhanCongKS: PhanCongKS) => {
      if (PhanCongKS) {
        this.PhanCongKS = PhanCongKS;
        this.PhanCongKS.MA_CVIEC_TRUOC = "PK";
        const sb = this.metadataService.getCongViecs(this.congVanYeuCau.MaYeuCau, this.PhanCongKS.MA_CVIEC_TRUOC).pipe(
          catchError((errorMessage) => {
            return of(this.tienTrinhData);
          }), finalize(() => {
            this.loadForm();
            this.isLoadingForm$.next(false);
          })
        ).subscribe(res => {
          if (res.success) {
            debugger;
            this.tienTrinhData = res.data;
            this.PhanCongKS.MA_BPHAN_NHAN = this.tienTrinhData.deptId;
            //this.PhanCongKS.MA_NVIEN_KS = this.tienTrinhData.staffCode;
            this.PhanCongKS.MA_CVIEC = this.tienTrinhData.maCViec;
            this.loadStaffs(this.tienTrinhData.deptId);
            this.loadForm();
     
          }
        });
      }
    });
    this.subscriptions.push(sb);
  }

  loadForm() {
    try {
      this.formGroup = this.fb.group({
        MA_YCAU_KNAI: [this.PhanCongKS.MA_YCAU_KNAI],
        MA_LOAI_YCAU: [this.PhanCongKS.MA_LOAI_YCAU],
        NDUNG_XLY: [this.PhanCongKS.NDUNG_XLY],

        MA_NVIEN_KS: [this.PhanCongKS.MA_NVIEN_KS, Validators.required],

        NGAY_HEN: [this.PhanCongKS.NGAY_HEN],
        NGAY_BDAU: [this.PhanCongKS.NGAY_BDAU],
        NGAY_KTHUC: [this.PhanCongKS.NGAY_KTHUC],
        MA_CVIEC: [this.PhanCongKS.MA_CVIEC],
        TRANG_THAI: [this.PhanCongKS.TRANG_THAI]
      });
    }
    catch (error) {

    }
  }

  loadStaffs(deptId: string) {
    if (deptId && deptId !== undefined) {
      const sb = this.commonService.getNhanViens(this.congVanYeuCau.MaDViQLy, deptId).pipe(
        catchError((errorMessage) => {
          return of(this.tienTrinhData);
        }), finalize(() => {
          this.loadForm();
          this.isLoadingForm$.next(false);
        })
      ).subscribe(res => {
        if (res.success) {
          this.tienTrinhData.nhanViens = res.data;          
          if(this.PhanCongKS.MA_NVIEN_KS===null){
            this.PhanCongKS.MA_NVIEN_KS=this.tienTrinhData.nhanViens[0].MA_NVIEN;
          }
        }
      });
    }
  }

  submited= new BehaviorSubject<boolean>(false);

  save() {
    this.confirmationDialogService.confirm('Thông báo', 'Dữ liệu sẽ không được sửa đổi sau khi lưu, bạn muốn gửi yêu cầu?')
      .then((confirmed) => {
        if (confirmed) {
          this.submited.next(true);
          this.formGroup.markAllAsTouched();
          const formValues = this.formGroup.value;
          this.PhanCongKS = Object.assign(this.PhanCongKS, formValues);
          this.PhanCongKS.TRANG_THAI = 1;
          if (this.PhanCongKS.ID > 0) {
            this.edit();
          }
          else {
            this.create();
          }
        }
      });
  }

  cancel() {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn phân công lại?')
      .then((confirmed) => {
        if (confirmed) {
          this.submited.next(true);
          this.isLoadingForm$.next(true);
          const sbUpdate = this.service.phanCongLai(this.PhanCongKS).pipe(
            tap(() => {
              this.loadData();
            }),
            catchError((errorMessage) => {
              this.submited.next(false);
              this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
              return of(this.PhanCongKS);
            }),
            finalize(() => {
              this.reloadData.emit(true);
              this.isLoadingForm$.next(false);
            })).subscribe((res: ResponseModel) => {
              this.submited.next(false);
              if (res.success) {
                this.toastr.success("Thực hiện thành công", "Thông báo");
              }
              else
                this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
            });
          this.subscriptions.push(sbUpdate);
        }
      });
  }

  edit() {
    this.isLoadingForm$.next(true);
    const sbUpdate = this.service.update(this.PhanCongKS).pipe(
      tap(() => {
        this.PhanCongKS = Object.assign(new PhanCongKS(), this.EMPTY);
        this.loadData();
      }),
      catchError((errorMessage) => {
        this.submited.next(false);
        this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
        return of(this.PhanCongKS);
      }),
      finalize(() => {
        this.reloadData.emit(true);
        this.isLoadingForm$.next(false);
      })).subscribe((res: PhanCongKS) => {
        this.submited.next(false);
        if (res !== null && res !== undefined) {
          this.PhanCongKS = res;
          this.toastr.success("Thực hiện thành công", "Thông báo");
        }
        else
          this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
      });
    this.subscriptions.push(sbUpdate);
  }

  create() {
    this.isLoadingForm$.next(true);
    const sbCreate = this.service.create(this.PhanCongKS).pipe(
      catchError((errorMessage) => {
        this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
        this.submited.next(false);
        return of(this.PhanCongKS);
      }),
      finalize(() => {
        this.isLoadingForm$.next(false);
      })).subscribe((res: PhanCongKS) => {
        this.submited.next(false);
        if (res !== null && res !== undefined) {
          this.toastr.success("Thực hiện thành công", "Thông báo");
          this.reloadData.emit(true);
        }
        else
          this.toastr.error("Có lỗi xảy ra, vui lòng thực hiện lại", "Thông báo");
      });
    this.subscriptions.push(sbCreate);
  }  

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
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
