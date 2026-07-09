import queryString from 'query-string';
// import { ThongBao } from './components';

const isDevelopment = process.env.NODE_ENV === 'development';
const url = window.location.hostname;
//' + url.split(".")[1] + '

// const url_fe = 'http://' + url + ':9003/';
// const url_fe = 'https://meeting-qtht.mae.gov.vn/';
const url_fe = isDevelopment ? 'http://' + url + ':9003/' : 'https://' + url.split('.')[0] + '.mae.gov.vn/';

// const url_be = 'http://' + url + ':9004/';
// const url_be = 'https://meeting-qthtapi.mae.gov.vn/';
const url_be = isDevelopment ? 'http://' + url + ':9004/' : 'https://' + url.split('.')[0] + 'api.mae.gov.vn/';

// const url_api_htt = 'http://' + url + ':9002/';
// const url_api_htt = 'https://meeting-api.mae.gov.vn/';
const url_api_htt = isDevelopment ? 'http://' + url + ':9002/' : 'https://' + url.split('.')[0].replace('-qtht', '') + '-api.mae.gov.vn/';

// const url_sso = 'https://xttk.monre.gov.vn:9443/';
const url_sso = 'https://xacthuc.mae.gov.vn/';

export const time_thong_bao = 5000;

//TODO: WSO2 SSO
// export const CLIENT_ID = 'bHKxaF8Gio5JEqQ5sGcxGYAyt84a'; //https://xttk.monre.gov.vn:9443/
export const CLIENT_ID = 'zrAi9HWLePnyM9AdScsJ3AxxcJsa'; //https://xacthuc.mae.gov.vn/
export const SESSION_STORAGE = `oidc.user:` + url_sso + `oauth2/token:${CLIENT_ID}`;

//TODO: api QTHT
export const API_URI = url_be + 'api/htt_qtht/';

//TODO: api HTT
export const API_URI_API_HTT = url_api_htt;

//TODO: giao diện
export const APP_NAVIGATE_URL = url_fe;
export const APP_REDIRECT_URL = url_fe + 'callback';
export const APP_SILENT_REDIRECT_URL = url_fe + 'silentRenew';

//TODO: SSO
export const API_IDENTITY_URI = url_sso + 'oauth2/token';

var CurrentUser = null;
export function setCurrentUser(user) {
    CurrentUser = user;
}

function getHeaders() {
    return {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
        'Content-Security-Policy': "default-src 'self'; script-src 'self' https://trusted.cdn.com; img-src 'self' https://trusted.cdn.com; style-src 'self' 'unsafe-inline'; frame-ancestors 'none';",
        'X-Frame-Options': 'DENY',
    };
    if (CurrentUser) {
        return {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + CurrentUser?.access_token,
        };
    }

    return { 'Content-Type': 'application/json' };
}

function getHeaderFile() {
    return {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
        'Content-Security-Policy': "default-src 'self'; script-src 'self' https://trusted.cdn.com; img-src 'self' https://trusted.cdn.com; style-src 'self' 'unsafe-inline'; frame-ancestors 'none';",
        'X-Frame-Options': 'DENY',
    };
    if (CurrentUser) {
        return {
            // 'Content-Type': 'multipart/form-data; boundary',
            Authorization: 'Bearer ' + CurrentUser?.access_token,
        };
    }

    return { 'content-type': 'multipart/form-data' };
}

export function callAPI({ method, path, data }) {
    if (method !== 'GET' && method !== 'DELETE' && method !== 'PUT') {
        method = 'POST';
    }

    if (method === 'GET') {
        const qr = queryString.stringify({ ...data });
        if (qr !== '') {
            path = path + '?' + qr;
        }
        data = null;
    }

    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: 'Hết thời gian yêu cầu máy chủ' });
            return resolve({
                code: 408,
                data: 'Hết thời gian yêu cầu máy chủ',
                type: 'error',
            });
        }, 30000);

        const resfunc = (response) => {
            clearTimeout(timeoutId);

            if (!response) {
                new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: 'no_response' });
                return resolve({ code: 503, message: 'no_response', type: 'error' });
            }

            if (!response.ok && response.status === 500) {
                return response.text().then((msg) => {
                    // ThongBao({ code: response.status, message: msg, type: 'warning' });
                    resolve({ code: response.status, message: msg, type: 'error' });
                });
            }

            if (!response.ok) {
                new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: response ? response.statusText : '' });
                // ThongBao({ code: response.status, message: response ? response.statusText : '', type: 'warning' });
                return resolve({
                    code: response.status,
                    message: response ? response.statusText : '',
                    type: 'error',
                });
            }

            // lỗi hệ thống k xử lý được?
            if (response.status === 299) {
                return response.text().then((msg) => {
                    new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: msg });
                    // ThongBao({ code: response.status, message: msg, type: 'warning' });
                    resolve({ code: response.status, message: msg, type: 'warning' });
                });
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json();
            }

            return response.text();
        };

        const errfunc = (err) => {
            console.error(err);
            clearTimeout(timeoutId);
            new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: 'Quá thời gian' });
            return resolve({ code: 500, message: 'Quá thời gian', type: 'error' });
        };

        fetch(path, {
            method: method,
            mode: 'cors',
            headers: getHeaders(),
            body: data !== null ? JSON.stringify(data) : null,
        })
            .then(resfunc, errfunc)
            .then((resdata) => {
                if (!resdata) {
                    // TODO throw new Error(MESSAGE.cscore_tnn_ERROR);
                    return resolve({ code: 200, data: [], type: 'success' });
                }

                // console.info("APIService successful at ", resdata);
                if (resdata.code) {
                    return resdata;
                }

                return resolve({ code: 200, data: resdata, type: 'success' });
            });
    });
}

