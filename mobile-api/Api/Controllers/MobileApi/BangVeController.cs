using Api;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using QTHT.Api.Models;
using QTHT.Api.Models.database.Meeting.Whiteboard;
using System;
using System.Data;
using System.Linq;
using System.Security.Claims;
using static QTHT.Api.Models.database.Meeting.Whiteboard.Whiteboard;
using static QTHT.Api.Models.QTHT_HTT_Context;

namespace QTHT.Api.Controllers.MobileApi
{
    [Route("[controller]")]
    [ApiController]
    public class BangVeController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _datacontext;
        public BangVeController(QTHT_HTT_Context context, HTT_Context datacontext)
        {
            _datacontext = datacontext;
            _context = context;
        }
        [HttpGet("thongtinchitiet")]
        public IActionResult GetByScheduleId(Guid id)
        {
            return Ok(new { status = true, data = new MeetingWhiteboardContext().GetByScheduleId(id) });
        }

        [HttpPost("them")]
        [Authorize]
        public IActionResult Insert(Meeting_Whiteboard_Insert model)
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            var ma_tochuc = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            DateTime date = DateTime.Now;
            Guid id = Guid.NewGuid();
            try
            {
                Meeting_Whiteboard model1 = new Meeting_Whiteboard();
                model1.ScheduleId = model.ScheduleId;
                model1.Content = model.Content;
                model1.Title = model.Title;
                model1.Id = id;
                model1.CreatedDate = DateTime.Now;
                model1.CreatedBy = user;
                _datacontext.Meeting_Whiteboard.Add(model1);
                _datacontext.SaveChanges();
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }
            return Ok(new { status = true, data = id, message = "Thêm nội dung thành công" });
        }

        [HttpDelete("xoa")]
        [Authorize]
        public IActionResult Remove([FromQuery] Guid id)
        {
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Whiteboard_Remove", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Không xóa được dữ liệu" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa thành công" });
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpPut("chinhsua")]
        [Authorize]
        public IActionResult Update(Meeting_Whiteboard_Update model)
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Whiteboard_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = model.Id;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@content", SqlDbType.NText).Value = model.Content == null ? DBNull.Value : model.Content;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
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
    }
}
