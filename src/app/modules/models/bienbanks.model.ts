import { ThanhPhanDaiDienKS, ThanhPhanKS } from './thanhphanks.model';
export class BienBanKS {
    ID: number;
    MaYeuCau: string;
    CongVanID: number;
    SoCongVan: string;
    NgayCongVan: string;
    MaKH: string;
    SoBienBan: string;
    TenCongTrinh: string;
    DiaDiemXayDung: string;
    KHTen: string;
    KHDaiDien: string;
    KHChucDanh: string;
    EVNDonVi: string;
    EVNDaiDien: string;
    EVNChucDanh: string;
    NgayDuocGiao: string;
    
    NgayKhaoSat: string;
    CapDienAp: string;
    TenLoDuongDay: string;
    DiemDauDuKien: string;
    DayDan: string;
    SoTramBienAp: number;
    SoMayBienAp: number;
    TongCongSuat: number;
    ThoaThuanKyThuat: string;
    NgayLap: string;
    NguoiLap: string;
    TrangThai: number;
    Data: string;
    
    MaTroNgai: string;
    TroNgai: string;
    ThuanLoi: boolean = true;

    ThanhPhans: ThanhPhanDaiDienKS[];
}

export class SignModel {
    id: number;
    binary_string: string;
}

export class ApproveModel {
    id: number;
    deptId: number;
    staffCode: string;
    ngayHen: string;
    noiDung: string;
    maCViec: string;
}

export class SignBienBanTT {
    id: number;
    SignTT: boolean;
}

export class SignRemoteModel {
    id: number;
    deptId: number;
    staffCode: string;
    ngayHen: string;
    noiDung: string;
    maCViec: string;
    binary_string: string;
}

export class CancelModel {
    maYCau: string;
    noiDung: string;
}