export class SystemConfig {
    ID: number = 0;
    ComID: number;
    Code: string;
    Value: string;
	
}

export class CauHinhCanhBao {
    maLoaiCanhBao: number = 0;
    chuKy: number;
    tenLoaiCanhbao: string;
    trangThai: number;
	
}

export class LogCanhBao {
    ID: number;
    CANHBAO_ID: number;
    TRANGTHAI: number;
    DATA_CU: string;
    DATA_MOI: string;
    THOIGIAN: string;
    NGUOITHUCHIEN: string;
	
}

export class LogKhaoSat {
    ID: number;
    KHAOSAT_ID: number;
    TRANGTHAI: number;
    DATA_CU: string;
    DATA_MOI: string;
    THOIGIAN: string;
    NGUOITHUCHIEN: string;
	
}