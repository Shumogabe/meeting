using Api;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using QTHT.Api.Controllers.Schedule;
using QTHT.Api.Helpers;
using QTHT.Api.Models;
using QTHT.Api.Models.database.Log;
using QTHT.Api.Models.database.Meeting;
using QTHT.Api.Models.database.Meeting.Option;
using QTHT.Api.Models.database.Meeting.Schedule;
using QTHT.Api.Models.database.Meeting.Server;
using QTHT.Api.Utils;
using System;
using System.Data;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using static QTHT.Api.Models.QTHT_HTT_Context;

namespace QTHT.Api.Controllers.MobileApi
{
    [Route("[controller]")]
    [Authorize]
    [ApiController]
    public class QuanLyLapLichController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _htt_context;

        public QuanLyLapLichController(IConfiguration configuration, QTHT_HTT_Context context, HTT_Context htt_context)
        {
            _htt_context = htt_context;
            _configuration = configuration;
            _context = context;
        }

        #region Meeting-Schedule

        /// <summary>
        /// Người quản lý họp trực tuyến có thể thêm lịch họp trên thiết bị di động, hệ thống thêm mới lịch họp trên thiết bị di động và thông báo thành công
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Trả ra thông báo thêm lịch họp thành công</returns>
        [HttpPost("them")]
        [Authorize]
        public async Task<IActionResult> Insert(Meeting_Schedule_Insert model)
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
            var id_matochuc = _context.thong_tin_don_vi.Where(x => x.ma == ma_tochuc)
                .Select(x => x.Id).FirstOrDefault();

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            DateTime date = DateTime.Now;
            var checkRoomName = new MeetingScheduleContext().GetByRoomName(_context, model.RoomName);

            if (checkRoomName.Id != Guid.Empty)
            {
                return StatusCode(299, new { status = false, message = "Tên phòng họp đã tồn tại" });
            }


            var timeEnd = new MeetingOptionContext().GetByKey("EndTime");

            var exp = new DateTimeOffset(model.EndTime).ToUnixTimeSeconds();

            if (model.ServerId == 0)
            {
                var server_id_default = new MeetingServerContext().GetByDefault();
                if (server_id_default.Id != 0)
                {
                    model.ServerId = server_id_default.Id;
                }
            }

            JitAuth jitAuth = new JitAuth();
            jitAuth.moderator = "false";
            jitAuth.room = model.RoomName;
            jitAuth.exp = exp.ToString();
            jitAuth.server = model.ServerId;

            var token = "";

            if (user_current != null)
            {
                token = new MeetingRoomController(_configuration).Token(jitAuth);
            }
            Guid newId = Guid.Empty;

            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Insert", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = (object)model.Title ?? DBNull.Value;
                        cmd.Parameters.Add("@content", SqlDbType.NText).Value = (object)model.Content ?? DBNull.Value;
                        cmd.Parameters.Add("@starttime", SqlDbType.DateTime).Value = model.StartTime == default ? (object)DBNull.Value : model.StartTime;
                        cmd.Parameters.Add("@endtime", SqlDbType.DateTime).Value = model.EndTime == default ? (object)DBNull.Value : model.EndTime;
                        cmd.Parameters.Add("@chairman", SqlDbType.Int).Value = model.ChairMan == 0 ? user : model.ChairMan;
                        cmd.Parameters.Add("@roomname", SqlDbType.NVarChar).Value = (object)model.RoomName ?? DBNull.Value;
                        cmd.Parameters.Add("@place", SqlDbType.NVarChar).Value = (object)model.Place ?? DBNull.Value;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = model.Status == 0 ? (object)DBNull.Value : model.Status;
                        cmd.Parameters.Add("@start", SqlDbType.Bit).Value = model.Start;
                        cmd.Parameters.Add("@token", SqlDbType.NVarChar).Value = (object)token ?? DBNull.Value;
                        cmd.Parameters.Add("@serverid", SqlDbType.Int).Value = model.ServerId == 0 ? (object)DBNull.Value : model.ServerId;
                        cmd.Parameters.Add("@typeid", SqlDbType.Int).Value = model.TypeId == 0 ? (object)DBNull.Value : model.TypeId;
                        cmd.Parameters.Add("@sharedrole", SqlDbType.Int).Value = model.SharedRole == 0 ? (object)DBNull.Value : model.SharedRole;
                        cmd.Parameters.Add("@password", SqlDbType.NVarChar).Value = (object)model.Password ?? DBNull.Value;
                        cmd.Parameters.Add("@islobby", SqlDbType.Bit).Value = model.IsPublished;
                        cmd.Parameters.Add("@ispublished", SqlDbType.Bit).Value = model.IsPublished;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@don_vi", SqlDbType.BigInt).Value = Convert.ToInt64(id_matochuc);

