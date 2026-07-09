
export interface IAuth {
    AccessToken?: string;
    RefreshToken?: string;
    TokenExpiry?: number;

    form?: IAuthForm;
    data?: IUser;
    roles?: Array<IRole>;
}

export interface IAuthForm {
    username?: string;
    password?: string;
    rememberme?: boolean;
}

export interface IUser {
    "id"?: number;
    "name"?: string;
    "email"?: string;
    "mobile"?: string;

    //fix bo sung theo thong tin dang nhap
    "ten_dangnhap"?: string;
    "ten_day_du"?: string;
    "so_dien_thoai"?: string;
}

export interface IRole {
    "ma"?: string;
    "ten"?: string;
}