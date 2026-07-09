import React from "react";
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;

export default function Plan({
  symbol,
  setSymbol,
  abstract,
  setAbstract,
  content,
  setContent,
  dateIssued,
  setDateIssued,
  agencyIssued,
  setAgencyIssued,
  signer,
  setSigner,
  effectiveDate,
  setEffectiveDate,
  belongToUnit,
  setBelongToUnit,
}) {
  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label>Số / ký hiệu</label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">{symbol}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label>Trích yếu</label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">{abstract}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label>Ngày ban hành</label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              {dateIssued && dateIssued.format("DD/MM/YYYY HH:mm:ss")}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label>Cơ quan ban hành</label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">{agencyIssued}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <label>Nội dung</label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-12">
          <div
            className="editor"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label>Người ký</label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">{signer}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label>Ngày hiệu lực</label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              {effectiveDate && effectiveDate.format("DD/MM/YYYY HH:mm:ss")}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label>Thuộc đơn vị</label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">{belongToUnit}</div>
          </div>
        </div>
      </div>
    </>
  );
}
