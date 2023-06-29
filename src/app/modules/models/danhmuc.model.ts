export class ChucDanh {
    ID: number = 0;
    Code: string;
    Name: string;
    Position: number = 0;
    TrinhDo: string;
    NamKN: number = 0;
    Description: string;
}

export class ChuyenMon {
    ID: number = 0;
    Ma: string;
    Ten: string;
}

export class ChuyenNganh {
    Ma: string;
    Ten: string;
    ThuTu: number;
    GhiChu: string;
    SuDung: boolean = true;
}

export class TrinhDo {
    Ma: string;
    Ten: string;
    ThuTu: number = 0;
    GhiChu: string;
    SuDung: boolean = true;
}

export class XepLoaiTotNghiep {
    Ma: string;
    Ten: string;
    ThuTu: number = 0;
    GhiChu: string;
    SuDung: boolean = true;
}

export class HinhThucDaoTao {
    Ma: string;
    Ten: string;
    ThuTu: number = 0;
    GhiChu: string;
    SuDung: boolean = true;
}

export class MoiQuanHe {
    ID: number;
    Ma: string;
    Ten: string;
    LoaiQuanHe: number;
    GhiChu: string;
    SuDung: boolean = true;
}

export class DanToc {
    ID: number;
    Ma: string;
    Ten: string;
}

export class TonGiao {
    ID: number;
    Ma: string;
    Ten: string;
}

export class LoaiNhanSu {
    ID: number;
    Ma: string;
    Ten: string;
}

export class BacLuong {
    ID: number = 0;
    MaSo: string;
    HeSo: number;
}