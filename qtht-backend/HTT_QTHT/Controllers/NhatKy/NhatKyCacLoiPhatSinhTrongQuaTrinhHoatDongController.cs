using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HTT_QTHT.Models;
using Microsoft.EntityFrameworkCore;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class NhatKyCacLoiPhatSinhTrongQuaTrinhHoatDongController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        public NhatKyCacLoiPhatSinhTrongQuaTrinhHoatDongController(IConfiguration configuration, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("log_ql_nhat_ky_loi/upsert")]
        [AllowAnonymous]
        public IActionResult Upsert_wso2_error(log_ql_nhat_ky_loi dataSend)
        {
            if (dataSend.thoigian_loi <= 0)
            {
                return StatusCode(400, "thoigian_loi_required");
            }
            var check_exist = _context.log_ql_nhat_ky_loi.Where(x => x.thoigian_loi == dataSend.thoigian_loi);
            if (check_exist == null)
            {
                _context.log_ql_nhat_ky_loi.Add(dataSend);
                _context.SaveChanges();
            }
            return Ok(dataSend);
        }

        [HttpGet("log_ql_nhat_ky_loi/{id}")]
        public IActionResult Get_wso2_error_ById(long id)
        {
            if (id == default)
                return StatusCode(400, "ma_required");
            var _DbItem = _context.log_ql_nhat_ky_loi.Find(id);
            if (_DbItem == null)
                return StatusCode(400, "ma_notFound");
            return Ok(_DbItem);
        }

        [HttpPost("log_ql_nhat_ky_lois")]
        public IActionResult List_wso2_errors(CommonRequest req)
        {

            var qr = _context.log_ql_nhat_ky_loi.AsQueryable();

            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.noi_dung.ToUpper().Contains(tuKhoaUpper));
            }


            if (req?.filter_time_from > 0)
            {
                qr = qr.Where(t => t.thoigian_loi >= req.filter_time_from);
            }
            if (req?.filter_time_to > 0)
            {
                qr = qr.Where(t => t.thoigian_loi <= req.filter_time_to);
            }

            var recordCount = 0;
            if (string.IsNullOrEmpty(req.anchor))
            {
                recordCount = qr.Count();
            }
            qr = qr.OrderByDescending(k => k.thoigian_loi);
            if (req.anchor != null && req.anchor.Trim() != "")
            {
                if (long.TryParse(req.anchor, out long anchorCreated))
                {
                    qr = qr.Where(k => k.thoigian_loi < anchorCreated);
                }
            }

            if (req.limit < 1)
            {
                req.limit = 10000;
            }
            qr = qr.Take(req.limit + 1);

            var listRecords = qr.ToList();

            var res = new log_ql_nhat_ky_lois
            {
                limit = req.limit
            };
            if (listRecords.Count > req.limit)
            {
                var anchorCreatedNumber = listRecords[req.limit - 1].thoigian_loi;
                var anchorResCreated = "";
                anchorResCreated = anchorCreatedNumber > 0 ? anchorCreatedNumber.ToString() : "";

                res.anchor = anchorResCreated;
                res.Records = listRecords.Take(req.limit).ToList();
            }
            else
            {
                res.Records = listRecords;
            }
            res.count = recordCount;

            return Ok(res);
        }

        [HttpGet("log_ql_nhat_ky_loi/thongke")]
        public async Task<ActionResult<IEnumerable<Statistic>>> GetStatistics_ls_dk_tk_ccvc()
        {
            try
            {
                DateTime startDate = DateTime.UtcNow.Date.AddDays(-30);
                DateTime startDateInTimeZone = startDate;
                DateTime currentDateTimeInTimeZone = DateTime.UtcNow.AddHours(7);

                long startTimestamp = new DateTimeOffset(startDateInTimeZone).ToUnixTimeMilliseconds();
                long endTimestamp = new DateTimeOffset(currentDateTimeInTimeZone).ToUnixTimeMilliseconds();

                var records = await _context.log_ql_nhat_ky_loi
                  .Where(r => r.thoigian_loi >= startTimestamp && (r.thoigian_loi + (3600 * 7)) <= endTimestamp)
                  .ToListAsync();

                var statistics = new List<Statistic>();
                DateTime currentDate = startDateInTimeZone;
                int count = 0;

                while (currentDate <= currentDateTimeInTimeZone)
                {
                    count = records.Count(r => DateTimeOffset.FromUnixTimeMilliseconds(r.thoigian_loi + (3600 * 7)).Date == currentDate.Date);
                    statistics.Add(new Statistic
                    {
                        Date = new DateTimeOffset(currentDate).ToUnixTimeMilliseconds(),
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
