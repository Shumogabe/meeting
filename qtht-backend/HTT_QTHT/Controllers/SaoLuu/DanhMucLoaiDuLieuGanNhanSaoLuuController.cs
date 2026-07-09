using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class DanhMucLoaiDuLieuGanNhanSaoLuuController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        public DanhMucLoaiDuLieuGanNhanSaoLuuController(IConfiguration configuration, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("dulieu_gannhan_saoluu/upsert")]
        public IActionResult Upsert_dulieu_saoluu(dulieu_gannhan_saoluu dataSend)
        {
            if (string.IsNullOrEmpty(dataSend.ten_bang))
            {
                return StatusCode(400, "ten_bang_required");
            }
            var _DbItem = _context.dulieu_gannhan_saoluu.Find(dataSend.ten_bang);
            if (_DbItem == null)
            {
                dataSend.thoigian_tao = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                _context.dulieu_gannhan_saoluu.Add(dataSend);
            }
            else
            {
                _DbItem.Assign(dataSend);
                _DbItem.trangthai_xoa = "Chưa xóa";
                _context.dulieu_gannhan_saoluu.Update(_DbItem);
            }
            _context.SaveChanges();
            return Ok(dataSend);
        }

        [HttpGet("dulieu_gannhan_saoluu/{id}")]
        public IActionResult Get_dulieu_saoluu_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var _DbItem = _context.dulieu_gannhan_saoluu.Find(id);
            if (_DbItem == null)
                return StatusCode(400, "id_notFound");
            if (_DbItem != null && _DbItem.ten_bang != null)
            {
                var allTable = _httcontext.Model.GetEntityTypes();
                List<bangdulieu> List = new List<bangdulieu>();
                foreach (var item in allTable)
                {
                    bangdulieu Bangdulieu = new bangdulieu();
                    Bangdulieu.ma = item.ClrType.Name;
                    Bangdulieu.ten_bang = item.ClrType.Name;
                    Bangdulieu.thoigian_saoluu = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                    List.Add(Bangdulieu);
                }
                var BangDuLieu = List
                .Where(t => _DbItem.ten_bang.Contains(t.ma))
                .FirstOrDefault();
                _DbItem.bangdulieu = BangDuLieu;
            }

            return Ok(_DbItem);
        }

        [HttpPost("dulieu_gannhan_saoluu/delete/{id}")]
        public IActionResult Delete_dulieu_saoluu_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.dulieu_gannhan_saoluu.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            _context.dulieu_gannhan_saoluu.Remove(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("dulieu_gannhan_saoluus")]
        public IActionResult List_dulieu_saoluus(giamsat_truycap_Request req)
        {
            var qr = _context.dulieu_gannhan_saoluu.AsQueryable();

            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.ten_bang.ToUpper().Contains(tuKhoaUpper) || t.mo_ta.ToUpper().Contains(tuKhoaUpper));
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
            qr = qr.OrderByDescending(k => k.thoigian_tao).ThenBy(k => k.ten_bang);
            if (req.anchor != null && req.anchor.Trim() != "")
            {
                string[] parts = req.anchor.Split('#');
                if (parts.Length >= 2)
                {
                    if (long.TryParse(parts[0], out long anchorCreated))
                    {
                        string anchorMaDinhDanh = parts[1];
                        qr = qr.Where(k => k.thoigian_tao < anchorCreated || (k.thoigian_tao == anchorCreated && k.ten_bang.CompareTo(anchorMaDinhDanh) > 0));
                    }
                }
            }

            if (req.limit < 1)
            {
                req.limit = 10000;
            }
            qr = qr.Take(req.limit + 1);

            var listRecords = qr.ToList();

            var res = new dulieu_gannhan_saoluus
            {
                limit = req.limit
            };
            if (listRecords.Count > req.limit)
            {
                var anchorResMaDinhDanh = listRecords[req.limit - 1].ten_bang;
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
