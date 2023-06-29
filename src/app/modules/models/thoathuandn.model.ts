import { TramBienAp } from './trambienap.model';
export class ThoaThuanDN {
    ID: number
    MaKH: string
    SoBienBan: string
    NgayBienBan: string;

    MaYeuCau: string
    MaDViQLy: string;

    EVNDonVi: string
    EVNDaiDien: string
    EVNChucVu: string
    EVNDiaChi: string
    EVNDienThoai: string
    EVNFax: string
    EVNTaiKhoan: string
    EVNMaSoThue: string
    KHTen: string
    KHDaiDien: string
    KHChucDanh: string
    KHDiaChi: string
    KHDienThoai: string
    KHTaiKhoan: string
    KHMaSoThue: string
    TenCongTrinh: string
    DiaDiemXayDung: string
    NoiDung: string
    TaiLieuDinhKem: string
    NgayDauNoi: string
    TrangThai: number
    NgayLap: string
    NguoiLap: string

    ThoaThuanKhac: string;
    HTDoDem: string
    RanhGioiDauTu: string
    YeuCauKyThuat: string
    Data: string
    DocPath: string

    SoThongTu: string;
    NgayThongTu: string;

    TroNgai: string;

    QuyMo: QuyMoCongTrinh
    TramBienAps: TramBienAp[]
}

export class QuyMoCongTrinh {
    ID: number
    BienBanID: number
    BBKhaoSatID: number
    DiemDau: string
    DiemCuoi: string
    CapDienDauNoi: string
    DayDan: string
    SoMach: string
    ChieuDaiTuyen: string
    KetCau: string
    CheDoVanHanh: string
    MoTaCongTrinh: string
}