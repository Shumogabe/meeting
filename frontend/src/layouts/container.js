import React from "react";

import { Route, Routes } from "react-router-dom";
//Portal
import { Portal_Pages } from "../components/portal/Pages";
import { Login } from "../layouts/portal/Login";
//Meeting
import { Meeting_Event } from "../components/meeting/event/Event";
import { Meeting_Join } from "../components/meeting/join/join";
import { Meeting_Room } from "../components/meeting/room/room";
import { Meeting_RoomRef } from "../components/meeting/room/roomref";
import { Meeting_Schedule } from "../components/meeting/schedule/Schedule";
//Admin
import { Authorize_Allitem } from "../components/admin/organizationalstructure/authorize/allitem";
import { Organ_Allitem } from "../components/admin/organizationalstructure/organ/allitem";
import { Organ_Create } from "../components/admin/organizationalstructure/organ/create";
import { Organ_Edit } from "../components/admin/organizationalstructure/organ/edit";
import { Position_Allitem } from "../components/admin/organizationalstructure/position/allitem";
import { Position_Create } from "../components/admin/organizationalstructure/position/create";
import { Position_Edit } from "../components/admin/organizationalstructure/position/edit";
import { Role_Allitem } from "../components/admin/organizationalstructure/role/allitem";
import { Role_Create } from "../components/admin/organizationalstructure/role/create";
import { Role_Edit } from "../components/admin/organizationalstructure/role/edit";
import { User_Allitem } from "../components/admin/organizationalstructure/user/allitem";
import { User_Create } from "../components/admin/organizationalstructure/user/create";
import { User_Edit } from "../components/admin/organizationalstructure/user/edit";
import { User_Read } from "../components/admin/organizationalstructure/user/read";
import { Config_Allitem } from "../components/admin/system/config/allitem";
import { Config_Create } from "../components/admin/system/config/create";
import { Config_Edit } from "../components/admin/system/config/edit";
import { Language_Allitem } from "../components/admin/system/language/allitem";
import { Language_Create } from "../components/admin/system/language/create";
import { Language_Edit } from "../components/admin/system/language/edit";
import { Layout_Allitem } from "../components/admin/system/layout/allitem";
import { Layout_Create } from "../components/admin/system/layout/create";
import { Layout_Edit } from "../components/admin/system/layout/edit";
import { Module_Allitem } from "../components/admin/system/module/allitem";
import { Module_Create } from "../components/admin/system/module/create";
import { Module_Edit } from "../components/admin/system/module/edit";
import { Server_Allitem } from "../components/admin/system/server/allitem";
import { Server_Create } from "../components/admin/system/server/create";
import { Server_Edit } from "../components/admin/system/server/edit";
import { Widget_Allitem } from "../components/admin/system/widget/allitem";
import { Widget_Create } from "../components/admin/system/widget/create";
import { Widget_Edit } from "../components/admin/system/widget/edit";
//Article
import { ArticleType_Allitem } from "../components/admin/catalog/articletype/allitem";
import { ArticleType_Create } from "../components/admin/catalog/articletype/create";
import { ArticleType_Edit } from "../components/admin/catalog/articletype/edit";
import { Channel_Allitem } from "../components/admin/catalog/channel/allitem";
import { Channel_Create } from "../components/admin/catalog/channel/create";
import { Channel_Edit } from "../components/admin/catalog/channel/edit";
import { Article_Allitem } from "../components/admin/cms/article/allitem";
import { Article_Create } from "../components/admin/cms/article/create";
import { Article_Draft } from "../components/admin/cms/article/draft";
import { Article_Edit } from "../components/admin/cms/article/edit";
import { SweetAlertWithRedirect } from "../controllers/sweetalert";

