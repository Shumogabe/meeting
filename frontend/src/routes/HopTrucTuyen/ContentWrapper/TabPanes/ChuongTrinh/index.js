import { Card } from "antd";
import React, { useEffect, useState } from "react";
import Helper from "../../../../../helper/helper";
import ChuongTrinh from "../ThongTin/ChuongTrinh";

export default function Index({
  meetingData,
  setMeetingData,
  owner,
  executeCommand,
  user,
  onHandleCheckRoom,
  scheduleSidebar,
  apiRef,
  setOwner,
  setUser,
  marginTopLayout,
  marginRightLayout,
  scheduleId,
}) {
  const [docList, setDocList] = useState([]);
  useEffect(() => {
    setDocList(scheduleId);
  }, [scheduleId]);
  return (
    <div
      style={{
        margin:
          marginTopLayout +
          marginRightLayout +
          " 0px " +
          (!Helper.isNullOrUndefined(
            document.getElementById("meeting-sidebar")?.offsetWidth
          ) &&
            Number(
              -document.getElementById("meeting-sidebar")?.offsetWidth - 7.5 - 8
              // window.screen.width
            )) +
          "px",
      }}
    >
      <Card
        title="Chương trình"
        // extra={<a href="#">More</a>}
        style={
          {
            // width: 300,
          }
        }
      >
        <ChuongTrinh
          scheduleId={meetingData?.schedule?.id}
          meetingData={meetingData}
          owner={owner}
          user={user}
        />
      </Card>
    </div>
  );
}
