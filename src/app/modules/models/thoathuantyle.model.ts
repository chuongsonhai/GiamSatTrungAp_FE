export class ThoaThuanTyLe {
    ID: number
    CongVanID: number
    MaYeuCau: string
    MaDViQLy: string
    Data: string
    NgayLap: string
    DiaDiem: string
    DiaChiGiaoDich:string
    DonVi: string
    MaSoThue: string
    SoTaiKhoan: string
    NganHang: string
    DienThoai: string
    Fax: string
    Email: string
    DienThoaiCSKH: string
    Website: string
    DaiDien: string
    ChucVu: string
    SoGiayTo: string
    NgayCap: string
    NoiCap: string
    VanBanUQ: string
    NgayUQ: string
    NguoiKyUQ: string
    NgayKyUQ: string
    ChucVuUQ: string
    KHTen: string
    KHMa: string
    KHDiaChiGiaoDich: string
    KHDiaChiDungDien: string
    KHDangKyKD: string
    KHNoiCapDangKyKD: string
    KHNgayCaoDangKyKD: string
    KHMaSoThue: string
    KHSoTK: string
    KHNganHang: string
    KHDienThoai: string
    KHFax: string
    KHEmail: string
    KHDaiDien: string
    KHChucVu: string
    KHSoGiayTo: string
    KHNgayCap: string
    KHNoiCap: string
    KHVanBanUQ: string
    KHNgayUQ: string
    KHNguoiKyUQ: string
    KHNgayKyUQ: string
    UngDung: string
    TrangThai: number
    MucDichThucTeSDD: MucDichThucTeSDD[]
    GiaDienTheoMucDich: GiaDienTheoMucDich[]

}
export class MucDichThucTeSDD {
    ID: number
    ThoaThuanID: number
    TenThietBi: string
    CongSuat: number
    SoLuong: number
    HeSoDongThoi: number
    SoGio: number
    SoNgay: number
    TongCongSuatSuDung: number
    DienNangSuDung: number
    MucDichSDD: string

}
export class GiaDienTheoMucDich {

    ID: number
    ThoaThuanID: number
    SoCongTo: string
    MaGhiChiSo: string
    ApDungTuChiSo: string
    MucDichSuDung: string
    TyLe: string
    GDKhongTheoTG: string
    GDGioBT: string
    GDGioCD: string
    GDGioTD: string
}


