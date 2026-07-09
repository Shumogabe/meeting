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
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;

namespace QTHT.Api.Controllers.DichVu
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class DangKyCapPhatBoSungDichVuController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IConfiguration _configuration;
        private readonly HTT_Context _htt_context;


        public IConfiguration _config { get; }

        public DangKyCapPhatBoSungDichVuController(IConfiguration Configuration, IWebHostEnvironment webHostEnvironment, QTHT_HTT_Context context, HTT_Context htt_context)
        {
            _webHostEnvironment = webHostEnvironment;
            _config = Configuration;
            _context = context;
            _htt_context = htt_context;
        }

        [HttpPost("them")]
        public async Task<IActionResult> ThemDangKiDichVu(DangKyCapPhatBoSungDichVu_Insert model)
        {
            try
            {
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var user_current = User.FindFirst(ClaimTypes.NameIdentifier).Value;
                var don_vi = _context.thong_tin_nguoi_dung
                     .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                     .Select(x => x.ma_tochuc)
                     .FirstOrDefault();
                var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
                var don_vi_ten = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.ten).FirstOrDefault();
                var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
                if (don_vi == null)
                {
                    return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
                }
                Guid id = Guid.NewGuid();
                var dangkidichvu = new DangKyCapPhatBoSungDichVu
                {
                    Id = id,
                    TenDichVu = model.DonVi + " đăng kí cấp phát bổ sung dịch vụ " + Util.DateTimeToUnixTimeMilliseconds(DateTime.Now),
                    NoiDung = model.NoiDung,
                    DonVi = don_vi_ten,
                    DienThoai = model.DienThoai,
                    Email = model.Email,
                    TepTin = "DangKyCapPhatBoSungDichVu/" + id.ToString() + "/" + model.TepTin,
                    NguoiDangKy = user_current,
                    NgayDangKy = Util.DateTimeToUnixTimeMilliseconds(DateTime.Now),
                    NgayBatDau = model.NgayBatDau,
                    NgayKetThuc = model.NgayKetThuc,
                    SoLuongTaiKhoan = model.SoLuongTaiKhoan,
                    Status = 1,
                    CreatedDate = DateTime.Now,
                    CreatedBy = user,
                    IsDeleted = false
                };

                if (user == 0)
                {
                    return BadRequest("không tìm thấy người dùng");
                }

                _htt_context.DangKyCapPhatBoSungDichVu.Add(dangkidichvu);

                log_ql_dangkydichvu log = new log_ql_dangkydichvu();
                log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                log.tai_khoan = user_current;
                log.noi_dung = user_current + " thực hiện thêm mới đăng kí cấp phát bổ sung dịch vụ " + dangkidichvu.TenDichVu;
                log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                log.chuc_nang = "Quản lí đăng kí cấp phát bổ sung dịch vụ";
                log.loai_hoatdong = "Thêm mới";
                _context.log_ql_dangkydichvu.Add(log);
                _context.SaveChanges();
                _htt_context.SaveChanges();
                return Ok(new { TepTin = "DangKyCapPhatBoSungDichVu/" + dangkidichvu.Id.ToString(), Status = 200, Message = "Thêm đăng kí cấp phát bổ sung dịch vụ thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpPut("chinhsua")]
        public async Task<IActionResult> ChinhSuaDangKiDichVu(DangKyCapPhatBoSungDichVu_Update model)
        {
            try
            {
                var dangkidichvu = _htt_context.DangKyCapPhatBoSungDichVu.Where(x => x.Id == model.Id).FirstOrDefault();
                if (dangkidichvu == null) return StatusCode(299, new { Message = "Không tìm thấy đăng ký dịch vụ" });

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
                dangkidichvu.TenDichVu = model.TenDichVu;
                dangkidichvu.NoiDung = model.NoiDung;
                dangkidichvu.DonVi = model.DonVi;
                dangkidichvu.TepTin = model.TepTin;
                dangkidichvu.DienThoai = model.DienThoai;
                dangkidichvu.Email = model.Email;
                dangkidichvu.NguoiDangKy = model.NguoiDangKy;
                dangkidichvu.NgayDangKy = model.NgayDangKy;
                dangkidichvu.NguoiDuyet = model.NguoiDuyet;
                dangkidichvu.NgayDuyet = model.NgayDuyet;
                dangkidichvu.NgayBatDau = model.NgayBatDau;
                dangkidichvu.NgayKetThuc = model.NgayKetThuc;
                dangkidichvu.SoLuongTaiKhoan = model.SoLuongTaiKhoan;
                dangkidichvu.ModifiedDate = DateTime.Now;
                dangkidichvu.ModifiedBy = user;
                dangkidichvu.IsDeleted = false;

                if (user == 0)
                {
                    return BadRequest("không tìm thấy người dùng");
                }


                _htt_context.DangKyCapPhatBoSungDichVu.Update(dangkidichvu);
                log_ql_dangkydichvu log = new log_ql_dangkydichvu();
                log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                log.tai_khoan = user_current;
                log.noi_dung = user_current + " " + "thực hiện chỉnh sửa đăng kí cấp phát bổ sung dịch vụ" + " " + model.TenDichVu;
                log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                log.chuc_nang = "Quản lí đăng kí cấp phát bổ sung dịch vụ";
                log.loai_hoatdong = "Chỉnh sửa";
                _context.log_ql_dangkydichvu.Add(log);
                _context.SaveChanges();
                _htt_context.SaveChanges();
                return Ok(new { TepTin = "DangKyCapPhatBoSungDichVu/" + dangkidichvu.Id.ToString(), Status = 200, Message = "Chỉnh sửa đăng kí cấp phát bổ sung dịch vụ thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpDelete("xoa")]
        public async Task<IActionResult> XoaDangKiDichVu(Guid id)
        {
            try
            {
                var dangkidichvu = _htt_context.DangKyCapPhatBoSungDichVu.Where(x => x.Id == id).FirstOrDefault();
                if (dangkidichvu == null) return StatusCode(299, new { Message = "Không tìm thấy đăng ký dịch vụ" });

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

                dangkidichvu.DeletedDate = DateTime.Now;
                dangkidichvu.DeletedBy = user;
                dangkidichvu.IsDeleted = true;

                if (user == 0)
                {
                    return BadRequest("không tìm thấy người dùng");
                }


                _htt_context.DangKyCapPhatBoSungDichVu.Update(dangkidichvu);
                log_ql_dangkydichvu log = new log_ql_dangkydichvu();
                log.ma = Util.ToID(user_current + "-" + Util.DateTimeToUnixTimeStamp(DateTime.Now));
                log.tai_khoan = user_current;
                log.noi_dung = user_current + " thực hiện xóa đăng kí cấp phát bổ sung dịch vụ " + dangkidichvu.TenDichVu;
                log.ip_may = Dns.GetHostByName(Dns.GetHostName()).AddressList[0].ToString();
                log.thoigian_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                log.chuc_nang = "Quản lí đăng kí cấp phát bổ sung dịch vụ";
                log.loai_hoatdong = "Xóa";
                _context.log_ql_dangkydichvu.Add(log);
                _context.SaveChanges();
                _htt_context.SaveChanges();
                return Ok(new { TepTin = dangkidichvu.TepTin, Status = 200, Message = "Xóa đăng kí cấp phát bổ sung dịch vụ thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpDelete("xoahoantoan")]
        public async Task<IActionResult> ChinhSuaDangKiDichVu(Guid id)
        {
            try
            {
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
                var dangkidichvu = _htt_context.DangKyCapPhatBoSungDichVu.Where(x => x.Id == id).FirstOrDefault();
                if (dangkidichvu == null) return StatusCode(299, new { Message = "Không tìm thấy đăng ký dịch vụ" });

                _htt_context.DangKyCapPhatBoSungDichVu.Remove(dangkidichvu);
                await _htt_context.SaveChangesAsync();
                return Ok(new { TepTin = dangkidichvu.TepTin, Status = 200, Message = "Xóa hoàn toàn đăng kí cấp phát bổ sung dịch vụ thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpGet("xemchitiet")]
        public async Task<IActionResult> XemChiTiet(Guid id)
        {
            try
            {
                if (id == Guid.Empty) return StatusCode(299, new { message = "Không tìm thấy thông tin đăng ký" });
                var dangky = _htt_context.DangKyCapPhatBoSungDichVu.Find(id);
                if (dangky == null) return StatusCode(299, new { message = "Không tìm thấy thông tin đăng ký" });
                return Ok(new { data = dangky });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpGet("danhsachnhap")]
        public async Task<IActionResult> DanhSachNhap(string canhan, string tochuc, long tgbatdau, long tgketthuc, int pageSize, int pageNumber)
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
                    var list = _htt_context.DangKyCapPhatDichVu
                            .Where(x => x.IsDeleted == false && x.Status == 0 && x.DonVi == don_vi_ten.Trim().ToLower());

                    if (!string.IsNullOrEmpty(canhan))
                    {
                        list = list.Where(x => x.NguoiDangKy.ToLower().Contains(canhan.Trim().ToLower()));
                    }

                    if (tgbatdau > 0 && tgketthuc > 0)
                    {
                        list = list.Where(x =>
                            x.NgayDangKy >= tgbatdau
                            && x.NgayDangKy <= tgketthuc
                        );
                    }

                    list = list.AsQueryable();
                    var totalRecords = list.Count();
                    var records = list
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
                    return Ok(new { data = result });
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
                if (!ds_chuc_nang.Contains("Approve"))
                {
                    var list = _htt_context.DangKyCapPhatBoSungDichVu
                        .Where(x => x.IsDeleted == false && x.Status == 0 && x.DonVi == don_vi.Trim().ToLower());

                    if (!string.IsNullOrEmpty(canhan))
                    {
                        list = list.Where(x => x.NguoiDangKy.ToLower().Contains(canhan.Trim().ToLower()));
                    }

                    if (tgbatdau > 0 && tgketthuc > 0)
                    {
                        list = list.Where(x =>
                            x.NgayDangKy >= tgbatdau
                            && x.NgayDangKy <= tgketthuc
                        );
                    }

                    list = list.AsQueryable();
                    var totalRecords = list.Count();
                    var records = list
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
                else
                {
                    var list = _htt_context.DangKyCapPhatBoSungDichVu
                        .Where(x => x.IsDeleted == false && x.Status == 0);
                    if (!string.IsNullOrEmpty(tochuc))
                    {
                        list = list.Where(x => x.DonVi.ToLower().Contains(tochuc.Trim().ToLower()));
                    }

                    if (!string.IsNullOrEmpty(canhan))
                    {
                        list = list.Where(x => x.NguoiDangKy.ToLower().Contains(canhan.Trim().ToLower()));
                    }

                    if (tgbatdau > 0 && tgketthuc > 0)
                    {
                        list = list.Where(x =>
                            x.NgayDangKy >= tgbatdau
                            && x.NgayDangKy <= tgketthuc
                        );
                    }

                    list = list.AsQueryable();
                    var totalRecords = list.Count();
                    var records = list
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

        [HttpGet("danhsachchuaduyet")]
        public async Task<IActionResult> DanhSachChuaDuyet(string canhan, string tochuc, long tgbatdau, long tgketthuc, int pageSize, int pageNumber)
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
                    var list = _htt_context.DangKyCapPhatBoSungDichVu
                                .Where(x => x.IsDeleted == false && x.Status == 1 && x.DonVi == don_vi_ten.Trim().ToLower());

                    if (!string.IsNullOrEmpty(canhan))
                    {
                        list = list.Where(x => x.NguoiDangKy.ToLower().Contains(canhan.Trim().ToLower()));
                    }

                    if (tgbatdau > 0 && tgketthuc > 0)
                    {
                        list = list.Where(x =>
                            x.NgayDangKy >= tgbatdau
                            && x.NgayDangKy <= tgketthuc
                        );
                    }

                    list = list.AsQueryable();
                    var totalRecords = list.Count();
                    var records = list.OrderByDescending(x => x.NgayDangKy)
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
                    return Ok(new { data = result });
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
                if (!ds_chuc_nang.Contains("Approve"))
                {
                    var list = _htt_context.DangKyCapPhatBoSungDichVu
                        .Where(x => x.IsDeleted == false && x.Status == 1 && x.DonVi == don_vi_ten.Trim().ToLower());

                    if (!string.IsNullOrEmpty(canhan))
                    {
                        list = list.Where(x => x.NguoiDangKy.ToLower().Contains(canhan.Trim().ToLower()));
                    }

                    if (tgbatdau > 0 && tgketthuc > 0)
                    {
                        list = list.Where(x =>
                            x.NgayDangKy >= tgbatdau
                            && x.NgayDangKy <= tgketthuc
                        );
                    }

                    list = list.AsQueryable();
                    var totalRecords = list.Count();
                    var records = list.OrderByDescending(x => x.NgayDangKy)
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
                else
                {
                    var list = _htt_context.DangKyCapPhatBoSungDichVu
                        .Where(x => x.IsDeleted == false && x.Status == 1);
                    if (!string.IsNullOrEmpty(tochuc))
                    {
                        list = list.Where(x => x.DonVi.ToLower().Contains(tochuc.Trim().ToLower()));
                    }

                    if (!string.IsNullOrEmpty(canhan))
                    {
                        list = list.Where(x => x.NguoiDangKy.ToLower().Contains(canhan.Trim().ToLower()));
                    }

                    if (tgbatdau > 0 && tgketthuc > 0)
                    {
                        list = list.Where(x =>
                            x.NgayDangKy >= tgbatdau
                            && x.NgayDangKy <= tgketthuc
                        );
                    }

                    list = list.AsQueryable();
                    var totalRecords = list.Count();
                    var records = list.OrderByDescending(x => x.NgayDangKy)
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

        [HttpPost("duyet")]
        public async Task<IActionResult> DuyetDangKyCapPhatBoSungDichVu(Guid id)
        {
            try
            {
                var dangkidichvu = _htt_context.DangKyCapPhatBoSungDichVu.Where(x => x.Id == id).FirstOrDefault();
                if (dangkidichvu == null) return StatusCode(299, new { Message = "Không tìm thấy đăng ký dịch vụ" });

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

                // DangKy
                dangkidichvu.NguoiDuyet = user_current;
                dangkidichvu.NgayDuyet = Util.DateTimeToUnixTimeMilliseconds(DateTime.Now);
                dangkidichvu.Status = 2;
                dangkidichvu.ModifiedBy = user;
                dangkidichvu.ModifiedDate = DateTime.Now;
                _htt_context.DangKyCapPhatBoSungDichVu.Update(dangkidichvu);

                //// CapPhat
                //CapPhatBoSungDichVu capphatdichvu = new CapPhatBoSungDichVu();
                //capphatdichvu.Id = Guid.NewGuid();
                //capphatdichvu.DonVi = dangkidichvu.DonVi;
                //capphatdichvu.NgayBatDau = dangkidichvu.NgayBatDau;
                //capphatdichvu.NgayKetThuc = dangkidichvu.NgayKetThuc;
                //capphatdichvu.TaiKhoan = "";
                //capphatdichvu.MayChu = "";
                //capphatdichvu.HoatDong = 0;
                //capphatdichvu.CreatedDate = dangkidichvu.ModifiedDate;
                //capphatdichvu.CreatedBy = dangkidichvu.ModifiedBy;
                //capphatdichvu.ModifiedBy = 0;
                //capphatdichvu.DeletedBy = 0;
                //capphatdichvu.IsDeleted = false;
                //_htt_context.CapPhatBoSungDichVu.Add(capphatdichvu);

                await _htt_context.SaveChangesAsync();
                return Ok(new { TepTin = dangkidichvu.TepTin, Status = 200, Message = "Duyệt đăng kí cấp phát bổ sung dịch vụ thành công" });

            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpPost("huyduyet")]
        public async Task<IActionResult> HuyDuyetDangKyCapPhatBoSungDichVu(Guid id)
        {
            try
            {
                var dangkidichvu = _htt_context.DangKyCapPhatBoSungDichVu.Where(x => x.Id == id).FirstOrDefault();
                if (dangkidichvu == null) return StatusCode(299, new { Message = "Không tìm thấy đăng ký dịch vụ" });

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
                dangkidichvu.NguoiDuyet = user_current;
                dangkidichvu.NgayDuyet = Util.DateTimeToUnixTimeMilliseconds(DateTime.Now);
                dangkidichvu.Status = 3;
                dangkidichvu.ModifiedBy = user;
                dangkidichvu.ModifiedDate = DateTime.Now;
                _htt_context.DangKyCapPhatBoSungDichVu.Update(dangkidichvu);
                await _htt_context.SaveChangesAsync();
                return Ok(new { TepTin = dangkidichvu.TepTin, Status = 200, Message = "Hủy duyệt đăng kí cấp phát bổ sung dịch vụ thành công" });

            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpGet("danhsachdaduyet")]
        [AllowAnonymous]
        public async Task<IActionResult> DanhSachDaDuyet(string canhan, string tochuc, long tgbatdau, long tgketthuc, int pageNumber, int pageSize)
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
                    var list = _htt_context.DangKyCapPhatBoSungDichVu
                                .Where(x => x.IsDeleted == false && x.Status == 2 && x.DonVi == don_vi_ten.Trim().ToLower());

                    if (!string.IsNullOrEmpty(canhan))
                    {
                        list = list.Where(x => x.NguoiDangKy.ToLower().Contains(canhan.Trim().ToLower()));
                    }

                    if (tgbatdau > 0 && tgketthuc > 0)
                    {
                        list = list.Where(x =>
                            x.NgayDangKy >= tgbatdau
                            && x.NgayDangKy <= tgketthuc
                        );
                    }

                    list = list.AsQueryable();
                    var totalRecords = list.Count();
                    var records = list.OrderByDescending(x => x.NgayDangKy)
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
                    return Ok(new { data = result });
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
                if (!ds_chuc_nang.Any(item => item == "Approve" || item == "Schedule"))
                {
                    var list = _htt_context.DangKyCapPhatBoSungDichVu
                        .Where(x => x.IsDeleted == false && x.Status == 2 && x.DonVi == don_vi_ten.Trim().ToLower());

                    if (!string.IsNullOrEmpty(canhan))
                    {
                        list = list.Where(x => x.NguoiDangKy.ToLower().Contains(canhan.Trim().ToLower()));
                    }

                    if (tgbatdau > 0 && tgketthuc > 0)
                    {
                        list = list.Where(x =>
                            x.NgayDangKy >= tgbatdau
                            && x.NgayDangKy <= tgketthuc
                        );
                    }

                    list = list.AsQueryable();
                    var totalRecords = list.Count();
                    var records = list.OrderByDescending(x => x.NgayDangKy)
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
                else
                {
                    var list_done = _htt_context.CapPhatBoSungDichVu.Select(x => x.Id_DangKy).ToList();

                    var list = _htt_context.DangKyCapPhatBoSungDichVu
                        .Where(x => x.IsDeleted == false && x.Status == 2);

                    if (ds_chuc_nang.Any(item => item == "Schedule"))
                    {
                        list = list.Where(x => !list_done.Contains(x.Id));
                    }

                    if (!string.IsNullOrEmpty(tochuc))
                    {
                        list = list.Where(x => x.DonVi.ToLower().Contains(tochuc.Trim().ToLower()));
                    }

                    if (!string.IsNullOrEmpty(canhan))
                    {
                        list = list.Where(x => x.NguoiDangKy.ToLower().Contains(canhan.Trim().ToLower()));
                    }

                    if (tgbatdau > 0 && tgketthuc > 0)
                    {
                        list = list.Where(x =>
                            x.NgayDangKy >= tgbatdau
                            && x.NgayDangKy <= tgketthuc
                        );
                    }

                    list = list.AsQueryable();
                    var totalRecords = list.Count();
                    var records = list.OrderByDescending(x => x.NgayDangKy)
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

        [HttpGet("danhsachtuchoi")]
        public async Task<IActionResult> DanhsachTuChoi(string canhan, string tochuc, long tgbatdau, long tgketthuc, int pageNumber, int pageSize)
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
                    var list = _htt_context.DangKyCapPhatBoSungDichVu
                                .Where(x => x.IsDeleted == false && x.Status == 3 && x.DonVi == don_vi_ten.Trim().ToLower());

                    if (!string.IsNullOrEmpty(canhan))
                    {
                        list = list.Where(x => x.NguoiDangKy.ToLower().Contains(canhan.Trim().ToLower()));
                    }

                    if (tgbatdau > 0 && tgketthuc > 0)
                    {
                        list = list.Where(x =>
                            x.NgayDangKy >= tgbatdau
                            && x.NgayDangKy <= tgketthuc
                        );
                    }

                    list = list.AsQueryable();
                    var totalRecords = list.Count();
                    var records = list.OrderByDescending(x => x.NgayDangKy)
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
                    return Ok(new { data = result });
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
                if (!ds_chuc_nang.Contains("Approve"))
                {
                    var list = _htt_context.DangKyCapPhatBoSungDichVu
                        .Where(x => x.IsDeleted == false && x.Status == 3 && x.DonVi == don_vi_ten.Trim().ToLower());

                    if (!string.IsNullOrEmpty(canhan))
                    {
                        list = list.Where(x => x.NguoiDangKy.ToLower().Contains(canhan.Trim().ToLower()));
                    }

                    if (tgbatdau > 0 && tgketthuc > 0)
                    {
                        list = list.Where(x =>
                            x.NgayDangKy >= tgbatdau
                            && x.NgayDangKy <= tgketthuc
                        );
                    }

                    list = list.AsQueryable();
                    var totalRecords = list.Count();
                    var records = list.OrderByDescending(x => x.NgayDangKy)
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
                else
                {
                    var list = _htt_context.DangKyCapPhatBoSungDichVu
                        .Where(x => x.IsDeleted == false && x.Status == 3);
                    if (!string.IsNullOrEmpty(tochuc))
                    {
                        list = list.Where(x => x.DonVi.ToLower().Contains(tochuc.Trim().ToLower()));
                    }

                    if (!string.IsNullOrEmpty(canhan))
                    {
                        list = list.Where(x => x.NguoiDangKy.ToLower().Contains(canhan.Trim().ToLower()));
                    }

                    if (tgbatdau > 0 && tgketthuc > 0)
                    {
                        list = list.Where(x =>
                            x.NgayDangKy >= tgbatdau
                            && x.NgayDangKy <= tgketthuc
                        );
                    }

                    list = list.AsQueryable();
                    var totalRecords = list.Count();
                    var records = list.OrderByDescending(x => x.NgayDangKy)
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

        [HttpGet("timkiemtheo-tochuc")]
        public async Task<IActionResult> DanhSachTheoToChuc(string tochuc, int pageNumber, int pageSize)
        {
            try
            {
                var list = _htt_context.DangKyCapPhatBoSungDichVu
                    .Where(x => x.IsDeleted == false && x.DonVi.ToLower().Contains(tochuc.ToLower()))
                    .AsQueryable();
                var totalRecords = list.Count();
                var records = list
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
                var result = new
                {
                    TotalRecords = totalRecords,
                    PageSize = pageSize,
                    PageNumber = pageNumber,
                    Data = records

                };
                return Ok(new { data = result });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpGet("timkiemtheo-thoigian")]
        public async Task<IActionResult> DanhSachTheoThoiGian(long date, int pageSize, int pageNumber)
        {
            try
            {
                var list = _htt_context.DangKyCapPhatBoSungDichVu
                    .Where(x => x.IsDeleted == false && x.NgayBatDau <= date && date <= x.NgayKetThuc)
                    .AsQueryable();
                var totalRecords = list.Count();
                var records = list
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
                var result = new
                {
                    TotalRecords = totalRecords,
                    PageSize = pageSize,
                    PageNumber = pageNumber,
                    Data = records

                };
                return Ok(new { data = result });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpGet("timkiemtheo-theocanhan")]
        public async Task<IActionResult> DanhSachTheoCaNhan(string nguoidangki, int pageNumber, int pageSize)
        {
            try
            {
                var list = _htt_context.DangKyCapPhatBoSungDichVu
                    .Where(x => x.IsDeleted == false && x.NguoiDangKy.ToLower().Contains(nguoidangki.ToLower()))
                    .AsQueryable();
                var totalRecords = list.Count();
                var records = list
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
                var result = new
                {
                    TotalRecords = totalRecords,
                    PageSize = pageSize,
                    PageNumber = pageNumber,
                    Data = records

                };
                return Ok(new { data = result });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }

        [HttpGet("danhsachchuaduyet-phantrang")]
        public async Task<IActionResult> DanhSachChuaDuyetPhanTrang(int pageSize, int pageNumber)
        {
            try
            {
                var list = _htt_context.DangKyCapPhatBoSungDichVu
                    .Where(x => x.IsDeleted == false && x.Status == 1)
                    .AsQueryable();
                var totalRecords = list.Count();
                var records = list
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
                var result = new
                {
                    TotalRecords = totalRecords,
                    PageSize = pageSize,
                    PageNumber = pageNumber,
                    Data = records

                };
                return Ok(new { data = result });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { message = e.Message });
            }
        }
    }
}

