using HTT.Api.Models;
using HTT.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace HTT.Api.Controllers
{
    [Route("api/QuanLyBaoCaoTongHop")]
    [ApiController]
    public class QuanLyBaoCaoTongHopController : ControllerBase
    {
        private readonly QTHT_HTT_Context _QTHT_HTT_Context;
        private readonly HTT_Context _context;
        private readonly IConfiguration _configuration;
        public QuanLyBaoCaoTongHopController(QTHT_HTT_Context QTHT_HTT_Context, HTT_Context context, IConfiguration configuration)
        {
            _QTHT_HTT_Context = QTHT_HTT_Context;
            _context = context;
            _configuration = configuration;
        }
        [HttpPost]
        [Authorize]
        [Route("them")]
        public async Task<IActionResult> Insert(thongke_tonghop model)
        {
            try
            {
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).FirstOrDefault();
                var userid = user.id;
                var donviid = Convert.ToInt32(user.ma_tochuc);
                var check = _context.thongke_tonghop.Where(x => x.Title == model.Title).FirstOrDefault();
                if (check != null) return StatusCode(299, new { message = "Thống kê định kì đã tôn tại" });
                model.CreatedDate = DateTime.Now;
                model.CreatedBy = userid;
                model.Id = Guid.NewGuid();
                model.FileUrl = "QuanLyBaoCaoTongHop/" + model.Id.ToString() + "/" + model.FileUrl;
                model.don_vi = donviid;
                _context.thongke_tonghop.Add(model);
                await _context.SaveChangesAsync();
                return Ok(new { FileUrl = "QuanLyBaoCaoTongHop/" + model.Id.ToString(), message = "Thêm thống kê định kì thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpPut]
        [Authorize]
        [Route("sua")]
        public async Task<IActionResult> Update(thongke_tonghop model)
        {
            try
            {
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                var check = _context.thongke_tonghop.Find(model.Id);
                model.CreatedBy = check.CreatedBy;
                model.CreatedDate = check.CreatedDate;
                model.ModifiedDate = DateTime.Now;
                model.ModifiedBy = user;
                model.FileUrl = model.FileUrl.Contains("QuanLyBaoCaoTongHop/" + model.Id.ToString() + "/")
                    ? model.FileUrl
                    : "QuanLyBaoCaoTongHop/" + model.Id.ToString() + "/" + model.FileUrl;
                _context.thongke_tonghop.Update(model);
                await _context.SaveChangesAsync();
                return Ok(new { FileUrl = "QuanLyBaoCaoTongHop/" + model.Id.ToString(), message = "Chỉnh sửa thống kê định kì thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpDelete]
        [Authorize]
        [Route("xoa")]
        public async Task<IActionResult> Remove(Guid id)
        {
            try
            {
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                var model = _context.thongke_tonghop.Find(id);
                model.DeletedDate = DateTime.Now;
                model.DeletedBy = user;
                model.IsDeleted = true;
                _context.thongke_tonghop.Remove(model);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa báo cáo thống kê tổng hợp thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("xemchitiet")]
        public async Task<IActionResult> Detail(Guid id)
        {
            var item = _context.thongke_tonghop.Find(id);
            return Ok(item);
        }


        [HttpPut]
        [Authorize]
        [Route("Duyet")]
        public async Task<IActionResult> Approve(thongke_tonghop model)
        {
            try
            {
                var thongke_tonghop = _context.thongke_tonghop.Where(x => x.Id == model.Id).FirstOrDefault();
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                thongke_tonghop.Status = 1; //xác nhận thống kê điểm cầu 
                thongke_tonghop.ModifiedDate = DateTime.Now;
                thongke_tonghop.ModifiedBy = user;
                _context.thongke_tonghop.Update(thongke_tonghop);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Chỉnh sửa báo cáo thống kê tổng hợp thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpGet]
        [Route("danhsachchoduyet")]
        public async Task<IActionResult> ListDraft(int pageNumber, int pageSize)
        {
            var totalRecords = await _context.thongke_tonghop.CountAsync(x => x.IsDeleted == false && x.Status == 0);
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);
            var items = await _context.thongke_hoinghihoithao
                              .Where(x => x.IsDeleted == false)
                              .Skip((pageNumber - 1) * pageSize)
                              .Take(pageSize)
                              .ToListAsync();

            var result = new
            {
                TotalRecords = totalRecords,
                TotalPages = totalPages,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Items = items
            };

            return Ok(result);
        }

        [HttpGet]
        [Route("danhsachdaduyet")]
        public async Task<IActionResult> ListApprove(int pageNumber, int pageSize)
        {
            var totalRecords = await _context.thongke_tonghop.CountAsync(x => x.IsDeleted == false && x.Status == 1);
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);
            var items = await _context.thongke_hoinghihoithao
                              .Where(x => x.IsDeleted == false)
                              .Skip((pageNumber - 1) * pageSize)
                              .Take(pageSize)
                              .ToListAsync();

            var result = new
            {
                TotalRecords = totalRecords,
                TotalPages = totalPages,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Items = items
            };

            return Ok(result);
        }

        [HttpGet]
        [Route("danhsachdaxoa")]
        public async Task<IActionResult> ListDeleted(int pageNumber, int pageSize)
        {
            var totalRecords = await _context.thongke_tonghop.CountAsync(x => x.IsDeleted == true);
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);
            var items = await _context.thongke_hoinghihoithao
                              .Where(x => x.IsDeleted == false)
                              .Skip((pageNumber - 1) * pageSize)
                              .Take(pageSize)
                              .ToListAsync();

            var result = new
            {
                TotalRecords = totalRecords,
                TotalPages = totalPages,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Items = items
            };

            return Ok(result);
        }

        [HttpPut]
        [Route("khoiphuc")]
        public async Task<IActionResult> Restore(Guid id)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var thongke_tonghop = _context.thongke_tonghop.Where(x => x.Id == id).FirstOrDefault();
            if (thongke_tonghop.IsDeleted == false)
            {
                return StatusCode(299, new { message = "Không thể khôi phục" });
            }
            thongke_tonghop.IsDeleted = false;
            thongke_tonghop.ModifiedDate = DateTime.Now;
            thongke_tonghop.ModifiedBy = user;
            _context.thongke_tonghop.Update(thongke_tonghop);
            _context.SaveChanges();
            return Ok(new { message = "Khôi phục thành công" });
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("Timkiem")]
        public async Task<IActionResult> Search(string txtSearch, int pageNumber, int pageSize)
        {
            try
            {
                var query = _context.thongke_tonghop.Where
                    (x => x.IsDeleted == false);

                if (!string.IsNullOrEmpty(txtSearch))
                {
                    query = query.Where
                    (x => x.Title.Contains(txtSearch) ||
                    x.Content.Contains(txtSearch));
                }

                var totalRecords = await query.CountAsync();
                var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);

                // Apply paging
                var items = await query.Skip((pageNumber - 1) * pageSize)
                                       .Take(pageSize)
                                       .ToListAsync();

                var result = new
                {
                    TotalRecords = totalRecords,
                    TotalPages = totalPages,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    Items = items
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
