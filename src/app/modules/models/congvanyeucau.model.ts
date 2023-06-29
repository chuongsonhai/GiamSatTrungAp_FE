import { BienBanDN, BienBanKS, HoSoYeuCau } from './base.model';
import { TrangThaiCongVan } from './enum';
export class CongVanYeuCau {
    ID: number
    MaKHang: string
    SoCongVan: string    
    MaYeuCau: string
    NgayYeuCau: string
    MaLoaiYeuCau: string

    MaDViTNhan: string
    MaDViQLy: string
    BenNhan: string

    NguoiYeuCau: string
    DChiNguoiYeuCau: string

    TenKhachHang: string
    CoQuanChuQuan: string
    DiaChiCoQuan: string
    MST: string
    DienThoai: string
    Email: string

    DienSinhHoat: boolean

    NgayHen: string
    NgayHenKhaoSat: string
    NoiDungYeuCau: string
    DuAnDien: string
    DiaChiDungDien: string
    
    TrangThai: number
    NgayLap: string
    NguoiLap: string
    NguoiDuyet: string
    NgayDuyet: string
    Data: string

    LyDoHuy: string;

    MaCViec: string
    CongSuat:string
    MaHinhThuc:string
    CoHopDong:boolean
    TroNgai:string
}
