import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DsKhachHangComponent } from './ds-khach-hang/ds-khach-hang.component';
import { DsKhaoSatComponent } from './ds-khao-sat/ds-khao-sat.component';
import { GiamSatCapDienRoutingModule } from './khao-sat-khach-hang-gs-routing.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../share-component/share-component.module';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';
import { CKEditorModule } from 'ckeditor4-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelect2Module } from 'ng-select2';
import { KhaoSatKhachHangGsComponent } from './khao-sat-khach-hang-gs.component';
import { KhaoSatCanhBaoComponent } from './khao-sat-canh-bao/khao-sat-canh-bao.component';
import { DsLogKhaoSatComponent } from './ds-log-khao-sat/ds-log-khao-sat.component';


@NgModule({
  declarations: [
    DsKhachHangComponent,
    DsKhaoSatComponent,
    KhaoSatKhachHangGsComponent,
    KhaoSatCanhBaoComponent,
    DsLogKhaoSatComponent
  ],
  imports: [
    CommonModule,
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
export class KhaoSatKhachHangGsModule { }
