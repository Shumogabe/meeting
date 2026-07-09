using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;
using System.Linq;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class NhatKyTruyCapPhanMemController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        public NhatKyTruyCapPhanMemController(IConfiguration configuration, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("log_truycapphanmem/upsert")]
        public IActionResult Upsert_wso2_nhat_ky_truycap(log_truycapphanmem dataSend)
        {
            if (string.IsNullOrEmpty(dataSend.ten_dangnhap) || string.IsNullOrEmpty(dataSend.ten_ung_dung))
            {
                return StatusCode(400, "ten_dangnhap_and_ten_ung_dung_required");
            }
            dataSend.thoigian_dangnhap = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
            var maCreate = Utils.ToID(dataSend.ten_dangnhap + "-" + dataSend.ten_ung_dung + "-" + dataSend.thoigian_dangnhap);
            var _DbItem = _context.log_truycapphanmem.Find(dataSend.ma);
            if (_DbItem == null)
            {
                dataSend.ma = maCreate;
                _context.log_truycapphanmem.Add(dataSend);
            }
            else
            {
                _DbItem.Assign(dataSend);
                _DbItem.da_xoa = false;
                _context.log_truycapphanmem.Update(_DbItem);
            }
            _context.SaveChanges();

            return Ok(dataSend);
        }

        [HttpGet("log_truycapphanmem/{id}")]
        public IActionResult Get_wso2_nhat_ky_truycap_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var _DbItem = _context.log_truycapphanmem.Find(id);
            if (_DbItem == null)
                return StatusCode(400, "id_notFound");
            return Ok(_DbItem);
        }

        [HttpPost("log_truycapphanmem/delete/{id}")]
        public IActionResult Delete_wso2_nhat_ky_truycap_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.log_truycapphanmem.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            _context.log_truycapphanmem.Remove(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("log_truycapphanmems")]
        public IActionResult List_wso2_nhat_ky_truycaps(CommonRequest req)
        {

            var qr = _context.log_truycapphanmem.AsQueryable();

            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.ten_dangnhap.ToUpper().Contains(tuKhoaUpper) || t.ten_ung_dung.ToUpper().Contains(tuKhoaUpper)
                   || t.ip_dangnhap.ToUpper().Contains(tuKhoaUpper));
            }
            if (req?.filter_time_from > 0)
            {
                qr = qr.Where(t => t.thoigian_dangnhap >= req.filter_time_from);
            }
            if (req?.filter_time_to > 0)
            {
                qr = qr.Where(t => t.thoigian_dangnhap <= req.filter_time_to);
            }
            if (!string.IsNullOrEmpty(req?.don_vi))
            {
                var tukhoa_don_vi = req?.don_vi;
                var don_vi = _context.thong_tin_don_vi.Where(t => t.ten.ToUpper().Contains(tukhoa_don_vi) || t.ma_hanhchinh.ToUpper().Contains(tukhoa_don_vi)
                   || t.diachi.ToUpper().Contains(tukhoa_don_vi) || t.dienthoai.ToUpper().Contains(tukhoa_don_vi)
                   || t.mail.ToUpper().Contains(tukhoa_don_vi) || t.fax.ToUpper().Contains(tukhoa_don_vi)
                   || t.website.ToUpper().Contains(tukhoa_don_vi)).Select(x => x.ma).ToList();
                var nguoi_dung = _context.thong_tin_nguoi_dung.Where(x => don_vi.Contains(x.ma_tochuc)).Select(x => x.ten_dangnhap).ToList();
                qr = qr.Where(t => nguoi_dung.Contains(t.ten_dangnhap));
            }

            var recordCount = 0;
            if (string.IsNullOrEmpty(req.anchor))
            {
                recordCount = qr.Count();
            }
            qr = qr.OrderByDescending(k => k.thoigian_dangnhap).ThenBy(k => k.ma);
            if (req.anchor != null && req.anchor.Trim() != "")
            {
                string[] parts = req.anchor.Split('#');
                if (parts.Length >= 2)
                {
                    if (long.TryParse(parts[0], out long anchorCreated))
                    {
                        string anchorMaDinhDanh = parts[1];
                        qr = qr.Where(k => k.thoigian_dangnhap < anchorCreated || (k.thoigian_dangnhap == anchorCreated && k.ma.CompareTo(anchorMaDinhDanh) > 0));
                    }
                }
            }

            if (req.limit < 1)
            {
                req.limit = 10000;
            }
            qr = qr.Take(req.limit + 1);

            var listRecords = qr.ToList();

            var res = new log_truycapphanmems
            {
                limit = req.limit
            };
            if (listRecords.Count > req.limit)
            {
                var anchorResMaDinhDanh = listRecords[req.limit - 1].ma;
                var anchorCreatedNumber = listRecords[req.limit - 1].thoigian_dangnhap;
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

        [HttpGet("log_truycapphanmem/thongke")]
        public async Task<ActionResult<IEnumerable<Statistic>>> GetStatistics_ls_dk_tk_ccvc()
        {
            try
            {
                DateTime startDate = DateTime.UtcNow.Date.AddDays(-30);
                DateTime startDateInTimeZone = startDate;
                DateTime currentDateTimeInTimeZone = DateTime.UtcNow.AddHours(7);

                long startTimestamp = new DateTimeOffset(startDateInTimeZone).ToUnixTimeSeconds();
                long endTimestamp = new DateTimeOffset(currentDateTimeInTimeZone).ToUnixTimeSeconds();

                var records = _context.log_truycapphanmem
                  .Where(r => r.thoigian_dangnhap >= startTimestamp && (r.thoigian_dangnhap + (3600 * 7)) <= endTimestamp)
                  .ToList();

                var statistics = new List<Statistic>();
                DateTime currentDate = startDateInTimeZone;
                int count = 0;

                while (currentDate <= currentDateTimeInTimeZone)
                {
                    count = records.Count(r => DateTimeOffset.FromUnixTimeSeconds(r.thoigian_dangnhap + (3600 * 7)).Date == currentDate.Date);
                    statistics.Add(new Statistic
                    {
                        Date = new DateTimeOffset(currentDate).ToUnixTimeSeconds(),
                        Count = count
                    });
                    currentDate = currentDate.AddDays(1);
                }

                return statistics;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
