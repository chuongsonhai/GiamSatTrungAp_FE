import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BienBanTTComponent } from './bien-ban-tt.component';
import { ListBienBanTTComponent } from './list-bien-ban-tt/list-bien-ban-tt.component';


const routes: Routes = [
    {
        path: '',
        component: BienBanTTComponent,
        children: [ 
            {
                path: 'list',
                component: ListBienBanTTComponent
            },                
            { path: '', redirectTo: 'bbtt', pathMatch: 'full' },
            { path: '**', redirectTo: 'bbtt', pathMatch: 'full' },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BienBanTTRoutingModule { }
