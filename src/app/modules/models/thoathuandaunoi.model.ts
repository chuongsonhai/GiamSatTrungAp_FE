import { BienBanDN, BienBanKS } from "./base.model";
import { CongVanYeuCau } from "./congvanyeucau.model";

export class ThoaThuanDauNoi {
    CongVanYeuCau: CongVanYeuCau;
    BienBanKS: BienBanKS;
    BienBanDN: BienBanDN;
}

export class BienBanDNData {
    CongVanYeuCau: CongVanYeuCau;
    BienBanDN: BienBanDN;
}