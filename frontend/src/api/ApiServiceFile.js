/*
 *  @2019 Cs-core project
 *
 */

import message from "../components/Message";
import { HREF, MESSAGE } from "../constants/dictionaries";
import { ErrorHandlingLS } from "../lightState/ErrorHandling";
import { add as addLoading } from "../lightState/Loader";
import Log from "../services/log";
import { getCCU } from "./ccuServices";

import {
  API_CORE_URI,
  API_DMS_URI,
  API_SPATIAL_URI,
  API_TNN_URI,
} from "../config";
import { SwalAlertAllConfiguration } from "../components/Swal";
import Helper from "../helper/helper";

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

export default class APIService {
  constructor({ token, ccuConfig }) {
    this.baseUri = baseUri || "";
    this.credentials = token && token.length > 0 ? token : null;
    this.ccuConfig = ccuConfig;
    this.headersBuilderDownload = (newToken) => {
      const token = newToken || this.credentials;
      const headers = token
        ? {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            "Content-Security-Policy":
              "default-src 'self'; script-src 'self' https://trusted.cdn.com; img-src 'self' https://trusted.cdn.com; style-src 'self' 'unsafe-inline';frame-ancestors 'none';",
          }
        : {
            "Content-Type": "application/json",
            "Content-Security-Policy":
              "default-src 'self'; script-src 'self' https://trusted.cdn.com; img-src 'self' https://trusted.cdn.com; style-src 'self' 'unsafe-inline';frame-ancestors 'none';",
          };
      if (process.env.NODE_ENV !== "development") {
        delete headers["Ocp-Apim-Subscription-Key"];
      }
      return headers;
    };
    this.headersBuilderUpload = (newToken) => {
      const token = newToken || this.credentials;
      const headers = { Authorization: "Bearer " + token };
      if (process.env.NODE_ENV !== "development") {
        delete headers["Ocp-Apim-Subscription-Key"];
      }
      return headers;
    };
  }
  callAPIUploadFile({
    method,
    path,
    data,
    isRequestAfterRefreshToken = false,
    newToken = null,
    project = "cscore",
  }) {
    const removeLoading = addLoading();
    let body = data;
    if (this.ccuConfig && this.ccuConfig.get) {
      let ccuData = getCCU(this.ccuConfig.get);
      body = { ...body, ...ccuData };
    }
    switch (project) {
      case "cscore.tnn":
        path = API_TNN_URI + path;
        break;
      case "cscore.dms":
        path = API_DMS_URI + path;
        break;
      case "cscore.spatial":
        path = API_SPATIAL_URI + path;
        break;
      case "others":
        path = path;
        break;
      default:
        path = baseUri + path;
    }
    return fetch(path, {
      method: method,
      headers: this.headersBuilderUpload(newToken),
      body: data,
    })
      .then((response) => {
        removeLoading();
        if (!response) {
          ErrorHandlingLS.setState({
            error: {
              message: "Server maintaine.",
              ErrorCode: 503,
              status: 503,
              statusText: `HttpException[${method}]`,
            },
          });
        }
        // if response is ok transform response.text to json object
        // else throw error
        if (response.ok) {
          if (response.status === 299) {
            return response.json().then((err) => {
              throw new Error(err && err.message);
            });
          }
          return response.json();
        } else if (response.status === 401) {
          // throw new Error(MESSAGE.cscore_tnn_ERROR)
          message.error(MESSAGE.cscore_tnn_ERROR);
          // TODO: handle logout
        } else if (response.status === 500) {
          // throw new Error(MESSAGE.cscore_tnn_ERROR)
          message.error(MESSAGE.cscore_tnn_ERROR);
          // TODO: handle logout
        } else {
          // throw new Error(MESSAGE.cscore_tnn_ERROR)
          message.error(MESSAGE.cscore_tnn_ERROR);
        }
      })
      .then((jsonData) => {
        if (!jsonData) {
          // throw new Error(MESSAGE.cscore_tnn_ERROR);
        } else {
          /*TODO: Concurrent users*/
          new Log().info("APIService successful at ", jsonData);
          return jsonData;
        }
      })
      .catch((e) => console.log(e));
  }

