import { DanhSachCanhBaoComponent } from './danh-sach-canh-bao/danh-sach-canh-bao.component';
import { GiamSatCapDienComponent } from './giam-sat-cap-dien.component';
import { GiamSatCapDienRoutingModule } from './giam-sat-cap-dien-routing.model';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { LOCALE_ID } from '@angular/core';


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
import { NgSelect2Module } from 'ng-select2';
import { CKEditorModule } from 'ckeditor4-angular';
import { ChiTietCanhBaoComponent } from './chi-tiet-canh-bao/chi-tiet-canh-bao.component';
import { PhanHoiCanhBaoComponent } from './phan-hoi-canh-bao/phan-hoi-canh-bao.component';


@NgModule({
  declarations: [
    DanhSachCanhBaoComponent,
    GiamSatCapDienComponent,
    ChiTietCanhBaoComponent,
    PhanHoiCanhBaoComponent
  ],
  imports: [
    CommonModule,
    GiamSatCapDienRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
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
  ]
})
export class GiamSatCapDienModule { }

