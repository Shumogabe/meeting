import React from "react";
import { Result } from "antd";
const App = ({ icon, status, title, subTitle, extra, children }) => (
  <Result
    icon={icon} //<SmileOutlined />
    status={status} //success | info | warning | error | 403 | 404 | 500
    title={title}
    subTitle={subTitle}
    extra={extra} //[<Button type="primary" key="console">Go Console</Button>,<Button key="buy">Buy Again</Button>,]
  >
    {children}
  </Result>
);
export default App;
