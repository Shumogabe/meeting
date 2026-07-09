using Api;
using HTT.Api.Helpers;
using HTT.Api.Models;
using HTT.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Net;

namespace HTT.Api.Controllers
{
    [Route("meeting/[controller]")]
    [ApiController]
    public class MeetingScheduleController : Controller
    {
        private readonly QTHT_HTT_Context _context;
        private readonly IConfiguration _configuration;
        private readonly HTT_Context _datacontext;

        public MeetingScheduleController(IConfiguration configuration, QTHT_HTT_Context context, HTT_Context datacontext)
        {
            _context = context;
            _configuration = configuration;
            _datacontext = datacontext;
        }

        [HttpGet("GetAll")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetAll(string strSearch, DateTime dateFrom, DateTime dateTo)
        {
            return Ok(new { status = true, data = new MeetingScheduleContext().GetAll(_context, strSearch, dateFrom, dateTo) });
        }

        [HttpGet("GetById")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetItemById(Guid id)
        {
            return Ok(new { status = true, data = new MeetingScheduleContext().GetById(_context, id) });
        }

        [HttpGet("GetAllByStatus")]
        [Authorize]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetAllByStatus(int page, int pageSize, string search, DateTime dateFrom, DateTime dateTo, int status, bool start, bool isdeleted)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            //mã đơn vị
            var don_vi = _context.thong_tin_nguoi_dung
                  .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                  .Select(x => x.ma_tochuc)
                  .FirstOrDefault();
            //id đơn vị
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var user_id = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            var data = new MeetingScheduleContext().GetAllByStatus(_context, page, pageSize, don_vi_id, search, dateFrom, dateTo, status, start, isdeleted);
            return Ok(new
            {
                status = true,
                Data = data,
                TotalRecords = new MeetingScheduleContext().GetAllByStatus(_context, 1, 999999, don_vi_id, search, dateFrom, dateTo, status, start, isdeleted).Count(),
                PageSize = pageSize,
                PageNumber = page,
            });
        }

        [HttpGet("GetByTitle")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetByTitle(string title)
        {
            return Ok(new { status = true, data = new MeetingScheduleContext().GetByTitle(_context, title) });
        }

        [HttpGet("GetByRoomName")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetByRoomName(string roomname)
        {
            return Ok(new { status = true, data = new MeetingScheduleContext().GetByRoomName(_context, roomname) });
        }

        [HttpGet("GetByUserId")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetByUserId(int create, string search, DateTime dateFrom, DateTime dateTo, int status, bool start, bool isdeleted)
        {
            return Ok(new { status = true, data = new MeetingScheduleContext().GetByUserId(_context, create, search, dateFrom, dateTo, status, start, isdeleted) });
        }

        [HttpGet("GetByUserIdFilter")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        [Authorize]
        public IActionResult GetByUserIdFilter(int page, int pageSize, string search, DateTime dateFrom, DateTime dateTo, int status, bool start, bool isdeleted)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            //mã đơn vị
            var don_vi = _context.thong_tin_nguoi_dung
                  .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                  .Select(x => x.ma_tochuc)
                  .FirstOrDefault();
            //id đơn vị
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var user_id = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            var data = new MeetingScheduleContext().GetByUserIdFilter(_context, page, pageSize, user_id, don_vi_id, search, dateFrom, dateTo, status, start, isdeleted);
            return Ok(new
            {
                status = true,
                Data = data,
                TotalRecords = new MeetingScheduleContext().GetByUserIdFilter(_context, 1, 999999, user_id, don_vi_id, search, dateFrom, dateTo, status, start, isdeleted).Count(),
                PageSize = pageSize,
                PageNumber = page,
            });
        }

        [HttpGet("GetByUserIdFilterMonre")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        [Authorize]
        public IActionResult GetByUserIdFilterMonre(int page, int pageSize, string search, DateTime dateFrom, DateTime dateTo, int status, bool start, bool isdeleted)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                  .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                  .Select(x => x.ma_tochuc)
                  .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var user_id = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();

            var data = new MeetingScheduleContext().GetByUserIdFilterMonre(_context, page, pageSize, user_id, don_vi_id, search, dateFrom, dateTo, status, start, isdeleted);
            return Ok(new
            {
                status = true,
                Data = data,
                TotalRecords = new MeetingScheduleContext().GetByUserIdFilterMonre(_context, 1, 999999, user_id, don_vi_id, search, dateFrom, dateTo, status, start, isdeleted).Count(),
                PageSize = pageSize,
                PageNumber = page,
            });
        }

        [HttpGet("GetByUserIdTypeId")]
        [Authorize]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetByUserIdTypeId(int page, int pageSize, int create, string search, DateTime dateFrom, DateTime dateTo, int status, bool start, bool isdeleted)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                  .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                  .Select(x => x.ma_tochuc)
                  .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();

            var data = new MeetingScheduleContext().GetByUserIdTypeId(_context, page, pageSize, create, don_vi_id, search, dateFrom, dateTo, status, start, isdeleted);
            return Ok(new
            {
                status = 200,
                Data = data,
                TotalRecords = new MeetingScheduleContext().GetByUserIdTypeId(_context, 1, 999999, create, don_vi_id, search, dateFrom, dateTo, status, start, isdeleted).Count(),
                PageSize = pageSize,
                PageNumber = page,
            });
        }

        [HttpGet("GetByUserIdDay")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetByUserIdDay(int create, string search, DateTime day)
        {
            return Ok(new { status = 200, data = new MeetingScheduleContext().GetByUserIdDay(_context, create, search, day) });
        }

        [HttpPost("Insert")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.SCHEDULE)]
        public IActionResult Insert(Meeting_Schedule_Insert model)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                  .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                  .Select(x => x.ma_tochuc)
                  .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();

            if (don_vi == null)
            {
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();

            var id = 0;

            if (!string.IsNullOrEmpty(model.RoomName))
            {
                var checkRoomName = new MeetingScheduleContext().GetByRoomName(_context, model.RoomName);
                if (checkRoomName.Id != Guid.Empty)
                {
                    return StatusCode(299, new { status = 299, Message = "Tên phòng họp đã tồn tại" });
                }
            }
            else
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_GenerateUniqueRoomName", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        var RoomName = new SqlParameter("@RoomName", SqlDbType.VarChar)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(RoomName);
                        con.Open();
                        var i = cmd.ExecuteNonQuery();
                        con.Close();

                        // Get the new Id from the output parameter
                        model.RoomName = (string)RoomName.Value;
                    }
                }
            }

            var timeEnd = new MeetingOptionContext().GetByKey("EndTime");

            var exp = new DateTimeOffset(model.EndTime).ToUnixTimeSeconds();

            JitAuth jitAuth = new JitAuth();
            var token = "";
            var server_id = 0;

            if (!string.IsNullOrEmpty(model.RoomName))
            {
                jitAuth.moderator = "false";
                jitAuth.room = model.RoomName;
                jitAuth.exp = exp.ToString();
                if (model.ServerId == 0)
                {
                    var server_id_default = new MeetingServerContext().GetByDefault();
                    if (server_id_default.Id != 0)
                    {
                        server_id = server_id_default.Id;
                    }
                }
                else
                {
                    server_id = model.ServerId;
                }
                jitAuth.server = server_id;
                if (user_current != null)
                {
                    token = new MeetingRoomController(_configuration).Token(jitAuth);
                }
            }

            Guid newId = Guid.Empty;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@content", SqlDbType.NText).Value = model.Content == null ? DBNull.Value : model.Content;
                        cmd.Parameters.Add("@starttime", SqlDbType.DateTime).Value = model.StartTime == default ? DBNull.Value : model.StartTime;
                        cmd.Parameters.Add("@endtime", SqlDbType.DateTime).Value = model.EndTime == default ? DBNull.Value : model.EndTime;
                        cmd.Parameters.Add("@chairman", SqlDbType.Int).Value = model.ChairMan == 0 ? DBNull.Value : model.ChairMan;
                        cmd.Parameters.Add("@roomname", SqlDbType.NVarChar).Value = model.RoomName == null ? DBNull.Value : model.RoomName;
                        cmd.Parameters.Add("@place", SqlDbType.NVarChar).Value = model.Place == null ? DBNull.Value : model.Place;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = model.Status == 0 ? DBNull.Value : model.Status;
                        cmd.Parameters.Add("@start", SqlDbType.Bit).Value = model.Start;
                        cmd.Parameters.Add("@token", SqlDbType.NVarChar).Value = (object)token ?? DBNull.Value;
                        cmd.Parameters.Add("@serverid", SqlDbType.Int).Value = server_id;
                        cmd.Parameters.Add("@typeid", SqlDbType.Int).Value = model.TypeId == 0 ? (object)DBNull.Value : model.TypeId;
                        cmd.Parameters.Add("@sharedrole", SqlDbType.Int).Value = model.SharedRole == 0 ? (object)DBNull.Value : model.SharedRole;
                        cmd.Parameters.Add("@password", SqlDbType.NVarChar).Value = (object)model.Password ?? DBNull.Value;
                        cmd.Parameters.Add("@islobby", SqlDbType.Bit).Value = model.IsPublished;
                        cmd.Parameters.Add("@ispublished", SqlDbType.Bit).Value = model.IsPublished;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@don_vi", SqlDbType.BigInt).Value = Convert.ToInt64(don_vi_id);

                        var newIdParam = new SqlParameter("@newId", SqlDbType.UniqueIdentifier)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(newIdParam);

                        con.Open();
                        var i = cmd.ExecuteNonQuery();
                        con.Close();

                        // Get the new Id from the output parameter
                        newId = (Guid)newIdParam.Value;
                        if (model.TypeId != 4)
                        {
                            log_ql_laplich log = new log_ql_laplich
                            {
                                ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now)),
                                tai_khoan = user_current,
                                noi_dung = user_current + " thực hiện thêm mới lịch họp: " + newId.ToString(),
                                ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString(),
                                thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now),
                                chuc_nang = "Quản lý lịch họp",
                                loai_hoatdong = "Thêm mới"
                            };
                            _context.log_ql_laplich.Add(log);
                        }
                        else
                        {
                            log_ql_sukien log = new log_ql_sukien
                            {
                                ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now)),
                                tai_khoan = user_current,
                                noi_dung = user_current + " thực hiện thêm mới sự kiện: " + newId.ToString(),
                                ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString(),
                                thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now),
                                chuc_nang = "Quản lý sự kiện",
                                loai_hoatdong = "Thêm mới"
                            };
                            _context.log_ql_sukien.Add(log);
                        }
                        _context.SaveChangesAsync();
                    }
                }
                return Ok(new { status = true, message = "Thêm lịch thành công", data = model.RoomName.ToString() });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }
        }

        [HttpPost("Delete")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult Delete(Guid id)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;

            var meetingSchedule = new MeetingScheduleContext().GetById(_context, id);
            if (meetingSchedule.Id == Guid.Empty) return StatusCode(299, new { status = 299, Message = "Không tìm thấy thông tin lịch họp" });

            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();

            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();

            if (don_vi == null)
            {
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Delete", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@deleteddate", SqlDbType.DateTime).Value = meetingSchedule.DeletedDate == default ? DBNull.Value : meetingSchedule.DeletedDate;
                        cmd.Parameters.Add("@deletedby", SqlDbType.Int).Value = meetingSchedule.DeletedBy == 0 ? DBNull.Value : meetingSchedule.DeletedBy;
                        con.Open();
                        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                        i = cmd.ExecuteNonQuery();
                        if (i != -1)
                        {
                            if (meetingSchedule.TypeId == 4)
                            {
                                log_ql_sukien log = new log_ql_sukien();
                                log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                                log.tai_khoan = user_current;
                                log.noi_dung = user_current + " thực hiện xóa lịch hop với id " + id;
                                log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                                log.loai_hoatdong = "Delete";
                                log.ip_may = ipAddress;
                                log.loai_hoatdong = "Xóa";
                                _context.log_ql_sukien.Add(log);
                            }
                            else
                            {
                                log_ql_laplich log = new log_ql_laplich();
                                log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                                log.tai_khoan = user_current;
                                log.noi_dung = user_current + " thực hiện xóa sự kiện với id " + id;
                                log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                                log.loai_hoatdong = "Delete";
                                log.ip_may = ipAddress;
                                log.loai_hoatdong = "Xóa";
                                _context.log_ql_laplich.Add(log);
                            }
                            _context.SaveChanges();

                        }
                        return Ok(new { status = true, message = "Xóa thành công" });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }

        [HttpGet("GetAllDeleted")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetAll_Deleted()
        {
            return Ok(new { status = true, data = new MeetingScheduleContext().GetAll_Deleted(_context) });
        }

        [HttpPost("Remove")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.SCHEDULE)]
        public IActionResult Remove(Guid id)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var meetingSchedule = new MeetingScheduleContext().GetById(_context, id);
            if (meetingSchedule.Id == Guid.Empty) return StatusCode(299, new { status = 299, Message = "Không tìm thấy thông tin lịch họp" });
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
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
                            if (meetingSchedule.TypeId == 4)
                            {
                                log_ql_sukien log = new log_ql_sukien();
                                log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                                log.tai_khoan = user_current;
                                log.noi_dung = user_current + " thực hiện xóa lịch hop với id " + id;
                                log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                                log.loai_hoatdong = "Remove";
                                log.ip_may = ipAddress;
                                log.loai_hoatdong = "Xóa vĩnh viễn";
                                _context.log_ql_sukien.Add(log);
                            }
                            else
                            {
                                log_ql_laplich log = new log_ql_laplich();
                                log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                                log.tai_khoan = user_current;
                                log.noi_dung = user_current + " thực hiện xóa sự kiện với id " + id;
                                log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                                log.loai_hoatdong = "Remove";
                                log.ip_may = ipAddress;
                                log.loai_hoatdong = "Xóa vĩnh viễn";
                                _context.log_ql_laplich.Add(log);
                            }
                            _context.SaveChanges();

                        }
                    }
                }
                return Ok(new { status = true, data = i, message = "Xóa thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, data = i, message = ex.ToString() });
            }
        }

        [HttpPost("Restore")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult Restore(Guid id, Meeting_Schedule_Restore model)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var meetingSchedule = new MeetingScheduleContext().GetById(_context, id);
            if (meetingSchedule.Id == Guid.Empty) return StatusCode(299, new { status = 299, Message = "Không tìm thấy thông tin lịch họp" });
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();

            if (don_vi == null)
            {
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Restore", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = model.ModifiedBy == 0 ? DBNull.Value : model.ModifiedBy;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = model.ModifiedDate == default ? DBNull.Value : model.ModifiedDate;
                        con.Open();
                        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                        i = cmd.ExecuteNonQuery();
                        if (i != -1)
                        {
                            if (meetingSchedule.TypeId == 4)
                            {
                                log_ql_sukien log = new log_ql_sukien();
                                log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                                log.tai_khoan = user_current;
                                log.noi_dung = user_current + " thực hiện khôi phục sự kiện " + meetingSchedule.RoomName;
                                log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                                log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                                log.chuc_nang = "Quản lí sự kiện ";
                                log.loai_hoatdong = "Khôi phục";
                                _context.log_ql_sukien.Add(log);
                                _context.SaveChanges();
                            }
                            else
                            {
                                log_ql_laplich log = new log_ql_laplich();
                                log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                                log.tai_khoan = user_current;
                                log.noi_dung = user_current + " thực hiện khôi phục lịch họp " + meetingSchedule.RoomName;
                                log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                                log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                                log.chuc_nang = "Quản lí lịch họp ";
                                log.loai_hoatdong = "Khôi phục";
                                _context.log_ql_laplich.Add(log);
                                _context.SaveChanges();
                            }


                        }
                        return Ok(new { status = true, message = "Khôi phục thành công" });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }

        [HttpPost("UpdateStatusAllComponent")]
        [Authorize]
        public IActionResult UpdateStatusAllComponent(Guid scheduleid, int status)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                  .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current || x.ma_dinhdanh == user_current)
                  .Select(x => x.ma_tochuc)
                  .FirstOrDefault();
            var user_id = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_UpdateAllStatus", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@scheduleId", SqlDbType.UniqueIdentifier).Value = scheduleid;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = status;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.NVarChar).Value = user_id;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        return Ok(new { status = 200, data = i, message = i > 0 ? "Thành công update trạng thái" : "Update trạng thái không thành công" });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = ex.ToString() });
            }

        }

        [HttpPost("ShareRole")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult SetShareRole(Guid id, Meeting_Schedule_SharedRole model)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();

            if (don_vi == null)
            {
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Set_ShareRole", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@sharedrole", SqlDbType.Int).Value = model.SharedRole == 0 ? DBNull.Value : model.SharedRole;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Ủy quyền cuộc họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Ủy quyền cuộc họp thành công " });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }

        [HttpPost("ChairMan")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult SetChairMan(Guid id, Meeting_Schedule_ChairMan model)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Set_ChairMan", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@chairman", SqlDbType.Int).Value = model.ChairMan == 0 ? DBNull.Value : model.ChairMan;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Ủy quyền cuộc họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Ủy quyền cuộc họp thành công " });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }

        [HttpPost("Start")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult SetStart(Guid id, Meeting_Schedule_Start model)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }


            var i = 0;

            var checkRoomName = new MeetingScheduleContext().GetById(_context, id);

            if (checkRoomName.Id == Guid.Empty)
            {
                return StatusCode(299, new { status = 299, Message = "Không tìm thấy phòng họp" });
            }

            var timeEnd = new MeetingOptionContext().GetByKey("EndTime");

            var endTime = DateTime.Now;

            var exp = new DateTimeOffset(endTime).ToUnixTimeSeconds() + Int32.Parse(timeEnd.value);

            endTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc).AddSeconds(exp).ToLocalTime();

            JitAuth jitAuth = new JitAuth();
            jitAuth.moderator = "false";
            jitAuth.room = checkRoomName.RoomName.ToString();
            jitAuth.exp = exp.ToString();
            jitAuth.server = checkRoomName.ServerId;

            var token = "";

            if (user_current != null && model.Start == true)
            {
                token = new MeetingRoomController(_configuration).Token(jitAuth);
            }

            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Set_Start", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@start", SqlDbType.Bit).Value = model.Start;
                        cmd.Parameters.Add("@token", SqlDbType.NVarChar).Value = token;
                        cmd.Parameters.Add("@endtime", SqlDbType.DateTime).Value = endTime;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = (model.Start == true ? "Bắt đầu" : "Kết thúc") + " cuộc họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = (model.Start == true ? "Bắt đầu" : "Kết thúc") + " cuộc họp thành công" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }

        [HttpPost("Status")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult SetStatus(Guid id, Meeting_Schedule_Status model)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();

            if (don_vi == null)
            {
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var meetingSchedule = new MeetingScheduleContext().GetById(_context, id);
            if (meetingSchedule.Id == Guid.Empty) return StatusCode(299, new { Message = "Không tìm thấy thông tin lịch họp" });

            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Set_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = model.Status;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        con.Open();
                        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                        i = cmd.ExecuteNonQuery();
                        if (i != -1)
                        {
                            if (meetingSchedule.TypeId == 4)
                            {
                                log_ql_sukien log = new log_ql_sukien();
                                log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                                log.tai_khoan = user_current;
                                log.noi_dung = user_current + " thực hiện cập nhật trạng thái sự kiện " + meetingSchedule.RoomName;
                                log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                                log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                                log.chuc_nang = "Quản lí sự kiện ";
                                log.loai_hoatdong = "Cập nhật trạng thái";
                                if (_context.log_ql_sukien.Where(x => x.ma == log.ma).FirstOrDefault() == null)
                                {
                                    _context.log_ql_sukien.Add(log);
                                    _context.SaveChanges();
                                }
                            }
                            else
                            {
                                log_ql_laplich log = new log_ql_laplich();
                                log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                                log.tai_khoan = user_current;
                                log.noi_dung = user_current + " thực hiện cập nhật trạng thái lịch họp " + meetingSchedule.RoomName;
                                log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                                log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                                log.chuc_nang = "Quản lí lịch họp ";
                                log.loai_hoatdong = "Cập nhật trạng thái";
                                if (_context.log_ql_laplich.Where(x => x.ma == log.ma).FirstOrDefault() == null)
                                {
                                    _context.log_ql_laplich.Add(log);
                                    _context.SaveChanges();
                                }
                            }


                        }

                        return Ok(new { status = true, message = "Cập nhật trạng thái thành công" });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }

        [HttpPost("IsLobby")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult SetIsLobby(Guid id, Meeting_Schedule_IsLobby model)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Set_IsLobby", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@islobby", SqlDbType.Bit).Value = model.IsLobby;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Chính sửa họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Chỉnh sửa họp thành công " });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }

        [HttpPost("IsPublished")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult SetIsPublished(Guid id, Meeting_Schedule_IsPublished model)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();

            if (don_vi == null)
            {
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Set_IsPublished", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@ispublished", SqlDbType.Bit).Value = model.IsPublished;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        return Ok(new { status = 200, data = i, message = i > 0 ? "thành công" : "Không được" });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, data = i, message = ex.ToString() });
            }
        }

        [HttpPost("Update")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult Update(Guid id, Meeting_Schedule_Update model)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var meeting_schedule = new MeetingScheduleContext().GetById(_context, id);
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }

            if (!string.IsNullOrEmpty(model.RoomName))
            {
                var checkRoomName = new MeetingScheduleContext().GetByRoomName(_context, model.RoomName);

                if (checkRoomName != null && checkRoomName.Status == 2 && checkRoomName.Id != id)
                {
                    return StatusCode(299, new { status = 299, Message = "Tên lịch họp đã tồn tại" });
                }
            }

            var meetingSchedule = new MeetingScheduleContext().GetById(_context, id);

            var timeEnd = new MeetingOptionContext().GetByKey("EndTime");

            long exp = 0;
            if (model.EndTime != default)
            {
                exp = new DateTimeOffset(model.EndTime).ToUnixTimeSeconds();
            }
            else
            {
                exp = new DateTimeOffset(meeting_schedule.EndTime).ToUnixTimeSeconds();
            }
            JitAuth jitAuth = new JitAuth();
            var token = "";
            var server_id = 0;
            if (!string.IsNullOrEmpty(model.RoomName))
            {
                jitAuth.moderator = "false";
                jitAuth.room = model.RoomName;
                jitAuth.exp = exp.ToString();
                if (model.ServerId == 0)
                {
                    var server_id_default = new MeetingServerContext().GetByDefault();
                    if (server_id_default.Id != 0)
                    {
                        server_id = server_id_default.Id;
                    }
                }
                else
                {
                    server_id = model.ServerId;
                }
                jitAuth.server = server_id;

                if (user_current != null)
                {
                    token = new MeetingRoomController(_configuration).Token(jitAuth);
                }
            }

            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@content", SqlDbType.NText).Value = model.Content == null ? DBNull.Value : model.Content;
                        cmd.Parameters.Add("@starttime", SqlDbType.DateTime).Value = model.StartTime == default ? DBNull.Value : model.StartTime;
                        cmd.Parameters.Add("@endtime", SqlDbType.DateTime).Value = model.EndTime == default ? DBNull.Value : model.EndTime;
                        cmd.Parameters.Add("@chairman", SqlDbType.Int).Value = model.ChairMan == 0 ? DBNull.Value : model.ChairMan;
                        cmd.Parameters.Add("@roomname", SqlDbType.NVarChar).Value = model.RoomName == null ? DBNull.Value : model.RoomName;
                        cmd.Parameters.Add("@place", SqlDbType.NVarChar).Value = model.Place == null ? DBNull.Value : model.Place;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = model.Status == 0 ? DBNull.Value : model.Status;
                        cmd.Parameters.Add("@start", SqlDbType.Bit).Value = model.Start;
                        cmd.Parameters.Add("@token", SqlDbType.NVarChar).Value = (object)token ?? DBNull.Value;
                        cmd.Parameters.Add("@serverid", SqlDbType.Int).Value = server_id;
                        cmd.Parameters.Add("@typeid", SqlDbType.Int).Value = model.TypeId == 0 ? DBNull.Value : model.TypeId;
                        cmd.Parameters.Add("@sharedrole", SqlDbType.Int).Value = model.SharedRole == 0 ? DBNull.Value : model.SharedRole;
                        cmd.Parameters.Add("@password", SqlDbType.NVarChar).Value = model.Password == null ? DBNull.Value : model.Password;
                        cmd.Parameters.Add("@islobby", SqlDbType.Bit).Value = model.IsLobby;
                        cmd.Parameters.Add("@ispublished", SqlDbType.Bit).Value = model.IsPublished;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@don_vi", SqlDbType.BigInt).Value = don_vi_id;
                        con.Open();
                        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                        i = cmd.ExecuteNonQuery();
                        if (i != -1)
                        {
                            if (meeting_schedule.TypeId == 4)
                            {
                                log_ql_sukien log = new log_ql_sukien();
                                log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                                log.tai_khoan = user_current;
                                log.noi_dung = user_current + " thực hiện cập nhật thông tin sự kiện " + meetingSchedule.RoomName;
                                log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                                log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                                log.chuc_nang = "Quản lí sự kiện ";
                                log.loai_hoatdong = "Cập nhật ";
                                _context.log_ql_sukien.Add(log);
                                _context.SaveChanges();
                            }
                            else
                            {
                                log_ql_laplich log = new log_ql_laplich();
                                log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                                log.tai_khoan = user_current;
                                log.noi_dung = user_current + " thực hiện cập nhật thông tin lịch họp " + meetingSchedule.RoomName;
                                log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                                log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                                log.chuc_nang = "Quản lí lịch họp ";
                                log.loai_hoatdong = "Cập nhật ";
                                _context.log_ql_laplich.Add(log);
                                _context.SaveChanges();
                            }

                        }
                    }
                }
                return Ok(new { status = 200, message = "Cập nhật thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, message = e.Message });
            }
        }

        [HttpPost("UpdatePassword")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult UpdatePassword(Guid id, Meeting_Schedule_Password model)
        {
            var i = 0;
            var meeting = new MeetingScheduleContext().GetById(_context, id);
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Update_Password", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@password", SqlDbType.NVarChar).Value = model.Password == null ? DBNull.Value : model.Password;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        con.Open();
                        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                        i = cmd.ExecuteNonQuery();
                        if (i != -1)
                        {
                            if (meeting.TypeId == 4)
                            {
                                log_ql_sukien log = new log_ql_sukien();
                                log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                                log.tai_khoan = user_current;
                                log.noi_dung = user_current + " thực hiện cập nhật mật khẩu sự kiện " + meeting.RoomName;
                                log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                                log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                                log.chuc_nang = "Quản lí sự kiện ";
                                log.loai_hoatdong = "Cập nhật mật khẩu";
                                _context.log_ql_sukien.Add(log);
                                _context.SaveChanges();
                            }
                            else
                            {
                                log_ql_laplich log = new log_ql_laplich();
                                log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                                log.tai_khoan = user_current;
                                log.noi_dung = user_current + " thực hiện cập nhật mật khẩu lịch họp " + meeting.RoomName;
                                log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                                log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                                log.chuc_nang = "Quản lí lịch họp ";
                                log.loai_hoatdong = "Cập nhật mật khẩu";
                                _context.log_ql_laplich.Add(log);
                                _context.SaveChanges();
                            }


                        }
                    }
                }
                return Ok(new { status = 200, data = i, message = "Cập nhật thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, data = i, message = e.Message });
            }
        }

        /// <summary>
        /// thêm kế hoạch họp, hệ thống thêm mới kế hoạch họp và thông báo thành công  
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Trả về thông báo thêm kế hoạch họp thành công </returns>
        [HttpPost("InsertPlanSchedule")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult InsertPlanSchedule(Meeting_Schedule_Insert model)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var id = 0;
            var checkRoomName = new MeetingScheduleContext().GetByRoomName(_context, model.RoomName);

            if (checkRoomName.Id != Guid.Empty)
            {
                return StatusCode(299, new { status = 299, Message = "Tên phòng họp đã tồn tại" });
            }

            var timeEnd = new MeetingOptionContext().GetByKey("EndTime");

            var exp = new DateTimeOffset(model.EndTime).ToUnixTimeSeconds();

            JitAuth jitAuth = new JitAuth();
            jitAuth.moderator = "false";
            jitAuth.room = checkRoomName.RoomName.ToString();
            jitAuth.exp = exp.ToString();
            jitAuth.server = model.ServerId;

            var token = "";

            if (user_current != null)
            {
                token = new MeetingRoomController(_configuration).Token(jitAuth);
            }

            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@content", SqlDbType.NText).Value = model.Content == null ? DBNull.Value : model.Content;
                        cmd.Parameters.Add("@starttime", SqlDbType.DateTime).Value = model.StartTime == default ? DBNull.Value : model.StartTime;
                        cmd.Parameters.Add("@endtime", SqlDbType.DateTime).Value = model.EndTime == default ? DBNull.Value : model.EndTime;
                        cmd.Parameters.Add("@chairman", SqlDbType.Int).Value = model.ChairMan == 0 ? DBNull.Value : model.ChairMan;
                        cmd.Parameters.Add("@roomname", SqlDbType.NVarChar).Value = model.RoomName == null ? DBNull.Value : model.RoomName;
                        cmd.Parameters.Add("@place", SqlDbType.NVarChar).Value = model.Place == null ? DBNull.Value : model.Place;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = model.Status == 0 ? DBNull.Value : model.Status;
                        cmd.Parameters.Add("@start", SqlDbType.Bit).Value = model.Start;
                        cmd.Parameters.Add("@token", SqlDbType.NVarChar).Value = token == null ? DBNull.Value : token;
                        cmd.Parameters.Add("@serverid", SqlDbType.Int).Value = model.ServerId == 0 ? DBNull.Value : model.ServerId;
                        cmd.Parameters.Add("@typeid", SqlDbType.Int).Value = 4;
                        cmd.Parameters.Add("@sharedrole", SqlDbType.Int).Value = model.SharedRole == 0 ? DBNull.Value : model.SharedRole;
                        cmd.Parameters.Add("@password", SqlDbType.NVarChar).Value = model.Password == null ? DBNull.Value : model.Password;
                        cmd.Parameters.Add("@islobby", SqlDbType.Bit).Value = model.IsPublished;
                        cmd.Parameters.Add("@ispublished", SqlDbType.Bit).Value = model.IsPublished;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@don_vi", SqlDbType.NVarChar).Value = don_vi_id;

                        con.Open();
                        id = cmd.ExecuteNonQuery();
                    }
                }
                return Ok(new { status = 200, data = id, message = id > 0 ? "Thêm kế hoạch lịch họp thành công" : "Không thêm được kế hoạch lịch họp" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, data = id, message = e.Message });
            }
        }

        /// <summary>
        /// Sửa kế hoạch họp, hệ thống sửa kế hoạch họp và thông báo thành công
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("UpdatePlanSchedule")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult UpdatePlanSchedule(Guid id, Meeting_Schedule_Update model)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var timeEnd = new MeetingOptionContext().GetByKey("EndTime");

            var exp = new DateTimeOffset(model.EndTime).ToUnixTimeSeconds();

            JitAuth jitAuth = new JitAuth();
            jitAuth.moderator = "false";
            jitAuth.room = model.RoomName.ToString();
            jitAuth.exp = exp.ToString();
            jitAuth.server = model.ServerId;

            var token = "";

            if (user_current != null)
            {
                token = new MeetingRoomController(_configuration).Token(jitAuth);
            }

            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@content", SqlDbType.NText).Value = model.Content == null ? DBNull.Value : model.Content;
                        cmd.Parameters.Add("@starttime", SqlDbType.DateTime).Value = model.StartTime == default ? DBNull.Value : model.StartTime;
                        cmd.Parameters.Add("@endtime", SqlDbType.DateTime).Value = model.EndTime == default ? DBNull.Value : model.EndTime;
                        cmd.Parameters.Add("@chairman", SqlDbType.Int).Value = model.ChairMan == 0 ? DBNull.Value : model.ChairMan;
                        cmd.Parameters.Add("@roomname", SqlDbType.NVarChar).Value = model.RoomName == null ? DBNull.Value : model.RoomName;
                        cmd.Parameters.Add("@place", SqlDbType.NVarChar).Value = model.Place == null ? DBNull.Value : model.Place;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = model.Status == 0 ? DBNull.Value : model.Status;
                        cmd.Parameters.Add("@start", SqlDbType.Bit).Value = model.Start;
                        cmd.Parameters.Add("@token", SqlDbType.NVarChar).Value = token == null ? DBNull.Value : token;
                        cmd.Parameters.Add("@serverid", SqlDbType.Int).Value = model.ServerId == 0 ? DBNull.Value : model.ServerId;
                        cmd.Parameters.Add("@typeid", SqlDbType.Int).Value = 4;
                        cmd.Parameters.Add("@sharedrole", SqlDbType.Int).Value = model.SharedRole == 0 ? DBNull.Value : model.SharedRole;
                        cmd.Parameters.Add("@password", SqlDbType.NVarChar).Value = model.Password == null ? DBNull.Value : model.Password;
                        cmd.Parameters.Add("@islobby", SqlDbType.Bit).Value = model.IsPublished;
                        cmd.Parameters.Add("@ispublished", SqlDbType.Bit).Value = model.IsPublished;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@don_vi", SqlDbType.BigInt).Value = don_vi_id;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                    }
                }
                return Ok(new { status = 200, data = i, message = "Cập nhật thông tin kế hoạch họp thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, data = i, message = e.Message });
            }
        }

        [HttpGet("GenerateUniqueRoomNameSchedule")]
        public IActionResult GenerateUniqueRoomName()
        {
            try
            {
                var data = "";
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_GenerateUniqueRoomName", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        var RoomName = new SqlParameter("@RoomName", SqlDbType.VarChar, 5)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(RoomName);
                        con.Open();
                        var i = cmd.ExecuteNonQuery();
                        con.Close();

                        // Get the new Id from the output parameter
                        data = (string)RoomName.Value;
                    }
                }
                return Ok(new { status = true, message = "Lấy mã phòng họp thành công", data = data });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }
        }
    }
}
