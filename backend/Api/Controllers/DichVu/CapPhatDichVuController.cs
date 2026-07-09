using HTT.Api.Models;
using HTT.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using QTHT.Api.Models.database.DichVu;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QTHT.Api.Controllers.DichVu
{
    [Route("api/[controller]")]
    [ApiController]
    public class CapPhatDichVuController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IConfiguration _configuration;
        private readonly HTT_Context _htt_context;


        public IConfiguration _config { get; }

        public CapPhatDichVuController(IConfiguration Configuration, IWebHostEnvironment webHostEnvironment, QTHT_HTT_Context context, HTT_Context htt_context)
        {
            _webHostEnvironment = webHostEnvironment;
            _config = Configuration;
            _context = context;
            _htt_context = htt_context;
        }

        #region
        [HttpPost("them")]
        [Authorize]
        public async Task<IActionResult> InsertCapPhatDichVu(CapPhatDichVu_Insert model)
        {
            try
            {

                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
                var don_vi = _context.thong_tin_nguoi_dung
                     .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                     .Select(x => x.ma_tochuc)
                     .FirstOrDefault();
                var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
                var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                if (don_vi == null)
                {
                    return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
                }
                var capPhatDichVu = new CapPhatDichVu
                {
                    Id_DangKy = model.Id_DangKy,
                    DonVi = model.DonVi,
                    NgayBatDau = model.NgayBatDau,
                    NgayKetThuc = model.NgayKetThuc,
                    TaiKhoan = model.TaiKhoan,
                    MayChu = model.MayChu,
                    HoatDong = model.HoatDong,
                    CreatedDate = DateTime.Now,
                    CreatedBy = user,
                    IsDeleted = false
                };

                if (user == 0)
                {
                    return BadRequest("không tìm thấy người dùng");
                }

                _htt_context.CapPhatDichVu.Add(capPhatDichVu);
                await _htt_context.SaveChangesAsync();
                return Ok(new { Status = 200, Message = "Thêm cấp phát dịch vụ thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpPut("chinhsua")]
        [Authorize]
        public async Task<IActionResult> UpdateCapPhatDichVu(CapPhatDichVu_Update model)
        {
            try
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
                var don_vi = _context.thong_tin_nguoi_dung
                     .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                     .Select(x => x.ma_tochuc)
                     .FirstOrDefault();
                if (don_vi == null)
                {
                    return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
                }
                var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
                var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                if (user == 0)
                {
                    return BadRequest("Không tìm thấy thông tin người dùng");
                }
                var capphatdichvu = _htt_context.CapPhatDichVu
                    .Where(x => x.Id == model.Id)
                    .FirstOrDefault();

                if (capphatdichvu == null)
                {
                    return NotFound("Không tìm thấy thông tin cấp phát dịch vụ");
                }

                // Update the existing record
                capphatdichvu.Id_DangKy = model.Id_DangKy;
                capphatdichvu.DonVi = model.DonVi;
                capphatdichvu.NgayBatDau = model.NgayBatDau;
                capphatdichvu.NgayKetThuc = model.NgayKetThuc;
                capphatdichvu.TaiKhoan = model.TaiKhoan;
                capphatdichvu.MayChu = model.MayChu;
                capphatdichvu.HoatDong = model.HoatDong;
                capphatdichvu.ModifiedDate = DateTime.Now;
                capphatdichvu.ModifiedBy = user;
                capphatdichvu.IsDeleted = false;

                _htt_context.CapPhatDichVu.Update(capphatdichvu);

                await _htt_context.SaveChangesAsync();

                return Ok(new { Status = 200, Message = "Cập nhật cấp phát dịch vụ thành công." });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("xoa")]
        [Authorize]
        public async Task<IActionResult> XoaCapPhatDichVu(Guid id)
        {
            try
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
                var don_vi = _context.thong_tin_nguoi_dung
                     .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                     .Select(x => x.ma_tochuc)
                     .FirstOrDefault();
                var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
                var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                if (don_vi == null)
                {
                    return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
                }
                var capphatdichvu = _htt_context.CapPhatDichVu
                    .Where(x => x.Id == id)
                    .FirstOrDefault();

                if (capphatdichvu == null)
                {
                    return StatusCode(299, new { Message = "Không tìm thấy dịch vụ" });
                }

                capphatdichvu.DeletedDate = DateTime.Now;
                capphatdichvu.DeletedBy = user;
                capphatdichvu.IsDeleted = true;

                _htt_context.CapPhatDichVu.Update(capphatdichvu);

                await _htt_context.SaveChangesAsync();

                return Ok(new { Status = 200, Message = "Xóa cấp phát dịch vụ thành công." });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpDelete("xoahoantoan")]
        [Authorize]
        public async Task<IActionResult> XoaHoantoanCapPhatDichVu(Guid id)
        {
            try
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
                var don_vi = _context.thong_tin_nguoi_dung
                     .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                     .Select(x => x.ma_tochuc)
                     .FirstOrDefault();
                var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
                var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                if (don_vi == null)
                {
                    return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
                }
                var capphatdichvu = _htt_context.CapPhatDichVu
                    .Where(x => x.Id == id)
                    .FirstOrDefault();

                _htt_context.CapPhatDichVu.Remove(capphatdichvu);
                return Ok(new { Status = 200, Message = "Xóa hoàn toàn cấp phát dịch vụ thành công" });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("xemchitiet")]
        [Authorize]
        public async Task<IActionResult> GetCapPhatDichVu(Guid id)
        {
            try
            {
                var capphatdichvu = _htt_context.CapPhatDichVu
                    .Where(x => x.Id == id)
                    .FirstOrDefault();
                if (capphatdichvu == null)
                {
                    return StatusCode(299, new { message = "Không tìm thấy cấp phát dịch vụ" });
                }
                return Ok(new { data = capphatdichvu });

            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("danhsach")]
        [Authorize]
        public async Task<IActionResult> ListDanhSachCapPhatDichVu(string canhan, string tochuc, int pageSize, int pageNumber, long dateFrom, long dateTo, int hoatdong)
        {
            try
            {
                var result = new object();
                var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
                var don_vi = _context.thong_tin_nguoi_dung
                     .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                     .Select(x => x.ma_tochuc)
                     .FirstOrDefault();
                if (don_vi == null)
                {
                    return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
                }
                var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
                var don_vi_ten = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.ten).FirstOrDefault();

                phan_quyen_vai_tro_nguoi_dung phan_quyen = _context.phan_quyen_vai_tro_nguoi_dung.Where(X => X.ten_dangnhap_nguoidung == user_current).FirstOrDefault();

                if (phan_quyen == null)
                {
                    return StatusCode(299, new { Message = "Bạn không có quyền thực hiện chức năng này" });
                }

                List<string> vaitros = JsonConvert.DeserializeObject<List<string>>(phan_quyen.ma_ds_vaitros);

                List<string> ds_chuc_nang = new List<string>();

                foreach (var c in vaitros)
                {
                    var quyen = _context.vai_tro_nguoi_dung
                        .Where(x => x.ma == c)
                        .FirstOrDefault();
                    List<string> chuc_nangs = JsonConvert.DeserializeObject<List<string>>(quyen.ma_ds_thong_tin_chuc_nangs);
                    foreach (var b in chuc_nangs)
                    {
                        var mota_chucnang = _context.thong_tin_chuc_nang.Where(x => x.ma == b).Select(x => x.mota).FirstOrDefault();
                        ds_chuc_nang.Add(mota_chucnang);
                    }
                }
                if (!ds_chuc_nang.Any(item => item == "Schedule"))
                {
                    return StatusCode(299, new { Message = "Bạn không có quyền thực hiện chức năng này" });
                }
                else
                {
                    var list = _htt_context.CapPhatDichVu
                        .Where(x => x.IsDeleted == false).ToList();

                    if (hoatdong != 0)
                    {
                        list = list.Where(x => x.HoatDong == hoatdong).ToList();
                    }

                    foreach (var c in list)
                    {
                        c.TenDichVu = _htt_context.DangKyCapPhatDichVu.Find(c.Id_DangKy)?.TenDichVu;
                        c.NguoiDangKy = _htt_context.DangKyCapPhatDichVu.Find(c.Id_DangKy)?.NguoiDangKy;
                        c.CreatedDateLong = DateTimeHelper.GetTimeStamp(c.CreatedDate.Value);
                        c.CreatedByName = _context.thong_tin_nguoi_dung.Where(x => x.id == c.CreatedBy).Select(x => x.ten_dangnhap).FirstOrDefault().ToString();
                    }

                    IQueryable<CapPhatDichVu> cbQueryable = list.AsQueryable();

                    if (!string.IsNullOrEmpty(tochuc))
                    {
                        cbQueryable = cbQueryable.Where(x => x.DonVi.ToLower().Contains(tochuc.Trim().ToLower()));
                    }

                    if (!string.IsNullOrEmpty(canhan))
                    {
                        cbQueryable = cbQueryable.Where(x => x.NguoiDangKy.ToLower().Contains(canhan.Trim().ToLower()));
                    }

                    if (dateFrom > 0 && dateTo > 0)
                    {
                        cbQueryable = cbQueryable.Where(x =>
                            x.CreatedDateLong >= dateFrom
                            && x.CreatedDateLong <= dateTo
                        );
                    }

                    cbQueryable = cbQueryable.AsQueryable();
                    var totalRecords = cbQueryable.Count();
                    var records = cbQueryable.OrderByDescending(x => x.CreatedDateLong)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
                    result = new
                    {
                        TotalRecords = totalRecords,
                        PageSize = pageSize,
                        PageNumber = pageNumber,
                        Data = records
                    };
                }
                return Ok(new { data = result });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        #endregion
    }
}
