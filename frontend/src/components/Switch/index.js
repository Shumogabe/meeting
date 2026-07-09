import React from "react";
import { Switch } from "antd";

const CustomSwitch = ({ defaultChecked, onChange }) => (
  <Switch defaultChecked={defaultChecked} onChange={onChange} />
);
export default CustomSwitch;
