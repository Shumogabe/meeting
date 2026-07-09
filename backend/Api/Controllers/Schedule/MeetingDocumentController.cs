using Api;
using DocumentFormat.OpenXml.VariantTypes;
using HTT.Api.Helpers;
using HTT.Api.Models;
using HTT.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using QTHT.Api.Utils;
using System;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace HTT.Api.Controllers
{
    [Route("meeting/[controller]")]
    [ApiController]
    public class MeetingDocumentController : Controller
    {
        private readonly QTHT_HTT_Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public IConfiguration _config { get; }

        public MeetingDocumentController(IConfiguration Configuration, IWebHostEnvironment webHostEnvironment, QTHT_HTT_Context context)
        {
            _webHostEnvironment = webHostEnvironment;
            _config = Configuration;
            _context = context;
        }

        [HttpGet("GetByScheduleId")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.DOCUMENT)]
        public IActionResult GetByScheduleId(Guid id)
        {
            return Ok(new { status = true, data = new MeetingDocumentContext().GetByScheduleId(id, _context) });
        }

        [HttpGet("GetByScheduleIdApprove")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.DOCUMENT)]
        public IActionResult GetByScheduleIdApprove(Guid id)
        {
            var data = new MeetingDocumentContext().GetByScheduleId(id, _context);
            return Ok(new { status = true, data = data.Where(x => x.Status == 2).ToList() });
        }

        [HttpGet("GetByScheduleIdUnApprove")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.DOCUMENT)]
        public IActionResult GetByScheduleIdUnApprove(Guid id)
        {
            var data = new MeetingDocumentContext().GetByScheduleId(id, _context);
            return Ok(new { status = true,data = data.Where(x => x.Status == 1).ToList() });
        }

        [HttpGet("GetByScheduleIdDeleted")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.DOCUMENT)]
        public IActionResult GetByScheduleIdDeleted(Guid id)
        {
            var data = new MeetingDocumentContext().GetByScheduleId(id, _context);
            return Ok(new { status = true,data = data.Where(x => x.IsDeleted == true).ToList() });
        }

        [HttpGet("GetByFileUrl")]
        [AllowAnonymous]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.DOCUMENT)]
        public IActionResult GetByFileUrl(string url, int pageNumber, int pageSize)
        {
            var data = new MeetingDocumentContext().GetByFileUrl(url, _context);
            var totalRecords = data.Count();
            if (pageNumber == 0) pageNumber = 1;
            if (pageSize == 0) pageSize = 999999;
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("Insert")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.DOCUMENT)]
        public IActionResult Insert(Meeting_Document_Insert model)
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
            if (model.Title == null)
            {
                return StatusCode(299, new { Message = "Tiêu đề không được để trống" });
            }

            var check_exist = new MeetingDocumentContext().GetFileUrl(model.Url, model.OriginalName, _context);

            if (check_exist.Id != Guid.Empty) return StatusCode(299, new { Message = "Tài liệu đã tồn tại" });

            var id = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@url", SqlDbType.NVarChar).Value = model.Url == null ? DBNull.Value : model.Url;
                        cmd.Parameters.Add("@originalname", SqlDbType.NVarChar).Value = model.OriginalName == null ? DBNull.Value : model.OriginalName;
                        cmd.Parameters.Add("@systemname", SqlDbType.NVarChar).Value = model.SystemName == null ? DBNull.Value : model.SystemName;
                        cmd.Parameters.Add("@type", SqlDbType.NVarChar).Value = model.Type == null ? DBNull.Value : model.Type;
                        cmd.Parameters.Add("@size", SqlDbType.Int).Value = model.Size == 0 ? DBNull.Value : model.Size;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = 0;
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
                return StatusCode(299, new { status = false, message = "Thêm tài liệu không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Thêm tài liệu thành công" });
            }
        }
        [HttpPost]
        [Route("InsertApprove")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.DOCUMENT)]
        public IActionResult InsertApprove(Meeting_Document_Insert model)
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
            if (model.Title == null)
            {
                return StatusCode(299, new { Message = "Tiêu đề không được để trống" });
            }

            var check_exist = new MeetingDocumentContext().GetFileUrl(model.Url, model.OriginalName, _context);

            if (check_exist.Id != Guid.Empty) return StatusCode(299, new { Message = "Tài liệu đã tồn tại" });

            var id = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@url", SqlDbType.NVarChar).Value = model.Url == null ? DBNull.Value : model.Url;
                        cmd.Parameters.Add("@originalname", SqlDbType.NVarChar).Value = model.OriginalName == null ? DBNull.Value : model.OriginalName;
                        cmd.Parameters.Add("@systemname", SqlDbType.NVarChar).Value = model.SystemName == null ? DBNull.Value : model.SystemName;
                        cmd.Parameters.Add("@type", SqlDbType.NVarChar).Value = model.Type == null ? DBNull.Value : model.Type;
                        cmd.Parameters.Add("@size", SqlDbType.Int).Value = model.Size == 0 ? DBNull.Value : model.Size;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = 2;
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
                return StatusCode(299, new { status = false, message = "Thêm tài liệu không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Thêm tài liệu thành công" });
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("InsertWithoutCreatedby")]
        //[Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.DOCUMENT)]
        public IActionResult InsertWithoutCreatedby(Meeting_Document_Insert model)
        {
            var id = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@url", SqlDbType.NVarChar).Value = model.Url == null ? DBNull.Value : model.Url;
                        cmd.Parameters.Add("@originalname", SqlDbType.NVarChar).Value = model.OriginalName == null ? DBNull.Value : model.OriginalName;
                        cmd.Parameters.Add("@systemname", SqlDbType.NVarChar).Value = model.SystemName == null ? DBNull.Value : model.SystemName;
                        cmd.Parameters.Add("@type", SqlDbType.NVarChar).Value = model.Type == null ? DBNull.Value : model.Type;
                        cmd.Parameters.Add("@size", SqlDbType.Int).Value = model.Size == 0 ? DBNull.Value : model.Size;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = 0;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = 0;
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
                return StatusCode(299, new { status = false, message = "Thêm tài liệu không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Thêm tài liệu thành công" });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut("Update")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.DOCUMENT)]
        public IActionResult Update(Meeting_Document_Update model)
        {
            var id = 0;
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

                var check_exist = new MeetingDocumentContext().GetTitle(model.Title, model.FileUrl);

                if (check_exist.Id != Guid.Empty) return StatusCode(299, new { Message = "Tiêu đề đã tồn tại" });

                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = model.id == default ? DBNull.Value : model.id;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@ScheduleId", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@FileUrl", SqlDbType.NVarChar).Value = model.FileUrl == null ? DBNull.Value : model.FileUrl;
                        cmd.Parameters.Add("@FileOriginalName", SqlDbType.NVarChar).Value = model.FileOriginalName == null ? DBNull.Value : model.FileOriginalName;
                        cmd.Parameters.Add("@FileSystemName", SqlDbType.NVarChar).Value = model.FileSystemName == null ? DBNull.Value : model.FileSystemName;
                        cmd.Parameters.Add("@FileType", SqlDbType.NVarChar).Value = model.FileType == null ? DBNull.Value : model.FileType;
                        cmd.Parameters.Add("@FileSize", SqlDbType.Int).Value = model.FileSize == 0 ? DBNull.Value : model.FileSize;
                        cmd.Parameters.Add("@Status", SqlDbType.Int).Value = model.Status;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
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
                return StatusCode(299, new { status = false, message = "Chỉnh sửa tài liệu không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Chỉnh sửa tài liệu thành công" });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id == default ? DBNull.Value : id;
                        cmd.Parameters.Add("@Status", SqlDbType.Int).Value = 0;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
                return Ok(new { message = "Gửi duyệt tài liệu thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.ToString() });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id == default ? DBNull.Value : id;
                        cmd.Parameters.Add("@Status", SqlDbType.Int).Value = 1;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        cmd.ExecuteNonQuery();
                    }
                }
                return Ok(new { message = "Gửi duyệt tài liệu thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.ToString() });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut("Approve")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.DOCUMENT)]
        public IActionResult Approve(Guid id)
        {
            var i = 0;
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id == default ? DBNull.Value : id;
                        cmd.Parameters.Add("@Status", SqlDbType.Int).Value = 2;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
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
                return StatusCode(299, new { status = false, message = "Phê duyệt tài liệu phòng họp không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Phê duyệt tài liệu phòng họp thành công" });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut("UnApprove")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.DOCUMENT)]
        public IActionResult UnApprove(Guid id)
        {
            var i = 0;
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id == default ? DBNull.Value : id;
                        cmd.Parameters.Add("@Status", SqlDbType.Int).Value = 3;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
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
                return StatusCode(299, new { status = false, message = "Hủy phê duyệt tài liệu phòng họp không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Hủy phê duyệt tài liệu phòng họp thành công" });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("Remove")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.DOCUMENT)]
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_Remove", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@DeletedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@DeletedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Xóa tài liệu phòng họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa tài liệu phòng họp thành công" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("Restore")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.DOCUMENT)]
        public IActionResult Restore(Guid id)
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_Restore", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Khôi phục tài liệu phòng họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Khôi phục tài liệu phòng họp thành công" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }

        [HttpPost]
        [Route("Delete")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.DOCUMENT)]
        public IActionResult Delete(Guid id)
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_Delete", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;

                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Xóa tài liệu phòng họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa tài liệu phòng họp thành công" });
                        }
                    }
                }
            }
            
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString()});
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="scheduleId"></param>
        /// <returns></returns>
        [HttpPost("Upload")]
        [Authorize]
        public IActionResult UploadFile(string scheduleId)
        {
            try
            {
                // Bước 1: tạo biến để lưu thư mục cần tạo, tên thư mục cần tạo là "Files"
                string path = _config["StoreData:Location"] + "/" + _config["Application:Document:Guid"] + "/" + scheduleId;
                // Bước 2: kiểm tra nếu thư mục "Files" chưa tồn tại thì tạo mới
                if (!System.IO.Directory.Exists(path))
                    System.IO.Directory.CreateDirectory(path);
                // 1. get the file form the request
                var postedFile = Request.Form.Files;
                // 2. set the file uploaded folder
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), path);
                // 3. check for the file length, if it is more than 0 the save it
                if (postedFile.Count > 0)
                {
                    foreach (var file in postedFile)
                    {
                        // 3a. save the file on Path
                        string filePath = Path.Combine(uploadFolder, file.FileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }
                    }
                    return Ok(new { data = "File tải lên thành công" });
                }
                else
                {
                    return StatusCode(299, new { data = "Không nhận được file" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi {ex.Message}");
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="fileType"></param>
        /// <param name="scheduleId"></param>
        /// <returns></returns>
        [HttpGet("GetFile")]
        public IActionResult GetFile(string fileName, string fileType, string scheduleId)
        {
            try
            {
                string path = _config["StoreData:Location"] + "/" + _config["Application:Document:Guid"] + "/" + scheduleId + "/";
                //return Ok(new { data = (Path.Combine(Directory.GetCurrentDirectory(), path) + fileName), message= Directory.Exists(path) });
                if (Directory.Exists(path)
                    && System.IO.File.Exists(Path.Combine(Directory.GetCurrentDirectory(), path) + fileName))
                {
                    return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), path) + fileName, fileType);
                }
                else
                {
                    return StatusCode(299, new { data = false, message = "File không tồn tại" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi {ex.Message}");
            }
        }
    }
}