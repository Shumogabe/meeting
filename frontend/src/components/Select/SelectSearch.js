// import React, { useState } from "react";
// import { Select } from "antd";
// import Message from "../Message";

// let timeout;
// let currentValue;

// export default function SelectSearch({
//   style,
//   Api,
//   onSelect,
//   mode,
//   allowClear,
//   placeholder,
//   addonAfter,
//   onSearch,
//   onChange,
// }) {
//   const [data, setData] = useState([]);
//   const [value, setValue] = useState();

//   function fetch(value, callback) {
//     if (timeout) {
//       clearTimeout(timeout);
//       timeout = null;
//     }
//     currentValue = value;
//     if (value === "null") {
//       callback([]);
//     } else {
//       function fake() {
//         new Api()
//           .Search_Dm_DonVis({ strSearch: currentValue })
//           .then(res => {
//             if (currentValue === value) {
//               callback(res && res.data);
//             }
//           })
//           .catch(err => Message.error(err.message));
//       }
//       timeout = setTimeout(fake, 800);
//     }
//   }

//   const handleSearch = (newValue) => {
//     fetch(newValue, setData);
//   };

//   const handleChange = (newValue) => {
//     setValue(newValue);
//   };

//   return (
//     <div>
//       <Select
//         size="large"
//         mode={mode}
//         showSearch
//         value={value}
//         allowClear={allowClear}
//         placeholder={placeholder}
//         style={style}
//         defaultActiveFirstOption={false}
//         showArrow={true}
//         filterOption={false}
//         onSearch={onSearch}
//         onSelect={onSelect}
//         onChange={onChange}
//         notFoundContent={null}
//         options={data}
//         addonAfter={addonAfter}
//       />
//     </div>
//   );
// }
