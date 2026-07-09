import React from "react";
import { Select } from "antd";

export default function Index(props) {
  const {
    mode, //"multiple" | ""
    allowClear, //true | false
    placeholder, // ""
    defaultValue, // ["a10", "c12"] | "c12"
    onClear,
    onChange, //()=>{}
    onSearch, //()=>{}
    onKeyUp, //()=>{}
    filterOption, //()=>{}
    style, //{}
    options,
    value, // ["a10", "c12"] | "c12"
    addonAfter,
    disabled,
  } = props;
  return (
    <>
      <Select
        defaultActiveFirstOption={false}
        showSearch
        mode={mode}
        allowClear={allowClear}
        placeholder={placeholder}
        defaultValue={defaultValue}
        // optionFilterProp="children"
        onClear={onClear}
        onChange={onChange}
        onSearch={onSearch}
        onKeyUp={onKeyUp}
        filterOption={filterOption}
        style={style}
        options={options}
        value={value}
        size="large"
        disabled={disabled}
        addonAfter={addonAfter}
      />
    </>
  );
}
