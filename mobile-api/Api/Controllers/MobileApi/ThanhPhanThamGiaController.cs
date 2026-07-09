using Api;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using QTHT.Api.Extensions;
using QTHT.Api.Models;
using QTHT.Api.Models.database.Log;
using QTHT.Api.Models.database.Meeting.Member;
using QTHT.Api.Models.database.Meeting.Schedule;
using QTHT.Api.Services;
using QTHT.Api.Utils;
using System;
using System.Data;
using System.Linq;
using System.Net;
using System.Security.Claims;
using static QTHT.Api.Models.QTHT_HTT_Context;

namespace QTHT.Api.Controllers.MobileApi
{
    [Route("[controller]")]
    [Authorize]
    [ApiController]
    public class ThanhPhanThamGiaController : ControllerBase
    {

        private readonly HTT_Context _HTT_Context;
        private readonly QTHT_HTT_Context _context;
        public IConfiguration _config { get; }
        public ThanhPhanThamGiaController(HTT_Context HTT_Context, IConfiguration config, QTHT_HTT_Context context)
        {
            _config = config;
            _HTT_Context = HTT_Context;
            _context = context;
        }

        #region

        /// <summary>
        /// Người chủ trì, Thư ký, Đại biểu, Khách mời có thể tham gia phòng họp trực tuyến trên thiết bị đi động, hệ thống cập nhật vào danh sách trạng thái thành viên đã tham gia và hiển thị phòng họp trực tuyến
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Trả về thông báo đã thêm người dùng thành công</returns>
        [HttpPost("them")]
        [Authorize]
        public IActionResult Insert(Meeting_Member_Insert model)
        {

            var check_exist = new Meeting_Member();
            if (model.UserId != default)
            {
                check_exist = _HTT_Context.Meeting_Member.Where(x => x.UserId == model.UserId && x.ScheduleId == model.ScheduleId).FirstOrDefault();
                if (check_exist != null) return StatusCode(299, new { status = false, message = "Đại biểu đã tồn tại" });
            }
            else
            {
                check_exist = _HTT_Context.Meeting_Member.Where(x => x.Email == model.Email && x.ScheduleId == model.ScheduleId).FirstOrDefault();
                if (check_exist != null) return StatusCode(299, new { status = false, message = "Khách mời đã tồn tại" });
            }


            var user_guest = _context.thong_tin_nguoi_dung.Where(x => x.id == model.UserId).FirstOrDefault();

            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.Id).FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var setting = _context.tl_ch_thongbaolichhop.Where(x => x.tencauhinh == "ThongBaoLichHop_Schedule_Link").FirstOrDefault();
            var schedule = new MeetingScheduleContext().GetById(_context, model.ScheduleId);
            string schedule_link = setting.giatri + schedule.RoomName;
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Member_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@userid", SqlDbType.Int).Value = model.UserId == 0 ? DBNull.Value : model.UserId;
                        cmd.Parameters.Add("@email", SqlDbType.NVarChar).Value = model.Email == null ? DBNull.Value : model.Email;
                        cmd.Parameters.Add("@activated", SqlDbType.Bit).Value = model.Activated;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i != -1)
                        {
                            log_ql_laplich log = new log_ql_laplich();
                            log.ma = Util.ToID(user_current + "-" + (model.UserId != default ? model.UserId : model.Email) + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                            log.tai_khoan = user_current;
                            log.noi_dung = user_current + " thực hiện thêm mới đại biểu tham gia " + model.UserId;
                            log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                            log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                            log.chuc_nang = "Quản lí đại biểu tham gia";
                            log.loai_hoatdong = "Thêm mới";
                            _context.log_ql_laplich.Add(log);
                            _context.SaveChanges();

                        }
                    }
                }

                if (i != -1 && !string.IsNullOrEmpty(model.Email))
                {
                    EmailSender sender = new EmailSender();
                    EmailSenderC senderC = new EmailSenderC(_HTT_Context, _config);
                    email_config email_cf = senderC.GetEmail_Config();
                    string content = "";
                    if (user_guest == null)
                    {
                        string ket_qua = $"Kính gửi: {model.Email} \r\nChúng tôi mời bạn tham gia họp trực truyến!\r\nTên phòng họp: {schedule.RoomName}\r\nThời gian bắt đầu: {schedule.StartTime}\r\nĐịa điểm: Phòng họp trực tuyến \"{schedule.RoomName}\"\r\nLink phòng họp: {schedule_link}\r\nMật khẩu phòng họp:  {schedule.Password}";
                        content += Util.NonUnicode(ket_qua);
                        sender.SendEmailAsync_Email_XacNhanPhongHop(email_cf, model.Email, model.Email, schedule_link, schedule.RoomName, schedule.StartTime, schedule.Password);
                    }
                    else
                    {

                        string ket_qua = $"Kính gửi: {user_guest.ten_day_du} \r\nChúng tôi mời bạn tham gia họp trực truyến!\r\nTên phòng họp: {schedule.RoomName}\r\nThời gian bắt đầu: {schedule.StartTime}\r\nĐịa điểm: Phòng họp trực tuyến \"{schedule.RoomName}\"\r\nLink phòng họp: {schedule_link}\r\nMật khẩu phòng họp:  {schedule.Password}";
                        sender.SendEmailAsync_Email_XacNhanPhongHop(email_cf, model.Email, user_guest.ten_day_du, schedule_link, schedule.RoomName, schedule.StartTime, schedule.Password);
                        content += Util.NonUnicode(ket_qua);
                        var ht_sms = _HTT_Context.he_thong_sms.Where(x => x.kich_hoat == 1).FirstOrDefault();
                        if (ht_sms == null) return StatusCode(299, new { Message = "Chưa kết nối hệ thống sms" });
                        var thong_tin_ob = JsonConvert.DeserializeObject<thong_tin_he_thong_sms>(ht_sms.thong_tin);
                        if (!Util.sendSMS(user_guest.so_dien_thoai, content, thong_tin_ob.api)) return StatusCode(299, new { Message = "Gửi sms thất bại" });
                    }

                }




            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }

            if (i < 0)
            {
                return StatusCode(299, new { status = false, message = "Thêm thành phần không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Thêm thành phần thành công" });
            }


        }

        /// <summary>
        /// Người chủ trì, Thư ký, Đại biểu, Khách mời có thể thoát khỏi phòng họp trực tuyến trên thiết bị đi động, hệ thống loại bỏ khỏi danh sách trạng thái thành viên đang tham gia và trở về trang chủ họp trực tuyến
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Thông báo rời phòng họp thành công</returns>
        [HttpDelete("thoatphonghop")]

        public IActionResult Remove(Guid id)
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

            var member = new MeetingMemberContext().GetById(id);
            var member_phone = _context.thong_tin_nguoi_dung.Where(x => x.id == member.UserId).Select(x => x.so_dien_thoai).FirstOrDefault();
            var member_hoten = _context.thong_tin_nguoi_dung.Where(x => x.id == member.UserId).Select(x => x.ten_day_du).FirstOrDefault(); // Corrected to select "hoten" instead of "mobile"
            var schedule = new MeetingScheduleContext().GetById(_context, member.ScheduleId);
            var i = 0;

            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Member_Remove", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@DeletedBy", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@DeletedDate", SqlDbType.Date).Value = DateTime.Now;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i != -1)
                        {
                            log_ql_nguoidung log = new log_ql_nguoidung();
                            log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                            log.tai_khoan = user_current;
                            log.noi_dung = user_current + "thực hiện loại bỏ người tham gia cuộc họp với Id" + member.Id;
                            log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                            log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                            log.chuc_nang = "Quản lí người dùng ";
                            log.loai_hoatdong = "Xóa";
                            _context.log_ql_nguoidung.Add(log);
                            _context.SaveChanges();
                        }
                    }
                }
                try
                {
                    if (i != -1)
                    {
                        if (member.UserId == 0)
                        {
                            string ket_qua = $"Kính gửi: {member.Email} \r\nChúng tôi đã hủy lịch họp trực truyến!!\r\nTên phòng họp: {schedule.RoomName}\r\nThời gian bắt đầu: {schedule.StartTime}";
                            EmailSender sender = new EmailSender();
                            EmailSenderC senderC = new EmailSenderC(_HTT_Context, _config);
                            email_config email_cf = senderC.GetEmail_Config();
                            sender.SendEmailAsync_Email_Huylichhop(email_cf, member.Email, member.Email, schedule.RoomName, schedule.StartTime);
                        }
                        else
                        {
                            string ket_qua = $"Kính gửi: {member_hoten} \r\nChúng tôi đã hủy lịch họp trực truyến!!\r\nTên phòng họp: {schedule.RoomName}\r\nThời gian bắt đầu: {schedule.StartTime}";
                            EmailSender sender = new EmailSender();
                            EmailSenderC senderC = new EmailSenderC(_HTT_Context, _config);
                            email_config email_cf = senderC.GetEmail_Config();
                            sender.SendEmailAsync_Email_Huylichhop(email_cf, member.Email, member_hoten, schedule.RoomName, schedule.StartTime);
                            var ht_sms = _context.he_thong_sms.Where(x => x.kich_hoat == 1).FirstOrDefault();
                            string content = "";
                            if (ht_sms == null) return StatusCode(299, new { Message = "Chưa kết nối hệ thống sms" });
                            var thong_tin_ob = JsonConvert.DeserializeObject<thong_tin_he_thong_sms>(ht_sms.thong_tin);
                            content += Util.NonUnicode(ket_qua);
                            if (!Util.sendSMS(member_phone, content, thong_tin_ob.api))
                                return StatusCode(299, new { Message = "Gửi sms thất bại" });
                        }
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(299, new { Message = "Gửi email thất bại" });
                }
            }
            catch (Exception ex)
            {
                return Ok(new { data = i, message = ex.ToString() });
            }

            return Ok(new { data = i, message = i > 0 ? "Xóa thành công" : "Không xóa được thành phần" });
        }

        /// <summary>
        /// Người chủ trì, Thư ký, Đại biểu, Khách mời có thể chọn xem danh sách phòng họp trên thiết bị đi động, hệ thống lấy danh sách phòng họp và hiển thị danh sách phòng họp
        /// </summary>
        /// <param name="strSearch"></param>
        /// <param name="dateFrom"></param>
        /// <param name="dateTo"></param>
        /// <returns>danh sách phòng họp</returns>
        [HttpGet("danhsachphonghop")]
        public IActionResult GetAll(string search, DateTime dateFrom, DateTime dateTo)
        {
            return Ok(new { data = new MeetingScheduleContext().GetAll(_context, search, dateFrom, dateTo) });
        }


        /// <summary>
        /// Người chủ trì, Thư ký, Đại biểu, Khách mời có thể xem danh sách tham gia phòng họp trên thiết bị đi động, hệ thống lấy danh sách tham gia phòng họp và hiển thị danh sách tham gia phòng họp
        /// </summary>
        /// <param name="id">Id lịch họp </param>
        /// <returns>danh sách người tham gia cuộc họp</returns>
        [HttpGet("danhsachnguoithamgia")]
        public IActionResult GetByScheduleId(Guid id)
        {
            return Ok(new { data = new MeetingMemberContext().GetByScheduleId(id) });
        }

        #endregion
    }
}