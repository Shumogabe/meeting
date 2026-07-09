using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;
using System.Net;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class NhatKyThamGiaPhongHopController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        public NhatKyThamGiaPhongHopController(IConfiguration configuration, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("log_ql_thamgiaphonghop/upsert")]
        public IActionResult Upsert_nhat_ky(log_ql_thamgiaphonghop dataSend)
        {
            if (string.IsNullOrEmpty(dataSend.tai_khoan))
            {
                return StatusCode(400, "ten_taikhoan_required");
            }
            string hostName = Dns.GetHostName();
            string IP = Dns.GetHostByName(hostName).AddressList[0].ToString();
            dataSend.ip_may = IP;
            dataSend.thoigian_tao = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
            var maCreate = Utils.ToID(dataSend.tai_khoan + "-" + dataSend.thoigian_tao);
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

        [HttpGet("log_ql_thamgiaphonghop/{id}")]
        public IActionResult Get_nhat_ky_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var _DbItem = _context.log_ql_thamgiaphonghop.Find(id);
            if (_DbItem == null)
                return StatusCode(400, "id_notFound");
            return Ok(_DbItem);
        }

        [HttpPost("log_ql_thamgiaphonghop/delete/{id}")]
        public IActionResult Delete_nhat_ky_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.log_ql_thamgiaphonghop.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            _context.log_ql_thamgiaphonghop.Remove(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("log_ql_thamgiaphonghops")]
        public IActionResult List_nhat_kys(nhat_ky_request req)
        {

            var qr = _context.log_ql_thamgiaphonghop.AsQueryable();

            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.tai_khoan.ToUpper().Contains(tuKhoaUpper) || t.noi_dung.ToUpper().Contains(tuKhoaUpper)
                   || t.ip_may.ToUpper().Contains(tuKhoaUpper));
            }
            if (!string.IsNullOrEmpty(req.loai_hoatdong))
            {
                qr = qr.Where(x => x.loai_hoatdong == req.loai_hoatdong);
            }
            if (!string.IsNullOrEmpty(req.chuc_nang))
            {
                qr = qr.Where(x => x.chuc_nang == req.chuc_nang);
            }
            if (req?.filter_time_from > 0)
            {
                qr = qr.Where(t => t.thoigian_tao >= req.filter_time_from);
            }
            if (req?.filter_time_to > 0)
            {
                qr = qr.Where(t => t.thoigian_tao <= req.filter_time_to);
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

            var res = new log_ql_thamgiaphonghops
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

        [HttpGet("log_ql_thamgiaphonghop/thongke")]
        public async Task<ActionResult<IEnumerable<Statistic>>> GetStatistics_nhat_ky()
        {
            try
            {
                DateTime startDate = DateTime.UtcNow.Date.AddDays(-30);
                DateTime startDateInTimeZone = startDate;
                DateTime currentDateTimeInTimeZone = DateTime.UtcNow.AddHours(7);

                long startTimestamp = new DateTimeOffset(startDateInTimeZone).ToUnixTimeSeconds();
                long endTimestamp = new DateTimeOffset(currentDateTimeInTimeZone).ToUnixTimeSeconds();

                var records = _context.log_ql_thamgiaphonghop
                    .Where(r => r.thoigian_tao >= startTimestamp && (r.thoigian_tao + (3600 * 7)) <= endTimestamp)
                    .ToList();

                var statistics = new List<Statistic>();
                DateTime currentDate = startDateInTimeZone;
                int count = 0;

                while (currentDate <= currentDateTimeInTimeZone)
                {
                    count = records.Count(r => DateTimeOffset.FromUnixTimeSeconds(r.thoigian_tao + (3600 * 7)).Date == currentDate.Date);
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
