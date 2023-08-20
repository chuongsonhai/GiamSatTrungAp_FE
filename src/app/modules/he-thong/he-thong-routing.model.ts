import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeThongComponent } from './he-thong.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { DonViComponent } from './don-vi/don-vi.component';
import { CauHinhMauComponent } from './cau-hinh-mau/cau-hinh-mau.component';
import { BoPhanComponent } from './bo-phan/bo-phan.component';
import { SystemConfigComponent } from './system-config/system-config.component';
import { CauHinhDongBoComponent } from './cau-hinh-dong-bo/cau-hinh-dong-bo.component';
import { TroNgaiComponent } from './tro-ngai/tro-ngai.component';
import { SystemLogComponent } from './system-log/system-log.component';
import { MauHoSoComponent } from './mau-ho-so/mau-ho-so.component';
import { CauHinhCanhBaoComponent } from './cau-hinh-canh-bao/cau-hinh-canh-bao.component';
import { LogCanhBaoComponent } from './log-canh-bao/log-canh-bao.component';
import { CauHinhNhanCanhBaoComponent } from './cau-hinh-canh-bao/cau-hinh-nhan-canh-bao/cau-hinh-nhan-canh-bao.component';

const routes: Routes = [
    {
        path: '',
        component: HeThongComponent,
        children: [    
            {
                path: 'roles',
                component: RoleComponent
            },        
            {
                path: 'users',
                component: UserComponent
            },             
            {
                path: 'bophan',
                component: BoPhanComponent
            }, 
            {
                path: 'donvi',
                component: DonViComponent
            },
            {
                path: 'mauhoso',
                component: MauHoSoComponent
            },              
            {
                path: 'templates',
                component: CauHinhMauComponent
            },  
            {
                path: 'systemconfig',
                component: SystemConfigComponent
            }, 
            {
                path: 'cauhinhdongbo',
                component: CauHinhDongBoComponent
            }, 
            {
                path: 'trongai',
                component: TroNgaiComponent
            }, 
            {
                path: 'systemlog',
                component: SystemLogComponent
            },
            {
                path: 'cauhinhcanhbao',
                component: CauHinhCanhBaoComponent
            }, 
            {
                path: 'cauhinhcanhbao/nguoinhan',
                component: CauHinhNhanCanhBaoComponent
            },       
            {
                path: 'logcanhbao',
                component: LogCanhBaoComponent
            },             
            { path: '', redirectTo: 'users', pathMatch: 'full' },
            { path: '**', redirectTo: 'users', pathMatch: 'full' },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HeThongRoutingModule { }
