export class ThanhPhanKS {
    ID: number = 0;
    DonVi: string;
    ThanhPhan: string;
    Loai: number = 0;
    DaiDiens:ThanhPhanDaiDienKS[];
}

export class ThanhPhanDaiDienKS {
    DaiDien: string;
    ChucVu: string;
    Loai: number = 0;
}