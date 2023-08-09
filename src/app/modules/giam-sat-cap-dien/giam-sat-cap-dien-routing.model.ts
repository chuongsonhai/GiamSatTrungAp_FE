import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DanhSachCanhBaoComponent } from './danh-sach-canh-bao/danh-sach-canh-bao.component';
import { GiamSatCapDienComponent } from './giam-sat-cap-dien.component';
import { ChiTietCanhBaoComponent } from './chi-tiet-canh-bao/chi-tiet-canh-bao.component';


const routes: Routes = [
    {
        path: '',
        component: GiamSatCapDienComponent,
        children: [
            {
                path: 'filter',
                component: DanhSachCanhBaoComponent
            },
            {
                path: 'detail/:ID',
                component: ChiTietCanhBaoComponent
            },
            
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GiamSatCapDienRoutingModule { }
