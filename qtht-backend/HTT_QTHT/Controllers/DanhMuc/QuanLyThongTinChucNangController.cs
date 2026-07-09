using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class QuanLyThongTinChucNangController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        public QuanLyThongTinChucNangController(IConfiguration configuration, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("thong_tin_chuc_nang/upsert")]
        public IActionResult Upsert_chucnang_quantri(thong_tin_chuc_nang dataSend)
        {
            if (string.IsNullOrEmpty(dataSend.ma))
            {
                return StatusCode(400, "ma_required");
            }
            var _DbItem = _context.thong_tin_chuc_nang.Find(dataSend.ma);
            if (_DbItem == null)
            {
                dataSend.thoigian_tao = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                _context.thong_tin_chuc_nang.Add(dataSend);
            }
            else
            {
                _DbItem.Assign(dataSend);
                _context.thong_tin_chuc_nang.Update(_DbItem);
            }
            _context.SaveChanges();
            return Ok(dataSend);
        }

        [HttpGet("thong_tin_chuc_nang/{id}")]
        public IActionResult Get_chucnang_quantri_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var _DbItem = _context.thong_tin_chuc_nang.Find(id);
            if (_DbItem == null)
                return StatusCode(400, "id_notFound");
            return Ok(_DbItem);
        }

        [HttpPost("thong_tin_chuc_nang/delete/{id}")]
        public IActionResult Delete_chucnang_quantri_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.thong_tin_chuc_nang.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            _context.thong_tin_chuc_nang.Remove(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("thong_tin_chuc_nangs")]
        public IActionResult List_chucnang_quantris(CommonRequest req)
        {
            var qr = _context.thong_tin_chuc_nang.AsQueryable();

            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.ten.ToUpper().Contains(tuKhoaUpper));
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

            var res = new thong_tin_chuc_nangs
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

    }
}
