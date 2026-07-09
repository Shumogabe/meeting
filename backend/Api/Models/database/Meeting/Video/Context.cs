using Api;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace HTT.Api.Models
{
    public class MeetingVideoContext
    {
        public List<Meeting_Video> GetByScheduleId(Guid scheduleid, QTHT_HTT_Context _context)
        {
            List<Meeting_Video> items = new List<Meeting_Video>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Video_GetBy_ScheduleId", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = scheduleid;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Video item = new Meeting_Video();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Url = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.OriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.SystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.Size = dr.IsDBNull("FileSize") == true ? 0 : (int)dr["FileSize"];
                            item.Type = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.user = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
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

        public List<Meeting_Video> GetAllDateTime(DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Video> items = new List<Meeting_Video>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Video_DateTime", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom;
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Video item = new Meeting_Video();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Url = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.OriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.SystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.Size = dr.IsDBNull("FileSize") == true ? 0 : (int)dr["FileSize"];
                            item.Type = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
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

        public List<Meeting_Video> GetByFileUrl(string search, string url, QTHT_HTT_Context _context)
        {
            List<Meeting_Video> items = new List<Meeting_Video>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Video_GetBy_Url", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@url", SqlDbType.NVarChar).Value = url;
                        cmd.Parameters.Add("@search", SqlDbType.NVarChar).Value = search == null ? DBNull.Value : search;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Video item = new Meeting_Video();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Url = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.OriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.SystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.Size = dr.IsDBNull("FileSize") == true ? 0 : (int)dr["FileSize"];
                            item.Type = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.user = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
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