export class NoPage extends React.Component {
  render() {
    return SweetAlertWithRedirect(
      "Thông báo!",
      "Tên miền không hợp lệ",
      0,
      "/",
      "warning"
    );
  }
}

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.path = window.location.pathname;
  }
  state = {
    ismod: false,
  };
  // eslint-disable-next-line
  componentWillReceiveProps() {}
  componentDidMount = () => {
    document.getElementById("root").style.width = window.outerWidth;
  };
  render(props) {
    return (
      <>
        <Routes>
          <Route path="/" element={<Meeting_Join />} />
          <Route path="/trang-chu/" element={<Portal_Pages />} />
          {/* <Route path="/:lang/:module/" element={<Portal_Pages/>} /> */}
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/dang-nhap/:returnurl" element={<Login />} />
          {/***
           *
           *  MEETING
           *
           */}
          <Route path="/meeting/" element={<Meeting_Join />} />
          <Route path="/meeting/event" element={<Meeting_Event />} />
          <Route path="/meeting/schedule" element={<Meeting_Schedule />} />
          <Route path="/meeting/join" element={<Meeting_Join />} />
          <Route path="/meeting/join/:id" element={<Meeting_Join />} />
          {/* <Route path="/meeting/:type/:alias/room" element={<Meeting_Room/>} />
            <Route path="/meeting/:type/:alias/room/:id" element={<Meeting_Room/>} /> */}
          <Route path="/meeting/room/:id" element={<Meeting_Room />} />
          <Route path="/meeting/room-ref" element={<Meeting_RoomRef />} />
          <Route path="/meeting/*" element={<NoPage />} />
          {/***
           *
           *  ADMIN/DASHBOARD
           *
           */}
          <Route path="/admin/" element={<Organ_Allitem />} />
          <Route path="/admin/dashboard" element={<Organ_Allitem />} />
          {/***
           *
           *  ADMIN/ORGANIZATIONALSTRUCTURE
           *
           */}
          <Route
            path="/admin/organizationalstructure/organ"
            element={<Organ_Allitem />}
          />
          <Route
            path="/admin/organizationalstructure/organ/allitem"
            element={<Organ_Allitem />}
          />
          <Route
            path="/admin/organizationalstructure/organ/create"
            element={<Organ_Create />}
          />
          <Route
            path="/admin/organizationalstructure/organ/edit/:id"
            element={<Organ_Edit />}
          />
          <Route
            path="/admin/organizationalstructure/user"
            element={<User_Allitem />}
          />
          <Route
            path="/admin/organizationalstructure/user/allitem"
            element={<User_Allitem />}
          />
          <Route
            path="/admin/organizationalstructure/user/create"
            element={<User_Create />}
          />
          <Route
            path="/admin/organizationalstructure/user/read/:id"
            element={<User_Read />}
          />
          <Route
            path="/admin/organizationalstructure/user/edit/:id"
            element={<User_Edit />}
          />
          <Route
            path="/admin/organizationalstructure/position"
            element={<Position_Allitem />}
          />
          <Route
            path="/admin/organizationalstructure/position/allitem"
            element={<Position_Allitem />}
          />
          <Route
            path="/admin/organizationalstructure/position/create"
            element={<Position_Create />}
          />
          <Route
            path="/admin/organizationalstructure/position/edit/:id"
            element={<Position_Edit />}
          />
          <Route
            path="/admin/organizationalstructure/role"
            element={<Role_Allitem />}
          />
          <Route
            path="/admin/organizationalstructure/role/allitem"
            element={<Role_Allitem />}
          />
          <Route
            path="/admin/organizationalstructure/role/create"
            element={<Role_Create />}
          />
          <Route
            path="/admin/organizationalstructure/role/edit/:id"
            element={<Role_Edit />}
          />
          <Route
            path="/admin/organizationalstructure/authorize"
            element={<Authorize_Allitem />}
          />
          <Route
            path="/admin/organizationalstructure/authorize/allitem"
            element={<Authorize_Allitem />}
          />
          {/***
           *
           *  ADMIN/SYSTEM
           *
           */}
          <Route path="/admin/system/config" element={<Config_Allitem />} />
          <Route
            path="/admin/system/config/allitem"
            element={<Config_Allitem />}
          />
          <Route
            path="/admin/system/config/create"
            element={<Config_Create />}
          />
          <Route
            path="/admin/system/config/edit/:id"
            element={<Config_Edit />}
          />
          <Route path="/admin/system/language" element={<Language_Allitem />} />
          <Route
            path="/admin/system/language/allitem"
            element={<Language_Allitem />}
          />
          <Route
            path="/admin/system/language/create"
            element={<Language_Create />}
          />
          <Route
            path="/admin/system/language/edit/:id"
            element={<Language_Edit />}
          />
          <Route path="/admin/system/module" element={<Module_Allitem />} />
          <Route
            path="/admin/system/module/allitem"
            element={<Module_Allitem />}
          />
          <Route
            path="/admin/system/module/create"
            element={<Module_Create />}
          />
          <Route
            path="/admin/system/module/edit/:id"
            element={<Module_Edit />}
          />
          <Route path="/admin/system/layout" element={<Layout_Allitem />} />
          <Route
            path="/admin/system/layout/allitem"
            element={<Layout_Allitem />}
          />
          <Route
            path="/admin/system/layout/create"
            element={<Layout_Create />}
          />
          <Route
            path="/admin/system/layout/edit/:id"
            element={<Layout_Edit />}
          />
          <Route path="/admin/system/widget" element={<Widget_Allitem />} />
          <Route path="/admin/system/widget/:id" element={<Widget_Allitem />} />
          <Route
            path="/admin/system/widget/allitem"
            element={<Widget_Allitem />}
          />
          <Route
            path="/admin/system/widget/allitem/:id"
            element={<Widget_Allitem />}
          />
          <Route
            path="/admin/system/widget/create"
            element={<Widget_Create />}
          />
          <Route
            path="/admin/system/widget/edit/:id"
            element={<Widget_Edit />}
          />
          <Route path="/admin/system/server" element={<Server_Allitem />} />
          <Route
            path="/admin/system/server/allitem"
            element={<Server_Allitem />}
          />
          <Route
            path="/admin/system/server/create"
            element={<Server_Create />}
          />
          <Route
            path="/admin/system/server/edit/:id"
            element={<Server_Edit />}
          />
          {/***
           *
           *  ADMIN/CMS
           *
           */}
          <Route path="/admin/cms/article" element={<Article_Allitem />} />
          <Route
            path="/admin/cms/article/allitem"
            element={<Article_Allitem />}
          />
          <Route path="/admin/cms/article/draft" element={<Article_Draft />} />
          <Route
            path="/admin/cms/article/create"
            element={<Article_Create />}
          />
          <Route
            path="/admin/cms/article/edit/:id"
            element={<Article_Edit />}
          />
          {/***
           *
           *  ADMIN/CATALOG
           *
           */}
          <Route path="/admin/catalog/channel" element={<Channel_Allitem />} />
          <Route
            path="/admin/catalog/channel/allitem"
            element={<Channel_Allitem />}
          />
          <Route
            path="/admin/catalog/channel/create"
            element={<Channel_Create />}
          />
          <Route
            path="/admin/catalog/channel/edit/:id"
            element={<Channel_Edit />}
          />
          <Route
            path="/admin/catalog/articletype"
            element={<ArticleType_Allitem />}
          />
          <Route
            path="/admin/catalog/articletype/allitem"
            element={<ArticleType_Allitem />}
          />
          <Route
            path="/admin/catalog/articletype/create"
            element={<ArticleType_Create />}
          />
          <Route
            path="/admin/catalog/articletype/edit/:id"
            element={<ArticleType_Edit />}
          />
          {/***
           *
           *
           *
           */}
        </Routes>
      </>
    );
  }
}
export { Container };
