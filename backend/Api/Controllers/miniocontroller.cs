using HTT.Api.Models;
using HTT.Api.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Minio;
using Minio.DataModel;
using Minio.DataModel.Args;
using Minio.Exceptions;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq.Dynamic.Core;
using System.Reactive.Linq;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.Security.AccessControl;
using System.Configuration;
using Minio.ApiEndpoints;

namespace HTT.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class miniocontroller : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _datacontext;
        public IConfiguration _config { get; }
        private readonly IWebHostEnvironment _hostEnvironment;
        private string endpoint;
        private string accessKey;
        private string secretKey;
        private string minio_bucket;

        public miniocontroller(IConfiguration config, IWebHostEnvironment hostEnvironment, QTHT_HTT_Context context, HTT_Context datacontext)
        {
            _config = config;
            _hostEnvironment = hostEnvironment;
            _datacontext = datacontext;
            _context = context;

        }

        #region
        /// <summary>
        /// Upload file lên bucket
        /// </summary>
        /// <param name="file">File cần đẩy lên bucket</param>
        /// <param name="minio_bucket">Tên bucket(nếu chưa có thì tạo mới)</param>
        /// <returns></returns>
        [HttpPost]
        [Route("UploadFile")]
        public async Task<IActionResult> UploadFile(IFormFile file, string filePath)
        {

            try
            {
                //string key = _context.tl_ch_hethong
                //       .Where(x => x.tencauhinh == "HeThong_minio")
                //       .Select(x => x.giatri)
                //       .FirstOrDefault();

                //string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                //using (JsonDocument document = JsonDocument.Parse(key))
                //{
                //    JsonElement root = document.RootElement;
                //    minioAccessKey = root.GetProperty("usr").GetString();
                //    minioSecretKey = root.GetProperty("pw").GetString();
                //    minioBucket = root.GetProperty("bucket").GetString();
                //    minioEndpoint = root.GetProperty("domain").GetString();
                //}

                var cf = _config.GetSection("CauHinh:HeThong:HeThong_minio").Get<CauHinhItem>();

                string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                using (JsonDocument document = JsonDocument.Parse(cf.giatri))
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
                if (file == null || file.Length == 0)
                {
                    return StatusCode(299, "Chưa có file để đẩy lên");
                }
                using (var bs = file.OpenReadStream()) // Open the stream
                {
                    var putObjectArgs = new PutObjectArgs()
                        .WithBucket(minioBucket)
                        .WithObject(filePath + "/" + file.FileName)
                        .WithStreamData(bs) // Use the stream directly
                        .WithContentType(file.ContentType)
                        .WithObjectSize(file.Length);

                    await minio.PutObjectAsync(putObjectArgs).ConfigureAwait(false); // Upload the object
                }
                return Ok(new { Message = $"\nSuccessfully uploaded {file.FileName}\n" });
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

        /// <summary>
        /// Upload nhiều file lên minio
        /// </summary>
        /// <param name="files"></param>
        /// <param name="filePath"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("UploadFiles")]
        public async Task<IActionResult> UploadFiles(List<IFormFile> files, string filePath)
        {
            try
            {
                // Retrieve MinIO configuration from the context
                //string key = _context.tl_ch_hethong
                //               .Where(x => x.tencauhinh == "HeThong_minio")
                //               .Select(x => x.giatri)
                //               .FirstOrDefault();

                //if (string.IsNullOrEmpty(key))
                //{
                //    return StatusCode(500, "MinIO configuration not found.");
                //}

                //string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                //// Parse JSON to get MinIO credentials and bucket details
                //using (JsonDocument document = JsonDocument.Parse(key))
                //{
                //    JsonElement root = document.RootElement;

                //    minioAccessKey = root.GetProperty("usr").GetString();
                //    minioSecretKey = root.GetProperty("pw").GetString();
                //    minioBucket = root.GetProperty("bucket").GetString();
                //    minioEndpoint = root.GetProperty("domain").GetString();
                //}

                var cf = _config.GetSection("CauHinh:HeThong:HeThong_minio").Get<CauHinhItem>();

                string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                using (JsonDocument document = JsonDocument.Parse(cf.giatri))
                {
                    JsonElement root = document.RootElement;
                    minioAccessKey = root.GetProperty("usr").GetString();
                    minioSecretKey = root.GetProperty("pw").GetString();
                    minioBucket = root.GetProperty("bucket").GetString();
                    minioEndpoint = root.GetProperty("domain").GetString();
                }

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

                // Upload each file to MinIO
                foreach (var file in files)
                {
                    if (file.Length == 0)
                    {
                        return StatusCode(299, $"File '{file.FileName}' is empty.");
                    }

                    using (var bs = file.OpenReadStream()) // Open the stream
                    {
                        var putObjectArgs = new PutObjectArgs()
                            .WithBucket(minioBucket)
                            .WithObject(filePath + "/" + file.FileName)
                            .WithStreamData(bs) // Use the stream directly
                            .WithContentType(file.ContentType)
                            .WithObjectSize(file.Length);

                        await minio.PutObjectAsync(putObjectArgs).ConfigureAwait(false); // Upload the object
                    }
                }

                return Ok(new { message = $"Successfully uploaded files to '{filePath}'" });
            }
            catch (MinioException ex)
            {
                return StatusCode(500, $"MinIO error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error details: {ex.Message}");
            }
        }

        /// <summary>
        /// Lấy link download url của 1 object trong bucket
        /// </summary>
        /// <param name="minio_bucket">Tên bucket</param>
        /// <param name="objectKey">Đường link url file(VD:/ketluan/{id cuộc họp}/{tên file}</param>
        /// <param name="expirySeconds">Thời gian link download hết hạn</param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetDownloadUrlObject")]
        public async Task<IActionResult> GetDownloadUrl(string objectKey, int expirySeconds = 3600)
        {
            try
            {
                if (expirySeconds == 0)
                {
                    expirySeconds = 3600;
                }

                // Retrieve configuration from the database
                //string key = _context.tl_ch_hethong
                //                .Where(x => x.tencauhinh == "HeThong_minio")
                //                .Select(x => x.giatri)
                //                .FirstOrDefault();


                //string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                //// Parse JSON to get MinIO credentials and bucket details
                //using (JsonDocument document = JsonDocument.Parse(key))
                //{
                //    JsonElement root = document.RootElement;

                //    minioAccessKey = root.GetProperty("usr").GetString();
                //    minioSecretKey = root.GetProperty("pw").GetString();
                //    minioBucket = root.GetProperty("bucket").GetString();
                //    minioEndpoint = root.GetProperty("domain").GetString();
                //}

                var cf = _config.GetSection("CauHinh:HeThong:HeThong_minio").Get<CauHinhItem>();

                string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                using (JsonDocument document = JsonDocument.Parse(cf.giatri))
                {
                    JsonElement root = document.RootElement;
                    minioAccessKey = root.GetProperty("usr").GetString();
                    minioSecretKey = root.GetProperty("pw").GetString();
                    minioBucket = root.GetProperty("bucket").GetString();
                    minioEndpoint = root.GetProperty("domain").GetString();
                }

                var minioDataSecretKey = EncryptionHelper.Decrypt(minioAccessKey, minioSecretKey);
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

                // Generate a presigned URL for the object
                var presignedGetObjectArgs = new PresignedGetObjectArgs()
                    .WithBucket(minioBucket)
                    .WithObject(objectKey)
                    .WithExpiry(expirySeconds);

                string presignedUrl = await minio.PresignedGetObjectAsync(presignedGetObjectArgs);

                return Ok(new { data = presignedUrl });
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

        /// <summary>
        /// Download file 
        /// </summary>
        /// <param name="minio_bucket"></param>
        /// <param name="objectKey"></param>
        /// <param name="fileName"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("Export_Object")]
        public async Task<IActionResult> ExportObject(string objectKey, string fileName)
        {
            try
            {
                var cf = _config.GetSection("CauHinh:HeThong:HeThong_minio").Get<CauHinhItem>();

                string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                using (JsonDocument document = JsonDocument.Parse(cf.giatri))
                {
                    JsonElement root = document.RootElement;
                    minioAccessKey = root.GetProperty("usr").GetString();
                    minioSecretKey = root.GetProperty("pw").GetString();
                    minioBucket = root.GetProperty("bucket").GetString();
                    minioEndpoint = root.GetProperty("domain").GetString();
                }

                // Retrieve configuration from the database
                //string key = _context.tl_ch_hethong
                //                .Where(x => x.tencauhinh == "HeThong_minio").Select(x => x.giatri)
                //                .FirstOrDefault()?.ToString();

                //using (JsonDocument document = JsonDocument.Parse(key))
                //{
                //    JsonElement root = document.RootElement;

                //    // Extract credentials and bucket details from JSON
                //    minioAccessKey = root.GetProperty("usr").GetString();
                //    minioSecretKey = root.GetProperty("pw").GetString();
                //    minioBucket = root.GetProperty("bucket").GetString();
                //    minioEndpoint = root.GetProperty("domain").GetString();
                //}

                var minioDataSecretKey = EncryptionHelper.Decrypt(minioAccessKey, minioSecretKey);
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

                //// Retrieve the object from MinIO
                //StringBuilder stringBuilder = new StringBuilder();

                //GetObjectArgs args = new GetObjectArgs()
                //    .WithBucket(minioBucket)
                //    .WithObject(objectKey)
                //    .WithCallbackStream((stream) =>
                //    {
                //        using (StreamReader reader = new StreamReader(stream))
                //        {
                //            string line;
                //            while ((line = reader.ReadLine()) != null)
                //            {
                //                // Append each line to the StringBuilder
                //                stringBuilder.AppendLine(line);
                //            }
                //        }
                //    });

                //await minio.GetObjectAsync(args);

                //// Write data to file
                //string data = stringBuilder.ToString();
                //string filePath = Path.Combine(_hostEnvironment.ContentRootPath, fileName);
                //await System.IO.File.WriteAllTextAsync(filePath, data);

                //// Prepare the file for download
                //Stream streamFile = new MemoryStream();
                //using (var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
                //{
                //    await stream.CopyToAsync(streamFile);
                //}

                //// Delete temporary file
                //System.IO.File.Delete(filePath);

                //streamFile.Position = 0;
                //return File(streamFile, "application/octet-stream", fileName);

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
            catch (MinioException ex)
            {
                return StatusCode(500, $"Lỗi Minio:: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Chi tiết lỗi: {ex.Message}");
            }
        }

        /// <summary>
        /// Lấy ra danh sách bucket
        /// </summary>
        /// <returns></returns>
        public class listBucket
        {
            public string Name { get; set; }
            public Dictionary<string, Dictionary<string, Dictionary<string, Dictionary<string, Dictionary<string, HashSet<string>>>>>> Folders { get; set; }
        }

        [HttpGet]
        [Route("listBucket")]
        public async Task<IActionResult> GetListBucket()
        {
            try
            {
                var bucketList = new List<listBucket>();
                //string key = _context.tl_ch_hethong
                //       .Where(x => x.tencauhinh == "HeThong_minio")
                //       .Select(x => x.giatri)
                //       .FirstOrDefault();

                //string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                //using (JsonDocument document = JsonDocument.Parse(key))
                //{
                //    JsonElement root = document.RootElement;
                //    minioAccessKey = root.GetProperty("usr").GetString();
                //    minioSecretKey = root.GetProperty("pw").GetString();
                //    minioBucket = root.GetProperty("bucket").GetString();
                //    minioEndpoint = root.GetProperty("domain").GetString();
                //}

                var cf = _config.GetSection("CauHinh:HeThong:HeThong_minio").Get<CauHinhItem>();

                string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                using (JsonDocument document = JsonDocument.Parse(cf.giatri))
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
                var bucketExistsArgs = new BucketExistsArgs().WithBucket(minio_bucket);
                var found = await minio.BucketExistsAsync(bucketExistsArgs).ConfigureAwait(false);
                var list = await minio.ListBucketsAsync();


                foreach (Bucket bucket in list.Buckets)
                {
                    var lst = new listBucket();
                    lst.Name = bucket.Name;
                    lst.Folders = new Dictionary<string, Dictionary<string, Dictionary<string, Dictionary<string, Dictionary<string, HashSet<string>>>>>>();

                    ListObjectsArgs args = new ListObjectsArgs().WithBucket(bucket.Name).WithRecursive(true);
                    var observable = minio.ListObjectsAsync(args);

                    foreach (var obj in observable)
                    {
                        string[] parts = obj.Key.Split('/');

                        if (parts.Length >= 1) // Ensure parts has at least 3 elements
                        {
                            // Dynamically check the length and access elements accordingly
                            if (!lst.Folders.ContainsKey(parts[0]))
                            {
                                lst.Folders[parts[0]] = new Dictionary<string, Dictionary<string, Dictionary<string, Dictionary<string, HashSet<string>>>>>();

                            }
                            //if (!lst.Folders[parts[0]].ContainsKey(parts[1]))
                            //{
                            //    lst.Folders[parts[0]][parts[1]] = new Dictionary<string, Dictionary<string, Dictionary<string, HashSet<string>>>>();
                            //}

                            if (parts.Length >= 2)
                            {
                                if (!lst.Folders.ContainsKey(parts[0]))
                                {
                                    lst.Folders[parts[0]] = new Dictionary<string, Dictionary<string, Dictionary<string, Dictionary<string, HashSet<string>>>>>();

                                }
                                if (!lst.Folders[parts[0]].ContainsKey(parts[1]))
                                {
                                    lst.Folders[parts[0]][parts[1]] = new Dictionary<string, Dictionary<string, Dictionary<string, HashSet<string>>>>();
                                }
                                if (!lst.Folders[parts[0]][parts[1]].ContainsKey(parts[2]))
                                {
                                    lst.Folders[parts[0]][parts[1]][parts[2]] = new Dictionary<string, Dictionary<string, HashSet<string>>>();
                                }
                                if (!lst.Folders[parts[0]][parts[1]][parts[2]].ContainsKey(parts[3]))
                                {
                                    lst.Folders[parts[0]][parts[1]][parts[2]][parts[3]] = new Dictionary<string, HashSet<string>>();
                                }

                                if (parts.Length >= 3)
                                {
                                    if (!lst.Folders[parts[0]][parts[1]].ContainsKey(parts[2]))
                                    {
                                        lst.Folders[parts[0]][parts[1]][parts[2]] = new Dictionary<string, Dictionary<string, HashSet<string>>>();
                                    }

                                    if (!lst.Folders[parts[0]][parts[1]][parts[2]].ContainsKey(parts[3]))
                                    {
                                        lst.Folders[parts[0]][parts[1]][parts[2]][parts[3]] = new Dictionary<string, HashSet<string>>();
                                    }
                                    if (parts.Length >= 4)
                                    {
                                        if (!lst.Folders[parts[0]][parts[1]][parts[2]][parts[3]].ContainsKey(parts[4]))
                                        {
                                            lst.Folders[parts[0]][parts[1]][parts[2]][parts[3]][parts[4]] = new HashSet<string>();
                                        }

                                    }
                                }
                            }
                        }
                    }
                    bucketList.Add(lst);
                }




                return Ok(bucketList);
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

        /// <summary>
        /// Lấy ra tất cả tập tin nhỏ
        /// </summary>
        /// <param name="minio_bucket">Tên bucket</param>
        /// <returns></returns>
        [HttpGet]
        [Route("listObject")]
        public async Task<IActionResult> GetListObject()
        {

            try
            {
                List<string> objectKeys = new List<string>();
                //string key = _context.tl_ch_hethong
                //       .Where(x => x.tencauhinh == "HeThong_minio")
                //       .Select(x => x.giatri)
                //       .FirstOrDefault();

                //string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                //using (JsonDocument document = JsonDocument.Parse(key))
                //{
                //    JsonElement root = document.RootElement;
                //    minioAccessKey = root.GetProperty("usr").GetString();
                //    minioSecretKey = root.GetProperty("pw").GetString();
                //    minioBucket = root.GetProperty("bucket").GetString();
                //    minioEndpoint = root.GetProperty("domain").GetString();
                //}

                var cf = _config.GetSection("CauHinh:HeThong:HeThong_minio").Get<CauHinhItem>();

                string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                using (JsonDocument document = JsonDocument.Parse(cf.giatri))
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
                var bucketExistsArgs = new BucketExistsArgs().WithBucket(minio_bucket);
                var found = await minio.BucketExistsAsync(bucketExistsArgs).ConfigureAwait(false);
                if (!found)
                {
                    return StatusCode(299, $"Bucket '{minio_bucket}' not found");
                }

                ListObjectsArgs args = new ListObjectsArgs().WithBucket(minio_bucket).WithRecursive(true);
                var observable = minio.ListObjectsAsync(args);
                foreach (var obj in observable)
                {
                    objectKeys.Add(obj.Key);
                }
                return Ok(objectKeys);

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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="minio_bucket"></param>
        /// <returns></returns>

        /// <summary>
        /// Xóa object
        /// </summary>
        /// <param name="minio_bucket"></param>
        /// <param name="objectName">đầy đủ file patch của object mới xóa được </param>
        /// <returns></returns>
        [HttpDelete]
        [Route("DeleteObject")]
        public async Task<IActionResult> DeleteObject(string objectName)
        {
            try
            {
                // Retrieve MinIO configuration from the context
                //string key = _context.tl_ch_hethong
                //               .Where(x => x.tencauhinh == "HeThong_minio")
                //               .Select(x => x.giatri)
                //               .FirstOrDefault();

                //if (string.IsNullOrEmpty(key))
                //{
                //    return StatusCode(500, "MinIO configuration not found.");
                //}

                //string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                //// Parse JSON to get MinIO credentials and bucket details
                //using (JsonDocument document = JsonDocument.Parse(key))
                //{
                //    JsonElement root = document.RootElement;

                //    minioAccessKey = root.GetProperty("usr").GetString();
                //    minioSecretKey = root.GetProperty("pw").GetString();
                //    minioBucket = root.GetProperty("bucket").GetString();
                //    minioEndpoint = root.GetProperty("domain").GetString();
                //}

                var cf = _config.GetSection("CauHinh:HeThong:HeThong_minio").Get<CauHinhItem>();

                string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                using (JsonDocument document = JsonDocument.Parse(cf.giatri))
                {
                    JsonElement root = document.RootElement;
                    minioAccessKey = root.GetProperty("usr").GetString();
                    minioSecretKey = root.GetProperty("pw").GetString();
                    minioBucket = root.GetProperty("bucket").GetString();
                    minioEndpoint = root.GetProperty("domain").GetString();
                }

                // Decrypt secret key
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
                    return StatusCode(299, $"Bucket '{minioBucket}' not found");
                }

                // Delete the object
                var removeObjectArgs = new RemoveObjectArgs()
                    .WithBucket(minioBucket)
                    .WithObject(objectName);
                await minio.RemoveObjectAsync(removeObjectArgs);

                return Ok("Object deleted successfully");
            }
            catch (MinioException ex)
            {
                return StatusCode(500, $"Lỗi Minio: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Chi tiết lỗi: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("createnewfolder")]
        public async Task<IActionResult> CreateNewFolder(string filepath)
        {
            try
            {
                // Retrieve MinIO configuration from the context
                //string key = _context.tl_ch_hethong
                //               .Where(x => x.tencauhinh == "HeThong_minio")
                //               .Select(x => x.giatri)
                //               .FirstOrDefault();


                //string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                //// Parse JSON to get MinIO credentials and bucket details
                //using (JsonDocument document = JsonDocument.Parse(key))
                //{
                //    JsonElement root = document.RootElement;

                //    minioAccessKey = root.GetProperty("usr").GetString();
                //    minioSecretKey = root.GetProperty("pw").GetString();
                //    minioBucket = root.GetProperty("bucket").GetString();
                //    minioEndpoint = root.GetProperty("domain").GetString();
                //}

                var cf = _config.GetSection("CauHinh:HeThong:HeThong_minio").Get<CauHinhItem>();

                string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                using (JsonDocument document = JsonDocument.Parse(cf.giatri))
                {
                    JsonElement root = document.RootElement;
                    minioAccessKey = root.GetProperty("usr").GetString();
                    minioSecretKey = root.GetProperty("pw").GetString();
                    minioBucket = root.GetProperty("bucket").GetString();
                    minioEndpoint = root.GetProperty("domain").GetString();
                }

                // Decrypt secret key
                var minioDataSecretKey = EncryptionHelper.Decrypt(minioAccessKey, minioSecretKey);

                // Create MinIO client
                var minio = new MinioClient()
                    .WithEndpoint(minioEndpoint)
                    .WithCredentials(minioAccessKey, minioDataSecretKey)
                    .Build();

                // Check if the bucket exists, if not, create it
                var bucketExistsArgs = new BucketExistsArgs().WithBucket(minioBucket);
                var found = await minio.BucketExistsAsync(bucketExistsArgs).ConfigureAwait(false);

                if (!found)
                {
                    var makeBucketArgs = new MakeBucketArgs().WithBucket(minioBucket);
                    await minio.MakeBucketAsync(makeBucketArgs).ConfigureAwait(false);
                }

                // Create a new folder by uploading an empty file (README.txt) to the specified path
                var content = filepath;
                var fileName = "README.txt";
                var byteArray = Encoding.UTF8.GetBytes(content);
                using (var stream = new MemoryStream(byteArray))
                {
                    var putObjectArgs = new PutObjectArgs()
                        .WithBucket(minioBucket)
                        .WithObject($"{filepath}/{fileName}")
                        .WithStreamData(stream) // Use the stream directly
                        .WithContentType("application/octet-stream")
                        .WithObjectSize(stream.Length);

                    await minio.PutObjectAsync(putObjectArgs).ConfigureAwait(false); // Upload the object
                }

                return Ok(new { message = $"Successfully created {filepath}" });
            }
            catch (MinioException ex)
            {
                return StatusCode(500, $"MinIO error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error details: {ex.Message}");
            }
        }

        #endregion
    }
}