function callAPIUploadFile({ data }) {
    const method = 'POST';
    return fetch(API_URI + `upload`, {
        method: method,
        body: data,
        headers: getHeaderFile(),
    })
        .then((response) => {
            if (!response) {
                // TODO
                return;
            }

            if (!response.ok) {
                // TODO
                return;
            }

            // lỗi hệ thống k xử lý được?
            if (response.status === 299) {
                return response.json().then((err) => {
                    throw new Error(err && err.message);
                });
            }

            return response.json();
        })
        .then((resdata) => {
            if (!resdata) {
                // throw new Error(MESSAGE.cscore_tnn_ERROR);
                return;
            }
            return resdata;
        });
}
const callExportFile = ({ path, data, method, fileName }) => {
    fetch(path, {
        method: method,
        headers: getHeaderFile(),
        responseType: 'blob',
        body: data !== null ? JSON.stringify(data) : null,
    })
        .then((response) => {
            if (response.ok) {
                return response.blob();
            }
        })
        .then((blob) => {
            if (!blob) {
                // throw new Error(MESSAGE.ERROR);
                // message.error(MESSAGE.ERROR)
            } else {
                /*TODO: Concurrent users*/
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName ? fileName : data.filename);
                document.body.appendChild(link);
                link.click();
                // Clean up: revoke the object URL and remove the link element
                document.body.removeChild(link); // Remove the link from the document
                window.URL.revokeObjectURL(url); // Revoke the object URL
            }
        });
};
const callExportWordFile = ({ path, data, method, fileName }) => {
    fetch(path, {
        method: method,
        headers: getHeaders(),
        responseType: 'blob',
        body: data !== null ? JSON.stringify(data) : null,
    })
        .then((response) => {
            return response.blob();
        })
        .then((blob) => {
            const timestamp = new Date().getTime();
            // Tạo URL tạm thời cho blob
            const blobUrl = URL.createObjectURL(blob);

            // Tạo một đối tượng <a> với download attribute
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = fileName + timestamp + '.docx';
            // Thêm đối tượng <a> vào DOM
            document.body.appendChild(a);
            // Kích hoạt sự kiện click trên đối tượng <a>
            a.click();
            // Loại bỏ đối tượng <a> khỏi DOM sau khi tải xuống
            document.body.removeChild(a);
        });
};
function callAPIDownloadFile({ path, data, fileName }) {
    const method = 'POST';

    let canopen = false;
    if (data && data.file_name) {
        let arr = data.file_name.split('.');
        if (arr && arr.length > 0 && arr[arr.length - 1].toUpperCase() === 'PDF') {
            canopen = true;
        }
    }

    if (canopen) {
        return fetch(path, {
            method: method,
            headers: getHeaders(),
            responseType: 'blob',
            body: data !== null ? JSON.stringify(data) : null,
        })
            .then((response) => {
                if (!response) {
                    // TODO
                    new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: 'no_response' });
                    return;
                }

                if (!response.ok) {
                    // TODO
                    new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: response ? response.statusText : '' });
                    return;
                }

                // lỗi hệ thống k xử lý được?
                if (response.status === 299) {
                    return response.json().then((err) => {
                        new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: err && err.message });
                        throw new Error(err && err.message);
                    });
                }

                return response.arrayBuffer();
            })
            .then((resdata) => {
                if (!resdata) {
                    // TODO throw new Error(MESSAGE.cscore_tnn_ERROR);
                    return;
                }

                window.open(URL.createObjectURL(new Blob([resdata], { type: 'application/pdf' })));
            });
    }

    return fetch(path, {
        method: method,
        headers: getHeaders(),
        responseType: 'blob',
        body: data !== null ? JSON.stringify(data) : null,
    })
        .then((response) => {
            if (!response) {
                // TODO
                new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: 'no_response' });
                return;
            }

            if (!response.ok) {
                // TODO
                new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: response ? response.statusText : '' });
                return;
            }

            // lỗi hệ thống k xử lý được?
            if (response.status === 299) {
                return response.json().then((err) => {
                    new Api().SubmitQLNhatKyLoi({ thoigian_loi: new Date().getTime(), noi_dung: err && err.message });
                    throw new Error(err && err.message);
                });
            }

            return response.blob();
        })
        .then((resdata) => {
            if (!resdata) {
                return;
            }
            // return console.log(resdata);
            const url = window.URL.createObjectURL(resdata);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('target', '_blank');
            link.setAttribute('download', data.file_name || fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        });
}

