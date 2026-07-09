export default class Log {
  constructor() {
    this.path = window.location.pathname;
  }
  warn = (description, data) => {
    console.warn(description, this.path);
    this.getDataType(data);
  };
  error = (description, data) => {
    console.error(description, this.path);
    this.getDataType(data);
  };

  trace = (description, data) => {
    console.trace(description, this.path);
    this.getDataType(data);
  };

  debug = (description, data) => {
    console.debug(description, this.path);
    this.getDataType(data);
  };

  info = (description, data) => {
    console.info(description, this.path);
    this.getDataType(data);
  };

  getDataType = (data) => {
    if (Array.isArray(data)) {
      console.table(data);
    } else {
      console.group(data);
    }
  };
}
