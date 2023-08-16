import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DsKhachHangComponent } from './ds-khach-hang/ds-khach-hang.component';
import { DsKhaoSatComponent } from './ds-khao-sat/ds-khao-sat.component';
import { KhaoSatKhachHangGsComponent } from './khao-sat-khach-hang-gs.component';

const routes: Routes = [
    {
        path: '',
        component: KhaoSatKhachHangGsComponent,
        children: [
            {
                path: 'khachhang/filter',
                component: DsKhachHangComponent
            },
            {
                path: 'detail/:ID',
                component: DsKhaoSatComponent
            },
            
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GiamSatCapDienRoutingModule { }
