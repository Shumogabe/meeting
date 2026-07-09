import React, { useEffect, useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Radio, Space, Tabs } from "antd";
import Api from "../../../../../api";
import { CheckUser } from "../../../../../components/Modal";
import { SwalAlertAllConfiguration } from "../../../../../components/Swal";
import { SESSION_STORAGE } from "../../../../../config";
import { HREF } from "../../../../../constants/dictionaries";
import Helper from "../../../../../helper/helper";
import { Theme } from "../../../../../theme";
import Vote from "../../../../LichHop/ContentWrapper/vote";

export default function BieuQuyet({
  scheduleId,
  user,
  owner,
  marginTopLayout,
  marginRightLayout,
  meetingData,
}) {
  const [voteList, setVoteList] = useState([]);
  const [votesDeleteList, setVotesDeleteList] = useState([]);
  const [votesRestoreList, setVotesRestoreList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [checked, setChecked] = useState(null);
  const [chose, setChose] = useState(null);
  useEffect(() => {
    getMeetingVote("", scheduleId);
  }, [scheduleId]);
  const getMeetingVote = (search, id) => {
    new Api()
      .get_votes_byScheduleId({
        search: search,
        id: id,
        pageNumber: 1,
        pageSize: 999999,
      })
      .then((response) => {
        if (response?.data) {
          setVoteList(
            response?.data.map((item, index) => ({
              ...item,
              key: item?.id,
            }))
          );
        }
      });
  };

  const [permissions, setPermissions] = useState(0);
  useEffect(() => {
    CheckUser().then((user) => {
      if (Helper.isNullOrUndefined(user)) {
        setPermissions(0);
      } else {
        setPermissions(1);
      }
    });
  }, []);

  return (
    <>
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
                -document.getElementById("meeting-sidebar")?.offsetWidth -
                  7.5 -
                  8
                // window.screen.width
              )) +
            "px",
        }}
      >
        <Card title="Biểu quyết">
          {owner === 1 ? (
            <Vote
              scheduleId={scheduleId}
              user={user}
              voteList={voteList}
              getMeetingVote={getMeetingVote}
              votesDeleteList={votesDeleteList}
              setVotesDeleteList={setVotesDeleteList}
              votesRestoreList={votesRestoreList}
              setVotesRestoreList={setVotesRestoreList}
              meetingData={meetingData}
            />
          ) : (
            <>
              <Button
                type="primary"
                onClick={() => {
                  getMeetingVote("", scheduleId);
                }}
                loading={uploading}
                style={{
                  marginTop: 16,
                }}
                icon={<ReloadOutlined />}
              >
                Tải lại danh sách
              </Button>{" "}
              <Tabs
                defaultActiveKey="1"
                tabPosition={"left"}
                items={
                  voteList?.length > 0 &&
                  voteList
                    // .filter((item) =>  item?.isDeleted === false)
                    ?.filter(
                      (item) =>
                        item?.isDeleted === false &&
                        item?.end === false &&
                        item?.status === true
                    )
                    .map((e, i) => {
                      return {
                        label: e?.title,
                        key: e?.id,
                        // disabled: i === 28,
                        children: (
                          <>
                            <Card title={e?.title}>
                              <>
                                {e.type === true ? (
                                  <TypeCheckBox
                                    e={e}
                                    permissions={permissions}
                                    getMeetingVote={getMeetingVote}
                                    scheduleId={scheduleId}
                                    meetingData={meetingData}
                                  />
                                ) : (
                                  <TypeRadio
                                    e={e}
                                    permissions={permissions}
                                    getMeetingVote={getMeetingVote}
                                    scheduleId={scheduleId}
                                    meetingData={meetingData}
                                  />
                                )}
                              </>
                            </Card>
                          </>
                        ),
                      };
                    })
                }
              />
            </>
          )}
        </Card>
      </div>
    </>
  );
}

