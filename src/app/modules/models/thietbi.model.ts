export class ThietBi {
    ID: number;
    CongVanID: number;
    HopDongID: number;
    Ten: string;
    KHTen: string;
    DiaChiDungDien: string;
    TongCongSuat: number;
    TrangThai: number;

    NgayLap: string;
    NguoiLap: string;
    NgayKy: string;
    NguoiKy: string;
    Data: string;
    ThietBiChiTiets: ThietBiChiTiet[];
}
export class ThietBiChiTiet {
    ID: number;
    ThietBiID: number;
    HopDongID: number;
    Ten: string;
    CongSuat: number;
    SoLuong: number;
    HeSoDongThoi: number;
    SoGio: number;
    SoNgay: number;
    TongCongSuat: number;
    GhiChu: string;
}