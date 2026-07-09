using Api;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Minio;
using Minio.DataModel.Args;
using Minio.Exceptions;
using QTHT.Api.Models;
using QTHT.Api.Models.database.Meeting.Conslusion;
using QTHT.Api.Services;
using System;
using System.Data;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using static QTHT.Api.Models.QTHT_HTT_Context;

namespace QTHT.Api.Controllers.MobileApi
{
    [Route("[controller]")]
    [Authorize]
    [ApiController]
    public class KetLuanCuocHopController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _datacontext;
        public KetLuanCuocHopController(IConfiguration configuration, QTHT_HTT_Context context, HTT_Context datacontext)
        {
            _datacontext = datacontext;
            _configuration = configuration;
            _context = context;
        }
        /// <summary>
        /// Người chủ trì có thể xác nhận kết luận cuộc họp trên thiết bị di động, hệ thống cập nhật xác nhận kết luận trên thiết bị di động và thông báo thành công
        /// </summary>
        /// <param name="Id">Id cuộc họp</param>
        /// <returns>Đưa ra thông báo thành công </returns>
        #region
        [HttpPut("xacnhan")]
        public IActionResult ConfirmConclision(Guid Id)
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = Id;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = 2;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Không xác nhận được kết luận" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xác nhận kết luận cuộc họp thành công" });
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpPut("huyxacnhan")]
        public IActionResult UnConfirmConclision(Guid Id)
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = Id;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = 3;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Không hủy được xác nhận được kết luận" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Hủy xác nhận kết luận cuộc họp thành công" });
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
        /// Người chủ trì, Thư ký, Đại biểu, Khách mời có thể xem kết luận cuộc họp trên thiết bị di động, hệ thống lấy thông tin kết luận trên thiết bị di động và hiển thị
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("ketluancuochop")]
        public IActionResult GetByScheduleId(Guid id, string search, int pageNumber = 1, int pageSize = 10)
        {
            var data = new MeetingConslusionContext().GetByScheduleId(id, search);
            var totalRecords = data.Count();
            var records = data
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            return Ok(new { status = true, data = records });
        }


        /// <summary>
        /// Người chủ trì có thể thêm kết luận cuộc họp trên thiết bị di động, hệ thống thêm mới kết luận trên thiết bị di động và thông báo thành công
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Đưa ra thông báo thêm kết luận thành công</returns>
        [HttpPost("them")]
        public IActionResult Insert(Meeting_Conclusion_Insert model)
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            DateTime date = DateTime.Now;
            Guid id = Guid.NewGuid();
            var meeting_conclusion = new MeetingConslusionContext().GetById(id);
            if (meeting_conclusion.Title != null)
            {
                return StatusCode(299, new { status = false, message = "Kết luận cuộc họp đã tồn tại" });
            }
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
                        cmd.Parameters.Add("@url", SqlDbType.NVarChar).Value = model.FileUrl ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@originalname", SqlDbType.NVarChar).Value = model.FileOriginalName ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@systemname", SqlDbType.NVarChar).Value = model.FileSystemName ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@type", SqlDbType.NVarChar).Value = model.FileType ?? (object)DBNull.Value;
                        cmd.Parameters.Add("@size", SqlDbType.Int).Value = model.FileSize == 0 ? (object)DBNull.Value : model.FileSize;
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

                        // Get the new Id from the output parameter
                        var newId = (Guid)newIdParam.Value;

                        return Ok(new { status = true, data = newId, message = "Thêm kết luận cuộc họp thành công" });
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }

        }
        /// <summary>
        /// Người chủ trì có thể sửa kết luận cuộc họp trên thiết bị di động, hệ thống sửa kết luận trên thiết bị di động và thông báo thành công
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns>Đưa ra thông báo đã sửa thành công</returns>
        [HttpPut("chinhsua")]
        public IActionResult Update(Meeting_Conclusion_Update model)
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
            var meeting_conclusion = new MeetingConslusionContext().GetById(model.Id);
            if (meeting_conclusion == null)
            {
                return StatusCode(299, new { status = false, message = "Không có dữ liệu" });
            }
            DateTime date = DateTime.Now;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = model.Id;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = model.ScheduleId == default ? DBNull.Value : model.ScheduleId;
                        cmd.Parameters.Add("@content", SqlDbType.NText).Value = model.Content == null ? DBNull.Value : model.Content;
                        cmd.Parameters.Add("@url", SqlDbType.NVarChar).Value = model.FileUrl == null ? DBNull.Value : model.FileUrl;
                        cmd.Parameters.Add("@originalname", SqlDbType.NVarChar).Value = model.FileOriginalName == null ? DBNull.Value : model.FileOriginalName;
                        cmd.Parameters.Add("@systemname", SqlDbType.NVarChar).Value = model.FileSystemName == null ? DBNull.Value : model.FileSystemName;
                        cmd.Parameters.Add("@type", SqlDbType.NVarChar).Value = model.FileType == null ? DBNull.Value : model.FileType;
                        cmd.Parameters.Add("@size", SqlDbType.Int).Value = model.FileSize == 0 ? DBNull.Value : model.FileSize;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = date;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = model.Status;
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
                return StatusCode(299, new { status = false, message = "Chỉnh sửa kết luận cuộc họp không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Chỉnh sửa kết luận cuộc họp thành công" });
            }
        }
        /// <summary>
        /// Người chủ trì có thể xóa kết luận cuộc họp trên thiết bị di động, hệ thống xóa kết luận trên thiết bị di động và thông báo thành công
        /// </summary>
        /// <param name="id">Id cuộc họp</param>
        /// <returns>Trả về thông báo xóa kết luận thành công</returns>
        [HttpDelete("xoa")]
        [Authorize]
        public IActionResult Remove(Guid id)
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
            DateTime date = DateTime.Now;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Conclusion_Remove", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@deletedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@deletedDate", SqlDbType.Date).Value = date;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Xóa kết luận cuộc họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa kết luận cuộc họp thành công" });
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpGet("chitietketluan")]
        [Authorize]
        public IActionResult Detail(Guid id)
        {
            var data = new MeetingConslusionContext().GetById(id);
            if (data.Title == null)
            {
                return NotFound(new { status = false, message = "Không tìm thấy kết luận" });
            }
            return Ok(new { status = true, data = data });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="files"></param>
        /// <param name="scheduleId"></param>
        /// <returns></returns>
        [HttpPost("taiteptinlen")]
        [AllowAnonymous]
        public IActionResult UploadFiles(IFormFile file, string scheduleId)
        {
            try
            {

                //var user_current = User.FindFirst(ClaimTypes.Name).Value;
                //var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
                DateTime date = DateTime.Now;

                string minioAccessKey = _configuration["minioConfig:accessKey"];
                string minioSecretKey = _configuration["minioConfig:secretKey"];
                string minioBucket = _configuration["minioConfig:keybucket"];
                string minioEndpoint = _configuration["minioConfig:endpoint"]; ;

                // Decrypt secret key
                var minioDataSecretKey = EncryptionHelper.Decrypt(minioAccessKey, minioSecretKey);

                // Create MinIO client
                var minio = new MinioClient()
                    .WithEndpoint(minioEndpoint)
                    .WithCredentials(minioAccessKey, minioDataSecretKey)
                    .Build();

                // Check if there are files to upload
                if (file == null)
                {
                    return StatusCode(299, "No files provided for upload.");
                }



                string filePath = "ketluan" + "/" + scheduleId + "/" + file.FileName;
                if (file.Length == 0)
                {
                    return StatusCode(299, $"File '{file.FileName}' is empty.");
                }

                using (var bs = file.OpenReadStream()) // Open the stream
                {
                    var putObjectArgs = new PutObjectArgs()
                        .WithBucket(minioBucket)
                        .WithObject(Path.Combine(filePath))
                        .WithStreamData(bs) // Use the stream directly
                        .WithContentType(file.ContentType)
                        .WithObjectSize(file.Length);

                    minio.PutObjectAsync(putObjectArgs).ConfigureAwait(false); // Upload the object
                }


                return Ok(new
                {
                    status = true,
                    data = new
                    {
                        fileUrl = filePath,
                        fileName = file.FileName,
                        contentType = file.ContentType,
                        fileSize = file.Length
                    },
                    message = "Thành công upload file"
                });

            }
            catch (MinioException ex)
            {
                return StatusCode(500, new { status = false, message = $"Lỗi minio: {ex.Message}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="fileName"></param>
        /// <param name="fileType"></param>
        /// <param name="scheduleId"></param>
        /// <returns></returns>
        [HttpGet("laytep")]
        [Authorize]
        public async Task<IActionResult> GetFile(string fileName, string scheduleId)
        {
            try
            {
                string objectKey = "ketluan/" + scheduleId + "/" + fileName;


                // Extract credentials and bucket details from JSON
                string minioAccessKey = _configuration["minioConfig:accessKey"];
                string minioSecretKey = _configuration["minioConfig:secretKey"];
                string minioBucket = _configuration["minioConfig:keybucket"];
                string minioEndpoint = _configuration["minioConfig:endpoint"]; ;

                var minioDataSecretKey = EncryptionHelper.Decrypt(minioAccessKey, minioSecretKey);

                // Create MinIO client
                var minio = new MinioClient()
                    .WithEndpoint(minioEndpoint)
                    .WithCredentials(minioAccessKey, minioDataSecretKey)
                    .Build();

                // Check if the bucket exists
                var bucketExistsArgs = new BucketExistsArgs().WithBucket(minioBucket);
                var found = await minio.BucketExistsAsync(bucketExistsArgs).ConfigureAwait(false);

                if (!found)
                {
                    return StatusCode(299, new { status = false, message = $"Bucket '{minioBucket}' not found" });
                }
                var memoryStream = new MemoryStream();
                GetObjectArgs args = new GetObjectArgs()
                    .WithBucket(minioBucket)
                    .WithObject(objectKey)
                    .WithCallbackStream((stream) =>
                    {
                        stream.CopyTo(memoryStream);
                    });
                await minio.GetObjectAsync(args);

                memoryStream.Position = 0;

                // Return the file for download
                return File(memoryStream, "application/octet-stream", fileName);

            }
            catch (MinioException ex)
            {
                return StatusCode(500, new { status = false, message = $"Lỗi Minio:: {ex.Message}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        #endregion
    }
}