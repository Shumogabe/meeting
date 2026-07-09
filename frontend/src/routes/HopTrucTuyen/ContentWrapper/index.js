import React, { useEffect, useRef, useState } from "react";
import { DragOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import { Helmet } from "react-helmet";
import Api from "../../../api";
import { SwalAlertTimeRedirect } from "../../../components/Swal";
import { SESSION_STORAGE } from "../../../config";
import { HREF } from "../../../constants/dictionaries";
import Helper from "../../../helper/helper";
import userManager from "../../../services/auth";
import { Theme } from "../../../theme";
import ButtonMeeting from "./ButtonMeeting";
import StartMeet from "./StartMeet";
import BieuQuyet from "./TabPanes/BieuQuyet";
import KetLuan from "./TabPanes/KetLuan";
import MeetingDocument from "./TabPanes/TaiLieu";
import Thongtin from "./TabPanes/ThongTin";
import MeetingChat from "./TabPanes/TraoDoi";
import MeetingPaint from "./TabPanes/TrinhBay";
import { Button } from "antd";
import ChuongTrinh from "./TabPanes/ChuongTrinh";
import ThanhPhan from "./TabPanes/ThanhPhan";
import { isValidUUID } from "../../../helper/url";

export default function ContentWrapper({
  scheduleSidebar,
  setScheduleSideBar,
  roomMini,
  setLoading,
  displayJoinName,
  setDisplayJoinName,
  permissions,
  user,
  setUser,
  online,
  setOnline,
}) {
  const apiRef = useRef();
  const refs = useRef([]);

  const [tileViewCount, setTileViewCount] = useState("show");

  const [isMouseActive, setIsMouseActive] = useState(false);

  const [firmstrip, setFirmstrip] = useState("1");

  const [logItems, updateLog] = useState([]);
  const [knockingParticipants, updateKnockingParticipants] = useState([]);

  const [owner, setOwner] = useState(null);

  const [availableDevicesAudioInput, setAvailableDevicesAudioInput] =
    useState(false);
  const [availableDevicesVideoInput, setAvailableDevicesVideoInput] =
    useState(false);
  const [availableDevicesAudioOutput, setAvailableDevicesAudioOutput] =
    useState(false);

  const [currentDevicesAudioInput, setCurrentDevicesAudioInput] = useState("");
  const [currentDevicesVideoInput, setCurrentDevicesVideoInput] = useState("");
  const [currentDevicesAudioOutput, setCurrentDevicesAudioOutput] =
    useState("");

  const [isToggleTileView, setIsToggleTileView] = useState(false);
  const [isParticipants, setIsParticipants] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [startWithAudioMuted, setStartWithAudioMuted] = useState(false);
  const [startWithVideoMuted, setStartWithVideoMuted] = useState(false);
  const [isHand, setIsHand] = useState(false);
  const [isChat, setIsChat] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recording, setRecording] = useState(false);
  const [liveStream, setLiveStream] = useState(false);
  const [shareVideo, setShareVideo] = useState(false);
  const [shareScreen, setShareScreen] = useState(false);
  const [qualityVideo, setQualityVideo] = useState(0);
  const [recordingLinkAvailable, setRecordingLinkAvailable] = useState(null);
  const [recordingStatusChanged, setRecordingStatusChanged] = useState(null);

  // const [user, setUser] = useState(null);
  const [meetingData, setMeetingData] = useState(null);
  // const [displayJoinName, setDisplayJoinName] = useState(false);
  const [displayLobby, setDisplayLobby] = useState(false);
  const [roomLink, setRoomLink] = useState(window.location.href);

  const marginTopLayout = window.innerWidth > 1023 ? " -54px " : " -8px ";
  const marginRightLayout = window.innerWidth > 1023 ? " 26px " : " -15px ";

  let mouseMoveTimer;
  const handleMouseMove = () => {
    // console.log("Mouse is moving");
    setIsMouseActive(true);
  };
  const handleMouseStop = () => {
    // console.log("Mouse has stopped");
    setIsMouseActive(false);
  };
  const handleMouseEvent = () => {
    if (mouseMoveTimer) clearTimeout(mouseMoveTimer);
    handleMouseMove();
    mouseMoveTimer = setTimeout(handleMouseStop, 3000);
  };

  const printEventOutput = (payload) => {
    updateLog((items) => [...items, JSON.stringify(payload)]);
    if (payload?.id) {
      if (payload?.handRaised > 0) {
        setIsHand(true);
      }
      if (payload?.handRaised === 0) {
        setIsHand(false);
      }
    }
    setIsToggleTileView(payload?.enabled);
    setIsParticipants(payload?.open);
    setQualityVideo(payload?.videoQuality);
    setShareScreen(payload?.on);
    setAvailableDevicesAudioInput(payload?.devices?.audioInput);
    setAvailableDevicesAudioOutput(payload?.devices?.audioOutput);
    setAvailableDevicesVideoInput(payload?.devices?.videoInput);
    setRecordingLinkAvailable(payload?.link);
    setRecording(payload?.on);
  };

  const handleAudioStatusChange = (payload, feature) => {
    if (payload.muted) {
      updateLog((items) => [...items, `${feature} off`]);
      switch (feature) {
        case "video":
          setIsVideoMuted(false);
          break;
        case "audio":
          setIsAudioMuted(false);
          break;
        default:
          break;
      }
    } else {
      updateLog((items) => [...items, `${feature} on`]);
      switch (feature) {
        case "video":
          setIsVideoMuted(true);
          break;
        case "audio":
          setIsAudioMuted(true);
          break;
        default:
          break;
      }
    }
  };

  const handleChatUpdates = (payload) => {
    updateLog((items) => [
      ...items,
      `Bạn có ${payload.unreadCount} tin nhắn chưa đọc!`,
    ]);
    setIsChat(payload?.isOpen);
    setUnreadCount(payload?.unreadCount);
  };

  const handleKnockingParticipant = (payload) => {
    updateLog((items) => [...items, JSON.stringify(payload)]);
    updateKnockingParticipants((participants) => [
      ...participants,
      payload?.participant,
    ]);
  };

  const handleJitsiIFrameRef = (iframeRef) => {
    iframeRef.style.background = "#3d3d3d";
    iframeRef.style.height =
      window.innerWidth < 600 ? "calc(100vh - 56px)" : "calc(100vh - 74px)";
    iframeRef.style.marginTop =
      window.innerWidth < 600 ? marginTopLayout : marginTopLayout;
    iframeRef.style.marginRight = window.innerWidth < 600 ? "-15px" : "26px";
    iframeRef.style.marginBottom = window.innerWidth < 600 ? "7px" : "-31px";
    iframeRef.style.marginLeft =
      !Helper.isNullOrUndefined(
        document.getElementById("meeting-sidebar").offsetWidth,
      ) &&
      Number(-document.getElementById("meeting-sidebar").offsetWidth - 7 - 8) +
        "px";
    refs.current[3] = iframeRef;
    setLoading(iframeRef);
    getValue();
  };

  const handleApiReady = (apiObj) => {
    apiRef.current = apiObj;
    apiRef.current.on("knockingParticipant", handleKnockingParticipant);
    apiRef.current.on("audioMuteStatusChanged", (payload) =>
      handleAudioStatusChange(payload, "audio"),
    );
    apiRef.current.on("videoMuteStatusChanged", (payload) =>
      handleAudioStatusChange(payload, "video"),
    );
    apiRef.current.on("raiseHandUpdated", printEventOutput);
    apiRef.current.on("tileViewChanged", printEventOutput);
    apiRef.current.on("participantsPaneToggled", printEventOutput);
    apiRef.current.on("videoQualityChanged", printEventOutput);
    apiRef.current.on("screenSharingStatusChanged", printEventOutput);
    apiRef.current.on("deviceListChanged", printEventOutput);
    apiRef.current.on("passwordRequired", printEventOutput);
    apiRef.current.on("recordingLinkAvailable", printEventOutput);
    apiRef.current.on("recordingStatusChanged", printEventOutput);
    apiRef.current.on("participantJoined", getValue);
    apiRef.current.on("participantLeft", getValue);
    apiRef.current.on("participantKickedOut", getValue);
    apiRef.current.on("chatUpdated", handleChatUpdates);
    // apiRef.current.on("mouseEnter", (e) => {
    //   // getValue();
    // });
    // apiRef.current.on("mouseMove", (e) => {
    //   getValue();
    //   setIsMouseActive(true);
    //   setTimeout(() => {
    //     setIsMouseActive(false);
    //   }, 2000);
    // });

    apiRef.current.on("mouseMove", (e) => {
      // getValue();
      handleMouseEvent();
      // onHandleCheckUser();
    });

    // apiRef.current.on("mouseLeave", () => {
    //   // getValue();
    //   // setIsMouseActive(false);
    // });

    getDevice();
    setQualityVideo(apiRef.current.getVideoQuality());
    apiRef.current.isAudioMuted().then((muted) => {
      setIsAudioMuted(!muted);
    });
    apiRef.current.isVideoMuted().then((muted) => {
      setIsVideoMuted(!muted);
    });
    getValue();
  };

  const handleReadyToClose = () => {
    window.location.href = HREF.TrangChu;
  };

  const getValue = () => {
    // alert(JSON.stringify(apiRef.current.getParticipantsInfo()));
    // Kiểm tra quyền quản trị viên trên jitsi
    // onUser(meetingData);
    apiRef.current.getRoomsInfo().then((rooms) => {
      if (rooms?.rooms[0]?.isMainRoom) {
        // return console.log(meetingData?.schedule);
        // meetingData?.schedule?.userChairMan?.ten_dangnhap
        // meetingData?.schedule?.userShareRole?.ten_dangnhap
        // meetingData?.schedule?.userSupport?.ten_dangnhap
        // meetingData?.schedule?.userTechnician?.ten_dangnhap
        let items = rooms?.rooms[0]?.participants;
        items?.forEach((item) => {
          if (
            // item?.displayName.split(" - ")[0] ===
            //   meetingData?.schedule?.userChairMan?.ten_dangnhap ||
            // item?.displayName.split(" - ")[0] ===
            //   meetingData?.schedule?.userShareRole?.ten_dangnhap ||
            // item?.displayName.split(" - ")[0] ===
            //   meetingData?.schedule?.userSupport?.ten_dangnhap ||
            // item?.displayName.split(" - ")[0] ===
            //   meetingData?.schedule?.userTechnician?.ten_dangnhap
            item?.displayName ===
              meetingData?.schedule?.userChairMan?.ten_dangnhap +
                " - Chủ trì" ||
            item?.displayName ===
              meetingData?.schedule?.userShareRole?.ten_dangnhap +
                " - Thư ký" ||
            item?.displayName ===
              meetingData?.schedule?.userSupport?.ten_dangnhap +
                " - Chuyên viên hỗ trợ" ||
            item?.displayName ===
              meetingData?.schedule?.userTechnician?.ten_dangnhap +
                " - Kỹ thuật viên"
          ) {
            apiRef.current.executeCommand("grantModerator", item?.id);
          } else {
            // window.location.reload();
          }
        });
      }
    });
    apiRef.current.getCurrentDevices().then((devices) => {
      setCurrentDevicesAudioInput(devices?.audioInput);
      setCurrentDevicesAudioOutput(devices?.audioOutput);
      setCurrentDevicesVideoInput(devices?.videoInput);
      // devices = {
      //     audioInput: {
      //         deviceId: 'ID'
      //         groupId: 'grpID'
      //         kind: 'videoInput'
      //         label: 'label'
      //     },
      //     audioOutput: {
      //         deviceId: 'ID'
      //         groupId: 'grpID'
      //         kind: 'videoInput'
      //         label: 'label'
      //     },
      //     videoInput: {
      //         deviceId: 'ID'
      //         groupId: 'grpID'
      //         kind: 'videoInput'
      //         label: 'label'
      //     }
      // }
    });
    setScheduleSideBar((pre) => ({
      ...pre,
      schedule: meetingData?.schedule,
      participants: apiRef.current.getParticipantsInfo(),
      numberOfParticipants: apiRef.current.getNumberOfParticipants(),
    }));
    if (
      !Helper.isNullOrUndefined(
        JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
      )
    ) {
      new Api().create_QuanLyBaoCaoThongKe({
        token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
          ?.access_token,
        key: "QuanLyThongKeTongSoNguoiThamGiaCuocHopDangDienRa",
        data: {
          title: meetingData?.schedule?.id,
          content:
            // meetingData?.schedule?.id +
            // " / " +
            apiRef.current.getNumberOfParticipants(),
        },
      });
    }
  };

  const getDevice = () => {
    apiRef.current.getAvailableDevices().then((devices) => {
      setAvailableDevicesAudioInput(devices?.audioInput);
      setAvailableDevicesAudioOutput(devices?.audioOutput);
      setAvailableDevicesVideoInput(devices?.videoInput);
    });
  };

  const setDevice = (device, label, id) => {
    if (device === "setAudioInputDevice") {
      apiRef.current.setAudioInputDevice(label, id);
    }
    if (device === "setAudioOutputDevice") {
      apiRef.current.setAudioOutputDevice(label, id);
    }
    if (device === "setVideoInputDevice") {
      apiRef.current.setVideoInputDevice(label, id);
    }
  };

  // custom events
  const executeCommand = (command, value) => {
    if (command === "toggleTileView") {
      setIsToggleTileView(!isToggleTileView);
      apiRef.current.executeCommand("toggleTileView");
    }
    if (command === "toggleParticipantsPane") {
      setIsParticipants(!isParticipants);
      apiRef.current.executeCommand("toggleParticipantsPane", !isParticipants);
    }
    if (command === "toggleHangup") {
      apiRef.current.executeCommand("hangup");
    }
    if (command === "toggleAudio") {
      setIsAudioMuted(!isAudioMuted);
      apiRef.current.executeCommand("toggleAudio");
    }
    if (command === "toggleVideo") {
      setIsVideoMuted(!isVideoMuted);
      apiRef.current.executeCommand("toggleVideo");
    }
    if (command === "toggleHand") {
      setIsHand(!isHand);
      apiRef.current.executeCommand("toggleRaiseHand");
    }
    if (command === "toggleChat") {
      setIsChat(!isChat);
      apiRef.current.executeCommand("toggleChat");
    }
    if (command === "toggleShareScreen") {
      apiRef.current.executeCommand("toggleShareScreen");
    }
    if (command === "toggleFilmStrip") {
      apiRef.current.executeCommand("toggleFilmStrip");
    }
    if (command === "toggleVirtualBackgroundDialog") {
      apiRef.current.executeCommand("toggleVirtualBackgroundDialog");
    }
    if (command === "recording") {
      if (!recording) {
        setRecording(true);
        apiRef.current.executeCommand("startRecording", {
          mode: "local", //recording mode, either `local`, `file` or `stream`.
          // dropboxToken: string, //dropbox oauth2 token.
          onlySelf: value, //Whether to only record the local streams. Only applies to `local` recording mode.
          // shouldShare: false, //whether the recording should be shared with the participants or not. Only applies to certain jitsi meet deploys.
          // rtmpStreamKey: string, //the RTMP stream key.
          // rtmpBroadcastID: string, //the RTMP broadcast ID.
          // youtubeStreamKey: value, //the youtube stream key.
          // youtubeBroadcastID: string, //the youtube broacast ID.
          // extraMetada: Object, // any extra metada for file recording.
        });
      } else {
        setRecording(false);
        // apiRef.current.executeCommand('stopRecording', {
        //   mode: 'local', //recording mode to stop, `local`, `stream` or `file`
        // });
        apiRef.current.stopRecording("local");
      }
    }
    // if (command === 'livestream') {
    //   if (!liveStream) {
    //     setLiveStream(true);
    //     apiRef.current.executeCommand('startRecording', {
    //       mode: 'stream', //recording mode, either `local`, `file` or `stream`.
    //       // dropboxToken: string, //dropbox oauth2 token.
    //       // onlySelf: boolean, //Whether to only record the local streams. Only applies to `local` recording mode.
    //       //shouldShare: false, //whether the recording should be shared with the participants or not. Only applies to certain jitsi meet deploys.
    //       // rtmpStreamKey: string, //the RTMP stream key.
    //       // rtmpBroadcastID: string, //the RTMP broadcast ID.
    //       youtubeStreamKey: value, //the youtube stream key.
    //       // youtubeBroadcastID: string, //the youtube broacast ID.
    //       // extraMetada: Object, // any extra metada for file recording.
    //     });
    //   } else {
    //     setLiveStream(false);
    //     apiRef.current.executeCommand('stopRecording', {
    //       mode: 'stream', //recording mode to stop, `stream` or `file`
    //     });
    //   }
    // }
    if (command === "sharevideo") {
      if (!shareVideo) {
        setShareVideo(true);
        apiRef.current.executeCommand("startShareVideo", value);
      } else {
        setShareVideo(false);
        apiRef.current.executeCommand("stopShareVideo");
      }
    }
    if (command === "videoquality") {
      apiRef.current.executeCommand("setVideoQuality", value);
    }
    if (command === "shareaudio") {
      apiRef.current.executeCommand("startShareAudio");
    }
    if (command === "lobby") {
      apiRef.current.executeCommand("toggleLobby", value);
    }
    if (command === "password") {
      apiRef.current.executeCommand("password", value);
    }
    if (command === "noisesuppression") {
      apiRef.current.executeCommand("setNoiseSuppressionEnabled", {
        enabled: value, // Enable or disable noise suppression.
      });
    }
    if (command === "background") {
      apiRef.current.executeCommand("toggleVirtualBackgroundDialog");
    }
    if (command === "name") {
      apiRef.current.executeCommand("displayName", value);
    }
    if (command === "email") {
      apiRef.current.executeCommand("email", value);
    }
  };

  const renderSpinner = () => (
    <div
      style={{
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      Loading..
    </div>
  );

  const onMeeting = (data) => {
    if (data?.data?.id) {
      return axios
        .all([
          new Api().get_voted_byScheduleId({
            id: data?.data?.id,
          }),
          new Api().getPlanScheduleId({
            id: data?.data?.id,
          }),
        ])
        .then(
          axios.spread((resp1, resp2) => {
            let res = {
              schedule: data?.data,
              content: data?.data?.meetingContent,
              document: data?.data?.meetingDocument,
              memberInside: data?.data?.meetingMemberInside,
              memberOutside: data?.data?.meetingMemberOutside,
              member: [
                ...data?.data?.meetingMemberInside,
                ...data?.data?.meetingMemberOutside,
              ],
              voted: resp1?.data,
              votes: data?.data?.meetingVotes,
              plan: resp2?.data,
              video: data?.data?.meetingVideo,
            };

            setMeetingData(res);
            onUser(res);
            setScheduleSideBar((pre) => ({
              ...pre,
              schedule: data?.data,
            }));
          }),
        );
    }
  };

  const onUser = (meetData) => {
    // alert(sessionStorage.getItem(SESSION_STORAGE));
    if (!Helper.isNullOrUndefined(sessionStorage.getItem(SESSION_STORAGE))) {
      new Api()
        .CheckThongTinCanBo({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
        })
        .then((resp) => {
          if (!Helper.isNullOrUndefined(resp)) {
            setUser(resp);
            onHandleCheckUser(resp, true, true, meetData);
          } else {
            window.location.href = HREF.DangNhap;
          }
        });
    } else {
      if (!Helper.isNullOrUndefined(localStorage.getItem("user"))) {
        onHandleCheckUser(
          JSON.parse(localStorage.getItem("user")),
          true,
          true,
          meetData,
        );
      } else {
        const [link_room_and_mail] = roomLink?.split("/").slice(-1);
        const arr_link_room_and_mail = link_room_and_mail?.split("&mail=");
        if (
          arr_link_room_and_mail.length > 1 &&
          !Helper.isNullOrUndefined(arr_link_room_and_mail[1])
        ) {
          const localStorage_user = {
            fullName: arr_link_room_and_mail[1],
            email: arr_link_room_and_mail[1],
            userName: arr_link_room_and_mail[1],
          };
          localStorage.setItem("user", JSON.stringify(localStorage_user));
          onHandleCheckUser(localStorage_user, true, true, meetData);
        }
        onHandleCheckUser(null, true, true, meetData);
      }
    }
  };

  const onHandleCheckRoom = () => {
    // const [room] = roomLink.split("/").slice(-1);
    const urlParams = new URLSearchParams(window.location.search);

    const mailValue = urlParams.get("mail");
    const fullNameValue = urlParams.get("fullname");

    const pathSegments = window.location.pathname?.split("/");
    const room = pathSegments[pathSegments.length - 1];

    const localStorage_user = {
      fullName: fullNameValue ?? "",
      email: mailValue ?? "",
      userName: fullNameValue ?? "",
    };
    localStorage.setItem("user", JSON.stringify(localStorage_user));
    if (!isValidUUID(room)) {
      if (!Helper.isNullOrUndefined(room)) {
        new Api()
          .get_schedule_byRoomName({ room: room })
          .then((response) => {
            if (!Helper.isNullOrUndefined(response?.data?.id)) {
              // if (
              //   moment(response?.data?.endTime).valueOf() < moment().valueOf()
              // ) {
              //   if (response?.data?.start === true) {
              //     new Api().schedule_start({
              //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              //         ?.access_token,
              //       id: response?.data?.id,
              //       data: {
              //         start: false,
              //         // modifiedBy: user?.id,
              //         // modifiedDate: new Date(),
              //       },
              //     });
              //   }
              //   if (response?.data?.status !== 3) {
              //     new Api().schedule_status({
              //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              //         ?.access_token,
              //       id: response?.data?.id,
              //       data: {
              //         status: 3,
              //         // modifiedBy: user?.id,
              //         // modifiedDate: new Date(),
              //       },
              //     });
              //   }
              //   SwalAlertTimeRedirect({
              //     title: "Thông báo!",
              //     text: "Lịch họp đã kết thúc!",
              //     timer: 3000,
              //     redirect: HREF.LichHop,
              //     icon: "warning",
              //   });
              // } else if (response?.data?.status !== 2) {
              //   SwalAlertTimeRedirect({
              //     title: "Thông báo!",
              //     text: "Lịch họp chưa được phê duyệt!",
              //     timer: 3000,
              //     redirect: HREF.LichHop,
              //     icon: "warning",
              //   });
              // } else if (!response?.data?.start) {
              //   SwalAlertTimeRedirect({
              //     title: "Thông báo!",
              //     text: "Lịch họp chưa được bắt đầu!",
              //     timer: 3000,
              //     redirect: HREF.LichHop,
              //     icon: "warning",
              //   });
              // } else {
              //   onMeeting(response);
              // }
              if (response?.data?.status === 2 && response?.data?.start)
                setOnline(true);
              onMeeting(response);
            } else {
              SwalAlertTimeRedirect({
                title: "Thông báo!",
                text: "Lịch họp không tồn tại!",
                timer: 3000,
                redirect: HREF.LichHop,
                icon: "warning",
              });
            }
          })
          .catch((error) => {
            //console.log(error);
          });
      } else {
        SwalAlertTimeRedirect({
          title: "Thông báo!",
          text: "Lịch họp không tồn tại!",
          timer: 3000,
          redirect: HREF.LichHop,
          icon: "warning",
        });
      }

      // window.location.href = HREF.TrangChu;
    } else {
      if (!Helper.isNullOrUndefined(room)) {
        new Api()
          .get_schedule_byId({ id: room })
          .then((response) => {
            if (!Helper.isNullOrUndefined(response?.data?.id)) {
              // if (
              //   moment(response?.data?.endTime).valueOf() < moment().valueOf()
              // ) {
              //   if (response?.data?.start === true) {
              //     new Api().schedule_start({
              //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              //         ?.access_token,
              //       id: response?.data?.id,
              //       data: {
              //         start: false,
              //         // modifiedBy: user?.id,
              //         // modifiedDate: new Date(),
              //       },
              //     });
              //   }
              //   if (response?.data?.status !== 3) {
              //     new Api().schedule_status({
              //       token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              //         ?.access_token,
              //       id: response?.data?.id,
              //       data: {
              //         status: 3,
              //         // modifiedBy: user?.id,
              //         // modifiedDate: new Date(),
              //       },
              //     });
              //   }
              //   SwalAlertTimeRedirect({
              //     title: "Thông báo!",
              //     text: "Lịch họp đã kết thúc!",
              //     timer: 3000,
              //     redirect: HREF.LichHop,
              //     icon: "warning",
              //   });
              // } else if (response?.data?.status !== 2) {
              //   SwalAlertTimeRedirect({
              //     title: "Thông báo!",
              //     text: "Lịch họp chưa được phê duyệt!",
              //     timer: 3000,
              //     redirect: HREF.LichHop,
              //     icon: "warning",
              //   });
              // } else if (!response?.data?.start) {
              //   SwalAlertTimeRedirect({
              //     title: "Thông báo!",
              //     text: "Lịch họp chưa được bắt đầu!",
              //     timer: 3000,
              //     redirect: HREF.LichHop,
              //     icon: "warning",
              //   });
              // } else {
              //   onMeeting(response);
              // }
              if (response?.data?.status === 0) {
                SwalAlertTimeRedirect({
                  title: "Thông báo!",
                  text: "Phòng họp chưa được phê duyệt!",
                  timer: 3000,
                  redirect: HREF.LichCongTac,
                  icon: "warning",
                });
              }
              if (response?.data?.status === 2 && response?.data?.start)
                setOnline(true);
              onMeeting(response);
            } else {
              SwalAlertTimeRedirect({
                title: "Thông báo!",
                text: "Lịch họp không tồn tại!",
                timer: 3000,
                redirect: HREF.LichHop,
                icon: "warning",
              });
            }
          })
          .catch((error) => {
            //console.log(error);
          });
      } else {
        SwalAlertTimeRedirect({
          title: "Thông báo!",
          text: "Lịch họp không tồn tại!",
          timer: 3000,
          redirect: HREF.LichHop,
          icon: "warning",
        });
      }
    }
  };

  const onHandleCheckUser = (userInfo, audio, video, meetData) => {
    setDisplayJoinName(false);
    setStartWithAudioMuted(audio);
    setStartWithVideoMuted(video);
    if (!Helper.isNullOrUndefined(userInfo)) {
      if (!Helper.isNullOrUndefined(userInfo?.id)) {
        if (meetData?.schedule?.sharedRole === userInfo?.id) {
          setOwner(1);
          setUser((pre) => ({
            ...pre,
            userName: userInfo?.ten_dangnhap?.split(" - ")[0] + " - Thư ký",
            email: userInfo?.email,
          }));
          return;
        }
        if (meetData?.schedule?.chairMan === userInfo?.id) {
          setOwner(1);
          setUser((pre) => ({
            ...pre,
            userName: userInfo?.ten_dangnhap?.split(" - ")[0] + " - Chủ trì",
            email: userInfo?.email,
          }));
          return;
        }
        if (meetData?.schedule?.isPublished === true) {
          let inListMem = 0;
          let inListCon = 0;
          let inListContent = "";
          meetData?.member
            ?.filter((x) => x.activated === true)
            ?.forEach((element) => {
              if (
                element?.userId === userInfo?.id ||
                element?.email === userInfo?.email
              ) {
                inListMem++;
              }
            });
          meetData?.content
            ?.filter((x) => x.status === 2)
            .forEach((e) => {
              if (e?.presenters === userInfo?.id) {
                inListCon++;
                inListContent = e?.title;
              }
            });
          if (inListMem === 0) {
            // if (Helper.isNullOrUndefined(meetData?.schedule?.password)) {
            //   SwalAlertTimeRedirect({
            //     title: "Thông báo!",
            //     text: "Bạn không phải thành viên phòng họp!",
            //     timer: 3000,
            //     redirect: HREF.LichHop,
            //     icon: "warning",
            //   });
            //   return;
            // } else {
            //   setDisplayJoinName(true);
            //   return;
            // }
            setOwner(2);
            setUser((pre) => ({
              ...pre,
              userName:
                (userInfo?.ten_dangnhap
                  ? userInfo?.ten_dangnhap?.split(" - ")[0]
                  : userInfo?.email?.split(" - ")[0]) + " - Khách mời",
              email: userInfo?.email,
            }));
            return;
          }
          if (inListMem !== 0) {
            setOwner(2);
            setUser((pre) => ({
              ...pre,
              userName:
                (userInfo?.ten_dangnhap
                  ? userInfo?.ten_dangnhap?.split(" - ")[0]
                  : userInfo?.email?.split(" - ")[0]) + " - Đại biểu",
              email: userInfo?.email,
            }));
            return;
          }
          if (inListCon === 0) {
            if (Helper.isNullOrUndefined(meetData?.schedule?.password)) {
              SwalAlertTimeRedirect({
                title: "Thông báo!",
                text: "Bạn không phải thành viên phòng họp!",
                timer: 3000,
                redirect: HREF.LichHop,
                icon: "warning",
              });
              return;
            } else {
              setDisplayJoinName(true);
              return;
            }
          }
          if (inListCon !== 0) {
            setOwner(2);
            setUser((pre) => ({
              ...pre,
              userName:
                userInfo?.ten_dangnhap?.split(" - ")[0] +
                " - dẫn chương trình: " +
                inListContent,
              email: userInfo?.email,
            }));
            return;
          }
          setOwner(2);
          setUser((pre) => ({
            ...pre,
            userName:
              (userInfo?.ten_dangnhap
                ? userInfo?.ten_dangnhap?.split(" - ")[0]
                : userInfo?.email?.split(" - ")[0]) + " - Khách mời",
            email: userInfo?.email,
          }));
          return;
        }
        if (meetData?.schedule?.isPublished === false) {
          let inListMem = 0;
          let inListCon = 0;
          let inListContent = "";
          meetData?.member
            ?.filter((x) => x.activated === true)
            ?.forEach((element) => {
              if (
                element?.userId === userInfo?.id ||
                element?.email === userInfo?.email
              ) {
                inListMem++;
              }
            });
          meetData?.content
            ?.filter((x) => x.status === 2)
            .forEach((e) => {
              if (e?.presenters === userInfo?.id) {
                inListCon++;
                inListContent = e?.title;
              }
            });
          if (inListMem === 0) {
            if (Helper.isNullOrUndefined(meetData?.schedule?.password)) {
              SwalAlertTimeRedirect({
                title: "Thông báo!",
                text: "Bạn không phải thành viên phòng họp!",
                timer: 3000,
                redirect: HREF.LichHop,
                icon: "warning",
              });
              return;
            } else {
              setDisplayJoinName(true);
              return;
            }
          }
          if (inListMem !== 0) {
            setOwner(2);
            setUser((pre) => ({
              ...pre,
              userName:
                (userInfo?.ten_dangnhap
                  ? userInfo?.ten_dangnhap?.split(" - ")[0]
                  : userInfo?.email?.split(" - ")[0]) + " - Đại biểu",
              email: userInfo?.email,
            }));
            return;
          }
          if (inListCon === 0) {
            if (Helper.isNullOrUndefined(meetData?.schedule?.password)) {
              SwalAlertTimeRedirect({
                title: "Thông báo!",
                text: "Bạn không phải thành viên phòng họp!",
                timer: 3000,
                redirect: HREF.LichHop,
                icon: "warning",
              });
              return;
            } else {
              setDisplayJoinName(true);
              return;
            }
          }
          if (inListCon !== 0) {
            setOwner(2);
            setUser((pre) => ({
              ...pre,
              userName:
                userInfo?.ten_dangnhap?.split(" - ")[0] +
                " - dẫn chương trình: " +
                inListContent,
              email: userInfo?.email,
            }));
            return;
          }
        }
      } else {
        if (meetData?.schedule?.isPublished === true) {
          if (Helper.isNullOrUndefined(meetData?.schedule?.password)) {
            localStorage.setItem("user", JSON.stringify(userInfo));
            setOwner(2);
            setUser((pre) => ({
              ...pre,
              userName:
                (userInfo?.fullName?.split(" - ")[0] ??
                  userInfo?.userName?.split(" - ")[0] ??
                  userInfo?.ten_dangnhap?.split(" - ")[0] ??
                  userInfo?.email?.split(" - ")[0]) + " - Khách mời",
              email: userInfo?.email,
            }));
            return;
          }
          if (!Helper.isNullOrUndefined(meetData?.schedule?.password)) {
            localStorage.setItem("user", JSON.stringify(userInfo));
            // setOwner(2);
            setUser((pre) => ({
              ...pre,
              userName:
                (userInfo?.fullName?.split(" - ")[0] ??
                  userInfo?.userName?.split(" - ")[0] ??
                  userInfo?.ten_dangnhap?.split(" - ")[0] ??
                  userInfo?.email?.split(" - ")[0]) + " - Khách mời",
              email: userInfo?.email,
            }));
            setDisplayJoinName(true);
            return;
          }
        }
        if (meetData?.schedule?.isPublished === false) {
          SwalAlertTimeRedirect({
            title: "Thông báo!",
            text: "Bạn không phải thành viên phòng họp!",
            timer: 3000,
            redirect: HREF.LichHop,
            icon: "warning",
          });
          return;
        }
      }
    }
    if (Helper.isNullOrUndefined(userInfo)) {
      if (meetData?.schedule?.isPublished === true) {
        setDisplayJoinName(true);
        return;
      }
      if (meetData?.schedule?.isPublished === false) {
        SwalAlertTimeRedirect({
          title: "Thông báo!",
          text: "Bạn không phải thành viên phòng họp!",
          timer: 3000,
          redirect: HREF.LichHop,
          icon: "warning",
        });
        return;
      }
    }
  };

  useEffect(() => {
    if (!Helper.isNullOrUndefined(roomLink)) {
      onHandleCheckRoom();
    }
  }, []);

  useEffect(() => {
    if (roomMini === true) {
      //
      refs.current[1].style.height =
        (!Helper.isNullOrUndefined(
          document.getElementById("meeting-sidebar").offsetWidth,
        ) && Number(document.getElementById("meeting-sidebar").offsetWidth)) +
        "px";
      refs.current[1].style.width =
        (!Helper.isNullOrUndefined(
          document.getElementById("meeting-sidebar").offsetWidth,
        ) && Number(document.getElementById("meeting-sidebar").offsetWidth)) +
        "px";
      refs.current[1].style.top =
        window.innerHeight -
        (!Helper.isNullOrUndefined(
          document.getElementById("main-footer").offsetHeight,
        ) && Number(document.getElementById("main-footer").offsetHeight)) -
        // (!Helper.isNullOrUndefined(
        //   document.getElementById("main-header")?.offsetHeight
        // ) && Number(document.getElementById("main-header")?.offsetHeight)) -
        (!Helper.isNullOrUndefined(
          document.getElementById("meeting-sidebar").offsetWidth,
        ) && Number(document.getElementById("meeting-sidebar").offsetWidth)) +
        "px";
      refs.current[1].style.left =
        !Helper.isNullOrUndefined(
          document.getElementById("meeting-sidebar").offsetWidth,
        ) &&
        Number(
          -document.getElementById("meeting-sidebar").offsetWidth - 7 - 8 - 37,
        ) + "px";
      refs.current[1].style.display = "block";
      refs.current[1].style.opacity = 1;
      refs.current[1].style.position = "absolute";
      refs.current[1].style.zIndex = "9999";
      refs.current[1].style.background = "none";
      //
      //
      refs.current[3].style.height =
        (!Helper.isNullOrUndefined(
          document.getElementById("meeting-sidebar").offsetWidth,
        ) && Number(document.getElementById("meeting-sidebar").offsetWidth)) +
        "px";
      refs.current[3].style.marginTop = "unset";
      refs.current[3].style.marginRight = "unset";
      refs.current[3].style.marginBottom = "unset";
      refs.current[3].style.marginLeft = "unset";
      //
    } else if (roomMini === false && refs.current[1] && refs.current[3]) {
      //
      refs.current[1].style.height = "unset";
      refs.current[1].style.width = "unset";
      refs.current[1].style.marginTop = "unset";
      refs.current[1].style.marginRight = "unset";
      refs.current[1].style.marginBottom = "unset";
      refs.current[1].style.marginLeft = "unset";
      refs.current[1].style.position = "unset";
      refs.current[1].style.zIndex = "unset";
      //
      //
      refs.current[3].style.background = "#3d3d3d";
      refs.current[3].style.height =
        window.innerWidth < 600 ? "calc(100vh - 56px)" : "calc(100vh - 33px)";
      refs.current[3].style.marginTop =
        window.innerWidth < 600 ? marginTopLayout : marginTopLayout;
      refs.current[3].style.marginRight =
        window.innerWidth < 600 ? "-15px" : "26px";
      refs.current[3].style.marginBottom =
        window.innerWidth < 600 ? "7px" : "-31px";
      refs.current[3].style.marginLeft =
        !Helper.isNullOrUndefined(
          document.getElementById("meeting-sidebar").offsetWidth,
        ) &&
        Number(
          -document.getElementById("meeting-sidebar").offsetWidth - 7 - 8,
        ) + "px";
      //
    }
  }, [roomMini, refs.current[1], refs.current[3]]);

  return (
    <div
      className="content-wrapper"
      style={{
        minHeight: "calc(100vh - 74px)",
        marginBottom: "-9px",
      }}
    >
      {/* Main content */}
      {!Helper.isNullOrUndefined(meetingData) &&
        !Helper.isNullOrUndefined(user) &&
        !Helper.isNullOrUndefined(owner) &&
        !displayJoinName && (
          <section className="content">
            <div className="container-fluid pt-1">
              <div className="row">
                <div
                  id="meeting-sidebar"
                  className="col-3 col-sm-2"
                  style={{
                    zIndex: "unset",
                    height:
                      "calc(100vh - " +
                      // document.getElementById("main-header")?.offsetHeight +
                      "px - " +
                      (document.getElementById("main-footer") &&
                        document.getElementById("main-footer").offsetHeight) +
                      "px)",
                  }}
                >
                  <div
                    className="toggle-menu-sider"
                    style={{
                      display: "block",
                      zIndex: "11",
                      position: "absolute",
                    }}
                  >
                    <span
                      style={{
                        color: "#fff",
                        display: "flex",
                        position: "absolute",
                        top: "50%",
                      }}
                    ></span>
                  </div>
                  <div
                    className="nav flex-column nav-tabs h-100"
                    id="vert-tabs-tab"
                    role="tablist"
                    aria-orientation="vertical"
                    style={{
                      display: "none",
                    }}
                  ></div>
                </div>
                {/* {JSON.stringify(roomMini)} */}
                {/* {startMeet()} */}
                {/* {!Helper.isNullOrUndefined(meetingData) &&
                  !Helper.isNullOrUndefined(user) &&
                  !Helper.isNullOrUndefined(owner) &&
                  roomMini === true && <>{startMeet()}</>} */}
                <div id="meeting-content" className="col-9 col-sm-10">
                  <div className="tab-content" id="vert-tabs-tabContent">
                    <div
                      className={
                        online === true
                          ? "tab-pane fade show active"
                          : "tab-pane fade"
                      }
                      id="vert-tabs-phonghop"
                      role="tabpanel"
                      aria-labelledby="vert-tabs-phonghop-tab"
                      ref={(element) => {
                        refs.current[1] = element;
                      }}
                    >
                      {/* {roomMini && (
                      )} */}
                      {/* <div
                        id="vert-tabs-phonghopheader"
                        style={{
                          padding: "5px",
                          cursor: "move",
                          zIndex: "9999",
                          backgroundColor: Theme.theme().css.background.color,
                          color: "#fff",
                          display: roomMini ? "block" : "none",
                          textAlign: "center",
                          borderRadius: "10px 10px 0 0",
                        }}
                      >
                        <DragOutlined style={{ fontSize: "30px" }} />{" "}
                      </div> */}
                      {online === true ? (
                        <>
                          <StartMeet
                            marginTopLayout={marginTopLayout}
                            marginRightLayout={marginRightLayout}
                            meetingData={meetingData}
                            owner={owner}
                            user={user}
                            firmstrip={firmstrip}
                            setFirmstrip={setFirmstrip}
                            renderSpinner={renderSpinner}
                            startWithAudioMuted={startWithAudioMuted}
                            startWithVideoMuted={startWithVideoMuted}
                            handleApiReady={handleApiReady}
                            handleReadyToClose={handleReadyToClose}
                            handleJitsiIFrameRef={handleJitsiIFrameRef}
                            refs={refs}
                            setLoading={setLoading}
                            getValue={getValue}
                            tileViewCount={tileViewCount}
                            setTileViewCount={setTileViewCount}
                            apiRef={apiRef}
                            roomMini={roomMini}
                          />
                          {!Helper.isNullOrUndefined(meetingData) &&
                            !Helper.isNullOrUndefined(owner) &&
                            !Helper.isNullOrUndefined(user) &&
                            !Helper.isNullOrUndefined(user?.userName) && (
                              <ButtonMeeting
                                roomMini={roomMini}
                                isAudioMuted={isAudioMuted}
                                isVideoMuted={isVideoMuted}
                                isHand={isHand}
                                isChat={isChat}
                                unreadCount={unreadCount}
                                isParticipants={isParticipants}
                                isToggleTileView={isToggleTileView}
                                isMouseActive={isMouseActive}
                                setIsMouseActive={setIsMouseActive}
                                handleMouseEvent={handleMouseEvent}
                                mouseMoveTimer={mouseMoveTimer}
                                recording={recording}
                                shareVideo={shareVideo}
                                liveStream={liveStream}
                                shareScreen={shareScreen}
                                qualityVideo={qualityVideo}
                                recordingLinkAvailable={recordingLinkAvailable}
                                recordingStatusChanged={recordingStatusChanged}
                                currentDevicesAudioInput={
                                  currentDevicesAudioInput
                                }
                                currentDevicesAudioOutput={
                                  currentDevicesAudioOutput
                                }
                                currentDevicesVideoInput={
                                  currentDevicesVideoInput
                                }
                                getAvailableDevicesAudioInput={
                                  availableDevicesAudioInput
                                }
                                getAvailableDevicesAudioOutput={
                                  availableDevicesAudioOutput
                                }
                                getAvailableDevicesVideoInput={
                                  availableDevicesVideoInput
                                }
                                executeCommand={executeCommand}
                                setDevice={setDevice}
                                user={user}
                                roomLink={roomLink}
                                owner={owner}
                                meetingData={meetingData?.schedule}
                                firmstrip={firmstrip}
                                setFirmstrip={setFirmstrip}
                                tileViewCount={tileViewCount}
                                setTileViewCount={setTileViewCount}
                                apiRef={apiRef}
                                scheduleId={meetingData?.schedule?.id}
                              />
                            )}
                        </>
                      ) : (
                        <>
                          {meetingData?.schedule?.status === 2 &&
                            meetingData?.schedule?.start === true && (
                              <div
                                style={{
                                  textAlign: "center",
                                  paddingTop: "25%",
                                  // marginLeft:
                                  //   !Helper.isNullOrUndefined(
                                  //     document.getElementById("meeting-sidebar")
                                  //   ) &&
                                  //   !Helper.isNullOrUndefined(
                                  //     document.getElementById("meeting-sidebar")
                                  //       ?.offsetWidth
                                  //   ) &&
                                  //   Number(
                                  //     -document.getElementById(
                                  //       "meeting-sidebar"
                                  //     )?.offsetWidth -
                                  //       7 -
                                  //       8
                                  //   ) + "px",
                                  margin:
                                    marginTopLayout +
                                    marginRightLayout +
                                    " 0px " +
                                    (!Helper.isNullOrUndefined(
                                      document.getElementById(
                                        "meeting-sidebar",
                                      ),
                                    ) &&
                                      Number(
                                        -document.getElementById(
                                          "meeting-sidebar",
                                        )?.offsetWidth -
                                          7.5 -
                                          8,
                                        // window.screen.width
                                      )) +
                                    "px",
                                }}
                              >
                                <Button
                                  type="primary"
                                  style={{
                                    background:
                                      Theme.theme().css.background.color,
                                    fontSize: "30px",
                                    borderRadius: "30px",
                                    display: "unset",
                                    height: "unset",
                                  }}
                                  title="Vào phòng họp trực tuyến"
                                  onClick={() => {
                                    sessionStorage.setItem(
                                      "thamgiatructuyen",
                                      "true",
                                    );
                                    setOnline(true);
                                  }}
                                >
                                  <i className="fas fa-play"></i> {/* <br /> */}
                                  {window.innerWidth < 416 && <br />}
                                  Vào phòng họp trực tuyến
                                </Button>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                    <div
                      className={
                        online === false
                          ? "tab-pane fade show active"
                          : "tab-pane fade"
                      }
                      id="vert-tabs-thongtin"
                      role="tabpanel"
                      aria-labelledby="vert-tabs-thongtin-tab"
                      ref={(element) => {
                        refs.current[2] = element;
                      }}
                    >
                      <Thongtin
                        marginTopLayout={marginTopLayout}
                        marginRightLayout={marginRightLayout}
                        scheduleSidebar={scheduleSidebar}
                        meetingData={meetingData}
                        setMeetingData={setMeetingData}
                        owner={owner}
                        executeCommand={executeCommand}
                        user={user}
                        onHandleCheckRoom={onHandleCheckRoom}
                        apiRef={apiRef}
                        setOwner={setOwner}
                        setUser={setUser}
                      />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="vert-tabs-chuongtrinh"
                      role="tabpanel"
                      aria-labelledby="vert-tabs-chuongtrinh-tab"
                    >
                      <ChuongTrinh
                        marginTopLayout={marginTopLayout}
                        marginRightLayout={marginRightLayout}
                        scheduleId={meetingData?.schedule?.id}
                        user={user}
                        owner={owner}
                        scheduleSidebar={scheduleSidebar}
                        meetingData={meetingData}
                        setMeetingData={setMeetingData}
                        executeCommand={executeCommand}
                        onHandleCheckRoom={onHandleCheckRoom}
                        apiRef={apiRef}
                        setOwner={setOwner}
                        setUser={setUser}
                      />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="vert-tabs-thanhphan"
                      role="tabpanel"
                      aria-labelledby="vert-tabs-thanhphan-tab"
                    >
                      <ThanhPhan
                        marginTopLayout={marginTopLayout}
                        marginRightLayout={marginRightLayout}
                        scheduleId={meetingData?.schedule?.id}
                        user={user}
                        owner={owner}
                        scheduleSidebar={scheduleSidebar}
                        meetingData={meetingData}
                        setMeetingData={setMeetingData}
                        executeCommand={executeCommand}
                        onHandleCheckRoom={onHandleCheckRoom}
                        apiRef={apiRef}
                        setOwner={setOwner}
                        setUser={setUser}
                      />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="vert-tabs-tailieu"
                      role="tabpanel"
                      aria-labelledby="vert-tabs-tailieu-tab"
                    >
                      <MeetingDocument
                        marginTopLayout={marginTopLayout}
                        marginRightLayout={marginRightLayout}
                        meetingData={meetingData}
                        scheduleId={meetingData?.schedule?.id}
                        user={user}
                        owner={owner}
                      />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="vert-tabs-traodoi"
                      role="tabpanel"
                      aria-labelledby="vert-tabs-traodoi-tab"
                    >
                      <MeetingChat
                        marginTopLayout={marginTopLayout}
                        marginRightLayout={marginRightLayout}
                        meetingData={meetingData}
                        scheduleId={meetingData?.schedule?.id}
                        user={user}
                        owner={owner}
                      />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="vert-tabs-trinhdien"
                      role="tabpanel"
                      aria-labelledby="vert-tabs-trinhdien-tab"
                    >
                      <MeetingPaint
                        marginTopLayout={marginTopLayout}
                        marginRightLayout={marginRightLayout}
                        meetingData={meetingData}
                        schedule_id={
                          meetingData ? meetingData?.schedule?.id : ""
                        }
                        user={user}
                      />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="vert-tabs-bieuquyet"
                      role="tabpanel"
                      aria-labelledby="vert-tabs-bieuquyet-tab"
                    >
                      <BieuQuyet
                        marginTopLayout={marginTopLayout}
                        marginRightLayout={marginRightLayout}
                        meetingData={meetingData}
                        scheduleId={meetingData?.schedule?.id}
                        user={user}
                        owner={owner}
                      />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="vert-tabs-ketluan"
                      role="tabpanel"
                      aria-labelledby="vert-tabs-ketluan-tab"
                    >
                      <KetLuan
                        marginTopLayout={marginTopLayout}
                        marginRightLayout={marginRightLayout}
                        meetingData={meetingData}
                        scheduleId={meetingData?.schedule?.id}
                        user={user}
                        owner={owner}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /.container-fluid */}
          </section>
        )}
      {/* /.content */}
      {meetingData && displayJoinName && (
        <>
          <DisplayJoinName
            user={user}
            getAvailableDevicesAudioInput={availableDevicesAudioInput}
            getAvailableDevicesAudioOutput={availableDevicesAudioOutput}
            getAvailableDevicesVideoInput={availableDevicesVideoInput}
            meetingData={meetingData}
            setDevice={setDevice}
            setOwner={setOwner}
            setUser={setUser}
            setDisplayJoinName={setDisplayJoinName}
            executeCommand={executeCommand}
            onHandleCheckUser={onHandleCheckUser}
          />
        </>
      )}
    </div>
  );
}

export function DisplayJoinName(props) {
  const {
    user,
    getAvailableDevicesAudioInput,
    getAvailableDevicesAudioOutput,
    getAvailableDevicesVideoInput,
    meetingData,
    setDevice,
    executeCommand,
    onHandleCheckUser,
    setOwner,
    setDisplayJoinName,
    setUser,
  } = props;
  const [fullName, setFullName] = useState();
  const [errorFullname, setErrorFullname] = useState(false);
  const [password, setPassword] = useState();
  const [errorPassword, setErrorPassword] = useState(false);
  const [camDrop, setCamDrop] = useState(false);
  const [micDrop, setMicDrop] = useState(false);
  const [displayJoinPassword, setDisplayJoinPassword] = useState(
    !Helper.isNullOrUndefined(meetingData?.schedule?.password),
  );

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  const onHandCheckAudioVideo = (device) => {
    if (device === "toggleAudio") {
      setIsAudioMuted(!isAudioMuted);
    } else if (device === "toggleVideo") {
      setIsVideoMuted(!isVideoMuted);
      var video = document.querySelector("#vid");
      var img = document.querySelector("#im");
      var mediaDevices = navigator.mediaDevices;
      video.muted = true;
      if (!isVideoMuted) {
        img.style.display = "none";
        video.style.display = "block";
        mediaDevices
          .getUserMedia({
            video: true,
            audio: true,
          })
          .then((stream) => {
            console.log(stream);
            // Changing the source of video to current stream.
            video.srcObject = stream;
            video.addEventListener("loadedmetadata", () => {
              video.play();
            });
          });
      } else {
        video.style.display = "none";
        img.style.display = "block";
      }
    }
  };

  const onCheck = () => {
    if (Helper.isNullOrUndefined(user) && Helper.isNullOrUndefined(fullName)) {
      setErrorFullname(true);
    }
    if (Helper.isNullOrUndefined(password)) {
      setErrorPassword(1);
    }
    if (
      !Helper.isNullOrUndefined(password) &&
      meetingData?.schedule?.password !== password
    ) {
      setErrorPassword(0);
    }
    if (Helper.isNullOrUndefined(user) && !Helper.isNullOrUndefined(fullName)) {
      let client = {
        fullName: fullName?.split(" - ")[0] + " - Khách mời",
        email: "",
        userName: fullName?.split(" - ")[0] + " - Khách mời",
      };
      if (displayJoinPassword) {
        if (
          !Helper.isNullOrUndefined(password) &&
          meetingData?.schedule?.password === password
        ) {
          // document.getElementById("main-header").style.display = "";
          if (document.getElementById("main-sidebar")) {
            document.getElementById("main-sidebar").style.display = "";
          }
          if (document.getElementById("main-footer")) {
            document.getElementById("main-footer").style.display = "";
          }
          if (document.getElementById("control-sidebar-dark")) {
            document.getElementById("control-sidebar-dark").style.display = "";
          }
          setOwner(2);
          setUser(client);
          setDisplayJoinName(false);
          localStorage.setItem("user", JSON.stringify(client));
          return;
        }
      } else {
        // document.getElementById("main-header").style.display = "";
        if (document.getElementById("main-sidebar")) {
          document.getElementById("main-sidebar").style.display = "";
        }
        if (document.getElementById("main-footer")) {
          document.getElementById("main-footer").style.display = "";
        }
        if (document.getElementById("control-sidebar-dark")) {
          document.getElementById("control-sidebar-dark").style.display = "";
        }
        setOwner(2);
        setUser(client);
        setDisplayJoinName(false);
        localStorage.setItem("user", JSON.stringify(client));
        return;
      }
    }
    if (
      !Helper.isNullOrUndefined(user) &&
      !Helper.isNullOrUndefined(password) &&
      meetingData?.schedule?.password === password
    ) {
      // document.getElementById("main-header").style.display = "";
      if (document.getElementById("main-sidebar")) {
        document.getElementById("main-sidebar").style.display = "";
      }
      if (document.getElementById("main-footer")) {
        document.getElementById("main-footer").style.display = "";
      }
      if (document.getElementById("control-sidebar-dark")) {
        document.getElementById("control-sidebar-dark").style.display = "";
      }
      setOwner(2);
      setUser((pre) => ({
        ...pre,
        userName: user?.ten_dangnhap?.split(" - ")[0] + " - Khách mời",
      }));
      setDisplayJoinName(false);
      return;
    }
  };

  return (
    <>
      <div
        className="user-enter-room-wrapper"
        style={{
          background:
            'url("/static/' +
            Theme.theme().href +
            '/img/MaskGroup.png") no-repeat fixed center #fff',
          zIndex: 9999,
        }}
      >
        <div className="container">
          <div id="wrapper">
            <form action id="form-user-enter-room">
              <p>
                <img
                  src={"/static/" + Theme.theme().href + "/img/QuocHuy.png"}
                  alt=""
                  style={{
                    width: "100px",
                  }}
                />
              </p>
              <h3 className="black">VÀO PHÒNG HỌP</h3>
              {/* <h3>Đăng nhập</h3> */}
              {Helper.isNullOrUndefined(user) && (
                <>
                  <div className="form-group">
                    <input
                      type="text"
                      name="fullname"
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setErrorFullname(false);
                      }}
                    />
                    <label htmlFor>Họ và tên</label>
                  </div>
                  {errorFullname && (
                    <div className="alert alert-danger" role="alert">
                      Vui lòng nhập họ tên!
                    </div>
                  )}
                </>
              )}
              {displayJoinPassword && (
                <>
                  <div className="form-group">
                    <input
                      type="text"
                      name="password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorPassword(false);
                      }}
                    />
                    <label htmlFor>Mật khẩu</label>
                  </div>
                  {errorPassword === 1 && (
                    <div className="alert alert-danger" role="alert">
                      Vui lòng nhập mật khẩu!
                    </div>
                  )}
                  {errorPassword === 0 && (
                    <div className="alert alert-danger" role="alert">
                      Mật khẩu chưa đúng!
                    </div>
                  )}
                </>
              )}

              <div style={{ textAlign: "center" }}>
                <Button
                  type="primary"
                  onClick={() => onCheck()}
                  style={{ marginRight: "20px" }}
                >
                  Tham gia
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  Quay lại
                </Button>
              </div>
            </form>
          </div>
        </div>
        <Helmet>
          <script src="/static/js/animation_login.js"></script>
        </Helmet>
      </div>
    </>
  );
}
