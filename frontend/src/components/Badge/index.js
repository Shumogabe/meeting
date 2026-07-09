import React from "react";
import { Badge } from "antd";
const App = ({ count, children }) => (
  <Badge count={count} color="" style={{ marginBottom: "25px" }}>
    {children}
  </Badge>
);
export default App;