const TypeCheckBox = ({
  e,
  permissions,
  getMeetingVote,
  scheduleId,
  meetingData,
}) => {
  const [chose, setChose] = useState([]);
  const [lock, setLock] = useState(false);
  const [chart, setChart] = useState([]);
  const [totalMember, setTotalMember] = useState(
    meetingData?.member?.filter((x) => x?.activated === true)?.length
  );

  useEffect(() => {
    if (chose?.length > 0) {
      chartVote(e?.id);
      // const interval = setInterval(() => {
      // }, 5000);
    }
  }, [e, chose]);

  useEffect(() => {
    defaultChose(e?.id);
    if (e?.end === true) {
      setLock(true);
    } else {
      setLock(false);
    }
  }, [e]);

  const defaultChose = (id) => {
    if (
      !Helper.isNullOrUndefined(
        JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token
      )
    )
      new Api()
        .get_voted_byVoteIdCreatedBy({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          voteid: id,
        })
        .then((e) => {
          if (e?.data?.length > 0) {
            var arr = [];
            e?.data.map((item, index) => {
              // setChose([...chose, item?.title]);
              arr.push(item?.title.toString());
            });
            setChose(arr);
            setLock(true);
          } else {
            setLock(false);
          }
        });
  };

  const chartVote = (id) => {
    getTotalMemberInside(scheduleId);
    new Api()
      .chart_meeting_vote({
        voteid: id,
      })
      .then((e) => {
        // console.log(e?.data);
        if (e?.data?.length > 0) {
          setChart(e?.data);
        }
      });
  };

  const checkEnd = (id) => {
    new Api()
      .get_votes_byId({
        id: id,
      })
      .then((e) => {
        if (e?.data?.end === true) {
          setLock(true);
          return SwalAlertAllConfiguration({
            title: "Thông báo",
            text: "Biểu quyết đã kết thúc!",
            icon: "warning",
          });
        } else {
          setLock(false);
        }
      });
  };

  const onSentAnswer = () => {
    if (chose === null || chose?.length <= 0) {
      return SwalAlertAllConfiguration({
        title: "Thông báo",
        text: "Bạn chưa chọn nội dung biểu quyết!",
        icon: "warning",
      });
    }
    if (permissions === 0) {
      return SwalAlertAllConfiguration({
        title: "Thông báo",
        text: "Bạn cần đăng nhập để thực hiện chức năng này!",
        icon: "warning",
        footer: "<a href=" + HREF.DangNhap + ">Đăng nhập tại đây</a>",
      });
    }
    checkEnd(e?.id);
    // if (e?.end === true) {
    //   return SwalAlertAllConfiguration({
    //     title: "Thông báo",
    //     text: "Biểu quyết đã kết thúc!",
    //     icon: "warning",
    //   });
    // }
    if (permissions === 1) {
      if (e?.end === false) {
        // return console.log(element);
        new Api()
          .create_meeting_vote({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            voteid: e?.id,
            data: chose,
          })
          .then(() => {
            getMeetingVote("", scheduleId);
            defaultChose(e?.id);
            chartVote(e?.id);
          });
      }
    }
  };

  const getTotalMemberInside = (id) => {
    new Api()
      .get_schedule_byInside({
        pageSize: 999999,
        pageNumber: 1,
        id: id,
      })
      .then((e) => {
        setTotalMember(e?.data?.filter((x) => x?.activated === true)?.length);
      });
  };

  return (
    <>
      {lock === true ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Nội dung</th>
                <th>Biểu quyết</th>
              </tr>
            </thead>
            <tbody>
              {e?.meetingvoted?.length > 0 &&
                e?.meetingvoted.map((e, i) => (
                  <tr>
                    <td>
                      {e?.title + " - "}(
                      <b>
                        {(chart?.filter((x) => x.title === e?.title)[0]?.vote ??
                          0) + " "}
                        <i className="fas fa-user"></i>
                      </b>
                      )
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        <div
                          style={{
                            width:
                              Number(
                                (chart?.filter((x) => x.title === e?.title)[0]
                                  ?.vote ?? 0) / totalMember
                              ).toFixed(2) *
                                100 +
                              "%",
                            height: "10px",
                            backgroundColor: Theme.theme().css.background.color,
                          }}
                        />
                        {Number(
                          (chart?.filter((x) => x.title === e?.title)[0]
                            ?.vote ?? 0) / totalMember
                        ).toFixed(2) * 100}
                        %
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* {chart?.length > 0 &&
            chart.map((e, i) => (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                    }}
                  >
                    <span>{e?.title}</span>
                  </div>
                  <div
                    style={{
                      width: e?.vote + "%",
                      height: "10px",
                      backgroundColor: Theme.theme().css.background.color,
                    }}
                  />
                  {e?.vote}%
                </div>
              </>
            ))} */}
        </>
      ) : (
        <>
          <Checkbox.Group
            style={{ display: "grid" }}
            options={e?.meetingvoted.map((element) => {
              return {
                label: (
                  <span
                    style={{
                      fontWeight: "initial",
                    }}
                  >
                    {element?.title}
                  </span>
                ),
                value: element?.title.toString(),
              };
            })}
            defaultValue={chose}
            onChange={(element) => {
              setChose(element);
            }}
          />
        </>
      )}

      <br />
      {e?.end === false && (
        <>
          {lock === true ? (
            <Button type="primary" onClick={() => setLock(false)}>
              Chọn lại
            </Button>
          ) : (
            <Button type="primary" onClick={() => onSentAnswer()}>
              Gửi kết quả
            </Button>
          )}
        </>
      )}
    </>
  );
};

