import { useEffect, useState } from "react";
import { ContainerOutlined } from "@ant-design/icons";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { Button, DatePicker } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import Api from "../../../api";
import ScrollbarsCustum from "../../../components/ScrollbarsCustum";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { PAGE_CURRENT, PAGE_SIZE, SESSION_STORAGE } from "../../../config";
import Helper from "../../../helper/helper";
import ChairMan from "./ChairMan";
import Conslusion from "./conslusion";
import Content from "./content";
import Document from "./document";
import Schedule from "./schedule";
import Vote from "./vote";
const { RangePicker } = DatePicker;
let timeoutUser;
let currentValueUser;
export const HandleTabsUpdate = ({
  id,
  contentCall,
  memberCall,
  memberEmailCall,
  documentCall,
  // user,
  onHandleCancel,
  openEdit,
  edit,
  permissions,
  user,
  setUser,
}) => {
  // const scrollBarRefPheDuyetContentWrapperModal = useRef();
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
  const [status, setStatus] = useState(edit?.status);
  const [start, setStart] = useState(edit?.start);
  const [endTime, setEndTime] = useState(dayjs(edit?.endTime));
  const [token, setToken] = useState(edit?.token);
  const [roomName, setRoomName] = useState(edit?.roomName);
  const [errorRoomName, setErrorRoomName] = useState(false);
  const [place, setPlace] = useState(edit?.place);
  const [type, setType] = useState(edit?.type);
  const [server, setServer] = useState(edit?.server);
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
  const [member, setMember] = useState([
    ...edit?.meetingMemberInside?.filter((x) => x?.activated === true),
    ...edit?.meetingMemberOutside?.filter((x) => x?.activated === true),
  ]);
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
  const [pass, setPass] = useState(edit?.password);
  const [passRequire, setPassRequire] = useState(
    !Helper.isNullOrUndefined(edit?.password) ? true : false
  );
  const [isPublished, setIsPublished] = useState(edit?.isPublished);
  const [isLobby, setIsLobby] = useState(edit?.isLobby);
  //
  //conslusion
  const [conslusionList, setConslusionList] = useState(
    edit?.meetingConslusion.map((item, index) => ({
      ...item,
      key: item?.id,
    }))
  );
  const [conslusionDeleteList, setConslusionDeleteList] = useState([]);
  const [conslusionRestoreList, setConslusionRestoreList] = useState([]);
  const [conslusionTitle, setConslusionTitle] = useState(null);
  const [conslusionContent, setConslusionContent] = useState(null);
  const [errorConslusion, setErrorConslusion] = useState(false);
  const [docConslusion, setDocConslusion] = useState("");
  const [docListConslusion, setDocListConslusion] = useState(
    edit?.meetingDocumentConclusion.map((item, index) => ({
      ...item,
      key: item?.id,
    }))
  );
  const [docPostListConslusion, setDocPostListConslusion] = useState([]);
  const [docDeleteListConslusion, setDocDeleteListConslusion] = useState([]);
  //
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

  // const onSetting = (id) => {
  //   if (id) {
  //     new Api()
  //       .get_schedule_byId({
  //         id: id,
  //       })
  //       .then((response) => {
  //         if (response?.data?.id) {
  //           //
  //           setTitle(response?.data?.title);
  //           setContent(response?.data?.content);
  //           setStartTime(dayjs(response?.data?.startTime));
  //           setEndTime(dayjs(response?.data?.endTime));
  //           setRoomName(response?.data?.roomName);
  //           setErrorRoomName(false);
  //           setPlace(response?.data?.place);
  //           setStatus(response?.data?.status);
  //           setStart(response?.data?.start);
  //           getServerById(response?.data?.serverId);
  //           getTypeById(response?.data?.typeId);
  //           setToken(response?.data?.token);
  //           setErrorSchedule(false);
  //           //
  //           setPass(response?.data?.password);
  //           setPassRequire(
  //             !Helper.isNullOrUndefined(response?.data?.password) ? true : false
  //           );
  //           setIsPublished(response?.data?.isPublished);
  //           setIsLobby(response?.data?.isLobby);
  //           //
  //           setChairMan(response?.data?.userChairMan);
  //           setShareRole(response?.data?.userShareRole);

  //           //Content
  //           getContentBySchedule(id); //

  //           //Member
  //           getMeetingMember(id); //
  //           //Document
  //           getMeetingDocument(id); //
  //           //Vote
  //           getMeetingVote(id);
  //           //Conslusion
  //           getConslusionBySchedule("", id);
  //           getMeetingDocumentConslusion(id);
  //         } else {
  //           SwalAlertAllConfiguration({
  //             title: "Thông báo!",
  //             text: "Không tìm thấy thông tin phòng họp",
  //             icon: "warning",
  //           });
  //         }
  //       });
  //   } else
  //     SwalAlertAllConfiguration({
  //       title: "Thông báo!",
  //       text: "Thông tin lịch không tồn tại",
  //       icon: "warning",
  //     });
  // };

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
      .get_content_byScheduleId({ id: id, pageNumber: 1, pageSize: 999999 })
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

  const getConslusionBySchedule = (search, id) => {
    new Api()
      .get_Conslusion_byScheduleId({
        search: search,
        id: id,
        pageSize: 999999,
        pageNumber: 1,
      })
      .then((res) => {
        if (res?.data) {
          setConslusionList(
            res?.data.map((item, index) => ({
              ...item,
              key: item?.id,
            }))
          );
        }
      });
  };

  const getMeetingDocument = (id) => {
    return new Api()
      .get_document_byFileUrl({
        url: "tailieu/" + id,
        pageNumber: 1,
        pageSize: 999999,
      })
      .then((response) => {
        if (response?.data) {
          setDocList(
            response?.data.map((item, index) => ({
              ...item,
              key: item?.id,
            }))
          );
        }
      });
  };

  const getMeetingDocumentConslusion = (id) => {
    return new Api()
      .get_document_byFileUrl({
        url: "ketluan/" + id,
        pageNumber: 1,
        pageSize: 999999,
      })
      .then((response) => {
        if (response?.data) {
          setDocListConslusion(
            response?.data.map((item, index) => ({
              ...item,
              key: item?.id,
            }))
          );
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
          setVoteList(
            response?.data.map((item, index) => ({
              ...item,
              key: item?.id,
            }))
          );
        }
      });
  };

  useEffect(() => {
    setTitle(edit?.title);
    setContent(edit?.content);
    setStartTime(dayjs(edit?.startTime));
    setEndTime(dayjs(edit?.endTime));
    setRoomName(edit?.roomName);
    setErrorRoomName(false);
    setPlace(edit?.place);
    setStatus(edit?.status);
    setStart(edit?.start);
    setServer(edit?.server);
    setType(edit?.type);
    setToken(edit?.token);
    setErrorSchedule(false);
    //
    setPass(edit?.password);
    setPassRequire(!Helper.isNullOrUndefined(edit?.password) ? true : false);
    setIsPublished(edit?.isPublished);
    setIsLobby(edit?.isLobby);
    //
    setChairMan(edit?.userChairMan);
    setShareRole(edit?.userShareRole);

    //Content
    setContentList(
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

    //Member
    setMemberList(
      edit?.meetingMemberInside.map((item, index) => ({
        ...item,
        key: item?.id,
        fullName: item?.user?.ten_day_du,
        userName: item?.user?.ten_dangnhap,
      }))
    );
    setMemberEmailList(
      edit?.meetingMemberOutside.map((item, index) => ({
        ...item,
        key: item?.id,
        email: item?.email,
      }))
    );
    setMember([
      ...edit?.meetingMemberInside?.filter((x) => x?.activated === true),
      ...edit?.meetingMemberOutside?.filter((x) => x?.activated === true),
    ]);
    //Document
    setDocList(
      edit?.meetingDocument.map((item, index) => ({
        ...item,
        key: item?.id,
      }))
    );
    //Vote
    setVoteList(
      edit?.meetingVotes.map((item, index) => ({
        ...item,
        key: item?.id,
      }))
    );
    //Conslusion
    setConslusionList(
      edit?.meetingConslusion.map((item, index) => ({
        ...item,
        key: item?.id,
      }))
    );
    setDocListConslusion(
      edit?.meetingDocumentConclusion.map((item, index) => ({
        ...item,
        key: item?.id,
      }))
    );
  }, [edit]);

  // useEffect(() => {
  //   if (!Helper.isNullOrUndefined(documentCall)) {
  //     setDocList(documentCall);
  //   }
  // }, [documentCall]);

  // useEffect(() => {
  //   if (!Helper.isNullOrUndefined(contentCall)) {
  //     setContentList(
  //       contentCall.map((item, index) => ({
  //         ...item,
  //         key: item?.id,
  //         thoigianbatdau: dayjs(item?.startTime),
  //         thoigianketthuc: dayjs(item?.endTime),
  //         nguoithuyettrinh: item?.userPresenters?.fullName,
  //       }))
  //     );
  //   }
  // }, [contentCall]);

  // useEffect(() => {
  //   if (!Helper.isNullOrUndefined(memberCall)) {
  //     setMemberList(
  //       memberCall.map((item, index) => ({
  //         ...item,
  //         key: item?.id,
  //         fullName: item?.user?.fullName,
  //         userName: item?.user?.userName,
  //       }))
  //     );
  //   }
  // }, [memberCall]);

  // useEffect(() => {
  //   if (!Helper.isNullOrUndefined(memberEmailCall)) {
  //     setMemberEmailList(
  //       memberEmailCall.map((item, index) => ({
  //         ...item,
  //         key: item?.id,
  //         email: item?.email,
  //       }))
  //     );
  //   }
  // }, [memberEmailCall]);

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
    new Api()
      .schedule_status({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        id: id,
        data: {
          status: status === 1 ? 2 : status === 2 ? 1 : 1,
          modifiedDate: new Date(),
          modifiedBy: user && user?.id,
        },
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
                    label="ỦY QUYỀN ĐIỀU HÀNH"
                    iconPosition="start"
                    value="calendar-setting-share-role"
                  />
                  <Tab
                    icon={<ContainerOutlined />}
                    label="NỘI DUNG KẾT LUẬN"
                    iconPosition="start"
                    value="calendar-setting-conslusion"
                  />
                </TabList>
              </Box>
            </div>
            <div className="card-body">
              <ScrollbarsCustum
                // ref={scrollBarRefPheDuyetContentWrapperModal}
                style={{
                  height: window.innerHeight / 2,
                  maxHeight: window.innerHeight / 2 + "px",
                  //   height: 400,
                  // maxHeight: "400px",
                }}
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={200}
              >
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
                      contentRestoreList={contentRestoreList}
                      setContentRestoreList={setContentRestoreList}
                      sortedType={sortedType}
                      setSortedInfo={setSortedInfo}
                      setSortedType={setSortedType}
                      sortedInfo={sortedInfo}
                      roomName={roomName}
                      pass={pass}
                      getContentBySchedule={getContentBySchedule}
                      id={id}
                    />
                  </TabPanel>
                  <TabPanel value="calendar-setting-document">
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
                      docRestoreList={docRestoreList}
                      setDocRestoreList={setDocRestoreList}
                      id={id}
                      user={user}
                      getContentBySchedule={getContentBySchedule}
                      getMeetingDocument={getMeetingDocument}
                    />
                  </TabPanel>
                  <TabPanel value="calendar-setting-vote">
                    <Vote
                      id={id}
                      user={user}
                      voteList={voteList}
                      getMeetingVote={getMeetingVote}
                      votesDeleteList={votesDeleteList}
                      setVotesDeleteList={setVotesDeleteList}
                      votesRestoreList={votesRestoreList}
                      setVotesRestoreList={setVotesRestoreList}
                      member={member}
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
                      id={id}
                      user={user}
                    />
                  </TabPanel>
                  <TabPanel value="calendar-setting-conslusion">
                    <Conslusion
                      conslusionList={conslusionList}
                      setConslusionList={setConslusionList}
                      conslusionDeleteList={conslusionDeleteList}
                      setConslusionDeleteList={setConslusionDeleteList}
                      conslusionRestoreList={conslusionRestoreList}
                      setConslusionRestoreList={setConslusionRestoreList}
                      conslusionTitle={conslusionTitle}
                      setConslusionTitle={setConslusionTitle}
                      conslusionContent={conslusionContent}
                      setConslusionContent={setConslusionContent}
                      errorConslusion={errorConslusion}
                      setErrorConslusion={setErrorConslusion}
                      docConslusion={docConslusion}
                      setDocConslusion={setDocConslusion}
                      docListConslusion={docListConslusion}
                      setDocListConslusion={setDocListConslusion}
                      docPostListConslusion={docPostListConslusion}
                      setDocPostListConslusion={setDocPostListConslusion}
                      docDeleteListConslusion={docDeleteListConslusion}
                      setDocDeleteListConslusion={setDocDeleteListConslusion}
                      id={id}
                      user={user}
                      getMeetingDocumentConslusion={
                        getMeetingDocumentConslusion
                      }
                      getConslusionBySchedule={getConslusionBySchedule}
                    />
                  </TabPanel>
                </div>
              </ScrollbarsCustum>
            </div>
          </TabContext>
        </div>
        <div className="row form-group">
          <div className="col-md-12 align-center m-1">
            {/* <Button
                className="btn btn-sm btn-default m-1"
                onClick={() => onWrite()}
              >
                <i className="fas fa-check-double" />{" "}
                {status === 1
                  ? "Phê duyệt lịch họp"
                  : status === 2 && "Hủy duyệt lịch họp"}
              </Button> */}
            <Button
              className="btn btn-sm btn-default m-1"
              data-dismiss="modal"
              onClick={() => onHandleCancel()}
            >
              <i className="fas fa-ban red"></i> Thoát
            </Button>
          </div>
        </div>
      </>
    </>
  );
};
