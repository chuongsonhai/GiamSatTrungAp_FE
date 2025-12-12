import {
  Component, OnInit, OnDestroy, Input, Output, EventEmitter
} from '@angular/core';
import {
  DomSanitizer, SafeResourceUrl
} from '@angular/platform-browser';
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { CommonService } from 'src/app/modules/services/base.service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, first } from 'rxjs/operators';
import { BienBanKTData } from 'src/app/modules/models/bienbanksdata.model';
import { YeuCauNghiemThuService } from 'src/app/modules/services/yeucaunghiemthu.service';

@Component({
  selector: 'app-bien-ban-kiem-tra',
  templateUrl: './bien-ban-kiem-tra.component.html',
  styleUrls: ['./bien-ban-kiem-tra.component.scss']
})
export class BienBanKiemTraComponent implements OnInit, OnDestroy {
  @Input() congVanYeuCau: YeuCauNghiemThu;
  @Output() public reloadForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  EMPTY = {
    deptId: 0,
    staffCode: '',
    ngayHen: '',
    noiDung: '',
    maCViec: ''
  };

  BienBanKTData: BienBanKTData;

  tabs = {
    ThoaThuanDN: 1,
    PhanCongKT: 2,
    BienBanKT: 3,
    TaiLieuKT: 4,
  };

  tabsList = [
    { id: 1, label: 'Thỏa thuận đấu nối' },
    { id: 2, label: 'Phân công kiểm tra' },
    { id: 3, label: 'Biên bản kiểm tra' },
    { id: 4, label: 'Hồ sơ đính kèm' },
  ];

  safeSrcCV: SafeResourceUrl;
  safeSrcTTDN: SafeResourceUrl;

  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  activeTabId = this.tabs.ThoaThuanDN;

  private subscriptions: Subscription[] = [];

  constructor(
    public commonService: CommonService,
    public service: YeuCauNghiemThuService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.isLoadingForm$.next(true);

    if (this.congVanYeuCau?.SoCongVan) {
      this.loadData();
      this.getPDF(this.congVanYeuCau.PdfBienBanDN, 'BBDN');
    } else {
      this.isLoadingForm$.next(false);
    }
  }

  private getPDF(base64: string, key: string): void {
    if (!base64) return;

    this.isLoadingForm$.next(true);

    const sb = this.commonService.getPDF(base64).pipe(
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe({
      next: (response: string) => {
        const safeUrl = this.createSafePdfUrl(response);
        if (!safeUrl) return;

        if (key === 'CVYC') {
          this.safeSrcCV = safeUrl;
        } else if (key === 'BBDN') {
          this.safeSrcTTDN = safeUrl;
        }
      },
      error: () => {
        this.toastr.error('Không thể tải file PDF', 'Lỗi');
      }
    });

    this.subscriptions.push(sb);
  }

  private createSafePdfUrl(base64: string): SafeResourceUrl | null {
    try {
      const dataUrl = `data:application/pdf;base64,${base64}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
    } catch (error) {
      console.error('Lỗi khi tạo PDF URL:', error);
      this.toastr.error('Không thể hiển thị file PDF', 'Lỗi');
      return null;
    }
  }

  loadData(): void {
    const sb = this.service.getItemById(this.congVanYeuCau.ID).pipe(
      first(),
      catchError(() => {
        this.toastr.error('Dữ liệu không hợp lệ, vui lòng thực hiện lại', 'Thông báo');
        this.router.navigate(['/ktdk/list']);
        return of(this.congVanYeuCau);
      }),
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((res: YeuCauNghiemThu) => {
      if (!res?.ID) {
        this.toastr.error('Dữ liệu không hợp lệ, vui lòng thực hiện lại', 'Thông báo');
        this.router.navigate(['/ktdk/list']);
        return;
      }

      this.congVanYeuCau = res;

      if (res.Data) {
        this.getPDF(res.Data, 'CVYC');
      }

      switch (res.TrangThai) {
        case 2:
          this.activeTabId = this.tabs.PhanCongKT;
          break;
        case 3:
        case 4:
          this.activeTabId = this.tabs.BienBanKT;
          break;
      }

      if (this.activeTabId !== this.tabs.ThoaThuanDN) {
        this.changeTab(this.activeTabId);
      }
    });

    this.subscriptions.push(sb);
  }

  changeTab(tabId: number): void {
    this.activeTabId = tabId;
  }

  reloadData(reload: boolean): void {
    this.reloadForm.emit(reload);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
