using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class ThietLapCoCheSaoLuuController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        public ThietLapCoCheSaoLuuController(IConfiguration configuration, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("thiet_lap_co_che_sao_luu/upsert")]
        public IActionResult Upsert_thietlap_coche_saoluu(thiet_lap_co_che_sao_luu dataSend)
        {
            if (string.IsNullOrEmpty(dataSend.ten_bang) || string.IsNullOrEmpty(dataSend.tenfile_saoluu))
            {
                return StatusCode(400, "ten_bang_and_tenfile_saoluu_required");
            }

            var maCreate = Utils.ToID(dataSend.ten_bang + "-" + dataSend.tenfile_saoluu);
            var _DbItem = _context.thiet_lap_co_che_sao_luu.Find(maCreate);
            if (_DbItem == null)
            {
                if (!string.IsNullOrEmpty(dataSend.ma) && dataSend.ma != maCreate)
                {
                    var obj_delete = _context.thiet_lap_co_che_sao_luu.Find(dataSend.ma);
                    if (obj_delete != null)
                        _context.thiet_lap_co_che_sao_luu.Remove(obj_delete);
                }
                dataSend.ma = maCreate;
                dataSend.thoigian_tao = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                _context.thiet_lap_co_che_sao_luu.Add(dataSend);
            }
            else
            {
                _DbItem.Assign(dataSend);
                _context.thiet_lap_co_che_sao_luu.Update(_DbItem);
            }
            _context.SaveChanges();

            return Ok(dataSend);
        }

        [HttpGet("thiet_lap_co_che_sao_luu/{id}")]
        public IActionResult Get_thietlap_coche_saoluu_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var _DbItem = _context.thiet_lap_co_che_sao_luu.Find(id);
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

        [HttpPost("thiet_lap_co_che_sao_luu/delete/{id}")]
        public IActionResult Delete_thietlap_coche_saoluu_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.thiet_lap_co_che_sao_luu.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            _context.thiet_lap_co_che_sao_luu.Remove(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("thiet_lap_co_che_sao_luus")]
        public IActionResult List_thietlap_coche_saoluus(CommonRequest req)
        {

            var qr = _context.thiet_lap_co_che_sao_luu.AsQueryable();

            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.ten_bang.ToUpper().Contains(tuKhoaUpper) || t.tenfile_saoluu.ToUpper().Contains(tuKhoaUpper));
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

            var res = new thiet_lap_co_che_sao_luus
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
