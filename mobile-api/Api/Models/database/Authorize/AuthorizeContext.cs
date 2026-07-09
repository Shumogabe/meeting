using Api;
using Microsoft.Data.SqlClient;
using QTHT.Api.Models.database.Admin;
using QTHT.Api.Models.database.Role;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Claims;

namespace QTHT.Api.Models.database.Authorize
{
    public class AuthorizeContext
    {
        public int Insert(int roleid, int functionid)
        {
            var createdby = new UserContext().FindFirstValue(ClaimTypes.Name);
            var id = 0;
            try
            {
                if (roleid > 0 && functionid > 0)
                {
                    var role = new RoleContext().GetById(roleid);
                    var func = new ModuleContext().GetById(functionid);
                    using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                    {
                        using (SqlCommand cmd = new SqlCommand("Authorize_Insert", con))
                        {
                            cmd.CommandType = System.Data.CommandType.StoredProcedure;
                            cmd.Parameters.Add("@roleid", SqlDbType.Int).Value = roleid;
                            cmd.Parameters.Add("@functionid", SqlDbType.Int).Value = functionid;
                            cmd.Parameters.Add("@rolename", SqlDbType.NVarChar).Value = role.Name;
                            cmd.Parameters.Add("@functionname", SqlDbType.NVarChar).Value = func.Name;
                            cmd.Parameters.Add("@id", SqlDbType.Int).Direction = ParameterDirection.Output;
                            con.Open();
                            id = Convert.ToInt32(cmd.Parameters["@id"].Value.ToString());
                        }
                    }
                }
            }
            catch (Exception ex)
            {
            }
            return id;
        }

