import React from "react";
import { Spin } from "antd";

export default function Index() {
  return (
    <div
      style={{
        margin: "20px 0",
        marginBottom: "20px",
        padding: "30px 50px",
        textAlign: "center",
        background: "rgba(0, 0, 0, 0.05)",
        borderRadius: "4px",
      }}
    >
      <Spin tip="Loading" size="large">
        <div
          style={{
            padding: "50px",
            background: "rgba(0, 0, 0, 0.05)",
            borderRadius: "4px",
          }}
        />
      </Spin>
    </div>
  );
}
