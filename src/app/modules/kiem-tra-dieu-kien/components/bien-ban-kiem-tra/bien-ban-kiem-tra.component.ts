import {
  Component, OnInit, OnDestroy, Input, Output, EventEmitter, OnChanges, SimpleChanges
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YeuCauNghiemThu } from 'src/app/modules/models/yeucaunghiemthu.model';
import { CommonService } from 'src/app/modules/services/base.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, first } from 'rxjs/operators';
import { YeuCauNghiemThuService } from 'src/app/modules/services/yeucaunghiemthu.service';

@Component({
  selector: 'app-bien-ban-kiem-tra',
  templateUrl: './bien-ban-kiem-tra.component.html',
  styleUrls: ['./bien-ban-kiem-tra.component.scss']
})
export class BienBanKiemTraComponent implements OnInit, OnDestroy, OnChanges {
  @Input() congVanYeuCau: YeuCauNghiemThu | null = null;
  @Output() public reloadForm = new EventEmitter<boolean>();

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

  safeSrcCV: SafeResourceUrl | null = null;
  safeSrcTTDN: SafeResourceUrl | null = null;

  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  activeTabId = this.tabs.ThoaThuanDN;

  private subscriptions: Subscription[] = [];
  private loadedId: number | null = null;

  constructor(
    public commonService: CommonService,
    public service: YeuCauNghiemThuService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['congVanYeuCau']) {
      const id = this.congVanYeuCau?.ID;
      if (id && id > 0 && this.loadedId !== id) {
        this.loadedId = id;
        this.loadData(id);
      }
    }
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

  private getPDF(base64: string, key: 'CVYC' | 'BBDN'): void {
    if (!base64) return;

    const sb = this.commonService.getPDF(base64).pipe(
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe({
      next: (response: string) => {
        const safeUrl = this.createSafePdfUrl(response);
        if (!safeUrl) return;

        if (key === 'CVYC') this.safeSrcCV = safeUrl;
        if (key === 'BBDN') this.safeSrcTTDN = safeUrl;
      },
      error: () => {
        this.toastr.error('Không thể tải file PDF', 'Lỗi');
      }
    });

    this.subscriptions.push(sb);
  }

  private loadData(id: number): void {
    this.isLoadingForm$.next(true);

    const sb = this.service.getItemById(id).pipe(
      first(),
      catchError(() => {
        this.toastr.error('Dữ liệu không hợp lệ, vui lòng thực hiện lại', 'Thông báo');
        this.router.navigate(['/ktdk/list']);
        return of(null);
      }),
      finalize(() => this.isLoadingForm$.next(false))
    ).subscribe((res: YeuCauNghiemThu | null) => {
      if (!res?.ID) return;

      this.congVanYeuCau = res;

      if (res.PdfBienBanDN) {
        this.isLoadingForm$.next(true);
        this.getPDF(res.PdfBienBanDN, 'BBDN');
      }

      if (res.Data) {
        this.isLoadingForm$.next(true);
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
        default:
          this.activeTabId = this.tabs.ThoaThuanDN;
          break;
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
