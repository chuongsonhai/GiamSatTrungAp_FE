import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { LOCALE_ID } from '@angular/core';


import { DanhMucComponent } from './danh-muc.component';
import { DanhMucRoutingModule } from './danh-muc-routing.model';
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
import { SharedModule } from '../share-component/share-component.module';
import { CauHinhCongViecComponent } from './cau-hinh-cong-viec/cau-hinh-cong-viec.component';
import { UpdateCauHinhCVComponent } from './cau-hinh-cong-viec/components/update-cau-hinh-cong-viec.component';
import { TienTrinhComponent } from './tien-trinh/tien-trinh.component';
import { MailThongBaoComponent } from './mail-thong-bao/mail-thong-bao.component';
import { NhanVienComponent } from './nhan-vien/nhan-vien.component';
import { NgSelect2Module } from 'ng-select2';
import { UpdateMailThongBaoComponent } from './mail-thong-bao/update-mail-thong-bao/update-mail-thong-bao.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { EditNhanVienComponent } from './nhan-vien/components/edit-nhan-vien.component';
import { ThongBaoComponent } from './thong-bao/thong-bao.component';
import { MailCanhBaoTctComponent } from './mail-canh-bao-tct/mail-canh-bao-tct.component';
import { EditMailComponent } from './mail-canh-bao-tct/edit-mail/edit-mail.component';

@NgModule({
    declarations: [
        DanhMucComponent,
        CauHinhCongViecComponent,
        UpdateCauHinhCVComponent,
        TienTrinhComponent,
        MailThongBaoComponent,
        NhanVienComponent,
        EditNhanVienComponent,
        UpdateMailThongBaoComponent,
        ThongBaoComponent,
        MailCanhBaoTctComponent,
        EditMailComponent
    ],
    imports: [
        DanhMucRoutingModule,        

        SharedModule,

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
        //TreetableModule

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
export class DanhMucModule {

}
