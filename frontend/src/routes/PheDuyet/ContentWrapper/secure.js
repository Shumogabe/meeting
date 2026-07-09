import React from "react";
import { Checkbox, Input } from "antd";

export default function Secure({
  setIsPublished,
  setPassRequire,
  pass,
  passRequire,
  setPass,
  setIsLobby,
}) {
  return (
    <div className="row form-group justify-content-center">
      <div className="col-md-6">
        <Checkbox
          style={{ width: "100%" }}
          onChange={(e) => {
            setIsPublished(e.target.checked);
          }}
        >
          Công khai
        </Checkbox>
        <i>
          Chỉ những người dùng có trong danh sách thành phần tham gia mới có thể
          tham gia cuộc họp
        </i>
        <br />
        <Checkbox
          style={{ width: "30%" }}
          onChange={(e) => {
            setPassRequire(e.target.checked);
          }}
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
        >
          Phòng chờ
        </Checkbox>
        <i>
          Chỉ những người dùng được người chủ trì chấp nhận mới có thể tham gia
          cuộc họp
        </i>
      </div>
    </div>
  );
}
