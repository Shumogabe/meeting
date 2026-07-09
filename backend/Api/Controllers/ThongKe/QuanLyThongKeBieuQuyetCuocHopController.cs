using HTT.Api.Models;
using HTT.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HTT.Api.Controllers
{
    [Route("api/QuanLyThongKeBieuQuyetCuocHop")]
    [ApiController]
    public class QuanLyThongKeBieuQuyetCuocHopController : ControllerBase
    {
        private readonly QTHT_HTT_Context _QTHT_HTT_Context;
        private readonly HTT_Context _context;
        private readonly IConfiguration _configuration;
        public QuanLyThongKeBieuQuyetCuocHopController(QTHT_HTT_Context QTHT_HTT_Context, IConfiguration configuration, HTT_Context context)
        {
            _context = context;
            _QTHT_HTT_Context = QTHT_HTT_Context;
            _configuration = configuration;
        }

        [HttpPost]
        [Authorize]
        [Route("them")]
        public async Task<IActionResult> Insert(thong_ke_request_time time)
        {
            try
            {
                time.dateFrom = time.dateFrom.AddHours(7);
                time.dateTo = time.dateTo.AddHours(7);
                StringBuilder sb = new StringBuilder();
                thongke_bieuquyet model = new thongke_bieuquyet();
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                var don_vi = _QTHT_HTT_Context.thong_tin_nguoi_dung
                  .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                  .Select(x => x.ma_tochuc)
                  .FirstOrDefault();
                var don_vi_id = _QTHT_HTT_Context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
                sb.Append("<table style='border-collapse: collapse; width: 100%; border: 1px solid black;'>");
                sb.Append("<thead>");
                sb.Append("<tr style='border: 1px solid black; background-color: #f4f4f4;'>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>STT</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Tên đơn vị</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Tên cuộc họp</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Người báo cáo</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Ngày báo cáo</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Số lượng tài liệu</th>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");
                int total = 0;
                var items = new Meeting_Schedule_ThongKeLich_TheoDonVi(_configuration).ThongKeBieuQuyetCuocHop(_context, _QTHT_HTT_Context, user_current, false, don_vi_id, time.dateFrom, time.dateTo);
                if (items.Count > 0)
                {
                    foreach (var item in items)
                    {
                        sb.Append("<tr style='border: 1px solid black;'>");
                        sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + item.Stt + "</td>");
                        sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + item.TenDonVi + "</td>");
                        sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + item.TenCuocHop + "</td>");
                        sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + item.NguoiBaoCao + "</td>");
                        sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + item.NgayBaoCao + "</td>");
                        sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + item.SoLuong + "</td>");
                        sb.Append("</tr>");
                        total += item.SoLuong;
                    }
                    // Append a summary row for the total
                    sb.Append("<tr style='border: 1px solid black; font-weight: bold; background-color: #f4f4f4;'>");
                    sb.Append("<td colspan='5' style='text-align: right; border: 1px solid black; padding: 8px;'>Tổng số biểu quyết cuộc họp:</td>");
                    sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + total + "</td>");
                    sb.Append("</tr>");
                }
                sb.Append("</tbody>");
                sb.Append("</table>");

                model.Content = sb.ToString();
                model.Title = "Báo cáo thống kê biểu quyết cuộc họp từ " + time.dateFrom.ToString("dd/MM/yyyy") + " đến " + time.dateTo.ToString("dd/MM/yyyy");
                model.CreatedDate = DateTime.Now;
                model.Id = Guid.NewGuid();
                model.CreatedBy = user;
                _context.thongke_bieuquyet.Add(model);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Thêm thống kê biểu quyết thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn sửa thống kê hội nghị hội thảo, hệ thống cập nhật thống kê và thông báo thành công
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
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

                return Ok(new { message = "Chỉnh sửa thống kê hội nghị hội thảo thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn xóa thống kê hội nghị hội thảo, hệ thống cập nhật thống kê và thông báo thành công
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
                var model = _context.thongke_bieuquyet.Find(id);
                model.DeletedDate = DateTime.Now;
                model.DeletedBy = user;
                model.IsDeleted = true;
                _context.thongke_bieuquyet.Remove(model);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa thống kê hội nghị hội thảo thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet]

        [Route("danhsach")]
        public async Task<IActionResult> GetAll(int pageNumber, int pageSize)
        {
            var totalRecords = await _context.thongke_bieuquyet.CountAsync(x => x.IsDeleted == false);
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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [Route("xemchitiet")]
        public async Task<IActionResult> Detail(Guid id)
        {
            var item = _context.thongke_bieuquyet.Find(id);
            return Ok(item);
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
