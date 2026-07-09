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
    [Route("api/QuanLyBaoCaoThongKeDiemDiemCau")]
    [ApiController]
    public class QuanLyBaoCaoThongKeDiemDiemCauController : ControllerBase
    {
        private readonly HTT_Context _context;
        private readonly QTHT_HTT_Context _QTHT_HTT_Context;
        private readonly IConfiguration _configuration;
        public QuanLyBaoCaoThongKeDiemDiemCauController(HTT_Context context, QTHT_HTT_Context qTHT_HTT_Context, IConfiguration configuration)
        {
            _context = context;
            _QTHT_HTT_Context = qTHT_HTT_Context;
            _configuration = configuration;
        }


        /// <summary>
        /// Lấy ra số lịch họp trực tuyến kèm số lượng thành viên phòng họp theo đơn vị của người thống kê, form thống kê cho chọn thống kê theo thời gian
        /// </summary>
        /// <param name="time"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        [Route("thongkethanhviencuochop")]
        public IActionResult ThongKeThanhVienCuocHop(thong_ke_request_time time)
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
                var items = new Meeting_Schedule_ThongKeLich_TheoDonVi(_configuration).ThongKeThanhVienCuocHop(_context, _QTHT_HTT_Context, user_current, false, don_vi_id, time.dateFrom, time.dateTo);
                if (items.Count > 0)
                {
                    foreach (var item in items)
                    {
                        sb.Append("<tr>");
                        sb.Append("<td>" + item.Stt + "</td>");
                        sb.Append("<td>" + item.TenDonVi + "</td>");
                        sb.Append("<td>" + item.TenCuocHop + "</td>");
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
        
        [HttpPost]
        [Authorize]
        [Route("them")]
        public async Task<IActionResult> Insert(thong_ke_request_time time)
        {
            try
            {
                StringBuilder sb = new StringBuilder();
                thongke_diemcau model = new thongke_diemcau();
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                var don_vi = _QTHT_HTT_Context.thong_tin_nguoi_dung
                  .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                  .Select(x => x.ma_tochuc)
                  .FirstOrDefault();
                var don_vi_id = _QTHT_HTT_Context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
                sb.Append("<table style='border-collapse: collapse; width: 100%; border: 1px solid black;'>");
                sb.Append("<thead>");
                sb.Append("<tr style='background-color: #f4f4f4; border: 1px solid black;'>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>STT</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Tên đơn vị</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Tên cuộc họp</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Người báo cáo</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Ngày báo cáo</th>");
                sb.Append("<th style='border: 1px solid black; padding: 8px; text-align: left;'>Số thành viên</th>");
                sb.Append("</tr>");
                sb.Append("</thead>");
                sb.Append("<tbody>");
                int total = 0;
                var items = new Meeting_Schedule_ThongKeLich_TheoDonVi(_configuration).ThongKeThanhVienCuocHop(_context, _QTHT_HTT_Context, user_current, false, don_vi_id, time.dateFrom, time.dateTo);
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
                    sb.Append("<tr style='font-weight: bold; background-color: #f4f4f4;'>");
                    sb.Append("<td colspan='5' style='text-align: right; padding: 8px;'>Tổng số thành viên:</td>");
                    sb.Append("<td style='padding: 8px;'>" + total + "</td>");
                    sb.Append("</tr>");
                }
                sb.Append("</tbody>");
                sb.Append("</table>");

                model.Content = sb.ToString();
                model.Title = " Báo cáo thống kê điểm điểm cầu từ " + time.dateFrom.ToString("MM/dd/yyyy") + " đến " + time.dateTo.ToString("MM/dd/yyyy");
                model.CreatedDate = DateTime.Now;
                model.CreatedBy = user;
                model.IsDeleted = false;
                model.Status = 0;// trạng thái chờ duyệt
                _context.thongke_diemcau.Add(model);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Thêm báo cáo thông kê điểm cầu thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }


        [HttpPut]
        [Authorize]
        [Route("sua")]
        public async Task<IActionResult> Update(thongke_diemcau model)
        {
            try
            {
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                var check = _context.thongke_diemcau.Find(model.Id);
                model.CreatedBy = check.CreatedBy;
                model.CreatedDate = check.CreatedDate;
                model.ModifiedDate = DateTime.Now;
                model.ModifiedBy = user;
                _context.thongke_diemcau.Update(model);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Chỉnh sửa báo cáo thông kê điểm cầu thành công" });
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
                var model = _context.thongke_diemcau.Find(id);
                model.DeletedDate = DateTime.Now;
                model.DeletedBy = user;
                model.IsDeleted = true;
                _context.thongke_diemcau.Remove(model);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa báo cáo thông kê điểm cầu thành công" });
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
            var item = _context.thongke_diemcau.Find(id);
            return Ok(item);
        }





        [HttpPut]
        [Authorize]
        [Route("Duyet")]
        public async Task<IActionResult> Approve(thongke_diemcau model)
        {
            try
            {
                var thongke_diemcau = _context.thongke_diemcau.Where(x => x.Id == model.Id).FirstOrDefault();
                var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
                var user = _QTHT_HTT_Context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                thongke_diemcau.Status = 1; //xác nhận thống kê điểm cầu 
                thongke_diemcau.ModifiedDate = DateTime.Now;
                thongke_diemcau.ModifiedBy = user;
                _context.thongke_diemcau.Update(thongke_diemcau);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Chỉnh sửa báo cáo thông kê điểm cầu thành công" });
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
            var totalRecords = await _context.thongke_diemcau.CountAsync(x => x.IsDeleted == false && x.Status == 0);
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
            var totalRecords = await _context.thongke_diemcau.CountAsync(x => x.IsDeleted == false && x.Status == 1);
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
            var totalRecords = await _context.thongke_diemcau.CountAsync(x => x.IsDeleted == true);
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
            var thongke_diemcau = _context.thongke_diemcau.Where(x => x.Id == id).FirstOrDefault();
            if (thongke_diemcau.IsDeleted == false)
            {
                return StatusCode(299, new { message = "Không thể khôi phục" });
            }
            thongke_diemcau.IsDeleted = false;
            thongke_diemcau.ModifiedDate = DateTime.Now;
            thongke_diemcau.ModifiedBy = user;
            _context.thongke_diemcau.Update(thongke_diemcau);
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
                var query = _context.thongke_diemcau.Where
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

