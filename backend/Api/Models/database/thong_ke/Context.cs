using Api;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;

namespace HTT.Api.Models
{
    public class thong_ke_Context
    {
        public List<thong_ke> GetListThongKeByDateTime(DateTime dateFrom, DateTime dateTo)
        {
            List<thong_ke> items = new List<thong_ke>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("thong_ke_GetByDateTime", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            thong_ke item = new thong_ke();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Name = dr.IsDBNull("Name") == true ? null : (string)dr["Name"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.TypeId = dr.IsDBNull("TypeId") == true ? 0 : (int)dr["TypeId"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
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

        public List<thong_ke> GetListThongKeByName(  )
        {
            List<thong_ke> items = new List<thong_ke>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("thong_ke_ThongKeSoNguoiThamGia", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                       
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            thong_ke item = new thong_ke();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Name = dr.IsDBNull("Name") == true ? null : (string)dr["Name"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.TypeId = dr.IsDBNull("TypeId") == true ? 0 : (int)dr["TypeId"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
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
