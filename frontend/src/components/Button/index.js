import React from "react";
import { Button } from "antd";

export default function Index(props) {
  const {
    type, //primary ghost dashed link text default
    shape, //default | circle | round
    icon, // <SearchOutlined />
    href, //""
    size, //large | middle | small
    styles, //{}
    onClick, //()=>{}
    children,
    htmlType,
  } = props;
  return (
    <>
      <Button
        href={href}
        type={type}
        shape={shape}
        icon={icon}
        size={size}
        styles={styles}
        onClick={onClick}
        htmlType={htmlType}
      >
        {children}
      </Button>
    </>
  );
}
