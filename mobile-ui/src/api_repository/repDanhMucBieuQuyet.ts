import { ApiConnectDelete, ApiConnectGet, ApiConnectPost, ApiConnectPut } from "src/api_connector/apiConnector";
import { IOptionRequest } from "src/app_models/Repository";

export const RepDanhMucBieuQuyet_them = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPost(
        {
            url: 'DanhMucBieuQuyet/them',
            params: {
                "title": options.params.title,
                "type": options.params.type,
                "status": options.params.status,
                "end": options.params.end,
                "scheduleId": options.params.scheduleId,
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

export const RepDanhMucBieuQuyet_chinhsua = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPut(
        {
            url: 'DanhMucBieuQuyet/chinhsua' + `?id=${options.params.id}`,
            params: {
                "id": options.params.id,
                "title": options.params.title,
                "type": options.params.type,
                "status": options.params.status,
                "end": options.params.end,
                "scheduleId": options.params.scheduleId,
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

export const RepDanhMucBieuQuyet_xoa = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectDelete(
        {
            url: 'DanhMucBieuQuyet/xoa',
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

export const RepDanhMucBieuQuyet_xemchitiet = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'DanhMucBieuQuyet/xemchitiet',
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

export const RepDanhMucBieuQuyet_danhsach = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'DanhMucBieuQuyet/danhsach',
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

export const RepDanhMucBieuQuyet_xacnhan = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPost(
        {
            url: 'DanhMucBieuQuyet/xacnhan' + `?id=${options.params.id}`,
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

export const RepDanhMucBieuQuyet_huyxacnhan = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPost(
        {
            url: 'DanhMucBieuQuyet/huyxacnhan' + `?id=${options.params.id}`,
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

export const RepDanhMucBieuQuyet_danhmucxacnhan = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'DanhMucBieuQuyet/danhmucxacnhan',
            params: {
                "pageNumber": options.params.pageNumber,
                "pageSize": options.params.pageSize,
                "scheduleId": options.params.scheduleId,
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

export const RepDanhMucBieuQuyet_danhsachphonghop = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'DanhMucBieuQuyet/danhsachphonghop',
            params: {
                "pageNumber": options.params.pageNumber,
                "pageSize": options.params.pageSize,
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