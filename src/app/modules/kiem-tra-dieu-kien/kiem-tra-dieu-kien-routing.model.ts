import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YeuCauNghiemThuComponent } from './components/yeu-cau-nghiem-thu.component';
import { KiemTraDieuKienComponent } from './kiem-tra-dieu-kien.component';
import { ListHopDongComponent } from './list-hop-dong/list-hop-dong.component';
import { ListYeuCauComponent } from './list-yeu-cau/list-yeu-cau.component';


const routes: Routes = [
    {
        path: '',
        component: KiemTraDieuKienComponent,
        children: [ 
            {
                path: 'list',
                component: ListYeuCauComponent
            }, 
            {
                path: 'hopdong',
                component: ListHopDongComponent
            },  
            {
                path: 'list/update/:ID',
                component: YeuCauNghiemThuComponent
            },   
        
            { path: '', redirectTo: 'ktnt', pathMatch: 'full' },
            { path: '**', redirectTo: 'ktnt', pathMatch: 'full' },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class KiemTraDieuKienRoutingModule { }
