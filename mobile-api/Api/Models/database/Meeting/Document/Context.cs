using Api;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using QTHT.Api.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq.Dynamic.Core;
using System.Security.Policy;
using System.Linq;

namespace QTHT.Api.Models.database.Meeting.Document
{
    public class MeetingDocumentContext
    {
        private readonly IConfiguration _configuration;
        private readonly QTHT_HTT_Context _context;
        public List<Meeting_Document> GetByScheduleId(Guid scheduleid,QTHT_HTT_Context _context)
        {
            List<Meeting_Document> items = new List<Meeting_Document>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_GetBy_Schedule", con))
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
                            item.FileUrl = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.FileOriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.FileSystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.FileSize = dr.IsDBNull("FileSize") == true ? 0 : (int)dr["FileSize"];
                            item.FileType = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();                           
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

        public List<Meeting_Document> GetAllDeleted(Guid? scheduleid,QTHT_HTT_Context _context)
        {
            List<Meeting_Document> items = new List<Meeting_Document>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_GetAll_Deleted", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@scheduleId", SqlDbType.UniqueIdentifier).Value = scheduleid;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Document item = new Meeting_Document();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.FileUrl = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.FileOriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.FileSystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.FileSize = dr.IsDBNull("FileSize") == true ? 0 : (int)dr["FileSize"];
                            item.FileType = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
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



        public List<Meeting_Document> GetByFileUrl(string url)
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
                            item.FileUrl = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.FileOriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.FileSystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.FileSize = dr.IsDBNull("FileSize") == true ? 0 : (int)dr["FileSize"];
                            item.FileType = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
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

        public Meeting_Document GetById(Guid id)
        {
            Meeting_Document item = new Meeting_Document();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_GetById", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.FileUrl = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.FileOriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.FileSystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.FileSize = dr.IsDBNull("FileSize") == true ? 0 : (int)dr["FileSize"];
                            item.FileType = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
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
    }
}
