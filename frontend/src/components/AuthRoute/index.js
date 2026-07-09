import React, { useState } from "react";
import { Route } from "react-router-dom";
import { getPermission, getSystemRole } from "../../helper/authorize";
import { SwalAlertAllConfiguration } from "../Swal";

const ProtectedRoute = ({ redirect, element, path, isAuthenticated }) => {
  return <Route path={path} element={isAuthenticated ? element : redirect} />;
};

export default ProtectedRoute;

export const CheckRolePermission = ({
  func_name,
  auth_role,
  auth_permis,
  callback,
}) => {
  const [permission, setPermission] = useState(
    getSystemRole(func_name, auth_role) || getPermission(func_name, auth_permis)
  );
  const [mod_read, setMod_read] = useState(permission?.Read);
  const [mod_create, setMod_create] = useState(permission?.Create);
  const [mod_edit, setMod_edit] = useState(permission?.Edit);
  const [mod_delete, setMod_delete] = useState(permission?.Delete);
  const [option, setOption] = useState({});
  if (mod_read === true) {
    setOption({
      startDate: new Date(),
      pageSize: 15,
      pageNumber: 1,
      pageFirst: 1,
      keyWord: null,
      startDateString: null,
      endDate: new Date(),
      endDateString: null,
    });

    callback(option);
  } else {
    SwalAlertAllConfiguration({
      title: "Bạn không có quyền truy cập chức năng",
      timer: 2000,
      redirect: "/",
      icon: "warning",
    });
  }
};
