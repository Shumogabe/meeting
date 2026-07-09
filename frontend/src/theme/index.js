import { APP_TYPE } from "../config";
import { HREF } from "../constants/dictionaries";

const ciis = {
  href: "theme/ciis",
  lang: {
    vi: {
      SITE_NAME: "CMEETING",
      SITE_NAME_FOOTER: "CIIS",
      SITE_SLOGAN: "TRUNG TÂM CƠ SỞ HẠ TẦNG VÀ BẢO ĐẢM AN TOÀN THÔNG TIN",
      COPYRIGHT:
        "HỆ THỐNG PHÁT TRIỂN BỞI TRUNG TÂM CƠ SỞ HẠ TẦNG VÀ BẢO ĐẢM AN TOÀN THÔNG TIN",
      ADDRESS: "Số 28, Phạm Văn Đồng, P.Dịch Vọng Hậu, Q.Cầu Giấy, TP.Hà Nội",
      PHONE: "024-7108055",
      MAIL: "hatangso@mae.gov.vn",
    },
    en: {
      SITE_NAME: "CMEETING",
      SITE_NAME_FOOTER: "CIIS",
      SITE_SLOGAN: "CENTER FOR INFRASTRUCTURE AND INFORMATION SECURITY",
      COPYRIGHT:
        "SYSTEM DEVELOPED BY CENTER FOR INFRASTRUCTURE AND INFORMATION SECURITY ENSURE",
      ADDRESS:
        "No.28, Pham Van Dong, Dich Vong Hau Ward, Cau Giay District, Hanoi City",
      PHONE: "024-7108055",
      MAIL: "hatangso@mae.gov.vn",
    },
  },
  img: {
    src: "",
  },
  css: {
    background: {
      color: "#226ccc",
      button: "#226ccc",
    },
    color: {
      color: "#fff",
    },
  },
  link_about: "https://ciis.vn/",
  link_contact: "",
};

const monre = {
  href: "theme/monre",
  lang: {
    vi: {
      SITE_NAME:
        window.location.pathname.endsWith(HREF.TrangChu) &&
        window.innerWidth > 370
          ? "BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG"
          : "BỘ NN&MT",
      SITE_NAME_FOOTER: "MAE",
      SITE_SLOGAN: "BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG",
      COPYRIGHT: "Bản quyền nền tảng thuộc về Bộ Nông nghiệp và Môi trường",
      ADDRESS: "Số 10 Tôn Thất Thuyết - Hà Nội",
      PHONE: "(0243) 7956868",
      MAIL: "portal@mae.gov.vn",
    },
    en: {
      SITE_NAME: "MAE MEETING",
      SITE_NAME_FOOTER: "MAE",
      SITE_SLOGAN: "MINISTRY OF AGRICULTURE AND ENVIRONMENT",
      COPYRIGHT:
        "Platform copyright belongs to the Ministry of Agriculture and Environment",
      ADDRESS: "No. 10 Ton That Thuyet - Hanoi",
      PHONE: "(0243) 7956868",
      MAIL: "portal@mae.gov.vn",
    },
  },
  img: {
    src: "",
  },
  css: {
    background: {
      color: "#139364",
      button: "#952b15",
    },
    color: {
      color: "#fff",
    },
  },
  link_about: "https://monre.gov.vn/pages/chuc-nang---nhiem-vu.aspx",
  link_contact: "https://monre.gov.vn/portal/pages/lienhe.aspx",
};

const dinte = {
  href: "theme/dinte",
  lang: {
    vi: {
      SITE_NAME: "DINTE MEETING",
      SITE_NAME_FOOTER: "DINTE",
      SITE_SLOGAN:
        "CỤC CHUYỂN ĐỔI SỐ VÀ THÔNG TIN DỮ LIỆU TÀI NGUYÊN MÔI TRƯỜNG",
      COPYRIGHT:
        "HỆ THỐNG PHÁT TRIỂN BỞI TRUNG TÂM CƠ SỞ HẠ TẦNG VÀ BẢO ĐẢM AN TOÀN THÔNG TIN",
      ADDRESS: "Số 28, Phạm Văn Đồng, P.Dịch Vọng Hậu, Q.Cầu Giấy, TP.Hà Nội",
      PHONE: "024-7108055",
      MAIL: "hatangso@mae.gov.vn",
    },
    en: {
      SITE_NAME: "DINTE MEETING",
      SITE_NAME_FOOTER: "DINTE",
      SITE_SLOGAN:
        "DEPARTMENT OF DIGITAL CONVERSION AND ENVIRONMENTAL RESOURCE DATA INFORMATION",
      COPYRIGHT:
        "SYSTEM DEVELOPED BY CENTER FOR INFRASTRUCTURE AND INFORMATION SECURITY ENSURE",
      ADDRESS:
        "No.28, Pham Van Dong, Dich Vong Hau Ward, Cau Giay District, Hanoi City",
      PHONE: "024-7108055",
      MAIL: "hatangso@mae.gov.vn",
    },
  },
  img: {
    src: "",
  },
  css: {
    background: {
      color: "#139364",
      button: "#f6811e",
    },
    color: {
      color: "#fff",
    },
  },
  link_about: "https://monre.gov.vn/pages/chuc-nang---nhiem-vu.aspx",
  link_contact: "",
};

export const Theme = {
  theme: () => {
    // return monre;
    switch (APP_TYPE) {
      case "ciis":
        return ciis;
      case "monre":
        return monre;
      case "dinte":
        return dinte;
      default:
        return monre;
    }
  },
};
export const style = {
  width: "auto",
  minHeight: "100px",
  background: "#ffffff",
  margin: "30px 10px 0px 10px",
  borderRadius: "5px",
  fontSize: "16px",
};
