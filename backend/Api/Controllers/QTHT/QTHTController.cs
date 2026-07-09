using HTT.Api.Models;
using HTT.Api.Services;
using HTT.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace QTHT.Api.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class QTHTController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private IConfiguration _configuration;
        public QTHTController(IConfiguration configuration, QTHT_HTT_Context context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpGet("phan_quyen_vai_tro_nguoi_dung/quyen_nguoi_dung")]
        public IActionResult Get_phanquyen_vaitro_ByToken()
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;

            List<thong_tin_chuc_nang> list_thong_tin_chuc_nang = new List<thong_tin_chuc_nang>();

            var ma_ds_vaitros_jsonstring = _context.phan_quyen_vai_tro_nguoi_dung.Where(x => x.daxoa == false && x.ten_dangnhap_nguoidung == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "")).Select(x => x.ma_ds_vaitros).FirstOrDefault();

            if (ma_ds_vaitros_jsonstring == null) return Ok(list_thong_tin_chuc_nang);

            string[] ma_ds_vaitros = JsonConvert.DeserializeObject<string[]>(ma_ds_vaitros_jsonstring);

            foreach (var item_ma_ds_vaitros in ma_ds_vaitros)
            {
                var ma_ds_thong_tin_chuc_nangs_jsonstring = _context.vai_tro_nguoi_dung.Where(x => x.ma == item_ma_ds_vaitros && x.daxoa == false).Select(x => x.ma_ds_thong_tin_chuc_nangs).FirstOrDefault();

                if (ma_ds_thong_tin_chuc_nangs_jsonstring == null) return Ok(list_thong_tin_chuc_nang);

                string[] ma_ds_thong_tin_chuc_nangs = JsonConvert.DeserializeObject<string[]>(ma_ds_thong_tin_chuc_nangs_jsonstring);

                foreach (var item_ma_ds_thong_tin_chuc_nangs in ma_ds_thong_tin_chuc_nangs)
                {
                    var thong_tin_chuc_nang = _context.thong_tin_chuc_nang.Where(x => x.ma == item_ma_ds_thong_tin_chuc_nangs).FirstOrDefault();
                    if (thong_tin_chuc_nang != null)
                        list_thong_tin_chuc_nang.Add(thong_tin_chuc_nang);
                }
            }

            return Ok(list_thong_tin_chuc_nang);
        }

        [HttpGet("thong_tin_chuc_nang/{ten}")]
        public IActionResult Get_thong_tin_chuc_nang_ByTen(string ten)
        {
            if (string.IsNullOrEmpty(ten))
                return StatusCode(400, new { message = "id_required" });
            var _DbItem = _context.thong_tin_chuc_nang.Where(x => x.ten == ten).FirstOrDefault();
            if (_DbItem == null)
                return StatusCode(400, new { message = "id_notFound" });
            return Ok(_DbItem);
        }

        [HttpGet("thong_tin_nguoi_dung")]
        public IActionResult Get_nguoi_dung_ByToken()
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;

            var _DbItem = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).FirstOrDefault();
            if (_DbItem == null)
                return StatusCode(299, new { message = "NotFound" });
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

        [HttpPost("log_ql_nhat_ky_loi/upsert")]
        [AllowAnonymous]
        public IActionResult Upsert_wso2_error(log_ql_nhat_ky_loi dataSend)
        {
            if (dataSend.thoigian_loi <= 0)
            {
                return StatusCode(400, new { message = "thoigian_loi_required" });
            }
            var check_exist = _context.log_ql_nhat_ky_loi.Find(dataSend.thoigian_loi);
            if (check_exist == null)
            {
                _context.log_ql_nhat_ky_loi.Add(dataSend);
                _context.SaveChanges();
            }
            return Ok(dataSend);
        }

        [HttpPost("log_ql_thamgiaphonghop/upsert")]
        public IActionResult Upsert_nhat_ky(log_ql_thamgiaphonghop dataSend)
        {
            if (string.IsNullOrEmpty(dataSend.tai_khoan))
            {
                return StatusCode(400, new { message = "ten_taikhoan_required" });
            }
            string hostName = Dns.GetHostName();
            string IP = Dns.GetHostByName(hostName).AddressList[0].ToString();
            dataSend.ip_may = IP;
            dataSend.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
            var maCreate = Util.ToID(dataSend.tai_khoan + "-" + dataSend.thoigian_tao);
            var _DbItem = _context.log_ql_thamgiaphonghop.Find(dataSend.ma);
            if (_DbItem == null)
            {
                dataSend.ma = maCreate;
                _context.log_ql_thamgiaphonghop.Add(dataSend);
            }
            else
            {
                _DbItem.Assign(dataSend);
                _context.log_ql_thamgiaphonghop.Update(_DbItem);
            }
            _context.SaveChanges();

            return Ok(dataSend);
        }

        [HttpPost("log_ql_dangnhap/upsert")]
        public IActionResult Upsert_wso2_nhat_ky_truycap(log_ql_dangnhap dataSend)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            dataSend.ten_dangnhap = user_current;
            if (string.IsNullOrEmpty(dataSend.ten_dangnhap) || string.IsNullOrEmpty(dataSend.ten_ung_dung))
            {
                return StatusCode(400, new { message = "ten_dangnhap_and_ten_ung_dung_required" });
            }
            string hostName = Dns.GetHostName();
            string IP = Dns.GetHostByName(hostName).AddressList[0].ToString();
            dataSend.ip_dangnhap = IP;
            dataSend.thoigian_dangnhap = Util.DateTimeToUnixTimeStamp(DateTime.Now);
            var maCreate = Util.ToID(dataSend.ten_dangnhap + "-" + dataSend.ten_ung_dung + "-" + dataSend.thoigian_dangnhap);

            var _DbItem = new log_ql_dangnhap();

            if (!string.IsNullOrEmpty(dataSend.ma))
            {
                _DbItem = _context.log_ql_dangnhap.Find(dataSend.ma);
            }
            else
            {
                _DbItem = _context.log_ql_dangnhap.Find(maCreate);
            }

            if (_DbItem == null)
            {
                dataSend.ma = maCreate;
                _context.log_ql_dangnhap.Add(dataSend);
            }
            else
            {
                _DbItem.Assign(dataSend);
                _DbItem.da_xoa = false;
                _context.log_ql_dangnhap.Update(_DbItem);
            }
            //var check_exist = _context.log_ql_dangnhap.Find(maCreate);
            //if (check_exist != null) return Ok(dataSend);
            _context.SaveChanges();

            return Ok(dataSend);
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

        [HttpPost("thong_tin_don_vis")]
        public IActionResult List_to_chucs(to_chuc_and_chuc_vu_Request req)
        {

            var qr = _context.thong_tin_don_vi.AsQueryable();

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
                qr = qr.Where(t => t.ten.ToUpper().Contains(tuKhoaUpper) || t.ma_hanhchinh.ToUpper().Contains(tuKhoaUpper)
                   || t.diachi.ToUpper().Contains(tuKhoaUpper) || t.dienthoai.ToUpper().Contains(tuKhoaUpper)
                   || t.mail.ToUpper().Contains(tuKhoaUpper) || t.fax.ToUpper().Contains(tuKhoaUpper)
                   || t.website.ToUpper().Contains(tuKhoaUpper));
            }

            if (!string.IsNullOrEmpty(req.trangthai_hoatdong))
            {
                req.trangthai_hoatdong = req.trangthai_hoatdong.Trim().ToUpper();
                qr = qr.Where(t => t.trangthai_hoatdong.ToUpper().Contains(req.trangthai_hoatdong));
            }

            var recordCount = 0;
            if (string.IsNullOrEmpty(req.anchor))
            {
                recordCount = qr.Count();
            }
            qr = qr.OrderByDescending(k => k.thoigian_tao).ThenBy(k => k.ma);
            if (req.anchor != null && req.anchor.Trim() != "")
            {
                string[] parts = req.anchor.Split('#');
                if (parts.Length >= 2)
                {
                    if (long.TryParse(parts[0], out long anchorCreated))
                    {
                        string anchorMaDinhDanh = parts[1];
                        qr = qr.Where(k => k.thoigian_tao < anchorCreated || (k.thoigian_tao == anchorCreated && k.ma.CompareTo(anchorMaDinhDanh) > 0));
                    }
                }
            }

            if (req.limit < 1)
            {
                req.limit = 10000;
            }
            qr = qr.Take(req.limit + 1);

            var listRecords = qr.ToList();

            var res = new thong_tin_don_vis
            {
                limit = req.limit
            };
            if (listRecords.Count > req.limit)
            {
                var anchorResMaDinhDanh = listRecords[req.limit - 1].ma;
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

            return Ok(res);
        }

        [HttpPost("thong_tin_chuc_vus")]
        public IActionResult List_chuc_vus(to_chuc_and_chuc_vu_Request req)
        {

            var qr = _context.thong_tin_chuc_vu.AsQueryable();

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
                qr = qr.Where(t => t.ten.ToUpper().Contains(tuKhoaUpper) || t.ma_hanhchinh.ToUpper().Contains(tuKhoaUpper));
            }

            if (!string.IsNullOrEmpty(req.trangthai_hoatdong))
            {
                req.trangthai_hoatdong = req.trangthai_hoatdong.Trim().ToUpper();
                qr = qr.Where(t => t.trangthai_hoatdong.ToUpper().Contains(req.trangthai_hoatdong));
            }

            var recordCount = 0;
            if (string.IsNullOrEmpty(req.anchor))
            {
                recordCount = qr.Count();
            }
            qr = qr.OrderBy(k => k.thutu);
            if (req.anchor != null && req.anchor.Trim() != "")
            {
                string[] parts = req.anchor.Split('#');
                if (parts.Length >= 2)
                {
                    if (long.TryParse(parts[0], out long anchorCreated))
                    {
                        string anchorMaDinhDanh = parts[1];
                        qr = qr.Where(k => k.thoigian_tao < anchorCreated || (k.thoigian_tao == anchorCreated && k.ma.CompareTo(anchorMaDinhDanh) > 0));
                    }
                }
            }

            if (req.limit < 1)
            {
                req.limit = 10000;
            }
            qr = qr.Take(req.limit + 1);

            var listRecords = qr.ToList();

            var res = new thong_tin_chuc_vus
            {
                limit = req.limit
            };
            if (listRecords.Count > req.limit)
            {
                var anchorResMaDinhDanh = listRecords[req.limit - 1].ma;
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

            return Ok(res);
        }

        [HttpPost("thong_tin_nguoi_dung/upsert")]
        public async Task<IActionResult> Upsert_nguoi_dung(thong_tin_nguoi_dung dataSend)
        {
            if (string.IsNullOrEmpty(dataSend.ten_dangnhap))
            {
                return StatusCode(400, new { message = "ten_dangnhap_required" });
            }
            var _DbItem = _context.thong_tin_nguoi_dung.Find(dataSend.ten_dangnhap);
            if (_DbItem == null)
            {
                return NotFound(new { message = "Không tìm thấy người dùng" });
            }
            else
            {
                dataSend.id_wso2 = _DbItem.id_wso2;
                _DbItem.Assign(dataSend);
                _DbItem.daxoa = false;
                _context.thong_tin_nguoi_dung.Update(_DbItem).Property(e => e.id).IsModified = false;
            }
            _context.SaveChanges();
            return Ok(dataSend);
        }

        #region user from wso2 is
        [NonAction]
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
                    return BadRequest(new { message = ex });

                }
            }

        }

        [NonAction]
        public wso2is_config GetWso2Is_Config()
        {
            try
            {
                wso2is_config wso2is_cf = new wso2is_config();
                // var config = _context.tl_ch_hethong.Where(x => x.tencauhinh.Contains("wso2")).FirstOrDefault();
                var config = _configuration.GetSection("CauHinh:HeThong:HeThong_wso2is").Get<CauHinhItem>();
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
        #endregion
        //[NonAction]
    }
}
