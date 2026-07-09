import React from "react";
import { TableOutlined } from "@ant-design/icons";
import { Card } from "antd";

export default function Index(props) {
  const { title, extra, bodyStyle, loading, children } = props;
  return (
    <>
      <Card
        title={
          title ? (
            title
          ) : (
            <>
              <TableOutlined /> <span>Danh sách</span>
            </>
          )
        }
        extra={extra}
        bodyStyle={bodyStyle} //boxShadow: "0 0 1px rgba(0, 0, 0, 0.125), 0 1px 3px rgba(0, 0, 0, 0.2)",
        headStyle={{
          background: "#1f93a4",
          color: "#ffffff",
          fontSize: "20px",
          textTransform: "uppercase",
        }}
        hoverable={true}
        loading={loading ? true : false}
      >
        {children}
      </Card>
    </>
  );
}
