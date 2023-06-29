import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CauHinhCongViecComponent } from './cau-hinh-cong-viec/cau-hinh-cong-viec.component';
import { DanhMucComponent } from './danh-muc.component';
import { MailCanhBaoTctComponent } from './mail-canh-bao-tct/mail-canh-bao-tct.component';
import { MailThongBaoComponent } from './mail-thong-bao/mail-thong-bao.component';
import { NhanVienComponent } from './nhan-vien/nhan-vien.component';
import { ThongBaoComponent } from './thong-bao/thong-bao.component';
import { TienTrinhComponent } from './tien-trinh/tien-trinh.component';

const routes: Routes = [
    {
        path: '',
        component: DanhMucComponent,
        children: [
            {
                path: 'cauhinhcv',
                component: CauHinhCongViecComponent
            },
            {
                path: 'tientrinh',
                component: TienTrinhComponent
            },
            {
                path: 'mail',
                component: MailThongBaoComponent
            },
            {
                path: 'nhanvien',
                component: NhanVienComponent
            },
            {
                path: 'thongbao',
                component: ThongBaoComponent
            },
            {
                path: 'mailcanhbaotct',
                component: MailCanhBaoTctComponent
            }
        ],
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DanhMucRoutingModule { }
