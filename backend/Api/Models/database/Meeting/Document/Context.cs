using Api;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace HTT.Api.Models
{
    public class MeetingDocumentContext
    {
        private readonly IConfiguration _configuration;
        private readonly QTHT_HTT_Context _context;
        public List<Meeting_Document> GetByScheduleId(Guid scheduleid, QTHT_HTT_Context _datacontext)
        {
            List<Meeting_Document> items = new List<Meeting_Document>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_GetBy_ScheduleId", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = scheduleid;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Document item = new Meeting_Document();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Url = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.OriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.SystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.Size = dr.IsDBNull("FileSize") == true ? 0 : (int)dr["FileSize"];
                            item.Type = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.user = _datacontext.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
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
        public List<Meeting_Document> GetByFileUrl(string url, QTHT_HTT_Context _datacontext)
        {
            List<Meeting_Document> items = new List<Meeting_Document>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_GetBy_FileUrl", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@url", SqlDbType.NVarChar).Value = url;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Document item = new Meeting_Document();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Url = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.OriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.SystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.Size = dr.IsDBNull("FileSize") == true ? 0 : (int)dr["FileSize"];
                            item.Type = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.user = _datacontext.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
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
        public Meeting_Document GetFileUrl(string url, string originalname, QTHT_HTT_Context _datacontext)
        {
            Meeting_Document item = new Meeting_Document();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_Get_FileUrl", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@url", SqlDbType.NVarChar).Value = url;
                        cmd.Parameters.Add("@originalname", SqlDbType.NVarChar).Value = originalname;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Url = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.OriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.SystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.Size = dr.IsDBNull("FileSize") == true ? 0 : (int)dr["FileSize"];
                            item.Type = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.user = _datacontext.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            if (!string.IsNullOrEmpty(item.user?.ma_chucvu))
                            {
                                item.user.thong_tin_chuc_vu = _datacontext.thong_tin_chuc_vu.Find(item.user?.ma_chucvu);
                            }
                            if (!string.IsNullOrEmpty(item.user?.ma_tochuc))
                            {
                                item.user.thong_tin_don_vi = _datacontext.thong_tin_don_vi.Find(item.user?.ma_tochuc);
                            }
                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                    }
                }
            }
            catch(Exception ex)
            {
                //throw e;
            }

            return item;
        }
        public Meeting_Document GetTitle(string title, string url)
        {
            Meeting_Document item = new Meeting_Document();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_Get_Title", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = title;
                        cmd.Parameters.Add("@url", SqlDbType.NVarChar).Value = url;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Url = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.OriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.SystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.Size = dr.IsDBNull("FileSize") == true ? 0 : (int)dr["FileSize"];
                            item.Type = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = (bool)dr["IsDeleted"];                           
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
        public List<Meeting_Document> GetByDateTime(DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Document> items = new List<Meeting_Document>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_DateTime", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom;
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo;

                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Document item = new Meeting_Document();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Url = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.OriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.SystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.Size = dr.IsDBNull("FileSize") == true ? 0 : (int)dr["FileSize"];
                            item.Type = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
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
