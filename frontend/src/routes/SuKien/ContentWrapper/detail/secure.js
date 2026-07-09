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
            defaultChecked={isPublished}
            checked={isPublished}
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
            defaultChecked={passRequire}
            checked={passRequire}
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
          />
          <i>Chỉ những người dùng có mật mã mới có thể tham gia cuộc họp</i>
          <br />
          <Checkbox
            style={{ width: "100%" }}
            defaultChecked={isLobby}
            checked={isLobby}
          >
            Phòng chờ
          </Checkbox>
          <i>
            Chỉ những người dùng được người chủ trì chấp nhận mới có thể tham
            gia cuộc họp
          </i>
        </div>
      </div>
    </>
  );
}
