import React from "react";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

export default function index(props) {
  const {
    type,
    defaultValue, //""
    placeholder, //""
    style, //{}
    allowClear, //true false
    onChange, //()=>{}
    value,
    format,
    dateFormat,
  } = props;
  switch (type) {
    case "date":
      return (
        <>
          <DatePicker
            size="large"
            // allowClear={allowClear}
            style={style}
            defaultValue={defaultValue}
            onChange={onChange}
            placeholder={placeholder}
            value={value}
            format={format}
            dateFormat={dateFormat}
          />
        </>
      );

    case "daterange":
      return (
        <>
          <RangePicker
            size="large"
            // allowClear={allowClear}
            style={style}
            defaultValue={defaultValue}
            onChange={onChange}
            placeholder={placeholder}
            value={value}
            format={format}
            dateFormat={dateFormat}
          />
        </>
      );
    default:
      return <></>;
  }
}
