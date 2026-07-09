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
    public class MeetingConslusionController : Controller
    {
        private readonly QTHT_HTT_Context _context;
        public IConfiguration _config { get; }
        public MeetingConslusionController(IConfiguration Configuration, QTHT_HTT_Context context)
        {
            _context = context;
            _config = Configuration;
        }

        [HttpGet("GetByScheduleId")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.CONSLUSION)]
        public IActionResult GetByScheduleId(string search, Guid id, int pageNumber, int pageSize)
        {
            var data = new MeetingConslusionContext().GetByScheduleId(search, id);
            var totalRecords = data.Count();
            var records = data
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var result = new
            {
                status = 200,
                TotalRecords = totalRecords,
                PageSize = pageSize,
                PageNumber = pageNumber,
                Data = records
            };

            return Ok(result);

        }

        [HttpGet("GetById")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.CONSLUSION)]
        public IActionResult GetById(Guid id)
        {
            return Ok(new { status = 200, data = new MeetingConslusionContext().GetById(id) });
        }

        [HttpGet("GetListUnApprove")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.CONSLUSION)]
        public IActionResult GetListUnApprove()
        {
            bool status = false;
            return Ok(new { status = 200, data = new MeetingConslusionContext().GetByStatus(status) });
        }

        [HttpGet("GetListApprove")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.CONSLUSION)]
        public IActionResult GetListApprove()
        {
            bool status = true;
            return Ok(new { status = 200, data = new MeetingConslusionContext().GetByStatus(status) });
        }

        [HttpPost("Insert")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.CONSLUSION)]
        public IActionResult Insert(Meeting_Conslusion_Insert model)
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
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var meeting_conslusion = new MeetingConslusionContext().GetByScheduleId(model.Title, model.ScheduleId);
            if (meeting_conslusion.Count > 0)
            {
                return StatusCode(299, new { status = false, message = "Kết luận cuộc họp đã tồn tại" });
            }
            Guid id = Guid.NewGuid();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;

                        // Input parameters
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@content", SqlDbType.NText).Value = model.Content ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@url", SqlDbType.NVarChar).Value = model.Url ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@originalname", SqlDbType.NVarChar).Value = model.OriginalName ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@systemname", SqlDbType.NVarChar).Value = model.SystemName ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@type", SqlDbType.NVarChar).Value = model.Type ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@size", SqlDbType.Int).Value = model.Size == 0 ? (object)DBNull.Value : model.Size;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = user;

                        // Output parameter to capture the new Id
                        var newIdParam = new SqlParameter("@newId", SqlDbType.UniqueIdentifier)
                        {
                            Direction = ParameterDirection.Output
                        };
                        cmd.Parameters.Add(newIdParam);

                        con.Open();
                        cmd.ExecuteNonQuery();

                        if (i < 0) return StatusCode(299, new { message = "Không thêm được kết luận cuộc họp" });
                        // Get the new Id from the output parameter
                        var newId = (Guid)newIdParam.Value;

                        return Ok(new { status = true, data = newId, message = "Thêm kết luận cuộc họp thành công" });
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, data = id, message = e.Message });
            }
        }

        [HttpPost("Update")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.CONSLUSION)]
        public IActionResult Update(Guid id, Meeting_Conslusion_Insert model)
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
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@content", SqlDbType.NText).Value = model.Content == null ? DBNull.Value : model.Content;
                        cmd.Parameters.Add("@url", SqlDbType.NVarChar).Value = model.Url == null ? DBNull.Value : model.Url;
                        cmd.Parameters.Add("@originalname", SqlDbType.NVarChar).Value = model.OriginalName == null ? DBNull.Value : model.OriginalName;
                        cmd.Parameters.Add("@systemname", SqlDbType.NVarChar).Value = model.SystemName == null ? DBNull.Value : model.SystemName;
                        cmd.Parameters.Add("@type", SqlDbType.NVarChar).Value = model.Type == null ? DBNull.Value : model.Type;
                        cmd.Parameters.Add("@size", SqlDbType.Int).Value = model.Size == 0 ? DBNull.Value : model.Size;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = model.Status;
                        con.Open();
                        i = cmd.ExecuteNonQuery();

                    }
                }
                return Ok(new { status = 200, data = i, message = i > 0 ? "Chỉnh sửa kết luận cuộc họp thành công" : "Không chỉnh sửa được kết luận cuộc họp" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, data = i, message = e.Message });
            }
        }

        [HttpPut("UnSendApprove")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.DOCUMENT)]
        public IActionResult UnSendApprove(Guid id)
        {
            try
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
                    return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
                }
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id == default ? DBNull.Value : id;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = 0;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
                return Ok(new { status = 200, message = "Hủy gửi duyệt kết luận thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, message = e.Message });
            }
        }

        [HttpPut("SendApprove")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.DOCUMENT)]
        public IActionResult SendApprove(Guid id)
        {
            try
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
                    return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
                }
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id == default ? DBNull.Value : id;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = 1;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
                return Ok(new { status = 200, message = "Gửi duyệt kết luận thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, message = e.Message });
            }
        }

        [HttpPost("Approve")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.CONSLUSION)]
        public IActionResult Approve(Guid id)
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
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = 2;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();

                    }
                }
                return Ok(new { status = 200, data = i, message = i > 0 ? "Phê duyệt kết luận cuộc họp thành công" : "Không phê duyệt được kết luận cuộc họp" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, data = i, message = e.Message });
            }
        }

        [HttpPost("UnApprove")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.CONSLUSION)]
        public IActionResult UnApprove(Guid id)
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
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = 1;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();

                    }
                }
                return Ok(new { status = 200, data = i, message = i > 0 ? "Hủy duyệt kết luận cuộc họp thành công" : "Không hủy duyệt được kết luận cuộc họp" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, data = i, message = e.Message });
            }
        }

        [HttpDelete("Delete")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.CONSLUSION)]
        public IActionResult Delete(Guid id)
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
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_Delete", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        con.Open();
                        i = cmd.ExecuteNonQuery();

                        return Ok(new { status = 200, data = i, message = i > 0 ? "Xóa thành công" : "Không xóa được dữ liệu" });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, data = i, message = ex.ToString() });
            }
        }

        [HttpDelete("Remove")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.CONSLUSION)]
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_Remove", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@deletedDate", SqlDbType.Date).Value = DateTime.Now;
                        cmd.Parameters.Add("@deletedBy", SqlDbType.Int).Value = user;
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

        [HttpPost("Restore")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.CONSLUSION)]
        public IActionResult Restore(Guid id)
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_Restore", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@modifiedDate", SqlDbType.Date).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedBy", SqlDbType.Int).Value = user;
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
    }
}