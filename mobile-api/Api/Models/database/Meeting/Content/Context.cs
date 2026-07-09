using Api;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using QTHT.Api.Controllers;
using QTHT.Api.Models;
using System;
using System.Collections.Generic;
using System.Data;

namespace QTHT.Api.Models.database.Meeting.Content
{
    public class MeetingContentContext
    {
        public List<Meeting_Content> GetByScheduleId(Guid scheduleid)
        {
            List<Meeting_Content> items = new List<Meeting_Content>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Content_GetBy_ScheduleId", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = scheduleid;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Content item = new Meeting_Content();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Content_ = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.StartTime = dr.IsDBNull("StartTime") == true ? DateTime.Now : (DateTime)dr["StartTime"];
                            item.EndTime = dr.IsDBNull("EndTime") == true ? DateTime.Now : (DateTime)dr["EndTime"];
                            item.Presenters = dr.IsDBNull("Presenters") == true ? 0 : (int)dr["Presenters"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.UserPresenters = new UserContext().GetById(item.Presenters);
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
        public Meeting_Content GetById(int id)
        {
            Meeting_Content item = new Meeting_Content();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Content_GetBy_Id", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Content_ = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.StartTime = dr.IsDBNull("StartTime") == true ? DateTime.Now : (DateTime)dr["StartTime"];
                            item.EndTime = dr.IsDBNull("EndTime") == true ? DateTime.Now : (DateTime)dr["EndTime"];
                            item.Presenters = dr.IsDBNull("Presenters") == true ? 0 : (int)dr["Presenters"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.UserPresenters = new UserContext().GetById(item.Presenters);
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
