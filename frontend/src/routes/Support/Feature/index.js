import React from "react";
import { Theme } from "../../../theme";

export default function Feature({ language }) {
  return (
    <>
      <div className="section feature-area mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-10">
              <div className="row">
                <div
                  className="col-md-12 section-heading"
                  data-aos="fade-up"
                  data-aos-duration="1500"
                >
                  {/* Tính năng */}
                  {language?.FEATURE?.SECTIONHEADING}
                </div>
              </div>
              <div className="row">
                <div
                  className="col-md-12 feature-slogan"
                  data-aos="fade-right"
                  data-aos-duration="1500"
                >
                  {/* Khám phá các tính năng hệ thống họp trực tuyến cung cấp */}
                  {language?.FEATURE?.FEATURESLOGAN}
                </div>
              </div>
            </div>
            <div
              className="col-md-2 align-right"
              data-aos="fade-right"
              data-aos-duration="1500"
            >
              <a className="btn btn-view-all-feature">
                {/* Xem tất cả */}
                {language?.FEATURE?.BTNVIEWALLFEATURE} &gt;
              </a>
            </div>
          </div>
          <div className="row form-group">
            <div
              className="col-md-3"
              data-aos="flip-down"
              data-aos-duration="1500"
            >
              <div className="feature-item">
                <p className="align-center">
                  <img
                    className="feature-image"
                    src={
                      "./static/" + Theme.theme().href + "/img/feature-htt.png"
                    }
                  />
                </p>
                <p className="feature-title align-center">Họp trực tuyến</p>
                <p className="feature-slogan">
                  Trao đổi trực tiếp từ mọi thiết bị Kết nối, cộng tác và cung
                  nhau hoàn thành công việc một cách hiệu quả với giải pháp cuộc
                  họp đáng tin cậy với CMeeting{" "}
                </p>
              </div>
            </div>
            <div
              className="col-md-3"
              data-aos="flip-down"
              data-aos-duration="2000"
            >
              <div className="feature-item">
                <p className="align-center">
                  <img
                    className="feature-image"
                    src={
                      "./static/" +
                      Theme.theme().href +
                      "/img/feature-document.png"
                    }
                  />
                </p>
                <p className="feature-title align-center">
                  Chia sẻ, trình chiếu
                </p>
                <p className="feature-slogan">
                  Giúp người dùng trực tiếp trình bày, chia sẻ ý tưởng và tài
                  liệu từ máy tính, tạo lên môi trường làm việc linh hoạt và
                  hiệu quả
                </p>
              </div>
            </div>
            <div
              className="col-md-3"
              data-aos="flip-down"
              data-aos-duration="2500"
            >
              <div className="feature-item">
                <p className="align-center">
                  <img
                    className="feature-image"
                    src={
                      "./static/" + Theme.theme().href + "/img/feature-vote.png"
                    }
                  />
                </p>
                <p className="feature-title align-center">Biểu quyết</p>
                <p className="feature-slogan">
                  Cho phép thành viên đưa ra ý kiến bình chọn trực tuyến, nhanh
                  chóng và đảm bảo tính minh bạch công khai
                </p>
              </div>
            </div>
            <div
              className="col-md-3"
              data-aos="flip-down"
              data-aos-duration="3000"
            >
              <div className="feature-item">
                <p className="align-center">
                  <img
                    className="feature-image"
                    src={
                      "./static/" +
                      Theme.theme().href +
                      "/img/feature-conclution.png"
                    }
                  />
                </p>
                <p className="feature-title align-center">Kết luận</p>
                <p className="feature-slogan">
                  Hỗ trợ người dùng ghi biên bản cuộc họp, tóm tắt nội dung quan
                  trọng để đưa ra kết luận cuộc họp
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <p className="align-center">
                <img
                  src={
                    "./static/" + Theme.theme().href + "/img/feature-delive.png"
                  }
                />
              </p>
            </div>
          </div>
          {/* <img
            className="feature-arrow-left"
            src={"./static/" + Theme.theme().href + "/img/feature-arrow-left.png"}
          />
          <img
            className="feature-arrow-right"
            src={"./static/" + Theme.theme().href + "/img/feature-arrow-right.png"}
          /> */}
        </div>
      </div>
    </>
  );
}
