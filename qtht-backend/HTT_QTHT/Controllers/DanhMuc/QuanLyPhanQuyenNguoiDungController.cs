using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class QuanLyPhanQuyenNguoiDungController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        public QuanLyPhanQuyenNguoiDungController(IConfiguration configuration, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("phan_quyen_vai_tro_nguoi_dung/upsert")]
        public IActionResult Upsert_phanquyen_vaitro(phan_quyen_vai_tro_nguoi_dung dataSend)
        {
            if (string.IsNullOrEmpty(dataSend.ten_dangnhap_nguoidung))
            {
                return StatusCode(400, "ten_dangnhap_nguoidung_required");
            }
            var _DbItem = _context.phan_quyen_vai_tro_nguoi_dung.Find(dataSend.ten_dangnhap_nguoidung);
            if (_DbItem == null)
            {
                dataSend.thoigian_tao = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                _context.phan_quyen_vai_tro_nguoi_dung.Add(dataSend);
            }
            else
            {
                _DbItem.Assign(dataSend);
                _DbItem.daxoa = false;
                _context.phan_quyen_vai_tro_nguoi_dung.Update(_DbItem);
            }
            _context.SaveChanges();
            return Ok(dataSend);
        }

        [HttpGet("phan_quyen_vai_tro_nguoi_dung/{id}")]
        public IActionResult Get_phanquyen_vaitro_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var _DbItem = _context.phan_quyen_vai_tro_nguoi_dung.Find(id);
            if (_DbItem == null)
                return StatusCode(400, "id_notFound");
            if (!string.IsNullOrEmpty(_DbItem.ten_dangnhap_nguoidung))
            {
                _DbItem.nguoidung = _context.thong_tin_nguoi_dung.Find(_DbItem.ten_dangnhap_nguoidung);
            }
            if (_DbItem.ma_ds_vaitros != null)
            {
                var listDanhSachVaiTro = _context.vai_tro_nguoi_dung
                  .Where(t => _DbItem.ma_ds_vaitros.Contains(t.ma))
                  .ToList();
                _DbItem.ds_vaitros = listDanhSachVaiTro;
            }
            return Ok(_DbItem);
        }

        [HttpPost("phan_quyen_vai_tro_nguoi_dung/delete/{id}")]
        public IActionResult Delete_phanquyen_vaitro_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.phan_quyen_vai_tro_nguoi_dung.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            _context.phan_quyen_vai_tro_nguoi_dung.Remove(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("phan_quyen_vai_tro_nguoi_dung/remove/{id}")]
        public IActionResult Remove_phanquyen_vaitro_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.phan_quyen_vai_tro_nguoi_dung.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            db_item.daxoa = true;
            _context.phan_quyen_vai_tro_nguoi_dung.Update(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("phan_quyen_vai_tro_nguoi_dung/restore/{id}")]
        public IActionResult Restore_phanquyen_vaitro_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.phan_quyen_vai_tro_nguoi_dung.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            db_item.daxoa = false;
            _context.phan_quyen_vai_tro_nguoi_dung.Update(db_item);
            _context.SaveChanges();
            return Ok("Khôi phục thành công");
        }

        [HttpPost("phan_quyen_vai_tro_nguoi_dungs")]
        public IActionResult List_phanquyen_vaitros(CommonRequest req)
        {

            var qr = _context.phan_quyen_vai_tro_nguoi_dung.AsQueryable();

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
                qr = qr.Where(t => t.ten_dangnhap_nguoidung.ToUpper().Contains(tuKhoaUpper));
            }

            var recordCount = 0;
            if (string.IsNullOrEmpty(req.anchor))
            {
                recordCount = qr.Count();
            }
            qr = qr.OrderByDescending(k => k.thoigian_tao).ThenBy(k => k.ten_dangnhap_nguoidung);
            if (req.anchor != null && req.anchor.Trim() != "")
            {
                string[] parts = req.anchor.Split('#');
                if (parts.Length >= 2)
                {
                    if (long.TryParse(parts[0], out long anchorCreated))
                    {
                        string anchorMaDinhDanh = parts[1];
                        qr = qr.Where(k => k.thoigian_tao < anchorCreated || (k.thoigian_tao == anchorCreated && k.ten_dangnhap_nguoidung.CompareTo(anchorMaDinhDanh) > 0));
                    }
                }
            }

            if (req.limit < 1)
            {
                req.limit = 10000;
            }
            qr = qr.Take(req.limit + 1);

            var listRecords = qr.ToList();

            var res = new phan_quyen_vai_tro_nguoi_dungs
            {
                limit = req.limit
            };
            if (listRecords.Count > req.limit)
            {
                var anchorResMaDinhDanh = listRecords[req.limit - 1].ten_dangnhap_nguoidung;
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
                if (record != null && record.ma_ds_vaitros != null)
                {
                    var listDanhSachVaiTro = _context.vai_tro_nguoi_dung
                    .Where(t => record.ma_ds_vaitros.Contains(t.ma))
                    .ToList();
                    record.ds_vaitros = listDanhSachVaiTro;
                }
            }

            return Ok(res);
        }

    }
}
