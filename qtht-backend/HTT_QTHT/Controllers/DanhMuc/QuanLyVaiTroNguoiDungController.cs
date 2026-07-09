using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class QuanLyVaiTroNguoiDungController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        public QuanLyVaiTroNguoiDungController(IConfiguration configuration, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("vai_tro_nguoi_dung/upsert")]
        public IActionResult Upsert_vai_tro(vai_tro_nguoi_dung dataSend)
        {
            if (string.IsNullOrEmpty(dataSend.ma))
            {
                return StatusCode(400, "ma_required");
            }
            var _DbItem = _context.vai_tro_nguoi_dung.Find(dataSend.ma);
            if (_DbItem == null)
            {
                dataSend.thoi_gian_dk = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                dataSend.thoigian_tao = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                _context.vai_tro_nguoi_dung.Add(dataSend);
            }
            else
            {
                _DbItem.Assign(dataSend);
                _DbItem.daxoa = false;
                _context.vai_tro_nguoi_dung.Update(_DbItem);
            }
            _context.SaveChanges();
            return Ok(dataSend);
        }

        [HttpGet("vai_tro_nguoi_dung/{id}")]
        public IActionResult Get_vai_tro_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var _DbItem = _context.vai_tro_nguoi_dung.Find(id);
            if (_DbItem == null)
                return StatusCode(400, "id_notFound");
            if (_DbItem.ma_ds_thong_tin_chuc_nangs != null)
            {
                var listChucNangQuanTri = _context.thong_tin_chuc_nang
                  .Where(t => _DbItem.ma_ds_thong_tin_chuc_nangs.Contains(t.ma))
                  .ToList();
                _DbItem.ds_thong_tin_chuc_nangs = listChucNangQuanTri;
            }
            return Ok(_DbItem);
        }

        [HttpPost("vai_tro_nguoi_dung/delete/{id}")]
        public IActionResult Delete_vai_tro_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.vai_tro_nguoi_dung.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            _context.vai_tro_nguoi_dung.Remove(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("vai_tro_nguoi_dung/remove/{id}")]
        public IActionResult Remove_vai_tro_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.vai_tro_nguoi_dung.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            db_item.daxoa = true;
            _context.vai_tro_nguoi_dung.Update(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("vai_tro_nguoi_dung/restore/{id}")]
        public IActionResult Restore_vai_tro_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.vai_tro_nguoi_dung.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            db_item.daxoa = false;
            _context.vai_tro_nguoi_dung.Update(db_item);
            _context.SaveChanges();
            return Ok("Khôi phục thành công");
        }

        [HttpPost("vai_tro_nguoi_dungs")]
        public IActionResult List_vai_tros(CommonRequest req)
        {

            var qr = _context.vai_tro_nguoi_dung.AsQueryable();

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
                qr = qr.Where(t => t.ten.ToUpper().Contains(tuKhoaUpper) || t.mota.ToUpper().Contains(tuKhoaUpper));
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

            var res = new vai_tro_nguoi_dungs
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