const TypeRadio = ({
  e,
  permissions,
  getMeetingVote,
  scheduleId,
  meetingData,
}) => {
  const [chose, setChose] = useState(null);
  const [lock, setLock] = useState(false);
  const [chart, setChart] = useState([]);
  const [totalMember, setTotalMember] = useState(
    meetingData?.member?.filter((x) => x?.activated === true)?.length
  );

  useEffect(() => {
    if (chose?.length > 0) {
      chartVote(e?.id);
      // const interval = setInterval(() => {
      // }, 5000);
    }
  }, [e, chose]);

  useEffect(() => {
    defaultChose(e?.id);
    if (e?.end === true) {
      setLock(true);
    } else {
      setLock(false);
    }
  }, [e]);

  const defaultChose = (id) => {
    if (
      !Helper.isNullOrUndefined(
        JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token
      )
    )
      new Api()
        .get_voted_byVoteIdCreatedBy({
          token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
            ?.access_token,
          voteid: id,
        })
        .then((e) => {
          if (e?.data?.length > 0) {
            e?.data.map((item, index) => {
              setChose(item?.title);
              setLock(true);
            });
          } else {
            setLock(false);
          }
        });
  };

  const chartVote = (id) => {
    getTotalMemberInside(scheduleId);
    new Api()
      .chart_meeting_vote({
        voteid: id,
      })
      .then((e) => {
        // console.log(e?.data);
        if (e?.data?.length > 0) {
          setChart(e?.data);
        }
      });
  };

  const checkEnd = (id) => {
    new Api()
      .get_votes_byId({
        id: id,
      })
      .then((e) => {
        if (e?.data?.end === true) {
          setLock(true);
          return SwalAlertAllConfiguration({
            title: "Thông báo",
            text: "Biểu quyết đã kết thúc!",
            icon: "warning",
          });
        } else {
          setLock(false);
        }
      });
  };

  const getTotalMemberInside = (id) => {
    new Api()
      .get_schedule_byInside({
        pageSize: 999999,
        pageNumber: 1,
        id: id,
      })
      .then((e) => {
        setTotalMember(e?.data?.filter((x) => x?.activated === true)?.length);
      });
  };

  const onSentAnswer = () => {
    if (chose === null) {
      return SwalAlertAllConfiguration({
        title: "Thông báo",
        text: "Bạn chưa chọn nội dung biểu quyết!",
        icon: "warning",
      });
    }
    if (permissions === 0) {
      return SwalAlertAllConfiguration({
        title: "Thông báo",
        text: "Bạn cần đăng nhập để thực hiện chức năng này!",
        icon: "warning",
        footer: "<a href=" + HREF.DangNhap + ">Đăng nhập tại đây</a>",
      });
    }
    checkEnd(e?.id);
    // if (e?.end === true) {
    //   return SwalAlertAllConfiguration({
    //     title: "Thông báo",
    //     text: "Biểu quyết đã kết thúc!",
    //     icon: "warning",
    //   });
    // }
    if (permissions === 1) {
      if (e?.end === false) {
        // return console.log(e.target.value);
        new Api()
          .create_meeting_vote({
            token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
              ?.access_token,
            voteid: e?.id,
            data: [chose],
          })
          .then(() => {
            getMeetingVote("", scheduleId);
            defaultChose(e?.id);
            chartVote(e?.id);
            checkEnd(e?.id);
          });
      }
    }
  };

  return (
    <>
      {lock === true ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Nội dung</th>
                <th>Biểu quyết</th>
              </tr>
            </thead>
            <tbody>
              {e?.meetingvoted?.length > 0 &&
                e?.meetingvoted.map((e, i) => (
                  <tr>
                    <td>
                      {e?.title + " - "}(
                      <b>
                        {(chart?.filter((x) => x.title === e?.title)[0]?.vote ??
                          0) + " "}
                        <i className="fas fa-user"></i>
                      </b>
                      )
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        <div
                          style={{
                            width:
                              Number(
                                (chart?.filter((x) => x.title === e?.title)[0]
                                  ?.vote ?? 0) / totalMember
                              ).toFixed(2) *
                                100 +
                              "%",
                            height: "10px",
                            backgroundColor: Theme.theme().css.background.color,
                          }}
                        />
                        {Number(
                          (chart?.filter((x) => x.title === e?.title)[0]
                            ?.vote ?? 0) / totalMember
                        ).toFixed(2) * 100}
                        %
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      ) : (
        <Radio.Group
          onChange={(e) => {
            setChose(e.target.value);
          }}
          value={chose}
        >
          <Space direction="vertical">
            {e?.meetingvoted.map((element) => (
              <Radio value={element?.title}>
                <span
                  style={{
                    fontWeight: "initial",
                  }}
                >
                  {element?.title}
                </span>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      )}
      <br />
      <br />
      {e?.end === false && (
        <>
          {lock === true ? (
            <Button type="primary" onClick={() => setLock(false)}>
              Chọn lại
            </Button>
          ) : (
            <Button type="primary" onClick={() => onSentAnswer()}>
              Gửi kết quả
            </Button>
          )}
        </>
      )}
    </>
  );
};