  callAPIDownloadFile({
    method,
    path,
    data,
    fileName,
    isRequestAfterRefreshToken = false,
    newToken = null,
    project = "cscore",
    isdownload,
  }) {
    const removeLoading = addLoading();
    let body = data;
    if (this.ccuConfig && this.ccuConfig.get) {
      let ccuData = getCCU(this.ccuConfig.get);
      body = { ...body, ...ccuData };
    }

    switch (project) {
      case "cscore.tnn":
        path = API_TNN_URI + path;
        break;
      case "cscore.dms":
        path = API_DMS_URI + path;
        break;
      case "cscore.spatial":
        path = API_SPATIAL_URI + path;
        break;
      case "others":
        path = path;
        break;
      default:
        path = baseUri + path;
    }
    var downFile = true;
    if (data && data.filename) {
      var ls = data.filename.split(".");
      if (ls && ls.length > 0 && ls[ls.length - 1].toUpperCase() === "PDF")
        downFile = false;
    }
    if (fileName && !data && isdownload === false) {
      var ls = fileName.split(".");
      if (
        ls &&
        ls.length > 0 &&
        // ls[ls.length - 1].toUpperCase() === "DOCX" ||
        // // ls[ls.length - 1].toUpperCase() === "XLSX" ||
        // // ls[ls.length - 1].toUpperCase() === "XSLX" ||
        // ls[ls.length - 1].toUpperCase() === "WEBM" ||
        ls[ls.length - 1].toUpperCase() === "PDF"
      )
        downFile = false;
    }
    try {
      if (downFile) {
        return fetch(path, {
          method: method,
          headers: this.headersBuilderDownload(newToken),
          responseType: "blob",
          body: data !== null ? JSON.stringify(body) : null,
        })
          .then((response) => {
            removeLoading();
            if (!response) {
              ErrorHandlingLS.setState({
                error: {
                  message: "Server maintaine.",
                  ErrorCode: 503,
                  status: 503,
                  statusText: `HttpException[${method}]`,
                },
              });
            }
            // if response is ok transform response.text to json object
            // else throw error
            if (response.ok) {
              if (response.status === 299) {
                return response.json().then((err) => {
                  throw new Error(err && err.message);
                });
              }
              return response.blob();
            } else if (response.status === 401) {
              message.error(MESSAGE.cscore_tnn_ERROR);
              // TODO: handle logout
            } else if (response.status === 500) {
              // throw new Error(MESSAGE.cscore_tnn_ERROR)
              // response.json().then(err => {
              //     message.error(err.mess);
              // })
              message.error(MESSAGE.cscore_tnn_ERROR);

              // TODO: handle logout
            } else {
              message.error(MESSAGE.cscore_tnn_ERROR);
            }
          })
          .then((blob) => {
            if (!blob) {
              // throw new Error(MESSAGE.cscore_tnn_ERROR);
              // message.error(MESSAGE.cscore_tnn_ERROR)
            } else {
              /*TODO: Concurrent users*/
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute(
                "download",
                fileName ? fileName : data.filename
              );
              document.body.appendChild(link);
              link.click();
              // Clean up: revoke the object URL and remove the link element
              document.body.removeChild(link); // Remove the link from the document
              window.URL.revokeObjectURL(url); // Revoke the object URL
            }
          });
      } else {
        return fetch(path, {
          method: method,
          headers: this.headersBuilderDownload(newToken),
          responseType: "blob",
          body: data !== null ? JSON.stringify(body) : null,
        })
          .then((response) => {
            removeLoading();
            if (!response) {
              ErrorHandlingLS.setState({
                error: {
                  message: "Server maintaine.",
                  ErrorCode: 503,
                  status: 503,
                  statusText: `HttpException[${method}]`,
                },
              });
            }
            // if response is ok transform response.text to json object
            // else throw error
            if (response.ok) {
              if (response.status === 299) {
                return response.json().then((err) => {
                  throw new Error(err && err.message);
                });
              }
              return response.arrayBuffer();
            } else if (response.status === 401) {
              message.error(MESSAGE.cscore_tnn_ERROR);
              // TODO: handle logout
            } else if (response.status === 500) {
              // message.error(MESSAGE.cscore_tnn_ERROR);
              SwalAlertAllConfiguration({
                title: "Thông báo",
                text: `Không tìm thấy tệp tin`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Thoát",
                showConfirmButton: false,
                timer: 3000,
                dangerMode: true,
              });
              // TODO: handle logout
            } else {
              SwalAlertAllConfiguration({
                title: "Thông báo",
                text: `Không tìm thấy tệp tin`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Thoát",
                showConfirmButton: false,
                timer: 3000,
                dangerMode: true,
              });
            }
          })
          .then((buffer) => {
            if (!buffer) {
              // throw new Error(MESSAGE.cscore_tnn_ERROR);
            } else {
              /*TODO: Concurrent users*/
              var blob2 = new Blob([buffer], {
                type:
                  fileName.split(".").length > 1 &&
                  fileName
                    .split(".")
                    [fileName.split(".").length - 1].toLowerCase() === "pdf" &&
                  "application/pdf",
              });
              var blobURL = URL.createObjectURL(blob2);
              if (Helper.getBrowserInfo() === "Apple Safari") {
                window.location.href =
                  window.location.origin +
                  HREF.XemTaiLieu +
                  "?uri=" +
                  blobURL +
                  "&type=" +
                  fileName
                    .split(".")
                    [fileName.split(".").length - 1].toLowerCase() +
                  "&fileName=" +
                  (fileName ? fileName : data.filename);
              } else {
                window.open(
                  window.location.origin +
                    HREF.XemTaiLieu +
                    "?uri=" +
                    blobURL +
                    "&type=" +
                    fileName
                      .split(".")
                      [fileName.split(".").length - 1].toLowerCase() +
                    "&fileName=" +
                    (fileName ? fileName : data.filename)
                );
              }
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  postDataDown({ path, data, project, fileName }) {
    return this.callAPIDownloadFile({
      path,
      method: "POST",
      data,
      fileName,
      project,
    });
  }
  postDataUp({ path, data, project }) {
    return this.callAPIUploadFile({
      path,
      method: "POST",
      data,
      project,
    });
  }
  getDataDown({ path, data, project, fileName, isdownload }) {
    return this.callAPIDownloadFile({
      path,
      method: "GET",
      data,
      fileName,
      project,
      isdownload,
    });
  }
}
