using Api;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.VariantTypes;
using DocumentFormat.OpenXml.Wordprocessing;
using HTT.Api.Extensions;
using HTT.Api.Helpers;
using HTT.Api.Models;
using HTT.Api.Services;
using HTT.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing.Printing;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace HTT.Api.Controllers
{

    [Route("meeting/[controller]")]
    [ApiController]
    public class MeetingMemberController : Controller
    {
        private readonly QTHT_HTT_Context _context;
        public IConfiguration _config { get; }
        private readonly HTT_Context _context1;

        public MeetingMemberController(QTHT_HTT_Context context, IConfiguration configuration, HTT_Context context1)
        {
            _config = configuration;
            _context = context;
            _context1 = context1;
        }

        [HttpGet("GetById")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.MEMBER)]
        public IActionResult GetById(Guid id)
        {
            return Ok(new { data = new MeetingMemberContext().GetById(id) });
        }

        [HttpGet("GetByScheduleId")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.MEMBER)]
        public IActionResult GetByScheduleId(Guid id)
        {
            return Ok(new { data = new MeetingMemberContext().GetByScheduleId(id) });
        }

        [HttpGet("GetByScheduleIdInside")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.MEMBER)]
        public IActionResult GetByScheduleIdInside(Guid id, int pageSize, int pageNumber)
        {
            var data = new MeetingMemberContext().GetByScheduleIdInside(_context, id);
            if (pageSize == default)
            {
                pageSize = 1;
            }
            if (pageNumber == default)
            {
                pageNumber = 1;
            }
            var totalRecords = data.Count();
            var records = data
            .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var result = new
            {
                TotalRecords = totalRecords,
                PageSize = pageSize,
                PageNumber = pageNumber,
                Data = records
            };

            return Ok(result);

        }

        [HttpGet("GetByScheduleIdOutside")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.MEMBER)]
        public IActionResult GetByScheduleIdOutside(Guid id, int pageSize, int pageNumber)
        {
            var data = new MeetingMemberContext().GetByScheduleIdOutside(_context, id);
            var totalRecords = data.Count();
            var records = data
            .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var result = new
            {
                TotalRecords = totalRecords,
                PageSize = pageSize,
                PageNumber = pageNumber,
                Data = records
            };

            return Ok(result);

        }

        [HttpGet("GetListActivated")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.MEMBER)]
        public IActionResult GetListActivated(bool status, int pageSize, int pageNumber)
        {
            status = true;
            List<Meeting_Member> list = new MeetingMemberContext().GetByStatus(status);
            var totalRecords = list.Count();
            var records = list
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();
            var result = new
            {
                TotalRecords = totalRecords,
                PageSize = pageSize,
                PageNumber = pageNumber,
                Data = records

            };
            return Ok(result);
        }

        [HttpGet("GetListDeactivated")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.MEMBER)]
        public IActionResult GetListDeactivated(bool status, int pageSize, int pageNumber)
        {
            status = false;
            List<Meeting_Member> list = new MeetingMemberContext().GetByStatus(status);
            var totalRecords = list.Count();
            var records = list
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();
            var result = new
            {
                TotalRecords = totalRecords,
                PageSize = pageSize,
                PageNumber = pageNumber,
                Data = records

            };
            return Ok(result);

        }

        [HttpPut("Activated")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.MEMBER)]
        public async Task<IActionResult> Activated(Guid id)
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var don_vi_name = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.ten).FirstOrDefault().ToUpper();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var time = DateTime.Now;
            var i = 0;
            var member = new MeetingMemberContext().GetById(id);
            var schedule = new MeetingScheduleContext().GetById(_context, member.ScheduleId);
            var user_guest = _context.thong_tin_nguoi_dung.FirstOrDefault(x => x.id == member.UserId);
            var setting = _context.tl_ch_thongbaolichhop
                    .FirstOrDefault(x => x.tencauhinh == "ThongBaoLichHop_Schedule_Link");
            string schedule_link = setting?.giatri + schedule.RoomName;
            if (user_guest == null)
            {
                schedule_link += "&mail=" + member.Email;
            }

            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Member_Activated", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@isactivated", SqlDbType.Bit).Value = 1;

                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i != -1)
                        {
                            log_ql_laplich log = new log_ql_laplich();
                            log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(time) + Util.DateTimeToUnixTimeStamp(member.CreatedDate.Value) + member.UserId);
                            log.tai_khoan = user_current;
                            log.noi_dung = user_current + " thực hiện cập nhật trạng thái hủy người dùng " + member.UserId;
                            log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                            log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                            log.chuc_nang = "Quản lí người tham gia ";
                            log.loai_hoatdong = "Cập nhật trạng thái hủy";
                            _context.log_ql_laplich.Add(log);
                            _context.SaveChanges();
                        }
                        if (i != -1 && !string.IsNullOrEmpty(member.Email))
                        {
                            var result = await EmailSenderExtensions.SendFinalMail_Email_XacNhanLichHoc(schedule, schedule_link, member.Email, don_vi_name, _context, _context1, _config, user_guest);
                            //if (result.Contains("error"))
                            //    return StatusCode(500, new { Message = result });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
            if (i < 0)
            {
                return StatusCode(299, new { status = false, message = "Thay đổi không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Thay đổi thành công " });
            }
        }

        [HttpPut("Deactivated")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.MEMBER)]
        public IActionResult Deactivated(Guid id)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var i = 0;
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var member = new MeetingMemberContext().GetById(id);
            var member_phone = _context.thong_tin_nguoi_dung.Where(x => x.id == member.UserId).Select(x => x.so_dien_thoai).FirstOrDefault();
            var member_hoten = _context.thong_tin_nguoi_dung.Where(x => x.id == member.UserId).Select(x => x.ten_day_du).FirstOrDefault(); // Corrected to select "hoten" instead of "mobile"
            var schedule = new MeetingScheduleContext().GetById(_context, member.ScheduleId);
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var time = DateTime.Now;
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Member_Activated", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@isactivated", SqlDbType.Bit).Value = 0;

                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i != -1)
                        {
                            log_ql_laplich log = new log_ql_laplich();
                            log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(time) + Util.DateTimeToUnixTimeStamp(member.CreatedDate.Value) + member.UserId);
                            log.tai_khoan = user_current;
                            log.noi_dung = user_current + " thực hiện cập nhật trạng thái hủy người dùng " + member.UserId;
                            log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                            log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                            log.chuc_nang = "Quản lí người tham gia ";
                            log.loai_hoatdong = "Cập nhật trạng thái hủy";
                            _context.log_ql_laplich.Add(log);
                            _context.SaveChanges();

                            //var result = EmailSenderExtensions.SendFinalMail_Email_HuyLichHop(member, _context, _context1, _config, schedule, member_hoten, member_phone);

                        }
                        if (i != -1 && !string.IsNullOrEmpty(member.Email))
                        {
                            var result = EmailSenderExtensions.SendFinalMail_Email_HuyLichHop(member, _context, _context1, _config, schedule, member_hoten, member_phone);
                            //if (result.Contains("error"))
                            //    return StatusCode(500, new { Message = result });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
            if (i < 0)
            {
                return StatusCode(299, new { status = false, message = "Cập nhật trạng thái không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Cập nhật trạng thái thành công " });
            }
        }

        [HttpPost("Insert")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.SYSTEM_ADMIN)]
        public async Task<IActionResult> Insert(Meeting_Member_Insert model)
        {
            try
            {
                Meeting_Member check_exist;
                if (model.UserId != default)
                {
                    check_exist = _context1.Meeting_Member
                        .FirstOrDefault(x => x.UserId == model.UserId && x.ScheduleId == model.ScheduleId);
                    if (check_exist != null)
                        return StatusCode(299, new { Message = "Đại biểu đã tồn tại" });
                }
                else
                {
                    check_exist = _context1.Meeting_Member
                        .FirstOrDefault(x => x.Email == model.Email && x.ScheduleId == model.ScheduleId);
                    if (check_exist != null)
                        return StatusCode(299, new { Message = "Khách mời đã tồn tại" });
                }


                var user_guest = _context.thong_tin_nguoi_dung.FirstOrDefault(x => x.id == model.UserId);
                var user_current = User.FindFirst(new Constant(_config).Nameidentifier())?.Value;
                var don_vi = _context.thong_tin_nguoi_dung
                    .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") ||
                                x.email == user_current)
                    .Select(x => x.ma_tochuc)
                    .FirstOrDefault();
                var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
                var user = _context.thong_tin_nguoi_dung
                    .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") ||
                                x.email == user_current)
                    .Select(x => x.id)
                    .FirstOrDefault();

                if (don_vi == null)
                    return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });

                var setting = _context.tl_ch_thongbaolichhop
                    .FirstOrDefault(x => x.tencauhinh == "ThongBaoLichHop_Schedule_Link");
                var schedule = new MeetingScheduleContext().GetById(_context, model.ScheduleId);
                string schedule_link = setting?.giatri + schedule.RoomName;

                int i = 0;

                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Member_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@userid", SqlDbType.Int).Value = model.UserId == 0 ? DBNull.Value : model.UserId;
                        cmd.Parameters.Add("@email", SqlDbType.NVarChar).Value = string.IsNullOrEmpty(model.Email) ? DBNull.Value : model.Email;
                        cmd.Parameters.Add("@activated", SqlDbType.Bit).Value = 0;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = user;

                        con.Open();
                        i = cmd.ExecuteNonQuery();
                    }
                }

                if (i != -1)
                {
                    log_ql_laplich log = new log_ql_laplich
                    {
                        ma = Util.ToID(user_current + "-" + (model.UserId != default ? model.UserId : model.Email) + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now)),
                        tai_khoan = user_current,
                        noi_dung = $"{user_current} thực hiện thêm mới đại biểu tham gia {model.UserId}",
                        ip_may = Dns.GetHostEntry(Dns.GetHostName()).AddressList[0].ToString(),
                        thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now),
                        chuc_nang = "Quản lí đại biểu tham gia",
                        loai_hoatdong = "Thêm mới"
                    };
                    _context.log_ql_laplich.Add(log);
                    _context.SaveChanges();
                }

                if (i < 0)
                {
                    return StatusCode(299, new { status = false, message = "Thêm thành phần không thành công" });
                }
                else
                {
                    return StatusCode(200, new { status = true, message = "Thêm thành phần thành công " });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }

        }

        [HttpPut("Update")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.SYSTEM_ADMIN)]
        public IActionResult Update(Meeting_Member_Update model)
        {
            if (model.id == null)
            {
                return StatusCode(299, new { Message = "Thiếu trường thông tin " });
            }
            var user_guest = _context.thong_tin_nguoi_dung.Where(x => x.id == model.UserId).FirstOrDefault();
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
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Member_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = model.id;
                        cmd.Parameters.Add("@ScheduleId", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@userid", SqlDbType.Int).Value = model.UserId == 0 ? DBNull.Value : model.UserId;
                        cmd.Parameters.Add("@Email ", SqlDbType.NVarChar).Value = model.Email == null ? DBNull.Value : model.Email;
                        cmd.Parameters.Add("@Activated", SqlDbType.Bit).Value = model.Activated;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i != -1)
                        {
                            log_ql_laplich log = new log_ql_laplich();
                            log.ma = Util.ToID(user_current + "-" + (model.UserId != default ? model.UserId : model.Email) + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                            log.tai_khoan = user_current;
                            log.noi_dung = user_current + " " + "thực hiện chỉnh sửa thông tin người tham gia" + " " + model.UserId;
                            log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                            log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                            log.chuc_nang = "Quản lí người tham gia ";
                            log.loai_hoatdong = "Chỉnh sửa";
                            _context.log_ql_laplich.Add(log);
                            _context.SaveChanges();

                        }
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.ToString() });
            }
            if (i < 0)
            {
                return StatusCode(299, new { status = false, message = "Chỉnh sửa thông tin thành phần không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Chỉnh sửa thông tin thành phần thành công " });
            }
        }

        [HttpPost("Remove")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.MEMBER)]
        public IActionResult Remove(Guid id)
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
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
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
                        cmd.Parameters.Add("@DeletedBy", SqlDbType.Int).Value = 8;
                        cmd.Parameters.Add("@DeletedDate", SqlDbType.Date).Value = DateTime.Now;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i != -1)
                        {
                            log_ql_laplich log = new log_ql_laplich();
                            log.ma = Util.ToID("user_current" + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now) + member.UserId);
                            log.tai_khoan = "user_current";
                            log.noi_dung = "user_current" + " " + "thực hiện xóa người tham gia" + " " + member.UserId;
                            log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                            log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                            log.chuc_nang = "Quản lí người tham gia ";
                            log.loai_hoatdong = "Xóa";
                            _context.log_ql_laplich.Add(log);
                            _context.SaveChanges();

                        }
                    }
                }

                if (i != -1)
                {

                    var result = EmailSenderExtensions.SendFinalMail_Email_HuyLichHop(member, _context, _context1, _config, schedule, member_hoten, member_phone);
                }


            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.ToString() });
            }
            if (i < 0)
            {
                return StatusCode(299, new { status = false, message = "Xóa không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Xóa thành công" });
            }
        }

        [HttpGet("danhsachthanhvien")]
        [Authorize]
        public IActionResult GetMember(string search)
        {
            try
            {
                var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
                var don_vi = _context.thong_tin_nguoi_dung
                     .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                     .Select(x => x.ma_tochuc)
                     .FirstOrDefault();
                var i = 0;
                var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();

                var listmember = _context1.Meeting_Member.Select(x => x.UserId).Distinct().ToList();

                var listuser = _context.thong_tin_nguoi_dung.Where(x => x.ma_tochuc == don_vi && listmember.Contains(x.id));

                if (!string.IsNullOrEmpty(search))
                {
                    listuser = listuser.Where(x => x.ten_dangnhap.ToUpper().Contains(search)|| x.ten_day_du.ToUpper().Contains(search));
                }

                return Ok(new { status = true, data = listuser.ToList() });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.ToString() });
            }
        }
    }
}