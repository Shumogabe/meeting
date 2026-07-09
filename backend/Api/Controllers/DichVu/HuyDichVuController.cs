using HTT.Api.Models;
using HTT.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
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
    public class HuyDichVuController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IConfiguration _configuration;
        private readonly HTT_Context _htt_context;


        public IConfiguration _config { get; }

        public HuyDichVuController(IConfiguration Configuration, IWebHostEnvironment webHostEnvironment, QTHT_HTT_Context context, HTT_Context htt_context)
        {
            _webHostEnvironment = webHostEnvironment;
            _config = Configuration;
            _context = context;
            _htt_context = htt_context;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        #region
        [HttpPost("them")]
        [Authorize]
        public async Task<IActionResult> InsertHuyDichVu(HuyDichVu_Insert model)
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
                var HuyDichVu = new HuyDichVu
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


                _htt_context.HuyDichVu.Add(HuyDichVu);
                await _htt_context.SaveChangesAsync();
                return Ok(new { Status = 200, Message = "Thêm hủy dịch vụ thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
        /// <summary>
        /// Updates an existing HuyDichVu record.
        /// </summary>
        /// <param name="model">The model containing updated data.</param>
        /// <returns>Action result indicating success or failure.</returns>
        [HttpPut("chinhsua")]
        [Authorize]
        public async Task<IActionResult> UpdateHuyDichVu(HuyDichVu_Update model)
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
                var HuyDichVu = _htt_context.HuyDichVu
                    .Where(x => x.Id == model.Id)
                    .FirstOrDefault();

                if (HuyDichVu == null)
                {
                    return NotFound("Record not found.");
                }



                if (user == 0)
                {
                    return BadRequest("User ID not found.");
                }

                // Update the existing record
                HuyDichVu.Id_DangKy = model.Id_DangKy;
                HuyDichVu.DonVi = model.DonVi;
                HuyDichVu.NgayBatDau = model.NgayBatDau;
                HuyDichVu.NgayKetThuc = model.NgayKetThuc;
                HuyDichVu.TaiKhoan = model.TaiKhoan;
                HuyDichVu.MayChu = model.MayChu;
                HuyDichVu.HoatDong = model.HoatDong;
                HuyDichVu.ModifiedDate = DateTime.Now;
                HuyDichVu.ModifiedBy = user;
                HuyDichVu.IsDeleted = false;

                _htt_context.HuyDichVu.Update(HuyDichVu);

                await _htt_context.SaveChangesAsync();

                return Ok(new { Status = 200, Message = "Cập nhật hủy dịch vụ thành công." });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("xoa")]
        [Authorize]
        public async Task<IActionResult> XoaHuyDichVu(Guid id)
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
                var HuyDichVu = _htt_context.HuyDichVu
                    .Where(x => x.Id == id)
                    .FirstOrDefault();

                HuyDichVu.DeletedDate = DateTime.Now;
                HuyDichVu.DeletedBy = user;
                HuyDichVu.IsDeleted = true;

                _htt_context.HuyDichVu.Update(HuyDichVu);

                await _htt_context.SaveChangesAsync();

                return Ok(new { Status = 200, Message = "Xóa hủy dịch vụ thành công." });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = ex.Message });
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("xoahoantoan")]
        [Authorize]
        public async Task<IActionResult> XoaHoantoanHuyDichVu(Guid id)
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
                var HuyDichVu = _htt_context.HuyDichVu
                    .Where(x => x.Id == id)
                    .FirstOrDefault();

                _htt_context.HuyDichVu.Remove(HuyDichVu);
                return Ok(new { Status = 200, Message = "Xóa hoàn toàn hủy dịch vụ thành công" });
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = ex.Message });
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("xemchitiet")]
        [Authorize]
        public async Task<IActionResult> GetHuyDichVu(Guid id)
        {
            try
            {
                var HuyDichVu = _htt_context.HuyDichVu
                    .Where(x => x.Id == id)
                    .FirstOrDefault();
                if (HuyDichVu == null)
                {
                    return StatusCode(299, new { message = "Không tìm thấy hủy dịch vụ" });
                }
                return Ok(new { data = HuyDichVu });

            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("danhsach")]
        [Authorize]
        public async Task<IActionResult> ListDanhSachHuyDichVu(string canhan, string tochuc, int pageSize, int pageNumber, string? txtSearch, long dateFrom, long dateTo, int hoatdong)
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
                    var list = _htt_context.HuyDichVu
                        .Where(x => x.IsDeleted == false).ToList();

                    if (hoatdong != 0)
                    {
                        list = list.Where(x => x.HoatDong == hoatdong).ToList();
                    }

                    foreach (var c in list)
                    {
                        c.TenDichVu = _htt_context.DangKyHuyDichVu.Find(c.Id_DangKy)?.TenDichVu;
                        c.NguoiDangKy = _htt_context.DangKyHuyDichVu.Find(c.Id_DangKy)?.NguoiDangKy;
                        c.CreatedDateLong = DateTimeHelper.GetTimeStamp(c.CreatedDate.Value);
                        c.CreatedByName = _context.thong_tin_nguoi_dung.Where(x => x.id == c.CreatedBy).Select(x => x.ten_dangnhap).FirstOrDefault().ToString();
                    }

                    IQueryable<HuyDichVu> cbQueryable = list.AsQueryable();

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
