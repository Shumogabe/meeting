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
    [Route("api/QuanLyBaoCaoThongKeHoiNghiHoiThao")]
    [ApiController]
    public class QuanLyBaoCaoThongKeHoiNghiHoiThaoController : ControllerBase
    {
        private readonly HTT_Context _context;
        private readonly QTHT_HTT_Context _QTHT_HTT_Context;
        private readonly IConfiguration _configuration;
        public QuanLyBaoCaoThongKeHoiNghiHoiThaoController(HTT_Context context, IConfiguration configuration, QTHT_HTT_Context QTHT_HTT_Context)
        {
            _context = context;
            _configuration = configuration;
            _QTHT_HTT_Context = QTHT_HTT_Context;
        }
        /// <summary>
        /// Lập bảng thống kê số lượng cuộc họp theo đơn vị
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        [Route("thongkecuochop")]
        public IActionResult ThongKe(thong_ke_request_time model)   
        {
            try
            {
                //var cauhinh = await _QTHT_HTT_Context.
                var thongketatca = false;
                StringBuilder sb = new StringBuilder();
                sb.Append("<table>");
                sb.Append("<thead><th>STT</th><th>Tên đơn vị</th><th>Ngày báo cáo</th><th>Số cuộc họp</th></thead>");

                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var items = new Meeting_Schedule_ThongKeLich_TheoDonVi(_configuration).ThongKeLich_TheoDonVi(_QTHT_HTT_Context, user_current, thongketatca, model.dateFrom, model.dateTo);
                if (items.Count > 0)
                {
                    foreach (var item in items)
                    {
                        sb.Append("<tbody><tr><td>" + item.Stt + "</td><td>" + item.TenDonVi + "</td><td>" + item.NgayBaoCao.ToString().Split(' ').FirstOrDefault() + "</td><td>" + item.SoLuong + "</td></tr></tbody>");
                    }

                }
                sb.Append("</table>");
                return Ok(new { data = sb.ToString(), message = new { status = 200 } });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Lấy ra số lịch họp đang thực hiện theo đơn vị của người thống kê, form thống kê cho chọn thống kê theo thời gian
        /// </summary>
        /// <param name="time"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        [Route("thongkelichhopdangthuchien")]
        public IActionResult ThongKeLichHop(thong_ke_request_time time)
        {
            try
            {
                StringBuilder sb = new StringBuilder();

                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                var don_vi = _QTHT_HTT_Context.thong_tin_nguoi_dung
                  .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                  .Select(x => x.ma_tochuc)
                  .FirstOrDefault();
                var don_vi_id = _QTHT_HTT_Context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
                sb.Append("<table>");
                sb.Append("<thead><tr><th>STT</th><th>Tên đơn vị</th><th>Người báo cáo</th><th>Ngày báo cáo</th><th>Số cuộc họp</th></tr></thead>");
                sb.Append("<tbody>");
                var items = new Meeting_Schedule_ThongKeLich_TheoDonVi(_configuration).ThongKeLichHopDangDienRa_TheoDonViId(_QTHT_HTT_Context, user_current, false, don_vi_id, time.dateFrom, time.dateTo);
                if (items.Count > 0)
                {
                    foreach (var item in items)
                    {
                        sb.Append("<tr>");
                        sb.Append("<td>" + item.Stt + "</td>");
                        sb.Append("<td>" + item.TenDonVi + "</td>");
                        sb.Append("<td>" + item.NguoiBaoCao + "</td>");
                        sb.Append("<td>" + item.NgayBaoCao + "</td>");
                        sb.Append("<td>" + item.SoLuong + "</td>");
                        sb.Append("</tr>");
                    }
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
        /// Người quản lý họp trực tuyến có thể thêm báo cáo thống kê hội nghị hội thảo, hệ thống thêm mới thống kê và thông báo thành công	
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
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                var don_vi = _QTHT_HTT_Context.thong_tin_nguoi_dung
                  .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                  .Select(x => x.ma_tochuc)
                  .FirstOrDefault();
                var don_vi_id = _QTHT_HTT_Context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
                StringBuilder sb = new StringBuilder();
                sb.Append("<table style='border-collapse: collapse; width: 100%; border: 1px solid black;'>");
                sb.Append("<thead>");
                sb.Append("<tr style='border: 1px solid black; background-color: #f4f4f4;'>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>STT</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Tên đơn vị</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Người báo cáo</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Ngày báo cáo</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Số cuộc họp</th>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");
                var items = new Meeting_Schedule_ThongKeLich_TheoDonVi(_configuration).ThongKeLich_TheoDonViId(_QTHT_HTT_Context, user_current, false, don_vi_id, time.dateFrom, time.dateTo);
                if (items.Count > 0)
                {
                    foreach (var item in items)
                    {
                        sb.Append("<tr style='border: 1px solid black;'>");
                        sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + item.Stt + "</td>");
                        sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + item.TenDonVi + "</td>");
                        sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + item.NguoiBaoCao + "</td>");
                        sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + item.NgayBaoCao + "</td>");
                        sb.Append("<td style='border: 1px solid black; padding: 8px;'>" + item.SoLuong + "</td>");
                        sb.Append("</tr>");
                    }
                }
                sb.Append("</tbody>");
                sb.Append("</table>");

                thongke_hoinghihoithao model = new thongke_hoinghihoithao();
                model.Content = sb.ToString();
                model.Title = "Báo cáo thống kê hội nghị hội thảo từ " + time.dateFrom.ToString("dd/MM/yyyy") + " đến " + time.dateTo.ToString("dd/MM/yyyy");
                model.CreatedDate = DateTime.Now;
                model.don_vi = Convert.ToInt32(don_vi_id);
                model.CreatedBy = user;
                model.IsDeleted = false;
                model.Id = Guid.NewGuid();
                _context.thongke_hoinghihoithao.Add(model);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Thêm báo cáo thống kê hội nghị hội thảo thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn sửa báo cáo thống kê hội nghị hội thảo, hệ thống cập nhật thống kê và thông báo thành công
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut]
        [Authorize]
        [Route("sua")]
        public async Task<IActionResult> Update(thongke_hoinghihoithao model)
        {
            try
            {
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                var check = _context.thongke_hoinghihoithao.Find(model.Id);
                model.CreatedBy = check.CreatedBy;
                model.CreatedDate = check.CreatedDate;
                model.ModifiedDate = DateTime.Now;
                model.ModifiedBy = user;
                _context.thongke_hoinghihoithao.Update(model);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Chỉnh sửa báo cáo thống kê hội nghị hội thảo thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn xóa báo cáo thống kê hội nghị hội thảo, hệ thống cập nhật thống kê và thông báo thành công
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
                var model = _context.thongke_hoinghihoithao.Find(id);
                model.DeletedDate = DateTime.Now;
                model.DeletedBy = user;
                model.IsDeleted = true;
                _context.thongke_hoinghihoithao.Remove(model);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa báo cáo thống kê hội nghị hội thảo thành công" });
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
            var totalRecords = await _context.thongke_hoinghihoithao.CountAsync(x => x.IsDeleted == false);
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
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [Route("xemchitiet")]
        public async Task<IActionResult> Detail(Guid id)
        {
            var item = _context.thongke_hoinghihoithao.Find(id);
            return Ok(item);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("Timkiem")]
        public async Task<IActionResult> Search(string txtSearch, int pageNumber, int pageSize)
        {
            try
            {
                var query = _context.thongke_hoinghihoithao.Where
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
