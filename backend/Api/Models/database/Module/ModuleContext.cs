using Api;
using HTT.Api.Helpers;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;

namespace HTT.Api.Models
{
    public class ModuleContext
    {
        
        public List<Module> GetAll(OptionFilter option)
        {
            List<Module> items = new List<Module>();
            using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("VI_Module_GetAll_Filter", con))
                {
                    try
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pagenumber", SqlDbType.Int).Value = option.PageNumber;
                        cmd.Parameters.Add("@pagesize", SqlDbType.Int).Value = option.PageSize;
                        cmd.Parameters.Add("@txtsearch", SqlDbType.NVarChar).Value = option.KeyWord == null ? DBNull.Value : option.KeyWord;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Module item = new Module();
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (int)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Name = dr.IsDBNull("ModuleName") == true ? null : (string)dr["ModuleName"];
                            item.RowNumber = dr.IsDBNull("RowNumber") == true ? 0 : (long)dr["RowNumber"];
                            item.TotalRecord = dr.IsDBNull("TotalRecord") == true ? 0 : (int)dr["TotalRecord"];
                            items.Add(item);

                        }
                        cmd.Dispose();
                        dr.Close();

                    }
                    catch (Exception ex)
                    {
                        //throw e;
                    }

                    con.Close();
                }
            }
            return items;
        }
        public List<Module> GetAll()
        {
            List<Module> items = new List<Module>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("VI_Module_GetAll", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Module item = new Module();
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (int)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Name = dr.IsDBNull("ModuleName") == true ? null : (string)dr["ModuleName"];
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
        public Module GetById(int id)
        {
            Module item = new Module();
            using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("VI_Module_GetBy_Id", con))
                {
                    try
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (int)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Name = dr.IsDBNull("ModuleName") == true ? null : (string)dr["ModuleName"];
                            break;
                        }
                        cmd.Dispose();
                        dr.Close();
                    }
                    catch (Exception ex)
                    {
                        //throw e;
                    }

                    con.Close();
                }
            }
            return item;
        }
    }


}
