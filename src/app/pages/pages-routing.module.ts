import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './_layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [                       
      {
        path: 'qtht',
        loadChildren: () =>
          import('../modules/he-thong/he-thong.module').then((m) => m.HeThongModule),
      },
      {
        path: 'dmht',
        loadChildren: () =>
          import('../modules/danh-muc/danh-muc.module').then((m) => m.DanhMucModule),
      },
      {
        path: 'bbks',
        loadChildren: () =>
          import('../modules/bien-ban-khao-sat/bien-ban-ks.module').then((m) => m.BienBanKSModule),
      },
      {
        path: 'bbkt',
        loadChildren: () =>
          import('../modules/bien-ban-kiem-tra/bien-ban-kt.module').then((m) => m.BienBanKTModule),
      },
      {
        path: 'bbdn',
        loadChildren: () =>
          import('../modules/bien-ban-dau-noi/bien-ban-dau-noi.module').then((m) => m.BienBanDauNoiModule),
      },
      {
        path: 'bbtt',
        loadChildren: () =>
          import('../modules/bien-ban-tt/bien-ban-tt.module').then((m) => m.BienBanTTModule),
      },
      {
        path: 'bbnt',
        loadChildren: () =>
          import('../modules/bien-ban-n-t/bien-ban-n-t.module').then((m) => m.BienBanNTModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('../pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },      
      {
        path: 'ttdn',
        loadChildren: () =>
          import('../modules/thoa-thuan-dau-noi/thoa-thuan-dau-noi.module').then((m) => m.ThoaThuanDauNoiModule),
      },      
      {
        path: 'ktdk',
        loadChildren: () =>
          import('../modules/kiem-tra-dieu-kien/kiem-tra-dieu-kien.module').then((m) => m.KiemTraDieuKienModule),
      },   
      {
        path: 'bctk',
        loadChildren: () =>
          import('../modules/bao-cao-thong-ke/bao-cao-thong-ke.module').then((m) => m.BaoCaoThongKeModule),
      },
      {
        path: 'gscd',
        loadChildren: () =>
          import('../modules/giam-sat-cap-dien/giam-sat-cap-dien.module').then((m) => m.GiamSatCapDienModule),
      },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
