import { message } from "antd";

const DURATION = 2;

const Message = {
  success: (content, cb, duration = DURATION) =>
    message.success(content, duration, cb),
  warning: (content, cb, duration = DURATION) =>
    message.warning(content, duration, cb),
  error: (content, cb, duration = DURATION) =>
    message.error(content, duration, cb),
  info: (content, cb, duration = DURATION) =>
    message.info(content, duration, cb),
  loading: (content, cb, duration = DURATION) =>
    message.loading(content, duration, cb),
};

export default Message;
