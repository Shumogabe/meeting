using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class QuanLyGiamSatIPMayChuNguoiQuanTriController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        public QuanLyGiamSatIPMayChuNguoiQuanTriController(IConfiguration configuration, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("giam_sat_thong_tin_ip_quan_tri/upsert")]
        public IActionResult Upsert_giamsat_ip_quantri(giam_sat_thong_tin_ip_quan_tri dataSend)
        {
            if (string.IsNullOrEmpty(dataSend.ip))
            {
                return StatusCode(400, "ip_required");
            }
            var _DbItem = _context.giam_sat_thong_tin_ip_quan_tri.Find(dataSend.ip);
            if (_DbItem == null)
            {
                dataSend.thoigian_tao = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                _context.giam_sat_thong_tin_ip_quan_tri.Add(dataSend);
            }
            else
            {
                _DbItem.Assign(dataSend);
                //_DbItem.trangthai_xoa = "Chưa xóa";
                _context.giam_sat_thong_tin_ip_quan_tri.Update(_DbItem);
            }
            _context.SaveChanges();
            return Ok(dataSend);
        }

        [HttpGet("giam_sat_thong_tin_ip_quan_tri/{id}")]
        public IActionResult Get_giamsat_ip_quantri_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var _DbItem = _context.giam_sat_thong_tin_ip_quan_tri.Find(id);
            if (_DbItem == null)
                return StatusCode(400, "id_notFound");
            return Ok(_DbItem);
        }

        [HttpPost("giam_sat_thong_tin_ip_quan_tri/delete/{id}")]
        public IActionResult Delete_giamsat_ip_quantri_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.giam_sat_thong_tin_ip_quan_tri.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            _context.giam_sat_thong_tin_ip_quan_tri.Remove(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("giam_sat_thong_tin_ip_quan_tris")]
        public IActionResult List_giamsat_ip_quantris(CommonRequest req)
        {

            var qr = _context.giam_sat_thong_tin_ip_quan_tri.AsQueryable();

            if (!string.IsNullOrEmpty(req.trangthai_xoa) && req.trangthai_xoa == "Đã xóa")
            {
                qr = qr.Where(t => t.trangthai_xoa == req.trangthai_xoa);
            }
            else
            {
                qr = qr.Where(t => t.trangthai_xoa != "Đã xóa");
            }

            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.ip.ToUpper().Contains(tuKhoaUpper) || t.ten.ToUpper().Contains(tuKhoaUpper)
                   || t.thiet_bi.ToUpper().Contains(tuKhoaUpper) || t.mac.ToUpper().Contains(tuKhoaUpper));
            }

            var recordCount = 0;
            if (string.IsNullOrEmpty(req.anchor))
            {
                recordCount = qr.Count();
            }
            qr = qr.OrderByDescending(k => k.thoigian_tao).ThenBy(k => k.ip);
            if (req.anchor != null && req.anchor.Trim() != "")
            {
                string[] parts = req.anchor.Split('#');
                if (parts.Length >= 2)
                {
                    if (long.TryParse(parts[0], out long anchorCreated))
                    {
                        string anchorMaDinhDanh = parts[1];
                        qr = qr.Where(k => k.thoigian_tao < anchorCreated || (k.thoigian_tao == anchorCreated && k.ip.CompareTo(anchorMaDinhDanh) > 0));
                    }
                }
            }

            if (req.limit < 1)
            {
                req.limit = 10000;
            }
            qr = qr.Take(req.limit + 1);

            var listRecords = qr.ToList();

            var res = new giam_sat_thong_tin_ip_quan_tris
            {
                limit = req.limit
            };
            if (listRecords.Count > req.limit)
            {
                var anchorResMaDinhDanh = listRecords[req.limit - 1].ip;
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

    }
}
