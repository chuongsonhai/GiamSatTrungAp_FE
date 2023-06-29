export class ThanhPhanKT {
    ID: number = 0;
    DonVi: string;
    ThanhPhan: string;
    Loai: number = 0;
    DaiDiens:ThanhPhanDaiDien[];
}

export class ThanhPhanDaiDien {
    DaiDien: string;
    ChucVu: string;
    Loai: number = 0;
}