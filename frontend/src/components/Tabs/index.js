import React from "react";
import { Tabs } from "antd";

export default function Index(props) {
  const { items, tabBarStyle, onChange } = props;
  return (
    <>
      <Tabs
        onChange={onChange}
        // onChange={(key) => {
        //   console.log(key);
        // }}
        type="card"
        items={items}
        size={"large"}
        tabBarStyle={tabBarStyle}
        style={{
          borderBottom: "1px solid #cbcbcb",
          borderLeft: "1px solid #cbcbcb",
          borderRight: "1px solid #cbcbcb",
          borderRadius: "10px",
        }}
      />
    </>
  );
}
