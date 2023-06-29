export class ThoaThuanDamBao {
    ID: number;
    CongVanID: number;
    Gio: number;
    Phut: number;
    NgayLap: string;
    DiaDiem: string;

    DonVi: string;
    MaSoThue: string;
    DaiDien: string;
    ChucVu: string;
    VanBanUQ: string;
    NgayUQ: string;
    NguoiKyUQ: string;
    NgayKyUQ: string;
    ChucVuUQ: string;
    DiaChi: string;
    DienThoai: string;
    Email: string;
    DienThoaiCSKH: string;
    SoTaiKhoan: string;
    NganHang: string;
    KHMa: string;
    KHTen: string;
    KHDaiDien: string;
    KHDiaChi: string;
    KHDienThoai: string;
    KHEmail: string;
    KHSoGiayTo: string;

    NgayCap: string;
    NoiCap: string;


    KHChucVu : string;
    KHMaSoThue : string;
    KHDangKyKD : string;
    KHSoTK: string;
    KHNganHang: string;
    KHVanBanUQ: string;
    KHNguoiUQ: string;
    KHNgayUQ: string;

    GiaTriTien: number;
    TienBangChu: string;

    TuNgay: string;
    DenNgay: string;

    HinhThuc: string;
    GhiChu: string;
    TrangThai: number;

    Data: string;

    GiaTriDamBao: ChiTietDamBao[];
}
export class ChiTietDamBao {
    ID: number;
    ThoaThuanID: number;
    MucDich: string;
    SLTrungBinh: number;
    SoNgayDamBao: number;
    GiaBanDien: number;
    ThanhTien: number;
}