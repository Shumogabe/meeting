using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht/[controller]")]
    [ApiController]
    [Authorize]
    public class tl_ch_dichvusmsController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly IConfiguration _configuration;
        public tl_ch_dichvusmsController(QTHT_HTT_Context context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        [HttpPost("them")]
        public IActionResult Insert()
        {
            try
            {
                //var user = User.FindFirst(Constant.Nameidentifier).Value;
                var user = User.FindFirst(Constant.Nameidentifier).Value;
                DateTime date = DateTime.Now;
                var cf = _configuration.GetSection("CauHinh:SMS");
                List<CauHinhItem> list = new List<CauHinhItem>();
                cf.Bind(list);
                foreach (var c in list)
                {
                    if (c.tencauhinh != null || c.tenhienthi != null || c.giatri != null)
                    {
                        tl_ch_dichvusms model = new tl_ch_dichvusms();
                        model.tencauhinh = c.tencauhinh;
                        model.tenhienthi = c.tenhienthi;
                        model.giatri = c.giatri;
                        model.CreatedBy = user;
                        model.CreatedDate = DateTime.Now;
                        model.IsDeleted = false;
                        var check_exist = _context.tl_ch_dichvusms.Where(c => c.tencauhinh == model.tencauhinh).FirstOrDefault();
                        if (check_exist == null)
                        {
                            _context.tl_ch_dichvusms.Add(model);
                            _context.SaveChanges();
                        }
                        else
                        {
                            check_exist.IsDeleted = false;
                            _context.tl_ch_dichvusms.Update(check_exist);
                            _context.SaveChanges();
                        }
                    }
                }
                return Ok("Thêm thông tin cấu hình dịch vụ sms thành công");
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpPut("sua")]
        public IActionResult Update(tl_ch_Update model)
        {
            try
            {
                //var user = User.FindFirst(Constant.Nameidentifier).Value;
                var user = User.FindFirst(Constant.Nameidentifier).Value;
                if (model.Id == default) return StatusCode(299, new { message = "Chưa chọn thông tin cấu hình dịch vụ sms" });
                var entity = _context.tl_ch_dichvusms.Where(x => x.Id == model.Id).FirstOrDefault();
                if (entity == null) return StatusCode(299, new { message = "Thông tin cấu hình dịch vụ sms không tồn tại" });
                DateTime date = DateTime.Now;
                entity.tenhienthi = model.tenhienthi;
                entity.tencauhinh = model.tencauhinh;
                entity.giatri = model.giatri;
                entity.ModifiedDate = DateTime.Now;
                entity.ModifiedBy = user;
                _context.tl_ch_dichvusms.Update(entity);
                _context.SaveChanges();
                return Ok("Chỉnh sửa thông tin cấu hình dịch vụ sms thành công");
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpDelete("xoa")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                if (id == default) return StatusCode(299, new { message = "Chưa chọn thông tin cấu hình dịch vụ sms" });
                //var user = User.FindFirst(Constant.Nameidentifier).Value;
                var user = User.FindFirst(Constant.Nameidentifier).Value;
                var entity = _context.tl_ch_dichvusms.Where(x => x.Id == id).FirstOrDefault();
                if (entity == null) return StatusCode(299, new { message = "Thông tin cấu hình dịch vụ sms không tồn tại" });
                entity.DeletedDate = DateTime.Now;
                entity.DeletedBy = user;
                entity.IsDeleted = true;
                _context.tl_ch_dichvusms.Update(entity);
                _context.SaveChanges();
                return Ok("Xóa cấu hình dịch vụ sms thành công");
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpGet("danhsach")]
        public async Task<IActionResult> GetAll(int pageNumber, int pageSize, DateTime dateTo, DateTime dateFrom, string? strSearch)
        {
            try
            {
                var query = _context.tl_ch_dichvusms.Where(x => x.IsDeleted == false);
                if (!string.IsNullOrEmpty(strSearch))
                {
                    query = query.Where(x =>
                    x.tencauhinh.ToLower().Contains(strSearch.Trim().ToLower()) ||
                    x.tenhienthi.ToLower().Contains(strSearch.Trim().ToLower()) ||
                    x.giatri.ToLower().Contains(strSearch.Trim().ToLower())
                    );
                }
                if (dateFrom != DateTime.MinValue && dateTo != DateTime.MinValue)
                {
                    query = query.Where(x => x.CreatedDate >= dateFrom && x.CreatedDate <= dateTo);
                }
                var totalRecords = query.Count();
                var list = query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                return Ok(new
                {
                    data = list,
                    totalRecords = totalRecords,
                    pageNumber = pageNumber,
                    pageSize = pageSize
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpGet("chitiet")]
        public async Task<IActionResult> Detail(Guid id)
        {
            try
            {
                if (id == default) return StatusCode(299, new { message = "Chưa chọn thông tin cấu hình dịch vụ sms" });
                //var user = User.FindFirst(Constant.Nameidentifier).Value;
                var user = User.FindFirst(Constant.Nameidentifier).Value;
                var entity = _context.tl_ch_dichvusms.Where(x => x.Id == id).FirstOrDefault();
                if (entity == null) return StatusCode(299, new { message = "Thông tin cấu hình dịch vụ sms không tồn tại" });
                return Ok(entity);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpGet("chitiet_tencauhinh")]
        public async Task<IActionResult> chitiet_tencauhinh(string tencauhinh)
        {
            try
            {
                if (string.IsNullOrEmpty(tencauhinh)) return StatusCode(299, new { message = "Chưa chọn thông tin cấu hình dịch vụ sms" });
                //var user = User.FindFirst(Constant.Nameidentifier).Value;
                var user = User.FindFirst(Constant.Nameidentifier).Value;
                var entity = _context.tl_ch_dichvusms.Where(x => x.tencauhinh == tencauhinh).OrderByDescending(k => k.CreatedDate).FirstOrDefault();
                if (entity == null) return StatusCode(299, new { message = "Thông tin cấu hình dịch vụ sms không tồn tại" });
                return Ok(entity);
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpGet("danhsachxoa")]
        public async Task<IActionResult> GetAllDeletd(int pageNumber, int pageSize, DateTime dateTo, DateTime dateFrom, string? strSearch)
        {
            try
            {
                var query = _context.tl_ch_dichvusms.Where(x => x.IsDeleted == true);
                if (!string.IsNullOrEmpty(strSearch))
                {
                    query = query.Where(x =>
                    x.tencauhinh.ToLower().Contains(strSearch.Trim().ToLower()) ||
                    x.tenhienthi.ToLower().Contains(strSearch.Trim().ToLower()) ||
                    x.giatri.ToLower().Contains(strSearch.Trim().ToLower())
                    );
                }
                if (dateFrom != DateTime.MinValue && dateTo != DateTime.MinValue)
                {
                    query = query.Where(x => x.CreatedDate >= dateFrom && x.CreatedDate <= dateTo);
                }
                var totalRecords = query.Count();
                var list = query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                return Ok(new
                {
                    data = list,
                    totalRecords = totalRecords,
                    pageNumber = pageNumber,
                    pageSize = pageSize
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpPut("khoiphuc")]
        public async Task<IActionResult> Restore(Guid id)
        {
            try
            {
                if (id == default) return StatusCode(299, new { message = "Chưa chọn thông tin cấu hình dịch vụ sms" });
                //var user = User.FindFirst(Constant.Nameidentifier).Value;
                var user = User.FindFirst(Constant.Nameidentifier).Value;
                var entity = _context.tl_ch_dichvusms.Where(x => x.Id == id).FirstOrDefault();
                if (entity == null) return StatusCode(299, new { message = "Thông tin cấu hình dịch vụ sms không tồn tại" });
                entity.DeletedDate = DateTime.Now;
                entity.DeletedBy = user;
                entity.IsDeleted = false;
                _context.tl_ch_dichvusms.Update(entity);
                _context.SaveChanges();
                return Ok("Khôi phục cấu hình dịch vụ sms thành công");
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
    }
}
