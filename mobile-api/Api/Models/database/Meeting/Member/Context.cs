using Api;
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using QTHT.Api.Models;

namespace QTHT.Api.Models.database.Meeting.Member
{
    public class MeetingMemberContext
    {
        private readonly IConfiguration _configuration;
        private readonly QTHT_HTT_Context _context;
        public List<Meeting_Member> GetByScheduleId(Guid scheduleid)
        {
            List<Meeting_Member> items = new List<Meeting_Member>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Member_GetBy_ScheduleId", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = scheduleid;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Member item = new Meeting_Member();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.UserId = dr.IsDBNull("UserId") == true ? 0 : (int)dr["UserId"];
                            item.Email = dr.IsDBNull("Email") == true ? null : (string)dr["Email"];
                            item.Activated = dr.IsDBNull("Activated") == true ? false : (bool)dr["Activated"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.User = new UserContext().GetById(item.UserId);
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

        public Meeting_Member GetById(Guid id)
        {
            Meeting_Member item = new Meeting_Member();
            using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("Meeting_Member_GetBy_Id", con))
                {
                    con.Open();
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                    SqlDataReader dr = cmd.ExecuteReader();
                    while (dr.Read())
                    {

                        item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                        item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                        item.UserId = dr.IsDBNull("UserId") == true ? 0 : (int)dr["UserId"];
                        item.Email = dr.IsDBNull("Email") == true ? null : (string)dr["Email"];
                        item.Activated = (bool)dr["Activated"];
                        item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                        item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                        item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                        item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                        item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                        item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                        item.User = new UserContext().GetById(item.UserId);

                    }
                    cmd.Dispose();
                    dr.Close();
                    con.Close();
                }
            }
            return item;
        }
        public List<Meeting_Member> GetByScheduleIdInside(Guid scheduleid)
        {
            List<Meeting_Member> items = new List<Meeting_Member>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Member_GetBy_ScheduleId_INSIDE", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = scheduleid;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Member item = new Meeting_Member();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.UserId = dr.IsDBNull("UserId") == true ? 0 : (int)dr["UserId"];
                            item.Email = dr.IsDBNull("Email") == true ? null : (string)dr["Email"];
                            item.Activated = dr.IsDBNull("Activated") == true ? false : (bool)dr["Activated"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.User = new UserContext().GetById(item.UserId);
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
        public List<Meeting_Member> GetByScheduleIdOutside(Guid scheduleid)
        {
            List<Meeting_Member> items = new List<Meeting_Member>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Member_GetBy_ScheduleId_OUTSIDE", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = scheduleid;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Member item = new Meeting_Member();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.UserId = dr.IsDBNull("UserId") == true ? 0 : (int)dr["UserId"];
                            item.Email = dr.IsDBNull("Email") == true ? null : (string)dr["Email"];
                            item.Activated = dr.IsDBNull("Activated") == true ? false : (bool)dr["Activated"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.User = new UserContext().GetById(item.UserId);
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
