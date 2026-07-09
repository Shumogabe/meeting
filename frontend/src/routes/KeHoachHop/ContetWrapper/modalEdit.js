import React, { useEffect, useState } from "react";
import { Button } from "antd";
import dayjs from "dayjs";
import Api from "../../../api";
import { CheckUser } from "../../../components/Modal";
import { SwalAlertAllConfiguration } from "../../../components/Swal";
import { handleUpload } from "../../../components/Upload";
import { SESSION_STORAGE } from "../../../config";
import { HREF } from "../../../constants/dictionaries";
import Helper from "../../../helper/helper";
import userManager from "../../../services/auth";
import Document from "./document";
import Schedule from "./schedule";
import { checkNamePerson, checkSysmbol } from "../../../helper/url";
let timeoutUser;
let currentValueUser;
export default function ModalEdit({
  scheduleId,
  documentCall,
  onHandleCancel,
  edit,
  openEdit,
  dungLuongToiDaTepTaiLen,
}) {
  // const scrollBarRefKeHoachHopContentWrapperModalEdit = useRef();
  const [value, setValue] = useState("calendar-setting-form");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [user, setUser] = useState(null);
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
  //
  //document
  const [doc, setDoc] = useState("");
  const [docList, setDocList] = useState([]);
  const [docPostList, setDocPostList] = useState([]);
  const [docDeleteList, setDocDeleteList] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [fileListUpLoad, setFileListUpLoad] = useState([]);
  const [uploading, setUploading] = useState(false);

  const onSetting = (id) => {
    if (id) {
      new Api()
        .getPlanScheduleDetail({
          id: id,
        })
        .then((response) => {
          if (response?.data?.id) {
            //
            setId(response?.data?.id);
            setSymbol(response?.data?.symbol);
            setAbstract(response?.data?.abstract);
            setContent(response?.data?.content);
            setDateIssued(dayjs(response?.data?.dateIssued));
            setAgencyIssued(response?.data?.agencyIssued);
            setSigner(response?.data?.signer);
            setEffectiveDate(dayjs(response?.data?.effectiveDate));
            setBelongToUnit(response?.data?.belongToUnit);
            //
            //Document
            getMeetingDocument(response?.data?.id); //
          } else {
            SwalAlertAllConfiguration({
              title: "Thông báo!",
              text: "Không tìm thấy thông tin phòng họp",
              icon: "warning",
            });
          }
        });
    } else
      SwalAlertAllConfiguration({
        title: "Thông báo!",
        text: "Thông tin lịch không tồn tại",
        icon: "warning",
      });
  };

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
            response?.data.filter((item) => item?.isDeleted === false),
          );
        }
      });
  };

  useEffect(() => {
    if (!Helper.isNullOrUndefined(scheduleId)) {
      userManager.getUser().then((res) => {
        if (!Helper.isNullOrUndefined(res)) {
          onSetting(scheduleId);
          CheckUser()
            .then((user) => {
              if (Helper.isNullOrUndefined(user)) {
                let ignoreMobileMode =
                  sessionStorage.getItem("ignoreMobileMode");
                sessionStorage.clear();
                sessionStorage.setItem("ignoreMobileMode", ignoreMobileMode);
                localStorage.clear();
                window.location.href = HREF.DangNhap;
              } else {
                setUser(user);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    }
  }, [scheduleId, onHandleCancel]);

  useEffect(() => {
    if (!Helper.isNullOrUndefined(documentCall)) {
      setDocList(documentCall);
    }
  }, [documentCall]);

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

  //
  //secure
  //

  const onWrite = (status) => {
    if (Helper.isNullOrUndefined(symbol)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Ký hiệu không được để trống",
        icon: "warning",
      });
    }
    if (Helper.isNullOrUndefined(abstract)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Trích yếu không được để trống",
        icon: "warning",
      });
    }
    if (Helper.isNullOrUndefined(content)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Nội dung không được để trống",
        icon: "warning",
      });
    }
    if (Helper.isNullOrUndefined(dateIssued)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Ngày ban hành không được để trống",
        icon: "warning",
      });
    }
    if (Helper.isNullOrUndefined(agencyIssued)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Cơ quan ban hành không được để trống",
        icon: "warning",
      });
    }
    if (Helper.isNullOrUndefined(signer)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Người ký không được để trống",
        icon: "warning",
      });
    }
    if (!checkSysmbol(symbol)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Không cho phép nhập ký tự đặc biệt vào trường thông tin Số / ký hiệu(*)",
        icon: "warning",
      });
    }
    if (!checkNamePerson(signer)) {
      return SwalAlertAllConfiguration({
        title: "Thông báo! ",
        text: "Không cho phép nhập ký tự đặc biệt, ký tự số vào trường Người ký(*)",
        icon: "warning",
      });
    }
    var res = JSON.parse(sessionStorage.getItem(SESSION_STORAGE));
    let data = {
      schedule: {
        id: !Helper.isNullOrUndefined(id) ? id : "",
        symbol: !Helper.isNullOrUndefined(symbol) ? symbol : "",
        abstract: !Helper.isNullOrUndefined(abstract) ? abstract : "",
        content: !Helper.isNullOrUndefined(content) ? content : "",
        dateIssued: !Helper.isNullOrUndefined(dateIssued)
          ? dateIssued.format("YYYY-MM-DDTHH:mm:ss")
          : "",
        agencyIssued: !Helper.isNullOrUndefined(agencyIssued)
          ? agencyIssued
          : "",
        signer: !Helper.isNullOrUndefined(signer) ? signer : "",
        effectiveDate: !Helper.isNullOrUndefined(effectiveDate)
          ? effectiveDate.format("YYYY-MM-DDTHH:mm:ss")
          : "",
        belongToUnit: !Helper.isNullOrUndefined(belongToUnit)
          ? belongToUnit
          : "",
        status: status,
      },
      // content: contentList,
      // member: memberList,
      // memberEmail: memberEmail,
      // document: {},
      // votes: {},
      // voted: {},
    };
    setIsUpload(true);
    //console.log(data);
    new Api()
      .updatePlanSchedule({
        token: res?.access_token,
        id: scheduleId,
        data: data?.schedule,
      })
      .then((response) => {
        if (response) {
          if (!Helper.isNullOrUndefined(fileListUpLoad)) {
            handleUpload(
              fileListUpLoad,
              setFileListUpLoad,
              "kehoach/" + scheduleId,
              setUploading,
              docList,
              response?.scheduleId,
              user,
              getMeetingDocument,
            );
          }
          onHandleCancel();
          setSymbol(null);
          setAbstract(null);
          setContent("");
          setDateIssued(null);
          setAgencyIssued(null);
          setSigner(null);
          setEffectiveDate(null);
          setBelongToUnit(null);
          setDocList([]);
          setIsUpload(false);
          setFileListUpLoad([]);
          setUploading(false);
          SwalAlertAllConfiguration({
            title: "Thông báo! ",
            text: response?.message,
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
    setIsUpload(false);
  };
  return (
    <>
      {user !== null && (
        <>
          {/* <div className="card card-primary card-outline card-outline-tabs">
            <TabContext value={value}>
              <div className="card-header p-0 border-bottom-0">
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
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
                      label="TÀI LIỆU HỌP"
                      iconPosition="start"
                      value="calendar-setting-document"
                    />
                    <Tab
                      icon={<i className="fas fa-user-cog"></i>}
                      label="CHỦ TRÌ VÀ ỦY QUYỀN ĐIỀU HÀNH"
                      iconPosition="start"
                      value="calendar-setting-share-role"
                    />
                  </TabList>
                </Box>
              </div>
              <div className="card-body">
                <ScrollbarsCustum
                  // ref={scrollBarRefKeHoachHopContentWrapperModalEdit}
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
                </ScrollbarsCustum>
              </div>
            </TabContext>
          </div> */}
          <Schedule
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
          <Document
            RemoveDocument={RemoveDocument}
            docList={docList}
            setDocList={setDocList}
            user={user}
            getMeetingDocument={getMeetingDocument}
            scheduleId={scheduleId}
            isUpload={isUpload}
            fileListUpLoad={fileListUpLoad}
            setFileListUpLoad={setFileListUpLoad}
            uploading={uploading}
            setUploading={setUploading}
            openEdit={openEdit}
            dungLuongToiDaTepTaiLen={dungLuongToiDaTepTaiLen}
          />
          <div className="row form-group">
            <div className="col-md-12 align-center m-1">
              <Button
                className="btn btn-sm btn-default m-1"
                onClick={() => onWrite(0)}
              >
                <i className="fas fa-edit"></i> Lưu
              </Button>
              <Button
                className="btn btn-sm btn-primary m-1"
                onClick={() => onWrite(1)}
              >
                <i className="fas fa-edit"></i> Gửi duyệt
              </Button>
              <Button
                className="btn btn-sm btn-default m-1"
                data-dismiss="modal"
                onClick={() => onHandleCancel()}
              >
                <i className="fas fa-undo"></i> Quay lại
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
