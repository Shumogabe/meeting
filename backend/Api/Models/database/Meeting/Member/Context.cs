using Api;
using DocumentFormat.OpenXml.Drawing;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Dynamic.Core;

namespace HTT.Api.Models
{
    public class MeetingMemberContext
    {
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
                            item.Activated = (bool)dr["Activated"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];

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
        public List<Meeting_Member> GetByScheduleIdInside(QTHT_HTT_Context _context, Guid scheduleid)
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
                            item.Activated = (bool)dr["Activated"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.user = _context.thong_tin_nguoi_dung.Where(x => x.id == item.UserId).FirstOrDefault();
                            item.user = _context.thong_tin_nguoi_dung.Where(x => x.id == item.UserId).FirstOrDefault();
                            if (!string.IsNullOrEmpty(item.user?.ma_chucvu))
                            {
                                item.user.thong_tin_chuc_vu = _context.thong_tin_chuc_vu.Find(item.user?.ma_chucvu);
                            }
                            if (!string.IsNullOrEmpty(item.user?.ma_tochuc))
                            {
                                item.user.thong_tin_don_vi = _context.thong_tin_don_vi.Find(item.user?.ma_tochuc);
                            }
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
        public List<Meeting_Member> GetByScheduleIdOutside(QTHT_HTT_Context _context, Guid scheduleid)
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
                            item.Activated = (bool)dr["Activated"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.user = _context.thong_tin_nguoi_dung.Where(x => x.id == item.UserId).FirstOrDefault();
                            if (!string.IsNullOrEmpty(item.user?.ma_chucvu))
                            {
                                item.user.thong_tin_chuc_vu = _context.thong_tin_chuc_vu.Find(item.user?.ma_chucvu);
                            }
                            if (!string.IsNullOrEmpty(item.user?.ma_tochuc))
                            {
                                item.user.thong_tin_don_vi = _context.thong_tin_don_vi.Find(item.user?.ma_tochuc);
                            }
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

                        
                    }
                    cmd.Dispose();
                    dr.Close();
                    con.Close();
                }
            }
            return item;
        }

        public Meeting_Member GetByUserId(int id)
        {
            Meeting_Member item = new Meeting_Member();
            using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("Meeting_Member_GetByUserId", con))
                {
                    con.Open();
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@userId", SqlDbType.Int).Value = id;
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


                    }
                    cmd.Dispose();
                    dr.Close();
                    con.Close();
                }
            }
            return item;
        }

        public List<Meeting_Member> GetByStatus(bool status)
        {
            List<Meeting_Member> items = new List<Meeting_Member>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Member_Status", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = status;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Member item = new Meeting_Member();
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