export default class Api {
    /********************************************************************** QUẢN TRỊ HỆ THỐNG *****************************************************************************************/
    // TODO Phân quyền / vai trò - phan_quyen_vai_tro_nguoi_dung
    ListPhanQuyen = async (data) => callAPI({ path: API_URI + 'phan_quyen_vai_tro_nguoi_dungs', method: 'POST', data: data });
    SubmitPhanQuyen = async (data) => callAPI({ path: API_URI + 'phan_quyen_vai_tro_nguoi_dung/upsert', method: 'POST', data: data });
    GetPhanQuyen = async (id) => callAPI({ path: API_URI + `phan_quyen_vai_tro_nguoi_dung/${id}`, method: 'GET' });
    DeletePhanQuyen = async (id) => callAPI({ path: API_URI + `phan_quyen_vai_tro_nguoi_dung/delete/${id}`, method: 'POST' });
    RemovePhanQuyen = async (id) => callAPI({ path: API_URI + `phan_quyen_vai_tro_nguoi_dung/remove/${id}`, method: 'POST' });
    RestorePhanQuyen = async (id) => callAPI({ path: API_URI + `phan_quyen_vai_tro_nguoi_dung/restore/${id}`, method: 'POST' });
    // TODO Tổ chức - thong_tin_don_vi
    ListToChuc = async (data) => callAPI({ path: API_URI + 'thong_tin_don_vis', method: 'POST', data: data });
    SubmitToChuc = async (data) => callAPI({ path: API_URI + 'thong_tin_don_vi/upsert', method: 'POST', data: data });
    GetToChuc = async (id) => callAPI({ path: API_URI + `thong_tin_don_vi/${id}`, method: 'GET' });
    DeleteToChuc = async (id) => callAPI({ path: API_URI + `thong_tin_don_vi/delete/${id}`, method: 'POST' });
    RemoveToChuc = async (id) => callAPI({ path: API_URI + `thong_tin_don_vi/remove/${id}`, method: 'POST' });
    RestoreToChuc = async (id) => callAPI({ path: API_URI + `thong_tin_don_vi/restore/${id}`, method: 'POST' });
    // TODO Chức vụ - thong_tin_chuc_vu
    ListChucVu = async (data) => callAPI({ path: API_URI + 'thong_tin_chuc_vus', method: 'POST', data: data });
    SubmitChucVu = async (data) => callAPI({ path: API_URI + 'thong_tin_chuc_vu/upsert', method: 'POST', data: data });
    GetChucVu = async (id) => callAPI({ path: API_URI + `thong_tin_chuc_vu/${id}`, method: 'GET' });
    DeleteChucVu = async (id) => callAPI({ path: API_URI + `thong_tin_chuc_vu/delete/${id}`, method: 'POST' });
    RemoveChucVu = async (id) => callAPI({ path: API_URI + `thong_tin_chuc_vu/remove/${id}`, method: 'POST' });
    RestoreChucVu = async (id) => callAPI({ path: API_URI + `thong_tin_chuc_vu/restore/${id}`, method: 'POST' });
    // TODO Chức năng - thong_tin_chuc_nang
    ListChucNang = async (data) => callAPI({ path: API_URI + 'thong_tin_chuc_nangs', method: 'POST', data: data });
    SubmitChucNang = async (data) => callAPI({ path: API_URI + 'thong_tin_chuc_nang/upsert', method: 'POST', data: data });
    GetChucNang = async (id) => callAPI({ path: API_URI + `thong_tin_chuc_nang/${id}`, method: 'GET' });
    DeleteChucNang = async (id) => callAPI({ path: API_URI + `thong_tin_chuc_nang/delete/${id}`, method: 'POST' });
    // TODO Vai trò - vai_tro_nguoi_dung
    ListVaiTro = async (data) => callAPI({ path: API_URI + 'vai_tro_nguoi_dungs', method: 'POST', data: data });
    SubmitVaiTro = async (data) => callAPI({ path: API_URI + 'vai_tro_nguoi_dung/upsert', method: 'POST', data: data });
    GetVaiTro = async (id) => callAPI({ path: API_URI + `vai_tro_nguoi_dung/${id}`, method: 'GET' });
    DeleteVaiTro = async (id) => callAPI({ path: API_URI + `vai_tro_nguoi_dung/delete/${id}`, method: 'POST' });
    RemoveVaiTro = async (id) => callAPI({ path: API_URI + `vai_tro_nguoi_dung/remove/${id}`, method: 'POST' });
    RestoreVaiTro = async (id) => callAPI({ path: API_URI + `vai_tro_nguoi_dung/restore/${id}`, method: 'POST' });
    // TODO Người dùng - thong_tin_nguoi_dung
    ListNguoiDung = async (data) => callAPI({ path: API_URI + 'thong_tin_nguoi_dungs', method: 'POST', data: data });
    SubmitNguoiDung = async (data) => callAPI({ path: API_URI + 'thong_tin_nguoi_dung/upsert', method: 'POST', data: data });
    GetNguoiDung = async (id) => callAPI({ path: API_URI + `thong_tin_nguoi_dung/${id}`, method: 'GET' });
    DeleteNguoiDung = async (id) => callAPI({ path: API_URI + `thong_tin_nguoi_dung/delete/${id}`, method: 'POST' });
    RemoveNguoiDung = async (id) => callAPI({ path: API_URI + `thong_tin_nguoi_dung/remove/${id}`, method: 'POST' });
    RestoreNguoiDung = async (id) => callAPI({ path: API_URI + `thong_tin_nguoi_dung/restore/${id}`, method: 'POST' });
    // TODO Giám sát truy cập - chan_truy_cap
    ListGiamSatTruyCap = async (data) => callAPI({ path: API_URI + 'chan_truy_caps', method: 'POST', data: data });
    SubmitGiamSatTruyCap = async (data) => callAPI({ path: API_URI + 'chan_truy_cap/upsert', method: 'POST', data: data });
    GetGiamSatTruyCap = async (id) => callAPI({ path: API_URI + `chan_truy_cap/${id}`, method: 'GET' });
    DeleteGiamSatTruyCap = async (id) => callAPI({ path: API_URI + `chan_truy_cap/delete/${id}`, method: 'POST' });
    RemoveGiamSatTruyCap = async (id) => callAPI({ path: API_URI + `chan_truy_cap/remove/${id}`, method: 'POST' });
    RestoreGiamSatTruyCap = async (id) => callAPI({ path: API_URI + `chan_truy_cap/restore/${id}`, method: 'POST' });
    // TODO Giám sát ip quản trị - giam_sat_thong_tin_ip_quan_tri
    ListGiamSatIPQuanTri = async (data) => callAPI({ path: API_URI + 'giam_sat_thong_tin_ip_quan_tris', method: 'POST', data: data });
    SubmitGiamSatIPQuanTri = async (data) => callAPI({ path: API_URI + 'giam_sat_thong_tin_ip_quan_tri/upsert', method: 'POST', data: data });
    GetGiamSatIPQuanTri = async (id) => callAPI({ path: API_URI + `giam_sat_thong_tin_ip_quan_tri/${id}`, method: 'GET' });
    DeleteGiamSatIPQuanTri = async (id) => callAPI({ path: API_URI + `giam_sat_thong_tin_ip_quan_tri/delete/${id}`, method: 'POST' });
    // TODO Dữ liệu sao lưu - dulieu_gannhan_saoluu
    ListDuLieuSaoLuu = async (data) => callAPI({ path: API_URI + 'dulieu_gannhan_saoluus', method: 'POST', data: data });
    SubmitDuLieuSaoLuu = async (data) => callAPI({ path: API_URI + 'dulieu_gannhan_saoluu/upsert', method: 'POST', data: data });
    GetDuLieuSaoLuu = async (id) => callAPI({ path: API_URI + `dulieu_gannhan_saoluu/${id}`, method: 'GET' });
    DeleteDuLieuSaoLuu = async (id) => callAPI({ path: API_URI + `dulieu_gannhan_saoluu/delete/${id}`, method: 'POST' });
    // TODO Sao lưu bảng dữ liệu - sao_luu_bang_du_lieu
    ListSaoLuuBangDuLieu = async (data) => callAPI({ path: API_URI + 'sao_luu_bang_du_lieus', method: 'POST', data: data });
    SubmitSaoLuuBangDuLieu = async (data) => callAPI({ path: API_URI + 'sao_luu_bang_du_lieu/upsert', method: 'POST', data: data });
    GetSaoLuuBangDuLieu = async (id) => callAPI({ path: API_URI + `sao_luu_bang_du_lieu/${id}`, method: 'GET' });
    DeleteSaoLuuBangDuLieu = async (id) => callAPI({ path: API_URI + `sao_luu_bang_du_lieu/delete/${id}`, method: 'POST' });
    ListBangDuLieu = async (data) => callAPI({ path: API_URI + `bangdulieus`, method: 'POST', data: data });
    BackupBangDuLieu = async (data, fileName) => callAPIDownloadFile({ path: API_URI + `sao_luu_bang_du_lieu-downloadfile`, method: 'POST', data: data, fileName: fileName });
    UploadBangDuLieu = async (data) => callAPI({ path: API_URI + `sao_luu_bang_du_lieu-uploadfile`, method: 'POST', data: data });
    // TODO Sao lưu cấu hình hệ thống - sao_luu_cau_hinh_he_thong
    ListSaoLuuCauHinhHeThong = async (data) => callAPI({ path: API_URI + 'sao_luu_cau_hinh_he_thongs', method: 'POST', data: data });
    SubmitSaoLuuCauHinhHeThong = async (data) => callAPI({ path: API_URI + 'sao_luu_cau_hinh_he_thong/upsert', method: 'POST', data: data });
    GetSaoLuuCauHinhHeThong = async (id) => callAPI({ path: API_URI + `sao_luu_cau_hinh_he_thong/${id}`, method: 'GET' });
    DeleteSaoLuuCauHinhHeThong = async (id) => callAPI({ path: API_URI + `sao_luu_cau_hinh_he_thong/delete/${id}`, method: 'POST' });
    BackupCauHinhHeThong = async (data, fileName) => callAPIDownloadFile({ path: API_URI + `sao_luu_cau_hinh_he_thong-downloadfile`, method: 'POST', data: data, fileName: fileName });
    UploadCauHinhHeThong = async (data) => callAPI({ path: API_URI + `sao_luu_cau_hinh_he_thong-uploadfile`, method: 'POST', data: data });
    // TODO Tải file - getfile
    GetFile = async (objectKey) => callExportFile({ path: API_URI + `getfile?objectKey=${objectKey}`, method: 'GET', fileName: objectKey.includes(',') ? objectKey.split('/')[0] + '.zip' : objectKey.split('/')[objectKey.split('/').length - 1] });
    // TODO Sao lưu tệp tin - sao_luu_tep_tin
    ListSaoLuuTepTin = async (data) => callAPI({ path: API_URI + 'sao_luu_tep_tins', method: 'POST', data: data });
    SubmitSaoLuuTepTin = async (data) => callAPI({ path: API_URI + 'sao_luu_tep_tin/upsert', method: 'POST', data: data });
    GetSaoLuuTepTin = async (id) => callAPI({ path: API_URI + `sao_luu_tep_tin/${id}`, method: 'GET' });
    DeleteSaoLuuTepTin = async (id) => callAPI({ path: API_URI + `sao_luu_tep_tin/delete/${id}`, method: 'POST' });
    ListThuMuc = async (data) => callAPI({ path: API_URI + `thumucs`, method: 'POST', data: data });
    ListTepTin = async (data) => callAPI({ path: API_URI + `teptins`, method: 'POST', data: data });
    // TODO Thiết lập cơ chế sao lưu - thiet_lap_co_che_sao_luu
    ListThietLapCoCheSaoLuu = async (data) => callAPI({ path: API_URI + 'thiet_lap_co_che_sao_luus', method: 'POST', data: data });
    SubmitThietLapCoCheSaoLuu = async (data) => callAPI({ path: API_URI + 'thiet_lap_co_che_sao_luu/upsert', method: 'POST', data: data });
    GetThietLapCoCheSaoLuu = async (id) => callAPI({ path: API_URI + `thiet_lap_co_che_sao_luu/${id}`, method: 'GET' });
    DeleteThietLapCoCheSaoLuu = async (id) => callAPI({ path: API_URI + `thiet_lap_co_che_sao_luu/delete/${id}`, method: 'POST' });
    /********************************************************************** QTHT - Quản lý nhật ký *******************************************************************************************/
    // TODO Nhật ký truy cập phần mềm - log_truycapphanmem
    ListQLNhatKyTruyCapPhanMem = async (data) => callAPI({ path: API_URI + 'log_truycapphanmems', method: 'POST', data: data });
    SubmitQLNhatKyTruyCapPhanMem = async (data) => callAPI({ path: API_URI + 'log_truycapphanmem/upsert', method: 'POST', data: data });
    GetQLNhatKyTruyCapPhanMem = async (id) => callAPI({ path: API_URI + `log_truycapphanmem/${id}`, method: 'GET' });
    DeleteQLNhatKyTruyCapPhanMem = async (id) => callAPI({ path: API_URI + `log_truycapphanmem/delete/${id}`, method: 'POST' });
    ThongKeQLNhatKyTruyCapPhanMem = async () => callAPI({ path: API_URI + `log_truycapphanmem/thongke`, method: 'GET' });
    // TODO Nhật ký các lỗi phát sinh trong quá trình hoạt động - log_ql_nhat_ky_loi
    ListQLNhatKyLoi = async (data) => callAPI({ path: API_URI + 'log_ql_nhat_ky_lois', method: 'POST', data: data });
    SubmitQLNhatKyLoi = async (data) => callAPI({ path: API_URI + 'log_ql_nhat_ky_loi/upsert', method: 'POST', data: data });
    GetQLNhatKyLoi = async (id) => callAPI({ path: API_URI + `log_ql_nhat_ky_loi/${id}`, method: 'GET' });
    DeleteQLNhatKyLoi = async (id) => callAPI({ path: API_URI + `log_ql_nhat_ky_loi/delete/${id}`, method: 'POST' });
    ThongKeQLNhatKyLoi = async () => callAPI({ path: API_URI + `log_ql_nhat_ky_loi/thongke`, method: 'GET' });
    ExportExcelQLNhatKyLoi = async ({ data, fileName = 'log_ql_nhat_ky_loi' }) => callExportFile({ path: API_URI + 'log_ql_nhat_ky_loi/export_excel', method: 'POST', data, fileName });
    // TODO Nhật ký quản lý người dùng - log_ql_nguoidung
    ListQLNhatKyNguoiDung = async (data) => callAPI({ path: API_URI + 'log_ql_nguoidungs', method: 'POST', data: data });
    SubmitQLNhatKyNguoiDung = async (data) => callAPI({ path: API_URI + 'log_ql_nguoidung/upsert', method: 'POST', data: data });
    GetQLNhatKyNguoiDung = async (id) => callAPI({ path: API_URI + `log_ql_nguoidung/${id}`, method: 'GET' });
    DeleteQLNhatKyNguoiDung = async (id) => callAPI({ path: API_URI + `log_ql_nguoidung/delete/${id}`, method: 'POST' });
    ThongKeQLNhatKyNguoiDung = async () => callAPI({ path: API_URI + `log_ql_nguoidung/thongke`, method: 'GET' });
    // TODO Nhật ký quản lý lập lịch - log_ql_laplich
    ListQLNhatKyLapLich = async (data) => callAPI({ path: API_URI + 'log_ql_laplichs', method: 'POST', data: data });
    SubmitQLNhatKyLapLich = async (data) => callAPI({ path: API_URI + 'log_ql_laplich/upsert', method: 'POST', data: data });
    GetQLNhatKyLapLich = async (id) => callAPI({ path: API_URI + `log_ql_laplich/${id}`, method: 'GET' });
    DeleteQLNhatKyLapLich = async (id) => callAPI({ path: API_URI + `log_ql_laplich/delete/${id}`, method: 'POST' });
    ThongKeQLNhatKyLapLich = async () => callAPI({ path: API_URI + `log_ql_laplich/thongke`, method: 'GET' });
    // TODO Nhật ký quản lý sự kiện - log_ql_sukien
    ListQLNhatKySuKien = async (data) => callAPI({ path: API_URI + 'log_ql_sukiens', method: 'POST', data: data });
    SubmitQLNhatKySuKien = async (data) => callAPI({ path: API_URI + 'log_ql_sukien/upsert', method: 'POST', data: data });
    GetQLNhatKySuKien = async (id) => callAPI({ path: API_URI + `log_ql_sukien/${id}`, method: 'GET' });
    DeleteQLNhatKySuKien = async (id) => callAPI({ path: API_URI + `log_ql_sukien/delete/${id}`, method: 'POST' });
    ThongKeQLNhatKySuKien = async () => callAPI({ path: API_URI + `log_ql_sukien/thongke`, method: 'GET' });
    // TODO Nhật ký tham gia phòng họp - log_ql_thamgiaphonghop
    ListQLNhatKyThamGiaPhongHop = async (data) => callAPI({ path: API_URI + 'log_ql_thamgiaphonghops', method: 'POST', data: data });
    SubmitQLNhatKyThamGiaPhongHop = async (data) => callAPI({ path: API_URI + 'log_ql_thamgiaphonghop/upsert', method: 'POST', data: data });
    GetQLNhatKyThamGiaPhongHop = async (id) => callAPI({ path: API_URI + `log_ql_thamgiaphonghop/${id}`, method: 'GET' });
    DeleteQLNhatKyThamGiaPhongHop = async (id) => callAPI({ path: API_URI + `log_ql_thamgiaphonghop/delete/${id}`, method: 'POST' });
    ThongKeQLNhatKyThamGiaPhongHop = async () => callAPI({ path: API_URI + `log_ql_thamgiaphonghop/thongke`, method: 'GET' });
    // TODO Nhật ký quản lý đăng ký dịch vụ - log_ql_dangkydichvu
    ListQLNhatKyDangKyDichVu = async (data) => callAPI({ path: API_URI + 'log_ql_dangkydichvus', method: 'POST', data: data });
    SubmitQLNhatKyDangKyDichVu = async (data) => callAPI({ path: API_URI + 'log_ql_dangkydichvu/upsert', method: 'POST', data: data });
    GetQLNhatKyDangKyDichVu = async (id) => callAPI({ path: API_URI + `log_ql_dangkydichvu/${id}`, method: 'GET' });
    DeleteQLNhatKyDangKyDichVu = async (id) => callAPI({ path: API_URI + `log_ql_dangkydichvu/delete/${id}`, method: 'POST' });
    ThongKeQLNhatKyDangKyDichVu = async () => callAPI({ path: API_URI + `log_ql_dangkydichvu/thongke`, method: 'GET' });
    ExportExcelQLNhatKyDangKyDichVu = async ({ data, fileName = 'log_ql_dangkydichvu' }) => callExportFile({ path: API_URI + 'log_ql_dangkydichvu/export_excel', method: 'POST', data, fileName });
    ExportWordQLNhatKyDangKyDichVu = async ({ data, fileName = 'log_ql_dangkydichvu' }) => callExportWordFile({ path: API_URI + 'log_ql_dangkydichvu/export_word', method: 'POST', data, fileName });
    // TODO Nhật ký đăng nhập - log_ql_dangnhap
    ListQLNhatKyDangNhap = async (data) => callAPI({ path: API_URI + 'log_ql_dangnhaps', method: 'POST', data: data });
    SubmitQLNhatKyDangNhap = async (data) => callAPI({ path: API_URI + 'log_ql_dangnhap/upsert', method: 'POST', data: data });
    GetQLNhatKyDangNhap = async (id) => callAPI({ path: API_URI + `log_ql_dangnhap/${id}`, method: 'GET' });
    DeleteQLNhatKyDangNhap = async (id) => callAPI({ path: API_URI + `log_ql_dangnhap/delete/${id}`, method: 'POST' });
    ThongKeQLNhatKyDangNhap = async () => callAPI({ path: API_URI + `log_ql_dangnhap/thongke`, method: 'GET' });
    ExportExcelQLNhatKyDangNhap = async ({ data, fileName = 'log_ql_dangnhap' }) => callExportFile({ path: API_URI + 'log_ql_dangnhap/export_excel', method: 'POST', data, fileName });
    /*******************************************************************************************************************************************/
    //TODO Quản lý máy chủ - may_chu
    ListMayChu = async (data) => callAPI({ path: API_URI + 'may_chu/list', method: 'POST', data: data });
    SubmitMayChu = async (data) => callAPI({ path: API_URI + 'may_chu/upsert', method: 'POST', data: data });
    GetMayChu = async (id) => callAPI({ path: API_URI + `may_chu/${id}`, method: 'GET' });
    DeleteMayChu = async (id) => callAPI({ path: API_URI + `may_chu/delete/${id}`, method: 'POST' });
    RemoveMayChu = async (id) => callAPI({ path: API_URI + `may_chu/remove/${id}`, method: 'POST' });
    RestoreMayChu = async (id) => callAPI({ path: API_URI + `may_chu/restore/${id}`, method: 'POST' });
    // TODO Thiết lập cấu hình kế hoạch - tl_ch_kehoach
    ListThietLapCauHinhKeHoach = async (data) => callAPI({ path: API_URI + 'tl_ch_kehoach/danhsach', method: 'GET', data: data });
    ListDeleteThietLapCauHinhKeHoach = async (data) => callAPI({ path: API_URI + 'tl_ch_kehoach/danhsachxoa', method: 'GET', data: data });
    DetailThietLapCauHinhKeHoach = async (id) => callAPI({ path: API_URI + `tl_ch_kehoach/chitiet?id=${id}`, method: 'GET' });
    AddThietLapCauHinhKeHoach = async () => callAPI({ path: API_URI + 'tl_ch_kehoach/them', method: 'POST' });
    EditThietLapCauHinhKeHoach = async (data) => callAPI({ path: API_URI + 'tl_ch_kehoach/sua', method: 'PUT', data: data });
    DeleteThietLapCauHinhKeHoach = async (id) => callAPI({ path: API_URI + `tl_ch_kehoach/xoa?id=${id}`, method: 'DELETE' });
    RestoreThietLapCauHinhKeHoach = async (id) => callAPI({ path: API_URI + `tl_ch_kehoach/khoiphuc?id=${id}`, method: 'PUT' });
    // TODO Thiết lập cấu hình chương trình - tl_ch_chuongtrinh
    ListThietLapCauHinhChuongTrinh = async (data) => callAPI({ path: API_URI + 'tl_ch_chuongtrinh/danhsach', method: 'GET', data: data });
    ListDeleteThietLapCauHinhChuongTrinh = async (data) => callAPI({ path: API_URI + 'tl_ch_chuongtrinh/danhsachxoa', method: 'GET', data: data });
    DetailThietLapCauHinhChuongTrinh = async (id) => callAPI({ path: API_URI + `tl_ch_chuongtrinh/chitiet?id=${id}`, method: 'GET' });
    AddThietLapCauHinhChuongTrinh = async () => callAPI({ path: API_URI + 'tl_ch_chuongtrinh/them', method: 'POST' });
    EditThietLapCauHinhChuongTrinh = async (data) => callAPI({ path: API_URI + 'tl_ch_chuongtrinh/sua', method: 'PUT', data: data });
    DeleteThietLapCauHinhChuongTrinh = async (id) => callAPI({ path: API_URI + `tl_ch_chuongtrinh/xoa?id=${id}`, method: 'DELETE' });
    RestoreThietLapCauHinhChuongTrinh = async (id) => callAPI({ path: API_URI + `tl_ch_chuongtrinh/khoiphuc?id=${id}`, method: 'PUT' });
    // TODO Thiết lập cấu hình tài liệu họp - tl_ch_tailieuhop
    ListThietLapCauHinhTaiLieuHop = async (data) => callAPI({ path: API_URI + 'tl_ch_tailieuhop/danhsach', method: 'GET', data: data });
    ListDeleteThietLapCauHinhTaiLieuHop = async (data) => callAPI({ path: API_URI + 'tl_ch_tailieuhop/danhsachxoa', method: 'GET', data: data });
    DetailThietLapCauHinhTaiLieuHop = async (id) => callAPI({ path: API_URI + `tl_ch_tailieuhop/chitiet?id=${id}`, method: 'GET' });
    AddThietLapCauHinhTaiLieuHop = async () => callAPI({ path: API_URI + 'tl_ch_tailieuhop/them', method: 'POST' });
    EditThietLapCauHinhTaiLieuHop = async (data) => callAPI({ path: API_URI + 'tl_ch_tailieuhop/sua', method: 'PUT', data: data });
    DeleteThietLapCauHinhTaiLieuHop = async (id) => callAPI({ path: API_URI + `tl_ch_tailieuhop/xoa?id=${id}`, method: 'DELETE' });
    RestoreThietLapCauHinhTaiLieuHop = async (id) => callAPI({ path: API_URI + `tl_ch_tailieuhop/khoiphuc?id=${id}`, method: 'PUT' });
    // TODO Thiết lập cấu hình thành phần tham gia - tl_ch_thanhphanthamgia
    ListThietLapCauHinhThanhPhanThamGia = async (data) => callAPI({ path: API_URI + 'tl_ch_thanhphanthamgia/danhsach', method: 'GET', data: data });
    ListDeleteThietLapCauHinhThanhPhanThamGia = async (data) => callAPI({ path: API_URI + 'tl_ch_thanhphanthamgia/danhsachxoa', method: 'GET', data: data });
    DetailThietLapCauHinhThanhPhanThamGia = async (id) => callAPI({ path: API_URI + `tl_ch_thanhphanthamgia/chitiet?id=${id}`, method: 'GET' });
    AddThietLapCauHinhThanhPhanThamGia = async () => callAPI({ path: API_URI + 'tl_ch_thanhphanthamgia/them', method: 'POST' });
    EditThietLapCauHinhThanhPhanThamGia = async (data) => callAPI({ path: API_URI + 'tl_ch_thanhphanthamgia/sua', method: 'PUT', data: data });
    DeleteThietLapCauHinhThanhPhanThamGia = async (id) => callAPI({ path: API_URI + `tl_ch_thanhphanthamgia/xoa?id=${id}`, method: 'DELETE' });
    RestoreThietLapCauHinhThanhPhanThamGia = async (id) => callAPI({ path: API_URI + `tl_ch_thanhphanthamgia/khoiphuc?id=${id}`, method: 'PUT' });
    // TODO Thiết lập cấu hình biểu quyết - tl_ch_bieuquyet
    ListThietLapCauHinhBieuQuyet = async (data) => callAPI({ path: API_URI + 'tl_ch_bieuquyet/danhsach', method: 'GET', data: data });
    ListDeleteThietLapCauHinhBieuQuyet = async (data) => callAPI({ path: API_URI + 'tl_ch_bieuquyet/danhsachxoa', method: 'GET', data: data });
    DetailThietLapCauHinhBieuQuyet = async (id) => callAPI({ path: API_URI + `tl_ch_bieuquyet/chitiet?id=${id}`, method: 'GET' });
    AddThietLapCauHinhBieuQuyet = async () => callAPI({ path: API_URI + 'tl_ch_bieuquyet/them', method: 'POST' });
    EditThietLapCauHinhBieuQuyet = async (data) => callAPI({ path: API_URI + 'tl_ch_bieuquyet/sua', method: 'PUT', data: data });
    DeleteThietLapCauHinhBieuQuyet = async (id) => callAPI({ path: API_URI + `tl_ch_bieuquyet/xoa?id=${id}`, method: 'DELETE' });
    RestoreThietLapCauHinhBieuQuyet = async (id) => callAPI({ path: API_URI + `tl_ch_bieuquyet/khoiphuc?id=${id}`, method: 'PUT' });
    // TODO Thiết lập cấu hình báo cáo thống kê - tl_ch_baocaothongke
    ListThietLapCauHinhBaoCaoThongKe = async (data) => callAPI({ path: API_URI + 'tl_ch_baocaothongke/danhsach', method: 'GET', data: data });
    ListDeleteThietLapCauHinhBaoCaoThongKe = async (data) => callAPI({ path: API_URI + 'tl_ch_baocaothongke/danhsachxoa', method: 'GET', data: data });
    DetailThietLapCauHinhBaoCaoThongKe = async (id) => callAPI({ path: API_URI + `tl_ch_baocaothongke/chitiet?id=${id}`, method: 'GET' });
    AddThietLapCauHinhBaoCaoThongKe = async () => callAPI({ path: API_URI + 'tl_ch_baocaothongke/them', method: 'POST' });
    EditThietLapCauHinhBaoCaoThongKe = async (data) => callAPI({ path: API_URI + 'tl_ch_baocaothongke/sua', method: 'PUT', data: data });
    DeleteThietLapCauHinhBaoCaoThongKe = async (id) => callAPI({ path: API_URI + `tl_ch_baocaothongke/xoa?id=${id}`, method: 'DELETE' });
    RestoreThietLapCauHinhBaoCaoThongKe = async (id) => callAPI({ path: API_URI + `tl_ch_baocaothongke/khoiphuc?id=${id}`, method: 'PUT' });
    // TODO Thiết lập cấu hình sự kiện - tl_ch_sukien
    ListThietLapCauHinhSuKien = async (data) => callAPI({ path: API_URI + 'tl_ch_sukien/danhsach', method: 'GET', data: data });
    ListDeleteThietLapCauHinhSuKien = async (data) => callAPI({ path: API_URI + 'tl_ch_sukien/danhsachxoa', method: 'GET', data: data });
    DetailThietLapCauHinhSuKien = async (id) => callAPI({ path: API_URI + `tl_ch_sukien/chitiet?id=${id}`, method: 'GET' });
    AddThietLapCauHinhSuKien = async () => callAPI({ path: API_URI + 'tl_ch_sukien/them', method: 'POST' });
    EditThietLapCauHinhSuKien = async (data) => callAPI({ path: API_URI + 'tl_ch_sukien/sua', method: 'PUT', data: data });
    DeleteThietLapCauHinhSuKien = async (id) => callAPI({ path: API_URI + `tl_ch_sukien/xoa?id=${id}`, method: 'DELETE' });
    RestoreThietLapCauHinhSuKien = async (id) => callAPI({ path: API_URI + `tl_ch_sukien/khoiphuc?id=${id}`, method: 'PUT' });
    // TODO Thiết lập cấu hình người dùng - tl_ch_nguoidung
    ListThietLapCauHinhNguoiDung = async (data) => callAPI({ path: API_URI + 'tl_ch_nguoidung/danhsach', method: 'GET', data: data });
    ListDeleteThietLapCauHinhNguoiDung = async (data) => callAPI({ path: API_URI + 'tl_ch_nguoidung/danhsachxoa', method: 'GET', data: data });
    DetailThietLapCauHinhNguoiDung = async (id) => callAPI({ path: API_URI + `tl_ch_nguoidung/chitiet?id=${id}`, method: 'GET' });
    AddThietLapCauHinhNguoiDung = async () => callAPI({ path: API_URI + 'tl_ch_nguoidung/them', method: 'POST' });
    EditThietLapCauHinhNguoiDung = async (data) => callAPI({ path: API_URI + 'tl_ch_nguoidung/sua', method: 'PUT', data: data });
    DeleteThietLapCauHinhNguoiDung = async (id) => callAPI({ path: API_URI + `tl_ch_nguoidung/xoa?id=${id}`, method: 'DELETE' });
    RestoreThietLapCauHinhNguoiDung = async (id) => callAPI({ path: API_URI + `tl_ch_nguoidung/khoiphuc?id=${id}`, method: 'PUT' });
    // TODO Thiết lập cấu hình hệ thống - tl_ch_hethong
    ListThietLapCauHinhHeThong = async (data) => callAPI({ path: API_URI + 'tl_ch_hethong/danhsach', method: 'GET', data: data });
    ListDeleteThietLapCauHinhHeThong = async (data) => callAPI({ path: API_URI + 'tl_ch_hethong/danhsachxoa', method: 'GET', data: data });
    DetailThietLapCauHinhHeThong = async (id) => callAPI({ path: API_URI + `tl_ch_hethong/chitiet?id=${id}`, method: 'GET' });
    AddThietLapCauHinhHeThong = async () => callAPI({ path: API_URI + 'tl_ch_hethong/them', method: 'POST' });
    EditThietLapCauHinhHeThong = async (data) => callAPI({ path: API_URI + 'tl_ch_hethong/sua', method: 'PUT', data: data });
    DeleteThietLapCauHinhHeThong = async (id) => callAPI({ path: API_URI + `tl_ch_hethong/xoa?id=${id}`, method: 'DELETE' });
    RestoreThietLapCauHinhHeThong = async (id) => callAPI({ path: API_URI + `tl_ch_hethong/khoiphuc?id=${id}`, method: 'PUT' });
    // TODO Quản lý thông tin cấu hình dịch vụ sms - tl_ch_dichvusms
    ListThietLapCauHinhDichVuSms = async (data) => callAPI({ path: API_URI + 'tl_ch_dichvusms/danhsach', method: 'GET', data: data });
    ListDeleteThietLapCauHinhDichVuSms = async (data) => callAPI({ path: API_URI + 'tl_ch_dichvusms/danhsachxoa', method: 'GET', data: data });
    DetailThietLapCauHinhDichVuSms = async (id) => callAPI({ path: API_URI + `tl_ch_dichvusms/chitiet?id=${id}`, method: 'GET' });
    AddThietLapCauHinhDichVuSms = async () => callAPI({ path: API_URI + 'tl_ch_dichvusms/them', method: 'POST' });
    EditThietLapCauHinhDichVuSms = async (data) => callAPI({ path: API_URI + 'tl_ch_dichvusms/sua', method: 'PUT', data: data });
    DeleteThietLapCauHinhDichVuSms = async (id) => callAPI({ path: API_URI + `tl_ch_dichvusms/xoa?id=${id}`, method: 'DELETE' });
    RestoreThietLapCauHinhDichVuSms = async (id) => callAPI({ path: API_URI + `tl_ch_dichvusms/khoiphuc?id=${id}`, method: 'PUT' });
    // TODO Thiết lập thông báo lịch họp - tl_ch_thongbaolichhop
    ListThietLapCauHinhThongBaoLichHop = async (data) => callAPI({ path: API_URI + 'tl_ch_thongbaolichhop/danhsach', method: 'GET', data: data });
    ListDeleteThietLapCauHinhThongBaoLichHop = async (data) => callAPI({ path: API_URI + 'tl_ch_thongbaolichhop/danhsachxoa', method: 'GET', data: data });
    DetailThietLapCauHinhThongBaoLichHop = async (id) => callAPI({ path: API_URI + `tl_ch_thongbaolichhop/chitiet?id=${id}`, method: 'GET' });
    AddThietLapCauHinhThongBaoLichHop = async () => callAPI({ path: API_URI + 'tl_ch_thongbaolichhop/them', method: 'POST' });
    EditThietLapCauHinhThongBaoLichHop = async (data) => callAPI({ path: API_URI + 'tl_ch_thongbaolichhop/sua', method: 'PUT', data: data });
    DeleteThietLapCauHinhThongBaoLichHop = async (id) => callAPI({ path: API_URI + `tl_ch_thongbaolichhop/xoa?id=${id}`, method: 'DELETE' });
    RestoreThietLapCauHinhThongBaoLichHop = async (id) => callAPI({ path: API_URI + `tl_ch_thongbaolichhop/khoiphuc?id=${id}`, method: 'PUT' });
    // TODO Thiết lập lịch họp - tl_ch_lichhop
    ListThietLapCauHinhLichHop = async (data) => callAPI({ path: API_URI + 'tl_ch_lichhop/danhsach', method: 'GET', data: data });
    ListDeleteThietLapCauHinhLichHop = async (data) => callAPI({ path: API_URI + 'tl_ch_lichhop/danhsachxoa', method: 'GET', data: data });
    DetailThietLapCauHinhLichHop = async (id) => callAPI({ path: API_URI + `tl_ch_lichhop/chitiet?id=${id}`, method: 'GET' });
    AddThietLapCauHinhLichHop = async () => callAPI({ path: API_URI + 'tl_ch_lichhop/them', method: 'POST' });
    EditThietLapCauHinhLichHop = async (data) => callAPI({ path: API_URI + 'tl_ch_lichhop/sua', method: 'PUT', data: data });
    DeleteThietLapCauHinhLichHop = async (id) => callAPI({ path: API_URI + `tl_ch_lichhop/xoa?id=${id}`, method: 'DELETE' });
    RestoreThietLapCauHinhLichHop = async (id) => callAPI({ path: API_URI + `tl_ch_lichhop/khoiphuc?id=${id}`, method: 'PUT' });
    // TODO Thiết lập thời gian chờ - tl_ch_thoigiancho
    ListThietLapCauHinhThoiGianCho = async (data) => callAPI({ path: API_URI + 'tl_ch_thoigiancho/danhsach', method: 'GET', data: data });
    ListDeleteThietLapCauHinhThoiGianCho = async (data) => callAPI({ path: API_URI + 'tl_ch_thoigiancho/danhsachxoa', method: 'GET', data: data });
    DetailThietLapCauHinhThoiGianCho = async (id) => callAPI({ path: API_URI + `tl_ch_thoigiancho/chitiet?id=${id}`, method: 'GET' });
    AddThietLapCauHinhThoiGianCho = async () => callAPI({ path: API_URI + 'tl_ch_thoigiancho/them', method: 'POST' });
    EditThietLapCauHinhThoiGianCho = async (data) => callAPI({ path: API_URI + 'tl_ch_thoigiancho/sua', method: 'PUT', data: data });
    DeleteThietLapCauHinhThoiGianCho = async (id) => callAPI({ path: API_URI + `tl_ch_thoigiancho/xoa?id=${id}`, method: 'DELETE' });
    RestoreThietLapCauHinhThoiGianCho = async (id) => callAPI({ path: API_URI + `tl_ch_thoigiancho/khoiphuc?id=${id}`, method: 'PUT' });
    //TODO Kiểm tra, kết thúc phiên và yêu cầu đăng nhập lại -

    //TODO

    //TODO - kiểm tra thông tin người dùng vào trang
    CheckThongTinCanBo = async () => callAPI({ path: API_URI + 'thong_tin_nguoi_dung_byToken', method: 'GET' });
    PhanQuyenVaiTroNguoiDung = async () => callAPI({ path: API_URI + 'phan_quyen_vai_tro_nguoi_dung/quyen_nguoi_dung', method: 'GET' });
}
