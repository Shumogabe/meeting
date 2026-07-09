using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class QuanLyChanTruyCapController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        public QuanLyChanTruyCapController(IConfiguration configuration, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("chan_truy_cap/upsert")]
        public IActionResult Upsert_giamsat_truycap(chan_truy_cap dataSend)
        {
            if (string.IsNullOrEmpty(dataSend.ten))
            {
                return StatusCode(400, "ten_required");
            }
            dataSend.thoigian_tao = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
            var createMa = dataSend.ten + '-' + dataSend.thoigian_tao;

            var _DbItem = _context.chan_truy_cap.Find(dataSend.ma);
            if (_DbItem == null)
            {
                dataSend.Serialize();
                dataSend.ma = createMa;
                _context.chan_truy_cap.Add(dataSend);
            }
            else
            {
                _DbItem.Deserialize();
                _DbItem.Assign(dataSend);
                _DbItem.Serialize();
                //_DbItem.trangthai_xoa = "Chưa xóa";
                _context.chan_truy_cap.Update(_DbItem);
            }
            _context.SaveChanges();
            return Ok(dataSend);
        }

        [HttpGet("chan_truy_cap/{id}")]
        public IActionResult Get_giamsat_truycap_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var _DbItem = _context.chan_truy_cap.Find(id);
            if (_DbItem == null)
                return StatusCode(400, "id_notFound");
            _DbItem.Deserialize();
            return Ok(_DbItem);
        }

        [HttpPost("chan_truy_cap/delete/{id}")]
        public IActionResult Delete_giamsat_truycap_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.chan_truy_cap.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            _context.chan_truy_cap.Remove(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("chan_truy_cap/remove/{id}")]
        public IActionResult Remove_giamsat_truycap_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.chan_truy_cap.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            db_item.trangthai_xoa = "Đã xóa";
            _context.chan_truy_cap.Update(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("chan_truy_cap/restore/{id}")]
        public IActionResult Restore_giamsat_truycap_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.chan_truy_cap.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            db_item.trangthai_xoa = "Chưa xóa";
            _context.chan_truy_cap.Update(db_item);
            _context.SaveChanges();
            return Ok("Khôi phục thành công");
        }

        [HttpPost("chan_truy_caps")]
        public IActionResult List_giamsat_truycaps(giamsat_truycap_Request req)
        {
            var qr = _context.chan_truy_cap.AsQueryable();

            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.ten.ToUpper().Contains(tuKhoaUpper));
            }

            if (!string.IsNullOrEmpty(req.trangthai_xoa) && req.trangthai_xoa == "Đã xóa")
            {
                qr = qr.Where(t => t.trangthai_xoa == req.trangthai_xoa);
            }
            else
            {
                qr = qr.Where(t => t.trangthai_xoa != "Đã xóa");
            }

            var recordCount = 0;
            if (string.IsNullOrEmpty(req.anchor))
            {
                recordCount = qr.Count();
            }
            qr = qr.OrderByDescending(k => k.thoigian_tao).ThenBy(k => k.ten);
            if (req.anchor != null && req.anchor.Trim() != "")
            {
                string[] parts = req.anchor.Split('#');
                if (parts.Length >= 2)
                {
                    if (long.TryParse(parts[0], out long anchorCreated))
                    {
                        string anchorMaDinhDanh = parts[1];
                        qr = qr.Where(k => k.thoigian_tao < anchorCreated || (k.thoigian_tao == anchorCreated && k.ten.CompareTo(anchorMaDinhDanh) > 0));
                    }
                }
            }

            if (req.limit < 1)
            {
                req.limit = 10000;
            }
            qr = qr.Take(req.limit + 1);

            var listRecords = qr.ToList();

            var res = new chan_truy_caps
            {
                limit = req.limit
            };
            if (listRecords.Count > req.limit)
            {
                var anchorResMaDinhDanh = listRecords[req.limit - 1].ten;
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

            foreach (var record in listRecords)
            {
                if (record != null)
                {
                    record.Deserialize();
                }
            }

            return Ok(res);
        }

    }
}
