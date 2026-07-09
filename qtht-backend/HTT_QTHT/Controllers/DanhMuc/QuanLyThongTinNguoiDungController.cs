using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;
using Newtonsoft.Json;
using System.Text;
using DocumentFormat.OpenXml.InkML;
using Microsoft.Extensions.Configuration;
using HTT_QTHT.Api.Services;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class QuanLyThongTinNguoiDungController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        public QuanLyThongTinNguoiDungController(IConfiguration configuration, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("thong_tin_nguoi_dung/upsert")]
        public async Task<IActionResult> Upsert_nguoi_dung(thong_tin_nguoi_dung dataSend)
        {
            if (string.IsNullOrEmpty(dataSend.ten_dangnhap))
            {
                return StatusCode(400, "ten_dangnhap_required");
            }
            var _DbItem = _context.thong_tin_nguoi_dung.Find(dataSend.ten_dangnhap);
            if (_DbItem == null)
            {
                dataSend.id = default;
                dataSend.thoigian_tao = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                string id = "";
                dataSend.id_wso2 = id;
                _context.thong_tin_nguoi_dung.Add(dataSend);
                //call api insert user to wso2
            }
            else
            {
                dataSend.id_wso2 = _DbItem.id_wso2;
                //await UpdateUserToWSO2(dataSend);
                _DbItem.Assign(dataSend);
                _DbItem.daxoa = false;
                _context.thong_tin_nguoi_dung.Update(_DbItem).Property(e => e.id).IsModified = false;
            }
            _context.SaveChanges();
            return Ok(dataSend);
        }

        private async Task<string> InsertUserToWSO2(thong_tin_nguoi_dung dataSend)
        {
            HttpClientHandler handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (HttpRequestMessage, cert, chain, sslPolicyErrors) => true
            };

            // Create an HttpClient with the handler
            using (HttpClient client = new HttpClient(handler))
            {
                var wso2is_config = new ManagementController(_configuration, _httcontext, _context).GetWso2Is_Config();
                // Set up basic authentication
                string urlCreate = _configuration.GetValue<string>("Idp_Address") + _configuration.GetValue<string>("Wso2:UrlUserCreate");
                string userLogin = wso2is_config.usr;
                string password = EncryptionHelper.Decrypt(wso2is_config.usr, wso2is_config.pw);
                var authToken = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{userLogin}:{password}"));
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authToken);
                // Define the JSON payload
                var jsonPayload = "{'emails': [{'primary': true,'value': '" + dataSend.email + "'}],'name': {'familyName': '','givenName': '" + dataSend.ten_dangnhap + "'}, 'phoneNumbers': [{ 'type': 'mobile', 'value':'" + dataSend.so_dien_thoai + "'}], 'password': '123456aA@', 'userName': 'PRIMARY/" + dataSend.ten_dangnhap + "'}";
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
                        var res = JsonConvert.DeserializeObject<RootUser>(responseContent);
                        return res.id;
                    }
                    else
                    {
                        return "";
                    }
                }
                catch (Exception ex)
                {
                    return "";
                }
            }
        }
        private async Task UpdateUserToWSO2(thong_tin_nguoi_dung dataSend)
        {
            HttpClientHandler handler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback = (HttpRequestMessage, cert, chain, sslPolicyErrors) => true
            };

            // Create an HttpClient with the handler
            using (HttpClient client = new HttpClient(handler))
            {
                // Set up basic authentication
                var wso2is_config = new ManagementController(_configuration, _httcontext, _context).GetWso2Is_Config();

                string urlPATCH = _configuration.GetValue<string>("Idp_Address") + _configuration.GetValue<string>("Wso2:UrlUserPATCH") + dataSend.id_wso2;
                string userLogin = wso2is_config.usr;
                string password = EncryptionHelper.Decrypt(wso2is_config.usr, wso2is_config.pw);
                var authToken = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{userLogin}:{password}"));
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authToken);

                // Define the JSON payload
                var jsonPayload = "{\"Operations\":[{\"op\":\"replace\",\"path\":\"userName\",\"value\":\"" + dataSend.ten_dangnhap + "\"},{\"op\":\"replace\",\"value\":{\"name\":{\"givenName\":\"" + dataSend.ten_day_du + "\",\"familyName\":\"" + dataSend.ten_day_du + "\"}}},{\"op\":\"replace\",\"path\":\"emails\",\"value\":[{\"value\":\"" + dataSend.email + "\"}]},{\"op\":\"replace\",\"path\":\"phoneNumbers\",\"value\":[{\"type\":\"mobile\",\"value\":\"" + dataSend.so_dien_thoai + "\"}]},{\"op\":\"replace\",\"value\":{\"urn:ietf:params:scim:schemas:extension:enterprise:2.0:User\":{\"country\":\"Viet Nam\"}}}],\"schemas\":[\"urn:ietf:params:scim:api:messages:2.0:PatchOp\"]}";
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
                    }
                }
                catch (Exception ex)
                {
                    // Handle any exceptions that occur
                }
            }
        }

        [HttpGet("thong_tin_nguoi_dung/{id}")]
        public IActionResult Get_nguoi_dung_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var _DbItem = _context.thong_tin_nguoi_dung.Find(id);
            if (_DbItem == null)
                return StatusCode(400, "id_notFound");
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

        [HttpPost("thong_tin_nguoi_dung/delete/{id}")]
        public IActionResult Delete_nguoi_dung_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.thong_tin_nguoi_dung.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            _context.thong_tin_nguoi_dung.Remove(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("thong_tin_nguoi_dung/remove/{id}")]
        public IActionResult Remove_nguoi_dung_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.thong_tin_nguoi_dung.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            db_item.daxoa = true;
            _context.thong_tin_nguoi_dung.Update(db_item).Property(e => e.id).IsModified = false;
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("thong_tin_nguoi_dung/restore/{id}")]
        public IActionResult Restore_nguoi_dung_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.thong_tin_nguoi_dung.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            db_item.daxoa = false;
            _context.thong_tin_nguoi_dung.Update(db_item).Property(e => e.id).IsModified = false;
            _context.SaveChanges();
            return Ok("Khôi phục thành công");
        }

        [HttpPost("thong_tin_nguoi_dungs")]
        public IActionResult List_nguoi_dungs(CommonRequest req)
        {            
            var qr = _context.thong_tin_nguoi_dung.AsQueryable();

            if (!string.IsNullOrEmpty(req.trangthai_xoa))
            {
                if (req.trangthai_xoa == "Đã xóa")
                {
                    qr = qr.Where(x => x.daxoa == true);
                }
                else if (req.trangthai_xoa == "Chưa xóa")
                {
                    qr = qr.Where(x => x.daxoa == false);
                }
            }
            else
            {
                qr = qr.Where(x => x.daxoa == false);
            }

            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t =>
                  t.ten_dangnhap.ToUpper().Contains(tuKhoaUpper) ||
                  t.email.ToUpper().Contains(tuKhoaUpper) ||
                  t.so_dien_thoai.ToUpper().Contains(tuKhoaUpper) ||
                  t.ten_day_du.ToUpper().Contains(tuKhoaUpper) 
                  //||
                  //_context.thong_tin_don_vi.Any(tc => tc.ten.ToUpper().Contains(tuKhoaUpper)) ||
                  //_context.thong_tin_chuc_vu.Any(cv => cv.ten.ToUpper().Contains(tuKhoaUpper))
                );
            }

            var recordCount = 0;
            if (string.IsNullOrEmpty(req.anchor))
            {
                recordCount = qr.Count();
            }
            qr = qr.OrderByDescending(k => k.thoigian_tao).ThenBy(k => k.ten_dangnhap);
            if (req.anchor != null && req.anchor.Trim() != "")
            {
                string[] parts = req.anchor.Split('#');
                if (parts.Length >= 2)
                {
                    if (long.TryParse(parts[0], out long anchorCreated))
                    {
                        string anchorMaDinhDanh = parts[1];
                        qr = qr.Where(k => k.thoigian_tao < anchorCreated || (k.thoigian_tao == anchorCreated && k.ten_dangnhap.CompareTo(anchorMaDinhDanh) > 0));
                    }
                }
            }

            if (req.limit < 1)
            {
                req.limit = 100000;
            }
            qr = qr.Take(req.limit + 1);

            var listRecords = qr.ToList();

            var res = new thong_tin_nguoi_dungs
            {
                limit = req.limit
            };
            if (listRecords.Count > req.limit)
            {
                var anchorResMaDinhDanh = listRecords[req.limit - 1].ten_dangnhap;
                var anchorCreatedNumber = listRecords[req.limit - 1].thoigian_tao;
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

            foreach (var record in res.Records)
            {
                if (record != null && !string.IsNullOrEmpty(record.ma_tochuc))
                {
                    record.thong_tin_don_vi = _context.thong_tin_don_vi.Find(record.ma_tochuc);
                }
                if (record != null && !string.IsNullOrEmpty(record.ma_chucvu))
                {
                    record.thong_tin_chuc_vu = _context.thong_tin_chuc_vu.Find(record.ma_chucvu);
                }
            }

            return Ok(res);
        }

    }
}
