using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;
using Newtonsoft.Json;
using System.Data;
using System.Text;
using HTT_QTHT.Api.Helpers;
using HTT_QTHT.Api.Services;
using System.Net.Mail;
using System.Net;
using Minio.DataModel.Args;
using Minio.Exceptions;
using Minio;
using Minio.ApiEndpoints;
using System.Reactive.Linq;
using DocumentFormat.OpenXml.Office2010.ExcelAc;
using System.Text.Json;


namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class ManagementController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        public ManagementController(IConfiguration configuration, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _context = context;
            _configuration = configuration;
        }


        [HttpGet("phan_quyen_vai_tro_nguoi_dung/quyen_nguoi_dung")]
        public IActionResult Get_phanquyen_vaitro_ByToken()
        {
            var user_current = User.FindFirst(Constant.Nameidentifier).Value;

            List<thong_tin_chuc_nang> list_thong_tin_chuc_nang = new List<thong_tin_chuc_nang>();

            var ma_ds_vaitros_jsonstring = _context.phan_quyen_vai_tro_nguoi_dung.Where(x => x.ten_dangnhap_nguoidung == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "")).Select(x => x.ma_ds_vaitros).FirstOrDefault();

            if (ma_ds_vaitros_jsonstring == null) return StatusCode(299, "ma_ds_vaitros_jsonstring_notFound");

            foreach (var item_ma_ds_vaitros in ma_ds_vaitros_jsonstring)
            {
                var ma_ds_thong_tin_chuc_nangs_jsonstring = _context.vai_tro_nguoi_dung.Where(x => x.ma == item_ma_ds_vaitros).Select(x => x.ma_ds_thong_tin_chuc_nangs).FirstOrDefault();

                if (ma_ds_thong_tin_chuc_nangs_jsonstring == null) return StatusCode(299, "ma_ds_thong_tin_chuc_nangs_jsonstring_notFound");

                foreach (var item_ma_ds_thong_tin_chuc_nangs in ma_ds_thong_tin_chuc_nangs_jsonstring)
                {
                    var thong_tin_chuc_nang = _context.thong_tin_chuc_nang.Where(x => x.ma == item_ma_ds_thong_tin_chuc_nangs).FirstOrDefault();
                    if (thong_tin_chuc_nang != null)
                        list_thong_tin_chuc_nang.Add(thong_tin_chuc_nang);
                }
            }

            return Ok(list_thong_tin_chuc_nang);
        }

        [HttpGet("thong_tin_nguoi_dung_byToken")]
        public IActionResult Get_nguoi_dung_ByToken()
        {
            var user_current = User.FindFirst(Constant.Nameidentifier).Value;

            var _DbItem = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).FirstOrDefault();
            if (_DbItem == null)
                return StatusCode(299, "NotFound");
            if (!string.IsNullOrEmpty(_DbItem.ma_chucvu))
            {
                _DbItem.thong_tin_chuc_vu = _context.thong_tin_chuc_vu.Find(_DbItem.ma_chucvu);
            }
            if (!string.IsNullOrEmpty(_DbItem.ma_tochuc))
            {
                _DbItem.thong_tin_don_vi = _context.thong_tin_don_vi.Find(_DbItem.ma_tochuc);
            }
            return Ok(_DbItem);
        }

        /// <summary>
        /// Test send mail
        /// </summary>
        /// <returns></returns>
        //[HttpGet("TestSendMail")]
        //[AllowAnonymous]
        //public IActionResult TestSendMail()
        //{
        //    // Set up the email details
        //    var fromAddress = new MailAddress("monreid@monre.gov.vn", "Your Name");
        //    var toAddress = new MailAddress("rado7a1@gmail.com", "Recipient Name");
        //    const string fromPassword = "***"; // Use an app password if using Gmail
        //    const string subject = "Test Subject";
        //    const string body = "Hello, this is a test email.";

        //    // Configure the SMTP client
        //    var smtp = new SmtpClient
        //    {
        //        Host = "mail.monre.gov.vn", // e.g., smtp.gmail.com for Gmail
        //        Port = 587, // Use 465 for SSL
        //        EnableSsl = false,
        //        DeliveryMethod = SmtpDeliveryMethod.Network,
        //        UseDefaultCredentials = false,
        //        Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
        //    };

        //    // Create the email message
        //    using (var message = new MailMessage(fromAddress, toAddress)
        //    {
        //        Subject = subject,
        //        Body = body
        //    })
        //    {
        //        // Send the email
        //        smtp.Send(message);
        //    }

        //    return Ok("Email sent successfully!");
        //}

        /// <summary>
        /// Get IP user
        /// </summary>
        /// <returns></returns>
        //[HttpGet("test")]
        //[AllowAnonymous]
        //public IActionResult GetClientIp()
        //{
        //    var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        //    return Ok(new { ClientIp = ipAddress });
        //}

        #region minio        
        [NonAction]
        public async Task<List<thumuc>> GetListObjectInBucket()
        {
            try
            {
                List<thumuc> thumucs = new List<thumuc>();
                var minio_config = GetMinIO_Config();

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
                //var minio = new MinioClient()
                //    .WithEndpoint(minio_endpoint)
                //    .WithCredentials(minio_accessKey, minio_data_secretKey)
                //    .Build();
                var bucketExistsArgs = new BucketExistsArgs().WithBucket(minioBucket);
                var found = await minio.BucketExistsAsync(bucketExistsArgs).ConfigureAwait(false);
                if (!found)
                {
                    return null;
                }

                ListObjectsArgs args = new ListObjectsArgs().WithBucket(minioBucket);//.WithRecursive(true)
                var observable = minio.ListObjectsAsync(args);
                foreach (var obj in observable)
                {
                    thumuc thumuc = new thumuc();
                    thumuc.ma = obj.Key.Replace("/", "");
                    thumuc.ten = obj.Key.Replace("/", "");
                    thumuc.thoigian_saoluu = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                    thumucs.Add(thumuc);
                }

                return thumucs;

            }
            catch (MinioException ex)
            {
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [NonAction]
        public async Task<List<teptin>> GetListFileInObject(string path)
        {

            try
            {
                List<teptin> teptins = new List<teptin>();
                //var minio_config = GetMinIO_Config();
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
                //var minio = new MinioClient()
                //    .WithEndpoint(minio_endpoint)
                //    .WithCredentials(minio_accessKey, minio_data_secretKey)
                //    .Build();
                var bucketExistsArgs = new BucketExistsArgs().WithBucket(minioBucket);
                var found = await minio.BucketExistsAsync(bucketExistsArgs).ConfigureAwait(false);
                if (!found)
                {
                    return null;
                }

                ListObjectsArgs args = new ListObjectsArgs().WithBucket(minioBucket).WithPrefix(path).WithRecursive(true);
                var observable = minio.ListObjectsAsync(args);
                foreach (var obj in observable)
                {
                    teptin teptin = new teptin();
                    teptin.ma = obj.Key.Replace(path + "/", "");
                    teptin.ten = obj.Key.Replace(path + "/", "");
                    teptin.thoigian_saoluu = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                    teptins.Add(teptin);
                }

                return teptins;

            }
            catch (MinioException ex)
            {
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [NonAction]
        public async Task<thumuc> GetObject(string path)
        {
            try
            {
                thumuc thumuc = new thumuc();
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

                //var minio_config = GetMinIO_Config();

                //string minio_accessKey = minio_config.usr.ToString();
                //string minio_secretKey = minio_config.pw.ToString();
                //var minio_data_secretKey = EncryptionHelper.Decrypt(minio_accessKey, minio_secretKey);
                //string minio_bucket = minio_config.bucket.ToString();
                //string minio_endpoint = minio_config.domain.ToString();
                //var minio = new MinioClient()
                //    .WithEndpoint(minio_endpoint)
                //    .WithCredentials(minio_accessKey, minio_data_secretKey)
                //    .Build();
                var bucketExistsArgs = new BucketExistsArgs().WithBucket(minioBucket);
                var found = await minio.BucketExistsAsync(bucketExistsArgs).ConfigureAwait(false);
                if (!found)
                {
                    return null;
                }

                ListObjectsArgs args = new ListObjectsArgs().WithBucket(minioBucket).WithPrefix(path);
                var observable = minio.ListObjectsAsync(args);
                foreach (var obj in observable)
                {
                    thumuc.ma = obj.Key.Replace("/", "");
                    thumuc.ten = obj.Key.Replace("/", "");
                    thumuc.thoigian_saoluu = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                }

                return thumuc;

            }
            catch (MinioException ex)
            {
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        [NonAction]
        public async Task<teptin> GetFile(string path)
        {

            try
            {
                teptin teptin = new teptin();
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

                //var minio_config = GetMinIO_Config();

                //string minio_accessKey = minio_config.usr.ToString();
                //string minio_secretKey = minio_config.pw.ToString();
                //var minio_data_secretKey = EncryptionHelper.Decrypt(minio_accessKey, minio_secretKey);
                //string minio_bucket = minio_config.bucket.ToString();
                //string minio_endpoint = minio_config.domain.ToString();
                //var minio = new MinioClient()
                //    .WithEndpoint(minio_endpoint)
                //    .WithCredentials(minio_accessKey, minio_data_secretKey)
                //    .Build();
                var bucketExistsArgs = new BucketExistsArgs().WithBucket(minioBucket);
                var found = await minio.BucketExistsAsync(bucketExistsArgs).ConfigureAwait(false);
                if (!found)
                {
                    return null;
                }

                ListObjectsArgs args = new ListObjectsArgs().WithBucket(minioBucket).WithPrefix(path);
                var observable = minio.ListObjectsAsync(args);
                foreach (var obj in observable)
                {
                    teptin.ma = obj.Key.Replace(path.Split("/")[0] + "/", "");
                    teptin.ten = obj.Key.Replace(path.Split("/")[0] + "/", "");
                    teptin.thoigian_saoluu = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                }

                return teptin;

            }
            catch (MinioException ex)
            {
                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        #endregion


        #region user from wso2 is
        /// <summary>
        /// Lấy danh sách người dùng
        /// </summary>
        /// <returns></returns>
        [HttpGet("api/htt_qtht/getlistuser_wso2is")]
        [AllowAnonymous]
        public async Task<IActionResult> GetListUserFromWSO2ISAsync(string? keyword, int limit = 10, int offset = 0)
        {
            string urlUser = _configuration.GetValue<string>("Idp_Address") + _configuration.GetValue<string>("Wso2:UrlUserManagement");
            if (!string.IsNullOrEmpty(keyword))
            {
                urlUser = string.Format(urlUser + "&filter=userName+co+{2}", limit, offset, keyword);
            }
            else
            {
                urlUser = string.Format(urlUser, limit, offset);
            }

            var wso2is_config = GetWso2Is_Config();

            // string urlUser = _configuration.GetValue<string>("Wso2:UrlUserManagement");
            string userLogin = wso2is_config.usr;
            string password = EncryptionHelper.Decrypt(wso2is_config.usr, wso2is_config.pw);

            // Set up a handler to ignore SSL certificate errors
            HttpClientHandler handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (HttpRequestMessage, cert, chain, sslPolicyErrors) => true
            };

            // Create an HttpClient with the handler
            using (HttpClient client = new HttpClient(handler))
            {
                // Set up basic authentication

                var authToken = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{userLogin}:{password}"));
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authToken);

                try
                {
                    // Make an asynchronous GET request to the API
                    var response = client.GetAsync(urlUser).Result;

                    // Check if the response was successful
                    if (response.IsSuccessStatusCode)
                    {
                        // Read and display the response content
                        string content = response.Content.ReadAsStringAsync().Result;

                        //UserWso2 lstUser = JsonConvert.DeserializeObject<UserWso2>(content);
                        return Ok(content);

                    }
                    else
                    {
                        return Ok(response.StatusCode);

                    }
                }
                catch (Exception ex)
                {
                    // Handle any exceptions that occur
                    return BadRequest(ex);

                }
            }

        }

        /// <summary>
        /// lấy thông tin người dùng và list quyền của người dùng đó
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("api/htt_qtht/getuser_wso2is")]
        [AllowAnonymous]
        public async Task<IActionResult> GetUserFromWSO2ISAsync(string id)
        {
            var wso2is_config = GetWso2Is_Config();

            string urlUser = _configuration.GetValue<string>("Idp_Address") + _configuration.GetValue<string>("Wso2:UrlUserPATCH") + id;
            string userLogin = wso2is_config.usr;
            string password = EncryptionHelper.Decrypt(wso2is_config.usr, wso2is_config.pw);

            // Set up a handler to ignore SSL certificate errors
            HttpClientHandler handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (HttpRequestMessage, cert, chain, sslPolicyErrors) => true
            };

            // Create an HttpClient with the handler
            using (HttpClient client = new HttpClient(handler))
            {
                // Set up basic authentication

                var authToken = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{userLogin}:{password}"));
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authToken);

                try
                {
                    // Make an asynchronous GET request to the API
                    var response = client.GetAsync(urlUser).Result;

                    // Check if the response was successful
                    if (response.IsSuccessStatusCode)
                    {
                        // Read and display the response content
                        string content = response.Content.ReadAsStringAsync().Result;
                        return Ok(content);
                        //if (!string.IsNullOrEmpty(content))
                        //{
                        //    return Ok(new ContentResult { StatusCode = 200, Content = content });
                        //}
                        //return Ok(new ContentResult { StatusCode = 200, Content = content });

                    }
                    else
                    {
                        return BadRequest(new ContentResult { StatusCode = (int)response.StatusCode, Content = "Có lỗi xẩy ra" });

                    }
                }
                catch (Exception ex)
                {
                    // Handle any exceptions that occur
                    return BadRequest(ex);

                }
            }

        }

        /// <summary>
        /// Update thông tin người dùng
        /// </summary>
        /// <param name="userUpdate"></param>
        /// <returns></returns>
        [HttpPatch("api/htt_qtht/patch_user_wso2is")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateUserFromWSO2([FromBody] UserUpdate userUpdate)
        {
            HttpClientHandler handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (HttpRequestMessage, cert, chain, sslPolicyErrors) => true
            };

            // Create an HttpClient with the handler
            using (HttpClient client = new HttpClient(handler))
            {
                // Set up basic authentication
                var wso2is_config = GetWso2Is_Config();

                string urlPATCH = _configuration.GetValue<string>("Idp_Address") + _configuration.GetValue<string>("Wso2:UrlUserPATCH") + userUpdate.userID;
                string userLogin = wso2is_config.usr;
                string password = EncryptionHelper.Decrypt(wso2is_config.usr, wso2is_config.pw);
                var authToken = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{userLogin}:{password}"));
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authToken);

                // Define the JSON payload
                var jsonPayload = "{\"Operations\": [{\"op\": \"replace\",\"value\": {\"userName\":" + userUpdate.userName + "}},{\"op\": \"replace\",\"value\": {\"name\": {\"givenName\":" + userUpdate.firstName + "}}},{\"op\": \"replace\",\"value\": {\"name\": {\"familyName\":" + userUpdate.lastName + "}}},{\"op\": \"replace\",\"value\": {\"urn:ietf:params:scim:schemas:extension:enterprise:2.0:User\": {\"country\": \"Viet Nam\"}}},{\"op\": \"replace\",\"value\": {\"emails\": [" + userUpdate.emails + "]}},{\"op\": \"replace\",\"value\": {\"phoneNumbers\": [{ \"type\": \"mobile\", \"value\":" + userUpdate.phoneNumbers + "}]}},{\"op\": \"replace\",\"value\": {}}],\"schemas\": [\"urn:ietf:params:scim:api:messages:2.0:PatchOp\"]\r\n}";
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                try
                {
                    // Make an asynchronous PATCH request to the API
                    var request = new HttpRequestMessage(new HttpMethod("PATCH"), urlPATCH)
                    {
                        Content = content
                    };
                    var response = await client.SendAsync(request);

                    // Check if the response was successful
                    if (response.IsSuccessStatusCode)
                    {
                        // Read and display the response content
                        string responseContent = await response.Content.ReadAsStringAsync();
                        return Ok(responseContent);
                    }
                    else
                    {
                        return Ok(response.StatusCode);
                    }
                }
                catch (Exception ex)
                {
                    // Handle any exceptions that occur
                    return BadRequest(ex.Message);
                }
            }
        }
        /// <summary>
        /// Lấy danh sách quyền
        /// </summary>
        /// <param name="keyWord"></param>
        /// <param name="startIndex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet("api/htt_qtht/getlistroles_wso2is")]
        [AllowAnonymous]
        public async Task<IActionResult> GetListRolesFromWSO2ISAsync(string keyWord = "", int startIndex = 0, int pageSize = 10)
        {
            var wso2is_config = GetWso2Is_Config();

            string key = string.IsNullOrEmpty(keyWord) ? "undefined" : "a2cd16fe-2418-41cf-a70a-323164c4f894+and+displayName+co+" + keyWord;
            string urlRole = _configuration.GetValue<string>("Idp_Address") + string.Format(_configuration.GetValue<string>("Wso2:UrlRoles"), pageSize, startIndex, key);
            string userLogin = wso2is_config.usr;
            string password = EncryptionHelper.Decrypt(wso2is_config.usr, wso2is_config.pw);

            // Set up a handler to ignore SSL certificate errors
            HttpClientHandler handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (HttpRequestMessage, cert, chain, sslPolicyErrors) => true
            };

            // Create an HttpClient with the handler
            using (HttpClient client = new HttpClient(handler))
            {
                // Set up basic authentication

                var authToken = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{userLogin}:{password}"));
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authToken);

                try
                {
                    // Make an asynchronous GET request to the API
                    var response = client.GetAsync(urlRole).Result;

                    // Check if the response was successful
                    if (response.IsSuccessStatusCode)
                    {
                        // Read and display the response content
                        string content = response.Content.ReadAsStringAsync().Result;
                        if (!string.IsNullOrEmpty(content))
                        {
                            Roles? lstRoles = JsonConvert.DeserializeObject<Roles>(content);
                            return Ok(lstRoles);
                        }
                        return Ok(new Roles());

                    }
                    else
                    {
                        return Ok(response.StatusCode);

                    }
                }
                catch (Exception ex)
                {
                    // Handle any exceptions that occur
                    return BadRequest(ex);

                }
            }

        }
        /// <summary>
        /// Update tên role
        /// </summary>
        /// <param name="roleUpdate"></param>
        /// <returns></returns>
        [HttpPatch("api/htt_qtht/patch_role_wso2is")]
        [AllowAnonymous]
        public async Task<IActionResult> UpdateRoleFromWSO2([FromBody] RoleUpdate roleUpdate)
        {
            HttpClientHandler handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (HttpRequestMessage, cert, chain, sslPolicyErrors) => true
            };

            // Create an HttpClient with the handler
            using (HttpClient client = new HttpClient(handler))
            {
                var wso2is_config = GetWso2Is_Config();
                // Set up basic authentication
                string urlPATCH = _configuration.GetValue<string>("Idp_Address") + _configuration.GetValue<string>("Wso2:UrlRolePATCH") + roleUpdate.id;
                string userLogin = wso2is_config.usr;
                string password = EncryptionHelper.Decrypt(wso2is_config.usr, wso2is_config.pw);
                var authToken = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{userLogin}:{password}"));
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authToken);

                // Define the JSON payload
                var jsonPayload = "{\"Operations\": [{\"op\": \"replace\",\"path\": \"displayName\",\"value\":" + roleUpdate.displayName + "}],\"schemas\": [\"urn:ietf:params:scim:api:messages:2.0:PatchOp\"]}";
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                try
                {
                    // Make an asynchronous PATCH request to the API
                    var request = new HttpRequestMessage(new HttpMethod("PATCH"), urlPATCH)
                    {
                        Content = content
                    };
                    var response = await client.SendAsync(request);

                    // Check if the response was successful
                    if (response.IsSuccessStatusCode)
                    {
                        // Read and display the response content
                        string responseContent = await response.Content.ReadAsStringAsync();
                        return Ok(responseContent);
                    }
                    else
                    {
                        return Ok(response.StatusCode);
                    }
                }
                catch (Exception ex)
                {
                    // Handle any exceptions that occur
                    return BadRequest(ex.Message);
                }
            }
        }

        /// <summary>
        /// api xóa role bởi id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("api/htt_qtht/delete_role_wso2is")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteRoleFromWSO2(string id)
        {
            HttpClientHandler handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (HttpRequestMessage, cert, chain, sslPolicyErrors) => true
            };

            // Create an HttpClient with the handler
            using (HttpClient client = new HttpClient(handler))
            {
                var wso2is_config = GetWso2Is_Config();
                // Set up basic authentication
                string urlDelete = _configuration.GetValue<string>("Idp_Address") + _configuration.GetValue<string>("Wso2:UrlRolePATCH") + id;
                string userLogin = wso2is_config.usr;
                string password = EncryptionHelper.Decrypt(wso2is_config.usr, wso2is_config.pw);
                var authToken = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{userLogin}:{password}"));
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authToken);
                try
                {
                    // Make an asynchronous PATCH request to the API
                    var response = await client.DeleteAsync(urlDelete);

                    // Check if the response was successful
                    if (response.IsSuccessStatusCode)
                    {
                        // Read and display the response content
                        string responseContent = await response.Content.ReadAsStringAsync();
                        return Ok(new ContentResult { StatusCode = 200, Content = responseContent });
                    }
                    else
                    {
                        return BadRequest(new ContentResult { StatusCode = (int)response.StatusCode, Content = "Có lỗi xẩy ra" });
                    }
                }
                catch (Exception ex)
                {
                    // Handle any exceptions that occur
                    return BadRequest(new ContentResult { StatusCode = 500, Content = ex.Message });
                }
            }
        }

        /// <summary>
        /// create role
        /// </summary>
        /// <param name="roleCreate"></param>
        /// <returns></returns>
        [HttpPost("api/htt_qtht/create_role_wso2is")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateRoleFromWSO2([FromBody] RoleCreate roleCreate)
        {
            HttpClientHandler handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (HttpRequestMessage, cert, chain, sslPolicyErrors) => true
            };

            // Create an HttpClient with the handler
            using (HttpClient client = new HttpClient(handler))
            {
                var wso2is_config = GetWso2Is_Config();
                // Set up basic authentication
                string urlCreate = _configuration.GetValue<string>("Idp_Address") + _configuration.GetValue<string>("Wso2:UrlRolePATCH");
                string userLogin = wso2is_config.usr;
                string password = EncryptionHelper.Decrypt(wso2is_config.usr, wso2is_config.pw);
                var authToken = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{userLogin}:{password}"));
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authToken);
                // Define the JSON payload
                var jsonPayload = "{\"displayName\": " + roleCreate.displayName + ",\"permissions\": [],\"schemas\": []}";
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                try
                {
                    // Make an asynchronous PATCH request to the API
                    var request = new HttpRequestMessage(new HttpMethod("POST"), urlCreate)
                    {
                        Content = content
                    };
                    var response = await client.SendAsync(request);

                    // Check if the response was successful
                    if (response.IsSuccessStatusCode)
                    {
                        // Read and display the response content
                        string responseContent = await response.Content.ReadAsStringAsync();
                        return Ok(new ContentResult { StatusCode = 200, Content = responseContent });
                    }
                    else
                    {
                        return BadRequest(new ContentResult { StatusCode = (int)response.StatusCode, Content = "Có lỗi xẩy ra" });
                    }
                }
                catch (Exception ex)
                {
                    // Handle any exceptions that occur
                    return BadRequest(ex.Message);
                }
            }
        }
        #endregion

        #region cau hinh he thong
        [NonAction]
        public email_config GetEmail_Config()
        {
            try
            {
                email_config email_cf = new email_config();
                var config = _context.tl_ch_hethong.Where(x => x.tencauhinh.Contains("mail")).FirstOrDefault();
                if (config != null)
                {
                    var cf = JsonConvert.DeserializeObject<email_config_detail>(config.giatri);
                    email_cf.contact_address = cf.contact_address;
                    email_cf.contact_email = cf.contact_email;
                    email_cf.contact_mobile = cf.contact_mobile;
                    email_cf.contact_name = cf.contact_name;
                    email_cf.domain = cf.domain;
                    email_cf.email_name = cf.email_name;
                    email_cf.email_port = cf.email_port;
                    email_cf.email_smtp = cf.email_smtp;
                    email_cf.email_ssl = cf.email_ssl.ToString();
                    email_cf.sender_email = cf.sender_email;
                    email_cf.sender_password = cf.sender_password;
                    email_cf.sender_user = cf.sender_user;
                    email_cf.sender_app = cf.sender_app;
                }
                return email_cf;
            }
            catch (Exception)
            {
                throw;
            }
        }
        [NonAction]
        public wso2is_config GetWso2Is_Config()
        {
            try
            {
                wso2is_config wso2is_cf = new wso2is_config();
                var config = _context.tl_ch_hethong.Where(x => x.tencauhinh.Contains("wso2")).FirstOrDefault();
                if (config != null)
                {
                    var cf = JsonConvert.DeserializeObject<wso2is_config_detail>(config.giatri);
                    wso2is_cf.usr = cf.usr;
                    wso2is_cf.pw = cf.pw;
                }
                return wso2is_cf;
            }
            catch (Exception)
            {
                throw;
            }
        }
        [NonAction]
        public minio_config GetMinIO_Config()
        {
            try
            {
                minio_config minio_cf = new minio_config();
                var config = _context.tl_ch_hethong.Where(x => x.tencauhinh.Contains("minio")).FirstOrDefault();
                if (config != null)
                {
                    var cf = JsonConvert.DeserializeObject<minio_config_detail>(config.giatri);
                    minio_cf.bucket = cf.bucket;
                    minio_cf.domain = cf.domain;
                    minio_cf.usr = cf.usr;
                    minio_cf.pw = cf.pw;
                }
                return minio_cf;
            }
            catch (Exception)
            {
                throw;
            }
        }
        #endregion
    }
}

