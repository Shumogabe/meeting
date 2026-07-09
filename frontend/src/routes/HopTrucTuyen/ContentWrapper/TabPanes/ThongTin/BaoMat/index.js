import React, { useEffect, useState } from "react";
import { Button, Checkbox, Input } from "antd";
import Api from "../../../../../../api";
import { SESSION_STORAGE } from "../../../../../../config";
import Helper from "../../../../../../helper/helper";
import { SwalAlertAllConfiguration } from "../../../../../../components/Swal";

export default function BaoMat({ scheduleId, meetingData, owner, user }) {
  // const [isPublished, setIsPublished] = useState(
  //   meetingData?.schedule?.isPublished
  // );
  // const [isLobby, setIsLobby] = useState(meetingData?.schedule?.isLobby);
  // const [password, setPassword] = useState(meetingData?.schedule?.password);
  // useEffect(() => {
  //   setIsPublished(meetingData?.schedule?.isPublished);
  // }, [meetingData?.schedule?.isPublished]);
  // useEffect(() => {
  //   setIsLobby(meetingData?.schedule?.isLobby);
  // }, [meetingData?.schedule?.isLobby]);
  // useEffect(() => {
  //   setPassword(meetingData?.schedule?.password);
  // }, [meetingData?.schedule?.password]);

  const [pass, setPass] = useState(meetingData?.schedule?.password);
  const [passRequire, setPassRequire] = useState(
    !Helper.isNullOrUndefined(meetingData?.schedule?.password) ? true : false
  );
  const [isPublished, setIsPublished] = useState(
    meetingData?.schedule?.isPublished
  );
  const [isLobby, setIsLobby] = useState(meetingData?.schedule?.isLobby);

  useEffect(() => {
    setPass(meetingData?.schedule?.password);
    setPassRequire(
      !Helper.isNullOrUndefined(meetingData?.schedule?.password) ? true : false
    );
    setIsPublished(meetingData?.schedule?.isPublished);
    setIsLobby(meetingData?.schedule?.isLobby);
  }, [meetingData?.schedule]);

  const onWrite = () => {
    new Api().schedule_isPublished({
      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
      id: meetingData?.schedule?.id,
      data: {
        isPublished: isPublished,
        modifiedDate: new Date(),
        modifiedBy: user?.id,
      },
    });
    new Api().edit_meeting_schedule_password({
      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
      id: meetingData?.schedule?.id,
      data: {
        password: pass,
        modifiedDate: new Date(),
        modifiedBy: user?.id,
      },
    });
    new Api().schedule_isLobby({
      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
      id: meetingData?.schedule?.id,
      data: {
        isLobby: isLobby,
        modifiedDate: new Date(),
        modifiedBy: user?.id,
      },
    });
    SwalAlertAllConfiguration({
      title: "Thông báo! ",
      text: "Thay đổi thành công",
      icon: "success",
    });
  };
  return (
    <>
      <div className="row form-group">
        <div className="col-md-2">
          <Checkbox
            onChange={(e) => {
              setIsPublished(e.target.checked);
            }}
            defaultChecked={isPublished}
          >
            Công khai
          </Checkbox>
        </div>
        <div className="col-md">
          <i>
            Chọn công khai, phòng họp không yêu cầu người tham gia đăng nhập
          </i>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <Checkbox
            onChange={(e) => {
              setPassRequire(e.target.checked);
            }}
            defaultChecked={passRequire}
          >
            Mật khẩu
          </Checkbox>
        </div>
        <div className="col-md">
          <i>Mật khẩu tham gia phòng họp</i>
          <Input
            placeholder="Nhập mật khẩu phòng họp"
            size="large"
            defaultValue={pass}
            value={pass}
            disabled={!passRequire}
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-2">
          <Checkbox
            onChange={(e) => {
              setIsLobby(e.target.checked);
            }}
            defaultChecked={isLobby}
          >
            Phòng chờ
          </Checkbox>
        </div>
        <div className="col-md">
          <i>Người tham gia yều cầu được sự cho phép của chủ trì phòng họp</i>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-12 align-center">
          <Button
            className="btn btn-sm btn-default m-1"
            onClick={() => onWrite()}
          >
            <i className="fas fa-edit blue"></i> Lưu
          </Button>
          {/* <Button
          className="btn btn-sm btn-default m-1"
          data-dismiss="modal"
          onClick={() => onHandleCancel()}
        >
          <i className="fas fa-undo"></i> Quay lại
        </Button> */}
        </div>
      </div>
    </>
  );
}
