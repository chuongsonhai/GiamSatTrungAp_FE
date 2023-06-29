import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { YeuCauNghiemThu } from '../../models/yeucaunghiemthu.model';
import { YeuCauNghiemThuService } from '../../services/yeucaunghiemthu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { catchError, finalize, first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-yeu-cau-nghiem-thu',
  templateUrl: './yeu-cau-nghiem-thu.component.html',
  styleUrls: ['./yeu-cau-nghiem-thu.component.scss']
})
export class YeuCauNghiemThuComponent implements OnInit, OnDestroy {
  EMPTY: any;

  private subscriptions: Subscription[] = [];
  id: number;
  status: number;
  congVanYeuCau: YeuCauNghiemThu;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);
  constructor(
    public route: ActivatedRoute,
    public service: YeuCauNghiemThuService,
    private router: Router,
    public toastr: ToastrService
  ) {
    this.EMPTY = {
      ID: 0
    }
  }

  ngOnInit() {
    this.congVanYeuCau = Object.assign(new YeuCauNghiemThu(), this.EMPTY);
    this.route.params.subscribe(params => {
      if (params.ID) {
        var isValueProperty = parseInt(params.ID, 10) >= 0;
        if (isValueProperty) {
          this.id = Number(params.ID);
          this.loadData();
        }
      }
    });
  }

  tabs = {
    TiepNhanHoSo: 1,
    BienBanKiemTra: 2,
    NghiemThuDongDien: 3
  };

  activeTabId = 0;

  loadData() {
    this.isLoadingForm$.next(true);
    this.congVanYeuCau.ID = this.id;
    const sb = this.service.getItemById(this.id).pipe(
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
        this.status = congVanYeuCau.TrangThai;
        this.loadForm();        
      }
      else {
        this.toastr.error("Dữ liệu không hợp lệ, vui lòng thực hiện lại", "Thông báo");
        this.router.navigate['/ktdk/list'];
      }
    });

    this.subscriptions.push(sb);
  }

  public reloadForm(reload: boolean) {
    if (reload) {
      this.loadData();
    }
  }

  changeTab(tabId: number) {
    if (this.activeTabId >= tabId)
      this.activeTabId = tabId;
    else {
      if (this.status === 1 || this.status === 0) {
        this.activeTabId = this.tabs.TiepNhanHoSo;
      }
      if (this.status >= 2 && this.status <= 4) {
        this.activeTabId = this.tabs.BienBanKiemTra;
      }
      if (this.status >= 5 && this.status < 13) {
        this.activeTabId = this.tabs.NghiemThuDongDien;
      }
    }
  }

  loadForm() {
    try {
      if (this.status === 1 || this.status === 0) {
        this.activeTabId = this.tabs.TiepNhanHoSo;
      }
      if (this.status >= 2 && this.status <= 4) {
        this.activeTabId = this.tabs.BienBanKiemTra;
      }
      if (this.status >= 5 && this.status < 13) {
        this.activeTabId = this.tabs.NghiemThuDongDien;
      }
      if (this.status === 13) {
        window.location.href = '/ktdk/list';
      }
    }
    catch (error) {
      console.error('BINDING DATA', error);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}