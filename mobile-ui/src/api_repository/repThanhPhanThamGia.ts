import { ApiConnectDelete, ApiConnectGet, ApiConnectPost } from "src/api_connector/apiConnector";
import { IOptionRequest } from "src/app_models/Repository";

export const RepThanhPhanThamGia_them = async (options: IOptionRequest) => {
    options.params = options.params || {};
    ApiConnectPost(
        {
            url: 'ThanhPhanThamGia/them',
            params: {
                "scheduleId": options.params.scheduleId ?? null,
                "userId": options.params.userId ?? null,
                "email": options.params.email ?? null,
                "activated": options.params.activated ?? null,
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
export const RepThanhPhanThamGia_thoatphonghop = async (options: IOptionRequest) => {
    options.params = options.params || {};
    ApiConnectDelete(
        {
            url: 'ThanhPhanThamGia/thoatphonghop',
            params: {
                "id": options.params.id ?? null,
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
export const RepThanhPhanThamGia_danhsachphonghop = async (options: IOptionRequest) => {
    options.params = options.params || {};
    ApiConnectGet(
        {
            url: 'ThanhPhanThamGia/danhsachphonghop',
            params: {
                "search": options.params.search ?? null,
                "dateFrom": options.params.dateFrom ?? null,
                "dateTo": options.params.dateTo ?? null,
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
export const RepThanhPhanThamGia_danhsachnguoithamgia = async (options: IOptionRequest) => {
    options.params = options.params || {};
    ApiConnectGet(
        {
            url: 'ThanhPhanThamGia/danhsachnguoithamgia',
            params: {
                "id": options.params.id ?? null,
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