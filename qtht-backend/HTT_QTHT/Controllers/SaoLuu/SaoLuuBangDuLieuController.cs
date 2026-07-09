using HTT_QTHT.Api.Helpers;
using HTT_QTHT.Api.Services;
using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;
using ICSharpCode.SharpZipLib.Zip;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Minio;
using Minio.ApiEndpoints;
using Minio.DataModel.Args;
using Minio.Exceptions;
using NPOI.SS.Formula.Functions;
using NPOI.Util;
using System.Data;
using System.Diagnostics;
using System.IO.Compression;
using System.Reactive.Linq;
using System.Text;
using System.Text.Json;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class SaoLuuBangDuLieuController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        private readonly IWebHostEnvironment _hostEnvironment;
        public SaoLuuBangDuLieuController(IConfiguration configuration, IWebHostEnvironment hostEnvironment, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _configuration = configuration;
            _hostEnvironment = hostEnvironment;
            _context = context;
        }

        [HttpPost("sao_luu_bang_du_lieu/upsert")]
        public IActionResult Upsert_saoluu_bangdulieu(sao_luu_bang_du_lieu dataSend)
        {
            if (dataSend.ten_bang.Count() < 0 || string.IsNullOrEmpty(dataSend.tenfile_saoluu))
            {
                return StatusCode(400, "ten_bang_and_tenfile_saoluu_required");
            }
            var thoigian = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
            var maCreate = Utils.ToID(string.Join("-", dataSend.ten_bang) + "-" + dataSend.tenfile_saoluu + "-" + thoigian);
            var _DbItem = _context.sao_luu_bang_du_lieu.Find(maCreate);
            if (_DbItem == null)
            {
                if (!string.IsNullOrEmpty(dataSend.ma) && dataSend.ma != maCreate)
                {
                    var obj_delete = _context.sao_luu_bang_du_lieu.Find(dataSend.ma);
                    if (obj_delete != null)
                        _context.sao_luu_bang_du_lieu.Remove(obj_delete);
                }
                dataSend.ma = maCreate;
                dataSend.thoigian_saoluu = thoigian;
                _context.sao_luu_bang_du_lieu.Add(dataSend);
            }
            else
            {
                _DbItem.Assign(dataSend);
                _context.sao_luu_bang_du_lieu.Update(_DbItem);
            }
            _context.SaveChanges();

            var type = _context.thiet_lap_co_che_sao_luu.Where(x => dataSend.ten_bang.Contains(x.ten_bang) && x.tenfile_saoluu == dataSend.tenfile_saoluu).Select(x => x.dinh_dang).FirstOrDefault();

            dataSend.tenfile_saoluu = dataSend.tenfile_saoluu + (type == null ? ".sql" : "." + type);

            return Ok(dataSend);
        }

        [HttpGet("sao_luu_bang_du_lieu/{id}")]
        public IActionResult Get_saoluu_bangdulieu_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var _DbItem = _context.sao_luu_bang_du_lieu.Find(id);
            if (_DbItem == null)
                return StatusCode(400, "id_notFound");
            if (_DbItem != null && _DbItem.ten_bang != null)
            {
                var allTable = _httcontext.Model.GetEntityTypes();
                List<bangdulieu> List = new List<bangdulieu>();
                foreach (var item in allTable)
                {
                    bangdulieu Bangdulieu = new bangdulieu();
                    Bangdulieu.ma = item.ClrType.Name;
                    Bangdulieu.ten_bang = item.ClrType.Name;
                    Bangdulieu.thoigian_saoluu = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                    List.Add(Bangdulieu);
                }
                var ListBangDuLieu = List
                .Where(t => _DbItem.ten_bang.Contains(t.ma))
                .ToList();
                _DbItem.ds_ten_bang = ListBangDuLieu;
            }
            return Ok(_DbItem);
        }

        [HttpPost("sao_luu_bang_du_lieu/delete/{id}")]
        public IActionResult Delete_saoluu_bangdulieu_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.sao_luu_bang_du_lieu.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            _context.sao_luu_bang_du_lieu.Remove(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("sao_luu_bang_du_lieus")]
        public IActionResult List_saoluu_bangdulieus(CommonRequest req)
        {
            var qr = _context.sao_luu_bang_du_lieu.AsQueryable();

            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.ten_bang.ToString().ToUpper().Contains(tuKhoaUpper) || t.tenfile_saoluu.ToUpper().Contains(tuKhoaUpper));
            }
            if (req?.filter_time_from > 0)
            {
                qr = qr.Where(t => t.thoigian_saoluu >= req.filter_time_from);
            }
            if (req?.filter_time_to > 0)
            {
                qr = qr.Where(t => t.thoigian_saoluu <= req.filter_time_to);
            }

            var recordCount = 0;
            if (string.IsNullOrEmpty(req.anchor))
            {
                recordCount = qr.Count();
            }
            qr = qr.OrderByDescending(k => k.thoigian_saoluu).ThenBy(k => k.ma);
            if (req.anchor != null && req.anchor.Trim() != "")
            {
                string[] parts = req.anchor.Split('#');
                if (parts.Length >= 2)
                {
                    if (long.TryParse(parts[0], out long anchorCreated))
                    {
                        string anchorMaDinhDanh = parts[1];
                        qr = qr.Where(k => k.thoigian_saoluu < anchorCreated || (k.thoigian_saoluu == anchorCreated && k.ma.CompareTo(anchorMaDinhDanh) > 0));
                    }
                }
            }

            if (req.limit < 1)
            {
                req.limit = 10000;
            }
            qr = qr.Take(req.limit + 1);

            var listRecords = qr.ToList();

            var res = new sao_luu_bang_du_lieus
            {
                limit = req.limit
            };
            if (listRecords.Count > req.limit)
            {
                var anchorResMaDinhDanh = listRecords[req.limit - 1].ma;
                var anchorCreatedNumber = listRecords[req.limit - 1].thoigian_saoluu;
                var anchorResCreated = "";
                // Chuyển đổi số thành chuỗi nếu số lớn hơn 0, ngược lại giữ nguyên chuỗi rỗng
                anchorResCreated = anchorCreatedNumber > 0 ? anchorCreatedNumber.ToString() : "";

                res.anchor = String.Concat(anchorResCreated, "#", anchorResMaDinhDanh);
                res.Records = listRecords.Take(req.limit).ToList();
            }
            else
            {
                res.Records = listRecords;
            }
            res.count = recordCount;

            //foreach (var record in listRecords)
            //{
            //    record.ds_ten_bang = string.Join("-", record.ten_bang);
            //}

            return Ok(res);
        }

        [HttpPost("sao_luu_bang_du_lieu-downloadfile")]
        public async Task<IActionResult> DownloadFile_saoluu_bangdulieu(sao_luu_bang_du_lieu dataSend)
        {

            try
            {
                string content = "";
                List<string> items = new List<string>();
                try
                {
                    using (Microsoft.Data.SqlClient.SqlConnection con = new Microsoft.Data.SqlClient.SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        foreach (string ten in dataSend.ten_bang)
                        {
                            using (Microsoft.Data.SqlClient.SqlCommand cmd = new Microsoft.Data.SqlClient.SqlCommand("sp_generate_insertscripts", con))
                            {
                                con.Open();
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.Add("@TABLE_NAME", SqlDbType.NVarChar).Value = ten;
                                SqlDataReader dr = cmd.ExecuteReader();

                                while (dr.Read())
                                {
                                    var space = "\n" + new string('-', 1000) + "\n";
                                    var create = dr.IsDBNull("Create_Scripts") == true ? default : (string)dr["Create_Scripts"];
                                    content += !content.Contains(create) ? space + create : "";
                                    content += space;
                                    content += dr.IsDBNull("Insert_Scripts") == true ? default : (string)dr["Insert_Scripts"];
                                }
                                cmd.Dispose();
                                dr.Close();
                                con.Close();
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = ex.Message });
                }

                var filePath = dataSend.tenfile_saoluu + ".sql";

                var byteArray = Encoding.UTF8.GetBytes(content);

                var stream = new MemoryStream(byteArray);

                var file = File(stream, "application/octet-stream", filePath);

                return file;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Chi tiết lỗi: {ex.Message}");
            }
        }

        [HttpPost("sao_luu_bang_du_lieu-uploadfile")]
        public async Task<IActionResult> UploadFile_saoluu_bangdulieu(sao_luu_bang_du_lieu dataSend)
        {
            dataSend.tenfile_saoluu = Path.GetFileNameWithoutExtension(dataSend.tenfile_saoluu);
            try
            {
                string content = "";
                List<string> items = new List<string>();
                try
                {
                    var space = "\n" + new string('-', 1000) + "\n";
                    var stringBuilder = new StringBuilder();
                    using (var con = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                    {
                        con.Open();
                        foreach (string ten in dataSend.ten_bang)
                        {
                            using (var cmd = new SqlCommand("sp_generate_insertscripts", con))
                            {
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.Parameters.Add("@TABLE_NAME", SqlDbType.NVarChar).Value = ten;

                                using (var dr = cmd.ExecuteReader())
                                {
                                    while (dr.Read())
                                    {
                                        var create = dr.IsDBNull(dr.GetOrdinal("Create_Scripts")) ? null : dr.GetString(dr.GetOrdinal("Create_Scripts"));
                                        if (!string.IsNullOrEmpty(create) && !content.Contains(create))
                                        {
                                            stringBuilder.Append(space);
                                            stringBuilder.Append(create);
                                        }
                                        stringBuilder.Append(space);
                                        var insert = dr.IsDBNull(dr.GetOrdinal("Insert_Scripts")) ? null : dr.GetString(dr.GetOrdinal("Insert_Scripts"));
                                        if (!string.IsNullOrEmpty(insert))
                                        {
                                            stringBuilder.Append(insert);
                                        }
                                    }
                                }
                            }
                        }
                        con.Close();
                    }
                    content = stringBuilder.ToString();
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = ex.Message });
                }

                var type = _context.thiet_lap_co_che_sao_luu.Where(x => dataSend.ten_bang.Contains(x.ten_bang) && x.tenfile_saoluu == dataSend.tenfile_saoluu).Select(x => x.dinh_dang).FirstOrDefault();

                var filePath = dataSend.tenfile_saoluu + ".sql";

                var byteArray = Encoding.UTF8.GetBytes(content);

                var stream = new MemoryStream(byteArray);

                var file = File(stream, "application/octet-stream", filePath);

                //var minio_config = new ManagementController(_configuration, _httcontext, _context).GetMinIO_Config();

                try
                {
                    var cf = _configuration.GetSection("HeThong:HeThong_minio");
                    string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                    using (JsonDocument document = JsonDocument.Parse(cf.Get<CauHinhItem>().giatri))
                    {
                        JsonElement root = document.RootElement;
                        minioAccessKey = root.GetProperty("usr").GetString();
                        minioSecretKey = root.GetProperty("pw").GetString();
                        minioBucket = root.GetProperty("bucket").GetString();
                        minioEndpoint = root.GetProperty("domain").GetString();
                    }

                    var minioDataSecretKey = EncryptionHelper.Decrypt(minioAccessKey, minioSecretKey);

                    // Create MinIO client
                    var minio = new MinioClient()
                        .WithEndpoint(minioEndpoint)
                        .WithCredentials(minioAccessKey, minioDataSecretKey)
                        .Build();
                    //string minio_accessKey = minio_config.usr.ToString();
                    //string minio_secretKey = minio_config.pw.ToString();
                    //var minio_data_secretKey = EncryptionHelper.Decrypt(minio_accessKey, minio_secretKey);
                    //string minio_bucket = minio_config.bucket.ToString();
                    //string minio_endpoint = minio_config.domain.ToString();
                    if (file == null || file.FileStream.Length <= 0)
                    {
                        return StatusCode(299, "Chưa có file để đẩy lên");
                    }
                    //var minio = new MinioClient()
                    //.WithEndpoint(minio_endpoint)
                    //.WithCredentials(minio_accessKey, minio_data_secretKey)
                    //.Build();

                    var thoigian = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                    var maCreate = Utils.ToID(string.Join("-", dataSend.ten_bang) + "-" + dataSend.tenfile_saoluu + "-" + thoigian);

                    var putObjectArgs = new PutObjectArgs()
                            .WithBucket(minioBucket)
                            .WithObject("saoluu_bangdulieu/" + maCreate + (type == null ? ".sql" : "." + type))
                            .WithStreamData(stream) // Use the stream directly
                            .WithContentType(file.ContentType)
                            .WithObjectSize(file.FileStream.Length);

                    await minio.PutObjectAsync(putObjectArgs).ConfigureAwait(false); // Upload the object
                }
                catch (MinioException ex)
                {
                    return StatusCode(500, $"Lỗi Minio:: {ex.Message}");
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Chi tiết lỗi: {ex.Message}");
            }
        }

        [HttpGet("getfile")]
        public async Task<IActionResult> GetDownloadUrl(string objectKey, int expirySeconds = 3600)
        {
            try
            {
                if (expirySeconds == 0)
                {
                    expirySeconds = 3600;
                }
                var cf = _configuration.GetSection("HeThong:HeThong_minio");
                string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                using (JsonDocument document = JsonDocument.Parse(cf.Get<CauHinhItem>().giatri))
                {
                    JsonElement root = document.RootElement;
                    minioAccessKey = root.GetProperty("usr").GetString();
                    minioSecretKey = root.GetProperty("pw").GetString();
                    minioBucket = root.GetProperty("bucket").GetString();
                    minioEndpoint = root.GetProperty("domain").GetString();
                }

                var minioDataSecretKey = EncryptionHelper.Decrypt(minioAccessKey, minioSecretKey);

                // Create MinIO client
                var minio = new MinioClient()
                    .WithEndpoint(minioEndpoint)
                    .WithCredentials(minioAccessKey, minioDataSecretKey)
                    .Build();

                var bucketExistsArgs = new BucketExistsArgs().WithBucket(minioBucket);
                var found = await minio.BucketExistsAsync(bucketExistsArgs).ConfigureAwait(false);

                if (!found)
                {
                    return StatusCode(299, $"Bucket '{minioBucket}' not found");
                }

                if (!string.IsNullOrEmpty(objectKey) && objectKey.Contains(","))
                {
                    //var fileZip = string.Join("/", objectKey.Split(",")[0].Split("/").Take(objectKey.Split(",")[0].Split("/").Length - 1).ToArray());
                    var fileZip = objectKey.Split('/')[0];

                    // Create a temporary zip file
                    var zipFilePath = Path.GetTempFileName() + ".zip";

                    using (var zipStream = new FileStream(zipFilePath, FileMode.Create))
                    using (var archive = new ZipArchive(zipStream, ZipArchiveMode.Create, true))
                    {
                        // List objects in the specified folder
                        ListObjectsArgs args = new ListObjectsArgs()
                            .WithBucket(minioBucket)
                            .WithPrefix(fileZip + "/")
                            .WithRecursive(true);
                        var objects = minio.ListObjectsAsync(args);

                        foreach (var obj in objects)
                        {
                            // Download each object and add it to the zip
                            var filePath = Path.GetTempFileName();
                            GetObjectArgs argss = new GetObjectArgs()
                                .WithBucket(minioBucket)
                                .WithObject(obj.Key)
                                .WithCallbackStream((stream) =>
                            {
                                using (var fileStream = new FileStream(filePath, FileMode.Create))
                                {
                                    stream.CopyTo(fileStream);
                                }
                            });
                            await minio.GetObjectAsync(argss);

                            // Add the file to the zip archive
                            archive.CreateEntryFromFile(filePath, Path.GetFileName(obj.Key));
                            System.IO.File.Delete(filePath); // Clean up the temporary file
                        }
                    }

                    // Return the zip file for download
                    var zipFileBytes = await System.IO.File.ReadAllBytesAsync(zipFilePath);
                    System.IO.File.Delete(zipFilePath); // Clean up the zip file
                    return File(zipFileBytes, "application/zip", $"{fileZip}.zip");
                }
                else
                {
                    var fileName = objectKey.Split('/')[objectKey.Split('/').Length - 1];

                    var memoryStream = new MemoryStream();
                    GetObjectArgs args = new GetObjectArgs()
                        .WithBucket(minioBucket)
                        .WithObject(objectKey)
                        .WithCallbackStream((stream) =>
                        {
                            stream.CopyTo(memoryStream);
                        });
                    await minio.GetObjectAsync(args);

                    memoryStream.Position = 0; // Reset the stream position
                    return File(memoryStream, "application/octet-stream", fileName);
                }

            }
            catch (MinioException ex)
            {
                return StatusCode(500, $"Lỗi Minio:: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Chi tiết lỗi: {ex.Message}");
            }
        }

        [HttpPost("bangdulieus")]
        public IActionResult List_bangdulieus(CommonRequest req)
        {
            var allTable = _httcontext.Model.GetEntityTypes();
            List<bangdulieu> List = new List<bangdulieu>();
            foreach (var item in allTable)
            {
                bangdulieu bangdulieu = new bangdulieu();
                bangdulieu.ma = item.ClrType.Name;
                bangdulieu.ten_bang = item.ClrType.Name;
                bangdulieu.thoigian_saoluu = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                List.Add(bangdulieu);
            }

            IQueryable<bangdulieu> qr = List.AsQueryable();

            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.ten_bang.ToUpper().Contains(tuKhoaUpper));
            }
            if (req?.filter_time_from > 0)
            {
                qr = qr.Where(t => t.thoigian_saoluu >= req.filter_time_from);
            }
            if (req?.filter_time_to > 0)
            {
                qr = qr.Where(t => t.thoigian_saoluu <= req.filter_time_to);
            }

            var recordCount = 0;
            if (string.IsNullOrEmpty(req.anchor))
            {
                recordCount = qr.Count();
            }
            qr = qr.OrderByDescending(k => k.thoigian_saoluu).ThenBy(k => k.ma);
            if (req.anchor != null && req.anchor.Trim() != "")
            {
                string[] parts = req.anchor.Split('#');
                if (parts.Length >= 2)
                {
                    if (long.TryParse(parts[0], out long anchorCreated))
                    {
                        string anchorMaDinhDanh = parts[1];
                        qr = qr.Where(k => k.thoigian_saoluu < anchorCreated || (k.thoigian_saoluu == anchorCreated && k.ma.CompareTo(anchorMaDinhDanh) > 0));
                    }
                }
            }

            if (req.limit < 1)
            {
                req.limit = 10000;
            }
            qr = qr.Take(req.limit + 1);

            var listRecords = qr.ToList();

            var res = new bangdulieus
            {
                limit = req.limit
            };
            if (listRecords.Count > req.limit)
            {
                var anchorResMaDinhDanh = listRecords[req.limit - 1].ma;
                var anchorCreatedNumber = listRecords[req.limit - 1].thoigian_saoluu;
                var anchorResCreated = "";
                // Chuyển đổi số thành chuỗi nếu số lớn hơn 0, ngược lại giữ nguyên chuỗi rỗng
                anchorResCreated = anchorCreatedNumber > 0 ? anchorCreatedNumber.ToString() : "";

                res.anchor = String.Concat(anchorResCreated, "#", anchorResMaDinhDanh);
                res.Records = listRecords.Take(req.limit).ToList();
            }
            else
            {
                res.Records = listRecords;
            }
            res.count = recordCount;

            return Ok(res);
        }

    }
}
