import React from "react";
import { Button, Checkbox, Input } from "antd";

export default function Secure({
  setIsPublished,
  setPassRequire,
  setIsLobby,
  pass,
  setPass,
  onWrite,
  isPublished,
  passRequire,
  isLobby,
}) {
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
