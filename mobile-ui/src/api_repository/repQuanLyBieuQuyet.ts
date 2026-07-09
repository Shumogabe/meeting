import { ApiConnectGet } from "src/api_connector/apiConnector";
import { IOptionRequest } from "src/app_models/Repository";

export const RepQuanLyBieuQuyet_danhsachchobieuquyet = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'QuanLyBieuQuyet/danhsachchobieuquyet',
            params: {
                "scheduleId": options.params.scheduleId,
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

export const RepQuanLyBieuQuyet_danhsachdabieuquyet = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'QuanLyBieuQuyet/danhsachdabieuquyet',
            params: {
                "scheduleId": options.params.scheduleId,
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

export const RepQuanLyBieuQuyet_xemchitiet = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'QuanLyBieuQuyet/xemchitiet',
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

export const RepQuanLyBieuQuyet_timkiem = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'QuanLyBieuQuyet/timkiem',
            params: {
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