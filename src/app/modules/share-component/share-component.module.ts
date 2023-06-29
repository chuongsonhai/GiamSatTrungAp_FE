import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { CRUDTableModule } from 'src/app/_metronic/shared/crud-table';

import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';

import { ViewPdfComponent } from './view-pdf/view-pdf.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DragDropModule } from '@angular/cdk/drag-drop'
import { ViewPDFSignComponent } from './configuration-sign/viewPDF/view-pdf-config-sign.component';
import { ResizableModule } from 'angular-resizable-element';
import { ApproveDocumentTemplateComponent } from './approve-document/approve-document.component';
import { ApproveNghiemThuTemplateComponent } from './approve-nghiem-thu/approve-nghiem-thu.component';
import { NgSelect2Module } from 'ng-select2';
import { CancelBusinessComponent } from './cancel-business/cancel-business.component';
import { ViewImageComponent } from './view-image/view-image.component';

@NgModule({
declarations: [    
    ConfirmationDialogComponent,
    ApproveDocumentTemplateComponent,
    ApproveNghiemThuTemplateComponent,
    CancelBusinessComponent,
    ViewPDFSignComponent,
    ViewPdfComponent,
    ViewImageComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,    
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    CRUDTableModule,
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
    PdfViewerModule,
    PdfViewerModule,
    DragDropModule,
    ResizableModule,
    NgSelect2Module
  ],
  providers: [ ConfirmationDialogService ],
  entryComponents: [ ConfirmationDialogComponent ]  
})
export class SharedModule { }