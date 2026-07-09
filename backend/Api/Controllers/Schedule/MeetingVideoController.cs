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
using System.IO;
using System.Linq;

namespace HTT.Api.Controllers
{
    [Route("meeting/[controller]")]
    [ApiController]
    public class MeetingVideoController : Controller
    {

        private readonly QTHT_HTT_Context _context;
        public IConfiguration _config { get; }
        public MeetingVideoController(QTHT_HTT_Context context, IConfiguration Configuration)
        {
            _context = context;
            _config = Configuration;
        }
        //[HttpGet("GetByScheduleId")]
        //[ClaimRequirement(BaseRole.READ, ModuleHelper.VIDEO)]
        //public IActionResult GetByScheduleId(int id)
        //{
        //    return Ok(new { data = new MeetingVideoContext().GetByScheduleId(id) });
        //}

        [HttpGet("GetByScheduleId")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.VIDEO)]
        public IActionResult GetByScheduleId(Guid id)
        {
            return Ok(new {status = true ,data = new MeetingVideoContext().GetByScheduleId(id,_context) });
        }

        [HttpGet("GetByFileUrl")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.VIDEO)]
        public IActionResult GetByFileUrl(string search, string url, int pageNumber, int pageSize)
        {
            var data = new MeetingVideoContext().GetByFileUrl(search, url, _context);
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("Insert")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.VIDEO)]
        public IActionResult Insert(Meeting_Video_Insert model)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var id = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Video_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
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
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
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
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.VIDEO)]
        public IActionResult InsertWithoutCreatedby(Meeting_Video_Insert model)
        {
            //var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            //var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var id = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Video_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@url", SqlDbType.NVarChar).Value = model.Url == null ? DBNull.Value : model.Url;
                        cmd.Parameters.Add("@originalname", SqlDbType.NVarChar).Value = model.OriginalName == null ? DBNull.Value : model.OriginalName;
                        cmd.Parameters.Add("@systemname", SqlDbType.NVarChar).Value = model.SystemName == null ? DBNull.Value : model.SystemName;
                        cmd.Parameters.Add("@type", SqlDbType.NVarChar).Value = model.Type == null ? DBNull.Value : model.Type;
                        cmd.Parameters.Add("@size", SqlDbType.Int).Value = model.Size == 0 ? DBNull.Value : model.Size;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = 0;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = 0;
                        con.Open();
                        id = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
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
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.VIDEO)]
        public IActionResult Update(Meeting_Video_Update model)
        {
            var id = 0;
            try
            {
                var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
                var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();

                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Video_Update", con))
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
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
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
        [HttpPut("Approve")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.VIDEO)]
        public IActionResult Approve(Meeting_Video_Update model)
        {
            var id = 0;
            try
            {
                var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
                var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();

                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Video_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = model.id == default ? DBNull.Value : model.id;
                        cmd.Parameters.Add("@Status", SqlDbType.Bit).Value = 1;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        id = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }
            if (id < 0)
            {
                return StatusCode(299, new { status = false, message = "Phê duyêt tài liệu không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Phê duyệt tài liệu thành công" });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut("UnApprove")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.VIDEO)]
        public IActionResult UnApprove(Meeting_Video_Update model)
        {
            var id = 0;
            try
            {
                var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
                var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();

                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Video_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = model.id == default ? DBNull.Value : model.id;
                        cmd.Parameters.Add("@Status", SqlDbType.Bit).Value = 0;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        id = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }
            if (id < 0)
            {
                return StatusCode(299, new { status = false, message = "Hủy duyệt tài liệu không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Hủy duyệt tài liệu thành công" });
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
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.VIDEO)]
        public IActionResult Remove(Guid id)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var i = 0;
            try
            {

                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Video_Remove", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@DeletedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@DeletedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Xóa tài liệu không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa tài liệu thành công" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
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
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.VIDEO)]
        public IActionResult Restore(Guid id)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var i = 0;
            try
            {

                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Video_Restore", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Khôi phục tài liệu không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Khôi phục tài liệu thành công" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpPost]
        [Route("Delete")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.VIDEO)]
        public IActionResult Delete(Guid id)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var i = 0;
            try
            {

                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Video_Delete", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;

                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Xóa tài liệu không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa tài liệu thành công" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
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
                string path = _config["StoreData:Location"] + "/" + _config["Application:VIDEO:Guid"] + "/" + scheduleId;
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
                string path = _config["StoreData:Location"] + "/" + _config["Application:VIDEO:Guid"] + "/" + scheduleId + "/";
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