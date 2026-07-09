using Api;
using HTT.Api.Helpers;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;

namespace HTT.Api.Models
{
    public class MeetingServerContext
    {
        public List<Meeting_Server> GetAll()
        {
            List<Meeting_Server> items = new List<Meeting_Server>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Server_GetAll", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Server item = new Meeting_Server();
                            item.Id = dr.IsDBNull("Id") == true ? default : (int)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? "" : (string)dr["Title"];
                            item.IP = dr.IsDBNull("IP") == true ? "" : (string)dr["IP"];
                            item.Activated = (bool)dr["Activated"];
                            item.Default = (bool)dr["Default"];                            
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
        public List<Meeting_Server> GetAll(OptionFilter option)
        {
            List<Meeting_Server> items = new List<Meeting_Server>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Server_GetAll_Filter", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pagenumber", SqlDbType.Int).Value = option.PageNumber;
                        cmd.Parameters.Add("@pagesize", SqlDbType.Int).Value = option.PageSize;
                        cmd.Parameters.Add("@txtsearch", SqlDbType.NVarChar).Value = option.KeyWord != null ? option.KeyWord : "";
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Server item = new Meeting_Server();
                            item.Id = dr.IsDBNull("Id") == true ? default : (int)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.IP = dr.IsDBNull("IP") == true ? null : (string)dr["IP"];
                            item.Activated = (bool)dr["Activated"];
                            item.Default = (bool)dr["Default"];
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
        public Meeting_Server GetById(int id)
        {
            Meeting_Server item = new Meeting_Server();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Server_GetBy_Id", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = id;
                            item.Title = dr.IsDBNull("Title") == true ? "" : (string)dr["Title"];
                            item.IP = dr.IsDBNull("IP") == true ? "" : (string)dr["IP"];
                            item.Iss = dr.IsDBNull("Iss") == true ? "" : (string)dr["Iss"];
                            item.Aud = dr.IsDBNull("Aud") == true ? "" : (string)dr["Aud"];

                            item.Activated = (bool)dr["Activated"];
                            item.Default = (bool)dr["Default"];
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
        public Meeting_Server GetByDefault()
        {
            Meeting_Server item = new Meeting_Server();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Server_GetBy_Default", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = dr.IsDBNull("Id") == true ? default : (int)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? "" : (string)dr["Title"];
                            item.IP = dr.IsDBNull("IP") == true ? "" : (string)dr["IP"];
                            item.Activated = (bool)dr["Activated"];
                            item.Default = (bool)dr["Default"];
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

        public List<Meeting_Server> GetAllDateTime(DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Server> items = new List<Meeting_Server>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Server_DateTime", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Server item = new Meeting_Server();
                            item.Id = dr.IsDBNull("Id") == true ? default : (int)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.IP = dr.IsDBNull("IP") == true ? null : (string)dr["IP"];
                            item.Activated = (bool)dr["Activated"];
                            item.Default = (bool)dr["Default"];
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
            catch
            {
                //throw e;
            }

            return items;
        }
    }
}
