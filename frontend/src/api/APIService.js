/*
 *  @2019 Cs-core project
 *
 */

import queryString from "query-string";
import message from "../components/Message";
import { ErrorHandlingLS } from "../lightState/ErrorHandling";
import { add as addLoading } from "../lightState/Loader";
import Log from "../services/log";
import { cachingMiddleware } from "./CachingMiddleware";
import { getCCU } from "./ccuServices";

import Api from ".";
import { HandleLogout } from "../components/Modal";
import { SwalAlertAllConfiguration } from "../components/Swal";
import { API_CORE_URI, SESSION_STORAGE } from "../config";
const baseUri = API_CORE_URI;

export class HttpException extends Error {
  constructor({ message, status, statusText, url, ErrorCode, data } = {}) {
    super(message);
    this.pureMessage = message;
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.ErrorCode = ErrorCode;
    this.data = data;
  }
}

function throwError(status, method) {
  const _err = {
    message: "Internal server error.",
    ErrorCode: status,
    status: status,
    statusText: `HttpException[${method}]`,
  };
  ErrorHandlingLS.setState({ error: _err });
  throw new HttpException({ ..._err });
}

function throwError404(status, method) {
  const _err = {
    message: "Internal server error.",
    ErrorCode: status,
    status: status,
    statusText: `HttpException[${method}]`,
  };
  ErrorHandlingLS.setState({ error: _err });
  throw new HttpException({ ..._err });
}

export default class APIService {
  constructor({ token, ccuConfig }) {
    var check_login = JSON.parse(sessionStorage.getItem(SESSION_STORAGE));
    this.baseUri = baseUri || "";
    this.credentials = token && token.length > 0 ? token : null;
    this.ccuConfig = ccuConfig;
    this.headersBuilder = (newToken) => {
      const token = newToken || this.credentials;
      const headers = token
        ? {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            "Content-Security-Policy":
              "default-src 'self'; script-src 'self' https://trusted.cdn.com; img-src 'self' https://trusted.cdn.com; style-src 'self' 'unsafe-inline'; frame-ancestors 'none';",
            "X-Frame-Options": "DENY",
          }
        : {
            "Content-Type": "application/json",
            "Content-Security-Policy":
              "default-src 'self'; script-src 'self' https://trusted.cdn.com; img-src 'self' https://trusted.cdn.com; style-src 'self' 'unsafe-inline'; frame-ancestors 'none';",
            "X-Frame-Options": "DENY",
          };
      if (process.env.NODE_ENV !== "development") {
        delete headers["Ocp-Apim-Subscription-Key"];
      }
      return headers;
    };
  }

  callAPI({
    method,
    path,
    data,
    isRefreshTokenApi = false,
    isRequestAfterRefreshToken = false,
    newToken = null,
  }) {
    const removeLoading = addLoading();
    let body = data;
    if (this.ccuConfig && this.ccuConfig.get) {
      let ccuData = getCCU(this.ccuConfig.get);
      body = { ...body, ...ccuData };
    }
    return fetch(this.baseUri + path, {
      method: method,
      mode: "cors",
      headers: this.headersBuilder(newToken),
      body: data !== null ? JSON.stringify(body) : null,
    })
      .then((response) => {
        removeLoading();
        if (!response) {
          new Api().log_ql_nhat_ky_loi({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            data: {
              thoigian_loi: new Date().getTime(),
              noi_dung: "Server maintaine. " + `HttpException[${method}]`,
            },
          });
          ErrorHandlingLS.setState({
            error: {
              message: "Server maintaine.",
              ErrorCode: 503,
              status: 503,
              statusText: `HttpException[${method}]`,
            },
          });
          return;
        }
        // if response is ok transform response.text to json object
        // else throw error
        if (response.status === 299) {
          return response.json().then((err) => {
            //console.log(err);
            new Api().log_ql_nhat_ky_loi({
              token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                ?.access_token,
              data: {
                thoigian_loi: new Date().getTime(),
                noi_dung: err && err.message,
              },
            });
            return SwalAlertAllConfiguration({
              title: "Thông báo",
              text: `${err && err.message}`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Đồng ý",
              cancelButtonText: "Thoát",
              showConfirmButton: false,
              timer: 3000,
              dangerMode: true,
            });
            // message.error(err && err.message);
            // throw new Error(err && err.message);
          });
        }
        if (response.ok && response.status !== 299) {
          return response.json();
        } else if (response.status === 401) {
          return SwalAlertAllConfiguration({
            title: "Bạn cần đăng nhập để thực hiện chức năng này",
            text: "Bạn chưa đăng nhập hoặc phiên đăng nhập của bạn đã hết. Nhấn 'Đồng ý' để chuyển đến trang đăng nhập!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Thoát",
            showLoaderOnConfirm: true,
            dangerMode: true,
          }).then((result) => {
            if (result.isConfirmed) {
              HandleLogout("login");
            } else {
              // new Api().log_ql_nhat_ky_loi({
              //   token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              //     ?.access_token,
              //   data: {
              //     thoigian_loi: new Date().getTime(),
              //     noi_dung: "Có lỗi xảy ra (401)",
              //   },
              // });
              message.error("Bạn cần đăng nhập để thực hiện chức năng này");
              return false;
            }
          });
        } else if (response.status === 500) {
          return response.json().then((err) => {
            new Api().log_ql_nhat_ky_loi({
              token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                ?.access_token,
              data: {
                thoigian_loi: new Date().getTime(),
                noi_dung: err && err.message,
              },
            });
            return SwalAlertAllConfiguration({
              title: "Thông báo",
              text: `Không kết nối được dịch vụ, vui lòng liên hệ quản trị hệ thống`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Đồng ý",
              cancelButtonText: "Thoát",
              showConfirmButton: false,
              timer: 3000,
              dangerMode: true,
            });
          });
        } else {
          new Api().log_ql_nhat_ky_loi({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            data: {
              thoigian_loi: new Date().getTime(),
              noi_dung: "Có lỗi xảy ra ()",
            },
          });
          SwalAlertAllConfiguration({
            title: "Thông báo",
            text: `Không kết nối được dịch vụ, vui lòng liên hệ quản trị hệ thống`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Thoát",
            showConfirmButton: false,
            timer: 3000,
            dangerMode: true,
          });
          return;
        }
      })
      .then((jsonData) => {
        if (!jsonData) {
          // throw new Error("Something went wrong.");
        }
        /*TODO: Concurrent users*/
        new Log().info("APIService successful at ", jsonData);
        return jsonData;
      });
  }

  getData({ path, data = {}, caching = false, cacheTime = 30000 }) {
    const paramsString = queryString.stringify({
      ...data,
    });

    const fullpath = path + (paramsString === "" ? "" : "?" + paramsString);
    if (caching) {
      return cachingMiddleware({
        pathName: fullpath,
        fetchApi: () =>
          this.callAPI({ method: "GET", path: fullpath, data: null }),
        expireTime: cacheTime,
      });
    }
    return this.callAPI({ method: "GET", path: fullpath, data: null });
  }

  deleteData({ path, data }) {
    return this.callAPI({
      path,
      method: "DELETE",
      data,
    });
  }

  postData({ path, data, isRefreshTokenApi }) {
    return this.callAPI({
      path,
      method: "POST",
      data,
      isRefreshTokenApi,
    });
  }

  putData({ path, data }) {
    return this.callAPI({
      path,
      method: "PUT",
      data,
    });
  }
}
