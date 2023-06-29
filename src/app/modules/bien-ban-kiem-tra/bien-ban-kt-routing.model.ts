import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BienBanKTComponent } from './bien-ban-kt.component';
import { ListBienBanKTComponent } from './list-bien-ban-kiem-tra/list-bien-ban-kiem-tra.component';


const routes: Routes = [
    {
        path: '',
        component: BienBanKTComponent,
        children: [ 
            {
                path: 'list',
                component: ListBienBanKTComponent
            },                
            { path: '', redirectTo: 'bbkt', pathMatch: 'full' },
            { path: '**', redirectTo: 'bbkt', pathMatch: 'full' },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BienBanKTRoutingModule { }
