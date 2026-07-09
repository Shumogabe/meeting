import React from "react";
import { Input, InputNumber } from "antd";

const { TextArea } = Input;
// import { EyeTwoTone } from "@ant-design/icons";

export default function Index(props) {
  const {
    type,
    addonBefore, //""
    addonAfter, //""
    defaultValue, //""
    placeholder, //""
    style, //{}
    allowClear, //true false
    onChange, //()=>{}
    maxLength, //100
    rows, //4
    value,
    min,
    max,
    children,
    className,
    disabled,
    onClear,
  } = props;

  switch (type) {
    case "password":
      return (
        <>
          <Input.Password
            addonBefore={addonBefore}
            addonAfter={addonAfter}
            defaultValue={defaultValue}
            placeholder={placeholder}
            style={style}
            allowClear={allowClear}
            onChange={onChange}
            value={value}
            disabled={disabled}
            onClear={onClear}
            size="large"
          />
        </>
      );
    case "textArea":
      return (
        <>
          <TextArea
            rows={rows}
            showCount
            placeholder={placeholder}
            allowClear={allowClear}
            style={style}
            defaultValue={defaultValue}
            onChange={onChange}
            maxLength={maxLength}
            onClear={onClear}
            disabled={disabled}
            value={value}
            size="large"
            className="textareaEditor"
          />
          {/* <textarea
            className="textareaEditor"
            defaultValue={""}
            placeholder={placeholder}
          /> */}
        </>
      );
    case "text":
      return (
        <>
          <Input
            addonBefore={addonBefore}
            addonAfter={addonAfter}
            defaultValue={defaultValue}
            placeholder={placeholder}
            style={style}
            allowClear={allowClear}
            onChange={onChange}
            onClear={onClear}
            disabled={disabled}
            value={value}
            size="large"
            className={className}
          />
        </>
      );
    case "number":
      return (
        <>
          <InputNumber
            addonBefore={addonBefore}
            addonAfter={addonAfter}
            defaultValue={defaultValue}
            placeholder={placeholder}
            style={style}
            allowClear={allowClear}
            onChange={onChange}
            onClear={onClear}
            disabled={disabled}
            value={value}
            min={min}
            max={max}
            size="large"
          />
        </>
      );
    case "group":
      return (
        <>
          <Input.Group compact size="large" style={{ width: "100%" }}>
            {children}
          </Input.Group>
        </>
      );
    default:
      return <></>;
  }
}
