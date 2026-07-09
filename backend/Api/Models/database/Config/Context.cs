using Api;
using HTT.Api.Helpers;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;

namespace HTT.Api.Models
{
    public class ConfigContext
    {
        public Config GetById(int id)
        {
            Config item = new Config();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Config_GetBy_Id", con))
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
                            item.Value = dr.IsDBNull("Value") == true ? "" : (string)dr["Value"];
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
        public List<Config> GetAll()
        {
            List<Config> items = new List<Config>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Config_GetAll", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            Config item = new Config();
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (int)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? "" : (string)dr["Title"];
                            item.Name = dr.IsDBNull("Name") == true ? "" : (string)dr["Name"];
                            item.Value = dr.IsDBNull("Value") == true ? "" : (string)dr["Value"];
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
        public List<Config> GetAll(OptionFilter option)
        {
            List<Config> items = new List<Config>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Config_GetAll_Filter", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pagenumber", SqlDbType.Int).Value = option.PageNumber;
                        cmd.Parameters.Add("@pagesize", SqlDbType.Int).Value = option.PageSize;
                        cmd.Parameters.Add("@txtsearch", SqlDbType.NVarChar).Value = option.KeyWord != null ? option.KeyWord : "";
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Config item = new Config();
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (int)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? "" : (string)dr["Title"];
                            item.Name = dr.IsDBNull("Name") == true ? "" : (string)dr["Name"];
                            item.Value = dr.IsDBNull("Value") == true ? "" : (string)dr["Value"];
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