                        var newIdParam = new SqlParameter("@newId", SqlDbType.UniqueIdentifier)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(newIdParam);

                        con.Open();
                        cmd.ExecuteNonQuery();

                        // Get the new Id from the output parameter
                        newId = (Guid)newIdParam.Value;

                        log_ql_laplich log = new log_ql_laplich
                        {
                            ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now)),
                            tai_khoan = user_current,
                            noi_dung = user_current + " thực hiện thêm mới lịch họp: " + model.RoomName,
                            ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString(),
                            thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now),
                            chuc_nang = "Quản lý lịch họp",
                            loai_hoatdong = "Thêm mới"
                        };
                        _context.log_ql_laplich.Add(log);
                        await _context.SaveChangesAsync();
                    }
                }
                return Ok(new { status = true, message = "Thêm lịch thành công", data = newId });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }
        }


        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn sửa lịch họp trên thiết bị di động, hệ thống sửa lịch họp trên thiết bị di động và thông báo thành công	
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns>Trả ra thông báo thành công</returns>
        [HttpPut("chinhsua")]
        [Authorize]
        public IActionResult Update(Meeting_Schedule_Update model)
        {
            var meeting_schedule = new MeetingScheduleContext().GetById(_context, model.id);
            if (meeting_schedule == null)
            {
                return StatusCode(299, new { status = false, message = "Không có dữ liệu thông tin lịch họp" });
            }
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
            var id_matochuc = _context.thong_tin_don_vi.Where(x => x.ma == ma_tochuc)
                .Select(x => x.Id).FirstOrDefault();

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            var i = 0;
            DateTime date = DateTime.Now;
            try
            {

                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Update", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = model.id;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@content", SqlDbType.NText).Value = model.Content == null ? DBNull.Value : model.Content;
                        cmd.Parameters.Add("@starttime", SqlDbType.DateTime).Value = model.StartTime == default ? DBNull.Value : model.StartTime;
                        cmd.Parameters.Add("@endtime", SqlDbType.DateTime).Value = model.EndTime == default ? DBNull.Value : model.EndTime;
                        cmd.Parameters.Add("@chairman", SqlDbType.Int).Value = model.ChairMan == 0 ? user : model.ChairMan;
                        cmd.Parameters.Add("@roomname", SqlDbType.NVarChar).Value = model.RoomName == null ? DBNull.Value : model.RoomName;
                        cmd.Parameters.Add("@place", SqlDbType.NVarChar).Value = model.Place == null ? DBNull.Value : model.Place;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = model.Status == 0 ? DBNull.Value : model.Status;
                        cmd.Parameters.Add("@start", SqlDbType.Bit).Value = model.Start == false ? DBNull.Value : model.Start;
                        cmd.Parameters.Add("@token", SqlDbType.NVarChar).Value = model.Token == null ? DBNull.Value : model.Token;
                        cmd.Parameters.Add("@serverid", SqlDbType.Int).Value = model.ServerId == 0 ? DBNull.Value : model.ServerId;
                        cmd.Parameters.Add("@typeid", SqlDbType.Int).Value = model.TypeId == 0 ? DBNull.Value : model.TypeId;
                        cmd.Parameters.Add("@sharedrole", SqlDbType.Int).Value = model.SharedRole == 0 ? DBNull.Value : model.SharedRole;
                        cmd.Parameters.Add("@password", SqlDbType.NVarChar).Value = model.Password == null ? DBNull.Value : model.Password;
                        cmd.Parameters.Add("@islobby", SqlDbType.Bit).Value = model.IsPublished == default ? DBNull.Value : model.IsPublished;
                        cmd.Parameters.Add("@ispublished", SqlDbType.Bit).Value = model.IsPublished == default ? DBNull.Value : model.IsPublished;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = date;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@don_vi", SqlDbType.BigInt).Value = Convert.ToInt64(id_matochuc);
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i != -1)
                        {
                            log_ql_laplich log = new log_ql_laplich();
                            log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                            log.tai_khoan = user_current;
                            log.noi_dung = user_current + "thực hiện chỉnh sửa thông tin lịch họp" + model.RoomName;
                            log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                            log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                            log.chuc_nang = "Quản lí lịch họp ";
                            log.loai_hoatdong = "Chỉnh sửa";
                            _context.log_ql_laplich.Add(log);
                            _context.SaveChanges();
                        }
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }
            if (i < 0)
            {
                return StatusCode(299, new { status = false, message = "Cập nhật thông tin lịch họp không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Cập nhật thông tin lịch họp thành công" });
            }

        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn xóa lịch họp trên thiết bị di động, hệ thống xóa lịch họp trên thiết bị di động và thông báo thành công	
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns>Thông báo xóa thành công </returns>
        [HttpDelete("xoa")]
        [Authorize]

        public IActionResult Delete(Guid id)
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
            var meeting_schedule = new MeetingScheduleContext().GetById(_context, id);
            if (meeting_schedule.Title == null)
            {
                return NotFound(new { status = false, message = "Không tìm thấy lịch họp" });
            }

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Delete", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@deleteddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@deletedby", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i != -1)
                        {
                            log_ql_laplich log = new log_ql_laplich();
                            log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                            log.tai_khoan = user_current;
                            log.noi_dung = user_current + "thực hiện xóa lịch họp" + meeting_schedule.RoomName;
                            log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                            log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                            log.chuc_nang = "Quản lí lịch họp ";
                            log.loai_hoatdong = "Xóa";
                            _context.log_ql_laplich.Add(log);
                            _context.SaveChanges();
                        }
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Xóa lịch họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa lịch họp thành công" });
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpDelete("xoahoantoan")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.SCHEDULE)]
        public IActionResult Remove(Guid id)
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var meetingSchedule = new MeetingScheduleContext().GetById(_context, id);
            if (meetingSchedule.Id == Guid.Empty) return StatusCode(299, new { status = 299, Message = "Không tìm thấy thông tin lịch họp" });

            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Remove", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        con.Open();
                        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                        i = cmd.ExecuteNonQuery();
                        if (i != -1)
                        {
                            log_ql_laplich log = new log_ql_laplich();
                            log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                            log.tai_khoan = user_current;
                            log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                            log.loai_hoatdong = "Remove";
                            log.ip_may = ipAddress;
                            log.loai_hoatdong = "Xóa vĩnh viễn";

                        }
                    }
                }
                if (i < 0)
                {
                    return StatusCode(299, new { status = false, message = "Xóa lịch họp vĩnh viễn không thành công" });
                }
                else
                {
                    return StatusCode(200, new { status = true, message = "Xóa lịch họp vĩnh viễn thành công" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, data = i, message = ex.ToString() });
            }
        }

        [HttpGet("danhsach")]
        [Authorize]
        public async Task<IActionResult> GetList(string search, DateTime dateFrom, DateTime dateTo, int? status, bool? start, bool? isdeleted, int pageNumber = 1, int pageSize = 10)
        {
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
                var id_matochuc = _context.thong_tin_don_vi
                    .Where(x => x.ma == ma_tochuc)
                    .Select(x => x.Id)
                    .FirstOrDefault();
                var user_id = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
                var data = new MeetingScheduleContext().GetByUserIdFilter(_context, pageNumber, pageSize, user_id, id_matochuc, search, dateFrom, dateTo, status, start, isdeleted);
                return Ok(new { status = true, data = data });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn xem thông tin lịch họp trên thiết bị di động, hệ thống lấy thông tin chi tiết lịch họp và hiển thị thông tin	
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("thongtin")]
        [Authorize]
        public async Task<IActionResult> GetById(Guid id)
        {
            var meeting_schedule = new MeetingScheduleContext().GetById(_context, id);
            if (meeting_schedule.Title == null)
            {
                return NotFound(new { status = false, message = "Không tìm thấy lịch họp" });
            }
            return Ok(new { status = true, data = meeting_schedule });
        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn xác nhận lịch họp trên thiết bị di động, hệ thống cập nhật trạng thái xác nhận lịch họp và thông báo thành công	
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns>Trả về thông báo xác nhận thành công</returns>
        [HttpPost("xacnhan")]
        public IActionResult ConfirmMetting(Guid id)
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
            var meeting_schedule = new MeetingScheduleContext().GetById(_context, id);
            if (meeting_schedule.Title == null)
            {
                return NotFound(new { status = false, message = "Không tìm thấy lịch họp" });
            }
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            DateTime date = DateTime.Now;
            var i = 0;
            int confirm = 2;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Set_Status", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = 2;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = date;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i != -1)
                        {
                            log_ql_laplich log = new log_ql_laplich();
                            log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                            log.tai_khoan = user_current;
                            log.noi_dung = user_current + "thực hiện xác nhận lịch họp" + meeting_schedule.RoomName;
                            log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                            log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                            log.chuc_nang = "Quản lí lịch họp ";
                            log.loai_hoatdong = "Xác nhận";
                            _context.log_ql_laplich.Add(log);
                            _context.SaveChanges();
                        }
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Xác nhận lịch họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xác nhận lịch họp thành công" });
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
        /// Người quản lý họp trực tuyến có thể chọn hủy xác nhận lịch họp trên thiết bị di động, hệ thống cập nhật trạng thái hủy xác nhận lịch họp và thông báo thành công	
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns>Trả về thông báo xác nhận hủy lịch họp thành công</returns>
        [HttpPost("huyxacnhan")]
        public IActionResult CancelMetting(Guid id)
        {
            var i = 0;
            int cancel = 1;
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
            var meeting_schedule = new MeetingScheduleContext().GetById(_context, id);
            DateTime date = DateTime.Now;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Set_Status", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = 1;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = date;
                        con.Open();
                        if (i != -1)
                        {
                            log_ql_laplich log = new log_ql_laplich();
                            log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                            log.tai_khoan = user_current;
                            log.noi_dung = user_current + "thực hiện hủy xác nhận lịch họp" + meeting_schedule.RoomName;
                            log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                            log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                            log.chuc_nang = "Quản lí lịch họp ";
                            log.loai_hoatdong = "Hủy xác nhận";
                            _context.log_ql_laplich.Add(log);
                            _context.SaveChanges();
                        }
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Hủy xác nhận lịch họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Hủy xác nhận lịch họp thành công" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { data = id, message = ex.Message });
            }
        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn xem danh sách lịch họp trên thiết bị di động đã xóa, hệ thống lấy danh sách lịch họp trên thiết bị di động đã xóa và hiển thị danh sách lịch họp trên thiết bị di động đã xóa
        /// </summary>
        /// <returns>Trả về danh sách duộc  hợp đã bị xóa</returns>
        [HttpGet("danhsachdaxoa")]
        public IActionResult GetAll_Deleted()
        {
            return Ok(new { status = true, data = new MeetingScheduleContext().GetAll_Deleted(_context) });
        }

        [HttpGet("chitietphonghop")]
        [AllowAnonymous]
        public IActionResult GetByRoomName(string roomName)
        {
            return Ok(new { status = true, data = new MeetingScheduleContext().GetByRoomName(_context, roomName) });
        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn khôi phục lịch họp trên thiết bị di động, hệ thống khôi phục lịch họp trên thiết bị di động và thông báo thành công
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns>Trả về thông báo thành công</returns>
        [HttpPost("khoiphuc")]
        public IActionResult Restore(Guid id)
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
            var meeting_schedule = new MeetingScheduleContext().GetById(_context, id);
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            DateTime date = DateTime.Now;
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Restore", con))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = date;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i != -1)
                        {
                            log_ql_laplich log = new log_ql_laplich();
                            log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                            log.tai_khoan = user_current;
                            log.noi_dung = user_current + "thực hiện khôi phục lịch họp" + meeting_schedule.RoomName;
                            log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                            log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                            log.chuc_nang = "Quản lí lịch họp ";
                            log.loai_hoatdong = "Khôi phục";
                            _context.log_ql_laplich.Add(log);
                            _context.SaveChanges();
                        }
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Khôi phục lịch họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Khôi phục lịch họp thành công" });
                        }

                    }
                }
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpGet("danhsachserver")]
        [AllowAnonymous]
        public IActionResult ListServer()
        {
            var data = new MeetingServerContext().GetAll();
            return Ok(new { status = true, data = data });
        }

        [HttpGet("thongtinnguoidung")]
        [AllowAnonymous]
        public IActionResult ThongTinNguoiDung(string search, int pageSize = 10, int pageNumber = 1)
        {
            var query = _context.thong_tin_nguoi_dung.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(x => x.ten_dangnhap.Contains(search) || x.ten_day_du.Contains(search));
            }

            var totalRecord = query.Count();

            var data = query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            foreach (var record in data)
            {
                if (record != null && !string.IsNullOrEmpty(record.ma_tochuc) && int.TryParse(record.ma_tochuc, out int maTochucId))
                {
                    record.thong_tin_don_vi = _context.thong_tin_don_vi.Find(maTochucId);
                }
                if (record != null && !string.IsNullOrEmpty(record.ma_chucvu) && int.TryParse(record.ma_chucvu, out int maChucvuId))
                {
                    record.thong_tin_don_vi = _context.thong_tin_don_vi.Find(maChucvuId);
                }
            }

            return Ok(new
            {
                status = true,
                data = data
            });
        }


        ///// <summary>
        ///// Tìm kiếm biểu quyểt
        ///// </summary>
        ///// <param name="id"></param>
        ///// <param name="title"></param>
        ///// <returns></returns>
        //[HttpGet("GetByVoteIdVoteTitle")]
        //[ClaimRequirement(BaseRole.READ, ModuleHelper.VOTED)]
        //public IActionResult GetByVoteIdVoteTitle(int id, string title)
        //{
        //    return Ok(new { data = new MeetingVotedContext().GetByVoteIdVoteTitle(id, title) });
        //}
        ///// <summary>
        ///// Lấy ra danh sách thông tin phòng họp dựa theo filter
        ///// </summary>
        ///// <param name="create"></param>
        ///// <param name="search"></param>
        ///// <param name="dateFrom"></param>
        ///// <param name="dateTo"></param>
        ///// <param name="status"></param>
        ///// <param name="start"></param>
        ///// <param name="isdeleted"></param>
        ///// <returns>danh sách phòng họp theo yêu cầu </returns>
        //[HttpGet("GetByUserId")]
        //[ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        //public IActionResult GetByUserId(int create, string search, DateTime dateFrom, DateTime dateTo, int status, bool start, bool isdeleted)
        //{
        //    return Ok(new { data = new MeetingScheduleContext().GetByUserId(create, search, dateFrom, dateTo, status, start, isdeleted) });
        //}

        //[HttpGet("GetByUserIdDay")]
        //[ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        //public IActionResult GetByUserIdDay(int create, string search, DateTime day)
        //{
        //    return Ok(new { data = new MeetingScheduleContext().GetByUserIdDay(create, search, day) });
        //}
        #endregion
    }
}
