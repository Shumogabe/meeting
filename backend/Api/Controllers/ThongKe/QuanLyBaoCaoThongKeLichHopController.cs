using HTT.Api.Models;
using HTT.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace QTHT.Api.Controllers.ThongKe
{
    [Route("api/QuanLyBaoCaoThongKeLichHop")]
    [ApiController]
    public class QuanLyBaoCaoThongKeLichHopController : ControllerBase
    {
        private readonly HTT_Context _context;
        private readonly QTHT_HTT_Context _QTHT_HTT_Context;
        private readonly IConfiguration _configuration;
        public QuanLyBaoCaoThongKeLichHopController(HTT_Context context, QTHT_HTT_Context qTHT_HTT_Context, IConfiguration configuration)
        {
            _context = context;
            _QTHT_HTT_Context = qTHT_HTT_Context;
            _configuration = configuration;
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối thêm báo cáo thống kê lịch họp, hệ thống thêm mới báo cáo thống kê lịch họp và trả về thông báo thành công	
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize]
        [Route("them")]
        public async Task<IActionResult> Insert(thongke_lichhop model)
        {
            try
            {
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                model.CreatedDate = DateTime.Now;
                model.CreatedBy = user;
                model.Id = Guid.NewGuid();
                model.IsDeleted = false;
                model.Status = 0;// trạng thái chờ duyệt
                _context.thongke_lichhop.Add(model);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Thêm báo cáo thông kê lịch họp thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối sửa báo cáo thống kê lịch họp, hệ thống sửa báo cáo thống kê lịch họp và trả về thông báo thành công
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut]
        [Authorize]
        [Route("sua")]
        public async Task<IActionResult> Update(thongke_lichhop model)
        {
            try
            {
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                var check = _context.thongke_lichhop.Find(model.Id);
                model.CreatedBy = check.CreatedBy;
                model.CreatedDate = check.CreatedDate;
                model.ModifiedDate = DateTime.Now;
                model.ModifiedBy = user;
                _context.thongke_lichhop.Update(model);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Chỉnh sửa báo cáo thông kê lịch họp thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xóa báo cáo thống kê lịch họp, hệ thống xóa báo cáo thống kê lịch họp và trả về thông báo thành công	
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpDelete]
        [Authorize]
        [Route("xoa")]
        public async Task<IActionResult> Remove(Guid id)
        {
            try
            {
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                var model = _context.thongke_lichhop.Find(id);
                model.DeletedDate = DateTime.Now;
                model.DeletedBy = user;
                model.IsDeleted = true;
                _context.thongke_lichhop.Remove(model);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa báo cáo thông kê lịch họp thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem thông tin chi tiết lịch họp, hệ thống lấy thông tin chi tiết báo cáo thống kê lịch họp và trả về thông tin chi tiết lịch họp
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [Route("xemchitiet")]
        public async Task<IActionResult> Detail(Guid id)
        {
            var item = _context.thongke_lichhop.Find(id);
            return Ok(item);
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối gửi duyệt báo cáo thống kê lịch họp, hệ thống cập nhật trạng thái gửi duyệt báo cáo thống kê lịch họp và trả về thông báo thành công	
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut]
        [Authorize]
        [Route("Duyet")]
        public async Task<IActionResult> Approve(thongke_lichhop model)
        {
            try
            {
                var thongke_lichhop = _context.thongke_lichhop.Where(x => x.Id == model.Id).FirstOrDefault();
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                thongke_lichhop.Status = 1; //xác nhận thống kê lịch họp
                thongke_lichhop.ModifiedDate = DateTime.Now;
                thongke_lichhop.ModifiedBy = user;
                _context.thongke_lichhop.Update(thongke_lichhop);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Chỉnh sửa báo cáo thông kê lịch họp thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem danh sách thống kê lịch họp chờ duyệt, hệ thống lấy danh sách báo cáo thống kê lịch họp chờ duyệt và trả về danh sách thống kê lịch họp chờ duyệt
        /// </summary>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("danhsachchoduyet")]
        public async Task<IActionResult> ListDraft(int pageNumber, int pageSize)
        {
            var totalRecords = await _context.thongke_lichhop.CountAsync(x => x.IsDeleted == false && x.Status == 0);
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

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem danh sách thống kê lịch họp đã duyệt, hệ thống lấy danh sách báo cáo thống kê lịch họp đã duyệt và trả về danh sách thống kê lịch họp đã duyệt	
        /// </summary>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("danhsachdaduyet")]
        public async Task<IActionResult> ListApprove(int pageNumber, int pageSize)
        {
            var totalRecords = await _context.thongke_lichhop.CountAsync(x => x.IsDeleted == false && x.Status == 1);
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
        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem danh sách thống kê lịch họp đã xóa, hệ thống lấy danh sách báo cáo thống kê lịch họp đã xóa và trả về danh sách thống kê lịch họp đã xóa
        /// </summary>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("danhsachdaxoa")]
        public async Task<IActionResult> ListDeleted(int pageNumber, int pageSize)
        {
            var totalRecords = await _context.thongke_lichhop.CountAsync(x => x.IsDeleted == true);
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
            var thongke_lichhop = _context.thongke_lichhop.Where(x => x.Id == id).FirstOrDefault();
            if (thongke_lichhop.IsDeleted == false)
            {
                return StatusCode(299, new { message = "Không thể khôi phục" });
            }
            thongke_lichhop.IsDeleted = false;
            thongke_lichhop.ModifiedDate = DateTime.Now;
            thongke_lichhop.ModifiedBy = user;
            _context.thongke_lichhop.Update(thongke_lichhop);
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
                var query = _context.thongke_lichhop.Where
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
