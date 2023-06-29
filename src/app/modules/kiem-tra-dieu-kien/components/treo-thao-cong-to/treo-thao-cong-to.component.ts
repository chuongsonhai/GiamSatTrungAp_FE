import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { CommonService } from 'src/app/modules/services/base.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { BienBanTTService } from 'src/app/modules/services/bienbantt.service';
import { ConfirmationDialogService } from 'src/app/modules/share-component/confirmation-dialog/confirmation-dialog.service';
import { BienBanTTData } from 'src/app/modules/models/bienbantt.model';

@Component({
  selector: 'app-treo-thao-cong-to',
  templateUrl: './treo-thao-cong-to.component.html',
  styleUrls: ['./treo-thao-cong-to.component.scss']
})
export class TreoThaoCongToComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: YeuCauNghiemThu;
  @Output() public reloadForm: EventEmitter<boolean>;

  EMPTY: any;
  BienBanTTData: BienBanTTData;
  constructor(
    public commonService: CommonService,
    public service: BienBanTTService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService) {

    this.reloadForm = new EventEmitter<boolean>();
    this.EMPTY = {
      deptId: 0,
      staffCode: '',
      ngayHen: '',
      noiDung: '',
      maCViec: ''
    }
  }

  tabs = {
    ThoaThuanDauNoi: 1,
    YeuCauKiemTra: 2,
    PhanCongThiCong: 3,
    KetQuaThiCong: 4,
    BienBanTreoThao: 5,
  };

  srcCV: string;
  safeSrcCV: SafeResourceUrl;

  srcTTDN: string;
  safeSrcTTDN: SafeResourceUrl;

  srcBBNT: string;
  safeSrcBBNT: SafeResourceUrl;

  isLoadingForm$ = new BehaviorSubject<boolean>(false);

  activeTabId = this.tabs.ThoaThuanDauNoi; // 0 => Basic info;

  ngOnInit() {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    if (this.congVanYeuCau && this.congVanYeuCau.ID > 0) {
      this.getPDF(this.congVanYeuCau.PdfBienBanDN, "BBDN");
        if (this.congVanYeuCau.Data && this.congVanYeuCau.Data !== undefined) {
          this.getPDF(this.congVanYeuCau.Data, "CVYC");
        }
      this.loadData();
    }
  }

  loadData() {
    this.isLoadingForm$.next(true);
    const sb = this.service.getItem(this.congVanYeuCau.ID).pipe(
      first(),
      catchError((errorMessage) => {
        this.isLoadingForm$.next(false);
        return of(this.BienBanTTData);
      }),
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((BienBanTTData: BienBanTTData) => {
      if (BienBanTTData) {
        this.BienBanTTData = BienBanTTData;
        this.isLoadingForm$.next(true);
        setTimeout(() => {
          this.isLoadingForm$.next(false);
        }, 2000);
      }
    });
  }

  getPDF(path: string, key: string): any {
    this.isLoadingForm$.next(true);
    this.commonService.getPDF(path).subscribe((response) => {
      var binary_string = window.atob(response);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      let file = new Blob([bytes.buffer], { type: 'application/pdf' });
      var src = URL.createObjectURL(file);
      var safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(src);
      if (key === "CVYC") {
        this.srcCV = src;
        this.safeSrcCV = safeSrc;
      }
      if (key === "BBDN") {
        this.srcTTDN = src;
        this.safeSrcTTDN = safeSrc;
      }
      if (key === "BBNT") {
        this.srcBBNT = src;
        this.safeSrcBBNT = safeSrc;
      }
    }), finalize(() => this.isLoadingForm$.next(false))
  }

  getUrl(key: string) {
    if (key === 'CVYC') return this.sanitizer.bypassSecurityTrustResourceUrl(this.srcCV);
    if (key === 'BBDN') return this.sanitizer.bypassSecurityTrustResourceUrl(this.srcTTDN);
    else return this.sanitizer.bypassSecurityTrustResourceUrl(this.srcBBNT);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }
  
  public reloadTab(reload: boolean) {
    if (reload) {
      this.isLoadingForm$.next(true);
      if (this.activeTabId > 1) {
        this.activeTabId = this.activeTabId - 1;
        this.changeTab(this.activeTabId);
      }
      this.isLoadingForm$.next(false);
    }
  }

  public reloadData(reload: boolean) {
    this.loadData();
    this.reloadForm.emit(reload);
  }

  private subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
