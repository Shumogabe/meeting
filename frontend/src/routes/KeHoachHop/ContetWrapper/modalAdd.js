import React, { useEffect, useState } from "react";
import { Button } from "antd";
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
import {
  checkNamePerson,
  checkRoomName,
  checkSysmbol,
} from "../../../helper/url";
let timeoutUser;
let currentValueUser;
export default function ModalAdd({
  onHandleCancel,
  edit,
  scheduleId,
  setScheduleId,
  dungLuongToiDaTepTaiLen,
}) {
  // const scrollBarRefKeHoachHopContentWrapperModalAdd = useRef();
  const [value, setValue] = useState("calendar-setting-form");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [user, setUser] = useState(null);
  //plan
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

  const getMeetingDocument = (id) => {
    return new Api()
      .get_document_byFileUrl({
        url: "kehoach/" + id,
        pageSize: 999999,
        pageNumber: 1,
      })
      .then((response) => {
        if (response?.data) {
          setDocList(response?.data);
        }
      });
  };

  useEffect(() => {
    userManager.getUser().then((res) => {
      if (!Helper.isNullOrUndefined(res)) {
        CheckUser()
          .then((user) => {
            if (Helper.isNullOrUndefined(user)) {
              let ignoreMobileMode = sessionStorage.getItem("ignoreMobileMode");
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
  }, []);

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
    };
    setIsUpload(true);
    //console.log(data);
    new Api()
      .insertPlanSchedule({
        token: res?.access_token,
        id: scheduleId,
        data: data?.schedule,
      })
      .then((response) => {
        if (response) {
          new Api()
            .getPlanByTitle({
              symbol: symbol,
            })
            .then((e) => {
              if (!Helper.isNullOrUndefined(fileListUpLoad)) {
                handleUpload(
                  fileListUpLoad,
                  setFileListUpLoad,
                  "kehoach/" + e?.data?.id,
                  setUploading,
                  docList,
                  e?.scheduleId, //e?.data?.id,
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
              <div className="card-body">
            </TabContext>
          </div>
              </div> */}
          {/* <ScrollbarsCustum
            // ref={scrollBarRefKeHoachHopContentWrapperModalAdd}
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
          </ScrollbarsCustum> */}
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
            dungLuongToiDaTepTaiLen={dungLuongToiDaTepTaiLen}
          />
          <div className="row form-group">
            <div className="col-md-12 align-center m-1">
              <Button
                className="btn btn-sm btn-default m-1"
                onClick={() => onWrite(0)}
              >
                <i className="fas fa-edit"></i> Lưu nháp
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
                {/* <i className="fas fa-ban red"></i> Hủy */}
                <i className="fas fa-undo"></i> Quay lại
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
