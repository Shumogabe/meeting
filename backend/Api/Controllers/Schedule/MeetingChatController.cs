using Api;
using HTT.Api.Helpers;
using HTT.Api.Models;
using HTT.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using System.IO;
using System.Linq;

namespace HTT.Api.Controllers
{
    [Route("meeting/[controller]")]
    [ApiController]
    public class MeetingChatController : Controller
    {
        private readonly QTHT_HTT_Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public IConfiguration _config { get; }

        public MeetingChatController(IConfiguration Configuration, IWebHostEnvironment webHostEnvironment, QTHT_HTT_Context context)
        {
            _webHostEnvironment = webHostEnvironment;
            _config = Configuration;
            _context = context;
        }

        [HttpGet("GetByScheduleId")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.CHAT)]
        public IActionResult GetByScheduleId(Guid id)
        {
            return Ok(new { status = 200, data = new MeetingChatContext().GetByScheduleId(id) });
        }

        [HttpGet("GetByFileUrl")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.CHAT)]
        public IActionResult GetByFileUrl(string url)
        {
            return Ok(new { status = 200, data = new MeetingChatContext().GetByFileUrl(url) });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("Insert")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.CHAT)]
        public IActionResult Insert(Meeting_Chat_Insert model)
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
            var id = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Chat_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Content == null ? DBNull.Value : model.Content;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@url", SqlDbType.NVarChar).Value = model.Url == null ? DBNull.Value : model.Url;
                        cmd.Parameters.Add("@originalname", SqlDbType.NVarChar).Value = model.OriginalName == null ? DBNull.Value : model.OriginalName;
                        cmd.Parameters.Add("@systemname", SqlDbType.NVarChar).Value = model.SystemName == null ? DBNull.Value : model.SystemName;
                        cmd.Parameters.Add("@type", SqlDbType.NVarChar).Value = model.Type == null ? DBNull.Value : model.Type;
                        cmd.Parameters.Add("@size", SqlDbType.Int).Value = model.Size == 0 ? DBNull.Value : model.Size;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = 0;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = user;
                        con.Open();
                        id = cmd.ExecuteNonQuery();
                        if (id < 0) return StatusCode(299, new { message = "Thêm không thành công" });
                    }
                }
                return Ok(new { status = 200, data = id, message = "Thêm thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, data = id, message = e.Message });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        // [Authorize]
        [Route("InsertWithoutCreatedby")]
        //[Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.CHAT)]
        public IActionResult InsertWithoutCreatedby(Meeting_Chat_Insert model)
        {
            // var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            // var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var id = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Chat_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Content == null ? DBNull.Value : model.Content;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@url", SqlDbType.NVarChar).Value = model.Url == null ? DBNull.Value : model.Url;
                        cmd.Parameters.Add("@originalname", SqlDbType.NVarChar).Value = model.OriginalName == null ? DBNull.Value : model.OriginalName;
                        cmd.Parameters.Add("@systemname", SqlDbType.NVarChar).Value = model.SystemName == null ? DBNull.Value : model.SystemName;
                        cmd.Parameters.Add("@type", SqlDbType.NVarChar).Value = model.Type == null ? DBNull.Value : model.Type;
                        cmd.Parameters.Add("@size", SqlDbType.Int).Value = model.Size == 0 ? DBNull.Value : model.Size;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = 0;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = model.CreatedDate == default ? DBNull.Value : model.CreatedDate;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = 0;
                        con.Open();
                        id = cmd.ExecuteNonQuery();

                        if (id < 0) return StatusCode(299, new { message = "Không thêm được tài liệu" });
                    }
                }
                if (id < 0)
                {
                    return StatusCode(299, new { status = 299, message = "Thêm tài liệu không thành công" });
                }
                else
                {
                    return StatusCode(200, new { status = 200, message = "Thêm tài liệu thành công" });
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, data = id, message = e.Message });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut("Update")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.CHAT)]
        public IActionResult Update(Meeting_Chat_Update model)
        {
            var id = 0;
            try
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
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Chat_Update", con))
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
                        cmd.Parameters.Add("@Status", SqlDbType.Bit).Value = model.Status;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        id = cmd.ExecuteNonQuery();

                        if (id < 0) return StatusCode(299, new { message = "Không chỉnh sửa được tài liệu" });
                    }
                }
                return Ok(new { status = 200, data = id, message = "Chỉnh sửa tài liệu thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, data = id, message = e.Message });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut("Approve")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.CHAT)]
        public IActionResult Approve(Meeting_Chat_Update model)
        {
            var id = 0;
            try
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

                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Chat_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = model.id == default ? DBNull.Value : model.id;
                        cmd.Parameters.Add("@Status", SqlDbType.Bit).Value = 1;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        id = cmd.ExecuteNonQuery();

                        if (id < 0) return StatusCode(299, new { message = "Không phê duyệt được tài liệu" });
                    }
                }
                return Ok(new { status = 200, data = id, message = "Phê duyệt tài liệu thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, data = id, message = e.Message });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut("UnApprove")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.CHAT)]
        public IActionResult UnApprove(Meeting_Chat_Update model)
        {
            var id = 0;
            try
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

                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Chat_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = model.id == default ? DBNull.Value : model.id;
                        cmd.Parameters.Add("@Status", SqlDbType.Bit).Value = 0;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        id = cmd.ExecuteNonQuery();

                        if (id < 0) return StatusCode(299, new { message = "Không hủy duyệt được tài liệu" });
                    }
                }
                return Ok(new { status = 200, data = id, message = "Hủy duyệt tài liệu thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, data = id, message = e.Message });
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
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.CHAT)]
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
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            try
            {

                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Chat_Remove", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@DeletedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@DeletedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();

                        if (i < 0) return StatusCode(299, new { message = "Không xóa được dữ liệu" });
                    }
                }
                return Ok(new { status = 200, data = i, message = "Xóa thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, data = i, message = ex.ToString() });
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
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.CHAT)]
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
                return StatusCode(299, new { status = 299, Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            try
            {

                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Chat_Restore", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();

                        if (i < 0) return StatusCode(299, new { message = "Không khôi phục được dữ liệu" });
                    }
                }
                return Ok(new { status = 200, data = i, message = "Khôi phục thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, data = i, message = ex.ToString() });
            }
        }

        [HttpPost]
        [Route("Delete")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.CHAT)]
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Chat_Delete", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;

                        con.Open();
                        i = cmd.ExecuteNonQuery();

                        if (i < 0) return StatusCode(299, new { message = "Không xóa được dữ liệu" });
                    }
                }
                return Ok(new { status = 200, data = i, message = "Xóa thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, data = i, message = ex.ToString() });
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
                    return Ok(new { status = 200, data = "File tải lên thành công" });
                }
                else
                {
                    return StatusCode(299, new { status = 299, data = "Không nhận được file" });
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
                    return StatusCode(299, new { status = 299, data = false, message = "File không tồn tại" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi {ex.Message}");
            }
        }
    }
}