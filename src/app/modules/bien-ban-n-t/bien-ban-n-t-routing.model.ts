import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BienBanNTComponent } from './bien-ban-n-t.component';
import { ListBienBanNghiemThuComponent } from './list-bien-ban-nghiem-thu/list-bien-ban-nghiem-thu.component';



const routes: Routes = [
    {
        path: '',
        component: BienBanNTComponent,
        children: [ 
            {
                path: 'list',
                component: ListBienBanNghiemThuComponent
            },                
            { path: '', redirectTo: 'bbnt', pathMatch: 'full' },
            { path: '**', redirectTo: 'bbnt', pathMatch: 'full' },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BienBanNTRoutingModule { }
