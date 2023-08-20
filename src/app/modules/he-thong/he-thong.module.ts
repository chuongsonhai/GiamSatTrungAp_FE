import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { CRUDTableModule } from '../../_metronic/shared/crud-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { LOCALE_ID } from '@angular/core';

import { HeThongComponent } from './he-thong.component';

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

import { HeThongRoutingModule } from './he-thong-routing.model';
import { UserComponent } from './user/user.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';

import { RoleComponent } from './role/role.component';
import { EditRoleComponent } from './role/components/edit-role.component';

import { SharedModule } from '../share-component/share-component.module';
import { DonViComponent } from './don-vi/don-vi.component';
import { UpdateDonViComponent } from './don-vi/components/update-don-vi.component';
import { CauHinhMauComponent } from './cau-hinh-mau/cau-hinh-mau.component';
import { UpdateCauHinhMauComponent } from './cau-hinh-mau/components/update-cau-hinh-mau.component';
import { BoPhanComponent } from './bo-phan/bo-phan.component';
import { NgSelect2Module } from 'ng-select2';
import { SystemConfigComponent } from './system-config/system-config.component';
import { UpdateSystemConfigComponent } from './system-config/update-system-config/update-system-config.component';
import { CauHinhDongBoComponent } from './cau-hinh-dong-bo/cau-hinh-dong-bo.component';
import { UpdateCauHinhDongBoComponent } from './cau-hinh-dong-bo/update-cau-hinh-dong-bo/update-cau-hinh-dong-bo.component';
import { EditBoPhanComponent } from './bo-phan/components/edit-bo-phan.component';
import { TroNgaiComponent } from './tro-ngai/tro-ngai.component';
import { EditTroNgaiComponent } from './tro-ngai/components/edit-tro-ngai.component';
import { SystemLogComponent } from './system-log/system-log.component';
import { MauHoSoComponent } from './mau-ho-so/mau-ho-so.component';
import { UpdateMauHoSoComponent } from './mau-ho-so/components/update-mau-ho-so.component';
import { CauHinhCanhBaoComponent } from './cau-hinh-canh-bao/cau-hinh-canh-bao.component';
import { UpdateCauHinhCanhBaoComponent } from './cau-hinh-canh-bao/update-cau-hinh-canh-bao/update-cau-hinh-canh-bao.component';
import { LogCanhBaoComponent } from './log-canh-bao/log-canh-bao.component';
import { CauHinhNhanCanhBaoComponent } from './cau-hinh-canh-bao/cau-hinh-nhan-canh-bao/cau-hinh-nhan-canh-bao.component';

@NgModule({
    declarations: [
        HeThongComponent,
        UserComponent,
        EditUserComponent,

        BoPhanComponent,  
        EditBoPhanComponent,      
        TroNgaiComponent,
        EditTroNgaiComponent,

        RoleComponent,
        EditRoleComponent,

        DonViComponent,
        UpdateDonViComponent,

        CauHinhMauComponent,
        UpdateCauHinhMauComponent,
        SystemConfigComponent,
        UpdateSystemConfigComponent,
        CauHinhDongBoComponent,
        UpdateCauHinhDongBoComponent,
        SystemLogComponent,

        MauHoSoComponent,
        UpdateMauHoSoComponent,
        CauHinhCanhBaoComponent,
        UpdateCauHinhCanhBaoComponent,
        LogCanhBaoComponent,
        CauHinhNhanCanhBaoComponent
    ],
    imports: [
        HeThongRoutingModule,

        SharedModule,

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
        NgSelect2Module
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
export class HeThongModule {

}
