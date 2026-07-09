using Api;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using QTHT.Api.Models.Admin;
using System;
using System.Collections.Generic;
using System.Data;
using System.Numerics;

namespace QTHT.Api.Models.database.Log
{
    public class LogContext : ControllerBase
    {
        public IActionResult InsertLog(log model)
        {
            var id = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Insert_Log", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@tai_khoan_id", SqlDbType.BigInt).Value = model.tai_khoan_id == null ? DBNull.Value : model.tai_khoan_id;
                        cmd.Parameters.Add("@tai_khoan_name", SqlDbType.NVarChar).Value = model.tai_khoan_name == null ? DBNull.Value : model.tai_khoan_name;
                        cmd.Parameters.Add("@doi_tuong", SqlDbType.Int).Value = model.doi_tuong;
                        cmd.Parameters.Add("@chuc_nang", SqlDbType.NVarChar).Value = model.chuc_nang == default ? DBNull.Value : model.chuc_nang;
                        cmd.Parameters.Add("@thao_tac", SqlDbType.NVarChar).Value = model.thao_tac == default ? DBNull.Value : model.thao_tac;
                        cmd.Parameters.Add("@noi_dung", SqlDbType.NVarChar).Value = model.noi_dung;
                        cmd.Parameters.Add("@time_tao", SqlDbType.BigInt).Value = model.time_tao;
                        con.Open();
                        id = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(299, new { message = "Đã xảy ra lỗi", error = ex.Message });
            }
            return Ok(new { data = id, message = id > 0 ? "Thêm log thành công" : "Không thêm được log" });
        }
        
        public List<log> getAll(string search)
        {
            List<log> list = new List<log>();
            var id = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Log_GetAll", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@strSearch", SqlDbType.NVarChar).Value = search;
                        con.Open();
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            log item = new log();
                            item.id = dr.IsDBNull("id") == true ? default : (long)dr["Id"];
                            item.tai_khoan_id = dr.IsDBNull("tai_khoan_id") == true ? default : (long)dr["tai_khoan_id"];
                            item.tai_khoan_name = dr.IsDBNull("tai_khoan_name") == true ? default : (string)dr["tai_khoan_name"];
                            item.doi_tuong = dr.IsDBNull("doi_tuong") == true ? default : (int)dr["doi_tuong"];
                            item.chuc_nang = dr.IsDBNull("chuc_nang") == true ? null : (string)dr["chuc_nang"];
                            item.thao_tac = dr.IsDBNull("thao_tac") == true ? null : (string)dr["thao_tac"];
                            item.noi_dung = dr.IsDBNull("noi_dung") == true ? null : (string)dr["noi_dung"];
                            item.time_tao = dr.IsDBNull("time_tao") == true ? default : (long)dr["time_tao"];
                            list.Add(item);
                        }

                    }
                }

            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while fetching logs.", ex);
            }
            
            return list;
        }
    }
}

