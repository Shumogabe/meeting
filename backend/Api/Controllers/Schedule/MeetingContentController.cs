using Api;
using HTT.Api.Helpers;
using HTT.Api.Models;
using HTT.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace HTT.Api.Controllers
{
    [Route("meeting/[controller]")]
    [ApiController]
    public class MeetingContentController : Controller
    {
        private readonly QTHT_HTT_Context _context;
        public IConfiguration _config { get; }
        private readonly HTT_Context _datacontext;
        public MeetingContentController(IConfiguration Configuration, QTHT_HTT_Context context, HTT_Context datacontext)
        {
            _datacontext = datacontext;
            _context = context;
            _config = Configuration;
        }

        [HttpGet("GetByScheduleId")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.CONTENT)]
        public IActionResult GetByScheduleId(Guid id, int pageSize, int pageNumber)
        {
            var data = new MeetingContentContext().GetByScheduleId(_context, id);
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

        [HttpGet("GetById")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.CONTENT)]
        public IActionResult GetItemById(Guid id)
        {
            return Ok(new { status = true, data = new MeetingContentContext().GetById(id) });
        }

        [HttpPost("Insert")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.CONTENT)]
        public IActionResult Insert(Meeting_Content_Insert model)
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Content_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@content", SqlDbType.NText).Value = model.Content_ == null ? DBNull.Value : model.Content_;
                        cmd.Parameters.Add("@starttime", SqlDbType.DateTime).Value = model.StartTime == default ? DBNull.Value : model.StartTime;
                        cmd.Parameters.Add("@endtime", SqlDbType.DateTime).Value = model.EndTime == default ? DBNull.Value : model.EndTime;
                        cmd.Parameters.Add("@presenters", SqlDbType.Int).Value = model.Presenters == 0 ? DBNull.Value : model.Presenters;
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
                return StatusCode(299, new { status = false, message = "Thêm nội dung không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Thêm nội dung thành công" });
            }
        }

        [HttpPost("Remove")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.CONTENT)]
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Content_Remove", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@modifiedDate", SqlDbType.Date).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();

                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Xóa nội dung không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa nội dung thành công" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }

        [HttpPost("Delete")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.CONTENT)]
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
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Content_Delete", con))

                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        con.Open();
                        i = cmd.ExecuteNonQuery();

                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Xóa nội dung không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa nội dung thành công" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }

        [HttpPost("Restore")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.CONTENT)]
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Content_Restore", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@modifiedDate", SqlDbType.Date).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedBy", SqlDbType.Int).Value = user;
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
                return StatusCode(299, new { status = false, message = "Khôi phục nội dung không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Khôi phục nội dung thành công" });
            }
        }

        [HttpPost("Update")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult Update(Guid id, Meeting_Content_Update model)
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Content_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@content", SqlDbType.NText).Value = model.Content_ == null ? DBNull.Value : model.Content_;
                        cmd.Parameters.Add("@starttime", SqlDbType.DateTime).Value = model.StartTime == default ? DBNull.Value : model.StartTime;
                        cmd.Parameters.Add("@endtime", SqlDbType.DateTime).Value = model.EndTime == default ? DBNull.Value : model.EndTime;
                        cmd.Parameters.Add("@presenters", SqlDbType.Int).Value = model.Presenters == 0 ? DBNull.Value : model.Presenters;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
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
                return StatusCode(299, new { status = false, message = "Chỉnh sửa nội dung không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Chỉnh sửa nội dung thành công" });
            }
        }

        [HttpPost("UnSendApprove")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult UnSendApprove(Guid id)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Content_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = 0;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { message = "Không hủy gửi phê duyệt được nội dung" });
                        }
                    }
                }
                return Ok(new { message = "Hủy gửi phê duyệt nội dung thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { data = i, message = e.Message });
            }
        }

        [HttpPost("SendApprove")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult SendApprove(Guid id)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Content_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = 1;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { message = "Không phê duyệt được nội dung" });
                        }
                    }
                }
                return Ok(new { message = "Gửi phê duyệt nội dung thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { data = i, message = e.Message });
            }
        }

        [HttpPost("Approve")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult Approve(Guid id)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Content_Update_Status", con))
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
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
            if (i < 0)
            {
                return StatusCode(299, new { status = false, message = "Phê duyệt nội dung không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Phê duyệt nội dung thành công" });
            }
        }

        [HttpGet("ListDraftMeetingContent")]
        [AllowAnonymous]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.CONTENT)]
        public IActionResult ListDraftMeetingContent(int pageSize, int pageNumber)
        {
            try
            {
                List<Meeting_Content> list = new MeetingContentContext().GetByStatus(0);
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
            catch (Exception ex)
            {
                return Ok(new { message = ex.Message });
            }


        }

        [HttpGet("ListApproveMeetingContent")]
        [AllowAnonymous]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.CONTENT)]
        public IActionResult ListApproveMeetingContent(int pageSize, int pageNumber)
        {
            try
            {
                List<Meeting_Content> list = new MeetingContentContext().GetByStatus(1);
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
            catch (Exception ex)
            {
                return Ok(new { message = ex.Message });
            }
        }

        [HttpGet("ListUnApproveMeetingContent")]
        [AllowAnonymous]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.CONTENT)]
        public IActionResult ListUnApproveMeetingContent(int pageSize, int pageNumber)
        {
            try
            {
                List<Meeting_Content> list = new MeetingContentContext().GetByStatus(2);
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
            catch (Exception ex)
            {
                return Ok(new { message = ex.Message });
            }
        }

        [HttpPost("UnApprove")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.CONTENT)]
        public IActionResult UnApprove(Guid id)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Content_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = 3;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
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
                return StatusCode(299, new { status = false, message = "Hủy duyệt nội dung không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Hủy duyệt nội dung thành công" });
            }
        }
    }
}