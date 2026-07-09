using Api;
using Microsoft.Data.SqlClient;
using QTHT.Api.Helpers;
using QTHT.Api.Models.Admin;
using QTHT.Api.Models.database.Admin;
using QTHT.Api.Models.database.Authorize;
using QTHT.Api.Models.database.Models;
using QTHT.Api.Models.database.Role;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace QTHT.Api.Models
{
    public class UserContext
    {
        public UserInfo GetById(int id)
        {
            UserInfo item = new UserInfo();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.QTHTConnection))
                {
                    using (SqlCommand cmd = new SqlCommand("Users_GetBy_Id", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        long _id = Convert.ToInt64(id);
                        cmd.Parameters.Add("@id", SqlDbType.BigInt).Value = _id;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = Convert.ToInt32((long)dr["id"]); // Cast to long instead of int

                            item.UserName = dr.IsDBNull("ad_user_name") == true ? "" : (string)dr["ad_user_name"];
                            item.FullName = dr.IsDBNull("ho_ten") == true ? "" : (string)dr["ho_ten"];
                            item.Organ = new Organ();
                            item.Organ.Id = dr.IsDBNull("don_vi_id") == true ? 0 : (long)dr["don_vi_id"];
                            item.Organ = new OrganContext().GetById(item.Organ.Id);
                            item.Position = new Position();
                            item.Position.Id = dr.IsDBNull("chuc_vu_id") == true ? 0 : (long)dr["chuc_vu_id"];
                            item.Position = new Position().GetById(item.Position.Id);                         
                            item.PhoneNumber = dr.IsDBNull("mobile") == true ? "" : (string)dr["mobile"];
                            item.Email = dr.IsDBNull("email_cong_vu") == true ? "" : (string)dr["email_cong_vu"];

                            break;
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

            return item;
        }

        public User GetByUsername(string username,tai_khoan tai_Khoan)
        {
            User item = new User();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("User_GetBy_UserName", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@username", SqlDbType.NVarChar).Value = username;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = tai_Khoan.id;
                            item.UserName = tai_Khoan.ad_user_name;
                            item.FullName = tai_Khoan.ho_ten;                          
                            item.PositionId = tai_Khoan.chuc_vu_id;
                            item.Roles = dr.IsDBNull("Roles") == true ? "" : (string)dr["Roles"];
                            item.OrganId = tai_Khoan.don_vi_id;
                            item.PhoneNumber = tai_Khoan.mobile;
                            item.Email = !string.IsNullOrEmpty(tai_Khoan.email) ? tai_Khoan.email : tai_Khoan.email_cong_vu;
                            item.SupperAdmin = dr.IsDBNull("SupperAdmin") == true ? false : (bool)dr["SupperAdmin"];
                            item.Position = new Position().GetById(item.PositionId);
                            item.Organ = new OrganContext().GetById(item.OrganId);
                            break;
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

            return item;
        }

        //public GetSearch GetBySearch(string option)
        //{
        //    GetSearch item = new GetSearch();
        //    try
        //    {
        //        using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
        //        {
        //            using (SqlCommand cmd = new SqlCommand("Users_GetBy_Search", con))
        //            {
        //                con.Open();
        //                cmd.CommandType = CommandType.StoredProcedure;
        //                cmd.Parameters.Add("@search", SqlDbType.NVarChar).Value = option;
        //                SqlDataReader dr = cmd.ExecuteReader();

        //                while (dr.Read())
        //                {
        //                    item.Id = (int)dr["Id"];
        //                    item.FullName = dr.IsDBNull("FullName") == true ? "" : (string)dr["FullName"];
        //                    item.Email = dr.IsDBNull("Email") == true ? "" : (string)dr["Email"];
        //                    item.PhoneNumber = dr.IsDBNull("PhoneNumber") == true ? "" : (string)dr["PhoneNumber"];
        //                    item.PositionId = dr.IsDBNull("PositionId") == true ? 0 : (int)dr["PositionId"];
        //                    item.OrganId = dr.IsDBNull("OrganId") == true ? default : (int)dr["OrganId"];
        //                    item.Position = new Position().GetById(item.PositionId);
        //                    item.Organ = new Organ().GetById(item.OrganId);
        //                    break;
        //                }
        //                cmd.Dispose();
        //                dr.Close();
        //                con.Close();
        //            }
        //        }
        //    }
        //    catch
        //    {
        //        //throw e;
        //    }

        //    return item;
        //}
        public List<GetFullName> GetByFullName(OptionGetFullName option)
        {
            List<GetFullName> items = new List<GetFullName>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.QTHTConnection))
                {
                    using (SqlCommand cmd = new SqlCommand("Users_GetBy_FullName", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@fullname", SqlDbType.NVarChar).Value = option.KeyWord == null ? DBNull.Value : option.KeyWord;
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            GetFullName item = new GetFullName();
                            item.Id = Convert.ToInt32((long)dr["id"]);
                            item.FullName = dr.IsDBNull("ho_ten") == true ? "" : (string)dr["ho_ten"];
                            item.PositionId = Convert.ToInt32(dr.IsDBNull("chuc_vu_id") == true ? 0 : (long)dr["chuc_vu_id"]);
                            item.Position = new Position().GetById(item.PositionId);
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

        public List<GetSearch> GetBySearch(OptionGetFullName option)
        {
            List<GetSearch> items = new List<GetSearch>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.QTHTConnection))
                {
                    using (SqlCommand cmd = new SqlCommand("Users_GetBy_Search", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@search", SqlDbType.NVarChar).Value = option.KeyWord == null ? DBNull.Value : option.KeyWord;
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            GetSearch item = new GetSearch();
                            item.Id = Convert.ToInt32((long)dr["id"]);
                            item.UserName = dr.IsDBNull("ad_user_name") == true ? "" : (string)dr["ad_user_name"];
                            item.FullName = dr.IsDBNull("ho_ten") == true ? "" : (string)dr["ho_ten"];
                            item.Organ = new Organ();
                            item.Organ.Id = dr.IsDBNull("don_vi_id") == true ? 0 : (long)dr["don_vi_id"];
                            item.Organ = new OrganContext().GetById(item.Organ.Id);
                            item.Position = new Position();
                            item.Position.Id = dr.IsDBNull("chuc_vu_id") == true ? 0 : (long)dr["chuc_vu_id"];
                            item.Position = new Position().GetById(item.Position.Id);
                            item.PhoneNumber = dr.IsDBNull("mobile") == true ? "" : (string)dr["mobile"];
                            item.Email = dr.IsDBNull("email_cong_vu") == true ? "" : (string)dr["email_cong_vu"];
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

        public UserInfo ValidateLdapUser(Login user)
        {
            UserInfo item = new UserInfo();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.QTHTConnection))
                {
                    using (SqlCommand cmd = new SqlCommand("User_GetBy_UserName", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@username", SqlDbType.VarChar).Value = user.username;
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            var role = dr.IsDBNull("Roles") == true ? null : (string)dr["Roles"];
                            var str = role.Split(",");
                            var organ = dr.IsDBNull("OrganId") == true ? 0 : (int)dr["OrganId"];
                            var position = dr.IsDBNull("Position") == true ? 0 : (int)dr["Position"];
                            List<RoleDetail> roles = new List<RoleDetail>();
                            List<Permission> permissions = new List<Permission>();
                            var modules = new ModuleContext().GetAll();
                            if (str.Count() > 0)
                            {
                                foreach (var r in str)
                                {
                                    if (!string.IsNullOrEmpty(r))
                                    {
                                        int r1 = Convert.ToInt32(r);
                                        roles.Add(new RoleContext().GetById(r1));
                                        foreach (var module in modules)
                                        {
                                            Permission permission = new Permission();
                                            var authorize = new AuthorizeContext().Get(r1, module.Id);
                                            if (authorize != null && authorize.Id > 0)
                                            {
                                                permission.Module = module.Name;
                                                permission.Function = module;
                                                permission.Role = new RoleContext().GetById(r1);
                                                permission.Create = authorize.Create;
                                                permission.Read = authorize.Read;
                                                permission.Edit = authorize.Edit;
                                                permission.Delete = authorize.Delete;
                                                permission.Approve = authorize.Approve;
                                                permission.Publish = authorize.Publish;
                                                permission.Authorize = authorize.SetPermission;
                                                permissions.Add(permission);
                                            }
                                        }
                                    }
                                }
                            }

                            item.Id = (int)dr["Id"];
                            item.UserName = dr.IsDBNull("Username") == true ? "" : (string)dr["Username"];
                            item.Email = dr.IsDBNull("Email") == true ? null : (string)dr["Email"];
                            item.Organ = new OrganContext().GetById(organ);
                            item.Position = new Position().GetById(position);
                            item.Roles = roles;

                            item.Permission = permissions;

                            break;
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

            return item;
        }

        public List<User> GetAll(OptionFilter option)
        {
            List<User> items = new List<User>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.QTHTConnection))
                {
                    using (SqlCommand cmd = new SqlCommand("Users_GetAll_Filter", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pagenumber", SqlDbType.Int).Value = option.PageNumber;
                        cmd.Parameters.Add("@pagesize", SqlDbType.Int).Value = option.PageSize;
                        cmd.Parameters.Add("@txtsearch", SqlDbType.NVarChar).Value = option.KeyWord == null ? DBNull.Value : option.KeyWord;
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            User item = new User();
                            item.Id = Convert.ToInt32((long)dr["id"]);
                            item.UserName = dr.IsDBNull("ad_user_name") == true ? "" : (string)dr["ad_user_name"];
                            item.FullName = dr.IsDBNull("ho_ten") == true ? "" : (string)dr["ho_ten"];
                            item.Organ = new Organ();
                            item.Organ.Id = dr.IsDBNull("don_vi_id") == true ? 0 : (long)dr["don_vi_id"];
                            item.Organ = new OrganContext().GetById(item.Organ.Id);
                            item.Position = new Position();
                            item.Position.Id = dr.IsDBNull("chuc_vu_id") == true ? 0 : (long)dr["chuc_vu_id"];
                            item.Position = new Position().GetById(item.Position.Id);
                            item.IsActivated = Convert.ToBoolean(dr.IsDBNull("trang_thai_kich_hoat") == true ? false : (int)dr["trang_thai_kich_hoat"]);
                            item.PhoneNumber = dr.IsDBNull("mobile") == true ? "" : (string)dr["mobile"];
                            item.Email = dr.IsDBNull("email_cong_vu") == true ? "" : (string)dr["email_cong_vu"];
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

        public List<User> GetAll()
        {
            List<User> items = new List<User>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.QTHTConnection))
                {
                    using (SqlCommand cmd = new SqlCommand("Users_GetAll", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            User item = new User();
                            item.Id = Convert.ToInt32((long)dr["id"]);
                            item.UserName = dr.IsDBNull("ad_user_name") == true ? "" : (string)dr["ad_user_name"];
                            item.FullName = dr.IsDBNull("ho_ten") == true ? "" : (string)dr["ho_ten"];
                            item.Organ = new Organ();
                            item.Organ.Id = dr.IsDBNull("don_vi_id") == true ? 0 : (long)dr["don_vi_id"];
                            item.Organ = new OrganContext().GetById(item.Organ.Id);
                            item.Position = new Position();
                            item.Position.Id = dr.IsDBNull("chuc_vu_id") == true ? 0 : (long)dr["chuc_vu_id"];
                            item.Position = new Position().GetById(item.Position.Id);
                            item.IsActivated = Convert.ToBoolean(dr.IsDBNull("trang_thai_kich_hoat") == true ? false : (int)dr["trang_thai_kich_hoat"]);
                            item.PhoneNumber = dr.IsDBNull("mobile") == true ? "" : (string)dr["mobile"];
                            item.Email = dr.IsDBNull("email_cong_vu") == true ? "" : (string)dr["email"];
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

        /// <summary>
        /// Lấy danh sách theo tìm kiếm từ khóa
        /// </summary>
        /// <returns></returns>
        public List<User> Filter(string value)
        {
            List<User> items = new List<User>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.QTHTConnection))
                {
                    using (SqlCommand cmd = new SqlCommand("Users_GetBy_Filter", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@keyword", SqlDbType.NVarChar).Value = value;
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            User item = new User();
                            item.Id = Convert.ToInt32((long)dr["id"]);
                            item.UserName = dr.IsDBNull("ad_user_name") == true ? "" : (string)dr["ad_user_name"];
                            item.FullName = dr.IsDBNull("ho_ten") == true ? "" : (string)dr["ho_ten"];
                            item.Organ = new Organ();
                            item.Organ.Id = dr.IsDBNull("don_vi_id") == true ? 0 : (long)dr["don_vi_id"];
                            item.Organ = new OrganContext().GetById(item.Organ.Id);
                            item.Position = new Position();
                            item.Position.Id = dr.IsDBNull("chuc_vu_id") == true ? 0 : (long)dr["chuc_vu_id"];
                            item.Position = new Position().GetById(item.Position.Id);
                            item.IsActivated = Convert.ToBoolean(dr.IsDBNull("trang_thai_kich_hoat") == true ? false : (int)dr["trang_thai_kich_hoat"]);
                            item.PhoneNumber = dr.IsDBNull("mobile") == true ? "" : (string)dr["mobile"];
                            item.Email = dr.IsDBNull("email_cong_vu") == true ? "" : (string)dr["email_cong_vu"];
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

        public object FindFirstValue(object name)
        {
            throw new NotImplementedException();
        }
    }
}