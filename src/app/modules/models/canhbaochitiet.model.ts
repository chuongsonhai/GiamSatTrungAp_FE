
export class CanhBaoChiTiet {
    idCanhbao: number
    ThongTinCanhBao:ThongTinCanhBao
    ThongTinYeuCau:ThongTinYeuCau
    phanHoi: PhanHoi[]
}
export class PhanHoi {
    idPhanHoi: number
    ID: number
    noiDungPhanHoi: string
    nguoiGui: string
    thoiGianGui: string
    donViQuanLy: string
    FILE_DINHKEM:string
}

export class ThongTinCanhBao{
    idCanhBao: number
    maLoaiCanhBao: number
    noidungCanhBao: string
    thoiGianGui: string
    trangThai: string
}
export class ThongTinYeuCau{
    ID: number
    TenKhachHang: string
    DienThoai: string
    MaYeuCau: string
    trangThai: string
}
export class KhaoSat{
    ID: number
    CANHBAO_ID: number
    NOIDUNG_CAUHOI: string
    PHANHOI_KH: string
    THOIGIAN_KHAOSAT: string
    NGUOI_KS: string
    KETQUA: string
    TRANGTHAI: number
    DONVI_QLY: string
}

export class DanhSachKhaoSat {
    MaYeuCau: string
    TenKhachHang:string
    DienThoai:string
    TrangThaiCongVan: string
    KhaoSat:[KhaoSat]
    Canhbao:[{
        ID: number,
        LOAI_CANHBAO_ID: number,
        THOIGIANGUI: string,
        NOIDUNG: string
        LOAI_SOLANGUI: number,
        MA_YC: string,
        TRANGTHAI_CANHBAO: number,
        DONVI_DIENLUC: string
    }]
}

