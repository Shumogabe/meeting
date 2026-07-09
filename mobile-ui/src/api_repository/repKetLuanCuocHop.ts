import { ApiConnectDelete, ApiConnectDownloadFile, ApiConnectGet, ApiConnectGetFile, ApiConnectPost, ApiConnectPostFile, ApiConnectPut } from "src/api_connector/apiConnector";
import { IOptionRequest } from "src/app_models/Repository";

export const RepKetLuanCuocHop_them = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPost(
        {
            url: 'KetLuanCuocHop/them',
            params: {
                "title": options.params.title,
                "scheduleId": options.params.scheduleId,
                "content": options.params.content,
                "fileUrl": options.params.fileUrl,
                "fileOriginalName": options.params.fileOriginalName,
                "fileSystemName": options.params.fileSystemName,
                "fileType": options.params.fileType,
                "fileSize": options.params.fileSize,
                "status": options.params.status,    // 0-Bản nháp | 1-Chưa duyệt | 2-Đã duyệt | 3-Hủy duyệt
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

export const RepKetLuanCuocHop_chinhsua = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPut(
        {
            url: 'KetLuanCuocHop/chinhsua' + `?id=${options.params.id}`,
            params: {
                "id": options.params.id,
                "title": options.params.title,
                "scheduleId": options.params.scheduleId,
                "content": options.params.content,
                "fileUrl": options.params.fileUrl,
                "fileOriginalName": options.params.fileOriginalName,
                "fileSystemName": options.params.fileSystemName,
                "fileType": options.params.fileType,
                "fileSize": options.params.fileSize,
                "status": options.params.status,    // 0-Bản nháp | 1-Chưa duyệt | 2-Đã duyệt | 3-Hủy duyệt
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

export const RepKetLuanCuocHop_xoa = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectDelete(
        {
            url: 'KetLuanCuocHop/xoa',
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

//thay doi status: 0-Draft | 1-Chưa duyệt | 2-Đã duyệt | 3-Hủy duyet
export const RepKetLuanCuocHop_xacnhan = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPut(
        {
            url: 'KetLuanCuocHop/xacnhan' + `?id=${options.params.id}`,
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

//thay doi status: 0-Draft | 1-Chưa duyệt | 2-Đã duyệt | 3-Hủy duyet
export const RepKetLuanCuocHop_huyxacnhan = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPut(
        {
            url: 'KetLuanCuocHop/huyxacnhan' + `?id=${options.params.id}`,
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

export const RepKetLuanCuocHop_ketluancuochop = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'KetLuanCuocHop/ketluancuochop',
            params: {
                "id": options.params.id,
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

export const RepKetLuanCuocHop_chitietketluan = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectGet(
        {
            url: 'KetLuanCuocHop/chitietketluan',
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

export const RepKetLuanCuocHop_taiteptinlen = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectPostFile(
        {
            url: 'KetLuanCuocHop/taiteptinlen' + '?scheduleId=' + options.params.scheduleId,
            params: {
                "scheduleId": options.params.scheduleId,
                "file": options.params.file
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

export const RepKetLuanCuocHop_laytep = async (options: IOptionRequest) => {
    options.params = options.params || {};

    ApiConnectDownloadFile(
        {
            url: 'KetLuanCuocHop/laytep',
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