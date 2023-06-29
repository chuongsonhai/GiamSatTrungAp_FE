import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BienBanKSComponent } from './bien-ban-ks.component';
import { ListBienBanKSComponent } from './list-bien-ban-khao-sat/list-bien-ban-khao-sat.component';


const routes: Routes = [
    {
        path: '',
        component: BienBanKSComponent,
        children: [ 
            {
                path: 'list',
                component: ListBienBanKSComponent
            },                
            { path: '', redirectTo: 'bbks', pathMatch: 'full' },
            { path: '**', redirectTo: 'bbks', pathMatch: 'full' },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BienBanKSRoutingModule { }
