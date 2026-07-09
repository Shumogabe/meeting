import React, { useEffect, useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { Button, DatePicker } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import moment from "moment";
import Api from "../../../api";
import ScrollbarsCustum from "../../../components/ScrollbarsCustum";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { PAGE_CURRENT, PAGE_SIZE, SESSION_STORAGE } from "../../../config";
import Helper from "../../../helper/helper";
import { checkRoomName } from "../../../helper/url";
import userManager from "../../../services/auth";
import ChairMan from "./ChairMan";
import Content from "./content";
import Document from "./document";
import Member from "./member";
import Schedule from "./schedule";
import Secure from "./secure";
import Vote from "./vote";
const { RangePicker } = DatePicker;
let timeoutUser;
let currentValueUser;
export const HandleTabsUpdate = ({
  scheduleId,
  contentCall,
  memberCall,
  memberEmailCall,
  documentCall,
  user,
  setUser,
  onHandleCancel,
  edit,
}) => {
  // const scrollBarRefSuKenContentWrapperModal = useRef();
  const [value, setValue] = useState("calendar-setting-form");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const { userInfo } = props;
  // const [user, setUser] = useState(null);
  const [data, setData] = useState(null);

  //schedule
  const [title, setTitle] = useState(edit?.title);
  const [content, setContent] = useState(edit?.content);
  const [startTime, setStartTime] = useState(dayjs(edit?.startTime));
  const [endTime, setEndTime] = useState(dayjs(edit?.endTime));
  const [roomName, setRoomName] = useState(edit?.roomName);
  const [errorRoomName, setErrorRoomName] = useState(false);
  const [place, setPlace] = useState(edit?.place);
  const [status, setStatus] = useState(edit?.status);
  const [start, setStart] = useState(edit?.start);
  const [server, setServer] = useState(edit?.server);
  const [type, setType] = useState(edit?.type);
  const [token, setToken] = useState(edit?.token);
  const [errorSchedule, setErrorSchedule] = useState(false);
  //
  //content
  const [contentList, setContentList] = useState(
    edit?.meetingContent.map((item, index) => ({
      ...item,
      key: item?.id,
      thoigianbatdau: dayjs(item?.startTime),
      thoigianketthuc: dayjs(item?.endTime),
      nguoithuyettrinh: item?.userPresenters?.ten_day_du
        ? item?.userPresenters?.ten_day_du
        : item?.userPresenters?.ten_dangnhap,
    }))
  );
  const [contentDeleteList, setContentDeleteList] = useState([]);
  const [contentRestoreList, setContentRestoreList] = useState([]);
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
  const [memberList, setMemberList] = useState(
    edit?.meetingMemberInside.map((item, index) => ({
      ...item,
      key: item?.id,
      fullName: item?.user?.ten_day_du,
      userName: item?.user?.ten_dangnhap,
    }))
  );
  const [memberDeleteList, setMemberDeleteList] = useState([]);
  const [member, setMember] = useState(null);
  const [memberOptions, setMemberOptions] = useState([]);
  const [memberEmailList, setMemberEmailList] = useState(
    edit?.meetingMemberOutside.map((item, index) => ({
      ...item,
      key: item?.id,
      email: item?.email,
    }))
  );
  const [memberEmailDeleteList, setMemberEmailDeleteList] = useState([]);
  const [memberEmail, setMemberEmail] = useState(null);
  const [memberEmailOptions, setMemberEmailOptions] = useState([]);
  const [errorMember, setErrorMember] = useState(false);
  //
  //document
  const [doc, setDoc] = useState("");
  const [docList, setDocList] = useState(
    edit?.meetingDocument.map((item, index) => ({
      ...item,
      key: item?.id,
    }))
  );
  const [docPostList, setDocPostList] = useState([]);
  const [docDeleteList, setDocDeleteList] = useState([]);
  const [docRestoreList, setDocRestoreList] = useState([]);
  const [docSendList, setDocSendList] = useState([]);
  //
  //video
  const [video, setVideo] = useState("");
  const [videoList, setVideoList] = useState(
    edit?.meetingVideo.map((item, index) => ({
      ...item,
      key: item?.id,
    }))
  );
  const [videoPostList, setVideoPostList] = useState([]);
  const [videoDeleteList, setVideoDeleteList] = useState([]);
  const [videoRestoreList, setVideoRestoreList] = useState([]);
  //
  //chairman && sharerole
  const [chairMan, setChairMan] = useState(edit?.userChairMan);
  const [chairManOptions, setChairManOptions] = useState([]);
  const [shareRole, setShareRole] = useState(edit?.userShareRole);
  const [shareRoleOptions, setShareRoleOptions] = useState([]);
  //
  //vote
  const [voteList, setVoteList] = useState(
    edit?.meetingVotes.map((item, index) => ({
      ...item,
      key: item?.id,
    }))
  );
  const [votesDeleteList, setVotesDeleteList] = useState([]);
  const [votesRestoreList, setVotesRestoreList] = useState([]);
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

  const onSetting = (id) => {
    if (id) {
      new Api()
        .get_schedule_byId({
          id: id,
        })
        .then((response) => {
          if (response?.data?.id) {
            //
            setTitle(response?.data?.title);
            setContent(response?.data?.content);
            setStartTime(dayjs(response?.data?.startTime));
            setEndTime(dayjs(response?.data?.endTime));
            setRoomName(response?.data?.roomName);
            setErrorRoomName(false);
            setPlace(response?.data?.place);
            setStatus(response?.data?.status);
            setStart(response?.data?.start);
            getServerById(response?.data?.serverId);
            getTypeById(response?.data?.typeId);
            setToken(response?.data?.token);
            setErrorSchedule(false);
            //
            setPass(response?.data?.password);
            setPassRequire(
              !Helper.isNullOrUndefined(response?.data?.password) ? true : false
            );
            setIsPublished(response?.data?.isPublished);
            setIsLobby(response?.data?.isLobby);
            //
            setChairMan(response?.data?.userChairMan);
            setShareRole(response?.data?.userShareRole);

            //Content
            getContentBySchedule(id); //

            //Member
            getMeetingMember(id); //
            //Document
            getMeetingDocument(id); //
            //Vote
            getMeetingVote("", id);
          } else {
            SwalAlertAllConfiguration({
              title: "Thông báo!",
              text: "Không tìm thấy thông tin phòng họp",
              icon: "warning",
            });
          }
        });
    } else
      SwalAlertAllConfiguration({
        title: "Thông báo!",
        text: "Thông tin lịch không tồn tại",
        icon: "warning",
      });
  };

  const getServerById = (id) => {
    new Api()
      .get_meetingServer_byId({
        id: id,
      })
      .then((e) => {
        if (e?.data) {
          setServer(e?.data);
        }
      });
  };

  const getTypeById = (id) => {
    new Api()
      .get_meetingType_byId({
        id: id,
      })
      .then((e) => {
        if (e?.data) {
          setType(e?.data);
        }
      });
  };

  const getMeetingMember = (id) => {
    return axios
      .all([
        new Api().get_schedule_byInside({
          pageSize: PAGE_SIZE,
          pageNumber: PAGE_CURRENT,
          id: id,
        }),
        new Api().get_schedule_byOutside({
          pageSize: PAGE_SIZE,
          pageNumber: PAGE_CURRENT,
          id: id,
        }),
      ])
      .then(
        axios.spread((resp1, resp2) => {
          if (resp1?.data) {
            setMemberList(
              resp1?.data.map((item, index) => ({
                ...item,
                key: item?.id,
                fullName: item?.user?.fullName,
                userName: item?.user?.userName,
              }))
            );
          }
          if (resp2?.data) {
            setMemberEmailList(
              resp2?.data.map((item, index) => ({
                ...item,
                key: item?.id,
                email: item?.email,
              }))
            );
          }
        })
      );
  };

  const getContentBySchedule = (id) => {
    new Api()
      .get_content_byScheduleId({ id: id, pageSize: 999999, pageNumber: 1 })
      .then((res) => {
        if (res?.data) {
          setContentList(
            res?.data.map((item, index) => ({
              ...item,
              key: item?.id,
              thoigianbatdau: dayjs(item?.startTime),
              thoigianketthuc: dayjs(item?.endTime),
              nguoithuyettrinh: item?.userPresenters?.fullName,
            }))
          );
        }
      });
  };

  const getMeetingDocument = (id) => {
    return new Api()
      .get_document_byFileUrl({
        url: "sukien/" + id,
        pageSize: 999999,
        pageNumber: 1,
      })
      .then((response) => {
        if (response?.data) {
          setDocList(response?.data);
        }
      });
  };

  const getMeetingVote = (search, id) => {
    new Api()
      .get_votes_byScheduleId({
        search: search,
        id: id,
        pageNumber: 1,
        pageSize: 999999,
      })
      .then((response) => {
        if (response?.data) {
          setVoteList(response?.data);
        }
      });
  };

  useEffect(() => {
    if (!Helper.isNullOrUndefined(scheduleId)) {
      userManager.getUser().then((res) => {
        if (!Helper.isNullOrUndefined(res)) {
          onSetting(scheduleId);
          GetList_User("", 0);
          getMeetingType();
          getMeetingServer();
          // CheckUser()
          //   .then((user) => {
          //     if (Helper.isNullOrUndefined(user)) {
          //       sessionStorage.clear();
          //       localStorage.clear();
          //       window.location.href =(HREF.DangNhap);
          //     } else {
          //       setUser(user);
          //     }
          //   })
          //   .catch((error) => {
          //     console.error(error);
          //   });
        }
      });
    }
  }, [scheduleId]);

  useEffect(() => {
    if (!Helper.isNullOrUndefined(documentCall)) {
      setDocList(documentCall);
    }
  }, [documentCall]);

  useEffect(() => {
    if (!Helper.isNullOrUndefined(contentCall)) {
      setContentList(
        contentCall.map((item, index) => ({
          ...item,
          key: item?.id,
          thoigianbatdau: dayjs(item?.startTime),
          thoigianketthuc: dayjs(item?.endTime),
          nguoithuyettrinh: item?.userPresenters?.fullName,
        }))
      );
    }
  }, [contentCall]);

  useEffect(() => {
    if (!Helper.isNullOrUndefined(memberCall)) {
      setMemberList(
        memberCall.map((item, index) => ({
          ...item,
          key: item?.id,
          fullName: item?.user?.fullName,
          userName: item?.user?.userName,
        }))
      );
    }
  }, [memberCall]);

  useEffect(() => {
    if (!Helper.isNullOrUndefined(memberEmailCall)) {
      setMemberEmailList(
        memberEmailCall.map((item, index) => ({
          ...item,
          key: item?.id,
          email: item?.email,
        }))
      );
    }
  }, [memberEmailCall]);

  //schedule
  const getMeetingType = () => {
    new Api().get_all_meetingType({}).then((response) => {
      if (response?.data) {
        setOptionsMeetingType(response?.data);
      }
    });
  };
  const getMeetingServer = () => {
    new Api().get_all_meetingServer({}).then((response) => {
      if (response?.data) setOptionsMeetingServer(response?.data);
    });
  };
  //
  //content
  const InsertContent = (item) => {
    new Api().create_meeting_content({
      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
      data: item,
    });
  };
  const RemoveContent = (id) => {
    new Api().delete_content({
      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
      id: id,
    });
  };
  //
  //member
  const InsertMember = (item) => {
    new Api()
      .create_meeting_member({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        data: item,
      })
      .then((resMember) => {});
  };
  const RemoveMember = (id) => {
    new Api().remove_meeting_member({
      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
      id: id,
    });
  };
  //
  //document
  const InsertDocument = (item) => {
    new Api().create_meeting_document({
      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
      data: item,
    });
  };
  const RemoveDocument = (id) => {
    new Api().remove_document({
      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
      id: id,
    });
  };
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
          })
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
      //console.log(server);
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Máy chủ không được để trống",
        icon: "warning",
      });
    }
    if (Helper.isNullOrUndefined(type)) {
      //console.log(type);
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Loại hình cuộc họp không được để trống",
        icon: "warning",
      });
    }
    if (Helper.isNullOrUndefined(roomName)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Tên phòng họp không được để trống",
        icon: "warning",
      });
    }
    if (checkRoomName(roomName) === false) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Tên phòng họp không được chứ các kí tự khoảng trắng, dấu câu và kí tự đặc biệt",
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
        status: status,
        start: start,
        token: token,
        serverId: server?.id,
        typeId: type?.id,
        sharedRole: shareRole?.id ? shareRole?.id : 0,
        password: passRequire ? pass : "",
        isLobby: isLobby,
        isPublished: isPublished,
        modifiedDate: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss"),
        modifiedBy: user?.id,
      },
      // content: contentList,
      // member: memberList,
      // memberEmail: memberEmail,
      // document: {},
      // votes: {},
      // voted: {},
    };
    //console.log(data);
    new Api()
      .edit_meeting_schedule({
        token: res?.access_token,
        id: scheduleId,
        data: data?.schedule,
      })
      .then((response) => {
        if (response) {
          onHandleCancel();
          SwalAlertAllConfiguration({
            title: "Thông báo! ",
            text: response?.message,
            icon: "success",
          });
        } else
          SwalAlertAllConfiguration({
            title: "Thông báo! ",
            text: response?.message,
            icon: "warning",
          });
      })
      .catch((e) => {
        SwalAlertAllConfiguration({
          title: "Thông báo! ",
          text: e.message,
          icon: "warning",
        });
      });
    // }
  };

  return (
    <>
      {user !== null && (
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
                    <Tab
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
                    />
                    <Tab
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
                  </TabList>
                </Box>
              </div>
              <div className="card-body">
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
                      setServer={setServer}
                      type={type}
                      optionsMeetingType={optionsMeetingType}
                      setType={setType}
                      place={place}
                      setPlace={setPlace}
                      roomName={roomName}
                      setRoomName={setRoomName}
                      errorRoomName={errorRoomName}
                      setErrorRoomName={setErrorRoomName}
                      onWrite={onWrite}
                      onHandleCancel={onHandleCancel}
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
                      roomName={roomName}
                      pass={pass}
                      getContentBySchedule={getContentBySchedule}
                      scheduleId={scheduleId}
                    />
                  </TabPanel>
                  <TabPanel value="calendar-setting-member">
                    <Member
                      memberOptions={memberOptions}
                      member={member}
                      setMember={setMember}
                      GetList_User={GetList_User}
                      setMemberList={setMemberList}
                      memberList={memberList}
                      user={user}
                      setMemberOptions={setMemberOptions}
                      memberDeleteList={memberDeleteList}
                      setMemberDeleteList={setMemberDeleteList}
                      memberEmail={memberEmail}
                      setMemberEmail={setMemberEmail}
                      setMemberEmailList={setMemberEmailList}
                      memberEmailList={memberEmailList}
                      memberEmailDeleteList={memberEmailDeleteList}
                      setMemberEmailDeleteList={setMemberEmailDeleteList}
                      scheduleId={scheduleId}
                      roomName={roomName}
                      pass={pass}
                      startTime={startTime}
                      getMeetingMember={getMeetingMember}
                      errorMember={errorMember}
                      setErrorMember={setErrorMember}
                    />
                  </TabPanel>
                  <TabPanel
                    value="calendar-setting-document"
                    style={
                      {
                        // padding: "0 20%",
                      }
                    }
                  >
                    <Document
                      InsertDocument={InsertDocument}
                      RemoveDocument={RemoveDocument}
                      doc={doc}
                      setDoc={setDoc}
                      docList={docList}
                      setDocList={setDocList}
                      docPostList={docPostList}
                      setDocPostList={setDocPostList}
                      docDeleteList={docDeleteList}
                      setDocDeleteList={setDocDeleteList}
                      scheduleId={scheduleId}
                      user={user}
                      getContentBySchedule={getContentBySchedule}
                      getMeetingDocument={getMeetingDocument}
                    />
                  </TabPanel>
                  <TabPanel value="calendar-setting-vote">
                    <Vote
                      scheduleId={scheduleId}
                      user={user}
                      voteList={voteList}
                      getMeetingVote={getMeetingVote}
                    />
                  </TabPanel>
                  <TabPanel value="calendar-setting-share-role">
                    <ChairMan
                      chairManOptions={chairManOptions}
                      chairMan={chairMan}
                      setChairMan={setChairMan}
                      GetList_User={GetList_User}
                      shareRoleOptions={shareRoleOptions}
                      shareRole={shareRole}
                      setShareRole={setShareRole}
                      scheduleId={scheduleId}
                      user={user}
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
                data-dismiss="modal"
                onClick={() => onHandleCancel()}
              >
                <i className="fas fa-undo"></i> Quay lại
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
