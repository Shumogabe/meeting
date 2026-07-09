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

namespace QTHT.Api.Controllers.ThongKe
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuanLyBaoCaoThongKeBieuQuyetController : ControllerBase
    {
        private readonly HTT_Context _context;
        private readonly QTHT_HTT_Context _QTHT_HTT_Context;
        private readonly IConfiguration _configuration;
        public QuanLyBaoCaoThongKeBieuQuyetController(HTT_Context context, QTHT_HTT_Context qTHT_HTT_Context, IConfiguration configuration)
        {
            _context = context;
            _QTHT_HTT_Context = qTHT_HTT_Context;
            _configuration = configuration;
        }

        [HttpPost]
        [Authorize]
        [Route("them")]
        public async Task<IActionResult> Insert(thongke_bieuquyet model)
        {
            try
            {
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                model.CreatedDate = DateTime.Now;
                model.CreatedBy = user;
                model.IsDeleted = false;
                model.Id = Guid.NewGuid();
                model.Status = 0;// trạng thái chờ duyệt
                _context.thongke_bieuquyet.Add(model);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Thêm báo cáo thống kê biểu quyết thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPut]
        [Authorize]
        [Route("sua")]
        public async Task<IActionResult> Update(thongke_bieuquyet model)
        {
            try
            {
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                var check = _context.thongke_bieuquyet.Find(model.Id);
                model.CreatedBy = check.CreatedBy;
                model.CreatedDate = check.CreatedDate;
                model.ModifiedDate = DateTime.Now;
                model.ModifiedBy = user;
                _context.thongke_bieuquyet.Update(model);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Chỉnh sửa báo cáo thống kê biểu quyết thành công" });
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
                var model = _context.thongke_bieuquyet.Find(id);
                model.DeletedDate = DateTime.Now;
                model.DeletedBy = user;
                model.IsDeleted = true;
                _context.thongke_bieuquyet.Remove(model);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(299, new { message = ex.Message });
            }
            return Ok(new { message = "Xóa báo cáo thống kê biểu quyết thành công" });
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("xemchitiet")]
        public async Task<IActionResult> Detail(Guid id)
        {
            var item = _context.thongke_bieuquyet.Find(id);
            if (item == null) return StatusCode(299, new { message = "Không tìm thấy thông tin báo cáo" });
            return Ok(new { data = item });
        }

        [HttpPut]
        [Authorize]
        [Route("Duyet")]
        public async Task<IActionResult> Approve(Guid id)
        {
            try
            {
                var thongke_bieuquyet = _context.thongke_bieuquyet.Where(x => x.Id == id).FirstOrDefault();
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                thongke_bieuquyet.Status = 1; //xác nhận thống kê điểm cầu 
                thongke_bieuquyet.ModifiedDate = DateTime.Now;
                thongke_bieuquyet.ModifiedBy = user;
                _context.thongke_bieuquyet.Update(thongke_bieuquyet);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Duyệt báo cáo thống kê biểu quyết thành công" });
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
            var totalRecords = await _context.thongke_bieuquyet.CountAsync(x => x.IsDeleted == false && x.Status == 0);
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);
            var items = await _context.thongke_bieuquyet
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
            var totalRecords = await _context.thongke_bieuquyet.CountAsync(x => x.IsDeleted == false && x.Status == 1);
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);
            var items = await _context.thongke_bieuquyet
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
            var totalRecords = await _context.thongke_bieuquyet.CountAsync(x => x.IsDeleted == true);
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);
            var items = await _context.thongke_bieuquyet
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
            var thongke_bieuquyet = _context.thongke_bieuquyet.Where(x => x.Id == id).FirstOrDefault();
            if (thongke_bieuquyet.IsDeleted == false)
            {
                return StatusCode(299, new { message = "Không thể khôi phục" });
            }
            thongke_bieuquyet.IsDeleted = false;
            thongke_bieuquyet.ModifiedDate = DateTime.Now;
            thongke_bieuquyet.ModifiedBy = user;
            _context.thongke_bieuquyet.Update(thongke_bieuquyet);
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
                var query = _context.thongke_bieuquyet.Where
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

