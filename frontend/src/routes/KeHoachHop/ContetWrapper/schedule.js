import React from "react";
import { DatePicker, Input } from "antd";
import MyEditor from "../../../helper/ckeditor";
const { RangePicker } = DatePicker;

export default function Schedule({
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
              <label>
                Số / ký hiệu
                <b className="text-danger">(*)</b>{" "}
              </label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <Input
                placeholder="Nhập tiêu đề"
                size="large"
                style={{ width: "100%" }}
                defaultValue={symbol}
                value={symbol}
                onChange={(e) => {
                  setSymbol(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label>
                Trích yếu
                <b className="text-danger">(*)</b>{" "}
              </label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <Input
                placeholder="Nhập trích yếu"
                size="large"
                style={{ width: "100%" }}
                defaultValue={abstract}
                value={abstract}
                onChange={(e) => {
                  setAbstract(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label>
                Ngày ban hành
                <b className="text-danger">(*)</b>{" "}
              </label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <DatePicker
                allowClear={[true, true]}
                size="large"
                style={{ width: "100%" }}
                placeholder={"Chọn ngày ban hành"}
                // showTime={{
                //   format: "HH:mm",
                //   hideDisabledOptions: true,
                // }}
                defaultValue={dateIssued}
                value={dateIssued}
                format="DD/MM/YYYY"
                dateFormat="DD/MM/YYYY"
                onChange={(date, dateString) => {
                  if (date) {
                    setDateIssued(date);
                  } else {
                    setDateIssued(null);
                  }
                }}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label>
                Cơ quan ban hành
                <b className="text-danger">(*)</b>{" "}
              </label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <Input
                placeholder="Nhập cơ quan ban hành"
                size="large"
                style={{ width: "100%" }}
                defaultValue={agencyIssued}
                value={agencyIssued}
                onChange={(e) => {
                  setAgencyIssued(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <label>
            Nội dung
            <b className="text-danger">(*)</b>{" "}
          </label>
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-12">
          <MyEditor
            handleChange={(data) => {
              setContent(data);
            }}
            data={content}
            // {...state}
          />
        </div>
      </div>
      <div className="row form-group">
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label>
                Người ký
                <b className="text-danger">(*)</b>{" "}
              </label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <Input
                placeholder="Nhập người ký"
                size="large"
                style={{ width: "100%" }}
                defaultValue={signer}
                value={signer}
                onChange={(e) => {
                  setSigner(e.target.value);
                }}
              />
            </div>
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
              <DatePicker
                allowClear={[true, true]}
                size="large"
                style={{ width: "100%" }}
                placeholder={"Chọn ngày hiệu lực"}
                // showTime={{
                //   format: "hh-mm-ss",
                //   hideDisabledOptions: true,
                // }}
                defaultValue={effectiveDate}
                value={effectiveDate}
                format="DD/MM/YYYY"
                dateFormat="DD/MM/YYYY"
                onChange={(date, dateString) => {
                  if (date) {
                    setEffectiveDate(date);
                  } else {
                    setEffectiveDate(null);
                  }
                }}
              />
            </div>
          </div>
        </div>
        {/* <div className="col-md-6">
          <div className="row">
            <div className="col-md-12">
              <label>
                Thuộc đơn vị
                <b className="text-danger">(*)</b>{" "}
              </label>
            </div>
          </div>
          <div className="row form-group">
            <div className="col-md-12">
              <Input
                placeholder="Nhập tiêu đề"
                size="large"
                style={{ width: "100%" }}
                defaultValue={belongToUnit}
                value={belongToUnit}
                onChange={(e) => {
                  setBelongToUnit(e.target.value);
                }}
              />
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
}
