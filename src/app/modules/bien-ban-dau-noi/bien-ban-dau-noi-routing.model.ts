import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BienBanDauNoiComponent } from './bien-ban-dau-noi.component';
import { ListBienBanDNComponent } from './list-bien-ban-dau-noi/list-bien-ban-dau-noi.component';


const routes: Routes = [
    {
        path: '',
        component: BienBanDauNoiComponent,
        children: [ 
            {
                path: 'list',
                component: ListBienBanDNComponent
            },                
            { path: '', redirectTo: 'bbdn', pathMatch: 'full' },
            { path: '**', redirectTo: 'bbdn', pathMatch: 'full' },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BienBanDauNoiRoutingModule { }
