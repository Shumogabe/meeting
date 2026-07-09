import { Component, React } from "react";

class Footer extends Component {
  render() {
    return (
      <footer className="main-footer">
        <strong>
          Copyright &copy; 2014-2020{" "}
          <a href="https://adminlte.io">AdminLTE.io</a>.
        </strong>
        All rights reserved.
        <div className="float-right d-none d-sm-inline-block">
          <b>Version</b> 3.1.0-rc
        </div>
      </footer>
    );
  }
}

export { Footer };
