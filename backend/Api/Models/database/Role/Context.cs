using Api;
using HTT.Api.Helpers;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace HTT.Api.Models
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
