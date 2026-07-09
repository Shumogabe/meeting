using Api;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using QTHT.Api.Models.database.Meeting.Conslusion;
using QTHT.Api.Models.database.Meeting.Content;
using QTHT.Api.Models.database.Meeting.Document;
using QTHT.Api.Models.database.Meeting.Member;
using QTHT.Api.Models.database.Meeting.Votes;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace QTHT.Api.Models.database.Meeting.Schedule
{
    public class MeetingScheduleContext
    {
        private readonly IConfiguration _configuration;
        private readonly QTHT_HTT_Context _context;

        public List<Meeting_Schedule> GetAll(QTHT_HTT_Context _context, string search, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_GetAll", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@strSearch", SqlDbType.NVarChar).Value = search == default ? null : search;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";

                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Schedule item = new Meeting_Schedule();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.StartTime = dr.IsDBNull("StartTime") == true ? DateTime.Now : (DateTime)dr["StartTime"];
                            item.EndTime = dr.IsDBNull("EndTime") == true ? DateTime.Now : (DateTime)dr["EndTime"];
                            item.ChairMan = dr.IsDBNull("ChairMan") == true ? 0 : (int)dr["ChairMan"];
                            item.RoomName = dr.IsDBNull("RoomName") == true ? null : (string)dr["RoomName"];
                            item.Place = dr.IsDBNull("Place") == true ? null : (string)dr["Place"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.Start = dr.IsDBNull("Start") == true ? false : (bool)dr["Start"];
                            item.Token = dr.IsDBNull("Token") == true ? null : (string)dr["Token"];
                            item.ServerId = dr.IsDBNull("ServerId") == true ? 0 : (int)dr["ServerId"];
                            item.TypeId = dr.IsDBNull("TypeId") == true ? 0 : (int)dr["TypeId"];
                            item.SharedRole = dr.IsDBNull("SharedRole") == true ? 0 : (int)dr["SharedRole"];
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? default : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
                            item.Server = new Server.MeetingServerContext().GetById(item.ServerId);

                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(item.Id);
                            item.MeetingMember = new MeetingMemberContext().GetByScheduleId(item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByScheduleId(item.Id, _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(item.Id);
                            ;
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

        public Meeting_Schedule GetById(QTHT_HTT_Context _context, Guid id)
        {
            Meeting_Schedule item = new Meeting_Schedule();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_GetBy_Id", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.StartTime = dr.IsDBNull("StartTime") == true ? DateTime.Now : (DateTime)dr["StartTime"];
                            item.EndTime = dr.IsDBNull("EndTime") == true ? DateTime.Now : (DateTime)dr["EndTime"];
                            item.ChairMan = dr.IsDBNull("ChairMan") == true ? 0 : (int)dr["ChairMan"];
                            item.RoomName = dr.IsDBNull("RoomName") == true ? null : (string)dr["RoomName"];
                            item.Place = dr.IsDBNull("Place") == true ? null : (string)dr["Place"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.Start = dr.IsDBNull("Start") == true ? false : (bool)dr["Start"];
                            item.Token = dr.IsDBNull("Token") == true ? null : (string)dr["Token"];
                            item.ServerId = dr.IsDBNull("ServerId") == true ? 0 : (int)dr["ServerId"];
                            item.TypeId = dr.IsDBNull("TypeId") == true ? 0 : (int)dr["TypeId"];
                            item.SharedRole = dr.IsDBNull("SharedRole") == true ? 0 : (int)dr["SharedRole"];
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? default : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
                            item.Server = new Server.MeetingServerContext().GetById(item.ServerId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(item.Id);
                            item.MeetingMember = new MeetingMemberContext().GetByScheduleId(item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByScheduleId(item.Id, _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(item.Id, "");

                            item.don_vi = dr.IsDBNull("don_vi") == true ? 0 : (long)dr["don_vi"];
                            break;
                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                //throw e;
            }

            return item;
        }

        public List<Meeting_Schedule> GetByTitle(string title)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_GetBy_Title", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = title;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Schedule item = new Meeting_Schedule();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.StartTime = dr.IsDBNull("StartTime") == true ? DateTime.Now : (DateTime)dr["StartTime"];
                            item.EndTime = dr.IsDBNull("EndTime") == true ? DateTime.Now : (DateTime)dr["EndTime"];
                            item.ChairMan = dr.IsDBNull("ChairMan") == true ? 0 : (int)dr["ChairMan"];
                            item.RoomName = dr.IsDBNull("RoomName") == true ? null : (string)dr["RoomName"];
                            item.Place = dr.IsDBNull("Place") == true ? null : (string)dr["Place"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.Start = dr.IsDBNull("Start") == true ? false : (bool)dr["Start"];
                            item.Token = dr.IsDBNull("Token") == true ? null : (string)dr["Token"];
                            item.ServerId = dr.IsDBNull("ServerId") == true ? 0 : (int)dr["ServerId"];
                            item.TypeId = dr.IsDBNull("TypeId") == true ? 0 : (int)dr["TypeId"];
                            item.SharedRole = dr.IsDBNull("SharedRole") == true ? 0 : (int)dr["SharedRole"];
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? default : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
                            item.Server = new Server.MeetingServerContext().GetById(item.ServerId);

                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(item.Id);
                            item.MeetingMember = new MeetingMemberContext().GetByScheduleId(item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByScheduleId(item.Id, _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(item.Id);

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

        public Meeting_Schedule GetByRoomName(QTHT_HTT_Context _context, string roomname)
        {
            Meeting_Schedule item = new Meeting_Schedule();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_GetBy_RoomName", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@roomname", SqlDbType.NVarChar).Value = roomname;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.StartTime = dr.IsDBNull("StartTime") == true ? DateTime.Now : (DateTime)dr["StartTime"];
                            item.EndTime = dr.IsDBNull("EndTime") == true ? DateTime.Now : (DateTime)dr["EndTime"];
                            item.ChairMan = dr.IsDBNull("ChairMan") == true ? 0 : (int)dr["ChairMan"];
                            item.RoomName = dr.IsDBNull("RoomName") == true ? null : (string)dr["RoomName"];
                            item.Place = dr.IsDBNull("Place") == true ? null : (string)dr["Place"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.Start = dr.IsDBNull("Start") == true ? false : (bool)dr["Start"];
                            item.Token = dr.IsDBNull("Token") == true ? null : (string)dr["Token"];
                            item.ServerId = dr.IsDBNull("ServerId") == true ? 0 : (int)dr["ServerId"];
                            item.TypeId = dr.IsDBNull("TypeId") == true ? 0 : (int)dr["TypeId"];
                            item.SharedRole = dr.IsDBNull("SharedRole") == true ? 0 : (int)dr["SharedRole"];
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? default : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
                            item.Server = new Server.MeetingServerContext().GetById(item.ServerId);

                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(item.Id);
                            item.MeetingMember = new MeetingMemberContext().GetByScheduleId(item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByScheduleId(item.Id, _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(item.Id);

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

        public List<Meeting_Schedule> GetByUserId(int create, string search, DateTime dateFrom, DateTime dateTo, int status, bool start, bool isdeleted)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_GetBy_UserId", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@create", SqlDbType.Int).Value = create;
                        cmd.Parameters.Add("@search", SqlDbType.NVarChar).Value = search == null ? DBNull.Value : search;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = status;
                        cmd.Parameters.Add("@start", SqlDbType.Bit).Value = start;
                        cmd.Parameters.Add("@isdeleted", SqlDbType.Bit).Value = isdeleted;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Schedule item = new Meeting_Schedule();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.StartTime = dr.IsDBNull("StartTime") == true ? DateTime.Now : (DateTime)dr["StartTime"];
                            item.EndTime = dr.IsDBNull("EndTime") == true ? DateTime.Now : (DateTime)dr["EndTime"];
                            item.ChairMan = dr.IsDBNull("ChairMan") == true ? 0 : (int)dr["ChairMan"];
                            item.RoomName = dr.IsDBNull("RoomName") == true ? null : (string)dr["RoomName"];
                            item.Place = dr.IsDBNull("Place") == true ? null : (string)dr["Place"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.Start = dr.IsDBNull("Start") == true ? false : (bool)dr["Start"];
                            item.Token = dr.IsDBNull("Token") == true ? null : (string)dr["Token"];
                            item.ServerId = dr.IsDBNull("ServerId") == true ? 0 : (int)dr["ServerId"];
                            item.TypeId = dr.IsDBNull("TypeId") == true ? 0 : (int)dr["TypeId"];
                            item.SharedRole = dr.IsDBNull("SharedRole") == true ? 0 : (int)dr["SharedRole"];
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? default : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
                            item.Server = new Server.MeetingServerContext().GetById(item.ServerId);

                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(item.Id);
                            item.MeetingMember = new MeetingMemberContext().GetByScheduleId(item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByScheduleId(item.Id, _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(item.Id);



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

        public List<Meeting_Schedule> GetByUserIdDay(int create, string search, DateTime day)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_GetBy_UserId_Day", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@create", SqlDbType.Int).Value = create;
                        cmd.Parameters.Add("@search", SqlDbType.NVarChar).Value = search == null ? DBNull.Value : search;
                        cmd.Parameters.Add("@day", SqlDbType.Date).Value = day == default ? DBNull.Value : day;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Schedule item = new Meeting_Schedule();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.StartTime = dr.IsDBNull("StartTime") == true ? DateTime.Now : (DateTime)dr["StartTime"];
                            item.EndTime = dr.IsDBNull("EndTime") == true ? DateTime.Now : (DateTime)dr["EndTime"];
                            item.ChairMan = dr.IsDBNull("ChairMan") == true ? 0 : (int)dr["ChairMan"];
                            item.RoomName = dr.IsDBNull("RoomName") == true ? null : (string)dr["RoomName"];
                            item.Place = dr.IsDBNull("Place") == true ? null : (string)dr["Place"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.Start = dr.IsDBNull("Start") == true ? false : (bool)dr["Start"];
                            item.Token = dr.IsDBNull("Token") == true ? null : (string)dr["Token"];
                            item.ServerId = dr.IsDBNull("ServerId") == true ? 0 : (int)dr["ServerId"];
                            item.TypeId = dr.IsDBNull("TypeId") == true ? 0 : (int)dr["TypeId"];
                            item.SharedRole = dr.IsDBNull("SharedRole") == true ? 0 : (int)dr["SharedRole"];
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? default : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
                            item.Server = new Server.MeetingServerContext().GetById(item.ServerId);

                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(item.Id);
                            item.MeetingMember = new MeetingMemberContext().GetByScheduleId(item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByScheduleId(item.Id, _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(item.Id);

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

        public List<Meeting_Schedule> GetAll_Deleted(QTHT_HTT_Context _context)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_GetAll_Deleted", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Schedule item = new Meeting_Schedule();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.StartTime = dr.IsDBNull("StartTime") == true ? DateTime.Now : (DateTime)dr["StartTime"];
                            item.EndTime = dr.IsDBNull("EndTime") == true ? DateTime.Now : (DateTime)dr["EndTime"];
                            item.ChairMan = dr.IsDBNull("ChairMan") == true ? 0 : (int)dr["ChairMan"];
                            item.RoomName = dr.IsDBNull("RoomName") == true ? null : (string)dr["RoomName"];
                            item.Place = dr.IsDBNull("Place") == true ? null : (string)dr["Place"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.Start = dr.IsDBNull("Start") == true ? false : (bool)dr["Start"];
                            item.Token = dr.IsDBNull("Token") == true ? null : (string)dr["Token"];
                            item.ServerId = dr.IsDBNull("ServerId") == true ? 0 : (int)dr["ServerId"];
                            item.TypeId = dr.IsDBNull("TypeId") == true ? 0 : (int)dr["TypeId"];
                            item.SharedRole = dr.IsDBNull("SharedRole") == true ? 0 : (int)dr["SharedRole"];
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? default : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
                            item.Server = new Server.MeetingServerContext().GetById(item.ServerId);

                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(item.Id);
                            item.MeetingMember = new MeetingMemberContext().GetByScheduleId(item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByScheduleId(item.Id, _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(item.Id);

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

        public List<Meeting_Schedule> GetByUserIdFilter(QTHT_HTT_Context _context, int page, int pageSize, int create, string search, DateTime dateFrom, DateTime dateTo, int status, bool start, bool isdeleted)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_GetBy_UserId_Filter", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@create", SqlDbType.Int).Value = create;
                        cmd.Parameters.Add("@search", SqlDbType.NVarChar).Value = search == null ? DBNull.Value : search;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = status;
                        cmd.Parameters.Add("@start", SqlDbType.Bit).Value = start;
                        cmd.Parameters.Add("@isdeleted", SqlDbType.Bit).Value = isdeleted;
                        cmd.Parameters.Add("@pageNumber", SqlDbType.Int).Value = page;
                        cmd.Parameters.Add("@pageSize", SqlDbType.Int).Value = pageSize;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Schedule item = new Meeting_Schedule();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.StartTime = dr.IsDBNull("StartTime") == true ? DateTime.Now : (DateTime)dr["StartTime"];
                            item.EndTime = dr.IsDBNull("EndTime") == true ? DateTime.Now : (DateTime)dr["EndTime"];
                            item.ChairMan = dr.IsDBNull("ChairMan") == true ? 0 : (int)dr["ChairMan"];
                            item.RoomName = dr.IsDBNull("RoomName") == true ? null : (string)dr["RoomName"];
                            item.Place = dr.IsDBNull("Place") == true ? null : (string)dr["Place"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.Start = dr.IsDBNull("Start") == true ? false : (bool)dr["Start"];
                            item.Token = dr.IsDBNull("Token") == true ? null : (string)dr["Token"];
                            item.ServerId = dr.IsDBNull("ServerId") == true ? 0 : (int)dr["ServerId"];
                            item.TypeId = dr.IsDBNull("TypeId") == true ? 0 : (int)dr["TypeId"];
                            item.SharedRole = dr.IsDBNull("SharedRole") == true ? 0 : (int)dr["SharedRole"];
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? default : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
                            item.Server = new Server.MeetingServerContext().GetById(item.ServerId);

                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(item.Id);
                            item.MeetingMember = new MeetingMemberContext().GetByScheduleId(item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByScheduleId(item.Id, _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(item.Id);

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

        public List<Meeting_Schedule> GetByUserIdFilter(QTHT_HTT_Context _context, int page, int pageSize, int create, int don_vi_id, string search, DateTime dateFrom, DateTime dateTo, int? status, bool? start, bool? isdeleted)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_GetBy_UserId_Mobile", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@create", SqlDbType.Int).Value = create;
                        cmd.Parameters.Add("@donvi", SqlDbType.Int).Value = don_vi_id;
                        cmd.Parameters.Add("@search", SqlDbType.NVarChar).Value = search ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = status ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@start", SqlDbType.Bit).Value = start ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@isdeleted", SqlDbType.Bit).Value = isdeleted ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@pageNumber", SqlDbType.Int).Value = page;
                        cmd.Parameters.Add("@pageSize", SqlDbType.Int).Value = pageSize;

                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Schedule item = new Meeting_Schedule();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.StartTime = dr.IsDBNull("StartTime") == true ? DateTime.Now : (DateTime)dr["StartTime"];
                            item.EndTime = dr.IsDBNull("EndTime") == true ? DateTime.Now : (DateTime)dr["EndTime"];
                            item.ChairMan = dr.IsDBNull("ChairMan") == true ? 0 : (int)dr["ChairMan"];
                            item.RoomName = dr.IsDBNull("RoomName") == true ? null : (string)dr["RoomName"];
                            item.Place = dr.IsDBNull("Place") == true ? null : (string)dr["Place"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.Start = dr.IsDBNull("Start") == true ? false : (bool)dr["Start"];
                            item.Token = dr.IsDBNull("Token") == true ? null : (string)dr["Token"];
                            item.ServerId = dr.IsDBNull("ServerId") == true ? 0 : (int)dr["ServerId"];
                            item.TypeId = dr.IsDBNull("TypeId") == true ? 0 : (int)dr["TypeId"];
                            item.SharedRole = dr.IsDBNull("SharedRole") == true ? 0 : (int)dr["SharedRole"];
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? default : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
                            item.Server = new Server.MeetingServerContext().GetById(item.ServerId);

                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(item.Id);
                            item.MeetingMember = new MeetingMemberContext().GetByScheduleId(item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByScheduleId(item.Id, _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(item.Id);
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
                // Log or handle the exception as needed
            }

            return items;
        }


        public List<Meeting_Schedule> GetList(QTHT_HTT_Context _context, string search, DateTime dateFrom, DateTime dateTo, long id_matochuc, int pageNumber = 1, int pageSize = 10)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_GetList", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@create", SqlDbType.BigInt).Value = id_matochuc;
                        cmd.Parameters.Add("@search", SqlDbType.NVarChar).Value = search == null ? DBNull.Value : search;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";
                        cmd.Parameters.Add("@isdeleted", SqlDbType.Bit).Value = false;
                        cmd.Parameters.Add("@pageSize", SqlDbType.Int).Value = pageSize;
                        cmd.Parameters.Add("@pageNumber", SqlDbType.Int).Value = pageNumber;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Schedule item = new Meeting_Schedule();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.StartTime = dr.IsDBNull("StartTime") == true ? DateTime.Now : (DateTime)dr["StartTime"];
                            item.EndTime = dr.IsDBNull("EndTime") == true ? DateTime.Now : (DateTime)dr["EndTime"];
                            item.ChairMan = dr.IsDBNull("ChairMan") == true ? 0 : (int)dr["ChairMan"];
                            item.RoomName = dr.IsDBNull("RoomName") == true ? null : (string)dr["RoomName"];
                            item.Place = dr.IsDBNull("Place") == true ? null : (string)dr["Place"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.Start = dr.IsDBNull("Start") == true ? false : (bool)dr["Start"];
                            item.Token = dr.IsDBNull("Token") == true ? null : (string)dr["Token"];
                            item.ServerId = dr.IsDBNull("ServerId") == true ? 0 : (int)dr["ServerId"];
                            item.TypeId = dr.IsDBNull("TypeId") == true ? 0 : (int)dr["TypeId"];
                            item.SharedRole = dr.IsDBNull("SharedRole") == true ? 0 : (int)dr["SharedRole"];
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? default : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.don_vi = dr.IsDBNull("don_vi") == true ? 0 : (long)dr["don_vi"];
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
                            item.Server = new Server.MeetingServerContext().GetById(item.ServerId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(item.Id);
                            item.MeetingMember = new MeetingMemberContext().GetByScheduleId(item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByScheduleId(item.Id, _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(item.Id);

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