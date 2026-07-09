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
using System.Security.Claims;
using static QTHT.Api.Models.QTHT_HTT_Context;

namespace QTHT.Api.Controllers.MobileApi
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class DanhMucBieuQuyetController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _datacontext;

        public DanhMucBieuQuyetController(IConfiguration configuration, QTHT_HTT_Context context, HTT_Context datacontext)
        {
            _datacontext = datacontext;
            _configuration = configuration;
            _context = context;
        }

        #region

        /// <summary>
        /// Người quản lý họp trực tuyến có thể thêm danh mục biểu quyết trên thiết bị di động, hệ thống thêm mới danh mục biểu quyết và thông báo thành công	 
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Thông báo thêm mới danh mục biểu quyết thành công </returns>
        [HttpPost("them")]
        [Authorize]
        public IActionResult Insert(Meeting_Votes_Insert model)
        {

            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            var schedule = new MeetingScheduleContext().GetById(_context, model.ScheduleId);

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
            var meeting_votes = new MeetingVotesContext().GetByScheduleId(model.ScheduleId);
            foreach (var c in meeting_votes)
            {
                if (c.Title == model.Title)
                {
                    return StatusCode(299, new { status = false, message = "Tiêu đề đã tồn tại" });
                }
            }


            Guid newId = Guid.Empty;  // To store the new Id
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;

                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = 0;
                        cmd.Parameters.Add("@type", SqlDbType.Bit).Value = model.Type;
                        cmd.Parameters.Add("@end", SqlDbType.Bit).Value = model.End;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = user;

                        // Add output parameter for the new Id
                        SqlParameter outputIdParam = new SqlParameter("@newId", SqlDbType.UniqueIdentifier)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(outputIdParam);

                        con.Open();
                        cmd.ExecuteNonQuery();

                        // Retrieve the output value (new Id)
                        newId = (Guid)outputIdParam.Value;
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }

            return Ok(new { status = true, data = newId, message = "Thêm nội dung thành công" });
        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn sửa danh mục biểu quyết trên thiết bị di động, hệ thống sửa danh mục biểu quyết và thông báo thành công
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns>Trả về thông báo chinh sửa danh mục biểu quyết thành công</returns>
        [HttpPut("chinhsua")]
        [Authorize]
        public IActionResult Update(Meeting_Votes_Update model)
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            var schedule = new MeetingScheduleContext().GetById(_context, model.ScheduleId);
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
            var i = 0;
            DateTime date = DateTime.Now;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = model.Id;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = model.Status == default ? DBNull.Value : model.Status;
                        cmd.Parameters.Add("@type", SqlDbType.Bit).Value = model.Type;
                        cmd.Parameters.Add("@end", SqlDbType.Bit).Value = model.End;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = date;
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
                return StatusCode(299, new { status = false, message = "Chỉnh sửa nội dung không thành công " });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Chỉnh sửa nội dung thành công " });
            }

        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn xóa danh mục biểu quyết trên thiết bị di động, hệ thống xóa danh mục biểu quyết và thông báo thành công
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Thông báo xóa danh mục biểu quyết thành công </returns>
        [HttpDelete("xoa")]
        [Authorize]
        public IActionResult Remove(Guid id)
        {
            var i = 0;
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_Delete", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Không xóa được biểu quyết " });
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
        /// Người quản lý họp trực tuyến có thể chọn xem thông tin danh mục biểu quyết trên thiết bị di động, hệ thống lấy thông tin chi tiết danh mục biểu quyết và hiển thị thông tin
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Thông tin danh mục biểu quyết</returns>
        [HttpGet("xemchitiet")]
        public IActionResult GetVoteById(Guid id)
        {
            var meeting_votes = new MeetingVotesContext().GetById(id);

            return Ok(new { status = true, data = new MeetingVotesContext().GetById(id) });
        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn xem danh sách danh mục biểu quyết trên thiết bị di động, hệ thống lấy danh sách danh mục biểu quyết và hiển thị danh sách danh mục biểu quyết trên mobile
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Danh sách danh mục biểu quyết</returns>
        [HttpGet("danhsach")]
        public IActionResult GetByScheduleId(Guid id)
        {
            return Ok(new { status = true, data = new MeetingVotesContext().GetByScheduleId(id) });
        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn xác nhận danh mục biểu quyết trên thiết bị di động, hệ thống cập nhật trạng thái duyệt danh mục biểu quyết và thông báo thành công
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns>Thông báo trạng thái duyệt thành công </returns>
        [HttpPost("xacnhan")]
        public IActionResult ConfirmVotes(Guid id)
        {
            bool vote = true;
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var i = 0;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            try
            {

                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_Status_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = vote;
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
                return StatusCode(299, new { status = false, message = "Không xác nhận được nội dung" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Xác nhận thành công" });
            }
        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn hủy xác nhận danh mục biểu quyết trên thiết bị di động, hệ thống cập nhật trạng thái hủy duyệt danh mục biểu quyết và thông báo thành công	
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns>Thông báo xác nhận hủy thành công </returns>
        [HttpPost("huyxacnhan")]
        public IActionResult CancelVotes(Guid id)
        {
            var i = 0;
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var userid = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.id)
                 .FirstOrDefault();
            bool vote = false;

            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_Status_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = vote;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = userid;
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
                return StatusCode(299, new { status = false, message = "Không hủy xác nhận được nội dung" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Xác nhận hủy thành công" });
            }
        }

        /// <summary>
        ///Người quản lý họp trực tuyến có thể chọn phân trang danh mục đã xác nhận trên thiết bị di động, hệ thống phân trang danh sách danh mục biểu quyết đã duyệt và hiển thị danh sách	 đã duyệt trên mobile
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns>danh mục đã được xác nhận</returns>
        [HttpGet("danhmucxacnhan")]
        [Authorize]
        public IActionResult GetbyStatus(Guid? ScheduleId, DateTime? dateFrom, DateTime? dateTo, int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                var query = _datacontext.Meeting_Votes.Where(x => x.IsDeleted == false && x.Status == true).OrderBy(x => x.CreatedDate).AsQueryable();

                if (!ScheduleId.Equals(Guid.Empty) && ScheduleId.HasValue)
                {
                    query = query.Where(x => x.ScheduleId == ScheduleId);
                }
                if (dateFrom.HasValue)
                {
                    query = query.Where(x => x.CreatedDate >= dateFrom.Value);
                }

                if (dateTo.HasValue)
                {
                    query = query.Where(x => x.CreatedDate <= dateTo.Value);
                }

                var pagedData = query
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .Select(c => new
                    {
                        c.Id,
                        c.Title,
                        c.ScheduleId,
                        c.Status,
                        c.Type,
                        c.End,
                        c.CreatedDate,
                        c.CreatedBy,
                        c.ModifiedDate,
                        c.ModifiedBy,
                        c.DeletedDate,
                        c.DeletedBy,
                        c.IsDeleted,
                        Meetingvoted = new MeetingVotedContext().GetByVoteId(c.Id)
                    })
            .ToList();

                // Return paged data along with pagination metadata
                return Ok(new { status = true, data = pagedData });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpGet("danhsachphonghop")]
        public IActionResult ListMeetingSchedule(DateTime? dateFrom, DateTime? dateTo, int pageSize = 10, int pageNumber = 1)
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
            var id_tochuc = _context.thong_tin_don_vi.Where(x => x.ma == ma_tochuc).Select(x => x.Id).FirstOrDefault();
            List<Meeting_Schedule> list = new List<Meeting_Schedule>();
            List<Meeting_Votes> meeting_votes = _datacontext.Meeting_Votes.Where(x => x.IsDeleted == false && x.Status == true).ToList();
            foreach (var c in meeting_votes)
            {
                var meeting_schedule = new MeetingScheduleContext().GetById(_context, c.ScheduleId);
                if (meeting_schedule != null)
                {
                    list.Add(meeting_schedule);
                }
            }
            var datalist = list
                .Where(x => x.don_vi == id_tochuc)
                .OrderByDescending(x => x.CreatedDate)
                .GroupBy(x => x.Id)
                .Select(g => g.First())
                .ToList();

            if (dateFrom.HasValue)
            {
                datalist = list.Where(x => x.don_vi == id_tochuc && x.CreatedDate >= dateFrom).OrderByDescending(x => x.CreatedDate).ToList();
            }
            if (dateTo.HasValue)
            {
                datalist = list.Where(x => x.don_vi == id_tochuc && x.CreatedDate <= dateFrom).OrderByDescending(x => x.CreatedDate).ToList();
            }
            int totalCount = datalist.Count();
            var data = datalist.Skip((pageNumber - 1) * pageSize)
                .Take(pageSize).ToList();
            return Ok(new { status = true, data = data });

        }

        #endregion
    }
}