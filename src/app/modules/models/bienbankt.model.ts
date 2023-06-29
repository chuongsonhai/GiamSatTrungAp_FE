import { ThanhPhanKT, ThanhPhanDaiDien } from './thanhphankt.modell';

export class BienBanKT {
    ID: number;
    MaYeuCau: string;
    MaDViQLy: string;

    CongVanID: number;
    ThoaThuanID: number;
    SoThoaThuan: string;
    NgayThoaThuan: string;
    ThoaThuanDauNoi: string;

    SoBienBan: string;
    NgayLap: string;
    DonVi: string;
    MaSoThue: string;
    DaiDien: string;
    ChucVu: string;

    KHMa: string;
    KHTen: string;
    KHMaSoThue: string;
    KHDaiDien: string;
    KHChucVu: string;
    KHDiaChi: string;
    KHDienThoai: string;
    KHEmail: string;

    TenCongTrinh: string;
    DiaDiemXayDung: string;

    QuyMo: string;
    HoSoKemTheo: string;
    KetQuaKiemTra: string;
    TonTai: string;
    KienNghi: string;
    YKienKhac: string;
    KetLuan: string;
    ThoiHanDongDien: string;
    TrangThai: number;
    MaCViec: string;
    Data: string; 

    ThuanLoi: boolean = true;
    MaTroNgai: string;
    TroNgai: string;

    LapBienBan: boolean;

    ThanhPhans: ThanhPhanDaiDien[];
}