using Api;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace HTT.Api.Models
{
    public class MeetingVotedContext
    {
        public List<Meeting_Voted> GetByScheduleId(Guid scheduleid)
        {
            List<Meeting_Voted> items = new List<Meeting_Voted>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_GetBy_ScheduleId", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = scheduleid;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Voted item = new Meeting_Voted();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.VoteId = dr.IsDBNull("VoteId") == true ? default : (Guid)dr["VoteId"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsCreatedByAd = (bool)dr["IsCreatedByAd"];
                            item.count = new MeetingVotedContext().GetTotalResultVoted(item.VoteId, item.Title);
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
        public List<Meeting_Voted> GetByVotedId(Guid voteId)
        {
            List<Meeting_Voted> items = new List<Meeting_Voted>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_GetBy_VoteId", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@voteid", SqlDbType.UniqueIdentifier).Value = voteId;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Voted item = new Meeting_Voted();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.VoteId = dr.IsDBNull("VoteId") == true ? default : (Guid)dr["VoteId"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsCreatedByAd = dr.IsDBNull("IsCreatedByAd") == true ? default : (bool)dr["IsCreatedByAd"];
                            item.count = new MeetingVotedContext().GetTotalResultVoted(item.VoteId, item.Title);
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
        public List<Meeting_Voted> GetByVoteId(Guid voteid)
        {
            List<Meeting_Voted> items = new List<Meeting_Voted>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_GetBy_VoteId", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@voteid", SqlDbType.UniqueIdentifier).Value = voteid;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Voted item = new Meeting_Voted();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.VoteId = dr.IsDBNull("VoteId") == true ? default : (Guid)dr["VoteId"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsCreatedByAd = (bool)dr["IsCreatedByAd"];
                            item.count = new MeetingVotedContext().GetTotalResultVoted(item.VoteId, item.Title);
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
        public List<Meeting_Voted> GetByVoteIdCreatedBy(Guid voteid, int createdby)
        {
            List<Meeting_Voted> items = new List<Meeting_Voted>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_GetBy_VoteId_CreatedBy", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@voteid", SqlDbType.UniqueIdentifier).Value = voteid;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = createdby;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Voted item = new Meeting_Voted();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.VoteId = dr.IsDBNull("VoteId") == true ? default : (Guid)dr["VoteId"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsCreatedByAd = (bool)dr["IsCreatedByAd"];
                            item.count = new MeetingVotedContext().GetTotalResultVoted(item.VoteId, item.Title);
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
        public List<Meeting_Voted_Chart> GetByVoteIdChart(Guid voteid)
        {
            List<Meeting_Voted_Chart> items = new List<Meeting_Voted_Chart>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_GetBy_VoteId_Chart", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@voteid", SqlDbType.UniqueIdentifier).Value = voteid;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Voted_Chart item = new Meeting_Voted_Chart();
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.VoteId = voteid;
                            item.Vote = new MeetingVotedContext().GetTotalResultVoted(item.VoteId, item.Title);
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
        public List<Meeting_Voted> GetByVoteIdChartDetail(QTHT_HTT_Context _context, Guid voteid)
        {
            List<Meeting_Voted> items = new List<Meeting_Voted>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_GetBy_VoteId_Chart_Detail", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@voteid", SqlDbType.UniqueIdentifier).Value = voteid;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Voted item = new Meeting_Voted();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.VoteId = dr.IsDBNull("VoteId") == true ? default : (Guid)dr["VoteId"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsCreatedByAd = (bool)dr["IsCreatedByAd"];
                            item.Vote = new MeetingVotedContext().GetTotalResultVoted(item.VoteId, item.Title);
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
        public int GetTotalResultVoted(Guid? voteId, string? title)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_Count", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@voteid", SqlDbType.UniqueIdentifier).Value = voteId;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar, 100).Value = title;

                        int count = 0;
                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            if (dr.Read())
                            {
                                count = dr.GetInt32(0);
                            }
                        }
                        return count;
                    }
                }
            }
            catch (Exception ex)
            {
                // Handle the exception (log it, rethrow it, or handle it as per your application's requirement)
                throw;
            }
        }

        public List<Meeting_Voted> GetByVoteIdVoteTitle(string title, Guid voteId)
        {
            List<Meeting_Voted> items = new List<Meeting_Voted>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_GetBy_VotesTitle", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@voteid", SqlDbType.UniqueIdentifier).Value = voteId;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = title;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Voted item = new Meeting_Voted();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.VoteId = dr.IsDBNull("VoteId") == true ? default : (Guid)dr["VoteId"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.IsCreatedByAd = (bool)dr["IsCreatedByAd"];
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

        public Meeting_Voted_Detail GetByVotedChartDetailCreatedBy(Guid votedid, Guid scheduleid ,QTHT_HTT_Context _context)
        {
            Meeting_Voted_Detail item = new Meeting_Voted_Detail();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_GetBy_VoteId_Chart_Detail_CreatedBy", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@voteid", SqlDbType.UniqueIdentifier).Value = votedid;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = scheduleid;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            //item.TotalVoted = dr.IsDBNull("TotalVoted") == true ? 0 : (int)dr["TotalVoted"];
                            //item.TotalMember = dr.IsDBNull("TotalMember") == true ? 0 : (int)dr["TotalMember"];
                            //item.TotalUnvoted = dr.IsDBNull("TotalUnVoted") == true ? 0 : (int)dr["TotalUnVoted"];
                            item.TotalVoted = dr.IsDBNull(dr.GetOrdinal("TotalVoted")) ? 0 : dr.GetInt32(dr.GetOrdinal("TotalVoted"));
                            item.TotalMember = dr.IsDBNull(dr.GetOrdinal("TotalMember")) ? 0 : dr.GetInt32(dr.GetOrdinal("TotalMember"));
                            item.TotalUnvoted = dr.IsDBNull(dr.GetOrdinal("TotalUnVoted")) ? 0 : dr.GetInt32(dr.GetOrdinal("TotalUnVoted"));

                            var allUnvotedUserIds = dr.GetString(dr.GetOrdinal("AllUnvotedUserIds")); 
                            var userIds = allUnvotedUserIds.Split(',').Select(id => int.Parse(id.Trim())).ToList();
                            foreach (var c in userIds)
                            {
                                item.Member.Add(new thong_tin_nguoi_dung
                                {
                                    ten_dangnhap = _context.thong_tin_nguoi_dung.Where(x => x.id == c).Select(x => x.ten_dangnhap).FirstOrDefault(),
                                    ten_day_du = _context.thong_tin_nguoi_dung.Where(x => x.id == c).Select(x => x.ten_day_du).FirstOrDefault(),
                                }); 

                                
                            }

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
