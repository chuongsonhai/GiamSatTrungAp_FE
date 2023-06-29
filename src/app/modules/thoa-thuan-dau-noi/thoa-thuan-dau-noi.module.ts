import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbDatepickerModule, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ThoaThuanDauNoiComponent } from './thoa-thuan-dau-noi.component';

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

import { ThoaThuanDauNoiRoutingModule } from './thoa-thuan-dau-noi-routing.model';
import { YeuCauDauNoiComponent } from './components/yeu-cau-dau-noi.component';
import { ListThoaThuanDauNoiComponent } from './list-thoa-thuan-dau-noi/list-thoa-thuan-dau-noi.component';
import { TiepNhanHoSoComponent } from './components/tiep-nhan-ho-so/tiep-nhan-ho-so.component';
import { KhaoSatHienTruongComponent } from './components/khao-sat-hien-truong/khao-sat-hien-truong.component';
import { HoanThanhComponent } from './components/hoan-thanh/hoan-thanh.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CreateBienBanKhaoSatComponent } from './components/khao-sat-hien-truong/create-bien-ban-khao-sat/create-bien-ban-khao-sat.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { DoingBusinessComponent } from './doing-business/doing-business.component';
import { SharedModule } from '../share-component/share-component.module';
import { TaiLieuKhaoSatComponent } from './components/khao-sat-hien-truong/tai-lieu-khao-sat/tai-lieu-khao-sat.component';
import { KetQuaKSComponent } from './components/khao-sat-hien-truong/bien-ban-khao-sat/ket-qua-khao-sat/ket-qua-khao-sat.component';
import { PhanCongKSComponent } from './components/khao-sat-hien-truong/phan-cong-khao-sat/phan-cong-khao-sat.component';
import { BienBanKSComponent } from './components/khao-sat-hien-truong/bien-ban-khao-sat/bien-ban-khao-sat.component';
import { NgSelect2Module } from 'ng-select2';
import { UpdateTaiLieuKhaoSatComponent } from './components/khao-sat-hien-truong/tai-lieu-khao-sat/update-tai-lieu-khao-sat/update-tai-lieu-khao-sat.component';
import { HoSoDangKyComponent } from './components/tiep-nhan-ho-so/components/ho-so-dang-ky.component';
import { HuyYeuCauComponent } from './components/tiep-nhan-ho-so/huy-yeu-cau/huy-yeu-cau.component';
import { DuThaoDauNoiComponent } from './components/du-thao-dau-noi/du-thao-dau-noi.component';
import { HoSoDauNoiComponent } from './components/du-thao-dau-noi/ho-so-dau-noi/ho-so-dau-noi.component';
import { UploadDuThaoDNComponent } from './components/du-thao-dau-noi/components/upload-du-thao-dau-noi.component';
import { ApproveDuThaoComponent } from './components/du-thao-dau-noi/approve-du-thao/approve-du-thao.component';
import { HoSoGiayToComponent } from './list-thoa-thuan-dau-noi/components/ho-so-giay-to.component';

@NgModule({
    declarations: [
        ThoaThuanDauNoiComponent,
        YeuCauDauNoiComponent,
        ListThoaThuanDauNoiComponent,
        TiepNhanHoSoComponent,
        KhaoSatHienTruongComponent,
        BienBanKSComponent,
        PhanCongKSComponent,
        KetQuaKSComponent,
        HoanThanhComponent,
        CreateBienBanKhaoSatComponent,
        DoingBusinessComponent,
        TaiLieuKhaoSatComponent,
        UpdateTaiLieuKhaoSatComponent,
        HoSoDangKyComponent,
        HuyYeuCauComponent,
        DuThaoDauNoiComponent,
        HoSoDauNoiComponent,
        UploadDuThaoDNComponent,
        ApproveDuThaoComponent,
        HoSoGiayToComponent
    ],
    imports: [
        ThoaThuanDauNoiRoutingModule,

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
export class ThoaThuanDauNoiModule {

}