        public Authorize Get(int roleid, int functionid)
        {
            Authorize item = new Authorize();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Authorize_GetBy_Role", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@roleid", SqlDbType.Int).Value = roleid;
                        cmd.Parameters.Add("@functionid", SqlDbType.Int).Value = functionid;
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (int)dr["Id"];
                            item.FunctionId = dr.IsDBNull("FunctionId") == true ? 0 : (int)dr["FunctionId"];
                            item.RoleId = dr.IsDBNull("RoleId") == true ? 0 : (int)dr["RoleId"];
                            item.Read = dr.IsDBNull("ActRead") == true ? false : (bool)dr["ActRead"];
                            item.Edit = dr.IsDBNull("ActEdit") == true ? false : (bool)dr["ActEdit"];
                            item.Delete = dr.IsDBNull("ActDelete") == true ? false : (bool)dr["ActDelete"];
                            item.Create = dr.IsDBNull("ActCreate") == true ? false : (bool)dr["ActCreate"];
                            item.Approve = dr.IsDBNull("ActApprove") == true ? false : (bool)dr["ActApprove"];
                            item.Publish = dr.IsDBNull("ActPublish") == true ? false : (bool)dr["ActPublish"];
                            item.SetPermission = dr.IsDBNull("ActAuthorize") == true ? false : (bool)dr["ActAuthorize"];
                            break;
                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                    }
                }
                if (item.Id > 0) return item;
                else return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// Set permission
        /// </summary>
        /// <param name="roleid"></param>
        /// <param name="functionid"></param>
        /// <param name="action">Create;Read;Edit;Delete;Approve;Publish;Authorize</param>
        /// <param name="value">0;1</param>
        /// <returns></returns>
        public int Set(int roleid, string rolename, int functionid, string functionname, string action, bool value, int modifiedby)
        {
            //var modifiedby = new UserContext().FindFirstValue(ClaimTypes.Name);
            var i = 0;
            var id = 0;
            try
            {
                if (roleid > 0 && functionid > 0 && !string.IsNullOrEmpty(action))
                {
                    using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                    {
                        using (SqlCommand cmd = new SqlCommand("Authorize_Set_" + action, con))
                        {
                            cmd.CommandType = System.Data.CommandType.StoredProcedure;
                            cmd.Parameters.Add("@roleid", SqlDbType.Int).Value = roleid;
                            cmd.Parameters.Add("@functionid", SqlDbType.Int).Value = functionid;
                            cmd.Parameters.Add("@rolename", SqlDbType.NVarChar).Value = rolename;
                            cmd.Parameters.Add("@functionname", SqlDbType.NVarChar).Value = functionname;
                            cmd.Parameters.Add("@value", SqlDbType.Bit).Value = value;
                            cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = modifiedby;
                            con.Open();
                            i = cmd.ExecuteNonQuery();
                        }
                    }
                }
            }
            catch (Exception e)
            {
                return 0;
            }
            return i;
        }

        /// <summary>
        /// Lấy bảng quyền của từng vài trò đối với từng chức năng
        /// </summary>
        /// <returns></returns>
        public List<RolePermission> GetRolePermission() // lấy ds authorize chi tiết
        {
            List<RolePermission> items = new List<RolePermission>();
            try
            {
                var roles = new RoleContext().GetAll();
                int i = 0;
                foreach (var role in roles)
                {
                    var tabcss = "nav-link";
                    var tabpanecss = "tab-pane fade";
                    if (i == 0)
                    {
                        tabcss = "nav-link active";
                        tabpanecss = "tab-pane fade show active";
                    }
                    var functions = new ModuleContext().GetAll();
                    List<Permission> FunctionPermission = new List<Permission>();
                    foreach (var module in functions)
                    {
                        Permission fp = new Permission();
                        fp.Function = module;
                        //Lấy authorized by role and function
                        var authorize = Get(role.Id, module.Id);
                        if (authorize != null)
                        {
                            fp.Create = authorize.Create;
                            fp.Read = authorize.Read;
                            fp.Edit = authorize.Edit;
                            fp.Delete = authorize.Delete;
                            fp.Approve = authorize.Approve;
                            fp.Publish = authorize.Publish;
                            fp.Authorize = authorize.SetPermission;
                            FunctionPermission.Add(fp);
                        }
                        else
                        {
                            //Thông báo ra lỗi không lấy được phân quyền
                        }
                    }
                    RolePermission item = new RolePermission();
                    item.Role = role;
                    item.Permission = FunctionPermission;
                    item.tabcss = tabcss;
                    item.tabid = "vert-tabs-" + role.Id;
                    item.tabidtab = "vert-tabs-" + role.Id + "-tab";
                    item.tabhref = "#vert-tabs-" + role.Id;
                    item.tabpanecss = tabpanecss;
                    items.Add(item);
                    i++;
                }
            }
            catch (Exception ex)
            {
                //throw e;
            }

            return items;
        }

        public List<Authorize> GetAll() // lấy ds authorize chi tiết
        {
            List<Authorize> items = new List<Authorize>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Authorize_GetAll", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Authorize item = new Authorize();
                            item.FunctionId = dr.IsDBNull("FunctionId") == true ? 0 : (int)dr["FunctionId"];
                            item.RoleId = dr.IsDBNull("RoleId") == true ? 0 : (int)dr["RoleId"];
                            item.Read = dr.IsDBNull("ActRead") == true ? false : (bool)dr["ActRead"];
                            item.Edit = dr.IsDBNull("ActEdit") == true ? false : (bool)dr["ActEdit"];
                            item.Delete = dr.IsDBNull("ActDelete") == true ? false : (bool)dr["ActDelete"];
                            item.Create = dr.IsDBNull("ActCreate") == true ? false : (bool)dr["ActCreate"];
                            item.Approve = dr.IsDBNull("ActApprove") == true ? false : (bool)dr["ActApprove"];
                            item.Publish = dr.IsDBNull("ActPublish") == true ? false : (bool)dr["ActPublish"];
                            item.SetPermission = dr.IsDBNull("ActAuthorize") == true ? false : (bool)dr["ActAuthorize"];
                            items.Add(item);
                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                //throw e;
            }

            return items;
        }

        public List<Authorize> GetByRole(int roleid) // lấy ds authorize chi tiết
        {
            List<Authorize> items = new List<Authorize>();
            using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("Authorize_GetBy_Role", con))
                {
                    {
                        try
                        {
                            con.Open();
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.Add("@roleid", SqlDbType.Int).Value = roleid;
                            SqlDataReader dr = cmd.ExecuteReader();

                            while (dr.Read())
                            {
                                Authorize item = new Authorize();
                                item.FunctionId = dr.IsDBNull("FunctionID") == true ? 0 : (int)dr["FunctionId"];
                                item.RoleId = dr.IsDBNull("RoleID") == true ? 0 : (int)dr["RoleId"];
                                item.Read = dr.IsDBNull("Read") == true ? false : (bool)dr["Read"];
                                item.Edit = dr.IsDBNull("Edit") == true ? false : (bool)dr["Edit"];
                                item.Delete = dr.IsDBNull("Delete") == true ? false : (bool)dr["Delete"];
                                item.Create = dr.IsDBNull("Create") == true ? false : (bool)dr["Create"];
                                item.Approve = dr.IsDBNull("Accept") == true ? false : (bool)dr["Accept"];
                                item.Publish = dr.IsDBNull("Publish") == true ? false : (bool)dr["Publish"];
                                item.SetPermission = dr.IsDBNull("Authorize") == true ? false : (bool)dr["Authorize"];
                                items.Add(item);
                            }
                            cmd.Dispose();
                            dr.Close();
                        }
                        catch
                        {
                            //throw e;
                        }

                        con.Close();
                    }
                }
            }
            return items;
        }

        /// <summary>
        /// Lấy danh sách phân quyền theo role ids
        /// </summary>
        /// <param name="roles"></param>
        /// <returns></returns>
        public List<Authorize> GetByListRole(List<RoleDetail> roles) // lấy ds authorize chi tiết
        {
            List<Authorize> items = new List<Authorize>();
            if (roles.Count > 0)
            {
                try
                {
                    using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                    {
                        using (SqlCommand cmd = new SqlCommand("Authorize_GetBy_Role_Ids", con))
                        {
                            con.Open();
                            cmd.CommandType = CommandType.StoredProcedure;
                            var table = new DataTable();
                            table.Columns.Add("ID", typeof(int));
                            foreach (var item in roles)
                                table.Rows.Add(item.Id);
                            var pList = new SqlParameter("@listID", SqlDbType.Structured);
                            pList.TypeName = "dbo.ListID";
                            pList.Value = table;
                            cmd.Parameters.Add(pList);
                            SqlDataReader dr = cmd.ExecuteReader();

                            while (dr.Read())
                            {
                                Authorize item = new Authorize();
                                item.FunctionId = dr.IsDBNull("FunctionId") == true ? 0 : (int)dr["FunctionId"];
                                item.RoleId = dr.IsDBNull("RoleId") == true ? 0 : (int)dr["RoleId"];
                                item.Read = dr.IsDBNull("ActRead") == true ? false : (bool)dr["ActRead"];
                                item.Edit = dr.IsDBNull("ActEdit") == true ? false : (bool)dr["ActEdit"];
                                item.Delete = dr.IsDBNull("ActDelete") == true ? false : (bool)dr["ActDelete"];
                                item.Create = dr.IsDBNull("ActCreate") == true ? false : (bool)dr["ActCreate"];
                                item.Approve = dr.IsDBNull("ActApprove") == true ? false : (bool)dr["ActApprove"];
                                item.Publish = dr.IsDBNull("ActPublish") == true ? false : (bool)dr["ActPublish"];
                                item.SetPermission = dr.IsDBNull("ActAuthorize") == true ? false : (bool)dr["ActAuthorize"];
                                items.Add(item);
                            }
                            cmd.Dispose();
                            dr.Close();
                            con.Close();
                        }
                    }
                }
                catch
                {
                    //throw e;
                }
            }

            return items;
        }

        public List<Authorize> MatchToAuthorize(string views, string edits, string creates, string deletes, string accepts, string publishs)
        {
            List<Authorize> items = new List<Authorize>();
            if (!string.IsNullOrEmpty(views))
            {
                List<string> ListView = views.Split(",").ToList();
                foreach (var roleview in ListView)
                {
                    var roleviewsplit = roleview.Split("-");
                    var functionid = Convert.ToInt32(roleviewsplit[0]);
                    int roleid = Convert.ToInt32(roleviewsplit[1]);
                    if (items.Count > 0 && items.Any(x => x.RoleId == roleid && x.FunctionId == functionid)) //check xem có tồn tại chức năng và role đó trong list phân quyền chưa
                    {
                        items.Where(x => x.RoleId == roleid && x.FunctionId == functionid).FirstOrDefault().Read = true; // gán giá trị true cho quyền view của roleid và chức năng id
                    }
                    else { items.Add(new Authorize() { FunctionId = functionid, RoleId = roleid, Read = true }); };
                }
            }
            if (!string.IsNullOrEmpty(edits))
            {
                List<string> ListEdit = edits.Split(",").ToList();
                foreach (var roleview in ListEdit)
                {
                    var roleviewsplit = roleview.Split("-");
                    var functionid = Convert.ToInt32(roleviewsplit[0]);
                    int roleid = Convert.ToInt32(roleviewsplit[1]);
                    if (items.Count > 0 && items.Any(x => x.RoleId == roleid && x.FunctionId == functionid))
                    {
                        items.Where(x => x.RoleId == roleid && x.FunctionId == functionid).FirstOrDefault().Edit = true;
                    }
                    else { items.Add(new Authorize() { FunctionId = functionid, RoleId = roleid, Edit = true }); };
                }
            }
            if (!string.IsNullOrEmpty(creates))
            {
                List<string> ListCreate = creates.Split(",").ToList();
                foreach (var roleview in ListCreate)
                {
                    var roleviewsplit = roleview.Split("-");
                    var functionid = Convert.ToInt32(roleviewsplit[0]);
                    int roleid = Convert.ToInt32(roleviewsplit[1]);
                    if (items.Count > 0 && items.Any(x => x.RoleId == roleid && x.FunctionId == functionid))
                    {
                        items.Where(x => x.RoleId == roleid && x.FunctionId == functionid).FirstOrDefault().Create = true;
                    }
                    else { items.Add(new Authorize() { FunctionId = functionid, RoleId = roleid, Create = true }); };
                }
            }
            if (!string.IsNullOrEmpty(deletes))
            {
                List<string> ListDelete = deletes.Split(",").ToList();

                foreach (var roleview in ListDelete)
                {
                    var roleviewsplit = roleview.Split("-");
                    var functionid = Convert.ToInt32(roleviewsplit[0]);
                    int roleid = Convert.ToInt32(roleviewsplit[1]);
                    if (items.Count > 0 && items.Any(x => x.RoleId == roleid && x.FunctionId == functionid))
                    {
                        items.Where(x => x.RoleId == roleid && x.FunctionId == functionid).FirstOrDefault().Delete = true;
                    }
                    else { items.Add(new Authorize() { FunctionId = functionid, RoleId = roleid, Delete = true }); };
                }
            }

            if (!string.IsNullOrEmpty(accepts))
            {
                List<string> ListAccept = accepts.Split(",").ToList();

                foreach (var roleview in ListAccept)
                {
                    var roleviewsplit = roleview.Split("-");
                    var functionid = Convert.ToInt32(roleviewsplit[0]);
                    int roleid = Convert.ToInt32(roleviewsplit[1]);
                    if (items.Count > 0 && items.Any(x => x.RoleId == roleid && x.FunctionId == functionid))
                    {
                        items.Where(x => x.RoleId == roleid && x.FunctionId == functionid).FirstOrDefault().Approve = true;
                    }
                    else { items.Add(new Authorize() { FunctionId = functionid, RoleId = roleid, Approve = true }); };
                }
            }
            if (!string.IsNullOrEmpty(publishs))
            {
                List<string> ListPublish = publishs.Split(",").ToList();

                foreach (var roleview in ListPublish)
                {
                    var roleviewsplit = roleview.Split("-");
                    var functionid = Convert.ToInt32(roleviewsplit[0]);
                    int roleid = Convert.ToInt32(roleviewsplit[1]);
                    if (items.Count > 0 && items.Any(x => x.RoleId == roleid && x.FunctionId == functionid))
                    {
                        items.Where(x => x.RoleId == roleid && x.FunctionId == functionid).FirstOrDefault().Publish = true;
                    }
                    else { items.Add(new Authorize() { FunctionId = functionid, RoleId = roleid, Publish = true }); };
                }
            }
            return items;
        }
    }
}