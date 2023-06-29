import { BienBanKS, KetQuaKS } from "./base.model";
import { BienBanKT } from "./bienbankt.model";
import { KetQuaKT } from "./ketquakt.model";

export class BienBanKSData {
    KetQuaKS: KetQuaKS = new KetQuaKS();
    BienBanKS: BienBanKS = new BienBanKS();
}

export class BienBanKTData {
    KetQuaKT: KetQuaKT = new KetQuaKT();
    BienBanKT: BienBanKT = new BienBanKT();
}