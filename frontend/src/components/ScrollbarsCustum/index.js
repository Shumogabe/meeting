import React from "react";
import Scrollbars from "react-custom-scrollbars-2";

export default function ScrollbarsCustum({
  style,
  autoHideTimeout,
  autoHideDuration,
  children,
}) {
  return (
    <Scrollbars
      //   ref={scrollBarRefTrangChuJoinRoom}
      style={style}
      // autoHide
      autoHideTimeout={autoHideTimeout}
      autoHideDuration={autoHideDuration}
      // renderTrackHorizontal={(props) => (
      //   <div {...props} className="track-horizontal" />
      // )}
      // renderTrackVertical={(props) => (
      //   <div {...props} className="track-vertical" />
      // )}
      // renderThumbHorizontal={(props) => (
      //   <div {...props} className="thumb-horizontal" />
      // )}
      // renderThumbVertical={(props) => (
      //   <div {...props} className="thumb-vertical" />
      // )}
      // renderView={(props) => <div {...props} className="view" />}
    >
      {children}
    </Scrollbars>
  );
}
