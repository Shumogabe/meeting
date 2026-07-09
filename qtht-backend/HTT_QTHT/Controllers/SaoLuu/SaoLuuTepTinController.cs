using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;
using NPOI.Util;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class SaoLuuTepTinController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        public SaoLuuTepTinController(IConfiguration configuration, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("sao_luu_tep_tin/upsert")]
        public IActionResult Upsert_saoluu_teptin(sao_luu_tep_tin dataSend)
        {
            if (string.IsNullOrEmpty(dataSend.tenfile_saoluu))
            {
                return StatusCode(400, "tenfile_saoluu_required");
            }
            dataSend.thoigian_saoluu = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
            var maCreate = Utils.ToID(dataSend.tenfile_saoluu + "-" + dataSend.thoigian_saoluu);
            var _DbItem = _context.sao_luu_tep_tin.Find(dataSend.ma);
            if (_DbItem == null)
            {
                dataSend.ma = maCreate;
                _context.sao_luu_tep_tin.Add(dataSend);
            }
            else
            {
                _DbItem.Assign(dataSend);
                _context.sao_luu_tep_tin.Update(_DbItem);
            }
            _context.SaveChanges();

            return Ok(dataSend);
        }

        [HttpGet("sao_luu_tep_tin/{id}")]
        public async Task<IActionResult> Get_saoluu_teptin_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var _DbItem = _context.sao_luu_tep_tin.Find(id);
            if (_DbItem == null)
                return StatusCode(400, "id_notFound");
            if (_DbItem != null && _DbItem.thu_muc != null)
            {
                thumuc ListThuMuc = await new ManagementController(_configuration, _httcontext, _context).GetObject(_DbItem.thu_muc);
                _DbItem.thumuc = ListThuMuc;
            }
            if (_DbItem != null && _DbItem.ten_file != null)
            {
                List<teptin> listteptin = new List<teptin>();
                foreach (var item in _DbItem.ten_file)
                {
                    teptin ListTepTin = await new ManagementController(_configuration, _httcontext, _context).GetFile(_DbItem.thu_muc + "/" + item);
                    listteptin.Add(ListTepTin);                    
                }
                _DbItem.ds_tenfile = listteptin;
            }
            return Ok(_DbItem);
        }

        [HttpPost("sao_luu_tep_tin/delete/{id}")]
        public IActionResult Delete_saoluu_teptin_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.sao_luu_tep_tin.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            _context.sao_luu_tep_tin.Remove(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("sao_luu_tep_tins")]
        public IActionResult List_saoluu_teptins(CommonRequest req)
        {

            var qr = _context.sao_luu_tep_tin.AsQueryable();

            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.tenfile_saoluu.ToUpper().Contains(tuKhoaUpper) || t.ten_file.ToString().ToUpper().Contains(tuKhoaUpper)
                   || t.thu_muc.ToUpper().Contains(tuKhoaUpper));
            }
            if (req?.filter_time_from > 0)
            {
                qr = qr.Where(t => t.thoigian_saoluu >= req.filter_time_from);
            }
            if (req?.filter_time_to > 0)
            {
                qr = qr.Where(t => t.thoigian_saoluu <= req.filter_time_to);
            }

            var recordCount = 0;
            if (string.IsNullOrEmpty(req.anchor))
            {
                recordCount = qr.Count();
            }
            qr = qr.OrderByDescending(k => k.thoigian_saoluu).ThenBy(k => k.ma);
            if (req.anchor != null && req.anchor.Trim() != "")
            {
                string[] parts = req.anchor.Split('#');
                if (parts.Length >= 2)
                {
                    if (long.TryParse(parts[0], out long anchorCreated))
                    {
                        string anchorMaDinhDanh = parts[1];
                        qr = qr.Where(k => k.thoigian_saoluu < anchorCreated || (k.thoigian_saoluu == anchorCreated && k.ma.CompareTo(anchorMaDinhDanh) > 0));
                    }
                }
            }

            if (req.limit < 1)
            {
                req.limit = 10000;
            }
            qr = qr.Take(req.limit + 1);

            var listRecords = qr.ToList();

            var res = new sao_luu_tep_tins
            {
                limit = req.limit
            };
            if (listRecords.Count > req.limit)
            {
                var anchorResMaDinhDanh = listRecords[req.limit - 1].ma;
                var anchorCreatedNumber = listRecords[req.limit - 1].thoigian_saoluu;
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

        [HttpPost("thumucs")]
        public async Task<IActionResult> List_thumucs(thumuc_and_teptin_Request req)
        {
            List<thumuc> List = await new ManagementController(_configuration, _httcontext, _context).GetListObjectInBucket();

            IQueryable<thumuc> qr = List.AsQueryable();

            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.ten.ToUpper().Contains(tuKhoaUpper));
            }
            if (req?.filter_time_from > 0)
            {
                qr = qr.Where(t => t.thoigian_saoluu >= req.filter_time_from);
            }
            if (req?.filter_time_to > 0)
            {
                qr = qr.Where(t => t.thoigian_saoluu <= req.filter_time_to);
            }

            var recordCount = 0;
            if (string.IsNullOrEmpty(req.anchor))
            {
                recordCount = qr.Count();
            }
            qr = qr.OrderByDescending(k => k.thoigian_saoluu).ThenBy(k => k.ma);
            if (req.anchor != null && req.anchor.Trim() != "")
            {
                string[] parts = req.anchor.Split('#');
                if (parts.Length >= 2)
                {
                    if (long.TryParse(parts[0], out long anchorCreated))
                    {
                        string anchorMaDinhDanh = parts[1];
                        qr = qr.Where(k => k.thoigian_saoluu < anchorCreated || (k.thoigian_saoluu == anchorCreated && k.ma.CompareTo(anchorMaDinhDanh) > 0));
                    }
                }
            }

            if (req.limit < 1)
            {
                req.limit = 10000;
            }
            qr = qr.Take(req.limit + 1);

            var listRecords = qr.ToList();

            var res = new thumucs
            {
                limit = req.limit
            };
            if (listRecords.Count > req.limit)
            {
                var anchorResMaDinhDanh = listRecords[req.limit - 1].ma;
                var anchorCreatedNumber = listRecords[req.limit - 1].thoigian_saoluu;
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

        [HttpPost("teptins")]
        public async Task<IActionResult> List_teptins(thumuc_and_teptin_Request req)
        {
            var res = new teptins
            {
                limit = req.limit
            };

            if (string.IsNullOrEmpty(req.thumuc))
            {
                return Ok(res);
            }
            List<teptin> List = await new ManagementController(_configuration, _httcontext, _context).GetListFileInObject(req.thumuc);

            IQueryable<teptin> qr = List.AsQueryable();

            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.ten.ToUpper().Contains(tuKhoaUpper));
            }
            if (req?.filter_time_from > 0)
            {
                qr = qr.Where(t => t.thoigian_saoluu >= req.filter_time_from);
            }
            if (req?.filter_time_to > 0)
            {
                qr = qr.Where(t => t.thoigian_saoluu <= req.filter_time_to);
            }

            var recordCount = 0;
            if (string.IsNullOrEmpty(req.anchor))
            {
                recordCount = qr.Count();
            }
            qr = qr.OrderByDescending(k => k.thoigian_saoluu).ThenBy(k => k.ma);
            if (req.anchor != null && req.anchor.Trim() != "")
            {
                string[] parts = req.anchor.Split('#');
                if (parts.Length >= 2)
                {
                    if (long.TryParse(parts[0], out long anchorCreated))
                    {
                        string anchorMaDinhDanh = parts[1];
                        qr = qr.Where(k => k.thoigian_saoluu < anchorCreated || (k.thoigian_saoluu == anchorCreated && k.ma.CompareTo(anchorMaDinhDanh) > 0));
                    }
                }
            }

            if (req.limit < 1)
            {
                req.limit = 10000;
            }
            qr = qr.Take(req.limit + 1);

            var listRecords = qr.ToList();

            if (listRecords.Count > req.limit)
            {
                var anchorResMaDinhDanh = listRecords[req.limit - 1].ma;
                var anchorCreatedNumber = listRecords[req.limit - 1].thoigian_saoluu;
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
