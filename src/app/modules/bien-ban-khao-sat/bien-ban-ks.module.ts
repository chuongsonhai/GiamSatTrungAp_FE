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
import { BienBanKSComponent } from './bien-ban-ks.component';
import { BienBanKSRoutingModule } from './bien-ban-ks-routing.model';
import { ListBienBanKSComponent } from './list-bien-ban-khao-sat/list-bien-ban-khao-sat.component';
@NgModule({
    declarations: [
        BienBanKSComponent,
        ListBienBanKSComponent
    ],
    imports: [
        BienBanKSRoutingModule,

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
export class BienBanKSModule {

}


