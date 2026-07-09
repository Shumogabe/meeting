import React from "react";
import { Checkbox } from "antd";

export default function Index(props) {
  const { label, onChange, defaultChecked } = props;
  return (
    <>
      <Checkbox
        onChange={onChange}
        defaultChecked={defaultChecked}
        checked={defaultChecked}
      >
        {label}
      </Checkbox>
    </>
  );
}
