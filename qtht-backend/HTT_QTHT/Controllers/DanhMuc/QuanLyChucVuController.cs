using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class QuanLyChucVuController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        public QuanLyChucVuController(IConfiguration configuration, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("thong_tin_chuc_vu/upsert")]
        public IActionResult Upsert_chuc_vu(thong_tin_chuc_vu dataSend)
        {
            if (string.IsNullOrEmpty(dataSend.ten) || string.IsNullOrEmpty(dataSend.ma_hanhchinh))
            {
                return StatusCode(400, "ten_and_ma_hanhchinh_required");
            }
            var maCreate = Utils.ToID(dataSend.ten + "-" + dataSend.ma_hanhchinh);
            var _DbItem = _context.thong_tin_chuc_vu.Find(maCreate);
            if (_DbItem == null)
            {
                if (!string.IsNullOrEmpty(dataSend.ma) && dataSend.ma != maCreate)
                {
                    var obj_delete = _context.thong_tin_chuc_vu.Find(dataSend.ma);
                    if (obj_delete != null)
                        _context.thong_tin_chuc_vu.Remove(obj_delete);
                }
                dataSend.ma = maCreate;
                dataSend.thoigian_tao = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                _context.thong_tin_chuc_vu.Add(dataSend);
            }
            else
            {
                _DbItem.Assign(dataSend);
                _DbItem.daxoa = false;
                _context.thong_tin_chuc_vu.Update(_DbItem);
            }
            _context.SaveChanges();
            return Ok(dataSend);
        }

        [HttpGet("thong_tin_chuc_vu/{id}")]
        public IActionResult Get_chuc_vu_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var _DbItem = _context.thong_tin_chuc_vu.Find(id);
            if (_DbItem == null)
                return StatusCode(400, "id_notFound");
            return Ok(_DbItem);
        }

        [HttpPost("thong_tin_chuc_vu/delete/{id}")]
        public IActionResult Delete_chuc_vu_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.thong_tin_chuc_vu.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            _context.thong_tin_chuc_vu.Remove(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("thong_tin_chuc_vu/remove/{id}")]
        public IActionResult Remove_chuc_vu_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.thong_tin_chuc_vu.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            db_item.daxoa = true;
            _context.thong_tin_chuc_vu.Update(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("thong_tin_chuc_vu/restore/{id}")]
        public IActionResult Restore_chuc_vu_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.thong_tin_chuc_vu.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            db_item.daxoa = false;
            _context.thong_tin_chuc_vu.Update(db_item);
            _context.SaveChanges();
            return Ok("Khôi phục thành công");
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

    }
}
