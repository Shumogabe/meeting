import queryString from "query-string";
import { SESSION_STORAGE, href_be_qtht } from "../config";
import Api from ".";

var CurrentUser = null;
export function setCurrentUser(user) {
  CurrentUser = user;
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization:
      "Bearer " +
      JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' https://trusted.cdn.com; img-src 'self' https://trusted.cdn.com; style-src 'self' 'unsafe-inline'; frame-ancestors 'none';",
    "X-Frame-Options": "DENY",
  };
}

export function callAPI({ method, path, data }) {
  if (method !== "GET" && method !== "DELETE" && method !== "PUT") {
    method = "POST";
  }

  if (method === "GET") {
    const qr = queryString.stringify({ ...data });
    if (qr !== "") {
      path = path + "?" + qr;
    }
    data = null;
  }

  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      new api2().SubmitQLNhatKyLoi({
        thoigian_loi: new Date().getTime(),
        noi_dung: "Hết thời gian yêu cầu máy chủ",
      });
      return resolve({
        code: 408,
        data: "Hết thời gian yêu cầu máy chủ",
        type: "error",
      });
    }, 30000);

    const resfunc = (response) => {
      clearTimeout(timeoutId);

      if (!response) {
        new api2().SubmitQLNhatKyLoi({
          thoigian_loi: new Date().getTime(),
          noi_dung: "no_response",
        });
        return resolve({ code: 503, message: "no_response", type: "error" });
      }

      if (!response.ok && response.status === 500) {
        return response.text().then((msg) => {
          // ThongBao({ code: response.status, message: msg, type: 'warning' });
          resolve({ code: response.status, message: msg, type: "error" });
        });
      }

      if (!response.ok && response.status === 401) {
        return response.text().then((msg) => {
          // ThongBao({ code: response.status, message: msg, type: 'warning' });
          resolve({ code: response.status, message: msg, type: "error" });
        });
      }

      if (!response.ok) {
        new api2().SubmitQLNhatKyLoi({
          thoigian_loi: new Date().getTime(),
          noi_dung: response ? response.statusText : "",
        });
        // ThongBao({ code: response.status, message: response ? response.statusText : '', type: 'warning' });
        return resolve({
          code: response.status,
          message: response ? response.statusText : "",
          type: "error",
        });
      }

      // lỗi hệ thống k xử lý được?
      if (response.status === 299) {
        return response.text().then((msg) => {
          new api2().SubmitQLNhatKyLoi({
            thoigian_loi: new Date().getTime(),
            noi_dung: msg,
          });
          // ThongBao({ code: response.status, message: msg, type: 'warning' });
          resolve({ code: response.status, message: msg, type: "warning" });
        });
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      }

      return response.text();
    };

    const errfunc = (err) => {
      console.error(err);
      clearTimeout(timeoutId);
      new api2().SubmitQLNhatKyLoi({
        thoigian_loi: new Date().getTime(),
        noi_dung: "Quá thời gian",
      });
      return resolve({ code: 500, message: "Quá thời gian", type: "error" });
    };

    fetch(path, {
      method: method,
      mode: "cors",
      headers: getHeaders(),
      body: data !== null ? JSON.stringify(data) : null,
    })
      .then(resfunc, errfunc)
      .then((resdata) => {
        if (!resdata) {
          // TODO throw new Error(MESSAGE.cscore_tnn_ERROR);
          return resolve({ code: 200, data: [], type: "success" });
        }

        // console.info("APIService successful at ", resdata);
        if (resdata.code) {
          return resdata;
        }

        return resolve({ code: 200, data: resdata, type: "success" });
      });
  });
}

export class api2 {
  SubmitQLNhatKyLoi = async (data) =>
    callAPI({
      path: href_be_qtht + "api/htt_qtht/log_ql_nhat_ky_loi/upsert",
      method: "POST",
      data: data,
    });
}
