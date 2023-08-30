import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { CKEditorModule } from 'ckeditor4-angular';
import { SharedModule } from '../share-component/share-component.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';

import { BaoCaoThongKeRoutingModule } from './bao-cao-thong-ke-routing.module';
import { BaoCaoThongKeComponent } from './bao-cao-thong-ke.component';
import { TienDoNghiemThuComponent } from './tien-do-nghiem-thu/tien-do-nghiem-thu.component';
import { TienDoThoaThuanDauNoiComponent } from './tien-do-thoa-thuan-dau-noi/tien-do-thoa-thuan-dau-noi.component';
import { ReportQuaterComponent } from './components/report-quater/report-quater.component';
import { ThongKeComponent } from './thong-ke/thong-ke.component';
import { BaoCaoTongHopComponent } from './bao-cao-tong-hop/bao-cao-tong-hop.component';
import { BaoCaoChiTietThangComponent } from './bao-cao-chi-tiet-thang/bao-cao-chi-tiet-thang.component';
import { BaoCaoThangLuyKeComponent } from './bao-cao-thang-luy-ke/bao-cao-thang-luy-ke.component';
import { ThongKeTienDoComponent } from './thong-ke-tien-do/thong-ke-tien-do.component';
import { ChiTietTcdnComponent } from './chi-tiet-tcdn/chi-tiet-tcdn.component';
import { TongHopTcdnComponent } from './tong-hop-tcdn/tong-hop-tcdn.component';
import { TongHopKetQuaComponent } from './tong-hop-ket-qua/tong-hop-ket-qua.component';
import { ChiTietTcdnQuaHanComponent } from './chi-tiet-tcdn-qua-han/chi-tiet-tcdn-qua-han.component';
import { TongHopTrangThaiComponent } from './tong-hop-trang-thai/tong-hop-trang-thai.component';
import { TongHopQuaHanComponent } from './tong-hop-qua-han/tong-hop-qua-han.component';
import { TongHopGiamSatCapDienComponent } from './tong-hop-giam-sat-cap-dien/tong-hop-giam-sat-cap-dien.component';
import { ChiTietGiamSatCapDienComponent } from './chi-tiet-giam-sat-cap-dien/chi-tiet-giam-sat-cap-dien.component';
import { TongHopKhaoSatKhachHangComponent } from './tong-hop-khao-sat-khach-hang/tong-hop-khao-sat-khach-hang.component';
import { ChiTietKhaoSatKhachHangComponent } from './chi-tiet-khao-sat-khach-hang/chi-tiet-khao-sat-khach-hang.component';


@NgModule({
  declarations: [
    BaoCaoThongKeComponent,
    TienDoNghiemThuComponent,
    TienDoThoaThuanDauNoiComponent,
    ReportQuaterComponent,
    ThongKeComponent,
    BaoCaoTongHopComponent,
    BaoCaoChiTietThangComponent,
    BaoCaoThangLuyKeComponent,
    ThongKeTienDoComponent,
    ChiTietTcdnComponent,
    TongHopTcdnComponent,
    TongHopKetQuaComponent,
    ChiTietTcdnQuaHanComponent,
    TongHopTrangThaiComponent,
    TongHopQuaHanComponent,
    TongHopGiamSatCapDienComponent,
    ChiTietGiamSatCapDienComponent,
    TongHopKhaoSatKhachHangComponent,
    ChiTietKhaoSatKhachHangComponent
  ],
  imports: [
    CommonModule,
    BaoCaoThongKeRoutingModule,
    SharedModule,
    PdfViewerModule,
    CommonModule,
    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,

    CKEditorModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatBadgeModule,
    MatListModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressBarModule,

    NgbDatepickerModule,
    NgbModalModule
  ]
})
export class BaoCaoThongKeModule { }
