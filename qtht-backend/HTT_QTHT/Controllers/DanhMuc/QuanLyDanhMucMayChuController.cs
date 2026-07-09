using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;
using HTT_QTHT.Api.Services;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht/[controller]")]
    [ApiController]
    [Authorize]
    public class may_chuController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        public may_chuController(IConfiguration configuration, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("upsert")]
        public IActionResult Upsert(Meeting_Server model)
        {
            var user_current = User.FindFirst(Constant.Nameidentifier).Value;
            var user = GetIdUser(user_current);

            if (string.IsNullOrEmpty(model.IP) || string.IsNullOrEmpty(model.Iss) || string.IsNullOrEmpty(model.Aud))
            {
                return StatusCode(400, "ip_and_iss_and_aud_required");
            }

            if (model.Default == true)
            {
                List<Meeting_Server> meeting_Servers = new List<Meeting_Server>();
                meeting_Servers = _httcontext.Meeting_Server.ToList();
                meeting_Servers.ForEach(x => x.Default = false);
                _httcontext.Meeting_Server.UpdateRange(meeting_Servers);
                _httcontext.SaveChanges();
            }

            if (model.Id != default)
            {
                var check_exist = _httcontext.Meeting_Server.FirstOrDefault(x => x.IP == model.IP && x.Id != model.Id);
                if (check_exist != null) return StatusCode(299, "IP/domain đã tồn tại");
                check_exist = _httcontext.Meeting_Server.FirstOrDefault(x => x.Title == model.Title && x.Id != model.Id);
                if (check_exist != null) return StatusCode(299, "Tiêu đề đã tồn tại");
            }

            var item = _httcontext.Meeting_Server.FirstOrDefault(x => x.IP == model.IP);

            if (item == null)
            {
                model.Id = default;
                model.Activated = model.Activated == null ? false : model.Activated;
                model.Default = model.Default == null ? false : model.Default;
                if (model.Activated == false)
                {
                    model.Default = false;
                }
                model.CreatedDate = DateTime.Now;
                model.CreatedBy = (int)user;
                model.IsDeleted = false;
                model.Aud = EncryptionHelper.Encrypt(model.Iss, model.Aud);
                _httcontext.Meeting_Server.Add(model).Property(e => e.Id).IsModified = false;
            }
            else
            {
                model.Activated = model.Activated == null ? false : model.Activated;
                model.Default = model.Default == null ? false : model.Default;
                if (model.Activated == false)
                {
                    model.Default = false;
                }
                item.ModifiedDate = DateTime.Now;
                item.ModifiedBy = (int)user;
                item.IsDeleted = false;
                item.Iss = model.Iss;
                string aud_secret = EncryptionHelper.Decrypt(item.Iss, item.Aud);
                if (model.Iss != item.Iss && model.Aud == item.Aud)
                {
                    model.Aud = EncryptionHelper.Encrypt(model.Iss, aud_secret);
                }
                if (model.Iss != item.Iss && model.Aud != EncryptionHelper.Decrypt(item.Iss, item.Aud))
                {
                    model.Aud = EncryptionHelper.Encrypt(model.Iss, aud_secret);
                }
                if (model.Iss == item.Iss && model.Aud != EncryptionHelper.Decrypt(item.Iss, item.Aud))
                {
                    model.Aud = EncryptionHelper.Encrypt(item.Iss, model.Aud);
                }

                item.Assign(model);
                _httcontext.Meeting_Server.Update(item).Property(e => e.Id).IsModified = false;
            }
            _httcontext.SaveChanges();
            return Ok(new { data = model, message = "Thành công" });
        }

        [HttpGet("{id}")]
        public IActionResult Get_ById(int id)
        {
            if (id == default)
                return StatusCode(400, "id_required");
            var _DbItem = _httcontext.Meeting_Server.Find(id);
            if (_DbItem == null)
                return StatusCode(400, "id_notFound");
            return Ok(_DbItem);
        }

        [HttpPost("delete/{id}")]
        public IActionResult Delete_ById(int id)
        {
            if (id == default)
                return StatusCode(400, "id_required");
            var db_item = _httcontext.Meeting_Server.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            _httcontext.Meeting_Server.Remove(db_item);
            _httcontext.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("remove/{id}")]
        public IActionResult Remove_to_chuc_ById(int id)
        {
            var user_current = User.FindFirst(Constant.Nameidentifier).Value;
            var user = GetIdUser(user_current);

            if (id == default)
                return StatusCode(400, "id_required");
            var db_item = _httcontext.Meeting_Server.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            db_item.DeletedDate = DateTime.Now;
            db_item.DeletedBy = (int)user;
            db_item.IsDeleted = true;
            _httcontext.Meeting_Server.Update(db_item).Property(e => e.Id).IsModified = false;
            _httcontext.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("restore/{id}")]
        public IActionResult Restore_to_chuc_ById(int id)
        {
            var user_current = User.FindFirst(Constant.Nameidentifier).Value;
            var user = GetIdUser(user_current);

            if (id == default)
                return StatusCode(400, "id_required");
            var db_item = _httcontext.Meeting_Server.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            db_item.DeletedDate = DateTime.Now;
            db_item.DeletedBy = (int)user;
            db_item.IsDeleted = false;
            _httcontext.Meeting_Server.Update(db_item).Property(e => e.Id).IsModified = false;
            _httcontext.SaveChanges();
            return Ok("Khôi phục thành công");
        }

        [HttpPost("list")]
        public IActionResult List(to_chuc_and_chuc_vu_Request req)
        {

            var qr = _httcontext.Meeting_Server.AsQueryable();

            if (!string.IsNullOrEmpty(req.trangthai_xoa))
            {
                if (req.trangthai_xoa == "Đã xóa")
                {
                    qr = qr.Where(x => x.IsDeleted == true);
                }
                else if (req.trangthai_xoa == "Chưa xóa")
                {
                    qr = qr.Where(x => x.IsDeleted == false);
                }
            }
            else
            {
                qr = qr.Where(x => x.IsDeleted == false);
            }

            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t =>
                    t.Title.ToUpper().Contains(tuKhoaUpper)
                    || t.IP.ToUpper().Contains(tuKhoaUpper)
                    || t.Iss.ToUpper().Contains(tuKhoaUpper)
                    || t.Aud.ToUpper().Contains(tuKhoaUpper));
            }

            if (!string.IsNullOrEmpty(req.trangthai_hoatdong))
            {
                if (req.trangthai_hoatdong == "Đang hoạt động")
                {
                    qr = qr.Where(x => x.Activated == true);
                }
                else if (req.trangthai_hoatdong == "Ngừng hoạt động")
                {
                    qr = qr.Where(x => x.Activated == false);
                }
            }

            //foreach (var item in qr.ToList())
            //{
            //    item.CreatedDateLong = Utils.DateTimeToUnixTimeStamp(item.CreatedDate.Value);
            //}

            var recordCount = 0;
            if (string.IsNullOrEmpty(req.anchor))
            {
                recordCount = qr.Count();
            }
            qr = qr.OrderByDescending(k => k.CreatedDate).ThenBy(k => k.Id);
            if (req.anchor != null && req.anchor.Trim() != "")
            {
                string[] parts = req.anchor.Split('#');
                if (parts.Length >= 2)
                {
                    if (DateTime.TryParse(parts[0], out DateTime anchorCreated))
                    {
                        //string anchorMaDinhDanh = parts[1];
                        //qr = qr.Where(k => k.CreatedDate < anchorCreated || (k.CreatedDate == anchorCreated && k.Id.ToString().CompareTo(anchorMaDinhDanh) > 0));
                        string anchorMaDinhDanh = parts[1];
                        qr = qr.Where(k => k.CreatedDate < anchorCreated || (k.CreatedDate == anchorCreated && k.Id == Convert.ToInt32(anchorMaDinhDanh)));
                    }
                }
            }

            if (req.limit < 1)
            {
                req.limit = 10000;
            }
            qr = qr.Take(req.limit + 1);

            var listRecords = qr.ToList();

            var res = new Meeting_Servers
            {
                limit = req.limit
            };
            if (listRecords.Count > req.limit)
            {
                var anchorResMaDinhDanh = listRecords[req.limit - 1].Id;
                //var anchorCreatedNumber = Utils.DateTimeToUnixTimeStamp(listRecords[req.limit - 1].CreatedDate.Value);
                var anchorCreatedNumber = (listRecords[req.limit - 1].CreatedDate.Value);
                var anchorResCreated = "";
                // Chuyển đổi số thành chuỗi nếu số lớn hơn 0, ngược lại giữ nguyên chuỗi rỗng
                //anchorResCreated = anchorCreatedNumber > 0 ? anchorCreatedNumber.ToString() : "";
                anchorResCreated = anchorCreatedNumber.ToString();

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
        [NonAction]
        private int? GetIdUser(string user_current)
        {
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            return user;
        }
    }
}
