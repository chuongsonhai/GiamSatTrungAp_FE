import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { ActivatedRoute, Route } from '@angular/router';
import { CongVanYeuCauService } from '../../services/base.service';
import { catchError, first } from 'rxjs/operators';
import { CongVanYeuCau } from '../../models/congvanyeucau.model';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { TrangThaiCongVan } from '../../models/enum';

@Component({
  selector: 'app-yeu-cau-dau-noi',
  templateUrl: './yeu-cau-dau-noi.component.html',
  styleUrls: ['./yeu-cau-dau-noi.component.scss']
})

export class YeuCauDauNoiComponent implements OnInit, OnDestroy {
  EMPTY: any;
  private subscriptions: Subscription[] = [];
  id: number;
  status: TrangThaiCongVan;
  congVanYeuCau: CongVanYeuCau;
  isLoadingForm$ = new BehaviorSubject<boolean>(false);

  //0: Mới tạo, 1: Duyệt hồ sơ, 2: Yêu cầu khảo sát, 3: Lập dự thảo đấu nối, 4: Ký duyệt dự thảo đấu nối, 5: Chuyển tiếp
  constructor(
    public route: ActivatedRoute,
    public CongVanYeuCauService: CongVanYeuCauService,
    private fb: FormBuilder
  ) {
    this.EMPTY = {
      ID: 0
    }
  }

  ngOnInit() {
    this.isLoadingForm$.next(true);
    this.congVanYeuCau = Object.assign(new CongVanYeuCau(), this.EMPTY);
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
    KhaoSatHienTruong: 2,
    DuThaoThoaThuan: 3,
    ChuyenTiep: 4,
  };

  activeTabId = 0;

  loadData() {
    this.congVanYeuCau.ID = this.id;
    const sb = this.CongVanYeuCauService.getItemById(this.id).pipe(
      first(),
      catchError((errorMessage) => {
        return of(this.congVanYeuCau);
      })
    ).subscribe((congVanYeuCau: CongVanYeuCau) => {
      if (congVanYeuCau) {
        this.isLoadingForm$.next(true);
        this.congVanYeuCau = congVanYeuCau;
        this.status = congVanYeuCau.TrangThai;
        this.loadForm();
        this.isLoadingForm$.next(false);
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
    this.activeTabId = tabId;
    // if (this.activeTabId >= tabId)
    //   this.activeTabId = tabId;
    // else {
    //   if (this.status === 0 || this.status === 1) {
    //     this.activeTabId = this.tabs.TiepNhanHoSo;
    //   }
    //   if (this.status === 2 || this.status === 3 || this.status === 4) {
    //     this.activeTabId = this.tabs.KhaoSatHienTruong;
    //   }

    //   if (this.status >= 5 && this.status <= 7) {
    //     this.activeTabId = this.tabs.DuThaoThoaThuan;
    //   }

    //   if (this.status > 7 && this.status < 13) {
    //     this.activeTabId = this.tabs.ChuyenTiep;
    //   }
    // }
  }

  loadForm() {
    try {
      if (this.status === 0 || this.status === 1) {
        this.activeTabId = this.tabs.TiepNhanHoSo;
      }
      if (this.status === 2 || this.status === 3 || this.status === 4) {
        this.activeTabId = this.tabs.KhaoSatHienTruong;
      }

      if (this.status >= 5 && this.status <= 7) {
        this.activeTabId = this.tabs.DuThaoThoaThuan;
      }

      if (this.status > 7 && this.status < 13) {
        this.activeTabId = this.tabs.ChuyenTiep;
      }

      if (this.status === 13) {
        this.activeTabId = this.tabs.TiepNhanHoSo;
        //window.location.href = '/ttdn/list';
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