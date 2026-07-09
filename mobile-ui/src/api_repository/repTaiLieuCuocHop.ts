import { ApiConnectDelete, ApiConnectDownloadFile, ApiConnectGet, ApiConnectGetFile, ApiConnectPost, ApiConnectPostFile, ApiConnectPut } from "src/api_connector/apiConnector";
import { IOptionRequest } from "src/app_models/Repository";

export const RepTaiLieuCuocHop_tailieucuochop = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'TaiLieuCuocHop/tailieucuochop',
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

export const RepTaiLieuCuocHop_xemchitiet = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'TaiLieuCuocHop/xemchitiet',
            params: {
                "url": options.params.url,
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

export const RepTaiLieuCuocHop_them = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPost(
        {
            url: 'TaiLieuCuocHop/them',
            params: {
                "title": options.params.title,
                "scheduleId": options.params.scheduleId,

                "url": options.params.url,
                "originalName": options.params.originalName,
                "systemName": options.params.systemName,
                "type": options.params.type,
                "size": options.params.size,
                "status": options.params.status,
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

export const RepTaiLieuCuocHop_chinhsua = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPut(
        {
            url: 'TaiLieuCuocHop/chinhsua',
            params: {
                "id": options.params.id,
                "title": options.params.title,
                "scheduleId": options.params.scheduleId,

                "fileUrl": options.params.url,
                "fileOriginalName": options.params.originalName,
                "fileSystemName": options.params.systemName,
                "fileSize": options.params.size,
                "fileType": options.params.type,

                "status": options.params.status,
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

export const RepTaiLieuCuocHop_xacnhan = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPut(
        {
            url: 'TaiLieuCuocHop/xacnhan' + `?id=${options.params.id}`,
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

export const RepTaiLieuCuocHop_huyxacnhan = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPut(
        {
            url: 'TaiLieuCuocHop/huyxacnhan' + `?id=${options.params.id}`,
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

export const RepTaiLieuCuocHop_xoa = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectDelete(
        {
            url: 'TaiLieuCuocHop/xoa',
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

export const RepTaiLieuCuocHop_khoiphuc = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPut(
        {
            url: 'TaiLieuCuocHop/khoiphuc' + `?id=${options.params.id}`,
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

export const RepTaiLieuCuocHop_danhsachdaxoa = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'TaiLieuCuocHop/danhsachdaxoa',
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

export const RepTaiLieuCuocHop_xoahoantoan = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectDelete(
        {
            url: 'TaiLieuCuocHop/xoahoantoan',
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

export const RepTaiLieuCuocHop_taiteptinlen = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPostFile(
        {
            url: 'TaiLieuCuocHop/taiteptinlen' + '?scheduleId=' + options.params.scheduleId,
            params: {
                "scheduleId": options.params.scheduleId,
                "files": options.params.files
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

export const RepTaiLieuCuocHop_laytep = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectDownloadFile(
        {
            url: 'TaiLieuCuocHop/laytep',
            params: {
                "scheduleId": options.params.scheduleId,
                "fileName": options.params.fileName,
                "fileType": options.params.fileType,
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

export const RepTaiLieuCuocHop_danhmucxacnhan = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'TaiLieuCuocHop/danhmucxacnhan',
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

export const RepTaiLieuCuocHop_danhsachphonghop = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'TaiLieuCuocHop/danhsachphonghop',
            params: {
                "pageNumber": options.params.pageNumber,
                "pageSize": options.params.pageSize,
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