using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Linq;
using Api;
using QTHT.Api.Helpers;

namespace QTHT.Api.Models.database.Role
{
    public class RoleContext
    {

        public RoleDetail GetById(int id)
        {
            RoleDetail item = new RoleDetail();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Role_GetBy_Id", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = id;
                            item.Title = dr.IsDBNull("Title") == true ? "" : (string)dr["Title"];
                            item.Name = dr.IsDBNull("Name") == true ? "" : (string)dr["Name"];
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
        /// <summary>
        /// Lấy danh sách vao trò của người dùng
        /// </summary>
        /// <param name="userid"></param>
        /// <returns></returns>
        public List<UserRole> GetByUserId(int userid)
        {
            List<UserRole> items = new List<UserRole>();
            try
            {
                RoleDetail r = null;
                var user = new UserContext().GetById(userid);
                var roles = new RoleContext().GetAll();
                //string[] userroles = user.Roles.Split(',');
                foreach (var role in roles)
                {
                    try
                    {
                        r = user.Roles.Where(m => m.Id == role.Id).FirstOrDefault();

                    }
                    catch
                    {

                    }
                    UserRole item = new UserRole();
                    item.Id = role.Id;
                    item.Title = role.Title;
                    item.Name = role.Name;
                    item.Set = r != null ? true : false;
                    item.Icon = r != null ? "fas fa-check-alt blue" : "fas fa-ban red";
                    items.Add(item);
                }
            }
            catch (Exception ex)
            {
                //throw e;
            }

            return items;
        }
        public List<RoleDetail> GetAll()
        {
            List<RoleDetail> items = new List<RoleDetail>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Role_GetAll", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            RoleDetail item = new RoleDetail();
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (int)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Name = dr.IsDBNull("Name") == true ? null : (string)dr["Name"];
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

            return items;
        }
        public List<RoleList> GetAll(OptionFilter option)
        {
            List<RoleList> items = new List<RoleList>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Role_GetAll_Filter", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pagenumber", SqlDbType.Int).Value = option.PageNumber;
                        cmd.Parameters.Add("@pagesize", SqlDbType.Int).Value = option.PageSize;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            RoleList item = new RoleList();
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (int)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Name = dr.IsDBNull("Name") == true ? null : (string)dr["Name"];
                            item.RowNumber = dr.IsDBNull("RowNumber") == true ? 0 : (long)dr["RowNumber"];
                            item.TotalRecord = dr.IsDBNull("TotalRecord") == true ? 0 : (int)dr["TotalRecord"];
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
    }
}
