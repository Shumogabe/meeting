import React, { useEffect, useRef, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { Input, Modal } from "antd";
import Api from "../../../../../api";
import { SESSION_STORAGE } from "../../../../../config";
import Helper from "../../../../../helper/helper";
import BaoMat from "./BaoMat";
import ChuTriUyQuyen from "./ChuTriUyQuyen";
import ChuongTrinh from "./ChuongTrinh";
import KeHoach from "./KeHoach";
import ThanhPhan from "./ThanhPhan";
import ThongTin from "./ThongTin";
import Video from "../../../../LapLich/ContentWrapper/Video";
import dayjs from "dayjs";

export default function Thongtin({
  meetingData,
  setMeetingData,
  owner,
  executeCommand,
  user,
  onHandleCheckRoom,
  scheduleSidebar,
  apiRef,
  setOwner,
  setUser,
  marginTopLayout,
  marginRightLayout,
}) {
  const refs = useRef([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm, setModalForm] = useState();
  const [option, setOption] = useState(false);
  const [password, setPassword] = useState(meetingData?.schedule?.password);
  const [value, setValue] = useState("calendar-setting-form");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //
  const [video, setVideo] = useState("");
  const [videoList, setVideoList] = useState(
    meetingData?.video?.map((item, index) => ({
      ...item,
      key: item?.id,
    }))
  );
  const [videoPostList, setVideoPostList] = useState([]);
  const [videoDeleteList, setVideoDeleteList] = useState([]);
  const [videoRestoreList, setVideoRestoreList] = useState([]);
  //
  const handleOk = () => {
    if (modalForm.includes("password")) {
      executeCommand("password", password);
      new Api().edit_meeting_schedule_password({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        id: meetingData?.schedule?.id,
        data: {
          password: password,
          modifiedBy: user?.id,
          modifiedDate: new Date(),
        },
      });
      onHandleCheckRoom();
    }
    handleCancel();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setModalForm();
  };

  const getMeetingVideo = (search, id) => {
    return new Api()
      .get_video_byFileUrl({
        url: "ghihinhcuochop/" + id,
        search: search,
        pageNumber: 1,
        pageSize: 999999,
      })
      .then((response) => {
        if (response?.data) {
          setVideoList(
            response?.data?.map((item, index) => ({
              ...item,
              key: item?.id,
            }))
          );
        }
      });
  };

  useEffect(() => {
    if (
      typeof apiRef === "object" &&
      apiRef !== null &&
      Object.keys(apiRef).length === 0
    ) {
      const interval = setInterval(() => {
        new Api()
          .get_schedule_byId({
            id: meetingData?.schedule?.id,
          })
          .then((res) => {
            if (!res?.data?.start) {
              apiRef.current.executeCommand("hangup");
            } else {
              setMeetingData((pre) => ({
                ...pre,
                schedule: res?.data,
                member: res?.data?.meetingMember,
              }));
              if (res?.data?.chairMan === user?.id) {
                setOwner(1);
                setUser((pre) => ({
                  ...pre,
                  userName: user?.userName.split(" - ")[0] + " - Chủ trì",
                  email: user?.email,
                }));
                // return;
                apiRef.current.executeCommand(
                  "displayName",
                  user?.userName.split(" - ")[0] + " - Chủ trì"
                );
                apiRef.current.executeCommand("email", user?.email);
                return;
              }
              if (res?.data?.sharedRole === user?.id) {
                setOwner(1);
                setUser((pre) => ({
                  ...pre,
                  userName: user?.userName.split(" - ")[0] + " - Thư ký",
                  email: user?.email,
                }));
                // return;
                apiRef?.current?.executeCommand(
                  "displayName",
                  user?.userName.split(" - ")[0] + " - Thư ký"
                );
                apiRef.current.executeCommand("email", user?.email);
                return;
              }
              if (
                res?.data?.sharedRole !== user?.id &&
                res?.data?.chairMan !== user?.id
              ) {
                setOwner(2);
                setUser((pre) => ({
                  ...pre,
                  userName: user?.userName.split(" - ")[0] + " - Khách mời",
                  email: user?.email,
                }));
                apiRef.current.executeCommand(
                  "displayName",
                  user?.userName.split(" - ")[0] + " - Khách mời"
                );
                apiRef.current.executeCommand("email", user?.email);
                return;
              }
            }
          });
      }, 10000);
      // return () => clearInterval(interval);
    }
    // console.log(meetingData?.schedule);
  }, []);

  useEffect(() => {
    refs.current[1].style.margin =
      marginTopLayout +
      " 0px 0px " +
      (!Helper.isNullOrUndefined(document.getElementById("meeting-sidebar")) &&
        Number(
          -document.getElementById("meeting-sidebar")?.offsetWidth - 7.5 - 8
          // window.screen.width
        )) +
      "px";
  }, [refs.current[1]]);

  return (
    <>
      {meetingData?.schedule && (
        <div
          style={{
            margin:
              marginTopLayout +
              marginRightLayout +
              " 0px " +
              (!Helper.isNullOrUndefined(
                document.getElementById("meeting-sidebar")
              ) &&
                Number(
                  -document.getElementById("meeting-sidebar")?.offsetWidth -
                    7.5 -
                    8
                  // window.screen.width
                )) +
              "px",
          }}
          ref={(element) => {
            refs.current[1] = element;
          }}
        >
          {/* <Card
            title="Thông tin phòng họp"
            // extra={<a href="#">More</a>}
            style={
              {
                // width: 300,
              }
            }
          >
            <div className="row form-group">
              <div className="col-md-4">
                <label>Tiêu đề</label>
              </div>
              <div className="col-md">{meetingData?.schedule?.title}</div>
            </div>
            <div className="row form-group">
              <div className="col-md-4">
                <label>Tên phòng họp</label>
              </div>
              <div className="col-md">
                {meetingData?.schedule?.roomName
                  ? meetingData?.schedule?.roomName
                  : meetingData?.schedule?.title}
              </div>
            </div>
            <div className="row form-group">
              <div className="col-md-4">
                <label>Chủ trì</label>
              </div>
              <div className="col-md">
                {meetingData?.schedule?.userChairMan
                  ? meetingData?.schedule?.userChairMan.fullName
                  : meetingData?.schedule?.chairMan}
              </div>
            </div>
            <div className="row form-group">
              <div className="col-md-4">
                <label>Bắt đầu</label>
              </div>
              <div className="col-md">
                {moment(meetingData?.schedule?.startTime).format("DD-MM-YYYY, hh:mm A")}
              </div>
            </div>
            <div className="row form-group">
              <div className="col-md-4">
                <label>Kết thúc</label>
              </div>
              <div className="col-md">
                {moment(meetingData?.schedule?.endTime).format("DD-MM-YYYY, hh:mm A")}
              </div>
            </div>
            <div className="row form-group">
              <div className="col-md-4">
                <label>Nội dung</label>
              </div>
              <div
                className="col-md"
                style={{ maxHeight: "45vh", overflow: "auto" }}
                dangerouslySetInnerHTML={{
                  __html: meetingData?.schedule.content,
                }}
              ></div>
            </div>
            <div className="row form-group">
              <div className="col-md-4">
                <label>Địa điểm</label>
              </div>
              <div className="col-md">{meetingData?.schedule?.place}</div>
            </div>
            <div className="row form-group">
              <div className="col-md-4">
                <label>Đường dẫn phòng họp</label>
              </div>
              <div className="col-md">
                {window.location.origin +
                  "/hop-truc-tuyen/phong-hop/" +
                  meetingData?.schedule?.roomName}
              </div>
            </div>
            <div className="row form-group">
              <div className="col-md-4">
                <label>Mật khẩu phòng họp</label>
              </div>
              <div className="col-md-2">
                {meetingData?.schedule?.password
                  ? meetingData?.schedule?.password
                  : "Không có mật khẩu"}
              </div>
              {owner === 1 && (
                <div className="col-md" style={{ top: "-7px" }}>
                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={() => {
                      setIsModalOpen(true);
                      setOption(!option);
                      setModalForm("password");
                    }}
                  >
                    Đổi mật khẩu
                  </button>
                </div>
              )}
            </div>
          </Card> */}
          {modalForm && (
            <Modal
              // style={{ position: 'absolute', background: '#fff' }}
              title={modalForm.includes("password") && "Mật khẩu phòng họp"}
              visible={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              {modalForm.includes("password") && (
                <>
                  <label htmlFor="pass">Nhập mật khẩu</label>
                  <Input.Password
                    id="pass"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </>
              )}
            </Modal>
          )}

          <TabContext value={value}>
            <div className="card-header p-0 border-bottom-0">
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="handletab"
                  variant="scrollable"
                  scrollButtons
                  allowScrollButtonsMobile
                >
                  <Tab
                    icon={<i className="far fa-calendar-alt"></i>}
                    label={"THÔNG TIN LỊCH HỌP"}
                    iconPosition="start"
                    value="calendar-setting-form"
                  />
                  {/* <Tab
                    icon={<i className="fas fa-list-ul"></i>}
                    label="CHƯƠNG TRÌNH HỌP"
                    iconPosition="start"
                    value="calendar-setting-content"
                  />
                  <Tab
                    icon={<i className="fas fa-users"></i>}
                    label="THÀNH PHẦN THAM GIA"
                    iconPosition="start"
                    value="calendar-setting-member"
                  /> */}
                  <Tab
                    icon={<i className="fas fa-key"></i>}
                    label="LỊCH SỬ CUỘC HỌP"
                    iconPosition="start"
                    value="calendar-setting-video"
                  />
                  <Tab
                    icon={<i className="fas fa-user-cog"></i>}
                    label="CHỦ TRÌ VÀ ỦY QUYỀN ĐIỀU HÀNH"
                    iconPosition="start"
                    value="calendar-setting-share-role"
                  />
                  <Tab
                    icon={<i className="fas fa-key"></i>}
                    label="THIẾT LẬP BẢO MẬT"
                    iconPosition="start"
                    value="calendar-setting-secure"
                  />
                  <Tab
                    icon={<i className="far fa-calendar" />}
                    label="KẾ HOẠCH HỌP"
                    iconPosition="start"
                    value="calendar-setting-plan"
                  />
                </TabList>
              </Box>
            </div>
            <div className="card-body">
              <div className="tab-content" id="calendar-setting-tabContent">
                <TabPanel value="calendar-setting-form">
                  <ThongTin
                    meetingData={meetingData}
                    onHandleCheckRoom={onHandleCheckRoom}
                  />
                </TabPanel>
                <TabPanel value="calendar-setting-plan">
                  <KeHoach meetingData={meetingData} />
                </TabPanel>
                <TabPanel value="calendar-setting-content">
                  <ChuongTrinh
                    scheduleId={meetingData?.schedule?.id}
                    meetingData={meetingData}
                    owner={owner}
                    user={user}
                  />
                </TabPanel>
                <TabPanel value="calendar-setting-member">
                  <ThanhPhan
                    meetingData={meetingData}
                    scheduleSidebar={scheduleSidebar}
                    apiRef={apiRef}
                    owner={owner}
                    user={user}
                  />
                </TabPanel>
                <TabPanel value="calendar-setting-share-role">
                  <ChuTriUyQuyen
                    scheduleId={meetingData?.schedule?.id}
                    meetingData={meetingData}
                    owner={owner}
                    user={user}
                  />
                </TabPanel>
                <TabPanel value="calendar-setting-secure">
                  <BaoMat
                    scheduleId={meetingData?.schedule?.id}
                    meetingData={meetingData}
                    owner={owner}
                    user={user}
                  />
                </TabPanel>
                <TabPanel value="calendar-setting-video">
                  <Video
                    video={video}
                    setVideo={setVideo}
                    videoList={videoList}
                    setVideoList={setVideoList}
                    videoPostList={videoPostList}
                    setVideoPostList={setVideoPostList}
                    videoDeleteList={videoDeleteList}
                    setVideoDeleteList={setVideoDeleteList}
                    scheduleId={meetingData?.schedule?.id}
                    user={user}
                    getMeetingVideo={getMeetingVideo}
                    videoRestoreList={videoRestoreList}
                    setVideoRestoreList={setVideoRestoreList}
                  />
                </TabPanel>
              </div>
            </div>
          </TabContext>
        </div>
      )}
    </>
  );
}
