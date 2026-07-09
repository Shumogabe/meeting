import moment from "moment";
import { ApiConnectDelete, ApiConnectGet, ApiConnectPost, ApiConnectPut } from "src/api_connector/apiConnector";
import { IOptionRequest } from "src/app_models/Repository";

export const RepQuanLyLapLich_them = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPost(
        {
            url: 'QuanLyLapLich/them',
            params: {
                "title": options.params.title || 'Họp trực tuyến',
                "content": options.params.content,
                "startTime": options.params.startTime ?? moment(new Date()).format('YYYY-MM-DDTHH:mm:ss'),
                "endTime": options.params.endTime ?? moment(new Date(((dt) => { dt.setHours(dt.getHours() + 4); return dt })(new Date()))).format('YYYY-MM-DDTHH:mm:ss'),
                "chairMan": options.params.chairMan,
                "roomName": options.params.roomName ?? moment(new Date()).format('YYYYMMDDHHmmss'),
                "place": options.params.place,
                "status": options.params.status,
                "start": options.params.start,
                "token": options.params.token,
                "serverId": options.params.serverId,
                "typeId": options.params.typeId,
                "sharedRole": options.params.sharedRole,
                "password": options.params.password,
                "isLobby": options.params.isLobby,
                "isPublished": options.params.isPublished,
            },
            success: (res: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(res.data || null);
                }
            },
            error: (err: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(err?.response?.data);
                }
                console.error(err);
            },
            loading: options.loading,
            loadingController: options.loadingController
        }
    );
}

export const RepQuanLyLapLich_chinhsua = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPut(
        {
            url: 'QuanLyLapLich/chinhsua' + `?id=${options.params.id}`,
            params: {
                "id": options.params.id,
                "title": options.params.title,
                "content": options.params.content,
                "startTime": options.params.startTime,
                "endTime": options.params.endTime,
                "chairMan": options.params.chairMan,
                "roomName": options.params.roomName,
                "place": options.params.place,
                "status": options.params.status,
                "start": options.params.start,
                "token": options.params.token,
                "serverId": options.params.serverId,
                "typeId": options.params.typeId,
                "sharedRole": options.params.sharedRole,
                "password": options.params.password,
                "isLobby": options.params.isLobby,
                "isPublished": options.params.isPublished,
                "don_vi": options.params.don_vi,
            },
            success: (res: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(res.data || null);
                }
            },
            error: (err: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(err?.response?.data);
                }
                console.error(err);
            },
            loading: options.loading,
            loadingController: options.loadingController
        }
    );
}

export const RepQuanLyLapLich_xoa = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectDelete(
        {
            url: 'QuanLyLapLich/xoa',
            params: {
                "id": options.params.id,
            },
            success: (res: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(res.data || null);
                }
            },
            error: (err: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(err?.response?.data);
                }
                console.error(err);
            },
            loading: options.loading,
            loadingController: options.loadingController
        }
    );
}

export const RepQuanLyLapLich_xoahoantoan = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectDelete(
        {
            url: 'QuanLyLapLich/xoahoantoan',
            params: {
                "id": options.params.id,
            },
            success: (res: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(res.data || null);
                }
            },
            error: (err: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(err?.response?.data);
                }
                console.error(err);
            },
            loading: options.loading,
            loadingController: options.loadingController
        }
    );
}

export const RepQuanLyLapLich_thongtin = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'QuanLyLapLich/thongtin',
            params: {
                "id": options.params.id,
            },
            success: (res: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(res.data || null);
                }
            },
            error: (err: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(err?.response?.data);
                }
                console.error(err);
            },
            loading: options.loading,
            loadingController: options.loadingController
        }
    );
}

export const RepQuanLyLapLich_chitietphonghop = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'QuanLyLapLich/chitietphonghop',
            params: {
                "roomName": options.params.roomName,
            },
            success: (res: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(res.data || null);
                }
            },
            error: (err: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(err?.response?.data);
                }
                console.error(err);
            },
            loading: options.loading,
            loadingController: options.loadingController
        }
    );
}

export const RepQuanLyLapLich_xacnhan = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPost(
        {
            url: 'QuanLyLapLich/xacnhan' + `?id=${options.params.id}`,
            params: {
                "id": options.params.id,
            },
            success: (res: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(res.data || null);
                }
            },
            error: (err: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(err?.response?.data);
                }
                console.error(err);
            },
            loading: options.loading,
            loadingController: options.loadingController
        }
    );
}

export const RepQuanLyLapLich_huyxacnhan = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPost(
        {
            url: 'QuanLyLapLich/huyxacnhan' + `?id=${options.params.id}`,
            params: {
                "id": options.params.id,
            },
            success: (res: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(res.data || null);
                }
            },
            error: (err: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(err?.response?.data);
                }
                console.error(err);
            },
            loading: options.loading,
            loadingController: options.loadingController
        }
    );
}

export const RepQuanLyLapLich_danhsachdaxoa = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'QuanLyLapLich/danhsachdaxoa',
            success: (res: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(res.data || null);
                }
            },
            error: (err: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(err?.response?.data);
                }
                console.error(err);
            },
            loading: options.loading,
            loadingController: options.loadingController
        }
    );
}

export const RepQuanLyLapLich_khoiphuc = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPost(
        {
            url: 'QuanLyLapLich/khoiphuc' + `?id=${options.params.id}`,
            params: {
                "id": options.params.id,
            },
            success: (res: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(res.data || null);
                }
            },
            error: (err: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(err?.response?.data);
                }
                console.error(err);
            },
            loading: options.loading,
            loadingController: options.loadingController
        }
    );
}

export const RepQuanLyLapLich_danhsach = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'QuanLyLapLich/danhsach',
            params: {
                "pageNumber": options.params.pageNumber,
                "pageSize": options.params.pageSize,
                "search": options.params.search,
                "dateFrom": options.params.dateFrom,
                "dateTo": options.params.dateTo,
                "status": options.params.status,
                "start": options.params.start,
                "isdeleted": options.params.isdeleted,
            },
            success: (res: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(res.data || null);
                }
            },
            error: (err: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(err?.response?.data);
                }
                console.error(err);
            },
            loading: options.loading,
            loadingController: options.loadingController
        }
    );
}

export const RepQuanLyLapLich_danhsachserver = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'QuanLyLapLich/danhsachserver',
            params: {
                "pageNumber": options.params.pageNumber,
                "pageSize": options.params.pageSize,
                "search": options.params.search,
            },
            success: (res: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(res.data || null);
                }
            },
            error: (err: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(err?.response?.data);
                }
                console.error(err);
            },
            loading: options.loading,
            loadingController: options.loadingController
        }
    );
}

export const RepQuanLyLapLich_thongtinnguoidung = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'QuanLyLapLich/thongtinnguoidung',
            params: {
                "pageNumber": options.params.pageNumber,
                "pageSize": options.params.pageSize,
                "search": options.params.search,
            },
            success: (res: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(res.data || null);
                }
            },
            error: (err: any) => {
                if (typeof options.callback == 'function') {
                    options.callback(err?.response?.data);
                }
                console.error(err);
            },
            loading: options.loading,
            loadingController: options.loadingController
        }
    );
}