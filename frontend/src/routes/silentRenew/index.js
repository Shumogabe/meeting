import React from "react";
import { processSilentRenew } from "redux-oidc";

class SilentRenew extends React.Component {
  componentDidMount() {
    // console.log('silent renew');
    processSilentRenew();
  }
  render() {
    return null;
  }
}

export default SilentRenew;
