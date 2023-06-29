export class Module {
    Code: string;
    Name: string;
    Permissions: Permission[];
}

export class Permission {
    PermissionID: number;
    Code: string;
    Name: string;
    GroupCode: string;
}

export class LyDo {
    MA_LDO: string;
    TEN_LDO: string;
    NHOM: number;
    STT_HTHI: number;
}