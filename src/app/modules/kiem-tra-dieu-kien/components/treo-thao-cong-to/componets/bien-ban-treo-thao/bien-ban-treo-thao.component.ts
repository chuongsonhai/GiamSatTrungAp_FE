import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import * as _moment from 'moment';
import { Router } from '@angular/router';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/modules/services/common.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { BienBanTT, ChiSo, MayBienDienAp, MayBienDong } from 'src/app/modules/models/bienbantt.model';
import { BienBanTTService } from 'src/app/modules/services/bienbantt.service';
import { ApproveModel } from 'src/app/modules/models/bienbanks.model';
import { ApproveNghiemThuTemplateComponent } from 'src/app/modules/share-component/approve-nghiem-thu/approve-nghiem-thu.component';

@Component({
  selector: 'app-bien-ban-treo-thao',
  templateUrl: './bien-ban-treo-thao.component.html',
  styleUrls: ['./bien-ban-treo-thao.component.scss']
})
export class BienBanTreoThaoComponent implements OnInit {
  @Input() congVanYeuCau: YeuCauNghiemThu;
  @Input() bienbantreothao: BienBanTT;
  @Output() public reloadData: EventEmitter<boolean>;

  EMPTY: any;
  BienBanTT: BienBanTT;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);;
  private subscriptions: Subscription[] = [];

  constructor(
    public service: BienBanTTService,
    public commonService: CommonService,
    private confirmationDialogService: ConfirmationDialogService,
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    public modal: NgbActiveModal,
    private toastr: ToastrService
  ) {
    this.reloadData = new EventEmitter<boolean>();
    this.EMPTY = {
      ID: 0,
    }

  }
  ngOnInit(): void {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    if (this.bienbantreothao) {
      this.loadData();
      this.isLoadingForm$.next(true);
      setTimeout(() => {
        this.isLoadingForm$.next(false);
      }, 2000);
    }
  }

  loadData() {
    this.isLoadingForm$.next(true);
    this.BienBanTT = Object.assign(new BienBanTT(), this.bienbantreothao);
    this.isLoadingForm$.next(false);
  }

  tabs = {
    ThongTinKhachHang: 1,
    ChiTietThietBiTreo: 2,
    ChiTietThietBiThao: 3,
  };
  activeTabId = this.tabs.ThongTinKhachHang; // 0 => Basic info;
  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  submited= new BehaviorSubject<boolean>(false);

  saveDraft() {
    this.submited.next(true);
    this.getData();
    this.BienBanTT.TRANG_THAI = 0;
    if (this.BienBanTT.ID > 0) {
      this.edit();
    }
    else {
      this.create();
    }
  }

  save() {
    this.submited.next(true);
    this.getData();
    this.BienBanTT.TRANG_THAI = 1;
    if (this.BienBanTT.ID > 0) {
      this.edit();
    }
    else {
      this.create();
    }
  }

  edit() {
    var data = JSON.stringify(this.BienBanTT);
    const sbUpdate = this.service.updateBBTT(data).pipe(
      tap(() => {
        this.submited.next(false);
        this.BienBanTT = Object.assign(new BienBanTT(), this.EMPTY);
        this.reloadData.emit(true);
        this.loadData();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        return of(this.BienBanTT);
      }),
    ).subscribe(res => this.BienBanTT = res);
    this.subscriptions.push(sbUpdate);
  }

  create() {
    var data = JSON.stringify(this.BienBanTT);
    const sbCreate = this.service.createBBTT(data).pipe(
      tap(() => {
        this.submited.next(false);
        this.BienBanTT = Object.assign(new BienBanTT(), this.EMPTY);
        this.reloadData.emit(true);
        this.loadData();
        this.modal.close();
      }),
      catchError((errorMessage) => {
        return of(this.BienBanTT);
      }),
    ).subscribe((res: BienBanTT) => this.BienBanTT = res);
    this.subscriptions.push(sbCreate);
  }

  approve() {
    let approveModel = Object.assign(new ApproveModel(), this.EMPTY);
    const modalRef = this.modalService.open(ApproveNghiemThuTemplateComponent, { size: 'lg' });
    modalRef.componentInstance.congVanYeuCau = this.congVanYeuCau;
    modalRef.componentInstance.approveModel.subscribe((resultModel) => {
      if (resultModel) {
        this.submited.next(true);
        approveModel.id = this.BienBanTT.ID;
        approveModel.deptId = resultModel.deptId;
        approveModel.staffCode = resultModel.staffCode;
        approveModel.ngayHen = resultModel.ngayHen;
        approveModel.noiDung = resultModel.noiDung;
        approveModel.maCViec = resultModel.maCViec;
      }
    });
    modalRef.result.then(
      () => {
        this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn xác nhận biên bản treo tháo?')
          .then((confirmed) => {
            if (confirmed) {
              this.submited.next(true);
              if (approveModel) {
                this.getData();
                var data = JSON.stringify(this.BienBanTT);
              }
            }
          });
      }
    );
  }

  getData() {
    this.service.BienBanTTForm.markAllAsTouched();
    const formValuesThongTin = this.service.BienBanTTForm.value;
    this.BienBanTT = Object.assign(this.BienBanTT, formValuesThongTin);
    this.BienBanTT.ChiTietThietBiTreo.MayBienDongs = [];
    this.BienBanTT.ChiTietThietBiTreo.MayBienDienAps = [];
    this.BienBanTT.ChiTietThietBiTreo.CongTo.ChiSos = [];
    this.BienBanTT.ChiTietThietBiThao.MayBienDongs = [];
    this.BienBanTT.ChiTietThietBiThao.MayBienDienAps = [];
    this.BienBanTT.ChiTietThietBiThao.CongTo.ChiSos = [];
    this.service.ChiTietThietBiTreoForm.markAllAsTouched();
    const formValuesChiTietTreo = this.service.ChiTietThietBiTreoForm.value;
    this.BienBanTT.ChiTietThietBiTreo.CongTo = Object.assign(this.BienBanTT.ChiTietThietBiTreo.CongTo, formValuesChiTietTreo);
    this.BienBanTT.ChiTietThietBiTreo.IsCongTo=formValuesChiTietTreo["IsCongTo"];
    this.BienBanTT.ChiTietThietBiTreo.IsMBD=formValuesChiTietTreo["IsMBD"];
    this.BienBanTT.ChiTietThietBiTreo.IsMBDA=formValuesChiTietTreo["IsMBDA"];
    this.BienBanTT.ChiTietThietBiTreo.CongTo.LOAI = 1;
    const controlTreoMBD = this.service.dataTableTreo.get('tableMBD') as FormArray;
    const controlTreoMBDA = this.service.dataTableTreo.get('tableMBDA') as FormArray;
    const controlTreoChiSo = this.service.dataTableTreo.get('tableChiSo') as FormArray;
    controlTreoChiSo.controls.forEach(control => {
      const formTreoChiSoValue = control.value;
      var chiSo = Object.assign(new ChiSo, null);
      chiSo = Object.assign(chiSo, formTreoChiSoValue);
      this.BienBanTT.ChiTietThietBiTreo.CongTo.ChiSos.push(chiSo);
    });

    controlTreoMBD.controls.forEach(control => {
      const formTreoMBDValue = control.value;
      var mBD = Object.assign(new MayBienDong, null);
      mBD = Object.assign(mBD, formTreoMBDValue);
      if (mBD.SO_TBI != null && mBD.SO_TBI != "") {
        mBD.TI_THAO = false;
        this.BienBanTT.ChiTietThietBiTreo.MayBienDongs.push(mBD);
      }
    });

    controlTreoMBDA.controls.forEach(control => {
      const formTreoMBDAValue = control.value;
      var mBDA = Object.assign(new MayBienDienAp, null);
      mBDA = Object.assign(mBDA, formTreoMBDAValue);
      if (mBDA.SO_TBI != null && mBDA.SO_TBI != "") {
        mBDA.TU_THAO = false;
        this.BienBanTT.ChiTietThietBiTreo.MayBienDienAps.push(mBDA);
      }
    });

    // this.service.ChiTietThietBiThaoForm.markAllAsTouched();
    // const formValuesChiTietThao = this.service.ChiTietThietBiThaoForm.value;
    // this.BienBanTT.ChiTietThietBiThao.CongTo = Object.assign(this.BienBanTT.ChiTietThietBiThao.CongTo, formValuesChiTietThao);
    // this.BienBanTT.ChiTietThietBiThao.CongTo.LOAI = 0;
    // const controlThaoMBD = this.service.dataTableThao.get('tableMBD') as FormArray;
    // const controlThaoMBDA = this.service.dataTableThao.get('tableMBDA') as FormArray;
    // const controlThaoChiSo = this.service.dataTableThao.get('tableChiSo') as FormArray;
    // controlThaoChiSo.controls.forEach(control => {
    //   const formThaoChiSoValue = control.value;
    //   var chiSo = Object.assign(new ChiSo, null);
    //   chiSo = Object.assign(chiSo, formThaoChiSoValue);
    //   this.BienBanTT.ChiTietThietBiThao.CongTo.ChiSos.push(chiSo);

    // });
    // controlThaoMBD.controls.forEach(control => {
    //   const formThaoMBDValue = control.value;
    //   var mBD = Object.assign(new MayBienDong, null);
    //   mBD = Object.assign(mBD, formThaoMBDValue);
    //   if (mBD.SO_TBI != null && mBD.SO_TBI != "") {
    //     mBD.TI_THAO = true;
    //     this.BienBanTT.ChiTietThietBiThao.MayBienDongs.push(mBD);
    //   }

    // });
    // controlThaoMBDA.controls.forEach(control => {
    //   const formThaoMBDAValue = control.value;
    //   var mBDA = Object.assign(new MayBienDienAp, null);
    //   mBDA = Object.assign(mBDA, formThaoMBDAValue);
    //   if (mBDA.SO_TBI != null && mBDA.SO_TBI != "") {
    //     mBDA.TU_THAO = true;
    //     this.BienBanTT.ChiTietThietBiThao.MayBienDienAps.push(mBDA);
    //   }
    // });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
