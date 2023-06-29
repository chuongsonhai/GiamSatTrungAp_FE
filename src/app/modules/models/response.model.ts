export class ResponseModel {
    data: any;
    total: number;
    success: boolean;
    error: string;
    message: string;
}

export class ChamCongModel {
    data: any;
    total: number;
    success: boolean;
    error: string;
    message: string;
    ChamCaDau: boolean;
    ChamCaSau: boolean;
    AllowUpdate: boolean = true;
}
export class EcontractResponseModel {
    Data: any;
    Success: boolean;
    ErrorCode: string;
    ErrorDescription: string;
}

export class ChartResponseModel {
    series: any[]
    labels: any[]
}

export class YeuCauFilterModel {
    maDViQLy: string
    keyword: string
    khachhang: string
    status: number
    fromdate: string
    todate: string
}