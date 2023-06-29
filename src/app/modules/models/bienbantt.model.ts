import { KetQuaTC } from "./ketquatc.model";

export class BienBanTT {
    ID: number;
    MA_DVIQLY: string;
    MA_YCAU_KNAI: string;
    TEN_CTY: string;
    TEN_DLUC: string;
    SO_BB: string;
    LY_DO: string;
    MA_LDO: string;
    MO_TA: string;
    TEN_KHACHHANG: string;
    SDT_KHACHHANG: string;
    NGUOI_DDIEN: string;
    DIA_DIEM: string;
    MA_DDO: string;
    MA_TRAM: string;
    MA_GCS: string;
    VTRI_LDAT: string;
    NVIEN_TTHAO: string;
    NVIEN_TTHAO2: string;
    NVIEN_TTHAO3: string;
    NVIEN_NPHONG: string;
    NGUOI_TAO: string;
    NGAY_TAO: string;
    TRANG_THAI: number;
    SO_COT: string;
    SO_HOP: string;
    Data: string;
    NoiDungXuLy: string;
    KyNVTT: boolean;
    KyNVNP: boolean;
    ChiTietThietBiTreo: ChiTietThietBiTreo;
    ChiTietThietBiThao: ChiTietThietBiThao;
}

export class BienBanTTData {
    LapBienBan: boolean;
    KetQuaTC: KetQuaTC;
    BienBanTT: BienBanTT;
}

export class ChiTietThietBiTreo {
    IsCongTo: boolean;
    IsMBD: boolean;
    IsMBDA: boolean;
    CongTo: CongTo;
    MayBienDienAps: MayBienDienAp[];
    MayBienDongs: MayBienDong[];
}
export class ChiTietThietBiThao {
    CongTo: CongTo;
    MayBienDienAps: MayBienDienAp[];
    MayBienDongs: MayBienDong[];
}
export class CongTo {
    ID: number
    SO_CT: string
    NAMSX_CTO: string
    MAHIEU_CTO: string
    PHA_CTO: string
    LOAI_CTO: string
    TSO_BIENDONG: string
    TSO_BIENAP: string
    NGAY_KDINH: string
    TDIEN_LTRINH: string
    SOLAN_LTRINH: string
    MA_CHIHOP: string
    SO_VIENHOP: string
    MA_CHITEM: string
    SO_VIENTEM: string
    SO_BIEUGIA: string
    CHIEU_DODEM: string
    DO_XA: string
    DONVI_HIENTHI: string
    HSO_MHINH: string
    HSO_HTDODEM: string
    CHI_SO: string
    LOAI: number;
    ChiSos: ChiSo[];
}
export class MayBienDienAp {
    ID: number
    BBAN_ID: number
    SO_TBI: string
    NAM_SX: string
    NGAY_KDINH: string
    LOAI: string
    TYSO_TU: string
    CHIHOP_VIEN: string
    TEM_KD_VIEN: string
    TU_THAO: boolean

}
export class MayBienDong {
    ID: number
    BBAN_ID: number
    SO_TBI: string
    NAM_SX: string
    NGAY_KDINH: string
    LOAI: string
    TYSO_TI: string
    CHIHOP_VIEN: string
    TEM_KD_VIEN: string
    TI_THAO: boolean
}

export class ChiSo {
    LOAI_CHISO: string
    P: string
    Q: string
    BT: string
    CD: string
    TD: string
}

export class CongToData {
    SO_PHA: string
    MA_KHO: string
    NGAY_BDONG: string
    TEN_NVKD: string
    MA_NVIENKD: string
    DIEN_AP: string
    MTEM_KD: string
    NGAY_KDINH: string
    MA_BDONG: string
    MA_DVIKD: string
    NAM_SX: string
    DONG_DIEN: string
    NGAY_LTRINH: string
    MA_CLOAI: string
    VH_CONG: string
    SO_HUU: string
    SERY_TEMKD: string
    KIM_CHITAI: string
    LOAI_SOHUU: string
    LOAI_CTO: string
    SLAN_LT: string
    SO_CHITAI: string
    TYSO_TI: string
    BCS: string
    MA_CTO: string
    NGAY_NHAP: string
    SO_BBAN_KD: string
    SO_CTO: string
    MA_DVI_SD: string
    SO_BBAN: string
    TYSO_TU: string
}

export class MayBienDienApData {
    SO_PHA: string
    MA_KHO: string
    SO_HUU: string
    NGAY_BDONG: string
    LOAI_SOHUU: string
    DIEN_AP: string
    TYSO_DAU: string
    NGAY_KDINH: string
    MA_BDONG: string
    MA_CTO: string
    NGAY_NHAP: string
    NAM_SX: string
    SO_BBAN_KD: string
    SO_CTO: string
    MA_CLOAI: string
    MA_DVI_SD: string
    SO_BBAN: string
}
export class MayBienDongData {
    SO_PHA: string
    MA_KHO: string
    SO_HUU: string
    NGAY_BDONG: string
    LOAI_SOHUU: string
    DIEN_AP: string
    TYSO_DAU: string
    NGAY_KDINH: string
    MA_BDONG: string
    MA_CTO: string
    NGAY_NHAP: string
    NAM_SX: string
    SO_BBAN_KD: string
    SO_CTO: string
    MA_CLOAI: string
    MA_DVI_SD: string
    SO_BBAN: string
}








