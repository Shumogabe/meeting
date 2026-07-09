using Api;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;

namespace HTT.Api.Models
{
    public class MeetingConslusionContext
    {
        public List<Meeting_Conslusion> GetByStatus()
        {
            List<Meeting_Conslusion> items = new List<Meeting_Conslusion>();
            bool status = true;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_GetBy_Status", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@Status", SqlDbType.Bit).Value = status;
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            Meeting_Conslusion item = new Meeting_Conslusion();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.Url = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.OriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.SystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.Type = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
                            item.Size = dr.IsDBNull("FileSize") == true ? default : (int)dr["FileSize"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
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
            }
            return items;
        }

        public List<Meeting_Conslusion> GetByScheduleId(string search, Guid scheduleid)
        {
            List<Meeting_Conslusion> items = new List<Meeting_Conslusion>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_GetBy_ScheduleId", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = scheduleid;
                        cmd.Parameters.Add("@search", SqlDbType.NVarChar).Value = search == null ? DBNull.Value : search;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Conslusion item = new Meeting_Conslusion();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.Url = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.OriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.SystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.Type = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
                            item.Size = dr.IsDBNull("FileSize") == true ? default : (int)dr["FileSize"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
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

        public List<Meeting_Conslusion> GetAllDateTime(DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Conslusion> items = new List<Meeting_Conslusion>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_DateTime", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom;
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Conslusion item = new Meeting_Conslusion();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.Url = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.OriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.SystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.Type = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
                            item.Size = dr.IsDBNull("FileSize") == true ? default : (int)dr["FileSize"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
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

        public List<Meeting_Conslusion> GetByStatus(bool status)
        {
            List<Meeting_Conslusion> items = new List<Meeting_Conslusion>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_GetBy_Status", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = status;

                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Conslusion item = new Meeting_Conslusion();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.Url = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.OriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.SystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.Type = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
                            item.Size = dr.IsDBNull("FileSize") == true ? default : (int)dr["FileSize"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
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

        public Meeting_Conslusion GetById(Guid id)
        {
            Meeting_Conslusion item = new Meeting_Conslusion();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_GetBy_Id", con))
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
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.Url = dr.IsDBNull("FileUrl") == true ? null : (string)dr["FileUrl"];
                            item.OriginalName = dr.IsDBNull("FileOriginalName") == true ? null : (string)dr["FileOriginalName"];
                            item.SystemName = dr.IsDBNull("FileSystemName") == true ? null : (string)dr["FileSystemName"];
                            item.Type = dr.IsDBNull("FileType") == true ? null : (string)dr["FileType"];
                            item.Size = dr.IsDBNull("FileSize") == true ? default : (int)dr["FileSize"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];

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