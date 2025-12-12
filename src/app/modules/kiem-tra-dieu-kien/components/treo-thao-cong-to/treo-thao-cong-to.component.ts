import {
  Component, OnInit, OnDestroy, Input, Output, EventEmitter
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { CommonService } from 'src/app/modules/services/base.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, first } from 'rxjs/operators';
import { BienBanTTService } from 'src/app/modules/services/bienbantt.service';
import { BienBanTTData } from 'src/app/modules/models/bienbantt.model';

@Component({
  selector: 'app-treo-thao-cong-to',
  templateUrl: './treo-thao-cong-to.component.html',
  styleUrls: ['./treo-thao-cong-to.component.scss']
})
export class TreoThaoCongToComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: YeuCauNghiemThu;
  @Output() public reloadForm = new EventEmitter<boolean>();

  EMPTY = {
    deptId: 0,
    staffCode: '',
    ngayHen: '',
    noiDung: '',
    maCViec: ''
  };

  BienBanTTData: BienBanTTData;

  tabs = {
    ThoaThuanDauNoi: 1,
    YeuCauKiemTra: 2,
    PhanCongThiCong: 3,
    KetQuaThiCong: 4,
    BienBanTreoThao: 5,
  };

  safeSrcCV: SafeResourceUrl = null;
  safeSrcTTDN: SafeResourceUrl = null;
  safeSrcBBNT: SafeResourceUrl = null;

  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  activeTabId = this.tabs.ThoaThuanDauNoi;

  private subscriptions: Subscription[] = [];

  constructor(
    public commonService: CommonService,
    public service: BienBanTTService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.isLoadingForm$.next(true);
    setTimeout(() => this.isLoadingForm$.next(false), 1000);

    if (this.congVanYeuCau?.ID > 0) {
      if (this.congVanYeuCau.PdfBienBanDN) {
        this.loadPDF(this.congVanYeuCau.PdfBienBanDN, 'BBDN');
      }
      if (this.congVanYeuCau.Data) {
        this.loadPDF(this.congVanYeuCau.Data, 'CVYC');
      }
      this.loadData();
    }
  }

  loadData() {
    this.isLoadingForm$.next(true);
    const sub = this.service.getItem(this.congVanYeuCau.ID).pipe(
      first(),
      catchError(() => {
        return of(this.BienBanTTData);
      }),
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((data: BienBanTTData) => {
      if (data) {
        this.BienBanTTData = data;
      }
    });

    this.subscriptions.push(sub);
  }

  loadPDF(path: string, key: string): void {
    this.isLoadingForm$.next(true);
    this.commonService.getPDF(path).pipe(
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((base64Pdf: string) => {
      try {
        const byteCharacters = atob(base64Pdf);
        const byteArrays = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArrays[i] = byteCharacters.charCodeAt(i);
        }

        const blob = new Blob([byteArrays], { type: 'application/pdf' });
        const objectUrl = URL.createObjectURL(blob);

        const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);

        switch (key) {
          case 'CVYC':
            this.safeSrcCV = safeUrl;
            break;
          case 'BBDN':
            this.safeSrcTTDN = safeUrl;
            break;
          case 'BBNT':
            this.safeSrcBBNT = safeUrl;
            break;
        }
      } catch (error) {
        console.error('PDF decode failed', error);
        this.toastr.error('Lỗi tải file PDF');
      }
    });
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

  reloadTab(reload: boolean) {
    if (reload) {
      this.isLoadingForm$.next(true);
      if (this.activeTabId > 1) {
        this.activeTabId -= 1;
      }
      this.changeTab(this.activeTabId);
      this.isLoadingForm$.next(false);
    }
  }

  reloadData(reload: boolean) {
    this.loadData();
    this.reloadForm.emit(reload);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
