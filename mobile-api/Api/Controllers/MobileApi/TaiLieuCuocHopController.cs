using Api;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Minio;
using Minio.DataModel.Args;
using Minio.Exceptions;
using Newtonsoft.Json;
using QTHT.Api.Models;
using QTHT.Api.Models.database;
using QTHT.Api.Models.database.Meeting.Document;
using QTHT.Api.Models.database.Meeting.Schedule;
using QTHT.Api.Services;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using static QTHT.Api.Models.QTHT_HTT_Context;

namespace QTHT.Api.Controllers.MobileApi
{
    [Route("[controller]")]
    [ApiController]
    public class TaiLieuCuocHopController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly HTT_Context _datacontext;

        public IConfiguration _config { get; }
        public TaiLieuCuocHopController(QTHT_HTT_Context context, IWebHostEnvironment webHostEnvironment, IConfiguration config, HTT_Context datacontext)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
            _config = config;
            _datacontext = datacontext;
        }
        [HttpGet("tailieucuochop")]
        public IActionResult GetByScheduleId(Guid id)
        {
            var data = new MeetingDocumentContext().GetByScheduleId(id, _context);
            if (data == null)
            {
                return NotFound(new { status = false, message = "Không có dữ liệu" });
            }
            return Ok(new { status = true, data = data });
        }

        [HttpGet("xemchitiet")]
        [Authorize]
        public IActionResult GetByFileUrl(Guid id)
        {
            var data = new MeetingDocumentContext().GetById(id);
            if (data == null)
            {
                return NotFound(new { status = false, message = "Không có dữ liệu" });
            }
            return Ok(new { status = true, data = data });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("them")]
        [Authorize]
        public IActionResult Insert(Meeting_Document_Insert model)
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var schedule = new MeetingScheduleContext().GetById(_context, model.ScheduleId);
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            DateTime date = DateTime.Now;
            Guid id = Guid.NewGuid();
            phan_quyen_vai_tro_nguoi_dung phan_quyen = _context.phan_quyen_vai_tro_nguoi_dung.Where(X => X.ten_dangnhap_nguoidung == user_current).FirstOrDefault();

            if (phan_quyen == null)
            {
                return StatusCode(299, new { status = false, message = "Tài khoản không có quyền" });
            }

            List<string> vaitros = JsonConvert.DeserializeObject<List<string>>(phan_quyen.ma_ds_vaitros);

            List<string> ds_chuc_nang = new List<string>();

            foreach (var c in vaitros)
            {
                var quyen = _context.vai_tro_nguoi_dung
                    .Where(x => x.ma == c)
                    .FirstOrDefault();
                List<string> chuc_nangs = JsonConvert.DeserializeObject<List<string>>(quyen.ma_ds_thong_tin_chuc_nangs);
                foreach (var b in chuc_nangs)
                {
                    var mota_chucnang = _context.thong_tin_chuc_nang.Where(x => x.ma == b).Select(x => x.mota).FirstOrDefault();
                    ds_chuc_nang.Add(mota_chucnang);
                }
            }


            if (user != schedule.ChairMan && user != schedule.SharedRole && !ds_chuc_nang.Contains("Schedule"))
            {
                return StatusCode(299, new { status = false, message = "Tài khoản không có quyền" });
            }

            try
            {
                Meeting_Document model1 = new Meeting_Document();

                model1.Id = id;
                model1.Title = model.Title;
                model1.ScheduleId = model.ScheduleId;
                model1.FileUrl = model.Url;
                model1.FileOriginalName = model.OriginalName;
                model1.FileSystemName = model.SystemName;
                model1.FileSize = model.Size;
                model1.FileType = model.Type;
                model1.Status = model.Status;
                model1.CreatedBy = user;
                model1.CreatedDate = date;
                _datacontext.Meeting_Document.Add(model1);
                _datacontext.SaveChanges();
            }
            catch (Exception e)
            {
                return Ok(new { status = false, message = e.Message });
            }
            return Ok(new { status = true, data = id, message = "Thêm tài liệu thành công" });
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("InsertWithoutCreatedby")]
        //[Authorize]
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
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = 0;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = model.CreatedDate == default ? DBNull.Value : model.CreatedDate;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = 0;
                        con.Open();
                        id = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                return Ok(new { status = false, message = e.Message });
            }
            if (id < 0)
            {
                return StatusCode(299, new { status = false, message = "Không thêm được tài liệu" });
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
        [HttpPut("chinhsua")]
        [Authorize]
        public IActionResult Update(Meeting_Document_Update model)
        {
            var id = 0;
            try
            {
                var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
                var user_current = userCurrentClaim?.Value;

                if (string.IsNullOrEmpty(user_current))
                {
                    var usernameClaim = User?.FindFirst("username");
                    user_current = usernameClaim?.Value;
                }
                var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();

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
                return Ok(new { status = false, message = e.Message });
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
        [HttpPut("xacnhan")]
        [Authorize]
        public IActionResult Approve([FromQuery] Guid id)
        {
            var i = 0;
            try
            {
                var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
                var user_current = userCurrentClaim?.Value;

                if (string.IsNullOrEmpty(user_current))
                {
                    var usernameClaim = User?.FindFirst("username");
                    user_current = usernameClaim?.Value;
                }
                var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();

                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@Status", SqlDbType.Bit).Value = 1;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                return Ok(new { status = false, message = e.Message });
            }
            if (i < 0)
            {
                return StatusCode(299, new { status = false, message = "Không phê duyệt được tài liệu" });
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
        [HttpPut("huyxacnhan")]
        [Authorize]
        public IActionResult UnApprove([FromQuery] Guid id)
        {
            var i = 0;
            try
            {
                var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
                var user_current = userCurrentClaim?.Value;

                if (string.IsNullOrEmpty(user_current))
                {
                    var usernameClaim = User?.FindFirst("username");
                    user_current = usernameClaim?.Value;
                }
                var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();

                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_Update_Status", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@Status", SqlDbType.Bit).Value = 0;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = DateTime.Now;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                return Ok(new { status = false, message = e.Message });
            }
            if (i < 0)
            {
                return StatusCode(299, new { status = false, message = "Không hủy duyệt được tài liệu" });
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
                return Ok(new { status = false, message = ex.ToString() });
            }
        }


        [HttpGet]
        [Route("danhsachdaxoa")]
        [AllowAnonymous]
        public IActionResult RemoveList(Guid? scheduleid, int pageSize = 10, int pageNumber = 1)
        {
            //var user_current = User.FindFirst(ClaimTypes.Name).Value;
            //var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            var i = 0;
            try
            {
                var list = new MeetingDocumentContext().GetAllDeleted(scheduleid, _context);
                var data = list.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                return Ok(new { status = true, data = data });
            }
            catch (Exception ex)
            {
                return Ok(new { status = false, message = ex.ToString() });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("khoiphuc")]
        [Authorize]
        public IActionResult Restore(Guid id)
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
                return Ok(new { status = false, message = ex.ToString() });
            }
        }

        [HttpDelete]
        [Route("xoahoantoan")]
        [Authorize]
        public IActionResult Delete(Guid id)
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Document_Delete", con))
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
                return Ok(new { data = i, message = ex.ToString() });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="scheduleId"></param>
        /// <returns></returns>
        [HttpPost("taiteptinlen")]
        [AllowAnonymous]
        public IActionResult UploadFiles(List<IFormFile> files, string scheduleId)
        {
            try
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
                string minioAccessKey = _config["minioConfig:accessKey"];
                string minioSecretKey = _config["minioConfig:secretKey"];
                string minioBucket = _config["minioConfig:keybucket"];
                string minioEndpoint = _config["minioConfig:endpoint"];

                // Decrypt secret key
                var minioDataSecretKey = EncryptionHelper.Decrypt(minioAccessKey, minioSecretKey);

                // Create MinIO client
                var minio = new MinioClient()
                    .WithEndpoint(minioEndpoint)
                    .WithCredentials(minioAccessKey, minioDataSecretKey)
                    .Build();

                // Check if there are files to upload
                if (files == null || files.Count == 0)
                {
                    return StatusCode(299, "No files provided for upload.");
                }
                foreach (var file in files)
                {
                    Meeting_Document document = new Meeting_Document();
                    Guid id = Guid.NewGuid();
                    document.Id = id;
                    document.Title = file.FileName;
                    document.ScheduleId = Guid.Parse(scheduleId);
                    document.FileUrl = "tailieu/" + scheduleId;
                    document.FileOriginalName = file.FileName;
                    document.FileSize = Convert.ToInt32(file.Length);
                    document.FileType = file.ContentType;
                    document.CreatedDate = date;
                    document.IsDeleted = false;
                    document.CreatedBy = user;
                    _datacontext.Meeting_Document.Add(document);
                    _datacontext.SaveChanges();

                    string filePath = "tailieu" + "/" + scheduleId + "/" + file.FileName;
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
                }

                return Ok(new { status = true, message = "Thành công upload file" });
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
        [AllowAnonymous]

        public async Task<IActionResult> GetFile(string fileName, string scheduleId)
        {
            try
            {
                string objectKey = "tailieu/" + scheduleId + "/" + fileName;


                // Extract credentials and bucket details from JSON
                string minioAccessKey = _config["minioConfig:accessKey"];
                string minioSecretKey = _config["minioConfig:secretKey"];
                string minioBucket = _config["minioConfig:keybucket"];
                string minioEndpoint = _config["minioConfig:endpoint"]; ;

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


        [HttpGet("danhsachphonghop")]
        [Authorize]
        public IActionResult ListMeetingSchedule(string? search, DateTime? dateFrom, DateTime? dateTo, int pageSize = 10, int pageNumber = 1)
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var ma_tochuc = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var id_tochuc = _context.thong_tin_don_vi.Where(x => x.ma == ma_tochuc).Select(x => x.Id).FirstOrDefault();
            List<Meeting_Schedule> list = new List<Meeting_Schedule>();
            List<Meeting_Document> listDoc = _datacontext.Meeting_Document.Where(x => x.IsDeleted == false && x.Status == 1).OrderByDescending(x => x.CreatedDate).ToList();
            foreach (var c in listDoc)
            {
                var meeting = new MeetingScheduleContext().GetById(_context, c.ScheduleId);
                if (meeting != null)
                {
                    list.Add(meeting);
                }

            }
            var datalist = list
                .Where(x => x.don_vi == id_tochuc)
                .OrderByDescending(x => x.CreatedDate)
                .GroupBy(x => x.Id)
                .Select(g => g.First())
                .ToList();
            if (dateFrom.HasValue)
            {
                datalist = list.Where(x => x.don_vi == id_tochuc && x.CreatedDate >= dateFrom).OrderByDescending(x => x.CreatedDate).ToList();
            }
            if (dateTo.HasValue)
            {
                datalist = list.Where(x => x.don_vi == id_tochuc && x.CreatedDate <= dateFrom).OrderByDescending(x => x.CreatedDate).ToList();
            }
            if (!string.IsNullOrEmpty(search))
            {
                datalist = datalist.Where(x => x.Title.Contains(search)).ToList();
            }
            int totalCount = datalist.Count();
            var data = datalist.Skip((pageNumber - 1) * pageSize)
                .Take(pageSize).ToList();
            return Ok(new { status = true, data = data });
        }


        [HttpGet("danhmucxacnhan")]
        [Authorize]
        public IActionResult ListAccept(Guid scheduleId, int pageSize = 10, int pageNumber = 1)
        {
            var list = _datacontext.Meeting_Document.Where(x => x.ScheduleId == scheduleId && x.IsDeleted == false && x.Status == 1).ToList();
            var totalCount = list.Count();
            var data = list.Skip((pageNumber - 1) * pageSize)
                .Take(pageSize).ToList();
            return Ok(new { status = true, data = data });
        }

    }
}
