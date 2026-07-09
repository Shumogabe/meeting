using Api;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using QTHT.Api.Models;
using QTHT.Api.Models.database;
using QTHT.Api.Models.database.Meeting.Schedule;
using QTHT.Api.Models.database.Meeting.Voted;
using QTHT.Api.Models.database.Meeting.Votes;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Security.Claims;
using static QTHT.Api.Models.QTHT_HTT_Context;

namespace QTHT.Api.Controllers.MobileApi
{
    [Route("[controller]")]
    [Authorize]
    [ApiController]
    public class BieuQuyetController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _datacontext;

        public BieuQuyetController(IConfiguration configuration, QTHT_HTT_Context context, HTT_Context datacontext)
        {
            _datacontext = datacontext;
            _configuration = configuration;
            _context = context;
        }

        #region

        /// <summary>
        /// Người chủ trì có thể chọn kích hoạt biểu quyết trên thiết bị di động, hệ thống cập nhật trạng thái đang thực hiện và trả về thông báo thành công
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("kichhoat")]
        [Authorize]
        public IActionResult KichHoat([FromQuery] Guid id)
        {
            var i = 0;
            bool end = false;
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_End_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@end", SqlDbType.Bit).Value = end;
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
                return StatusCode(299, new { status = false, message = "Cập nhật không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Cập nhật thành công" });
            }
        }

        /// <summary>
        /// Người chủ trì có thể chọn kết thúc biểu quyết trên thiết bị di động, hệ thống cập nhật trạng thái đã kết thúc và trả về thông báo thành công
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("ketthuc")]
        [Authorize]
        public IActionResult KetThuc(Guid id)
        {
            var i = 0;
            bool end = true;
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_End_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@end", SqlDbType.Bit).Value = end;
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
                return StatusCode(299, new { status = false, message = "Cập nhật không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Cập nhật thành công" });
            }
        }

        /// <summary>
        /// Người chủ trì, Đại biểu có thể xem danh sách chờ biểu quyết trên thiết bị di động, hệ thống lấy danh sách chờ biểu quyết và hiển thị  danh sách chơ biểu quyết
        /// </summary>
        /// <param name="voteId">Id của danh mục biểu quyết </param>
        /// <returns>Trả về danh sách chờ biểu quyết </returns>
        [HttpGet("danhsachchobieuquyet")]
        [Authorize]
        public IActionResult GetWaitingVoteList(Guid voteId)
        {
            List<Meeting_Votes> items = new List<Meeting_Votes>();
            bool end = false;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_GetBy_End", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@End", SqlDbType.Bit).Value = end;
                        cmd.Parameters.Add("@voteId", SqlDbType.UniqueIdentifier).Value = voteId;

                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            Meeting_Votes item = new Meeting_Votes();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Status = dr.IsDBNull("Status") == true ? default : (bool)dr["Status"];
                            item.End = dr.IsDBNull("End") == true ? default : (bool)dr["End"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.Meetingvoted = new MeetingVotedContext().GetByVoteId(item.Id);
                            items.Add(item);

                        }
                        dr.Close();
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }
            return Ok(new { status = true, data = items });
        }

        /// <summary>
        /// Người chủ trì, Đại biểu có thể xem danh sách lựa chọn biểu quyết trên thiết bị di động, hệ thống lấy danh sách lựa chọn và hiển thị danh sách lựa chọn
        /// </summary>
        /// <param name="voteid"></param>
        /// <returns></returns>
        [HttpGet("danhsachluachonbieuquyet")]
        public IActionResult GetByVoteId(Guid voteid)
        {
            return Ok(new { status = true, data = new MeetingVotedContext().GetByVoteId(voteid) });
        }

        /// <summary>
        /// Người chủ trì, Đại biểu có thể chọn biểu quyết trên thiết bị di động, hệ thống cập nhật tình trạng biểu quyết và thông báo thành công
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Trả về thông báo thành công</returns>
        [HttpPost("chonbieuquyet")]
        [Authorize]
        public IActionResult Insert(Meeting_Voted_Insert model)
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var ma_tochuc = _context.thong_tin_nguoi_dung
             .Where(x => x.ten_dangnhap == user_current)
             .Select(x => x.ma_tochuc)
             .FirstOrDefault();

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();

            var votes = new MeetingVotesContext().GetById(model.VoteId);
            var check_end = new MeetingVotesContext().GetById(model.VoteId);
            if (check_end?.Id == Guid.Empty) return StatusCode(299, new { status = false, message = "Biểu quyết không tồn tại" });
            if (check_end?.End == true) return StatusCode(299, new { status = false, message = "Biểu quyết đã kết thúc" });
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
            using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("Meeting_Voted_Delete_By_CreatedBy", con))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add("@voteid", SqlDbType.UniqueIdentifier).Value = model.VoteId;
                    cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = user;
                    con.Open();
                    cmd.ExecuteNonQuery();
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

            var i = 0;
            DateTime date = DateTime.Now;
            Guid id = Guid.NewGuid();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_Insert_Mobile", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Input parameters
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@voteid", SqlDbType.UniqueIdentifier).Value = model.VoteId == default ? (object)DBNull.Value : model.VoteId;
                        cmd.Parameters.Add("@iscreatedbyad", SqlDbType.Bit).Value = model.IsCreatedByAd;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = user;

                        // Output parameter
                        var newIdParam = new SqlParameter("@newId", SqlDbType.UniqueIdentifier)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(newIdParam);

                        con.Open();
                        cmd.ExecuteNonQuery();

                        // Check for DBNull and retrieve the output parameter
                        var newId = newIdParam.Value == DBNull.Value ? Guid.Empty : (Guid)newIdParam.Value;

                        if (newId == Guid.Empty)
                        {
                            return StatusCode(299, new { status = false, message = "Không thể lấy ID mới từ cơ sở dữ liệu" });
                        }

                        return Ok(new { status = true, data = newId, message = "Thêm biểu quyết cuộc họp thành công" });
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
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("chinhsua")]
        [Authorize]
        public IActionResult Update(Meeting_Voted_Update model)
        {

            var i = 0;

            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var ma_tochuc = _context.thong_tin_nguoi_dung
             .Where(x => x.ten_dangnhap == user_current)
             .Select(x => x.ma_tochuc)
             .FirstOrDefault();

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();

            try
            {
                using (Microsoft.Data.SqlClient.SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Voted_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = model.Id;
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
        [HttpDelete("xoa")]
        [Authorize]
        public IActionResult Remove(Guid id)
        {
            var i = 0;
            try
            {
                var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
                var user_current = userCurrentClaim?.Value;

                if (string.IsNullOrEmpty(user_current))
                {
                    var usernameClaim = User?.FindFirst("username");
                    user_current = usernameClaim?.Value;
                }
                var ma_tochuc = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();

                var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();

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
                            return StatusCode(299, new { status = 299, message = "Xóa biểu quyết không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = 200, message = "Xóa biểu quyết thành công" });
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
        /// Người chủ trì, Đại biểu có thể xem kết quả biểu quyết trên thiết bị di động, hệ thống lấy kết quả biểu quyết và hiển thị kết quả biểu quyết
        /// </summary>
        /// <param name="voteid"></param>
        /// <returns></returns>
        [HttpGet("ketquabieuquyet")]
        public IActionResult GetByVoteIdChart(Guid voteid)
        {
            return Ok(new { status = true, data = new MeetingVotedContext().GetByVoteIdChart(voteid) });
        }

        [HttpGet("chitietbieuquyet")]
        public IActionResult GetByVotesId(Guid voteid)
        {
            return Ok(new { status = true, data = new MeetingVotedContext().GetByVotesId(voteid) });
        }

        #endregion
    }
}