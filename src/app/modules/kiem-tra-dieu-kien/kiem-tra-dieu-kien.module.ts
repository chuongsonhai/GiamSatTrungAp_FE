import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbDatepickerModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

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

import { KiemTraDieuKienRoutingModule } from './kiem-tra-dieu-kien-routing.model'; 

import { KiemTraDieuKienComponent } from './kiem-tra-dieu-kien.component';
import { ListYeuCauComponent } from './list-yeu-cau/list-yeu-cau.component';
import { YeuCauNghiemThuComponent } from './components/yeu-cau-nghiem-thu.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TreoThaoCongToComponent } from './components/treo-thao-cong-to/treo-thao-cong-to.component';
import { BienBanNghiemThuComponent } from './components/bien-ban-nghiem-thu/bien-ban-nghiem-thu.component';
import { BienBanKiemTraComponent } from './components/bien-ban-kiem-tra/bien-ban-kiem-tra.component';
import { TaoBienBanKiemTraComponent } from './components/bien-ban-kiem-tra/tao-bien-ban-kiem-tra/tao-bien-ban-kiem-tra.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { KiemTraHoSoComponent } from './components/kiem-tra-ho-so/kiem-tra-ho-so.component';
import { SharedModule } from '../share-component/share-component.module';
import { KetQuaKTComponent } from './components/bien-ban-kiem-tra/ket-qua-kiem-tra/ket-qua-kiem-tra.component';
import { ListHopDongComponent } from './list-hop-dong/list-hop-dong.component';
import { CreateBienBanNghiemThuComponent } from './components/bien-ban-nghiem-thu/create-bien-ban-nghiem-thu/create-bien-ban-nghiem-thu.component';
import { NgSelect2Module } from 'ng-select2';
import { HopDongDienComponent } from './components/bien-ban-nghiem-thu/components/hop-dong-dien/hop-dong-dien.component';
import { PhanCongTCComponent } from './components/bien-ban-nghiem-thu/components/phan-cong-thi-cong/phan-cong-thi-cong.component';
import { KetQuaTCComponent } from './components/bien-ban-nghiem-thu/components/bien-ban-treo-thao/ket-qua-thi-cong/ket-qua-thi-cong.component';
import { BienBanTreoThaoComponent } from './components/treo-thao-cong-to/componets/bien-ban-treo-thao/bien-ban-treo-thao.component';
import { ThongTinKhachHangComponent } from './components/treo-thao-cong-to/componets/bien-ban-treo-thao/thong-tin-khach-hang/thong-tin-khach-hang.component';
import { ChiTietThietBiTreoComponent } from './components/treo-thao-cong-to/componets/bien-ban-treo-thao/chi-tiet-thiet-bi-treo/chi-tiet-thiet-bi-treo.component';
import { ChiTietThietBiThaoComponent } from './components/treo-thao-cong-to/componets/bien-ban-treo-thao/chi-tiet-thiet-bi-thao/chi-tiet-thiet-bi-thao.component';
import { BBTreoThaoComponent } from './components/bien-ban-nghiem-thu/components/bien-ban-treo-thao/bb-treo-thao.component';
import { PhanCongKTComponent } from './components/bien-ban-kiem-tra/phan-cong-kiem-tra/phan-cong-kiem-tra.component';
import { TaiLieuKiemTraComponent } from './components/bien-ban-kiem-tra/tai-lieu-kiem-tra/tai-lieu-kiem-tra.component';
import { UpdateTaiLieuKiemTraComponent } from './components/bien-ban-kiem-tra/tai-lieu-kiem-tra/update-tai-lieu-kiem-tra/update-tai-lieu-kiem-tra.component';
import { TaiLieuNghiemThuComponent } from './components/bien-ban-nghiem-thu/components/tai-lieu-nghiem-thu/tai-lieu-nghiem-thu.component';
import { UpdateTaiLieuNghiemThuComponent } from './components/bien-ban-nghiem-thu/components/tai-lieu-nghiem-thu/update-tai-lieu-nghiem-thu/update-tai-lieu-nghiem-thu.component';
import { PhuLucHopDongComponent } from './components/bien-ban-nghiem-thu/components/phu-luc-hop-dong/phu-luc-hop-dong.component';
import { UpdatePhuLucHopDongComponent } from './components/bien-ban-nghiem-thu/components/phu-luc-hop-dong/update-phu-luc-hop-dong/update-phu-luc-hop-dong.component';
import { BienBanKTDDComponent } from './components/bien-ban-kiem-tra/bien-ban-ktdd/bien-ban-ktdd.component';
import { ThietBiComponent } from './components/bien-ban-nghiem-thu/components/thiet-bi/thiet-bi.component';
import { ThoaThuanDamBaoComponent } from './components/bien-ban-nghiem-thu/components/thoa-thuan-dam-bao/thoa-thuan-dam-bao.component';
import { CreateThietBiComponent } from './components/bien-ban-nghiem-thu/components/thiet-bi/create-thiet-bi/create-thiet-bi.component';
import { CreateThoaThuanDamBaoComponent } from './components/bien-ban-nghiem-thu/components/thoa-thuan-dam-bao/create-thoa-thuan-dam-bao/create-thoa-thuan-dam-bao.component';
import { ThoaThuanTyLeComponent } from './components/bien-ban-nghiem-thu/components/phu-luc-hop-dong/thoa-thuan-ty-le/thoa-thuan-ty-le.component';
import { ChamDutHopDongComponent } from './components/bien-ban-nghiem-thu/components/phu-luc-hop-dong/cham-dut-hop-dong/cham-dut-hop-dong.component';
import { DuThaoHopDongDienComponent } from './components/kiem-tra-ho-so/components/du-thao-hop-dong-dien.component';
import { HoSoKemTheoKTDDComponent } from './components/kiem-tra-ho-so/ho-so-kem-theo/ho-so-kem-theo-ktdd.component';

