import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaoCaoChiTietThangComponent } from './bao-cao-chi-tiet-thang/bao-cao-chi-tiet-thang.component';
import { BaoCaoThangLuyKeComponent } from './bao-cao-thang-luy-ke/bao-cao-thang-luy-ke.component';
import { BaoCaoThongKeComponent } from './bao-cao-thong-ke.component';
import { BaoCaoTongHopComponent } from './bao-cao-tong-hop/bao-cao-tong-hop.component';
import { ChiTietTcdnQuaHanComponent } from './chi-tiet-tcdn-qua-han/chi-tiet-tcdn-qua-han.component';
import { ChiTietTcdnComponent } from './chi-tiet-tcdn/chi-tiet-tcdn.component';
import { ReportQuaterComponent } from './components/report-quater/report-quater.component';
import { ThongKeTienDoComponent } from './thong-ke-tien-do/thong-ke-tien-do.component';
import { ThongKeComponent } from './thong-ke/thong-ke.component';
import { TienDoNghiemThuComponent } from './tien-do-nghiem-thu/tien-do-nghiem-thu.component';
import { TienDoThoaThuanDauNoiComponent } from './tien-do-thoa-thuan-dau-noi/tien-do-thoa-thuan-dau-noi.component';
import { TongHopKetQuaComponent } from './tong-hop-ket-qua/tong-hop-ket-qua.component';
import { TongHopQuaHanComponent } from './tong-hop-qua-han/tong-hop-qua-han.component';
import { TongHopTcdnComponent } from './tong-hop-tcdn/tong-hop-tcdn.component';
import { TongHopGiamSatCapDienComponent } from './tong-hop-giam-sat-cap-dien/tong-hop-giam-sat-cap-dien.component';
import { ChiTietGiamSatCapDienComponent } from './chi-tiet-giam-sat-cap-dien/chi-tiet-giam-sat-cap-dien.component';
import { TongHopKhaoSatKhachHangComponent } from './tong-hop-khao-sat-khach-hang/tong-hop-khao-sat-khach-hang.component';
import { ChiTietKhaoSatKhachHangComponent } from './chi-tiet-khao-sat-khach-hang/chi-tiet-khao-sat-khach-hang.component';

const routes: Routes = [
  {
    path: '',
    component: BaoCaoThongKeComponent,
    children: [
      {
        path: 'bcttdn',
        component: TienDoThoaThuanDauNoiComponent
      },
      {
        path: 'bcnt',
        component: TienDoNghiemThuComponent
      },
      {
        path: 'quater',
        component: ReportQuaterComponent
      },
      {
        path: 'tk',
        component: ThongKeComponent
      },
      {
        path: 'bcth',
        component: BaoCaoTongHopComponent
      },
      {
        path: 'bcctt',
        component: BaoCaoChiTietThangComponent
      },
      {
        path: 'bcctlk',
        component: BaoCaoThangLuyKeComponent
      },
      {
        path: 'bctd',
        component: ThongKeTienDoComponent
      },
      {
        path: 'cttcdn',
        component: ChiTietTcdnComponent
      },
      {
        path: 'thtcdn',
        component: TongHopTcdnComponent
      },
      {
        path: 'thkq',
        component: TongHopKetQuaComponent
      },
      {
        path: 'ctqh',
        component: ChiTietTcdnQuaHanComponent
      },
      {
        path: 'thqh',
        component: TongHopQuaHanComponent
      },
      {
        path: 'thgscd',
        component: TongHopGiamSatCapDienComponent
      },
      {
        path: 'ctgscd',
        component: ChiTietGiamSatCapDienComponent
      },
      {
        path: 'thkskh',
        component: TongHopKhaoSatKhachHangComponent
      },
      {
        path: 'ctkskh',
        component: ChiTietKhaoSatKhachHangComponent
      },
      { path: '', redirectTo: 'bbdn', pathMatch: 'full' },
      { path: '**', redirectTo: 'bbdn', pathMatch: 'full' },
    ],
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaoCaoThongKeRoutingModule { }
