import { useEffect, useState } from "react";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Box } from "@mui/material";
import Tab from "@mui/material/Tab";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { Button } from "react-bootstrap";
import Api from "../../api";
import { KEY_LOGIN_HTT, SESSION_STORAGE } from "../../config";
import { HREF } from "../../constants/dictionaries";
import Helper from "../../helper/helper";
import { checkRoomName } from "../../helper/url";
import userManager from "../../services/auth";
import {
  SwalAlertAllConfiguration,
  SwalIsLoading,
  SwalShowValidationMessage,
} from "../Swal";
import Content from "./content";
import Member from "./member";
import Schedule from "./schedule";
import Secure from "./secure";
import Sharerole from "./sharerole";
import { isCancel } from "axios";
const { RangePicker } = DatePicker;

let timeoutUser;
let currentValueUser;

export const HandleLogout = (status) => {
  let isLogin = 0;

  new Api()
    .get_option_byKey({
      key: KEY_LOGIN_HTT,
    })
    .then((response) => {
      if (
        !Helper.isNullOrUndefined(response?.data) &&
        !response?.data?.isDeleted
      ) {
        if (!response?.data?.status) {
          if (status === "login") {
            userManager.signinRedirect();
          }
          if (status === "logout") {
            return SwalAlertAllConfiguration({
              title: "Bạn có chắc muốn đăng xuất?",
              text: "Khi bạn nhấn 'Đồng ý' sẽ bị đăng xuất!",
              icon: "error",
              showCancelButton: true,
              confirmButtonText: "Đồng ý",
              cancelButtonText: "Thoát",
              showLoaderOnConfirm: true,
              dangerMode: true,
              preConfirm: async (login) => {
                try {
                  localStorage.clear();
                  userManager.signoutRedirect();
                } catch (error) {
                  SwalShowValidationMessage(`
                      Request failed: ${error}
                    `);
                }
              },
              allowOutsideClick: () => !SwalIsLoading(),
            }).then((result) => {
              if (result.isConfirmed) {
              }
            });
          }
        } else {
          isLogin = 1;
          if (status === "login") {
            let ignoreMobileMode = sessionStorage.getItem("ignoreMobileMode");
            sessionStorage.clear();
            sessionStorage.setItem("ignoreMobileMode", ignoreMobileMode);
            localStorage.clear();
            window.location.href = HREF.DangNhap;
          }
          if (status === "logout") {
            return SwalAlertAllConfiguration({
              title: "Bạn có chắc muốn đăng xuất?",
              text: "Khi bạn nhấn 'Đồng ý' sẽ bị đăng xuất!",
              icon: "error",
              showCancelButton: true,
              confirmButtonText: "Đồng ý",
              cancelButtonText: "Thoát",
              showLoaderOnConfirm: true,
              dangerMode: true,
              preConfirm: async (login) => {
                try {
                  userManager.getUser().then((res) => {
                    if (
                      !Helper.isNullOrUndefined(res) &&
                      !Helper.isNullOrUndefined(res?.session_state)
                    ) {
                      localStorage.clear();
                      userManager.signoutRedirect();
                    } else {
                      let ignoreMobileMode =
                        sessionStorage.getItem("ignoreMobileMode");
                      sessionStorage.clear();
                      sessionStorage.setItem(
                        "ignoreMobileMode",
                        ignoreMobileMode,
                      );
                      localStorage.clear();
                      window.location.href = "/";
                    }
                  });
                } catch (error) {
                  SwalShowValidationMessage(`
                      Request failed: ${error}
                    `);
                }
              },
              allowOutsideClick: () => !SwalIsLoading(),
            }).then((result) => {
              if (result.isConfirmed) {
              }
            });
          }
        }
        CheckUser().then((user) => {
          if (!Helper.isNullOrUndefined(user)) {
            window.location.href = HREF.TrangChu;
          }
        });
      } else return SwalShowValidationMessage(response.message);
    })
    .catch((e) => {
      return SwalShowValidationMessage(e.message);
    });

  // if (status === "login") {
  //   if (isLogin === 1) {
  //     sessionStorage.clear();
  //     localStorage.clear();
  //     window.location.href =("/");
  //   } else {
  //     userManager.signinRedirect();
  //   }
  // }
  // if (status === "logout") {
  //   if (isLogin === 1) {
  //     sessionStorage.clear();
  //     localStorage.clear();
  //     window.location.href =("/");
  //   } else {
  //     userManager.signoutRedirect();
  //   }
  // }
};

export const CheckUser = () => {
  return new Promise((resolve, reject) => {
    var res = JSON.parse(sessionStorage.getItem(SESSION_STORAGE));
    var user = null;
    if (Helper.isNullOrUndefined(res)) {
      return resolve(user);
    }
    if (
      !Helper.isNullOrUndefined(res) &&
      Number(res?.expires_at) -
        Number(Math.round(new Date().getTime() / 1000)) -
        1000 <
        0
    ) {
      return resolve(user);
    } else {
      new Api()
        .CheckThongTinCanBo({
          token: res?.access_token,
        })
        .then((resp) => {
          if (!Helper.isNullOrUndefined(resp)) {
            return resolve(resp);
          }
        })
        .catch((error) => {
          return reject(error);
        });
    }
  });
};

export const HandleCreateRoom = (roomName, userid) => {
  return new Promise((resolve, reject) => {
    var response = { message: "", data: null };
    if (checkRoomName(roomName) === false) {
      response.message =
        "Tên phòng họp phải là chữ liền, không dấu, không chứa ký tự đặc biệt hay khoảng trống";
      return resolve(response);
    }
    if (Helper.isNullOrUndefined(roomName)) {
      response.message = "Tên phòng họp không được để trống";
      return resolve(response);
    } else {
      let now = moment().unix();
      new Api()
        .create_meeting_schedule({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          data: {
            title: "Cuộc họp nhanh",
            content:
              "Cuộc họp nhanh " +
              moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
            startTime: moment(now * 1000).format("YYYY-MM-DDTHH:mm:ss"),
            endTime: moment((now + 28800) * 1000).format("YYYY-MM-DDTHH:mm:ss"),
            chairMan: userid,
            roomName: roomName,
            place: "",
            status: 2,
            start: true,
            token: "",
            serverId: 0,
            typeId: 1,
            sharedRole: 0,
            password: "",
            isPublished: 1,
            createdDate: moment(now * 1000).format("YYYY-MM-DDTHH:mm:ss"),
            createdBy: userid,
            isLobby: 0,
            isCancel: 0,
          },
        })
        .then((resp) => {
          response = resp;
          return resolve(response);
          // if (response?.data < 0) {
          //   // return SwalAlertAllConfiguration({
          //   //   title: "Thông báo",
          //   //   text: response.message,
          //   //   icon: "success",
          //   //   timer: 3000,
          //   // }).then((result) => {
          //   //   /* Read more about handling dismissals below */
          //   //   if (result.dismiss === SwalDismissReasonTimer()) {
          //   //     // console.log("I was closed by the timer");
          //   //     window.location.href =(
          //   //       "/hop-truc-tuyen/phong-hop/" + roomName
          //   //     );
          //   //   }
          //   // });
          //   return SwalShowValidationMessage(response?.message);
          // } else return response?.data;
        })
        .catch((e) => {
          response.message = e?.message;
          return reject(response);
        });
    }
  });
};

