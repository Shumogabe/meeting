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
      <div className="row form-group justify-content-center">
        <div className="col-md-12">
          <Checkbox
            style={{ width: "100%" }}
            onChange={(e) => {
              setIsPublished(e.target.checked);
            }}
            defaultChecked={isPublished}
          >
            Công khai
          </Checkbox>
          <i>
            Chỉ những người dùng có trong danh sách thành phần tham gia mới có
            thể tham gia cuộc họp
          </i>
          <br />
          <Checkbox
            style={{ width: "30%" }}
            onChange={(e) => {
              setPassRequire(e.target.checked);
            }}
            defaultChecked={passRequire}
          >
            Mật khẩu
          </Checkbox>
          <Input
            placeholder="Nhập mật khẩu phòng họp"
            size="large"
            style={{ width: "70%" }}
            defaultValue={pass}
            value={pass}
            disabled={!passRequire}
            onChange={(e) => {
              setPass(e.target.value);
            }}
          />
          <i>Chỉ những người dùng có mật mã mới có thể tham gia cuộc họp</i>
          <br />
          <Checkbox
            style={{ width: "100%" }}
            onChange={(e) => {
              setIsLobby(e.target.checked);
            }}
            defaultChecked={isLobby}
          >
            Phòng chờ
          </Checkbox>
          <i>
            Chỉ những người dùng được người chủ trì chấp nhận mới có thể tham
            gia cuộc họp
          </i>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-12 align-center m-1">
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
