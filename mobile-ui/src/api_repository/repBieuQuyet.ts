import { ApiConnectDelete, ApiConnectGet, ApiConnectPost, ApiConnectPut } from "src/api_connector/apiConnector";
import { IOptionRequest } from "src/app_models/Repository";

export const RepBieuQuyet_kichhoat = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPost(
        {
            url: 'BieuQuyet/kichhoat' + `?id=${options.params.id}`,
            params: {
                id: options.params.id,
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

export const RepBieuQuyet_ketthuc = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPost(
        {
            url: 'BieuQuyet/ketthuc' + `?id=${options.params.id}`,
            params: {
                id: options.params.id,
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

export const RepBieuQuyet_danhsachchobieuquyet = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'BieuQuyet/danhsachchobieuquyet',
            params: {
                voteid: options.params.voteid,
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

export const RepBieuQuyet_danhsachluachonbieuquyet = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'BieuQuyet/danhsachluachonbieuquyet',
            params: {
                voteid: options.params.voteid,
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

export const RepBieuQuyet_chonbieuquyet = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPost(
        {
            url: 'BieuQuyet/chonbieuquyet',
            params: {
                "title": options.params.title,
                "voteId": options.params.voteId,
                "isCreatedByAd": options.params.isCreatedByAd,
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

export const RepBieuQuyet_chinhsua = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPut(
        {
            url: 'BieuQuyet/chinhsua',
            params: {
                "id": options.params.id,
                "title": options.params.title,
                "voteId": options.params.voteId,
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

export const RepBieuQuyet_xoa = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectDelete(
        {
            url: 'BieuQuyet/xoa',
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

export const RepBieuQuyet_ketquabieuquyet = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'BieuQuyet/ketquabieuquyet',
            params: {
                voteid: options.params.voteid,
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
