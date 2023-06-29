import { BoPhan, CauHinhCViec } from "./base.model";
import { NhanVien } from "./nhanvien.model";

export class TienTrinhData {
    boPhans: BoPhan[];
    nhanViens: NhanVien[];
    congViecs: CauHinhCViec[];
    staffCode: string;
    deptId: string;
    maCViec: string;
}