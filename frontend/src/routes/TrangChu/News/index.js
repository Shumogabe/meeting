import React from "react";

export default function News({ language }) {
  return (
    <>
      {" "}
      <div className="section news-area">
        <div className="container">
          <div className="row form-group">
            <div className="col-md-10">
              <div
                className="row"
                data-aos="fade-down-right"
                data-aos-duration="1500"
              >
                <div className="col-md-12 section-heading">
                  {/* Tin tức - Sự kiện */}
                  {language?.NEWS?.SECTIONHEADING}
                </div>
              </div>
              <div
                className="row"
                data-aos="fade-down-left"
                data-aos-duration="1500"
              >
                <div className="col-md-12 feature-slogan">
                  {/* Thông tin mới nhất về hoạt đông, khoa học công nghệ */}
                  {language?.NEWS?.FEATURESLOGAN}
                </div>
              </div>
            </div>
            <div
              className="col-md-2 align-right"
              data-aos="fade-down-left"
              data-aos-duration="1500"
            >
              <a className="btn btn-view-all-feature">
                {/* Xem tất cả */}
                {language?.NEWS?.BTNVIEWALLFEATURE} &gt;
              </a>
            </div>
          </div>
          <div className="row">
            <div
              className="col-md-5"
              data-aos="zoom-in-right"
              data-aos-duration="1500"
            >
              <div className="new-first-item">
                <div className="new-first-item-image">
                  <img src="./static/uploads/Th%e1%bb%a9%20tr%c6%b0%e1%bb%9fng%20TQKi%c3%aan%20CT%20LPH%c3%a0.jpg" />
                </div>
                <div className="new-first-item-title">
                  Thứ trưởng Trần Quý Kiên tiếp đoàn công tác của Ban Cơ yếu
                  Chính phủ tại trụ sở Bộ Nông nghiệp và Môi trường
                </div>
                <div className="new-first-item-intro">
                  Thứ trưởng Trần Quý Kiên tiếp đoàn công tác của Ban Cơ yếu
                  Chính phủ tại trụ sở Bộ Nông nghiệp và Môi trường
                  <br />
                  <a className="btn btn-view-detail">
                    {/* Chi tiết */}
                    {language?.NEWS?.BTNVIEWDETAIL} &gt;
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-7">
              <div
                className="row form-group"
                data-aos="zoom-in-left"
                data-aos-duration="1500"
              >
                <div className="col-md-12">
                  <div className="row new-other-item">
                    <div className="col-md-5">
                      <img
                        className="new-other-item-image"
                        src="./static/uploads/An%20ninh%20b%e1%ba%a3o%20m%e1%ba%adt%20x.jpg"
                      />
                    </div>
                    <div className="col-md-7">
                      <p className="new-other-item-title">
                        Tăng cường xử lý vi phạm về thương mại điện tử trên
                        không gian mạng
                      </p>
                      <p className="new-other-item-intro">
                        Lợi dụng nhu cầu mua sắm, tiêu dùng, sử dụng dịch vụ du
                        lịch của người dân. Thời gian qua tại Việt Nam đã phát
                        sinh hiện tượng lừa đảo hoặc bán các sản phẩm không đảm
                        bảo chất lượng trên không gian mạng...
                      </p>
                      <p>
                        <a className="btn btn-view-detail">
                          {/* Chi tiết */}
                          {language?.NEWS?.BTNVIEWDETAIL} &gt;
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="row form-group"
                data-aos="zoom-in-left"
                data-aos-duration="1500"
              >
                <div className="col-md-12">
                  <div className="row new-other-item">
                    <div className="col-md-5">
                      <img
                        className="new-other-item-image"
                        src="./static/uploads/84.png"
                      />
                    </div>
                    <div className="col-md-7">
                      <p className="new-other-item-title">
                        Microsoft cảnh báo phần mềm độc hại âm thầm trừ tiền
                        người dùng
                      </p>
                      <p className="new-other-item-intro">
                        Theo Microsoft, các phần mềm độc hại âm thầm trừ tiền
                        người dùng vẫn liên tục phát triển, tuy nhiên, vẫn có
                        một số cách để ngăn chặn
                      </p>
                      <p>
                        <a className="btn btn-view-detail">
                          {/* Chi tiết */}
                          {language?.NEWS?.BTNVIEWDETAIL} &gt;
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="row form-group"
                data-aos="zoom-in-left"
                data-aos-duration="1500"
              >
                <div className="col-md-12">
                  <div className="row new-other-item">
                    <div className="col-md-5">
                      <img
                        className="new-other-item-image"
                        src="./static/uploads/80.jpeg"
                      />
                    </div>
                    <div className="col-md-7">
                      <p className="new-other-item-title">
                        Chuyên gia khuyến cáo vì sao mật khẩu phải dài tối thiểu
                        8 ký tự
                      </p>
                      <p className="new-other-item-intro">
                        Theo báo cáo của công ty an ninh mạng Hive Systems
                        (Virginia, Mỹ), nếu bạn sử dụng các con số để làm mật
                        khẩu, tin tặc có thể dễ dàng ‘bẻ khóa’ trong chớp mắt
                      </p>
                      <p>
                        <a className="btn btn-view-detail">
                          {/* Chi tiết */}
                          {language?.NEWS?.BTNVIEWDETAIL} &gt;
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
