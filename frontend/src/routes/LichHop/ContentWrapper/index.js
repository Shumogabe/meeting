import React, { useEffect, useState } from "react";
import { DatePicker, Pagination, Table, Select } from "antd";
import axios from "axios";
import moment from "moment";
import "moment/locale/vi";
import Api from "../../../api";
import { HandleTabs } from "../../../components/Modal";
import {
  SwalAlertAllConfiguration,
  SwalAlertTimeRedirect,
  SwalIsLoading,
  SwalShowValidationMessage,
} from "../../../components/Swal";
import { PAGE_CURRENT, PAGE_SIZE, SESSION_STORAGE } from "../../../config";
import { HREF } from "../../../constants/dictionaries";
import { FUNC_PERMISSION } from "../../../helper/authorize";
import Helper from "../../../helper/helper";
import userManager from "../../../services/auth";
import { HandleTabsUpdate } from "./modal";
import { dayOfWeek, formatDayOfWeek } from "../../../helper/datetime";
import { Theme } from "../../../theme";
const { RangePicker } = DatePicker;
moment.locale("vi");
export default function ContentWrapper({
  title,
  openAdd,
  setOpenAdd,
  onCloseModal,
  permissions,
  user,
  setUser,
}) {
  const href = window.location.protocol + "//" + window.location.host;
  // const [user, setUser] = useState(null);
  const [scheduleCal, setScheduleCal] = useState([]);
  const [allScheduleCal, setAllScheduleCal] = useState([]);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(PAGE_CURRENT);
  const [size, setSize] = useState(PAGE_SIZE);
  const [startTime, setStartTime] = useState(
    moment().startOf("isoWeek").format("YYYY-MM-DD")
  );
  const [endTime, setEndTime] = useState(
    moment().endOf("isoWeek").format("YYYY-MM-DD")
  );
  const [status, setStatus] = useState(3);
  const [start, setStart] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    moment().startOf("week")
  );
  const [selectedWeek, setSelectedWeek] = useState(
    currentWeekStart.format("YYYY-WW")
  );
  const [timeWeek, setTimeWeek] = useState(new Date());

  const getScheduleByUser = (
    id,
    keySearch,
    dateFrom,
    dateTo,
    status,
    start,
    isdeleted,
    page,
    pageSize
  ) => {
    if (!Helper.isNullOrUndefined(id)) {
      setScheduleCal([]);
      setLoading(false);
      new Api()
        .get_schedule_byUserIdFilter({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          id: id,
          keySearch: keySearch,
          dateFrom: Helper.isNullOrUndefined(dateFrom)
            ? "01/01/0001"
            : dateFrom,
          dateTo: Helper.isNullOrUndefined(dateTo) ? "01/01/0001" : dateTo,
          status: status,
          start: start,
          isdeleted: isdeleted,
          page: page,
          pageSize: pageSize,
        })
        .then((response) => {
          if (response?.data) {
            setLoading(false);
            setScheduleCal(response?.data);
            setTotal(response?.total);
          }
        });
    }
  };
  const getAllScheduleByUser = (
    id,
    keySearch,
    dateFrom,
    dateTo,
    status,
    start,
    isdeleted,
    page,
    pageSize
  ) => {
    if (!Helper.isNullOrUndefined(id)) {
      setAllScheduleCal([]);
      setLoading(false);
      new Api()
        .get_schedule_byUserIdFilterMonre({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          id: id,
          keySearch: keySearch,
          dateFrom: Helper.isNullOrUndefined(dateFrom)
            ? "01/01/0001"
            : dateFrom,
          dateTo: Helper.isNullOrUndefined(dateTo) ? "01/01/0001" : dateTo,
          status: status,
          start: start,
          isdeleted: isdeleted,
          page: page,
          pageSize: pageSize,
        })
        .then((response) => {
          if (response?.data) {
            setLoading(false);
            setAllScheduleCal(response?.data);
            setTotal(response?.total);
          }
        });
    }
  };

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const goToPreviousWeek = () => {
    setCurrentWeekStart(currentWeekStart.clone().subtract(1, "week"));
  };
  const goToNextWeek = () => {
    setCurrentWeekStart(currentWeekStart.clone().add(1, "week"));
  };
  const goToCurrentWeek = () => {
    setCurrentWeekStart(moment().startOf("week"));
  };
  const getWeeksOfYear = () => {
    const weeks = [];
    let startOfWeek = moment().startOf("year").startOf("week");

    // Thêm từng tuần vào danh sách
    while (startOfWeek.year() === moment().year()) {
      weeks.push(startOfWeek.clone());
      startOfWeek = startOfWeek.clone().add(1, "week");
    }

    return weeks;
  };

  // Danh sách các tuần
  const weeksOfYear = getWeeksOfYear();
  const getWeeklySchedule = () => {
    const startOfWeek = currentWeekStart;
    const endOfWeek = moment(currentWeekStart).endOf("week");

    // Lọc dữ liệu theo ngày trong khoảng của tuần hiện tại
    return scheduleCal.filter((item) => {
      const eventDate = moment(item.startTime);
      return eventDate.isBetween(startOfWeek, endOfWeek, "day", "[]");
    });
  };
  const handleWeekChange = (value) => {
    const selectedWeek = moment(value);
    setCurrentWeekStart(selectedWeek); // Cập nhật tuần được chọn
    setSelectedWeek(value); // Cập nhật giá trị đã chọn
  };
  // Dữ liệu cho tuần hiện tại
  const weeklySchedule = getWeeklySchedule();
  useEffect(() => {
    if (!Helper.isNullOrUndefined(user)) {
      getScheduleByUser(
        user?.id,
        "",
        startTime,
        endTime,
        status,
        start,
        isDeleted,
        page,
        size
      );
    }
  }, [user]);
  useEffect(() => {
    getWeeklySchedule();
  });
  useEffect(() => {
    getAllScheduleByUser(
      user?.id,
      "",
      startTime,
      endTime,
      status,
      start,
      isDeleted,
      page,
      size
    );
  }, [search, startTime, endTime, status, start, isDeleted, page, size, user]);

  return (
    <div className="content-wrapper margin-top-10">
      {/* Content Header (Page header) */}
      <div id="content-header" className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Lịch họp</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href={HREF.TrangChu}>
                    <i className="fas fa-home" />
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <a href={HREF.LichHop}>Lịch công tác</a>
                </li>
                <li className="breadcrumb-item active">Lịch họp</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      {/* /.content-header */}
      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          <div className="card card-info">
            <div className="card-body">
              <>
                <div className="d-flex">
                  <ul
                    className="nav nav-tabs mb-1 d-flex nav-item-schedule-left"
                    id="custom-content-below-tab"
                    role="tablist"
                  >
                    <li className="nav-item nav-item-schedule">
                      <a
                        className="nav-link nav-link-schedule active"
                        id="custom-content-below-meeting-tab"
                        data-toggle="pill"
                        href="#custom-content-below-schedule"
                        role="tab"
                        aria-controls="custom-content-below-schedule"
                        aria-selected="false"
                        onClick={() => {
                          setStatus(3);
                          setStart(false);
                          setIsDeleted(false);
                        }}
                        style={{
                          fontSize: "normal",
                        }}
                      >
                        <i className="far fa-calendar-alt"></i> LỊCH CÔNG TÁC
                      </a>
                    </li>
                    <li className="nav-item nav-item-schedule">
                      <a
                        className="nav-link nav-link-schedule"
                        id="custom-content-below-meeting-tab"
                        data-toggle="pill"
                        href="#custom-content-below-my-schedule"
                        role="tab"
                        aria-controls="custom-content-below-my-schedule"
                        aria-selected="false"
                        onClick={() => {
                          setStatus(3);
                          setStart(false);
                          setIsDeleted(false);
                        }}
                        style={{
                          fontSize: "normal",
                        }}
                      >
                        <i className="far fa-user"></i> LỊCH CỦA TÔI
                      </a>
                    </li>
                  </ul>
                  <div className="nav-item-schedule-right">
                    <a
                      href="#"
                      className="nav-item nav-item-schedule"
                      onClick={goToPreviousWeek}
                    >
                      <i class="fas fa-chevron-left info"></i> Tuần trước
                    </a>
                    <a
                      href="#"
                      className="nav-item nav-item-schedule"
                      onClick={goToPreviousWeek}
                    >
                      <i class="fas fa-calendar-alt"></i> Tuần hiện tại
                    </a>
                    <a
                      href="#"
                      className="nav-item nav-item-schedule"
                      onClick={goToPreviousWeek}
                    >
                      Tuần sau <i class="fas fa-chevron-right info"></i>
                    </a>
                    <div className="nav-item nav-item-schedule">
                      <Select
                        style={{ width: 200, marginBottom: 16 }}
                        placeholder="Chọn tuần"
                        // onChange={handleWeekChange}
                        value={selectedWeek}
                      >
                        {weeksOfYear.map((week, index) => (
                          <Select.Option
                            key={index}
                            value={week.format("YYYY-WW")}
                          >
                            {`Tuần ${week.format("WW")} (${week.format(
                              "DD/MM"
                            )} - ${week
                              .clone()
                              .endOf("week")
                              .format("DD/MM")})`}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-content"
                  id="custom-content-below-tabContent"
                >
                  <div
                    id="custom-content-below-schedule"
                    className="tab-pane active"
                  >
                    <Table
                      locale={{
                        emptyText: "Không có dữ liệu.",
                      }}
                      className="table table-bordered"
                      columns={[
                        {
                          title: "Thứ/Ngày",
                          dataIndex: "time",
                          align: "center",
                          width: "10%",
                          render: (_, record, index) => {
                            const currentDay = moment(record?.startTime).format(
                              "DD/MM/YYYY"
                            );
                            const sameDayRecords = scheduleCal.filter(
                              (item) =>
                                moment(item.startTime).format("DD/MM/YYYY") ===
                                currentDay
                            );
                            const isFirstOccurrence =
                              sameDayRecords[0]?.id === record.id;
                            return {
                              children: (
                                <div>
                                  <span>
                                    {capitalizeFirstLetter(
                                      moment(record?.startTime).format("dddd")
                                    )}
                                  </span>
                                  <br />
                                  <span>
                                    {moment(record?.startTime).format(
                                      "DD/MM/YYYY"
                                    )}
                                  </span>
                                </div>
                              ),
                              props: {
                                rowSpan: isFirstOccurrence
                                  ? sameDayRecords.length
                                  : 0, // Nếu không phải là hàng đầu tiên thì rowspan=0
                              },
                            };
                          },
                        },
                        {
                          title: "Lãnh đạo",
                          align: "center",
                          dataIndex: "content",
                          render: (_, record) => (
                            <>{record?.userChairMan?.ten_day_du}</>
                          ),
                        },
                        {
                          title: "Thời gian",
                          dataIndex: "time",
                          align: "center",
                          width: "7%",
                          render: (_, record) => (
                            <div className="">
                              {moment(record?.startTime).format("HH[h]mm")}
                            </div>
                          ),
                        },
                        {
                          title: "Nội dung công việc",
                          dataIndex: "content",
                          align: "center",
                          width: "40%",
                          render: (_, record) => (
                            <div className="align-left">
                              <strong>{record?.title}</strong>
                              <br />
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: record?.content,
                                }}
                              ></div>
                            </div>
                          ),
                        },
                        {
                          title: "Địa điểm",
                          align: "center",
                          dataIndex: "content",
                          render: (_, record) => (
                            <>
                              {record?.place && (
                                <>
                                  <p className="align-left">{record?.place}</p>
                                  <br />
                                </>
                              )}
                              <i class="fas fa-video info"></i>{" "}
                              <a
                                className="align-center"
                                href={record?.roomName}
                              >
                                {" "}
                                Trực tuyến
                              </a>
                            </>
                          ),
                        },
                      ]}
                      dataSource={scheduleCal}
                      rowKey={"date"}
                      pagination={false}
                      loading={loading}
                    />
                  </div>
                  <div
                    id="custom-content-below-my-schedule"
                    className="tab-pane"
                  >
                    <Table
                      locale={{
                        emptyText: "Không có dữ liệu.",
                      }}
                      className="custom-table-bordered"
                      columns={[
                        {
                          title: "Thứ/Ngày",
                          dataIndex: "time",
                          align: "center",
                          width: "10%",
                          render: (_, record) => (
                            <div className="">
                              {moment(record?.startTime).format("DD/MM/YYYY")}
                            </div>
                          ),
                        },
                        {
                          title: "Lãnh đạo",
                          align: "center",
                          dataIndex: "content",
                          render: (_, record) => (
                            <>{record?.userChairMan?.ten_day_du}</>
                          ),
                        },
                        {
                          title: "Thời gian",
                          dataIndex: "time",
                          align: "center",
                          width: "7%",
                          render: (_, record) => (
                            <div className="">
                              {moment(record?.startTime).format("HH[h]mm")}
                            </div>
                          ),
                        },
                        {
                          title: "Nội dung công việc",
                          dataIndex: "content",
                          align: "center",
                          width: "40%",
                          render: (_, record) => (
                            <div className="align-left">
                              <strong>{record?.title}</strong>
                              <br />
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: record?.content,
                                }}
                              ></div>
                            </div>
                          ),
                        },
                        {
                          title: "Địa điểm",
                          align: "center",
                          dataIndex: "content",
                          render: (_, record) => (
                            <div className="align-left">
                              {record?.place}
                              <br />
                              <i class="fas fa-video info"></i>{" "}
                              <a href={"/hop-truc-tuyen/phong-hop/" + record?.roomName}> Trực tuyến</a>
                            </div>
                          ),
                        },
                      ]}
                      rowKey={"date"}
                      dataSource={allScheduleCal}
                      pagination={false}
                      loading={loading}
                    />
                  </div>
                </div>
              </>
            </div>
            {/* /.card */}
          </div>
          {/* /.card */}
        </div>
        {/* /.container-fluid */}
      </section>
      {/* /.content */}
    </div>
  );
}
