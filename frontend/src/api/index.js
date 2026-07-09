/*
 *  @2019 CS-Core project.
 *
 */

import { href_be_qtht } from "../config";
import APIService from "./APIService";
import { callAPI } from "./APIServiceQTHT";
import APIServiceFile from "./ApiServiceFile";
export default class Api {
  //TODO: SCHEDULE MEETING
  get_all_schedule = async ({ token } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingSchedule/GetAll",
    });
  };
  get_schedule_byId = async ({ token, id } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingSchedule/GetById?id=" + id,
    });
  };
  get_schedule_byTitle = async ({ token, title } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingSchedule/GetByTitle?title=" + title,
    });
  };
  get_schedule_byUserId = async ({
    token,
    id,
    keySearch,
    header,
    dateFrom,
    dateTo,
    start,
    isdeleted,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path:
        "meeting/MeetingSchedule/GetByUserId?create=" +
        id +
        "&search=" +
        keySearch +
        "&dateFrom=" +
        dateFrom +
        "&dateTo=" +
        dateTo +
        "&start=" +
        start +
        "&isdeleted=" +
        isdeleted,
      header: header,
    });
  };
  get_schedule_byUserIdFilter = async ({
    token,
    id,
    keySearch,
    header,
    dateFrom,
    dateTo,
    status,
    start,
    isdeleted,
    page,
    pageSize,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path:
        "meeting/MeetingSchedule/GetByUserIdFilter?page=" +
        page +
        "&pageSize=" +
        pageSize +
        "&create=" +
        id +
        "&search=" +
        keySearch +
        "&dateFrom=" +
        dateFrom +
        "&dateTo=" +
        dateTo +
        "&status=" +
        status +
        "&start=" +
        start +
        "&isdeleted=" +
        isdeleted,
      header: header,
    });
  };
  get_schedule_byUserIdFilterMonre = async ({
    token,
    id,
    keySearch,
    header,
    dateFrom,
    dateTo,
    status,
    start,
    isdeleted,
    page,
    pageSize,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path:
        "meeting/MeetingSchedule/GetByUserIdFilterMonre?page=" +
        page +
        "&pageSize=" +
        pageSize +
        "&create=" +
        id +
        "&search=" +
        keySearch +
        "&dateFrom=" +
        dateFrom +
        "&dateTo=" +
        dateTo +
        "&status=" +
        status +
        "&start=" +
        start +
        "&isdeleted=" +
        isdeleted,
      header: header,
    });
  };
  get_schedule_byStatus = async ({
    token,
    id,
    keySearch,
    header,
    dateFrom,
    dateTo,
    status,
    start,
    isdeleted,
    page,
    pageSize,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path:
        "meeting/MeetingSchedule/GetAllByStatus?page=" +
        page +
        "&pageSize=" +
        pageSize +
        "&create=" +
        id +
        "&search=" +
        keySearch +
        "&dateFrom=" +
        dateFrom +
        "&dateTo=" +
        dateTo +
        "&status=" +
        status +
        "&start=" +
        start +
        "&isdeleted=" +
        isdeleted,
      header: header,
    });
  };
  get_schedule_byTypeId = async ({
    token,
    keySearch,
    header,
    dateFrom,
    dateTo,
    status,
    start,
    isdeleted,
    page,
    pageSize,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path:
        "meeting/MeetingSchedule/GetByUserIdTypeId?page=" +
        page +
        "&pageSize=" +
        pageSize +
        "&search=" +
        keySearch +
        "&dateFrom=" +
        dateFrom +
        "&dateTo=" +
        dateTo +
        "&status=" +
        status +
        "&start=" +
        start +
        "&isdeleted=" +
        isdeleted,
      header: header,
    });
  };
  get_schedule_byUserIdDay = async ({ token, id, day, header } = {}) => {
    return new APIService({ token: token }).getData({
      path:
        "meeting/MeetingSchedule/GetByUserIdDay?create=" + id + "&day=" + day,
      header: header,
    });
  };
  get_all_schedule_delete = async ({ token, header } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingSchedule/GetAllDeleted",
      header: header,
    });
  };
  get_schedule_byRoomName = async ({ token, room } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingSchedule/GetByRoomName?roomname=" + room,
    });
  };
  get_RoomName = async ({ token } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingSchedule/GenerateUniqueRoomNameSchedule",
    });
  };
  create_meeting_schedule = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSchedule/Insert",
      data: data,
      header: header,
    });
  };
  schedule_status = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSchedule/Status?id=" + id,
      data: data,
      header: header,
    });
  };
  schedule_start = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSchedule/Start?id=" + id,
      data: data,
      header: header,
    });
  };
  schedule_isLobby = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSchedule/IsLobby?id=" + id,
      data: data,
      header: header,
    });
  };
  schedule_isPublished = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSchedule/IsPublished?id=" + id,
      data: data,
      header: header,
    });
  };
  schedule_delete = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSchedule/Delete?id=" + id,
      data: data,
      header: header,
    });
  };
  schedule_restore = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSchedule/Restore?id=" + id,
      data: data,
      header: header,
    });
  };
  schedule_remove = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSchedule/Remove?id=" + id,
      header: header,
    });
  };
  schedule_shareRole = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSchedule/ShareRole?id=" + id,
      data: data,
      header: header,
    });
  };
  schedule_chairMan = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSchedule/ChairMan?id=" + id,
      data: data,
      header: header,
    });
  };
  edit_meeting_schedule_password = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSchedule/UpdatePassword?id=" + id,
      data: data,
      header: header,
    });
  };
  edit_meeting_schedule = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSchedule/Update?id=" + id,
      data: data,
      header: header,
    });
  };

  //TODO: SCHEDULE
  get_Other_byPersonalId = async ({ token, id, name, header } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/Schedule/GetOtherByPersonalId?id=" + id + "&name=" + name,
      header: header,
    });
  };
  get_schedule_byName = async ({ token, name } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/Schedule/GetByName?name=" + name,
    });
  };

  //TODO: Plan MEETING
  getListPlanScheduleDraft = async ({
    token,
    page,
    pageSize,
    create,
    search,
    dateFrom,
    dateTo,
    isdeleted,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path:
        "meeting/MeetingPlan/ListPlanScheduleDraft?page=" +
        page +
        "&pageSize=" +
        pageSize +
        "&create=" +
        create +
        "&search=" +
        search +
        "&dateFrom=" +
        dateFrom +
        "&dateTo=" +
        dateTo +
        "&isdeleted=" +
        isdeleted,
    });
  };
  getListPlanUnapproved = async ({
    token,
    page,
    pageSize,
    create,
    search,
    dateFrom,
    dateTo,
    isdeleted,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path:
        "meeting/MeetingPlan/ListPlanUnapproved?page=" +
        page +
        "&pageSize=" +
        pageSize +
        "&create=" +
        create +
        "&search=" +
        search +
        "&dateFrom=" +
        dateFrom +
        "&dateTo=" +
        dateTo +
        "&isdeleted=" +
        isdeleted,
    });
  };
  getListPlanScheduleUnapproved = async ({
    token,
    page,
    pageSize,
    create,
    search,
    dateFrom,
    dateTo,
    isdeleted,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path:
        "meeting/MeetingPlan/ListPlanScheduleUnapproved?page=" +
        page +
        "&pageSize=" +
        pageSize +
        "&create=" +
        create +
        "&search=" +
        search +
        "&dateFrom=" +
        dateFrom +
        "&dateTo=" +
        dateTo +
        "&isdeleted=" +
        isdeleted,
    });
  };
  getListPlanApproved = async ({
    token,
    page,
    pageSize,
    create,
    search,
    dateFrom,
    dateTo,
    isdeleted,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path:
        "meeting/MeetingPlan/ListPlanApproved?page=" +
        page +
        "&pageSize=" +
        pageSize +
        "&create=" +
        create +
        "&search=" +
        search +
        "&dateFrom=" +
        dateFrom +
        "&dateTo=" +
        dateTo +
        "&isdeleted=" +
        isdeleted,
    });
  };
  getListPlanScheduleApproved = async ({
    token,
    page,
    pageSize,
    create,
    search,
    dateFrom,
    dateTo,
    isdeleted,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path:
        "meeting/MeetingPlan/ListPlanScheduleApproved?page=" +
        page +
        "&pageSize=" +
        pageSize +
        "&create=" +
        create +
        "&search=" +
        search +
        "&dateFrom=" +
        dateFrom +
        "&dateTo=" +
        dateTo +
        "&isdeleted=" +
        isdeleted,
    });
  };
  getListPlanScheduleDeleted = async ({
    token,
    page,
    pageSize,
    create,
    search,
    dateFrom,
    dateTo,
    isdeleted,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path:
        "meeting/MeetingPlan/ListPlanScheduleDeleted?page=" +
        page +
        "&pageSize=" +
        pageSize +
        "&create=" +
        create +
        "&search=" +
        search +
        "&dateFrom=" +
        dateFrom +
        "&dateTo=" +
        dateTo +
        "&isdeleted=" +
        isdeleted,
    });
  };
  getPlanScheduleDetail = async ({ token, id } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingPlan/GetPlanScheduleDetail?id=" + id,
    });
  };
  getPlanScheduleId = async ({ token, id } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingPlan/GetPlanScheduleId?id=" + id,
    });
  };
  getPlanByTitle = async ({ token, symbol } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingPlan/GetPlanBySymbol?symbol=" + symbol,
    });
  };
  insertPlanSchedule = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingPlan/InsertPlanSchedule",
      data: data,
      header: header,
    });
  };
  updatePlanSchedule = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).putData({
      path: "meeting/MeetingPlan/UpdatePlanSchedule?id=" + id,
      data: data,
      header: header,
    });
  };
  approvePlanSchedule = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingPlan/ApprovePlanSchedule?id=" + id,
      header: header,
    });
  };
  unApprovePlanSchedule = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingPlan/UnApprovePlanSchedule?id=" + id,
      header: header,
    });
  };
  draftPlanSchedule = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingPlan/DraftPlanSchedule?id=" + id,
      header: header,
    });
  };
  restorePlanSchedule = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingPlan/Restore?id=" + id,
      header: header,
    });
  };
  isPublishedPlanSchedule = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingPlan/IsPublished?id=" + id,
      header: header,
    });
  };
  deletePlanSchedule = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).deleteData({
      path: "meeting/MeetingPlan/Delete?id=" + id,
      header: header,
    });
  };
  removePlanSchedule = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).deleteData({
      path: "meeting/MeetingPlan/Remove?id=" + id,
      header: header,
    });
  };

  //TODO: OPTION
  get_all_option = async ({ token, strSearch, dateFrom, dateTo } = {}) => {
    return new APIService({ token: token }).getData({
      path:
        "meeting/MeetingOption/GetAll?strSearch=" +
        strSearch +
        "&dateFrom=" +
        dateFrom +
        "&dateTo=" +
        dateTo,
    });
  };
  get_option_byId = async ({ token, id } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingOption/GetById?id=" + id,
    });
  };
  get_option_byKey = async ({ token, key } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingOption/GetByKey?key=" + key,
    });
  };
  create_meeting_option = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingOption/Insert",
      data: data,
      header: header,
    });
  };
  option_delete = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingOption/Delete?id=" + id,
      data: data,
      header: header,
    });
  };
  get_all_option_delete = async ({ token, header } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingOption/GetAllDeleted",
      header: header,
    });
  };
  option_remove = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingOption/Remove?id=" + id,
      header: header,
    });
  };
  option_status = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingOption/Status?id=" + id,
      data: data,
      header: header,
    });
  };
  edit_meeting_option = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingOption/Update?id=" + id,
      data: data,
      header: header,
    });
  };

  //TODO: SUPPORT
  get_all_Support = async ({ token, strSearch, dateFrom, dateTo } = {}) => {
    return new APIService({ token: token }).getData({
      path:
        "meeting/MeetingSupport/GetAll?strSearch=" +
        strSearch +
        "&dateFrom=" +
        dateFrom +
        "&dateTo=" +
        dateTo,
    });
  };
  get_Support_byId = async ({ token, id } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingSupport/GetById?id=" + id,
    });
  };
  get_Support_byKey = async ({ token, key } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingSupport/GetByKey?key=" + key,
    });
  };
  create_meeting_Support = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSupport/them",
      data: data,
      header: header,
    });
  };
  Support_delete = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSupport/Delete?id=" + id,
      data: data,
      header: header,
    });
  };
  get_all_Support_delete = async ({ token, header } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingSupport/GetAllDeleted",
      header: header,
    });
  };
  Support_remove = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSupport/Remove?id=" + id,
      header: header,
    });
  };
  Support_status = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSupport/Status?id=" + id,
      data: data,
      header: header,
    });
  };
  edit_meeting_Support = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSupport/Update?id=" + id,
      data: data,
      header: header,
    });
  };

  //TODO: MEMBER
  get_member_byScheduleId = async ({ token, id } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingMember/GetByScheduleId?id=" + id,
    });
  };
  get_schedule_byInside = async ({ token, id, pageSize, pageNumber } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingMember/GetByScheduleIdInside",
      data: { id, pageSize, pageNumber },
    });
  };
  get_schedule_byOutside = async ({ token, id, pageSize, pageNumber } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingMember/GetByScheduleIdOutside",
      data: { id, pageSize, pageNumber },
    });
  };
  get_schedule_danhsachthanhvien = async ({ token, id, search } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingMember/danhsachthanhvien",
      data: { id, search },
    });
  };
  create_meeting_member = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingMember/Insert",
      data: data,
      header: header,
    });
  };
  remove_meeting_member = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingMember/Remove?id=" + id,
      header: header,
    });
  };
  activated_meeting_member = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).putData({
      path: "meeting/MeetingMember/Activated?id=" + id,
      header: header,
    });
  };
  deactivated_meeting_member = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).putData({
      path: "meeting/MeetingMember/Deactivated?id=" + id,
      header: header,
    });
  };

  //TODO: CONTENT
  get_content_byScheduleId = async ({
    token,
    id,
    header,
    pageSize,
    pageNumber,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingContent/GetByScheduleId",
      data: { id, pageNumber, pageSize },
      header: header,
    });
  };
  create_meeting_content = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingContent/Insert",
      data: data,
      header: header,
    });
  };
  edit_meeting_content = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingContent/Update?id=" + id,
      data: data,
      header: header,
    });
  };
  sendapprove_meeting_content = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingContent/SendApprove?id=" + id,
      header: header,
    });
  };
  unsendapprove_meeting_content = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingContent/UnSendApprove?id=" + id,
      header: header,
    });
  };
  approve_meeting_content = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingContent/Approve?id=" + id,
      header: header,
    });
  };
  unapprove_meeting_content = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingContent/UnApprove?id=" + id,
      header: header,
    });
  };
  delete_content = async ({ token, id } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingContent/Delete?id=" + id,
    });
  };
  remove_content = async ({ token, id } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingContent/Remove?id=" + id,
    });
  };
  restore_content = async ({ token, id } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingContent/Restore?id=" + id,
    });
  };

  //TODO: TYPE
  get_all_meetingType = async ({ token } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingType/GetAll",
    });
  };
  get_meetingType_byId = async ({ token, id } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingType/GetById?id=" + id,
    });
  };
  create_meetingType = async ({ token, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingType/Insert",
      data: data,
    });
  };
  update_meetingType = async ({ token, data, id } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingType/Update?id=" + id,
      data: data,
    });
  };
  delete_meetingType = async ({ token, id } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingType/Remove?id=" + id,
    });
  };

  //TODO: SERVER
  get_all_meetingServer = async ({ token } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingServer/GetAll",
    });
  };
  get_meetingServer_byDefault = async ({ token } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingServer/GetByDefault",
    });
  };
  get_all_filter_meetingServer = async ({ token, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingServer/GetAllFilter",
      data: data,
    });
  };
  get_meetingServer_byId = async ({ token, id } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingServer/GetById?id=" + id,
    });
  };
  create_meetingServer = async ({ token, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingServer/Insert",
      data: data,
    });
  };
  update_meetingServer = async ({ token, data, id } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingServer/Update?id=" + id,
      data: data,
    });
  };
  delete_meetingServer = async ({ token, id } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingServer/Remove?id=" + id,
    });
  };

  //TODO: DOCUMENT
  get_document_byScheduleId = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingDocument/GetByScheduleId?id=" + id,
      header: header,
    });
  };
  get_document_byFileUrl = async ({
    token,
    url,
    header,
    pageSize,
    pageNumber,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingDocument/GetByFileUrl",
      data: { url, pageNumber, pageSize },
      header: header,
    });
  };
  meeting_document_upload = async ({ token, id, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingDocument/Upload?scheduleId=" + id,
      data: data,
    });
  };
  create_meeting_document = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingDocument/Insert",
      data: data,
      header: header,
    });
  };
  create_meeting_document_with_approve = async ({
    token,
    data,
    header,
  } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingDocument/InsertApprove",
      data: data,
      header: header,
    });
  };
  create_meeting_document_without = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingDocument/InsertWithoutCreatedby",
      data: data,
      header: header,
    });
  };
  update_meeting_document = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).putData({
      path: "meeting/MeetingDocument/Update",
      data: data,
      header: header,
    });
  };
  unsendapprove_meeting_document = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).putData({
      path: "meeting/MeetingDocument/UnSendApprove?id=" + id,
      header: header,
    });
  };
  sendapprove_meeting_document = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).putData({
      path: "meeting/MeetingDocument/SendApprove?id=" + id,
      header: header,
    });
  };
  approve_meeting_document = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).putData({
      path: "meeting/MeetingDocument/Approve?id=" + id,
      header: header,
    });
  };
  unapprove_meeting_document = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).putData({
      path: "meeting/MeetingDocument/UnApprove?id=" + id,
      header: header,
    });
  };
  remove_document = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingDocument/Remove?id=" + id,
      header: header,
    });
  };
  restore_document = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingDocument/Restore?id=" + id,
      header: header,
    });
  };
  delete_document = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingDocument/Delete?id=" + id,
      header: header,
    });
  };

  //TODO: VOTES
  get_votes_byScheduleId = async ({
    token,
    id,
    search,
    header,
    pageSize,
    pageNumber,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingVotes/GetByScheduleId",
      data: { id, pageSize, pageNumber, search },
      header: header,
    });
  };
  get_votes_byId = async ({ token, id } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingVotes/GetById?id=" + id,
    });
  };
  get_meeting_votes_byTitle = async ({ token, title, scheduleid } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingVotes/GetByTitle",
      data: { title, scheduleid },
    });
  };
  create_meeting_votes = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVotes/Insert",
      data: data,
      header: header,
    });
  };
  edit_meeting_votes = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVotes/Update?id=" + id,
      data: data,
      header: header,
    });
  };
  meeting_votes_status = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVotes/Status?id=" + id,
      data: data,
      header: header,
    });
  };
  meeting_votes_end = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVotes/End?id=" + id,
      data: data,
      header: header,
    });
  };
  delete_meeting_votes = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVotes/Delete?id=" + id,
      header: header,
    });
  };
  remove_meeting_votes = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVotes/Remove?id=" + id,
      header: header,
    });
  };
  restore_meeting_votes = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVotes/Restore?id=" + id,
      header: header,
    });
  };

  //TODO: VOTED
  get_voted_byScheduleId = async ({ token, id } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingVoted/GetByScheduleId?id=" + id,
    });
  };
  get_voted_byVoteId = async ({ token, id } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingVoted/GetByVoteId?voteid=" + id,
    });
  };
  get_voted_byVoteIdCreatedBy = async ({ token, voteid } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingVoted/GetByVoteIdCreatedBy?voteid=" + voteid,
    });
  };
  create_meeting_voted = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVoted/Insert",
      data: data,
      header: header,
    });
  };
  creates_meeting_voted = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVoted/InsertList",
      data: data,
      header: header,
    });
  };
  create_meeting_vote = async ({ token, data, header, voteid } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVoted/Vote?voteid=" + voteid,
      data: data,
      header: header,
    });
  };
  chart_meeting_vote = async ({ token, header, voteid } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingVoted/GetByVoteIdChart?voteid=" + voteid,
      header: header,
    });
  };
  edit_meeting_voted = async ({ token, id, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVoted/Update?id=" + id,
      data: data,
      header: header,
    });
  };
  remove_meeting_voted = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVoted/Remove?id=" + id,
      header: header,
    });
  };
  remove_meeting_voted_by_voteid = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVoted/RemoveByVoteId?id=" + id,
      header: header,
    });
  };

  //TODO: SENDMAIL
  meeting_mail_sendMail = async ({ token, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingSendMail/SendMail",
      data: data,
    });
  };

  //TODO: ROOM
  // room_token = async ({ token, data } = {}) => {
  //   return new APIService({ token: token }).postData({
  //     path: "meeting/MeetingRoom/Token",
  //     data: data,
  //   });
  // };
  // room_test_token = async ({ token } = {}) => {
  //   return new APIService({ token: token }).getData({
  //     path: "meeting/Room/TestToken",
  //   });
  // };

  //Meeting Whiteboard
  get_whiteboard_byScheduleId = async ({ token, id } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingWhiteboard/GetByScheduleId?id=" + id,
    });
  };
  create_meeting_whiteboard = async ({ token, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingWhiteboard/Insert",
      data: data,
    });
  };
  update_meeting_whiteboard = async ({ token, id, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingWhiteboard/Update?id=" + id,
      data: data,
    });
  };
  remove_meeting_whiteboard = async ({ token, id } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingWhiteboard/Remove?id=" + id,
    });
  };

  //TODO: CHAT
  get_chat_byScheduleId = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingChat/GetByScheduleId?id=" + id,
      header: header,
    });
  };
  get_chat_byFileUrl = async ({ token, url, header } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingChat/GetByFileUrl?url=" + url,
      header: header,
    });
  };
  meeting_chat_upload = async ({ token, id, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingChat/Upload?scheduleId=" + id,
      data: data,
    });
  };
  create_meeting_chat = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingChat/Insert",
      data: data,
      header: header,
    });
  };
  create_meeting_chat_without = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingChat/InsertWithoutCreatedby",
      data: data,
      header: header,
    });
  };
  update_meeting_chat = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).putData({
      path: "meeting/MeetingChat/Update",
      data: data,
      header: header,
    });
  };
  approve_meeting_chat = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).putData({
      path: "meeting/MeetingChat/Approve",
      data: data,
      header: header,
    });
  };
  unapprove_meeting_chat = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).putData({
      path: "meeting/MeetingChat/UnApprove",
      data: data,
      header: header,
    });
  };
  remove_chat = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingChat/Remove?id=" + id,
      header: header,
    });
  };
  restore_chat = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingChat/Restore?id=" + id,
      header: header,
    });
  };
  delete_chat = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingChat/Delete?id=" + id,
      header: header,
    });
  };

  //TODO: VIDEO
  get_video_byScheduleId = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingVideo/GetByScheduleId?id=" + id,
      header: header,
    });
  };
  get_video_byFileUrl = async ({
    token,
    search,
    url,
    header,
    pageNumber,
    pageSize,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingVideo/GetByFileUrl",
      data: { url, search, pageNumber, pageSize },
      header: header,
    });
  };
  meeting_video_upload = async ({ token, id, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVideo/Upload?scheduleId=" + id,
      data: data,
    });
  };
  create_meeting_video = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVideo/Insert",
      data: data,
      header: header,
    });
  };
  create_meeting_video_without = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVideo/InsertWithoutCreatedby",
      data: data,
      header: header,
    });
  };
  update_meeting_video = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).putData({
      path: "meeting/MeetingVideo/Update",
      data: data,
      header: header,
    });
  };
  approve_meeting_video = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).putData({
      path: "meeting/MeetingVideo/Approve",
      data: data,
      header: header,
    });
  };
  unapprove_meeting_video = async ({ token, data, header } = {}) => {
    return new APIService({ token: token }).putData({
      path: "meeting/MeetingVideo/UnApprove",
      data: data,
      header: header,
    });
  };
  remove_video = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVideo/Remove?id=" + id,
      header: header,
    });
  };
  restore_video = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVideo/Restore?id=" + id,
      header: header,
    });
  };
  delete_video = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingVideo/Delete?id=" + id,
      header: header,
    });
  };

  //TODO: CONSLUSION
  get_Conslusion_byScheduleId = async ({
    token,
    id,
    search,
    pageNumber,
    pageSize,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: "meeting/MeetingConslusion/GetByScheduleId",
      data: { id, search, pageNumber, pageSize },
    });
  };
  create_meeting_Conslusion = async ({ token, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingConslusion/Insert",
      data: data,
    });
  };
  unsendapprove_meeting_conslusion = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).putData({
      path: "meeting/MeetingConslusion/UnSendApprove?id=" + id,
      header: header,
    });
  };
  sendapprove_meeting_conslusion = async ({ token, id, header } = {}) => {
    return new APIService({ token: token }).putData({
      path: "meeting/MeetingConslusion/SendApprove?id=" + id,
      header: header,
    });
  };
  approve_meeting_Conslusion = async ({ token, id } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingConslusion/Approve?id=" + id,
    });
  };
  unapprove_meeting_Conslusion = async ({ token, id } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingConslusion/UnApprove?id=" + id,
    });
  };
  update_meeting_Conslusion = async ({ token, id, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingConslusion/Update?id=" + id,
      data: data,
    });
  };
  remove_meeting_Conslusion = async ({ token, id } = {}) => {
    return new APIService({ token: token }).deleteData({
      path: "meeting/MeetingConslusion/Remove?id=" + id,
    });
  };
  restore_meeting_Conslusion = async ({ token, id } = {}) => {
    return new APIService({ token: token }).postData({
      path: "meeting/MeetingConslusion/Restore?id=" + id,
    });
  };
  delete_meeting_Conslusion = async ({ token, id } = {}) => {
    return new APIService({ token: token }).deleteData({
      path: "meeting/MeetingConslusion/Delete?id=" + id,
    });
  };

  //TODO: [MinIO]
  //TODO: [MinIO] Lấy danh sách các Bucket
  Getlist_bucket_minio = async ({ token } = {}) => {
    return new APIService({ token: token }).getData({
      path: `minio/listBucket`,
    });
  };
  //TODO: [MinIO] Lấy danh sách các tệp tin trong bucket
  Getlist_folder_bucket_minio = async ({ token, bucketName } = {}) => {
    return new APIService({ token: token }).getData({
      path: `minio/listObject?bucketName=${bucketName}`,
    });
  };
  //TODO: [MinIO] Upload tệp tin lên bucket
  Upload_file_to_bucket = async ({
    token,
    bucketName,
    filePath,
    formData,
  } = {}) => {
    return new APIServiceFile({ token: token }).postDataUp({
      path: `minio/UploadFile?bucketName=${bucketName}&filePath=${filePath}`,

      data: formData,
    });
  };
  //TODO: [MinIO] Upload nhiều tệp tin lên bucket
  Upload_files_to_bucket = async ({ token, filePath, formData } = {}) => {
    return new APIServiceFile({ token: token }).postDataUp({
      path: `minio/UploadFiles?filePath=${filePath}`,
      data: formData,
    });
  };
  //TODO: [MinIO] Lấy link download của một tệp tin - preview
  Get_link_download = async ({
    token,
    objectKey,
    fileName,
    isdownload,
  } = {}) => {
    return new APIServiceFile({ token: token }).getDataDown({
      path: `minio/Export_Object?objectKey=${objectKey}&fileName=${fileName}`,
      fileName: fileName,
      isdownload: isdownload,
    });
  };
  //TODO: [MinIO] Xóa tệp tin trong bucket
  Delete_file_bucket = async ({ token, objectName } = {}) => {
    return new APIService({ token: token }).deleteData({
      path: `minio/DeleteObject?objectName=${objectName}`,
    });
  };
  //TODO: [MinIO] Download một tệp tin
  Download_file_bucket = async ({
    token,
    bucketName,
    objectKey,
    fileName,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: `minio/Export_Object?bucketName=${bucketName}&objectKey=${objectKey}&fileName=${fileName}`,
    });
  };

  //TODO: [DangKyDichVu]
  Them_DangKyDichVu = async ({ token, key, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: `api/${key}/them`,
      data: data,
    });
  };
  ChinhSua_DangKyDichVu = async ({ token, key, data } = {}) => {
    return new APIService({ token: token }).putData({
      path: `api/${key}/chinhsua`,
      data: data,
    });
  };
  Xoa_DangKyDichVu = async ({ token, key, id } = {}) => {
    return new APIService({ token: token }).deleteData({
      path: `api/${key}/xoa?id=${id}`,
    });
  };
  XoaHoanToan_DangKyDichVu = async ({ token, key, id } = {}) => {
    return new APIService({ token: token }).deleteData({
      path: `api/${key}/xoahoantoan?id=${id}`,
    });
  };
  XemChiTiet_DangKyDichVu = async ({ token, key, id } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/${key}/xemchitiet?id=${id}`,
    });
  };
  DanhSachNhap_DangKyDichVu = async ({
    token,
    key,
    canhan,
    tochuc,
    tgbatdau,
    tgketthuc,
    pageSize,
    pageNumber,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/${key}/danhsachnhap?canhan=${canhan}&tochuc=${tochuc}&tgbatdau=${tgbatdau}&tgketthuc=${tgketthuc}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
    });
  };
  DanhSachChuaDuyet_DangKyDichVu = async ({
    token,
    key,
    canhan,
    tochuc,
    tgbatdau,
    tgketthuc,
    pageSize,
    pageNumber,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/${key}/danhsachchuaduyet?canhan=${canhan}&tochuc=${tochuc}&tgbatdau=${tgbatdau}&tgketthuc=${tgketthuc}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
    });
  };
  Duyet_DangKyDichVu = async ({ token, key, id } = {}) => {
    return new APIService({ token: token }).postData({
      path: `api/${key}/duyet?id=${id}`,
    });
  };
  HuyDuyet_DangKyDichVu = async ({ token, key, id } = {}) => {
    return new APIService({ token: token }).postData({
      path: `api/${key}/huyduyet?id=${id}`,
    });
  };
  DanhSachDaDuyet_DangKyDichVu = async ({
    token,
    key,
    canhan,
    tochuc,
    tgbatdau,
    tgketthuc,
    pageSize,
    pageNumber,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/${key}/danhsachdaduyet?canhan=${canhan}&tochuc=${tochuc}&tgbatdau=${tgbatdau}&tgketthuc=${tgketthuc}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
    });
  };
  DanhSachTuChoi_DangKyDichVu = async ({
    token,
    key,
    canhan,
    tochuc,
    tgbatdau,
    tgketthuc,
    pageSize,
    pageNumber,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/${key}/danhsachtuchoi?canhan=${canhan}&tochuc=${tochuc}&tgbatdau=${tgbatdau}&tgketthuc=${tgketthuc}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
    });
  };
  TimKiemTheoToChuc_DangKyDichVu = async ({
    token,
    key,
    tochuc,
    pageSize,
    pageNumber,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/${key}/timkiemtheo-tochuc?tochuc=${tochuc}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
    });
  };
  TimKiemTheo_ThoiGian_DangKyDichVu = async ({
    token,
    key,
    tgbatdau,
    tgketthuc,
    pageSize,
    pageNumber,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/${key}/timkiemtheo-thoigian?tgbatdau=${tgbatdau}&tgketthuc=${tgketthuc}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
    });
  };
  TimKiemTheo_CaNhan_DangKyDichVu = async ({
    token,
    key,
    canhan,
    pageSize,
    pageNumber,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/${key}/timkiemtheo-theocanhan?canhan=${canhan}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
    });
  };
  DanhSachChuaDuyetPhanTrang_DangKyDichVu = async ({
    token,
    key,
    pageSize,
    pageNumber,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/${key}/danhsachchuaduyet-phantrang?pageSize=${pageSize}&pageNumber=${pageNumber}`,
    });
  };

  //TODO: [CapDichVu]
  Them_CapDichVu = async ({ token, key, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: `api/${key}/them`,
      data: data,
    });
  };
  ChinhSua_CapDichVu = async ({ token, key, data } = {}) => {
    return new APIService({ token: token }).putData({
      path: `api/${key}/chinhsua`,
      data: data,
    });
  };
  Xoa_CapDichVu = async ({ token, key, id } = {}) => {
    return new APIService({ token: token }).deleteData({
      path: `api/${key}/xoa?id=${id}`,
    });
  };
  XoaHoanToan_CapDichVu = async ({ token, key, id } = {}) => {
    return new APIService({ token: token }).deleteData({
      path: `api/${key}/xoahoantoan?id=${id}`,
    });
  };
  XemChiTiet_CapDichVu = async ({ token, key, id } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/${key}/xemchitiet?id=${id}`,
    });
  };
  DanhSach_CapDichVu = async ({
    token,
    key,
    txtSearch,
    canhan,
    tochuc,
    hoatdong,
    dateFrom,
    dateTo,
    pageSize,
    pageNumber,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/${key}/danhsach?canhan=${canhan}&tochuc=${tochuc}&txtSearch=${txtSearch}&hoatdong=${hoatdong}&dateFrom=${dateFrom}&dateTo=${dateTo}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
    });
  };

  //TODO: QuanLyBaoCaoThongKe
  create_QuanLyBaoCaoThongKe = async ({ token, key, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: `api/${key}/them`,
      data: data,
    });
  };
  update_QuanLyBaoCaoThongKe = async ({ token, key, data } = {}) => {
    return new APIService({ token: token }).putData({
      path: `api/${key}/sua`,
      data: data,
    });
  };
  delete_QuanLyBaoCaoThongKe = async ({ token, key, id } = {}) => {
    return new APIService({ token: token }).deleteData({
      path: `api/${key}/xoa?id=${id}`,
    });
  };
  detail_QuanLyBaoCaoThongKe = async ({ token, key, id } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/${key}/xemchitiet?id=${id}`,
    });
  };
  getlist_QuanLyBaoCaoThongKe = async ({
    token,
    key,
    pageSize,
    pageNumber,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/${key}/danhsach?pageSize=${pageSize}&pageNumber=${pageNumber}`,
    });
  };
  getlist_search_QuanLyBaoCaoThongKe = async ({
    token,
    key,
    txtSearch,
    pageSize,
    pageNumber,
  } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/${key}/timkiem?txtSearch=${txtSearch}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
    });
  };
  xuat_ThongKeHoiNghiHoiThao = async ({ token } = {}) => {
    //console.log("Kiểm tra key: " + key);
    return new APIService({ token: token }).getData({
      path: `api/quanlybaocaothongkehoinghihoithao/thongke`,
    });
  };

  //TODO: BieuDo
  ThongKeSoHoiNghiHoiThaoTheoNgay = async ({ token } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/ThongKeTongHop/ThongKeSoHoiNghiHoiThaoTheoNgay`,
    });
  };

  //TODO QuyenNguoiDung
  PhanQuyenVaiTroNguoiDung = async ({ token } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/htt_qtht/phan_quyen_vai_tro_nguoi_dung/quyen_nguoi_dung`,
    });
  };
  CheckThongTinCanBo = async ({ token } = {}) => {
    return new APIService({ token: token }).getData({
      path: `api/htt_qtht/thong_tin_nguoi_dung`,
    });
  };
  get_user_bySearch = async ({ token, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: `api/htt_qtht/thong_tin_nguoi_dungs`,
      data: data,
    });
  };
  get_donvi_bySearch = async ({ token, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: `api/htt_qtht/thong_tin_don_vis`,
      data: data,
    });
  };
  get_chucvu_bySearch = async ({ token, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: `api/htt_qtht/thong_tin_chuc_vus`,
      data: data,
    });
  };
  update_user = async ({ token, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: `api/htt_qtht/thong_tin_nguoi_dung/upsert`,
      data: data,
    });
  };

  //TODO log_ql_nhat_ky_loi
  log_ql_nhat_ky_loi = async ({ token, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: "api/htt_qtht/log_ql_nhat_ky_loi/upsert",
      data: data,
    });
  };

  //TODO log_ql_thamgiaphonghop
  log_ql_thamgiaphonghop = async ({ token, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: "api/htt_qtht/log_ql_thamgiaphonghop/upsert",
      data: data,
    });
  };

  //TODO log_ql_dangnhap
  log_ql_dangnhap = async ({ token, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: "api/htt_qtht/log_ql_dangnhap/upsert",
      data: data,
    });
  };

  //TODO login
  DangNhap = async ({ token, data } = {}) => {
    return new APIService({ token: token }).postData({
      path: "Auth/dang_nhap",
      data: data,
    });
  };

  checkAllowSSO = (url) => {
    return fetch(url, { method: "GET" })
      .then((response) => {
        if (!response) return false;
        if (response.ok) {
          if (response.status === 299) return false;
          return response.json();
        } else if (response.status === 401) return false;
        else if (response.status === 500) return false;
        else return false;
      })
      .then((jsonData) => {
        if (!jsonData) return false;
        return true;
      })
      .catch((e) => {
        return false;
      });
  };

  // TODO Thiết lập cấu hình
  LayRaThietLapCauHinh = async (key, tencauhinh) =>
    callAPI({
      path:
        href_be_qtht +
        "api/htt_qtht/" +
        key +
        "/chitiet_tencauhinh?tencauhinh=" +
        tencauhinh,
      method: "GET",
    });
}
