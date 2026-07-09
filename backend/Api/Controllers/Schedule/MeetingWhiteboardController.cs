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
using System.Linq;

namespace HTT.Api.Controllers
{
    [Route("meeting/[controller]")]
    [ApiController]
    public class MeetingWhiteboardController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        public IConfiguration _config { get; }
        public MeetingWhiteboardController(IConfiguration Configuration, QTHT_HTT_Context context)
        {
            _context = context;
            _config = Configuration;
        }

        [HttpGet("GetByScheduleId")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.WHITEBOARD)]
        public IActionResult GetByScheduleId(Guid id)
        {
            return Ok(new { data = new MeetingWhiteboardContext().GetByScheduleId(id) });
        }

        [HttpPost("Insert")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.WHITEBOARD)]
        public IActionResult Insert(Meeting_Whiteboard_Insert model)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
           
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null )
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var id = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Whiteboard_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@content", SqlDbType.NText).Value = model.Content == null ? DBNull.Value : model.Content;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = user;
                        con.Open();
                        id = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                return Ok(new { data = id, message = e.Message });
            }
            return Ok(new { data = id, message = id > 0 ? "Thêm nội dung thành công" : "Không thêm được nội dung" });
        }

        [HttpPost("Remove")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.WHITEBOARD)]
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
                        return Ok(new { data = i, message = i > 0 ? "Xóa thành công" : "Khống xóa được dữ liệu" });
                    }
                }
            }
            catch (Exception ex)
            {
                return Ok(new { data = i, message = ex.ToString() });
            }
        }

        [HttpPost("Update")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult Update(Guid id, Meeting_Whiteboard_Update model)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null  )
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Whiteboard_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
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
                return Ok(new { data = i, message = e.Message });
            }
            return Ok(new { data = i, message = "Cập nhật thành công" });
        }
    }
}