@NgModule({
    declarations: [
        KiemTraDieuKienComponent,
        ListYeuCauComponent,
        YeuCauNghiemThuComponent,
        KiemTraHoSoComponent,
        HopDongDienComponent,
        TreoThaoCongToComponent,
        BienBanNghiemThuComponent,       
        BienBanKiemTraComponent,
        KetQuaKTComponent,
        TaoBienBanKiemTraComponent,
        ListHopDongComponent,
        CreateBienBanNghiemThuComponent,
        PhanCongTCComponent,
        KetQuaTCComponent,
        BienBanNghiemThuComponent,
        BienBanTreoThaoComponent,
        ThongTinKhachHangComponent,
        ChiTietThietBiTreoComponent,
        ChiTietThietBiThaoComponent,
        BBTreoThaoComponent,
        PhanCongKTComponent,
        TaiLieuKiemTraComponent,
        UpdateTaiLieuKiemTraComponent,
        TaiLieuNghiemThuComponent,
        UpdateTaiLieuNghiemThuComponent,
        PhuLucHopDongComponent,
        UpdatePhuLucHopDongComponent,
        BienBanKTDDComponent,
        ThietBiComponent,
        ThoaThuanDamBaoComponent,
        CreateThietBiComponent,
        CreateThoaThuanDamBaoComponent,
        ThoaThuanTyLeComponent,
        ChamDutHopDongComponent,
        DuThaoHopDongDienComponent,
        HoSoKemTheoKTDDComponent
    ],
    imports: [
        KiemTraDieuKienRoutingModule,

        SharedModule,
        PdfViewerModule,
        CommonModule,
        HttpClientModule,
        PdfViewerModule,
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
        NgbModalModule,
        NgSelect2Module,
        NgbModule
    ],
    exports: [
    ],
    entryComponents: [

    ],
    providers: [

    ],
    schemas: [
    ],
})
export class KiemTraDieuKienModule {

}


