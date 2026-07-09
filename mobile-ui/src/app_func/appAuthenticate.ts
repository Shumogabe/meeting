import { APP_ROUTE } from "./appRoute";
import { RepAuth_Clear, RepAuth_Get } from "src/api_repository/repAuth";

export {
    APP_AUTHENTICATE_GetAuth,
    APP_AUTHENTICATE_GetAuthRequire,
    APP_AUTHENTICATE_IsAuth,
    APP_AUTHENTICATE_IsAuthRequire
}

//lấy thông tin tài khoản đã đăng nhập
const APP_AUTHENTICATE_GetAuth = async () => {
    return await RepAuth_Get();
}

//lấy thông tin tài khoản đã đăng nhập, nếu chưa đăng nhâp thì chuyển hướng tới trang đăng nhập
const APP_AUTHENTICATE_GetAuthRequire = async () => {
    let auth = await RepAuth_Get();

    //không có token hoặc token đã hết hạn thì chim côk
    if (!auth.AccessToken || (auth.TokenExpiry ?? 0) - new Date().getTime() < 0) {
        await RepAuth_Clear();
        window.location.replace(APP_ROUTE.AUTH + `?returnurl=${encodeURIComponent(window.location.href)}`);
    }
    return auth;
}

//lấy thông tin tài khoản đã đăng nhập
const APP_AUTHENTICATE_IsAuth = async () => {
    return (await RepAuth_Get()).AccessToken ? true : false;
}

//lấy thông tin tài khoản đã đăng nhập, bắt buộc
const APP_AUTHENTICATE_IsAuthRequire = async () => {
    let auth = await RepAuth_Get();

    //không có token hoặc token đã hết hạn thì chim côk
    if (!auth.AccessToken || (auth.TokenExpiry ?? 0) - new Date().getTime() < 0) {
        await RepAuth_Clear();
        //window.location.replace(APP_ROUTE.AUTH + `?returnurl=${encodeURIComponent(window.location.href)}`);
    }
    return auth.AccessToken ? true : false;
}