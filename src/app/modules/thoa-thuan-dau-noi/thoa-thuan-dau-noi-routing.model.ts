import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThoaThuanDauNoiComponent } from './thoa-thuan-dau-noi.component';
import { ListThoaThuanDauNoiComponent } from './list-thoa-thuan-dau-noi/list-thoa-thuan-dau-noi.component';
import { YeuCauDauNoiComponent } from './components/yeu-cau-dau-noi.component';
import { DoingBusinessComponent } from './doing-business/doing-business.component';


const routes: Routes = [
    {
        path: '',
        component: ThoaThuanDauNoiComponent,
        children: [ 
            {
                path: 'list',
                component: ListThoaThuanDauNoiComponent
            },                
            {
                path: 'list/update/:ID',
                component: YeuCauDauNoiComponent
            },
            {
                path: 'list/history/:ID',
                component: DoingBusinessComponent
            } ,
            { path: '', redirectTo: 'ttdn', pathMatch: 'full' },
            { path: '**', redirectTo: 'ttdn', pathMatch: 'full' },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ThoaThuanDauNoiRoutingModule { }
