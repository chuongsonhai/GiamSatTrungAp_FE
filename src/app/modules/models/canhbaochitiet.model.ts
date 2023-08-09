
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

