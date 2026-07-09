using Api;
using Microsoft.Data.SqlClient;
using QTHT.Api.Models.database.Meeting.Voted;
using System;
using System.Collections.Generic;
using System.Data;

namespace QTHT.Api.Models.database.Meeting.Votes
{
    public class MeetingVotesContext
    {
        public Meeting_Votes GetById(Guid id)
        {
            Meeting_Votes item = new Meeting_Votes();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_GetBy_Id", con))
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
                            item.Status = dr.IsDBNull("Status") == true ? default : (bool)dr["Status"];
                            item.Type = dr.IsDBNull("Type") == true ? default : (bool)dr["Type"];
                            item.End = dr.IsDBNull("End") == true ? default : (bool)dr["End"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? default : (bool)dr["IsDeleted"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.Meetingvoted = new MeetingVotedContext().GetByVoteId(item.Id);
                            
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

        public List<Meeting_Votes> GetByScheduleId(Guid scheduleid)
        {
            List<Meeting_Votes> items = new List<Meeting_Votes>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_GetBy_Schedule", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = scheduleid;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Votes item = new Meeting_Votes();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Status = dr.IsDBNull("Status") == true ? default : (bool)dr["Status"];
                            item.Type = dr.IsDBNull("Type") == true ? default:(bool)dr["Type"];
                            item.End = dr.IsDBNull("End") == true ? default : (bool)dr["End"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? default : (bool)dr["IsDeleted"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? default : (bool)dr["IsDeleted"];
                            item.Meetingvoted = new MeetingVotedContext().GetByVoteId(item.Id);
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

        public Meeting_Votes GetByTitle(string title)
        {
            Meeting_Votes item = new Meeting_Votes();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_GetBy_VotesTitle", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = title;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Status = dr.IsDBNull("Status") == true ? default : (bool)dr["Status"];
                            item.Type = dr.IsDBNull("Type") == true ?default : (bool)dr["Type"];
                            item.End = dr.IsDBNull("End") == true ? default : (bool)dr["End"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? default : (bool)dr["IsDeleted"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
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

        public List<Meeting_Votes> GetByStatus()
        {
            List<Meeting_Votes> items = new List<Meeting_Votes>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_GetBy_VotesStatus", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;

                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Votes item = new Meeting_Votes();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Status = dr.IsDBNull("Status") == true ? default : (bool)dr["Status"];
                            item.Type = dr.IsDBNull("Type") == true ? default : (bool)dr["Type"];
                            item.End = dr.IsDBNull("End") == true ? default : (bool)dr["End"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? default : (bool)dr["IsDeleted"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.Meetingvoted = new MeetingVotedContext().GetByVoteId(item.Id);
                            
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
                Console.WriteLine($"An error occurred: {ex.Message}");
            }
            return items;
        }
    }
}