export const HandleTabs = ({ onCloseModal }) => {
  const [value, setValue] = useState("calendar-setting-form");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // const scrollBarRefComponentsModal = useRef();

  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);

  //schedule
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [startTime, setStartTime] = useState(dayjs(dayjs().unix() * 1000));
  const [start, setStart] = useState(null);
  const [endTime, setEndTime] = useState(
    dayjs((dayjs().unix() + 28800) * 1000),
  );
  const [end, setEnd] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [errorRoomName, setErrorRoomName] = useState(false);
  const [place, setPlace] = useState(null);
  const [type, setType] = useState([]);
  const [server, setServer] = useState([]);
  const [errorSchedule, setErrorSchedule] = useState(false);
  //
  //content
  const [contentList, setContentList] = useState([]);
  const [contentDeleteList, setContentDeleteList] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [sortedType, setSortedType] = useState(true);
  const [contentTitle, setContentTitle] = useState(null);
  const [contentStartTime, setContentStartTime] = useState(null);
  const [contentEndTime, setContentEndTime] = useState(null);
  const [contentPresenter, setContentPresenter] = useState(null);
  const [contentPresenterOptions, setContentPresenterOptions] = useState([]);
  const [contentContent, setContentContent] = useState(null);
  const [errorContent, setErrorContent] = useState(false);
  const [contentStartOpen, setContentStartOpen] = useState(false);
  const [contentEndOpen, setContentEndOpen] = useState(false);
  //
  //member
  const [memberList, setMemberList] = useState([]);
  const [memberDeleteList, setMemberDeleteList] = useState([]);
  const [member, setMember] = useState(null);
  const [memberOptions, setMemberOptions] = useState([]);
  const [memberEmailList, setMemberEmailList] = useState([]);
  const [memberEmailDeleteList, setMemberEmailDeleteList] = useState([]);
  const [memberEmail, setMemberEmail] = useState(null);
  const [memberEmailOptions, setMemberEmailOptions] = useState([]);
  //
  //document
  const [doc, setDoc] = useState("");
  const [docList, setDocList] = useState([]);
  const [docPostList, setDocPostList] = useState([]);
  const [docDeleteList, setDocDeleteList] = useState([]);
  //
  //chairman && sharerole
  const [chairMan, setChairMan] = useState(null);
  const [chairManOptions, setChairManOptions] = useState([]);
  const [shareRole, setShareRole] = useState(null);
  const [shareRoleOptions, setShareRoleOptions] = useState([]);
  //
  //secure
  const [pass, setPass] = useState(null);
  const [passRequire, setPassRequire] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isLobby, setIsLobby] = useState(false);
  //
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [optionsUsers, setOptionsUsers] = useState([]);
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usr, setUsr] = useState([]);
  const [selectedRoles, setselectedRoles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState([]);
  const [array, setArray] = useState([]);
  const [optionsMeetingServer, setOptionsMeetingServer] = useState([]);
  const [optionsMeetingServerDefault, setOptionsMeetingServerDefault] =
    useState([]);
  const [optionsMeetingType, setOptionsMeetingType] = useState([]);

  useEffect(() => {
    userManager.getUser().then((res) => {
      if (res != null) {
        CheckUser()
          .then((user) => {
            if (Helper.isNullOrUndefined(user)) {
              let ignoreMobileMode = sessionStorage.getItem("ignoreMobileMode");
              sessionStorage.clear();
              sessionStorage.setItem("ignoreMobileMode", ignoreMobileMode);
              localStorage.clear();
              window.location.href = HREF.DangNhap;
            } else {
              setUser(user);
            }
          })
          .catch((error) => {
            console.error(error);
          });
        GetList_User("", 0);
        getMeetingType();
        getMeetingServer();
        getMeetingServerDefault();
      }
    });
  }, []);
  //schedule
  const getMeetingType = () => {
    new Api().get_all_meetingType({}).then((response) => {
      if (response?.data) {
        setOptionsMeetingType(response?.data);
        setType(response?.data[0]);
      }
    });
  };
  const getMeetingServer = () => {
    new Api().get_all_meetingServer({}).then((response) => {
      if (response?.data) setOptionsMeetingServer(response?.data);
    });
  };
  const getMeetingServerDefault = () => {
    new Api().get_meetingServer_byDefault({}).then((response) => {
      if (response?.data) {
        setOptionsMeetingServerDefault(response?.data);
        setServer(response?.data);
      }
    });
  };
  //
  //content
  //
  //member
  //
  //document
  //
  //chairman & sharerole
  const GetList_User = (value, obj) => {
    if (timeoutUser) {
      clearTimeout(timeoutUser);
      timeoutUser = null;
    }
    currentValueUser = value;
    const fake = () => {
      new Api()
        .get_user_bySearch({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          data: {
            tu_khoa: value,
            page: 1,
            limit: 10,
          },
        })
        .then((res) => {
          if (currentValueUser === value) {
            const dataOption =
              res &&
              res?.records?.map((item) => ({
                ...item,
                value: item?.id,
                label: item?.ten_day_du + " - " + item?.ten_dangnhap,
              }));
            if (obj === 1) setChairManOptions(dataOption);
            if (obj === 2) setShareRoleOptions(dataOption);
            if (obj === 3) setContentPresenterOptions(dataOption);
            if (obj === 4) setMemberOptions(dataOption);
            if (obj === 5) setMemberEmailOptions(dataOption);
          }
        })
        .catch((err) =>
          SwalAlertAllConfiguration({
            title: "Thông báo!",
            text: err.message,
            icon: "warning",
          }),
        );
    };
    if (value === null) {
      if (obj === 1) setChairManOptions([]);
      if (obj === 2) setShareRoleOptions([]);
      if (obj === 3) setContentPresenterOptions([]);
      if (obj === 4) setMemberOptions([]);
      if (obj === 5) setMemberEmailOptions([]);
    } else {
      timeoutUser = setTimeout(fake, 800);
    }
  };
  //
  //secure
  //

  const onWrite = () => {
    if (Helper.isNullOrUndefined(title)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Tiêu đề không được để trống",
        icon: "warning",
      });
    }
    if (Helper.isNullOrUndefined(content)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Nội dung không được để trống",
        icon: "warning",
      });
    }
    if (Helper.isNullOrUndefined(startTime)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Thời gian bắt đầu không được để trống",
        icon: "warning",
      });
    }
    if (Helper.isNullOrUndefined(endTime)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Thời gian kết thúc không được để trống",
        icon: "warning",
      });
    }
    if (Helper.isNullOrUndefined(server)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Máy chủ họp trực tuyến không được để trống",
        icon: "warning",
      });
    }
    if (Helper.isNullOrUndefined(type)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Loại hình cuộc họp không được để trống",
        icon: "warning",
      });
    }
    if (Helper.isNullOrUndefined(roomName)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Tên lịch họp không được để trống",
        icon: "warning",
      });
    }
    // if (checkRoomName(roomName) === false) {
    //   return SwalAlertAllConfiguration({
    //     title: "Thông báo! ",
    //     text: "Tên lịch họp viết liền, không dấu, không nhập ký tự đặc biệt và khoảng trống",
    //     icon: "warning",
    //   });
    // }
    if (
      Helper.isNullOrUndefined(chairMan) &&
      Helper.isNullOrUndefined(chairMan?.id)
    ) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Chủ trì phòng họp không được để trống",
        icon: "warning",
      });
    }
    var res = JSON.parse(sessionStorage.getItem(SESSION_STORAGE));
    let data = {
      schedule: {
        title: title,
        content: !Helper.isNullOrUndefined(content) ? content : "",
        startTime: !Helper.isNullOrUndefined(startTime)
          ? startTime.format("YYYY-MM-DDTHH:mm:ss")
          : "",
        endTime: !Helper.isNullOrUndefined(endTime)
          ? endTime.format("YYYY-MM-DDTHH:mm:ss")
          : "",
        chairMan: chairMan?.id ? chairMan?.id : 0,
        roomName: roomName,
        place: place,
        status: isPublished === true ? 2 : 1,
        start: isPublished,
        token: "",
        serverId: server?.id,
        typeId: window.location.pathname.startsWith(HREF.SuKien) ? 4 : type?.id,
        sharedRole: shareRole?.id ? shareRole?.id : 0,
        password: passRequire ? pass : "",
        isLobby: isLobby,
        isPublished: isPublished,
        createdDate: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss"),
        createdBy: user?.id,
      },
      content: contentList,
      member: memberList,
      memberEmail: memberEmailList,
      document: {},
      votes: {},
      voted: {},
    };
    //console.log(data);
    new Api()
      .create_meeting_schedule({
        token: res?.access_token,
        data: data?.schedule,
      })
      .then((res) => {
        if (res?.data) {
          SwalAlertAllConfiguration({
            title: "Thông báo",
            text: "Thêm mới lịch họp thành công",
            timer: 2000,
            icon: "success",
          });
          onCloseModal();
        }
      })
      .catch((e) => {
        return SwalAlertAllConfiguration({
          title: "Thông báo!",
          text: `Không thể thêm.`,
          icon: "warning",
        });
      });
    // }
  };

  return (
    <>
      {user !== null && (
        // <div className="meeting" style={{ backgroundColor: "transparent" }}>
        //   <div className="modal-dialog modal-xl">
        //     <div className="modal-content">
        //       <div className="modal-header">
        //         <h5 className="modal-title" id="schedule-create-label">
        //           <i className="far fa-calendar"></i> THÊM LỊCH HỌP
        //         </h5>
        //         <button
        //           type="button"
        //           className="close"
        //           data-dismiss="modal"
        //           aria-label="Close"
        //         >
        //           <span aria-hidden="true">&times;</span>
        //         </button>
        //       </div>
        //       <div className="modal-body p-0">

        //       </div>
        //     </div>
        //   </div>
        // </div>
        <>
          <div className="card card-primary card-outline card-outline-tabs">
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
                      label="THÔNG TIN LỊCH"
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
                    {/* <Tab
                      icon={<i className="fas fa-file"></i>}
                      label="TÀI LIỆU HỌP"
                      iconPosition="start"
                      value="calendar-setting-document"
                    />
                    <Tab
                      icon={<i className="fas fa-poll-h"></i>}
                      label="BIỂU QUYẾT CUỘC HỌP"
                      iconPosition="start"
                      value="calendar-setting-vote"
                    /> */}
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
                  </TabList>
                </Box>
              </div>
              <div className="card-body">
                {/* <ScrollbarsCustum
                  // ref={scrollBarRefComponentsModal}
                  style={{
                    height: window.innerHeight / 2,
                    maxHeight: window.innerHeight / 2 + "px",
                    // height: 400,
                    // maxHeight: "400px",
                  }}
                  autoHide
                  autoHideTimeout={1000}
                  autoHideDuration={200}
                >
                </ScrollbarsCustum> */}
                <div className="tab-content" id="calendar-setting-tabContent">
                  <TabPanel value="calendar-setting-form">
                    <Schedule
                      title={title}
                      errorSchedule={errorSchedule}
                      setTitle={setTitle}
                      startTime={startTime}
                      endTime={endTime}
                      setStartTime={setStartTime}
                      setEndTime={setEndTime}
                      content={content}
                      setContent={setContent}
                      server={server}
                      optionsMeetingServer={optionsMeetingServer}
                      optionsMeetingServerDefault={optionsMeetingServerDefault}
                      setServer={setServer}
                      place={place}
                      setPlace={setPlace}
                      roomName={roomName}
                      setRoomName={setRoomName}
                      setErrorRoomName={setErrorRoomName}
                      errorRoomName={errorRoomName}
                      type={type}
                      optionsMeetingType={optionsMeetingType}
                      setType={setType}
                    />
                  </TabPanel>
                  <TabPanel value="calendar-setting-content">
                    <Content
                      startTime={startTime}
                      endTime={endTime}
                      contentTitle={contentTitle}
                      errorContent={errorContent}
                      setContentTitle={setContentTitle}
                      contentStartTime={contentStartTime}
                      contentEndTime={contentEndTime}
                      setContentStartTime={setContentStartTime}
                      setContentEndTime={setContentEndTime}
                      contentPresenter={contentPresenter}
                      contentPresenterOptions={contentPresenterOptions}
                      setContentPresenter={setContentPresenter}
                      GetList_User={GetList_User}
                      setErrorContent={setErrorContent}
                      contentContent={contentContent}
                      setContentList={setContentList}
                      user={user}
                      contentList={contentList}
                      setContentPresenterOptions={setContentPresenterOptions}
                      setContentContent={setContentContent}
                      contentDeleteList={contentDeleteList}
                      setContentDeleteList={setContentDeleteList}
                      sortedType={sortedType}
                      setSortedInfo={setSortedInfo}
                      setSortedType={setSortedType}
                      sortedInfo={sortedInfo}
                    />
                  </TabPanel>
                  <TabPanel value="calendar-setting-member">
                    <Member
                      memberOptions={memberOptions}
                      member={member}
                      setMember={setMember}
                      GetList_User={GetList_User}
                      setMemberList={setMemberList}
                      user={user}
                      memberList={memberList}
                      setMemberOptions={setMemberOptions}
                      memberDeleteList={memberDeleteList}
                      setMemberDeleteList={setMemberDeleteList}
                      memberEmail={memberEmail}
                      setMemberEmail={setMemberEmail}
                      setMemberEmailList={setMemberEmailList}
                      memberEmailList={memberEmailList}
                      memberEmailDeleteList={memberEmailDeleteList}
                      setMemberEmailDeleteList={setMemberEmailDeleteList}
                    />
                  </TabPanel>
                  <TabPanel value="calendar-setting-document">
                    <div className="alert alert-danger" role="alert">
                      Chức năng đang bảo trì
                    </div>
                  </TabPanel>
                  <TabPanel value="calendar-setting-vote">
                    <div className="alert alert-danger" role="alert">
                      Chức năng đang bảo trì
                    </div>
                  </TabPanel>
                  <TabPanel value="calendar-setting-share-role">
                    <Sharerole
                      chairManOptions={chairManOptions}
                      chairMan={chairMan}
                      setChairMan={setChairMan}
                      GetList_User={GetList_User}
                      shareRoleOptions={shareRoleOptions}
                      shareRole={shareRole}
                      setShareRole={setShareRole}
                    />
                  </TabPanel>
                  <TabPanel value="calendar-setting-secure">
                    <Secure
                      setIsPublished={setIsPublished}
                      setPassRequire={setPassRequire}
                      pass={pass}
                      passRequire={passRequire}
                      setPass={setPass}
                      setIsLobby={setIsLobby}
                    />
                  </TabPanel>
                </div>
              </div>
            </TabContext>
          </div>
          <div className="row form-group">
            <div className="col-md-12 align-center m-1">
              <Button
                className="btn btn-sm btn-default m-1"
                onClick={() => onWrite()}
              >
                <i className="fas fa-edit blue"></i> Thêm mới
              </Button>
              <Button
                className="btn btn-sm btn-default m-1"
                data-dismiss="modal"
                onClick={() => onCloseModal()}
              >
                {/* <i className="fas fa-ban red"></i> Hủy */}
                <i className="fas fa-undo"></i> Quay lại
              </Button>
            </div>
          </div>
        </>
      )}
      {user === null && <></>}
    </>
  );
};
