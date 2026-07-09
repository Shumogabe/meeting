import moment from "moment";
import { DATETIME } from "../config";
/**
 * Lấy thời gian tại thời điểm hiện tại
 * @returns
 */
export function getDate(format) {
  //return moment().format("DD-MM-YYYY hh:mm:ss");
  //alert(CONFIG.DEFAULT_FORMAT_DATETIME);
  return moment().format(DATETIME.FORMAT.DDMMYYYY + " hh:mm:ss");
}
/**
 * Trả về thời gian mốc 01-01-1970
 * @param {*} format
 * @returns 01-01-1970 00:00:00 AM
 */
export function getNullDate(format) {
  return formatDate(DATETIME.NULL, format);
}
/**
 * Định dạng thời gian "DD-MM-YYYY, hh:mm A"
 *
 * @returns
 */
export function formatDateTime(value) {
  //return moment().format("DD-MM-YYYY hh:mm:ss");
  //alert(CONFIG.DEFAULT_FORMAT_DATETIME);
  return moment(value).format(DATETIME.FORMAT.DDMMYYYY_HHMMSS);
}
/**
 * Định dạng thời gian
 * @param {*} value
 * @param {*} format DD/MM/YYYY || MM/DD/YYYY
 * @returns
 */
export function formatDate(value, format) {
  if (value == null) return getNullDate(format);
  let date = new Date(value);
  let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let hours = ("0" + date.getHours()).slice(-2);
  let minutes = ("0" + date.getMinutes()).slice(-2);
  let seconds = ("0" + date.getSeconds()).slice(-2);
  let newdate = [day, mnth, date.getFullYear()].join("-");
  let newtime = [hours, minutes, seconds].join(":");
  switch (format) {
    case DATETIME.FORMAT.MMDDYYYY:
      newdate = [mnth, day, date.getFullYear()].join("-");
      return newdate;
      break;
    case DATETIME.FORMAT.MMDDYYYY_HHMMSS:
      newdate = [mnth, day, date.getFullYear()].join("-");
      return [newdate, newtime].join(" ");
      break;
    case DATETIME.FORMAT.DDMMYYYY:
      return newdate;
      break;
    case DATETIME.FORMAT.DDMMYYYY_HHMMSS:
      return [newdate, newtime].join(" ");
      break;
    default:
      return [newdate, newtime].join(" ");
  }
}
export function formatTimeOnly(value, format) {
  if (value == null) return getNullDate(format);
  let date = new Date(value);
  let hours = ("0" + date.getHours()).slice(-2);
  let minutes = ("0" + date.getMinutes()).slice(-2);
  let seconds = ("0" + date.getSeconds()).slice(-2);
  return [hours, minutes, seconds].join(":");
}
export function formatDateOnly(value, format) {
  if (value == null) return getNullDate(format);
  let date = new Date(value);
  let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let newdate = [day, mnth, date.getFullYear()].join("-");
  switch (format) {
    case DATETIME.FORMAT.MMDDYYYY:
      newdate = [mnth, day, date.getFullYear()].join("-");
      return newdate;
      break;
    case DATETIME.FORMAT.DDMMYYYY:
    default:
      return newdate;
      break;
  }
}
/**
   * Date.UTC(year)
        Date.UTC(year, month)
        Date.UTC(year, month, day)
        Date.UTC(year, month, day, hour)
        Date.UTC(year, month, day, hour, minute)
        Date.UTC(year, month, day, hour, minute, second)
        Date.UTC(year, month, day, hour, minute, second, millisecond)
   * 
   * @param {dd-mm-yyyy hh:mm:ss} datetime 
   */
export function convertUtcDatetime(datetime) {
  if (!datetime) return null;
  let date = datetime.split(" ")[0].split("-");
  let time = datetime.split(" ")[1].split(":");
  return new Date(Date.UTC(date[2], date[1] - 1, date[0], time[0], time[1]));
}
/**
 *
 * @param {*} datetime
 * @returns
 */
export function convertLocalDatetime(datetime) {
  if (!datetime) return null;
  let date = datetime.split(" ")[0].split("-");
  let time = datetime.split(" ")[1].split(":");
  return new Date(
    Date.UTC(date[2], date[1] - 1, date[0], time[0] - 7, time[1])
  );
}
/**
 *
 * @param {*} datetime
 * @returns
 */
export function formatDayOfWeek(datetime, index) {
  if (!datetime) {
    switch (index) {
      case 0 || "Monday":
        return "Thứ 2";
      case 1 || "Tuesday":
        return "Thứ 3";
      case 2 || "Wednesday":
        return "Thứ 4";
      case 3 || "Thursday":
        return "Thứ 5";
      case 4 || "Friday":
        return "Thứ 6";
      case 5 || "Saturday":
        return "Thứ 7";
      case 6 || "Sunday":
        return "Chủ nhật";
      default:
        return "Chủ nhật";
    }
  } else if (datetime === index) {
    switch (index) {
      case "Monday":
        return "Thứ 2";
      case "Tuesday":
        return "Thứ 3";
      case "Wednesday":
        return "Thứ 4";
      case "Thursday":
        return "Thứ 5";
      case "Friday":
        return "Thứ 6";
      case "Saturday":
        return "Thứ 7";
      case "Sunday":
        return "Chủ nhật";
      default:
        return "Chủ nhật";
    }
  } else {
    switch (new Date(datetime).getDay()) {
      case 1 || "Monday":
        return "Thứ 2";
      case 2 || "Tuesday":
        return "Thứ 3";
      case 3 || "Wednesday":
        return "Thứ 4";
      case 4 || "Thursday":
        return "Thứ 5";
      case 5 || "Friday":
        return "Thứ 6";
      case 6 || "Saturday":
        return "Thứ 7";
      case 0 || "Sunday":
        return "Chủ nhật";
      default:
        return "Chủ nhật";
    }
  }
}
/**
 *
 * @param {*} datetime
 * @param {*} state
 * @returns
 */
export function dayOfWeek(datetime) {
  let arr = [];
  var d = new Date(datetime);
  var day = d.getDay();
  var diff = d.getDate() - day + (day === 0 ? -6 : 1);
  for (let i = diff; i < diff + 7; i++) {
    d = new Date(datetime);
    arr.push(new Date(d.setDate(i)));
  }
  return arr;
}

export function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}
