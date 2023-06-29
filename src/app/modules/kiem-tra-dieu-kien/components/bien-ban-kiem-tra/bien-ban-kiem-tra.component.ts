import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { CommonService } from 'src/app/modules/services/base.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { BienBanKTData } from 'src/app/modules/models/bienbanksdata.model';
import { YeuCauNghiemThuService } from 'src/app/modules/services/yeucaunghiemthu.service';

@Component({
  selector: 'app-bien-ban-kiem-tra',
  templateUrl: './bien-ban-kiem-tra.component.html',
  styleUrls: ['./bien-ban-kiem-tra.component.scss']
})
export class BienBanKiemTraComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: YeuCauNghiemThu;
  @Output() public reloadForm: EventEmitter<boolean>;

  EMPTY: any;
  BienBanKTData: BienBanKTData;

  constructor(
    public commonService: CommonService,
    public service: YeuCauNghiemThuService,
    private sanitizer: DomSanitizer,
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
    ThoaThuanDN: 1,
    PhanCongKT: 2,
    BienBanKT: 3,
    TaiLieuKT: 4,
  };

  srcCV: string;
  safeSrcCV: SafeResourceUrl;

  srcTTDN: string;
  safeSrcTTDN: SafeResourceUrl;

  isLoadingForm$ = new BehaviorSubject<boolean>(false);

  activeTabId = this.tabs.ThoaThuanDN; // 0 => Basic info;

  ngOnInit() {
    this.isLoadingForm$.next(true);
    setTimeout(() => {
      this.isLoadingForm$.next(false);
    }, 1000);
    if (this.congVanYeuCau.SoCongVan !== undefined) {
      this.isLoadingForm$.next(true);
      this.loadData();
      this.getPDF(this.congVanYeuCau.PdfBienBanDN, "BBDN");      
    }
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
    }), finalize(() => this.isLoadingForm$.next(false))
  }

  getUrl(key: string) {
    if (key === 'CVYC') return this.sanitizer.bypassSecurityTrustResourceUrl(this.srcCV);
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.srcTTDN);
  }

  loadData() {
    this.isLoadingForm$.next(true);
    const sb = this.service.getItemById(this.congVanYeuCau.ID).pipe(
      first(),
      catchError((errorMessage) => {
        this.toastr.error("Dữ liệu không hợp lệ, vui lòng thực hiện lại", "Thông báo");
        this.router.navigate['/ktdk/list'];
        return of(this.congVanYeuCau);
      }),
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((congVanYeuCau: YeuCauNghiemThu) => {
      if (congVanYeuCau.ID !== undefined) {
        this.congVanYeuCau = congVanYeuCau;
        if (this.congVanYeuCau.Data && this.congVanYeuCau.Data !== undefined) {
          this.getPDF(this.congVanYeuCau.Data, "CVYC");
        }
        if (this.congVanYeuCau.TrangThai === 2)
          this.activeTabId = this.tabs.PhanCongKT;
        if (this.congVanYeuCau.TrangThai === 3 || this.congVanYeuCau.TrangThai === 4)
          this.activeTabId = this.tabs.BienBanKT;
        if (this.activeTabId != this.tabs.ThoaThuanDN)
          this.changeTab(this.activeTabId);
      }
      else {
        this.toastr.error("Dữ liệu không hợp lệ, vui lòng thực hiện lại", "Thông báo");
        this.router.navigate['/ktdk/list'];
      }
    });

    this.subscriptions.push(sb);
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }


  public reloadData(reload: boolean) {
    this.reloadForm.emit(reload);
  }

  private subscriptions: Subscription[] = [];

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}