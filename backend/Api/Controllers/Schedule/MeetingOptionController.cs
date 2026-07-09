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
    public class MeetingOptionController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        public IConfiguration _config { get; }
        public MeetingOptionController(IConfiguration Configuration, QTHT_HTT_Context context)
        {
            _context = context;
            _config = Configuration;
        }

        [HttpGet("GetAll")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.OPTION)]
        public IActionResult GetAll(string strSearch, DateTime dateFrom, DateTime dateTo)
        {
            return Ok(new { data = new MeetingOptionContext().GetAll(strSearch, dateFrom, dateTo) });
        }

        [HttpGet("GetById")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.OPTION)]
        public IActionResult GetItemById(Guid id)
        {
            return Ok(new { data = new MeetingOptionContext().GetById(id) });
        }

        [HttpGet("GetByKey")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.OPTION)]
        public IActionResult GetItemByKey(string key)
        {
            return Ok(new { data = new MeetingOptionContext().GetByKey(key) });
        }

        [HttpPost("Insert")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.OPTION)]
        public IActionResult Insert(Meeting_Option model)
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
            var id = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Option_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@label_vn", SqlDbType.NVarChar).Value = model.label_vn == null ? DBNull.Value : model.label_vn;
                        cmd.Parameters.Add("@label_en", SqlDbType.NVarChar).Value = model.label_en == null ? DBNull.Value : model.label_en;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = model.status;
                        cmd.Parameters.Add("@value", SqlDbType.NVarChar).Value = model.value == default ? DBNull.Value : model.value;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = user;
                        con.Open();
                        id = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.ToString() });
            }
            if (id < 0)
            {
                return StatusCode(299, new { status = false, message = "Thêm cấu hình họp không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Thêm cấu hình họp thành công " });
            }
        }

        [HttpPost("Delete")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.OPTION)]
        public IActionResult Delete(Guid id, Meeting_Option model)
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Option_Delete", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@deleteddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@deletedby", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Xóa cấu hình họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa cấu hình họp thành công " });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }

        [HttpGet("GetAllDeleted")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.OPTION)]
        public IActionResult GetAll_Deleted()
        {
            return Ok(new { data = new MeetingOptionContext().GetAll_Deleted() });
        }

        [HttpPost("Remove")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.OPTION)]
        public IActionResult Remove(Guid id)
        {
            var i = 0;
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
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Option_Remove", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
            if (i < 0)
            {
                return StatusCode(299, new { status = false, message = "Xóa cấu hình họp không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Xóa cấu hình họp thành công " });
            }
        }

        [HttpPost("Status")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.OPTION)]
        public IActionResult SetStatus(Guid id, Meeting_Option model)
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Option_Set_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = model.status;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Chỉnh sửa trạng thái cấu hình họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Chỉnh sửa trạng thái cấu hình họp thành công " });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }

        [HttpPost("Update")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.OPTION)]
        public IActionResult Update(Guid id, Meeting_Option model)
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Option_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@label_vn", SqlDbType.NVarChar).Value = model.label_vn == null ? DBNull.Value : model.label_vn;
                        cmd.Parameters.Add("@label_en", SqlDbType.NVarChar).Value = model.label_en == null ? DBNull.Value : model.label_en;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = model.status;
                        cmd.Parameters.Add("@value", SqlDbType.NVarChar).Value = model.value == default ? DBNull.Value : model.value;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.ToString() });
            }
            if (i < 0)
            {
                return StatusCode(299, new { status = false, message = "Cập nhật thông tin cấu hình họp không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Cập nhật thông tin cấu hình họp thành công " });
            }
        }
    }
}