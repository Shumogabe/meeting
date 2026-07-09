using Api;
using DocumentFormat.OpenXml.Drawing.Spreadsheet;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.VariantTypes;
using DocumentFormat.OpenXml.Wordprocessing;
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
using System.Reactive.Concurrency;

namespace HTT.Api.Controllers
{
    [Route("meeting/[controller]")]
    [ApiController]
    public class MeetingVotesController : Controller
    {
        private readonly QTHT_HTT_Context _context;
        public IConfiguration _config { get; }
        public MeetingVotesController(IConfiguration Configuration, QTHT_HTT_Context context)
        {
            _context = context;
            _config = Configuration;
        }
        [HttpGet("GetById")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.VOTES)]
        public IActionResult GetItemById(Guid id)
        {
            return Ok(new { status = true, data = new MeetingVotesContext().GetById(id) });
        }

        [HttpGet("GetByScheduleId")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.VOTES)]
        public IActionResult GetByScheduleId(string search, Guid id, int pageSize, int pageNumber)
        {
            var data = new MeetingVotesContext().GetByScheduleId(_context, search, id);
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

        [HttpGet("GetByTitle")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.VOTES)]
        public IActionResult GetByTitle(string title, Guid ScheduleId)
        {
            return Ok(new { status = true, data = new MeetingVotesContext().GetByTitle(title, ScheduleId) });
        }

        [HttpPost("Insert")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.VOTES)]
        public IActionResult Insert(Meeting_Votes_Insert model)
        {
            try
            {
                var ChoPhepThucHienNhieuBieuQuyet = _context.tl_ch_bieuquyet.Where(x => x.tencauhinh == "ChoPhepThucHienNhieuBieuQuyet").OrderByDescending(k => k.CreatedDate).FirstOrDefault();
                if (ChoPhepThucHienNhieuBieuQuyet != null && ChoPhepThucHienNhieuBieuQuyet.giatri == "0")
                {
                    var data = new MeetingVotesContext().GetByScheduleId(_context, null, model.ScheduleId);
                    var totalRecords = data.Count();
                    if (totalRecords >= 1)
                    {
                        return StatusCode(299, new { message = "Cấu hình hệ thống không cho phép tạo thêm biểu quyết" });
                    }
                }
                var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
                var don_vi = _context.thong_tin_nguoi_dung
                     .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                     .Select(x => x.ma_tochuc)
                     .FirstOrDefault();
                var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
                Guid newId = Guid.Empty;
                var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                if (don_vi == null)
                {
                    return StatusCode(299, new { status = false, message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
                }
                var meeting_votes = new MeetingVotesContext().GetCheckByTitle(model.Title, model.ScheduleId);
                if (meeting_votes.Title == model.Title)
                {
                    return StatusCode(299, new { status = false, message = "Chủ đề đã tồn tại" });
                }
                var id = 0;
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;

                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = model.Status;
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

                        var a = outputIdParam?.Value.ToString();
                        if (outputIdParam?.Value.ToString() == "") return StatusCode(299, new { message = "Không thêm được nội dung" });

                        // Retrieve the output value (new Id)
                        newId = (Guid)outputIdParam.Value;

                    }
                }
                return Ok(new { data = newId, message = "Thêm nội dung thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }

        }

        [HttpPost("Update")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.VOTES)]
        public IActionResult Update(Guid id, Meeting_Votes_Update model)
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = model.Status;
                        cmd.Parameters.Add("@type", SqlDbType.Bit).Value = model.Type;
                        cmd.Parameters.Add("@end", SqlDbType.Bit).Value = model.End;
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
                return StatusCode(299, new { status = false, message = "Chỉnh sửa nội dung không thành công " });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Chỉnh sửa nội dung thành công " });
            }
        }

        [HttpPost("Status")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.VOTES)]
        public IActionResult UpdateStatus(Guid id, Meeting_Votes_Status_Update model)
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_Status_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = model.Status;
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
                return StatusCode(299, new { status = false, message = "Cập nhật trạng thái không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Cập nhật trạng thái thành công" });
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
                    return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
                }
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_Status_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id == default ? DBNull.Value : id;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = 0;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
                return Ok(new { message = "Hủy gửi duyệt kết luận thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
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
                    return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
                }
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_Status_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id == default ? DBNull.Value : id;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = 0;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
                return Ok(new { message = "Gửi duyệt kết luận thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
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
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_Status_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = 1;
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
                return StatusCode(299, new { status = false, message = "Duyệt danh mục biểu quyết không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Duyệt danh mục biểu quyết thành công " });
            }
        }

        [HttpPost("UnApprove")]
        [Authorize]
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
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_Status_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = 0;
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
                return StatusCode(299, new { status = false, message = "Hủy duyệt danh mục biểu quyết không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Hủy duyệt danh mục biểu quyết thành công " });
            }
        }

        [HttpPost("End")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.VOTES)]
        public IActionResult UpdateEnd(Guid id, Meeting_Votes_End_Update model)
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
            var check_vote_approve = new MeetingVotesContext().GetById(id);
            if (check_vote_approve.Status == false)
            {
                return StatusCode(299, new { status = false, message = "Chưa duyệt biểu quyết" });
            }
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_End_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@end", SqlDbType.Bit).Value = model.End;
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
                return StatusCode(299, new { status = false, message = "Cập nhật nội dung không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Cập nhật nội dung thành công " });
            }
        }

        [HttpPost("Delete")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.VOTES)]
        public IActionResult Delete(Guid id)
        {
            var i = 0;
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
                            return StatusCode(299, new { status = false, message = "Xóa nội dung không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa nội dung thành công " });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpPost("Remove")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.VOTES)]
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_Remove", con))
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
                            return StatusCode(200, new { status = true, message = "Xóa nội dung thành công " });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpPost("Restore")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.VOTES)]
        public IActionResult Restore(Guid id)
        {
            var i = 0;
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Votes_Restore", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@modifiedDate", SqlDbType.Date).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Khôi phục nội dung không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Khôi phục nội dung thành công " });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }
    }
}