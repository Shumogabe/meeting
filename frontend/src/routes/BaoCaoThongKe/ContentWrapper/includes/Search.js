import { Button, Col, Input, Row, Space } from "antd";
import React from "react";

export default function Search({ search, setSearch }) {
  return (
    <Row>
      {/* <Col span={12}>
            <Input
              placeholder="Nhập tên báo cáo, thống kê"
              size="large"
              onChange={(e) => setSearch(e.target.value)}
              defaultValue={search}
            />
          </Col>
          <Col span={12}>
            <RangePicker
              allowClear={false}
              size="large"
              defaultValue={[
                dayjs(startTime, "DD/MM/YYYY"),
                dayjs(endTime, "DD/MM/YYYY"),
              ]}
              format={"DD/MM/YYYY"}
              onChange={(dates, dateStrings) => {
                setStartTime(dates[0]);
                setEndTime(dates[1]);
              }}
            />
            <button className="btn btn-outline-default" type="button">
              <i className="fas fa-search info" /> TÌM KIẾM
            </button>
          </Col> */}
      <Col span={24}>
        <Space.Compact
          style={{
            width: "100%",
          }}
        >
          <Input
            placeholder="Nhập tên báo cáo, thống kê"
            size="large"
            onChange={(e) => setSearch(e.target.value)}
            defaultValue={search}
          />
          <Button className="btn btn-outline-default" type="button">
            <i className="fas fa-search info" /> TÌM KIẾM
          </Button>
        </Space.Compact>
      </Col>
    </Row>
  );
}
