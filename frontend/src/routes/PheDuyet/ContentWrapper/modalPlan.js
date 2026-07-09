import { useEffect, useState } from "react";
import { TabContext } from "@mui/lab";
import { Box } from "@mui/material";
import { Button, DatePicker } from "antd";
import dayjs from "dayjs";
import Api from "../../../api";
import ScrollbarsCustum from "../../../components/ScrollbarsCustum";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { SESSION_STORAGE } from "../../../config";
import Helper from "../../../helper/helper";
import userManager from "../../../services/auth";
import Document from "./document";
import Plan from "./plan";
const { RangePicker } = DatePicker;
let timeoutUser;
let currentValueUser;
export const HandleTabsUpdatePlan = ({
  contentCall,
  memberCall,
  memberEmailCall,
  documentCall,
  // user,
  onHandleCancel,
  edit,
  permissions,
  user,
  setUser,
}) => {
  // const scrollBarRefPheDuyetContentWrapperModalPlan = useRef();
  const [value, setValue] = useState("calendar-setting-form");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const [user, setUser] = useState(null);

  //plan
  const [id, setId] = useState(null);
  const [symbol, setSymbol] = useState(null);
  const [abstract, setAbstract] = useState(null);
  const [content, setContent] = useState(null);
  const [dateIssued, setDateIssued] = useState(null);
  const [agencyIssued, setAgencyIssued] = useState(null);
  const [signer, setSigner] = useState(null);
  const [effectiveDate, setEffectiveDate] = useState(null);
  const [belongToUnit, setBelongToUnit] = useState(null);
  const [status, setStatus] = useState(null);
  //
  //document
  const [doc, setDoc] = useState("");
  const [docList, setDocList] = useState([]);
  const [docPostList, setDocPostList] = useState([]);
  const [docDeleteList, setDocDeleteList] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [fileListUpLoad, setFileListUpLoad] = useState([]);
  const [uploading, setUploading] = useState(false);

  const getMeetingDocument = (id) => {
    return new Api()
      .get_document_byFileUrl({
        url: "kehoach/" + id,
        pageSize: 999999,
        pageNumber: 1,
      })
      .then((response) => {
        if (response?.data) {
          setDocList(
            response?.data.map((item, index) => ({
              ...item,
              key: item?.id,
            }))
          );
        }
      });
  };

  useEffect(() => {
    if (!Helper.isNullOrUndefined(edit)) {
      userManager.getUser().then((res) => {
        if (!Helper.isNullOrUndefined(res)) {
          setId(edit?.id);
          setSymbol(edit?.symbol);
          setAbstract(edit?.abstract);
          setContent(edit?.content);
          setDateIssued(dayjs(edit?.dateIssued));
          setAgencyIssued(edit?.agencyIssued);
          setSigner(edit?.signer);
          setEffectiveDate(dayjs(edit?.effectiveDate));
          setBelongToUnit(edit?.belongToUnit);
          setStatus(edit?.status);
          //
          //Document
          getMeetingDocument(edit?.id); //
        }
      });
    }
  }, [id, edit]);

  useEffect(() => {
    if (!Helper.isNullOrUndefined(documentCall)) {
      setDocList(documentCall);
    }
  }, [documentCall]);

  //
  //document
  const InsertDocument = (item) => {
    new Api().create_meeting_document({
      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
      data: item,
    });
  };
  const RemoveDocument = (id) => {
    new Api().remove_document({
      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))?.access_token,
      id: id,
    });
  };
  const onWrite = () => {
    if (status === 1) {
      SwalAlertAllConfiguration({
        title: "Bạn có chắc muốn phê duyệt không?",
        text: "Khi bạn nhấn 'Đồng ý' sẽ được phê duyệt!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Thoát",
        showLoaderOnConfirm: true,
        dangerMode: true,
      }).then((result) => {
        if (result.isConfirmed) {
          new Api()
            .approvePlanSchedule({
              token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                ?.access_token,
              id: id,
            })
            .then((response) => {
              if (response) {
                onHandleCancel();
                for (let index = 0; index < docList.length; index++) {
                  new Api()
                    .approve_meeting_document({
                      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                        ?.access_token,
                      id: docList[index]?.id,
                    })
                    .then((e) => {
                      if (e) {
                        getMeetingDocument(id);
                      }
                    });
                }
                SwalAlertAllConfiguration({
                  title: "Thông báo! ",
                  text: "Phê duyệt thành công",
                  icon: "success",
                });
              } else
                SwalAlertAllConfiguration({
                  title: "Thông báo! ",
                  text: response?.message,
                  icon: "warning",
                });
            })
            .catch((e) => {
              SwalAlertAllConfiguration({
                title: "Thông báo! ",
                text: e.message,
                icon: "warning",
              });
            });
        } else {
          return false;
        }
      });
    }
    if (status === 2) {
      SwalAlertAllConfiguration({
        title: "Bạn có chắc muốn hủy phê duyệt không?",
        text: "Khi bạn nhấn 'Đồng ý' sẽ được hủy phê duyệt!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Thoát",
        showLoaderOnConfirm: true,
        dangerMode: true,
      }).then((result) => {
        if (result.isConfirmed) {
          new Api()
            .unApprovePlanSchedule({
              token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                ?.access_token,
              id: id,
            })
            .then((response) => {
              if (response) {
                onHandleCancel();
                for (let index = 0; index < docList.length; index++) {
                  new Api()
                    .unapprove_meeting_document({
                      token: JSON.parse(sessionStorage.getItem(SESSION_STORAGE))
                        ?.access_token,
                      id: docList[index]?.id,
                    })
                    .then((e) => {
                      if (e) {
                        getMeetingDocument(id);
                      }
                    });
                }
                SwalAlertAllConfiguration({
                  title: "Thông báo! ",
                  text: "Hủy phê duyệt thành công",
                  icon: "success",
                });
              } else
                SwalAlertAllConfiguration({
                  title: "Thông báo! ",
                  text: response?.message,
                  icon: "warning",
                });
            })
            .catch((e) => {
              SwalAlertAllConfiguration({
                title: "Thông báo! ",
                text: e.message,
                icon: "warning",
              });
            });
        } else {
          return false;
        }
      });
    }
  };

  return (
    <>
      {user !== null && (
        <>
          <div className="card card-primary card-outline card-outline-tabs">
            <TabContext value={value}>
              <div className="card-header p-0 border-bottom-0">
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  {/* <TabList
                    onChange={handleChange}
                    aria-label="handletab"
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                  >
                    <Tab
                      icon={<i className="far fa-calendar-alt"></i>}
                      label="THÔNG TIN KẾ HOẠCH HỌP"
                      iconPosition="start"
                      value="calendar-setting-form"
                    />
                    <Tab
                      icon={<i className="fas fa-file"></i>}
                      label="TÀI LIỆU"
                      iconPosition="start"
                      value="calendar-setting-document"
                    />
                    <Tab
                      icon={<i className="fas fa-user-cog"></i>}
                      label="CHỦ TRÌ VÀ ỦY QUYỀN ĐIỀU HÀNH"
                      iconPosition="start"
                      value="calendar-setting-share-role"
                    />
                  </TabList> */}
                </Box>
              </div>
              <div className="card-body">
                <ScrollbarsCustum
                  // ref={scrollBarRefPheDuyetContentWrapperModalPlan}
                  style={{
                    height: window.innerHeight / 2,
                    maxHeight: window.innerHeight / 2 + "px",
                    // height: 400,
                    // maxHeight: "400px",
                  }}
                  autoHide
                  autoHideTimeout={1000}
                  autoHideDuration={200}
                >
                  <Plan
                    symbol={symbol}
                    setSymbol={setSymbol}
                    abstract={abstract}
                    setAbstract={setAbstract}
                    content={content}
                    setContent={setContent}
                    dateIssued={dateIssued}
                    setDateIssued={setDateIssued}
                    agencyIssued={agencyIssued}
                    setAgencyIssued={setAgencyIssued}
                    signer={signer}
                    setSigner={setSigner}
                    effectiveDate={effectiveDate}
                    setEffectiveDate={setEffectiveDate}
                    belongToUnit={belongToUnit}
                    setBelongToUnit={setBelongToUnit}
                  />
                  <label htmlFor="">Danh sách tài liệu</label>
                  <Document
                    RemoveDocument={RemoveDocument}
                    docList={docList}
                    setDocList={setDocList}
                    user={user}
                    getMeetingDocument={getMeetingDocument}
                    scheduleId={id}
                    isUpload={isUpload}
                    fileListUpLoad={fileListUpLoad}
                    setFileListUpLoad={setFileListUpLoad}
                    uploading={uploading}
                    setUploading={setUploading}
                  />
                </ScrollbarsCustum>
              </div>
            </TabContext>
          </div>
          <div className="row form-group">
            <div className="col-md-12 align-center m-1">
              <Button
                className="btn btn-sm btn-default m-1"
                onClick={() => onWrite()}
              >
                <i className="fas fa-check-double" />{" "}
                {status === 1 ? "Phê duyệt" : status === 2 && "Hủy duyệt"}
              </Button>
              <Button
                className="btn btn-sm btn-default m-1"
                data-dismiss="modal"
                onClick={() => onHandleCancel()}
              >
                <i className="fas fa-ban red"></i> Hủy
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
