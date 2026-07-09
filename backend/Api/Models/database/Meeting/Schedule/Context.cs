using Api;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace HTT.Api.Models
{
    public class MeetingScheduleContext
    {
        private readonly IConfiguration _configuration;

        public List<Meeting_Schedule> GetAll(QTHT_HTT_Context _context, string strSearch, DateTime dateFrom, DateTime dateTo)
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
                        cmd.Parameters.Add("@strSearch", SqlDbType.NVarChar).Value = strSearch == default ? null : strSearch;
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
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? false : (bool)dr["IsPublished"];
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
                            item.Server = new MeetingServerContext().GetById(item.ServerId);
                            item.Type = new MeetingTypeContext().GetById(item.TypeId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(_context, null, item.Id);
                            item.MeetingMemberOutside = new MeetingMemberContext().GetByScheduleIdOutside(_context, item.Id);
                            item.MeetingMemberInside = new MeetingMemberContext().GetByScheduleIdInside(_context, item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByFileUrl("tailieu/" + item.Id.ToString(), _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(_context, item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(null, item.Id);
                            item.MeetingDocumentConclusion = new MeetingDocumentContext().GetByFileUrl("ketluan/" + item.Id.ToString(), _context);
                            item.MeetingVideo = new MeetingVideoContext().GetByFileUrl("", "ghihinhcuochop/" + item.Id.ToString(), _context);
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


        public List<Meeting_Schedule> GetAllDateTime(QTHT_HTT_Context _context, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_DateTime", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
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
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? false : (bool)dr["IsPublished"];
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
                            item.Server = new MeetingServerContext().GetById(item.ServerId);
                            item.Type = new MeetingTypeContext().GetById(item.TypeId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(_context, null, item.Id);
                            item.MeetingMemberOutside = new MeetingMemberContext().GetByScheduleIdOutside(_context, item.Id);
                            item.MeetingMemberInside = new MeetingMemberContext().GetByScheduleIdInside(_context, item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByFileUrl("tailieu/" + item.Id.ToString(), _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(_context, item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(null, item.Id);
                            item.MeetingVideo = new MeetingVideoContext().GetByFileUrl("", "ghihinhcuochop/" + item.Id.ToString(), _context);
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

        public List<Meeting_Schedule> GetAllDateTimeDonVi(QTHT_HTT_Context _context, DateTime dateFrom, DateTime dateTo,int don_vi_id)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_DateTime_donvi", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@donvi", SqlDbType.Int).Value = don_vi_id;
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
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? false : (bool)dr["IsPublished"];
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
                            item.Server = new MeetingServerContext().GetById(item.ServerId);
                            item.Type = new MeetingTypeContext().GetById(item.TypeId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(_context, null, item.Id);
                            item.MeetingMemberOutside = new MeetingMemberContext().GetByScheduleIdOutside(_context, item.Id);
                            item.MeetingMemberInside = new MeetingMemberContext().GetByScheduleIdInside(_context, item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByFileUrl("tailieu/" + item.Id.ToString(), _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(_context, item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(null, item.Id);
                            item.MeetingVideo = new MeetingVideoContext().GetByFileUrl("", "ghihinhcuochop/" + item.Id.ToString(), _context);
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
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? false : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.Server = new MeetingServerContext().GetById(item.ServerId);
                            item.Type = new MeetingTypeContext().GetById(item.TypeId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(_context, null, item.Id);
                            item.MeetingMemberOutside = new MeetingMemberContext().GetByScheduleIdOutside(_context, item.Id);
                            item.MeetingMemberInside = new MeetingMemberContext().GetByScheduleIdInside(_context, item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByFileUrl("tailieu/" + item.Id.ToString(), _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(_context, item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(null, item.Id);
                            item.MeetingVideo = new MeetingVideoContext().GetByFileUrl("", "ghihinhcuochop/" + item.Id.ToString(), _context);
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            if (!string.IsNullOrEmpty(item.UserChairMan?.ma_chucvu))
                            {
                                item.UserChairMan.thong_tin_chuc_vu = _context.thong_tin_chuc_vu.Find(item.UserChairMan?.ma_chucvu);
                            }
                            if (!string.IsNullOrEmpty(item.UserChairMan?.ma_tochuc))
                            {
                                item.UserChairMan.thong_tin_don_vi = _context.thong_tin_don_vi.Find(item.UserChairMan?.ma_tochuc);
                            }
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            if (!string.IsNullOrEmpty(item.UserCreatedBy?.ma_chucvu))
                            {
                                item.UserCreatedBy.thong_tin_chuc_vu = _context.thong_tin_chuc_vu.Find(item.UserCreatedBy?.ma_chucvu);
                            }
                            if (!string.IsNullOrEmpty(item.UserCreatedBy?.ma_tochuc))
                            {
                                item.UserCreatedBy.thong_tin_don_vi = _context.thong_tin_don_vi.Find(item.UserCreatedBy?.ma_tochuc);
                            }
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
                            if (!string.IsNullOrEmpty(item.UserShareRole?.ma_chucvu))
                            {
                                item.UserShareRole.thong_tin_chuc_vu = _context.thong_tin_chuc_vu.Find(item.UserShareRole?.ma_chucvu);
                            }
                            if (!string.IsNullOrEmpty(item.UserShareRole?.ma_tochuc))
                            {
                                item.UserShareRole.thong_tin_don_vi = _context.thong_tin_don_vi.Find(item.UserShareRole?.ma_tochuc);
                            }
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

        public List<Meeting_Schedule> GetByTitle(QTHT_HTT_Context _context, string title)
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
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? false : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.Server = new MeetingServerContext().GetById(item.ServerId);
                            item.Type = new MeetingTypeContext().GetById(item.TypeId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(_context, null, item.Id);
                            item.MeetingMemberOutside = new MeetingMemberContext().GetByScheduleIdOutside(_context, item.Id);
                            item.MeetingMemberInside = new MeetingMemberContext().GetByScheduleIdInside(_context, item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByFileUrl("tailieu/" + item.Id.ToString(), _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(_context, item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(null, item.Id);
                            item.MeetingVideo = new MeetingVideoContext().GetByFileUrl("", "ghihinhcuochop/" + item.Id.ToString(), _context);
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
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
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? false : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.Server = new MeetingServerContext().GetById(item.ServerId);
                            item.Type = new MeetingTypeContext().GetById(item.TypeId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(_context, null, item.Id);
                            item.MeetingMemberOutside = new MeetingMemberContext().GetByScheduleIdOutside(_context, item.Id);
                            item.MeetingMemberInside = new MeetingMemberContext().GetByScheduleIdInside(_context, item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByFileUrl("tailieu/" + item.Id.ToString(), _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(_context, item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(null, item.Id);
                            item.MeetingVideo = new MeetingVideoContext().GetByFileUrl("", "ghihinhcuochop/" + item.Id.ToString(), _context);
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            if (!string.IsNullOrEmpty(item.UserChairMan?.ma_chucvu))
                            {
                                item.UserChairMan.thong_tin_chuc_vu = _context.thong_tin_chuc_vu.Find(item.UserChairMan?.ma_chucvu);
                            }
                            if (!string.IsNullOrEmpty(item.UserChairMan?.ma_tochuc))
                            {
                                item.UserChairMan.thong_tin_don_vi = _context.thong_tin_don_vi.Find(item.UserChairMan?.ma_tochuc);
                            }
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            if (!string.IsNullOrEmpty(item.UserCreatedBy?.ma_chucvu))
                            {
                                item.UserCreatedBy.thong_tin_chuc_vu = _context.thong_tin_chuc_vu.Find(item.UserCreatedBy?.ma_chucvu);
                            }
                            if (!string.IsNullOrEmpty(item.UserCreatedBy?.ma_tochuc))
                            {
                                item.UserCreatedBy.thong_tin_don_vi = _context.thong_tin_don_vi.Find(item.UserCreatedBy?.ma_tochuc);
                            }
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
                            if (!string.IsNullOrEmpty(item.UserShareRole?.ma_chucvu))
                            {
                                item.UserShareRole.thong_tin_chuc_vu = _context.thong_tin_chuc_vu.Find(item.UserShareRole?.ma_chucvu);
                            }
                            if (!string.IsNullOrEmpty(item.UserShareRole?.ma_tochuc))
                            {
                                item.UserShareRole.thong_tin_don_vi = _context.thong_tin_don_vi.Find(item.UserShareRole?.ma_tochuc);
                            }
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

        public List<Meeting_Schedule> GetByUserId(QTHT_HTT_Context _context, int create, string search, DateTime dateFrom, DateTime dateTo, int status, bool start, bool isdeleted)
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
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? false : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.Server = new MeetingServerContext().GetById(item.ServerId);
                            item.Type = new MeetingTypeContext().GetById(item.TypeId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(_context, null, item.Id);
                            item.MeetingMemberOutside = new MeetingMemberContext().GetByScheduleIdOutside(_context, item.Id);
                            item.MeetingMemberInside = new MeetingMemberContext().GetByScheduleIdInside(_context, item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByFileUrl("tailieu/" + item.Id.ToString(), _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(_context, item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(null, item.Id);
                            item.MeetingVideo = new MeetingVideoContext().GetByFileUrl("", "ghihinhcuochop/" + item.Id.ToString(), _context);
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();

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

        public List<Meeting_Schedule> GetByUserIdTypeId(QTHT_HTT_Context _context, int page, int pageSize, int create, int don_vi_id, string search, DateTime dateFrom, DateTime dateTo, int status, bool start, bool isdeleted)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_GetBy_TypeId", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@create", SqlDbType.Int).Value = create;
                        cmd.Parameters.Add("@donvi", SqlDbType.Int).Value = don_vi_id;
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
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? false : (bool)dr["IsPublished"];
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
                            item.Server = new MeetingServerContext().GetById(item.ServerId);
                            item.Type = new MeetingTypeContext().GetById(item.TypeId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(_context, null, item.Id);
                            item.MeetingMemberOutside = new MeetingMemberContext().GetByScheduleIdOutside(_context, item.Id);
                            item.MeetingMemberInside = new MeetingMemberContext().GetByScheduleIdInside(_context, item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByFileUrl("tailieu/" + item.Id.ToString(), _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(_context, item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(null, item.Id);
                            item.MeetingVideo = new MeetingVideoContext().GetByFileUrl("", "ghihinhcuochop/" + item.Id.ToString(), _context);
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

        public List<Meeting_Schedule> GetByUserIdDay(QTHT_HTT_Context _context, int create, string search, DateTime day)
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
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? false : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.Server = new MeetingServerContext().GetById(item.ServerId);
                            item.Type = new MeetingTypeContext().GetById(item.TypeId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(_context, null, item.Id);
                            item.MeetingMemberOutside = new MeetingMemberContext().GetByScheduleIdOutside(_context, item.Id);
                            item.MeetingMemberInside = new MeetingMemberContext().GetByScheduleIdInside(_context, item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByFileUrl("tailieu/" + item.Id.ToString(), _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(_context, item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(null, item.Id);
                            item.MeetingVideo = new MeetingVideoContext().GetByFileUrl("", "ghihinhcuochop/" + item.Id.ToString(), _context);
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
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

        public List<Meeting_Schedule> GetListActive(QTHT_HTT_Context _context,int don_vi_id)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Active", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@donvi", SqlDbType.Int).Value = don_vi_id;

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
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? false : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.Server = new MeetingServerContext().GetById(item.ServerId);
                            item.Type = new MeetingTypeContext().GetById(item.TypeId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(_context, null, item.Id);
                            item.MeetingMemberOutside = new MeetingMemberContext().GetByScheduleIdOutside(_context, item.Id);
                            item.MeetingMemberInside = new MeetingMemberContext().GetByScheduleIdInside(_context, item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByFileUrl("tailieu/" + item.Id.ToString(), _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(_context, item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(null, item.Id);
                            item.MeetingVideo = new MeetingVideoContext().GetByFileUrl("", "ghihinhcuochop/" + item.Id.ToString(), _context);
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
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

        public List<Meeting_Schedule> GetListUnactive(QTHT_HTT_Context _context, int don_vi_id)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Unactive", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@donvi", SqlDbType.Int).Value = don_vi_id;

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
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? false : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.Server = new MeetingServerContext().GetById(item.ServerId);
                            item.Type = new MeetingTypeContext().GetById(item.TypeId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(_context, null, item.Id);
                            item.MeetingMemberOutside = new MeetingMemberContext().GetByScheduleIdOutside(_context, item.Id);
                            item.MeetingMemberInside = new MeetingMemberContext().GetByScheduleIdInside(_context, item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByFileUrl("tailieu/" + item.Id.ToString(), _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(_context, item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(null, item.Id);
                            item.MeetingVideo = new MeetingVideoContext().GetByFileUrl("", "ghihinhcuochop/" + item.Id.ToString(), _context);
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
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
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? false : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.Server = new MeetingServerContext().GetById(item.ServerId);
                            item.Type = new MeetingTypeContext().GetById(item.TypeId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(_context, null, item.Id);
                            item.MeetingMemberOutside = new MeetingMemberContext().GetByScheduleIdOutside(_context, item.Id);
                            item.MeetingMemberInside = new MeetingMemberContext().GetByScheduleIdInside(_context, item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByFileUrl("tailieu/" + item.Id.ToString(), _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(_context, item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(null, item.Id);
                            item.MeetingVideo = new MeetingVideoContext().GetByFileUrl("", "ghihinhcuochop/" + item.Id.ToString(), _context);
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

        public List<Meeting_Schedule> GetByUserIdFilter(QTHT_HTT_Context _context, int page, int pageSize, int create, int don_vi_id, string search, DateTime dateFrom, DateTime dateTo, int status, bool start, bool isdeleted)
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
                        cmd.Parameters.Add("@donvi", SqlDbType.Int).Value = don_vi_id;
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
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? false : (bool)dr["IsPublished"];
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
                            item.Server = new MeetingServerContext().GetById(item.ServerId);
                            item.Type = new MeetingTypeContext().GetById(item.TypeId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(_context, null, item.Id);
                            item.MeetingMemberOutside = new MeetingMemberContext().GetByScheduleIdOutside(_context, item.Id);
                            item.MeetingMemberInside = new MeetingMemberContext().GetByScheduleIdInside(_context, item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByFileUrl("tailieu/" + item.Id.ToString(), _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(_context, item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(null, item.Id);
                            item.MeetingVideo = new MeetingVideoContext().GetByFileUrl("", "ghihinhcuochop/" + item.Id.ToString(), _context);
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

        public List<Meeting_Schedule> GetByUserIdFilterMonre(QTHT_HTT_Context _context, int page, int pageSize, int create, int don_vi_id, string search, DateTime dateFrom, DateTime dateTo, int status, bool start, bool isdeleted)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_GetBy_UserId_monre", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
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
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? false : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
                            item.UserChairMan = _context.thong_tin_nguoi_dung.Where(x => x.id == item.ChairMan).FirstOrDefault();
                            if (!string.IsNullOrEmpty(item.UserChairMan?.ma_chucvu))
                            {
                                item.UserChairMan.thong_tin_chuc_vu = _context.thong_tin_chuc_vu.Find(item.UserChairMan?.ma_chucvu);
                            }
                            if (!string.IsNullOrEmpty(item.UserChairMan?.ma_tochuc))
                            {
                                item.UserChairMan.thong_tin_don_vi = _context.thong_tin_don_vi.Find(item.UserChairMan?.ma_tochuc);
                            }
                            item.UserCreatedBy = _context.thong_tin_nguoi_dung.Where(x => x.id == item.CreatedBy).FirstOrDefault();
                            if (!string.IsNullOrEmpty(item.UserCreatedBy?.ma_chucvu))
                            {
                                item.UserCreatedBy.thong_tin_chuc_vu = _context.thong_tin_chuc_vu.Find(item.UserCreatedBy?.ma_chucvu);
                            }
                            if (!string.IsNullOrEmpty(item.UserCreatedBy?.ma_tochuc))
                            {
                                item.UserCreatedBy.thong_tin_don_vi = _context.thong_tin_don_vi.Find(item.UserCreatedBy?.ma_tochuc);
                            }
                            item.UserShareRole = _context.thong_tin_nguoi_dung.Where(x => x.id == item.SharedRole).FirstOrDefault();
                            if (!string.IsNullOrEmpty(item.UserShareRole?.ma_chucvu))
                            {
                                item.UserShareRole.thong_tin_chuc_vu = _context.thong_tin_chuc_vu.Find(item.UserShareRole?.ma_chucvu);
                            }
                            if (!string.IsNullOrEmpty(item.UserShareRole?.ma_tochuc))
                            {
                                item.UserShareRole.thong_tin_don_vi = _context.thong_tin_don_vi.Find(item.UserShareRole?.ma_tochuc);
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

        public List<Meeting_Schedule> GetAllByStatus(QTHT_HTT_Context _context, int page, int pageSize, int don_vi_id, string search, DateTime dateFrom, DateTime dateTo, int status, bool start, bool isdeleted)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_GetBy_Status", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@donvi", SqlDbType.Int).Value = don_vi_id;
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
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? false : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];

                            item.Server = new MeetingServerContext().GetById(item.ServerId);
                            item.Type = new MeetingTypeContext().GetById(item.TypeId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(_context, null, item.Id);
                            item.MeetingMemberOutside = new MeetingMemberContext().GetByScheduleIdOutside(_context, item.Id);
                            item.MeetingMemberInside = new MeetingMemberContext().GetByScheduleIdInside(_context, item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByFileUrl("tailieu/" + item.Id.ToString(), _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(_context, item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(null, item.Id);
                            item.MeetingVideo = new MeetingVideoContext().GetByFileUrl("", "ghihinhcuochop/" + item.Id.ToString(), _context);
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

        public List<Meeting_Schedule> GetByEnd(DateTime date)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_End", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@dateTime", SqlDbType.DateTime).Value = date;

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
                            item.IsPublished = dr.IsDBNull("IsPublished") == true ? false : (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = dr.IsDBNull("IsDeleted") == true ? false : (bool)dr["IsDeleted"];
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

        public List<Meeting_Schedule> GetByEnded(QTHT_HTT_Context _context, DateTime date)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Ended", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@dateTime", SqlDbType.DateTime).Value = date;

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
                            item.Start = (bool)dr["Start"];
                            item.Token = dr.IsDBNull("Token") == true ? null : (string)dr["Token"];
                            item.ServerId = dr.IsDBNull("ServerId") == true ? 0 : (int)dr["ServerId"];
                            item.TypeId = dr.IsDBNull("TypeId") == true ? 0 : (int)dr["TypeId"];
                            item.SharedRole = dr.IsDBNull("SharedRole") == true ? 0 : (int)dr["SharedRole"];
                            item.IsPublished = (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.Server = new MeetingServerContext().GetById(item.ServerId);
                            item.Type = new MeetingTypeContext().GetById(item.TypeId);
                            item.MeetingVotes = new MeetingVotesContext().GetByScheduleId(_context, null, item.Id);
                            item.MeetingMemberOutside = new MeetingMemberContext().GetByScheduleIdOutside(_context, item.Id);
                            item.MeetingMemberInside = new MeetingMemberContext().GetByScheduleIdInside(_context, item.Id);
                            item.MeetingDocument = new MeetingDocumentContext().GetByFileUrl("tailieu/" + item.Id.ToString(), _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(_context, item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(null, item.Id);
                            item.MeetingVideo = new MeetingVideoContext().GetByFileUrl("", "ghihinhcuochop/" + item.Id.ToString(), _context);
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


        public List<Meeting_Schedule> GetByServerEnded(DateTime date, int? serverId)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Server_Ended", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@dateTime", SqlDbType.DateTime).Value = date;
                        cmd.Parameters.Add("@serverId", SqlDbType.Int).Value = serverId;
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
                            item.Start = (bool)dr["Start"];
                            item.Token = dr.IsDBNull("Token") == true ? null : (string)dr["Token"];
                            item.ServerId = dr.IsDBNull("ServerId") == true ? 0 : (int)dr["ServerId"];
                            item.TypeId = dr.IsDBNull("TypeId") == true ? 0 : (int)dr["TypeId"];
                            item.SharedRole = dr.IsDBNull("SharedRole") == true ? 0 : (int)dr["SharedRole"];
                            item.IsPublished = (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
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

        public List<Meeting_Schedule> GetByServer(QTHT_HTT_Context _context, int serverId)
        {
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_GetByServer", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@serverId", SqlDbType.Int).Value = serverId;
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
                            item.Start = (bool)dr["Start"];
                            item.Token = dr.IsDBNull("Token") == true ? null : (string)dr["Token"];
                            item.ServerId = dr.IsDBNull("ServerId") == true ? 0 : (int)dr["ServerId"];
                            item.TypeId = dr.IsDBNull("TypeId") == true ? 0 : (int)dr["TypeId"];
                            item.SharedRole = dr.IsDBNull("SharedRole") == true ? 0 : (int)dr["SharedRole"];
                            item.IsPublished = (bool)dr["IsPublished"];
                            item.Password = dr.IsDBNull("Password") == true ? null : (string)dr["Password"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.Server = new MeetingServerContext().GetById(item.ServerId);
                            item.Type = new MeetingTypeContext().GetById(item.TypeId);
                            item.MeetingDocument = new MeetingDocumentContext().GetByScheduleId(item.Id, _context);
                            item.MeetingContent = new MeetingContentContext().GetByScheduleId(_context, item.Id);
                            item.MeetingConslusion = new MeetingConslusionContext().GetByScheduleId(null, item.Id);
                            item.MeetingMemberCount = new MeetingMemberContext().GetByScheduleId(item.Id).Count;
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

        public int GetCount(int don_vi_id)
        {
            int count = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Count", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@don_vi", SqlDbType.BigInt).Value = don_vi_id;

                        // Use ExecuteScalar to retrieve the count directly
                        count = (int)cmd.ExecuteScalar();

                        con.Close();
                    }
                }
            }
            catch (Exception e)
            {
                // Optionally, log the exception or handle it as needed
                Console.WriteLine(e.Message);
            }
            return count;
        }

    }
}