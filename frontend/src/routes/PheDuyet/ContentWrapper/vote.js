import React from "react";
import { Button, Checkbox, Col, Input, Radio, Row, Table, Tabs } from "antd";
import Api from "../../../api";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { SESSION_STORAGE } from "../../../config";
import { Theme } from "../../../theme";
const { Search } = Input;

export default function Vote({
  voteList,
  votesDeleteList,
  setVotesDeleteList,
  votesRestoreList,
  setVotesRestoreList,
  getMeetingVote,
  id,
  user,
  member,
}) {
  return (
    // <Tabs
    //   defaultActiveKey="1"
    //   // tabPosition={"left"}
    //   items={[
    //     {
    //       label: `Danh sách chờ duyệt`,
    //       key: 1,
    //       children: (
    //         <>
    //           <Button
    //             onClick={() => {
    //               //console.log(votesDeleteList);
    //               if (votesDeleteList?.length > 0) {
    //                 SwalAlertAllConfiguration({
    //                   title: "Bạn có chắc muốn duyệt không?",
    //                   text: "Khi bạn nhấn 'Đồng ý' sẽ được duyệt!",
    //                   icon: "warning",
    //                   confirmButtonText: "Đồng ý",
    //                   cancelButtonText: "Thoát",
    //                 }).then((result) => {
    //                   if (result.isConfirmed) {
    //                     for (
    //                       let index = 0;
    //                       index < votesDeleteList.length;
    //                       index++
    //                     ) {
    //                       new Api()
    //                         .meeting_votes_status({
    //                           token: JSON.parse(
    //                             sessionStorage.getItem(SESSION_STORAGE)
    //                           )?.access_token,
    //                           id: votesDeleteList[index],
    //                           data: {
    //                             status: true,
    //                             modifiedDate: new Date(),
    //                             modifiedBy: user?.id,
    //                           },
    //                         })
    //                         .then((e) => {
    //                           if (e) {
    //                             setVotesDeleteList([]);
    //                             getMeetingVote(id);
    //                           }
    //                         });
    //                     }
    //                   }
    //                 });
    //               } else {
    //                 SwalAlertAllConfiguration({
    //                   title: "Thông báo",
    //                   text: "Chưa chọn biểu quyết",
    //                   icon: "warning",
    //                 });
    //               }
    //             }}
    //             className="btn-info"
    //             style={{
    //               marginBottom: 16,
    //               marginRight: 16,
    //             }}
    //           >
    //             Phê duyệt
    //           </Button>
    //           <Table
    //             locale={{
    //               emptyText: "Không có dữ liệu.",
    //             }}
    //             rowSelection={{
    //               selectedRowKeys: votesDeleteList,
    //               onChange: (selectedRowKeys, selectedRows) => {
    //                 setVotesDeleteList(selectedRowKeys);
    //               },
    //             }}
    //             columns={[
    //               {
    //                 title: "Tiêu đề",
    //                 dataIndex: "title",
    //                 sorter: (a, b) => a.title.length - b.title.length,
    //               },
    //               {
    //                 title: "Nội dung biểu quyết",
    //                 // dataIndex: "meetingvoted",
    //                 render: (e) => (
    //                   <>
    //                     <Row>
    //                       {e?.meetingvoted.map((element) => (
    //                         <Col span={24}>
    //                           {e.type === true ? (
    //                             <Checkbox value checked={false}>
    //                               <span style={{ fontWeight: "initial" }}>
    //                                 {element?.title}
    //                               </span>
    //                             </Checkbox>
    //                           ) : (
    //                             <Radio value checked={false}>
    //                               <span style={{ fontWeight: "initial" }}>
    //                                 {element?.title}
    //                               </span>
    //                             </Radio>
    //                           )}
    //                         </Col>
    //                       ))}
    //                     </Row>

    //                     {/* {JSON.stringify(e)} */}
    //                   </>
    //                 ),
    //               },
    //               {
    //                 title: "Tình trạng",
    //                 // dataIndex: "status",
    //                 render: (e) => {
    //                   return (
    //                     <>
    //                       {e?.end ? "Tạm dừng biểu quyết" : "Đang biểu quyết"}
    //                       {/* {JSON.stringify(e)} */}
    //                     </>
    //                   );
    //                 },
    //               },
    //             ]}
    //             dataSource={
    //               voteList?.length > 0 &&
    //               voteList.filter(
    //                 (item) =>
    //                   item?.status === false && item?.isDeleted === false
    //               )
    //             }
    //           />
    //         </>
    //       ),
    //     },
    //     {
    //       label: `Danh sách đã duyệt`,
    //       key: 2,
    //       children: (
    //         <>
    //           <Button
    //             onClick={() => {
    //               //console.log(votesRestoreList);
    //               if (votesRestoreList?.length > 0) {
    //                 SwalAlertAllConfiguration({
    //                   title: "Bạn có chắc muốn hủy duyệt không?",
    //                   text: "Khi bạn nhấn 'Đồng ý' sẽ bị hủy duyệt!",
    //                   icon: "warning",
    //                   confirmButtonText: "Đồng ý",
    //                   cancelButtonText: "Thoát",
    //                 }).then((result) => {
    //                   if (result.isConfirmed) {
    //                     for (
    //                       let index = 0;
    //                       index < votesRestoreList.length;
    //                       index++
    //                     ) {
    //                       new Api()
    //                         .meeting_votes_status({
    //                           token: JSON.parse(
    //                             sessionStorage.getItem(SESSION_STORAGE)
    //                           )?.access_token,
    //                           id: votesRestoreList[index],
    //                           data: {
    //                             status: false,
    //                             modifiedDate: new Date(),
    //                             modifiedBy: user?.id,
    //                           },
    //                         })
    //                         .then((e) => {
    //                           if (e) {
    //                             setVotesRestoreList([]);
    //                             getMeetingVote(id);
    //                           }
    //                         });
    //                     }
    //                   }
    //                 });
    //               } else {
    //                 SwalAlertAllConfiguration({
    //                   title: "Thông báo",
    //                   text: "Chưa chọn biểu quyết",
    //                   icon: "warning",
    //                 });
    //               }
    //             }}
    //             className="btn-danger"
    //             style={{
    //               marginBottom: 16,
    //               marginRight: 16,
    //             }}
    //           >
    //             Hủy duyệt
    //           </Button>
    //           <Button
    //             onClick={() => {
    //               //console.log(votesRestoreList);
    //               if (votesRestoreList?.length > 0) {
    //                 SwalAlertAllConfiguration({
    //                   title: "Bạn có chắc muốn kích hoạt không?",
    //                   text: "Khi bạn nhấn 'Đồng ý' sẽ được kích hoạt!",
    //                   icon: "warning",
    //                   confirmButtonText: "Đồng ý",
    //                   cancelButtonText: "Thoát",
    //                 }).then((result) => {
    //                   if (result.isConfirmed) {
    //                     for (
    //                       let index = 0;
    //                       index < votesRestoreList.length;
    //                       index++
    //                     ) {
    //                       new Api()
    //                         .meeting_votes_end({
    //                           token: JSON.parse(
    //                             sessionStorage.getItem(SESSION_STORAGE)
    //                           )?.access_token,
    //                           id: votesRestoreList[index],
    //                           data: {
    //                             end: false,
    //                             modifiedDate: new Date(),
    //                             modifiedBy: user?.id,
    //                           },
    //                         })
    //                         .then((e) => {
    //                           if (e) {
    //                             alert(JSON.stringify(e));
    //                             setVotesRestoreList([]);
    //                             getMeetingVote(id);
    //                           }
    //                         });
    //                     }
    //                   }
    //                 });
    //               } else {
    //                 SwalAlertAllConfiguration({
    //                   title: "Thông báo",
    //                   text: "Chưa chọn biểu quyết",
    //                   icon: "warning",
    //                 });
    //               }
    //             }}
    //             className="btn-default"
    //             style={{
    //               marginBottom: 16,
    //               marginRight: 16,
    //             }}
    //           >
    //             Kich hoạt
    //           </Button>
    //           <Button
    //             onClick={() => {
    //               //console.log(votesRestoreList);
    //               if (votesRestoreList?.length > 0) {
    //                 SwalAlertAllConfiguration({
    //                   title: "Bạn có chắc muốn kết thúc không?",
    //                   text: "Khi bạn nhấn 'Đồng ý' sẽ bị kết thúc!",
    //                   icon: "warning",
    //                   confirmButtonText: "Đồng ý",
    //                   cancelButtonText: "Thoát",
    //                 }).then((result) => {
    //                   if (result.isConfirmed) {
    //                     for (
    //                       let index = 0;
    //                       index < votesRestoreList.length;
    //                       index++
    //                     ) {
    //                       new Api()
    //                         .meeting_votes_end({
    //                           token: JSON.parse(
    //                             sessionStorage.getItem(SESSION_STORAGE)
    //                           )?.access_token,
    //                           id: votesRestoreList[index],
    //                           data: {
    //                             end: true,
    //                             modifiedDate: new Date(),
    //                             modifiedBy: user?.id,
    //                           },
    //                         })
    //                         .then((e) => {
    //                           if (e) {
    //                             setVotesRestoreList([]);
    //                             getMeetingVote(id);
    //                           }
    //                         });
    //                     }
    //                   }
    //                 });
    //               } else {
    //                 SwalAlertAllConfiguration({
    //                   title: "Thông báo",
    //                   text: "Chưa chọn biểu quyết",
    //                   icon: "warning",
    //                 });
    //               }
    //             }}
    //             className="btn-warning"
    //             style={{
    //               marginBottom: 16,
    //               marginRight: 16,
    //             }}
    //           >
    //             Kết thúc
    //           </Button>
    //           <Table
    //             locale={{
    //               emptyText: "Không có dữ liệu.",
    //             }}
    //             rowSelection={{
    //               selectedRowKeys: votesRestoreList,
    //               onChange: (selectedRowKeys, selectedRows) => {
    //                 setVotesRestoreList(selectedRowKeys);
    //               },
    //             }}
    //             columns={[
    //               {
    //                 title: "Tiêu đề",
    //                 dataIndex: "title",
    //                 sorter: (a, b) => a.title.length - b.title.length,
    //               },
    //               {
    //                 title: "Nội dung biểu quyết",
    //                 // dataIndex: "meetingvoted",
    //                 render: (e) => (
    //                   <>
    //                     <Row>
    //                       {e?.meetingvoted.map((element) => (
    //                         <Col span={24}>
    //                           {e.type === true ? (
    //                             <Checkbox value checked={false}>
    //                               <span style={{ fontWeight: "initial" }}>
    //                                 {element?.title}
    //                               </span>
    //                             </Checkbox>
    //                           ) : (
    //                             <Radio value checked={false}>
    //                               <span style={{ fontWeight: "initial" }}>
    //                                 {element?.title}
    //                               </span>
    //                             </Radio>
    //                           )}
    //                         </Col>
    //                       ))}
    //                     </Row>

    //                     {/* {JSON.stringify(e)} */}
    //                   </>
    //                 ),
    //               },
    //               {
    //                 title: "Tình trạng",
    //                 // dataIndex: "status",
    //                 render: (e) => {
    //                   return (
    //                     <>
    //                       {e?.end ? "Tạm dừng biểu quyết" : "Đang biểu quyết"}
    //                       {/* {JSON.stringify(e)} */}
    //                     </>
    //                   );
    //                 },
    //               },
    //             ]}
    //             dataSource={
    //               voteList?.length > 0 &&
    //               voteList.filter(
    //                 (item) => item?.status === true && item?.isDeleted === false
    //               )
    //             }
    //           />
    //         </>
    //       ),
    //     },
    //   ]}
    // />
    <Col span={24}>
      <Button
        type="primary"
        onClick={() => {
          getMeetingVote("", id);
        }}
        className="btn-default"
      >
        <i class="fas fa-sync-alt info"></i> Tải lại
      </Button>{" "}
      {votesDeleteList?.length > 0 && (
        <>
          <Button
            onClick={() => {
              //console.log(votesDeleteList);
              if (votesDeleteList?.length > 0) {
                SwalAlertAllConfiguration({
                  title: "Bạn có chắc muốn duyệt không?",
                  text: "Khi bạn nhấn 'Đồng ý' sẽ được duyệt!",
                  icon: "warning",
                  showCancelButton: true,
                  showLoaderOnConfirm: true,
                  confirmButtonText: "Đồng ý",
                  cancelButtonText: "Thoát",
                }).then((result) => {
                  if (result.isConfirmed) {
                    for (
                      let index = 0;
                      index < votesDeleteList.length;
                      index++
                    ) {
                      new Api()
                        .meeting_votes_status({
                          token: JSON.parse(
                            sessionStorage.getItem(SESSION_STORAGE)
                          )?.access_token,
                          id: votesDeleteList[index],
                          data: {
                            status: true,
                            modifiedDate: new Date(),
                            modifiedBy: user?.id,
                          },
                        })
                        .then((e) => {
                          setVotesDeleteList([]);
                          if (e) {
                            getMeetingVote("", id);
                          }
                        });
                      if (index + 1 === votesDeleteList.length) {
                        SwalAlertAllConfiguration({
                          title: "Phê duyệt thành công",
                          icon: "success",
                          timer: 1500,
                        });
                      }
                    }
                  }
                });
              }
            }}
            className="btn-default"
          >
            <i class="fas fa-check info"></i> Phê duyệt
          </Button>
          <Button
            onClick={() => {
              //console.log(votesDeleteList);
              if (votesDeleteList?.length > 0) {
                SwalAlertAllConfiguration({
                  title: "Bạn có chắc muốn hủy duyệt không?",
                  text: "Khi bạn nhấn 'Đồng ý' sẽ bị hủy duyệt!",
                  icon: "warning",
                  showCancelButton: true,
                  showLoaderOnConfirm: true,
                  confirmButtonText: "Đồng ý",
                  cancelButtonText: "Thoát",
                }).then((result) => {
                  if (result.isConfirmed) {
                    for (
                      let index = 0;
                      index < votesDeleteList.length;
                      index++
                    ) {
                      new Api()
                        .meeting_votes_status({
                          token: JSON.parse(
                            sessionStorage.getItem(SESSION_STORAGE)
                          )?.access_token,
                          id: votesDeleteList[index],
                          data: {
                            status: false,
                            modifiedDate: new Date(),
                            modifiedBy: user?.id,
                          },
                        })
                        .then((e) => {
                          if (e) {
                            setVotesDeleteList([]);
                            getMeetingVote("", id);
                          }
                        });
                      if (index + 1 === votesDeleteList.length) {
                        SwalAlertAllConfiguration({
                          title: "Hủy duyệt thành công",
                          icon: "success",
                          timer: 1500,
                        });
                      }
                    }
                  }
                });
              }
            }}
            className="btn-default"
          >
            <i class="fas fa-ban danger"></i> Hủy duyệt
          </Button>
          <Button
            onClick={() => {
              //console.log(votesDeleteList);
              if (votesDeleteList?.length > 0) {
                SwalAlertAllConfiguration({
                  title: "Bạn có chắc muốn kích hoạt không?",
                  text: "Khi bạn nhấn 'Đồng ý' sẽ được kích hoạt!",
                  icon: "warning",
                  showCancelButton: true,
                  showLoaderOnConfirm: true,
                  confirmButtonText: "Đồng ý",
                  cancelButtonText: "Thoát",
                }).then((result) => {
                  if (result.isConfirmed) {
                    for (
                      let index = 0;
                      index < votesDeleteList.length;
                      index++
                    ) {
                      new Api()
                        .meeting_votes_end({
                          token: JSON.parse(
                            sessionStorage.getItem(SESSION_STORAGE)
                          )?.access_token,
                          id: votesDeleteList[index],
                          data: {
                            end: false,
                            modifiedDate: new Date(),
                            modifiedBy: user?.id,
                          },
                        })
                        .then((e) => {
                          if (e) {
                            setVotesDeleteList([]);
                            getMeetingVote("", id);
                          }
                        });
                      if (index + 1 === votesDeleteList.length) {
                        SwalAlertAllConfiguration({
                          title: "Kích hoạt thành công",
                          icon: "success",
                          timer: 1500,
                        });
                      }
                    }
                  }
                });
              }
            }}
            className="btn-default"
          >
            <i class="fas fa-check info"></i> Kích hoạt
          </Button>
          <Button
            onClick={() => {
              //console.log(votesDeleteList);
              if (votesDeleteList?.length > 0) {
                SwalAlertAllConfiguration({
                  title: "Bạn có chắc muốn hủy kích hoạt không?",
                  text: "Khi bạn nhấn 'Đồng ý' sẽ bị hủy kích hoạt!",
                  icon: "warning",
                  showCancelButton: true,
                  showLoaderOnConfirm: true,
                  confirmButtonText: "Đồng ý",
                  cancelButtonText: "Thoát",
                }).then((result) => {
                  if (result.isConfirmed) {
                    for (
                      let index = 0;
                      index < votesDeleteList.length;
                      index++
                    ) {
                      new Api()
                        .meeting_votes_end({
                          token: JSON.parse(
                            sessionStorage.getItem(SESSION_STORAGE)
                          )?.access_token,
                          id: votesDeleteList[index],
                          data: {
                            end: true,
                            modifiedDate: new Date(),
                            modifiedBy: user?.id,
                          },
                        })
                        .then((e) => {
                          if (e) {
                            setVotesDeleteList([]);
                            getMeetingVote("", id);
                          }
                        });
                      if (index + 1 === votesDeleteList.length) {
                        SwalAlertAllConfiguration({
                          title: "Hủy kích hoạt thành công",
                          icon: "success",
                          timer: 1500,
                        });
                      }
                    }
                  }
                });
              }
            }}
            className="btn-default"
          >
            <i class="fas fa-ban danger"></i> Hủy kích hoạt
          </Button>
        </>
      )}
      {votesDeleteList?.length > 0 && (
        <>
          {/* <Button
            onClick={() => {
              //console.log(votesDeleteList);
              if (votesDeleteList?.length > 0) {
                SwalAlertAllConfiguration({
                  title: "Bạn có chắc muốn xóa không?",
                  text: "Khi bạn nhấn 'Đồng ý' sẽ bị xóa!",
                  icon: "warning",
                  showCancelButton: true,
                  showLoaderOnConfirm: true,
                  confirmButtonText: "Đồng ý",
                  cancelButtonText: "Thoát",
                  dangerMode: true,
                }).then((result) => {
                  if (result.isConfirmed) {
                    for (
                      let index = 0;
                      index < votesDeleteList.length;
                      index++
                    ) {
                      new Api()
                        .remove_meeting_votes({
                          token: JSON.parse(
                            sessionStorage.getItem(SESSION_STORAGE)
                          )?.access_token,
                          id: votesDeleteList[index],
                        })
                        .then((e) => {
                          if (e) {
                            setVotesDeleteList([]);
                            getMeetingVote("", id);
                          }
                        });
                      if (index + 1 === votesDeleteList.length) {
                        SwalAlertAllConfiguration({
                          title: "Xóa thành công",
                          icon: "success",
                          timer: 1500,
                        });
                      }
                    }
                  }
                });
              }
            }}
            className="btn-default"
          >
            <i class="fas fa-trash-alt danger"></i> Xóa
          </Button> */}
        </>
      )}
      {votesRestoreList?.length > 0 && (
        <>
          {/* <Button
            onClick={() => {
              //console.log(votesRestoreList);
              if (votesRestoreList?.length > 0) {
                SwalAlertAllConfiguration({
                  title: "Bạn có chắc muốn khôi phục không?",
                  text: "Khi bạn nhấn 'Đồng ý' sẽ được khôi phục!",
                  icon: "warning",
                  showCancelButton: true,
                  showLoaderOnConfirm: true,
                  confirmButtonText: "Đồng ý",
                  cancelButtonText: "Thoát",
                }).then((result) => {
                  if (result.isConfirmed) {
                    for (
                      let index = 0;
                      index < votesRestoreList.length;
                      index++
                    ) {
                      new Api()
                        .restore_meeting_votes({
                          token: JSON.parse(
                            sessionStorage.getItem(SESSION_STORAGE)
                          )?.access_token,
                          id: votesRestoreList[index],
                        })
                        .then((e) => {
                          if (e) {
                            setVotesRestoreList([]);
                            getMeetingVote("", id);
                          }
                        });
                      if (index + 1 === votesRestoreList.length) {
                        SwalAlertAllConfiguration({
                          title: "Khôi phục thành công",
                          icon: "success",
                          timer: 1500,
                        });
                      }
                    }
                  }
                });
              }
            }}
            className="btn-default"
          >
            <i class="fas fa-trash-restore info"></i> Khôi phục
          </Button>
          <Button
            onClick={() => {
              //console.log(votesRestoreList);
              if (votesRestoreList?.length > 0) {
                SwalAlertAllConfiguration({
                  title: "Bạn có chắc muốn xóa vĩnh viễn không?",
                  text: "Khi bạn nhấn 'Đồng ý' sẽ bị xóa vĩnh viễn!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Đồng ý",
                  cancelButtonText: "Thoát",
                  showLoaderOnConfirm: true,
                  dangerMode: true,
                }).then((result) => {
                  if (result.isConfirmed) {
                    for (
                      let index = 0;
                      index < votesRestoreList.length;
                      index++
                    ) {
                      new Api()
                        .delete_meeting_votes({
                          token: JSON.parse(
                            sessionStorage.getItem(SESSION_STORAGE)
                          )?.access_token,
                          id: votesRestoreList[index],
                        })
                        .then((e) => {
                          if (e) {
                            setVotesRestoreList([]);
                            getMeetingVote("", id);
                          }
                        });
                      if (index + 1 === votesRestoreList.length) {
                        SwalAlertAllConfiguration({
                          title: "Xóa thành công",
                          icon: "success",
                          timer: 1500,
                        });
                      }
                    }
                  }
                });
              }
            }}
            className="btn-default"
            title="Xóa vĩnh viễn"
          >
            <i class="fas fa-times danger"></i> Xóa
          </Button> */}
        </>
      )}
      <Tabs
        defaultActiveKey="1"
        // tabPosition={"left"}
        items={[
          {
            label: `Danh sách`,
            key: 1,
            children: (
              <>
                <Search
                  placeholder="Nhập tiêu đề tìm kiếm"
                  onSearch={(value) => {
                    console.log(value);
                    getMeetingVote(value, id);
                  }}
                  enterButton
                />
                <Table
                  locale={{
                    emptyText: "Không có dữ liệu.",
                  }}
                  rowSelection={{
                    selectedRowKeys: votesDeleteList,
                    onChange: (selectedRowKeys, selectedRows) => {
                      setVotesDeleteList(selectedRowKeys);
                    },
                  }}
                  columns={[
                    {
                      title: "Tiêu đề",
                      dataIndex: "title",
                      sorter: (a, b) => a.title.length - b.title.length,
                    },
                    {
                      title: "Nội dung biểu quyết",
                      // dataIndex: "meetingvoted",
                      render: (e) => (
                        <>
                          <Row>
                            {e?.meetingvoted.map((element) => (
                              <Col span={24}>
                                {e.type === true ? (
                                  <Checkbox value checked={false}>
                                    <span style={{ fontWeight: "initial" }}>
                                      {element?.title}
                                    </span>
                                  </Checkbox>
                                ) : (
                                  <Radio value checked={false}>
                                    <span style={{ fontWeight: "initial" }}>
                                      {element?.title}
                                    </span>
                                  </Radio>
                                )}
                              </Col>
                            ))}
                          </Row>

                          {/* {JSON.stringify(e)} */}
                        </>
                      ),
                    },
                    {
                      title: "Tình trạng",
                      // dataIndex: "status",
                      render: (e) => {
                        return (
                          <>
                            {(e?.status ? "Đã duyệt" : "Chưa duyệt") +
                              " | " +
                              (e?.end
                                ? "Tạm dừng biểu quyết"
                                : "Đang biểu quyết")}
                            {/* {JSON.stringify(e)} */}
                          </>
                        );
                      },
                    },
                  ]}
                  dataSource={
                    voteList?.length > 0 &&
                    voteList.filter((item) => item?.isDeleted === false)
                  }
                />
              </>
            ),
          },
          // {
          //   label: `Danh sách đã xóa`,
          //   key: 2,
          //   children: (
          //     <>
          //       <Search
          //         placeholder="Nhập tiêu đề tìm kiếm"
          //         onSearch={(value) => {
          //           console.log(value);
          //           getMeetingVote(value, id);
          //         }}
          //         enterButton
          //       />
          //       <Table
          //         locale={{
          //           emptyText: "Không có dữ liệu.",
          //         }}
          //         rowSelection={{
          //           selectedRowKeys: votesRestoreList,
          //           onChange: (selectedRowKeys, selectedRows) => {
          //             setVotesRestoreList(selectedRowKeys);
          //           },
          //         }}
          //         columns={[
          //           {
          //             title: "Tiêu đề",
          //             dataIndex: "title",
          //             sorter: (a, b) => a.title.length - b.title.length,
          //           },
          //           {
          //             title: "Nội dung biểu quyết",
          //             // dataIndex: "meetingvoted",
          //             render: (e) => (
          //               <>
          //                 <Row>
          //                   {e?.meetingvoted.map((element) => (
          //                     <Col span={24}>
          //                       {e.type === true ? (
          //                         <Checkbox value checked={false}>
          //                           <span style={{ fontWeight: "initial" }}>
          //                             {element?.title}
          //                           </span>
          //                         </Checkbox>
          //                       ) : (
          //                         <Radio value checked={false}>
          //                           <span style={{ fontWeight: "initial" }}>
          //                             {element?.title}
          //                           </span>
          //                         </Radio>
          //                       )}
          //                     </Col>
          //                   ))}
          //                 </Row>

          //                 {/* {JSON.stringify(e)} */}
          //               </>
          //             ),
          //           },
          //         ]}
          //         dataSource={
          //           voteList?.length > 0 &&
          //           voteList.filter((item) => item?.isDeleted === true)
          //         }
          //       />
          //     </>
          //   ),
          // },
          {
            label: `Danh sách chờ biểu quyết`,
            key: 3,
            children: (
              <>
                <Search
                  placeholder="Nhập tiêu đề tìm kiếm"
                  onSearch={(value) => {
                    console.log(value);
                    getMeetingVote(value, id);
                  }}
                  enterButton
                />
                <Table
                  locale={{
                    emptyText: "Không có dữ liệu.",
                  }}
                  columns={[
                    {
                      title: "Tiêu đề",
                      dataIndex: "title",
                      sorter: (a, b) => a.title.length - b.title.length,
                    },
                    {
                      title: "Nội dung biểu quyết",
                      // dataIndex: "meetingvoted",
                      render: (e) => (
                        <>
                          <Row>
                            {e?.meetingvoted.map((element) => (
                              <Col span={24}>
                                {e.type === true ? (
                                  <Checkbox value checked={false}>
                                    <span style={{ fontWeight: "initial" }}>
                                      {element?.title}
                                    </span>
                                  </Checkbox>
                                ) : (
                                  <Radio value checked={false}>
                                    <span style={{ fontWeight: "initial" }}>
                                      {element?.title}
                                    </span>
                                  </Radio>
                                )}
                              </Col>
                            ))}
                          </Row>

                          {/* {JSON.stringify(e)} */}
                        </>
                      ),
                    },
                  ]}
                  dataSource={
                    voteList?.length > 0 &&
                    voteList.filter(
                      (item) =>
                        item?.isDeleted === false &&
                        item?.end === false &&
                        item?.status === true
                    )
                  }
                />
              </>
            ),
          },
          {
            label: `Danh sách kết quả biểu quyết`,
            key: 4,
            children: (
              <>
                <Search
                  placeholder="Nhập tiêu đề tìm kiếm"
                  onSearch={(value) => {
                    console.log(value);
                    getMeetingVote(value, id);
                  }}
                  enterButton
                />
                <Table
                  locale={{
                    emptyText: "Không có dữ liệu.",
                  }}
                  columns={[
                    {
                      title: "Tiêu đề",
                      dataIndex: "title",
                      sorter: (a, b) => a.title.length - b.title.length,
                    },
                    {
                      title: "Kết quả biểu quyết",
                      // dataIndex: "meetingvoted",
                      render: (e) => (
                        <>
                          <Row>
                            {e?.meetingVotedCount?.length > 0 &&
                              e?.meetingVotedCount.map((et, i) => (
                                <>
                                  <Col span={24}>
                                    <b>
                                      {i + 1 + ") " + et?.title + " - "}(
                                      {et?.vote + " "}
                                      <i className="fas fa-user"></i>
                                    </b>
                                    )
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
                                              et?.vote / member.length
                                            ).toFixed(2) *
                                              100 +
                                            "%",
                                          height: "10px",
                                          backgroundColor:
                                            Theme.theme().css.background.color,
                                        }}
                                      />
                                      {Number(et?.vote / member.length).toFixed(
                                        2
                                      ) * 100}
                                      %
                                    </div>
                                  </Col>
                                  {e?.meetingVoted
                                    ?.filter(
                                      (item) => item?.title === et?.title
                                    )
                                    .map((element) => (
                                      <Col span={24}>
                                        <i style={{ fontWeight: "initial" }}>
                                          {element?.userCreatedBy?.ten_day_du +
                                            " - " +
                                            element?.userCreatedBy
                                              ?.ten_dangnhap}
                                        </i>
                                      </Col>
                                    ))}
                                </>
                              ))}
                          </Row>

                          {/* {JSON.stringify(e)} */}
                        </>
                      ),
                    },
                  ]}
                  dataSource={
                    voteList?.length > 0 &&
                    voteList.filter(
                      (item) =>
                        item?.isDeleted === false &&
                        item?.end === true &&
                        item?.status === true &&
                        item?.count > 0
                    )
                  }
                />
              </>
            ),
          },
        ]}
      />
    </Col>
  );
}
