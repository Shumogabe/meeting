import { ApiConnectDelete, ApiConnectGet, ApiConnectPost, ApiConnectPut } from "src/api_connector/apiConnector";
import { IOptionRequest } from "src/app_models/Repository";

export const RepCauHinhCuocHop_them = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPost(
        {
            url: 'CauHinhCuocHop/them',
            params: {
                "label_vn": options.params.label_vn,
                "label_en": options.params.label_en,
                "status": options.params.status,
                "value": options.params.value,
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

export const RepCauHinhCuocHop_chinhsua = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPut(
        {
            url: 'CauHinhCuocHop/chinhsua' + `?id=${options.params.id}`,
            params: {
                "id": options.params.id,
                "label_vn": options.params.label_vn,
                "label_en": options.params.label_en,
                "status": options.params.status,
                "value": options.params.value,
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

export const RepCauHinhCuocHop_xoa = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectDelete(
        {
            url: 'CauHinhCuocHop/xoa',
            params: {
                "id": options.params.id
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

export const RepCauHinhCuocHop_danhsach = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'CauHinhCuocHop/danhsach',
            params: {
                "search": options.params.search,
                "dateFrom": options.params.dateFrom,
                "dateTo": options.params.dateTo,
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

export const RepCauHinhCuocHop_chitiet = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'CauHinhCuocHop/chitiet',
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