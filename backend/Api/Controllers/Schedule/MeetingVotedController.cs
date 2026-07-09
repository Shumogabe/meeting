using Api;
using HTT.Api.Helpers;
using HTT.Api.Models;
using HTT.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace HTT.Api.Controllers
{
    [Route("meeting/[controller]")]
    [ApiController]
    public class MeetingVotedController : Controller
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _datacontext;
        public IConfiguration _config { get; }
        public MeetingVotedController(IConfiguration Configuration, QTHT_HTT_Context context, HTT_Context datacontext)
        {
            _context = context;
            _config = Configuration;
            _datacontext = datacontext;
        }

        [HttpGet("GetByScheduleId")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.VOTED)]
        public IActionResult GetByScheduleId(Guid id)
        {
            return Ok(new { status = true, data = new MeetingVotedContext().GetByScheduleId(id) });
        }

        [HttpGet("GetByVoteId")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.VOTED)]
        public IActionResult GetByVoteId(Guid voteid)
        {
            return Ok(new { status = true, data = new MeetingVotedContext().GetByVoteId(voteid) });
        }

        [HttpGet("GetByVoteIdChart")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.VOTED)]
        public IActionResult GetByVoteIdChart(Guid voteid)
        {
            return Ok(new { status = true, data = new MeetingVotedContext().GetByVoteIdChart(voteid) });
        }
        [HttpGet("GetByVotedChartDetailCreatedBy")]
        public IActionResult GetByVotedChartDetailCreatedBy(Guid votedid, Guid scheduleid)
        {
            return Ok(new { status = true, data = new MeetingVotedContext().GetByVotedChartDetailCreatedBy(votedid, scheduleid,_context) });
        }
        [HttpGet("GetByVoteIdCreatedBy")]
        [Authorize]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.VOTED)]
        public IActionResult GetByVoteIdCreatedBy(Guid voteid)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            return Ok(new { status = true, data = new MeetingVotedContext().GetByVoteIdCreatedBy(voteid, (int)user) });
        }

        [HttpGet("GetByVoteIdVoteTitle")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.VOTED)]
        public IActionResult GetByVoteIdVoteTitle(string title, Guid voteId)
        {
            return Ok(new { status = true, data = new MeetingVotedContext().GetByVoteIdVoteTitle(title, voteId) });
        }

        [HttpPost("Insert")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.VOTED)]
        public IActionResult Insert(Meeting_Voted_Insert model)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var meeting_voted = new MeetingVotedContext().GetByVoteIdVoteTitle(model.Title, model.VoteId);
            foreach (var c in meeting_voted)
            {
                if (c.CreatedBy == user)
                {
                    return StatusCode(299, new { Message = "Người dùng đã biểu quyết" });
                }
            }

            var i = 0;
            Guid id = Guid.NewGuid();
            DateTime date = DateTime.Now;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_Insert", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Input parameters
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@voteid", SqlDbType.UniqueIdentifier).Value = model.VoteId == default ? (object)DBNull.Value : model.VoteId;
                        cmd.Parameters.Add("@iscreatedbyad", SqlDbType.Bit).Value = model.IsCreatedByAd;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();

                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }
            return Ok(new { status = true, message = "Thêm nội dung biểu quyết thành công" });

        }

        [HttpPost("Inserts")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.VOTED)]
        public IActionResult Inserts(List<Meeting_Voted_Insert> model)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            DateTime date = DateTime.Now;
            try
            {
                List<Meeting_Voted> meeting_Voteds = new List<Meeting_Voted>();
                foreach (var item in model)
                {
                    Meeting_Voted model1 = new Meeting_Voted();
                    model1.Title = item.Title;
                    model1.VoteId = item.VoteId;
                    model1.IsCreatedByAd = item.IsCreatedByAd;
                    model1.Id = Guid.NewGuid();
                    model1.CreatedDate = date;
                    model1.CreatedBy = user;
                    model1.IsCreatedByAd = item.IsCreatedByAd;
                    meeting_Voteds.Add(model1);
                }
                _datacontext.Meeting_Voted.AddRange(meeting_Voteds);
                _datacontext.SaveChanges();
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }
            return Ok(new { status = true, data = model, message = "Thêm nội dung biểu quyết thành công" });

        }


        [HttpPost("InsertList")]
        [Authorize]
        public IActionResult InsertListVoted(List<Meeting_Voted_Insert> models)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var ma_tochuc = _context.thong_tin_nguoi_dung
             .Where(x => x.ten_dangnhap == user_current)
             .Select(x => x.ma_tochuc)
             .FirstOrDefault();
            var i = 0;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            foreach (var model in models)
            {
                var votes = new MeetingVotesContext().GetById(model.VoteId);
                var check_end = new MeetingVotesContext().GetById(model.VoteId);
                if (check_end?.Id == Guid.Empty) return StatusCode(299, new { status = false, message = "Biểu quyết không tồn tại" });
                var schedule = new MeetingScheduleContext().GetById(_context, votes.ScheduleId);
                var voted = new MeetingVotedContext().GetByVotedId(model.VoteId);
                if (model.IsCreatedByAd == true)
                {
                    foreach (var c in voted)
                    {
                        if (c.Title == model.Title)
                        {
                            return StatusCode(299, new { status = false, message = "Nội dung biểu quyết đã tồn tại" });
                        }
                    }
                }

                if (model.IsCreatedByAd == true)
                {
                    phan_quyen_vai_tro_nguoi_dung phan_quyen = _context.phan_quyen_vai_tro_nguoi_dung.Where(X => X.ten_dangnhap_nguoidung == user_current).FirstOrDefault();

                    if (phan_quyen == null)
                    {
                        return StatusCode(299, new { status = false, message = "Tài khoản không có quyền" });
                    }

                    List<string> vaitros = JsonConvert.DeserializeObject<List<string>>(phan_quyen.ma_ds_vaitros);

                    List<string> ds_chuc_nang = new List<string>();

                    foreach (var c in vaitros)
                    {
                        var quyen = _context.vai_tro_nguoi_dung
                            .Where(x => x.ma == c)
                            .FirstOrDefault();
                        List<string> chuc_nangs = JsonConvert.DeserializeObject<List<string>>(quyen.ma_ds_thong_tin_chuc_nangs);
                        foreach (var b in chuc_nangs)
                        {
                            var mota_chucnang = _context.thong_tin_chuc_nang.Where(x => x.ma == b).Select(x => x.mota).FirstOrDefault();
                            ds_chuc_nang.Add(mota_chucnang);
                        }
                    }


                    if (user != schedule.ChairMan && user != schedule.SharedRole && !ds_chuc_nang.Contains("Schedule"))
                    {
                        return StatusCode(299, new { status = false, message = "Tài khoản không có quyền" });
                    }




                }
                DateTime date = DateTime.Now;

                try
                {
                    using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                    {
                        using (SqlCommand cmd = new SqlCommand("Meeting_Voted_Insert", con))
                        {
                            cmd.CommandType = CommandType.StoredProcedure;

                            // Input parameters
                            cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title ?? (object)DBNull.Value;
                            cmd.Parameters.Add("@voteid", SqlDbType.UniqueIdentifier).Value = model.VoteId == default ? (object)DBNull.Value : model.VoteId;
                            cmd.Parameters.Add("@iscreatedbyad", SqlDbType.Bit).Value = model.IsCreatedByAd;
                            cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = DateTime.Now;
                            cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = user;
                            con.Open();
                            i = cmd.ExecuteNonQuery();

                        }
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { status = false, message = ex.Message });
                }

            }
            if (i < 0)
            {
                return StatusCode(299, new { status = false, message = "Thêm biểu quyết không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Thêm biểu quyết thành công " });
            }
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("Update")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.VOTES)]
        public IActionResult Update(Guid id, Meeting_Voted_Update model)
        {

            var i = 0;

            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }

            try
            {
                using (Microsoft.Data.SqlClient.SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@voteid", SqlDbType.UniqueIdentifier).Value = model.VoteId == default ? DBNull.Value : model.VoteId;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }
            if (i < 0)
            {
                return StatusCode(299, new { status = false, message = "Chỉnh sửa biểu quyết không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Chỉnh sửa biểu quyết thành công " });
            }
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("Remove")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.VOTED)]
        public IActionResult Remove(Guid id)
        {
            var i = 0;
            try
            {
                var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
                var don_vi = _context.thong_tin_nguoi_dung
                     .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                     .Select(x => x.ma_tochuc)
                     .FirstOrDefault();
                var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                if (don_vi == null)
                {
                    return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
                }
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_Remove", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Xóa biểu quyết không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa biểu quyết thành công" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        /// <summary>
        ///
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("RemoveByVoteId")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.VOTED)]
        public IActionResult RemoveByVoteId(Guid id)
        {
            var i = 0;
            try
            {
                var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
                var don_vi = _context.thong_tin_nguoi_dung
                     .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                     .Select(x => x.ma_tochuc)
                     .FirstOrDefault();
                var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                if (don_vi == null)
                {
                    return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
                }
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_Remove_By_VoteId", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        return Ok(new { data = i, message = i > 0 ? "Xóa thành công" : "Không xóa được dữ liệu" });
                    }
                }
            }
            catch (Exception ex)
            {
                return Ok(new { data = i, message = ex.ToString() });
            }
        }

        [HttpPost("Vote")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.VOTED)]
        public IActionResult Vote(List<string> model, Guid voteid)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var meeting_votes = new MeetingVotesContext().GetById(voteid);
            var meeting_member = new MeetingMemberContext().GetByScheduleId(meeting_votes.ScheduleId);
            var c = meeting_member.Where(x => x.UserId == user).FirstOrDefault();
            if (c == null)
            {
                return StatusCode(299, new { Message = "Phải là đại biểu tham gia mới được biểu quyết" });
            }
            var id = 0;
            var check_end = new MeetingVotesContext().GetById(voteid);
            if (check_end?.Id == Guid.Empty) return StatusCode(299, new { status = 299, message = "Biểu quyết không tồn tại" });
            if (check_end?.End == true) return StatusCode(299, new { status = 299, message = "Biểu quyết đã kết thúc" });
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_Delete_By_CreatedBy", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@voteid", SqlDbType.UniqueIdentifier).Value = voteid;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = user;
                        con.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
                foreach (var item in model)
                {
                    Meeting_Voted_Insert meeting_Voted_Insert = new Meeting_Voted_Insert();
                    meeting_Voted_Insert.Title = item;
                    meeting_Voted_Insert.VoteId = voteid;
                    meeting_Voted_Insert.CreatedDate = DateTime.Now;
                    meeting_Voted_Insert.CreatedBy = (int)user;
                    meeting_Voted_Insert.IsCreatedByAd = false;
                    Insert(meeting_Voted_Insert);
                }

            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }
            return Ok(new { data = id, message = "" });
        }

        [HttpPost("Restore")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.VOTED)]
        public IActionResult Restore(Guid id)
        {
            var i = 0;
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_Restore", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@modifiedDate", SqlDbType.Date).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Khôi phục nội dung không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Khôi phục nội dung thành công " });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }
    }
}