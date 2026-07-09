using HTT.Api.Models;
using HTT.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HTT.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuanLyThongKeSoCuocHopCuaMotDaiBieuThamGiaDenThoiDiemHienTaiController : ControllerBase
    {
        private readonly QTHT_HTT_Context _QTHT_HTT_Context;
        private readonly HTT_Context _context;
        private readonly IConfiguration _configuration;
        public QuanLyThongKeSoCuocHopCuaMotDaiBieuThamGiaDenThoiDiemHienTaiController(QTHT_HTT_Context QTHT_HTT_Context, HTT_Context context, IConfiguration configuration)
        {
            _QTHT_HTT_Context = QTHT_HTT_Context;
            _context = context;
            _configuration = configuration;
        }

        // <summary>
        /// Lấy ra danh sách lịch họp của một người đã là thành viên phòng họp theo từng đơn vị, form thống kê cho chọn thống kê theo thời gian
        /// </summary>
        /// <param name="time"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        [Route("thongkedanhsachlichhop")]
        public IActionResult Thongkedanhsachlichhop(int userId, thong_ke_request_time time)
        {
            try
            {
                StringBuilder sb = new StringBuilder();
                time.dateFrom = time.dateFrom.AddHours(7);
                time.dateTo = time.dateTo.AddHours(7);
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                var don_vi = _QTHT_HTT_Context.thong_tin_nguoi_dung
                  .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                  .Select(x => x.ma_tochuc)
                  .FirstOrDefault();
                var don_vi_id = _QTHT_HTT_Context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
                sb.Append("<table>");
                sb.Append("<thead><tr><th>STT</th><th>Tên đơn vị</th><th>Tên cuộc họp</th><th>Người báo cáo</th><th>Ngày báo cáo</th><th>Số thành viên</th></tr></thead>");
                sb.Append("<tbody>");
                int total = 0;
                var items = new Meeting_Schedule_ThongKeLich_TheoDonVi(_configuration).ThongKeDanhSachLichHop(_context, _QTHT_HTT_Context, userId, user_current, don_vi_id, time.dateFrom, time.dateTo);
                if (items.Count > 0)
                {
                    foreach (var item in items)
                    {
                        sb.Append("<tr>");
                        sb.Append("<td>" + item.Stt + "</td>");
                        sb.Append("<td>" + item.TenThanhVien + "</td>");
                        sb.Append("<td>" + item.NguoiBaoCao + "</td>");
                        sb.Append("<td>" + item.NgayBaoCao + "</td>");
                        sb.Append("<td>" + item.SoLuong + "</td>");
                        sb.Append("</tr>");
                        total += item.SoLuong;
                    }

                    sb.Append("</tr>");
                }
                sb.Append("</tbody>");
                sb.Append("</table>");
                return Ok(new { data = sb.ToString(), message = new { status = 200 } });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        /// <summary>
        /// Người quản lý họp trực tuyến có thể thêm thống kê số cuộc họp của một đại biểu tham gia đến thời điểm hiện tại , hệ thống thêm mới thống kê và thông báo thành công	
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
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
                thongke_socuochopcuamotdaibieuthamgiadenthoidiemhientai model = new thongke_socuochopcuamotdaibieuthamgiadenthoidiemhientai();
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
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Tên thành viên</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Người báo cáo</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Ngày báo cáo</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Số thành viên</th>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");
                int total = 0;
                var items = new Meeting_Schedule_ThongKeLich_TheoDonVi(_configuration).ThongKeDanhSachLichHop(_context, _QTHT_HTT_Context, time.id, user_current, don_vi_id, time.dateFrom, time.dateTo);
                if (items.Count > 0)
                {
                    foreach (var item in items)
                    {
                        sb.Append("<tr style='border: 1px solid black;'>");
                        sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + item.Stt + "</td>");
                        sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + item.TenThanhVien + "</td>");
                        sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + item.NguoiBaoCao + "</td>");
                        sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + item.NgayBaoCao + "</td>");
                        sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + item.SoLuong + "</td>");
                        sb.Append("</tr>");
                        total += item.SoLuong;
                    }

                    // Append a summary row for the total
                    sb.Append("<tr style='border: 1px solid black; font-weight: bold; background-color: #f4f4f4;'>");
                    sb.Append("<td colspan='5' style='text-align: right; border: 1px solid black; padding: 8px;'>Tổng số thành viên:</td>");
                    sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + total + "</td>");
                    sb.Append("</tr>");
                }
                sb.Append("</tbody>");
                sb.Append("</table>");

                model.Content = sb.ToString();
                model.Title = "Báo cáo thống kê số cuộc họp của một đại biểu tham gia đến tời điểm hiện tại từ " + time.dateFrom.ToString("dd/MM/yyyy") + " đến " + time.dateTo.ToString("dd/MM/yyyy");
                model.CreatedDate = DateTime.Now;
                model.CreatedBy = user;
                model.IsDeleted = false;
                model.Id = Guid.NewGuid();

                _context.thongke_socuochopcuamotdaibieuthamgiadenthoidiemhientai.Add(model);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Thêm thống kê số cuộc họp của một đại biểu tham gia đến thời điểm hiện tại thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn sửa thống kê số cuộc họp của một đại biểu tham gia đến thời điểm hiện tại , hệ thống cập nhật thống kê và thông báo thành công
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut]
        [Authorize]
        [Route("sua")]
        public async Task<IActionResult> Update(thongke_socuochopcuamotdaibieuthamgiadenthoidiemhientai model)
        {
            try
            {
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                var check = _context.thongke_socuochopcuamotdaibieuthamgiadenthoidiemhientai.Find(model.Id);
                model.CreatedBy = check.CreatedBy;
                model.CreatedDate = check.CreatedDate;
                model.ModifiedDate = DateTime.Now;
                model.ModifiedBy = user;
                _context.thongke_socuochopcuamotdaibieuthamgiadenthoidiemhientai.Update(model);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Chỉnh sửa thống kê số cuộc họp của một đại biểu tham gia đến thời điểm hiện tại thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn xóa thống kê số cuộc họp của một đại biểu tham gia đến thời điểm hiện tại , hệ thống cập nhật thống kê và thông báo thành công
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
                var model = _context.thongke_socuochopcuamotdaibieuthamgiadenthoidiemhientai.Find(id);
                model.DeletedDate = DateTime.Now;
                model.DeletedBy = user;
                model.IsDeleted = true;
                _context.thongke_socuochopcuamotdaibieuthamgiadenthoidiemhientai.Remove(model);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Chỉnh sửa thống kê số cuộc họp của một đại biểu tham gia đến thời điểm hiện tại thành công" });
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
        [AllowAnonymous]
        [Route("danhsach")]
        public async Task<IActionResult> GetAll(int pageNumber, int pageSize)
        {
            var totalRecords = await _context.thongke_socuochopcuamotdaibieuthamgiadenthoidiemhientai.CountAsync(x => x.IsDeleted == false);
            var totalPages = (int)Math.Ceiling(totalRecords / (double)pageSize);
            var items = await _context.thongke_socuochopcuamotdaibieuthamgiadenthoidiemhientai
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
            var item = _context.thongke_socuochopcuamotdaibieuthamgiadenthoidiemhientai.Find(id);
            return Ok(item);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("Timkiem")]
        public async Task<IActionResult> Search(string txtSearch, int pageNumber, int pageSize)
        {
            try
            {
                var query = _context.thongke_socuochopcuamotdaibieuthamgiadenthoidiemhientai.Where
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
