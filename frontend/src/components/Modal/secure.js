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
    <>
      <div className="row form-group justify-content-center">
        <div className="col-md-12">
          <Checkbox
            style={{ width: "100%" }}
            onChange={(e) => {
              setIsPublished(e.target.checked);
            }}
          >
            Công khai
          </Checkbox>
          <i>Khi chọn thì ai cũng có thể vào phòng họp</i>
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
          <i>Khi chọn thì cần có mật khẩu mới có thể vào cuộc họp</i>
          <br />
          <Checkbox
            style={{ width: "100%" }}
            onChange={(e) => {
              setIsLobby(e.target.checked);
            }}
          >
            Phòng chờ
          </Checkbox>
          <i>Khi chọn thì phải chờ chủ trì chấp nhận mới có thể vào cuộc họp</i>
        </div>
      </div>
    </>
  );
}
