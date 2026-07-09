using Api;
using HTT.Api.Helpers;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;

namespace HTT.Api.Models
{
    public class MeetingTypeContext
    {
        public List<Meeting_Type> GetAll()
        {
            List<Meeting_Type> items = new List<Meeting_Type>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Type_GetAll", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;                        
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Type item = new Meeting_Type();
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (int)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
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
        public List<Meeting_Type> GetAll(OptionFilter option)
        {
            List<Meeting_Type> items = new List<Meeting_Type>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Type_GetAll", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pagenumber", SqlDbType.Int).Value = option.PageNumber;
                        cmd.Parameters.Add("@pagesize", SqlDbType.Int).Value = option.PageSize;
                        cmd.Parameters.Add("@txtsearch", SqlDbType.NVarChar).Value = option.KeyWord != null ? option.KeyWord : "";
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Type item = new Meeting_Type();
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (int)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
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
        public Meeting_Type GetById(int id)
        {
            Meeting_Type item = new Meeting_Type();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Type_GetBy_Id", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = id;
                            item.Title = dr.IsDBNull("Title") == true ? "" : (string)dr["Title"];                            
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("Id") == true ? 0 : (int)dr["CreatedBy"];
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
    }
}
