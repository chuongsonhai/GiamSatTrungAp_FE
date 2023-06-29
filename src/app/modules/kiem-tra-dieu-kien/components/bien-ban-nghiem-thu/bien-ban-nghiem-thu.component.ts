import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, concat, merge, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import * as _moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BienBanNTService } from '../../../services/bienbannt.service';
import { BienBanNT } from '../../../models/bienbannt.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { CreateBienBanNghiemThuComponent } from './create-bien-ban-nghiem-thu/create-bien-ban-nghiem-thu.component';
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { HopDongService } from 'src/app/modules/services/hopdong.service';
import { HopDong } from 'src/app/modules/models/base.model';
import { BienBanTTService } from 'src/app/modules/services/bienbantt.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-bien-ban-nghiem-thu',
  templateUrl: './bien-ban-nghiem-thu.component.html',
  styleUrls: ['./bien-ban-nghiem-thu.component.scss']
})
export class BienBanNghiemThuComponent implements OnInit {
  @Input() congVanYeuCau: YeuCauNghiemThu;
  @Output() public reloadForm: EventEmitter<boolean>;

  EMPTY: any;
  BienBanNT: BienBanNT;
  hopDong: HopDong;

  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  formGroup: FormGroup;

  src: string;
  safeSrc: SafeResourceUrl;

  srcTTDN: string;
  safeSrcTTDN: SafeResourceUrl;

  srcBBNT: string;
  safeSrcBBNT: SafeResourceUrl;

  private subscriptions: Subscription[] = [];

  constructor(
    public service: HopDongService,
    public BienBanNTService: BienBanNTService,
    public bienBanTTService: BienBanTTService,
    private confirmationDialogService: ConfirmationDialogService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    public route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public CommonService: CommonService,
    private toastr: ToastrService
  ) {
    this.reloadForm = new EventEmitter<boolean>();
    this.EMPTY = {
      ID: 0,
      Name: undefined,
      Description: undefined,
      File: undefined,
      TrangThai: 0
    }
  }

  tabs = {
    ThoaThuanDauNoi: 1,
    PhuLucHopDong: 2,
    HopDongMuaBan: 3,
    PhanCongThiCong: 4,
    BienBanTreoThao: 5,
    DeNghiNghiemThu: 6,
    BienBanNghiemThu: 7,
    TaiLieuNghiemThu: 8
  };

  activeTabId = this.tabs.ThoaThuanDauNoi;
  ngOnInit(): void {
    this.BienBanNT = Object.assign(new BienBanNT(), this.EMPTY);
    this.loadForm();
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    if (this.congVanYeuCau && this.congVanYeuCau.ID > 0) {
      this.getPDF(this.congVanYeuCau.PdfBienBanDN, "BBDN");
      this.loadData();
      if (this.congVanYeuCau.TrangThai === 6)
        this.activeTabId = this.tabs.PhanCongThiCong;
      if (this.congVanYeuCau.TrangThai === 7 || this.congVanYeuCau.TrangThai === 8)
        this.activeTabId = this.tabs.BienBanTreoThao;
      if (this.congVanYeuCau.TrangThai > 8)
        this.activeTabId = this.tabs.BienBanNghiemThu;
      if (this.activeTabId != this.tabs.ThoaThuanDauNoi)
        this.changeTab(this.activeTabId);
    }
  }

  loadForm() {
    try {
      this.formGroup = this.fb.group({
        Data: [this.BienBanNT.Data],
      });
    }
    catch (error) {

    }
  }

  loadData() {
    const sb = this.BienBanNTService.getItem(this.congVanYeuCau.MaYeuCau).pipe(
      first(),
      catchError((errorMessage) => {
        return of(this.BienBanNT);
      })
    ).subscribe((BienBanNT: BienBanNT) => {
      if (BienBanNT) {
        this.isLoadingForm$.next(true);
        this.BienBanNT = BienBanNT;
        if (this.BienBanNT.Data)
          this.getPDF(this.BienBanNT.Data, "BBNT");
        this.loadForm();
        this.isLoadingForm$.next(true);
        setTimeout(() => {
          this.isLoadingForm$.next(false);
        }, 2000);
      }
    });

    this.subscriptions.push(sb);
  }

  getPDF(path: string, key: string): any {
    this.isLoadingForm$.next(true);
    this.CommonService.getPDF(path).subscribe((response) => {
      var binary_string = window.atob(response);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      let file = new Blob([bytes.buffer], { type: 'application/pdf' });
      var src = URL.createObjectURL(file);
      var safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(src);
      if (key === "BBDN") {
        this.srcTTDN = src;
        this.safeSrcTTDN = safeSrc;
      }
      else {
        this.src = src;
        this.safeSrc = safeSrc;
      }
    }), finalize(() => this.isLoadingForm$.next(false))
  }

  getUrl(key: string) {
    if (key === 'BBDN') return this.sanitizer.bypassSecurityTrustResourceUrl(this.srcTTDN);
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
  }

  changeTab(tabId: number) {
    if (this.congVanYeuCau.TrangThai <= 5 && tabId > 3)
      tabId = this.tabs.HopDongMuaBan;
    this.activeTabId = tabId;
  }

  public reloadData(reload: boolean) {
    if (reload)
      this.reloadForm.emit(reload);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  create() {
    const modalRef = this.modalService.open(CreateBienBanNghiemThuComponent, { size: 'md' });
    modalRef.componentInstance.maYeuCau = this.congVanYeuCau.MaYeuCau;
    modalRef.result.then(() => {
      this.isLoadingForm$.next(true);
      this.toastr.success('Lập biên bản nghiệm thu thành công', 'Thông báo');
      this.loadData();
      this.isLoadingForm$.next(false);
    }
    );
  }

  submited = new BehaviorSubject<boolean>(false);
  approve() {
    this.confirmationDialogService.confirm('Thông báo', 'Bạn muốn duyệt biên bản?')
      .then((confirmed) => {
        if (confirmed) {
          this.submited.next(true);
          const sbSign = this.BienBanNTService.approve(this.BienBanNT).pipe(
            catchError((errorMessage) => {
              this.toastr.error("Chưa duyệt được biên bản, vui lòng thực hiện lại", "Thông báo");
              return of(this.BienBanNT);
            }),
          ).subscribe((res) => {
            this.submited.next(true);
            if (res.success) {
              this.toastr.success("Đã duyệt biên bản nghiệm thu", "Thành công");
              this.isLoadingForm$.next(true);
              this.loadData();
              this.isLoadingForm$.next(false);
            }
            else
              this.toastr.error(res.message, "Thông báo");
          });
          this.subscriptions.push(sbSign);
        }
      });
  }
}