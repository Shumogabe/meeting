import React, { useEffect } from "react";
import { Breadcrumb } from "antd";
import userManager from "../../services/auth";

const breadcrumbStyle = {
  float: "right",
  fontSize: "16px",
  paddingRight: "10px",
  fontWeight: "bolder",
};
const nameLayoutStyle = {
  float: "left",
  fontSize: "20px",
  paddingLeft: "10px",
  fontWeight: "bolder",
  textTransform: "uppercase",
};
export default function Index(props) {
  const arr_layers_href = String(props.href).split(",");
  const arr_layers_title = String(props.title).split("/");
  const items = [
    {
      href: "/",
      title: <i className="fas fa-home"></i>,
    },
  ];
  for (let i = 0; i < arr_layers_title.length; i++) {
    if (i === arr_layers_title.length - 1) {
      items.push({ title: arr_layers_title[i] });
    } else {
      items.push({ href: arr_layers_href[i], title: arr_layers_title[i] });
    }
  }
  useEffect(() => {
    userManager.getUser().then((res) => {
      if (
        Number(res?.expires_at) -
          Number(Math.round(new Date().getTime() / 1000)) -
          1000 <
        0
      ) {
        // userManager.signoutRedirect({
        //   post_logout_redirect_uri: APP_ADMIN_URI,
        // });
        window.location.href = "/";
      }
      // fetch(
      //   "https://qltkapi.monre.gov.vn/api/admin/LichSu/get?user_name=" +
      //     res?.profile?.sub +
      //     "&session=" +
      //     res?.profile?.sid,
      //   {
      //     method: "GET",
      //     headers: {
      //       accept: "*/*",
      //       "Content-Type": "application/json-patch+json",
      //     },
      //   }
      // )
      //   .then(function (response) {
      //     if (response) {
      //       return response.text();
      //     }
      //   })
      //   .then(function (data) {
      //     if (data) {
      //       userManager.removeUser().then(() => {
      //         window.location.href =("/");
      //       });
      //     }
      //   });
    });
  }, [props.title]);

  return (
    <>
      <div style={{ padding: 7.5 }}>
        <span style={nameLayoutStyle}>
          {arr_layers_title[arr_layers_title.length - 1]}
        </span>
        <Breadcrumb items={items} style={breadcrumbStyle} />
      </div>
    </>
  );
}
