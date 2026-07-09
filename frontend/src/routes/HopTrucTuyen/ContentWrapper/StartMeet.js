import React, { useEffect, useRef } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { Col, Row } from "antd";
import Helper from "../../../helper/helper";

export default function StartMeet({
  meetingData,
  owner,
  user,
  firmstrip,
  setFirmstrip,
  renderSpinner,
  startWithAudioMuted,
  startWithVideoMuted,
  handleApiReady,
  handleReadyToClose,
  handleJitsiIFrameRef,
  refs,
  setLoading,
  getValue,
  tileViewCount,
  setTileViewCount,
  apiRef,
  roomMini,
}) {
  const refss = useRef([]);
  useEffect(() => {
    if (refss.current[1]) {
      refss.current[1].style.marginTop = "-13px";
      refss.current[1].style.marginRight = "26px";
      refss.current[1].style.marginBottom = "-31px";
      refss.current[1].style.marginLeft =
        !Helper.isNullOrUndefined(
          document.getElementById("meeting-sidebar").offsetWidth
        ) &&
        Number(
          -document.getElementById("meeting-sidebar").offsetWidth - 7 - 8
          // window.screen.width
        ) + "px";
    }
  }, [refss.current[1]]);
  useEffect(() => {
    if (refss.current[2]) {
      refss.current[2].style.marginTop = "-13px";
      refss.current[2].style.marginRight = "26px";
      refss.current[2].style.marginBottom = "-31px";
      refss.current[2].style.marginLeft =
        !Helper.isNullOrUndefined(
          document.getElementById("meeting-sidebar").offsetWidth
        ) &&
        Number(
          -document.getElementById("meeting-sidebar").offsetWidth - 7 - 8
          // window.screen.width
        ) + "px";
    }
  }, [refss.current[2]]);
  useEffect(() => {
    if (refss.current[3]) {
      refss.current[3].style.marginTop = "-13px";
      refss.current[3].style.marginRight = "26px";
      refss.current[3].style.marginBottom = "-31px";
      refss.current[3].style.marginLeft =
        !Helper.isNullOrUndefined(
          document.getElementById("meeting-sidebar").offsetWidth
        ) &&
        Number(
          -document.getElementById("meeting-sidebar").offsetWidth - 7 - 8
          // window.screen.width
        ) + "px";
    }
  }, [refss.current[3]]);

  useEffect(() => {
    if (roomMini === true) {
      setFirmstrip("1");
    }
  }, [roomMini]);

  useEffect(() => {
    if (refss.current[16]) {
      if (tileViewCount === "show") {
        refss.current[16].executeCommand("toggleFilmStrip");
      }
      if (tileViewCount === "hide") {
        refss.current[16].executeCommand("toggleFilmStrip");
      }
    }
  }, [tileViewCount]);

  const jitsi = (number) => {
    return (
      <JitsiMeeting
        domain={meetingData?.schedule?.server?.ip}
        roomName={meetingData?.schedule?.roomName}
        jwt={meetingData?.schedule?.token}
        spinner={renderSpinner}
        configOverwrite={{
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          prejoinPageEnabled: false,
          // hosts: { // CAN NOT USE
          //   // XMPP domain.
          //   // domain: { domain },

          //   // When using authentication, domain for guest users.
          //   anonymousdomain: `guest.${domain}`,

          //   // Domain for authenticated users. Defaults to <domain>.
          //   authdomain: { domain },

          //   // Focus component domain. Defaults to focus.<domain>.
          //   // focus: 'focus.jitsi-meet.example.com',

          //   // XMPP MUC domain. FIXME: use XEP-0030 to discover it.
          //   // muc: "conference." + subdomain + "jitsi-meet.example.com",
          // },
          // subject: 'hi',
          hideConferenceSubject: false,
          requireDisplayName: true,
          defaultLanguage: "vi", //vi | en
          disableModeratorIndicator: owner !== 1, // HOW TO USE
          // disableReactionsModeration: true, // HOW TO USE
          // disableRemoteMute: true
          // disablePolls: true,
          // disableProfile: true,
          // hideEmailInSettings: true,
          // noticeMessage: '',
          // toolbarButtons: [],
          toolbarButtons: [
            "camera",
            "chat",
            "closedcaptions",
            "desktop", //share screen
            //    "dock-iframe",
            "download",
            "embedmeeting",
            "etherpad",
            "feedback",
            "filmstrip",
            "fullscreen",
            "hangup",
            "help",
            "highlight",
            // "invite",
            "linktosalesforce",
            "livestreaming",
            "microphone",
            "noisesuppression",
            "participants-pane",
            "profile",
            "raisehand",
            "recording",
            owner === 1 && "security",
            "select-background",
            "settings",
            "shareaudio",
            "sharedvideo",
            "shortcuts",
            "stats",
            "tileview",
            "toggle-camera",
            //    "undock-iframe",
            "videoquality",
            "whiteboard",
          ],
          hiddenPremeetingButtons: ["invite", "settings"], //'microphone', 'camera', 'select-background'
          // disableThirdPartyRequests: true,
          doNotStoreRoom: true,
          hideAddRoomButton: true,
          // remoteVideoMenu: {
          //   // Whether the remote video context menu to be rendered or not.
          //   disabled: false,
          //   // If set to true the 'Kick out' button will be disabled.
          //   disableKick: false,
          //   // If set to true the 'Grant moderator' button will be disabled.
          //   disableGrantModerator: false,
          //   // If set to true the 'Send private message' button will be disabled.
          //   disablePrivateChat: false,
          // },
          // inviteDomain: 'citis.monre.gov.vn',
          // moderatedRoomServiceUrl: 'https://citis.monre.gov.vn',
          // hideRecordingLabel: false,
          // brandingRoomAlias: "citis.monre.gov.vn",

          // Configs for welcome page.
          // welcomePage: {
          //     // Whether to disable welcome page. In case it's disabled a random room
          //     // will be joined when no room is specified.
          //     disabled: false,
          //     // If set,landing page will redirect to this URL.
          //     customUrl: ''
          // },

          // Configs for the lobby screen.
          // lobby: {
          //     // If Lobby is enabled, it starts knocking automatically. Replaces `autoKnockLobby`.
          //     autoKnock: false,
          //     // Enables the lobby chat. Replaces `enableLobbyChat`.
          //     enableChat: true,
          // },

          // Configs for the security related UI elements.
          // securityUi: {
          //     // Hides the lobby button. Replaces `hideLobbyButton`.
          //     hideLobbyButton: false,
          //     // Hides the possibility to set and enter a lobby password.
          //     disableLobbyPassword: false,
          // },

          /// OWNER
          participantsPane: {
            // Enables feature
            enabled: owner === 1,
            // Hides the moderator settings tab.
            hideModeratorSettingsTab: owner !== 1, //true,
            // Hides the more actions button.
            hideMoreActionsButton: owner !== 1, //true,
            // Hides the mute all button.
            hideMuteAllButton: owner !== 1, //true,
          },
          disableInviteFunctions: owner !== 1, //true,
          // disableModeratorIndicator: true, // chỉ hiển thị thông báo
          // disableReactionsModeration: true, // chỉ hiển thị thông báo
          disableRemoteMute: owner !== 1,
          remoteVideoMenu: {
            // Whether the remote video context menu to be rendered or not.
            disabled: owner !== 1,
            // If set to true the 'Kick out' button will be disabled.
            disableKick: owner !== 1,
            // If set to true the 'Grant moderator' button will be disabled.
            disableGrantModerator: owner !== 1,
            // If set to true the 'Send private message' button will be disabled.
            disablePrivateChat: owner !== 1,
          },
          // participantMenuButtonsWithNotifyClick: [
          //   'allow-video',
          //   {
          //     key: 'ask-unmute',
          //     preventExecution: false
          //   },
          //   'conn-status',
          //   'flip-local-video',
          //   'grant-moderator',
          //   {
          //     key: 'kick',
          //     preventExecution: true
          //   },
          //   {
          //     key: 'hide-self-view',
          //     preventExecution: false
          //   },
          //   'mute',
          //   'mute-others',
          //   'mute-others-video',
          //   'mute-video',
          //   'pinToStage',
          //   'privateMessage',
          //   {
          //     key: 'remote-control',
          //     preventExecution: false
          //   },
          //   'send-participant-to-room',
          //   'verify',
          // ],
          disablePolls: true,
          // Options related to the breakout rooms feature.
          breakoutRooms: {
            // Hides the add breakout room button. This replaces `hideAddRoomButton`.
            hideAddRoomButton: true,
            // Hides the auto assign participants button.
            hideAutoAssignButton: true,
            // Hides the join breakout room button.
            hideJoinRoomButton: true,
          },

          // Application logo url // CAN NOT USE
          // defaultLogoUrl:
          //   "https://www.care.org.vn/wp-content/uploads/2019/06/botainguyen.png",

          // Settings for the Excalidraw whiteboard integration.
          // whiteboard: {
          //   // Whether the feature is enabled or not.
          //   enabled: true,
          //   // The server used to support whiteboard collaboration.
          //   // https://github.com/jitsi/excalidraw-backend
          //   // collabServerBaseUrl: "https://excalidraw-backend.example.com",
          //   // The user access limit to the whiteboard, introduced as a means
          //   // to control the performance.
          //   // userLimit: 25,
          //   // The url for more info about the whiteboard and its usage limitations.
          //   // limitUrl: "https://example.com/blog/whiteboard-limits",
          // },
          disableTileView: true,
          filmstrip: {
            // // Disable the vertical/horizonal filmstrip.
            // disabled: false,
            // // Disables user resizable filmstrip. Also, allows configuration of the filmstrip (width, tiles aspect ratios) through the interfaceConfig options.
            // disableResizable: false,

            // // Disables the stage filmstrip (displaying multiple participants on stage besides the vertical filmstrip)
            // disableStageFilmstrip: false,

            // Default number of participants that can be displayed on stage. The user can change this in settings. Number must be between 1 and 6.
            stageFilmstripParticipants: Number(firmstrip),

            // // Disables the top panel (only shown when a user is sharing their screen).
            // disableTopPanel: false,

            // // The minimum number of participants that must be in the call for the top panel layout to be used.
            // minParticipantCountForTopPanel: 1,
          },
          //   //   Tile view related config options.
          tileView: {
            // Whether tileview should be disabled.
            // disabled: false,
            // The optimal number of tiles that are going to be shown in tile view. Depending on the screen size it may not be possible to show the exact number of participants specified here.
            numberOfVisibleTiles: Number(firmstrip), //Number(firmstrip),
          },
          // startSilent: true,
          //   // If true, the tiles will be displayed contained within the available space rather than enlarged to cover it, with a 16:9 aspect ratio (old behaviour).
          //   disableTileEnlargement: true,
          // // configuration for all things recording related. Existing settings will be migrated here in the future.
          // recordings: {
          //    // IF true (default) recording audio and video is selected by default in the recording dialog.
          //    recordAudioAndVideo: true,
          //    // If true, shows a notification at the start of the meeting with a call to action button
          //    // to start recording (for users who can do so).
          //    suggestRecording: true,
          //    // If true, shows a warning label in the prejoin screen to point out the possibility that
          //    // the call you're joining might be recorded.
          //    showPrejoinWarning: true,
          // },
          // recordingService: {
          //   // When integrations like dropbox are enabled only that will be shown,
          //   // by enabling fileRecordingsServiceEnabled, we show both the integrations
          //   // and the generic recording service (its configuration and storage type
          //   // depends on jibri configuration)
          //   enabled: true,

          //   // Whether to show the possibility to share file recording with other people
          //   // (e.g. meeting participants), based on the actual implementation
          //   // on the backend.
          //   sharingEnabled: true,

          //   // Hide the warning that says we only store the recording for 24 hours.
          //   hideStorageWarning: false,
          // },
          // localRecording: {
          //     // Whether to disable local recording or not.
          //     disable: false,

          //     // Whether to notify all participants when a participant is recording locally.
          //     notifyAllParticipants: false,

          //     // Whether to disable the self recording feature (only local participant streams).
          //     disableSelfRecording: false,
          // },
          // fileRecordingsEnabled: true,
          // fileRecordingsServiceEnabled: true,
          disabledNotifications: [
            "notify.grantedTo", // shown when moderator rights were granted to a participant
            "notify.moderator", // shown when user gets moderator privilege
          ],
          // video
          resolution: 720,
          videoQuality: {
            preferredResolution: 720,
            maxHeight: 720, // Maximum video height (quality)
            minHeight: 720, // Minimum video height (quality)
            minHeightForQualityLvl: {
              720: "standard",
              1080: "high",
            },
          },
          constraints: {
            video: {
              height: {
                ideal: 720,
                max: 720,
                min: 720,
              },
            },
          },
        }}
        interfaceConfigOverwrite={{}}
        userInfo={{
          displayName:
            user?.userName ??
            user?.userName ??
            user?.email ??
            JSON.parse(localStorage.getItem("user"))?.fullName ??
            "",
          email: user?.email ? user?.email : "",
        }}
        lang="vi"
        invitees={[]}
        onApiReady={(externalApi) => {
          handleApiReady(externalApi);
          refss.current[number] = externalApi;
        }}
        onReadyToClose={handleReadyToClose}
        getIFrameRef={handleJitsiIFrameRef}
      />
    );
  };

  return (
    <>
      {!Helper.isNullOrUndefined(meetingData) &&
        !Helper.isNullOrUndefined(owner) &&
        !Helper.isNullOrUndefined(user) &&
        !Helper.isNullOrUndefined(user?.userName) && (
          <>
            {firmstrip === "1" && jitsi(16)}
            {firmstrip === "2" && jitsi(16)}
            {firmstrip === "4" && jitsi(16)}
            {firmstrip === "6" && jitsi(16)}
          </>
        )}
    </>
  );
}
