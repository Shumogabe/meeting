using Api;
using HTT.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using QTHT.Api.Models.database.Meeting.Support;
using System;
using System.Data;
using System.Linq;
using System.Security.Claims;

namespace QTHT.Api.Controllers.MobileApi
{
    [Route("meeting/[controller]")]
    [ApiController]
    public class MeetingSupportController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _datacontext;
        public MeetingSupportController(IConfiguration configuration, QTHT_HTT_Context context, HTT_Context datacontext)
        {
            _configuration = configuration;
            _context = context;
            _datacontext = datacontext;
        }

        #region

        /// <summary>
        /// Người chủ trì, Thư ký, Đại biểu, Khách mời có thể thêm thông tin cấu hình trên mobile, hệ thống thêm mới cấu hình và thông báo thành công
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Thông báo thêm cấu hình mobile thành công</returns>
        [HttpPost("them")]
        public IActionResult Insert(Meeting_Support_Insert model)
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var ma_tochuc = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();

            var user = _context.thong_tin_nguoi_dung
                .Where(x => x.ten_dangnhap == user_current)
                .Select(x => x.id)
                .FirstOrDefault();

            DateTime date = DateTime.Now;

            Guid id = Guid.NewGuid();

            try
            {
                Meeting_Support model1 = new Meeting_Support
                {
                    Mail = model.Mail ?? "",
                    DienThoai = model.DienThoai ?? "",
                    NoiDung = model.NoiDung,
                    TacGia = model.TacGia ?? "",
                    NgayDang = DateTime.Now,
                    TraLoi = model.TraLoi ?? "",
                    id = id,
                    IsDeleted = false,
                    CreatedBy = user,
                    CreatedDate = date
                };
                _datacontext.Meeting_Support.Add(model1);
                _datacontext.SaveChanges();
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }

            // Return success response
            return Ok(new { status = true, data = id, message = "Thêm thành công" });
        }


        /// <summary>
        /// Người chủ trì, Thư ký, Đại biểu, Khách mời có thể chọn xóa thông tin cấu hình trên mobile, hệ thống xóa cáu hình và thông báo thành công
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns>Thông báo xóa cấu hình mobile thành công</returns>
        [HttpDelete("xoa")]
        public IActionResult Delete(Guid id)
        {

            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var ma_tochuc = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            var i = 0;
            DateTime date = DateTime.Now;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Support_Delete", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@deleteddate", SqlDbType.DateTime).Value = date;
                        cmd.Parameters.Add("@deletedby", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Không xóa được" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa thành công " });
                        }


                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Người chủ trì, Thư ký, Đại biểu, Khách mờicó thể chọn sửa thông tin cấu hình trên mobile, hệ thống sửa thông tin cấu hình và thông báo thành công	
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns>Thông báo sửa cấu hình mobile thành công</returns>
        [HttpPut("chinhsua")]
        public IActionResult Update(Meeting_Support_Update model)
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var ma_tochuc = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            DateTime date = DateTime.Now;
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Support_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = model.id;
                        cmd.Parameters.Add("@Mail", SqlDbType.NVarChar).Value = model.Mail == null ? DBNull.Value : model.Mail;
                        cmd.Parameters.Add("@DienThoai", SqlDbType.NVarChar).Value = model.DienThoai == null ? DBNull.Value : model.DienThoai;
                        cmd.Parameters.Add("@NoiDung", SqlDbType.NVarChar).Value = model.NoiDung == null ? DBNull.Value : model.NoiDung;
                        cmd.Parameters.Add("@TacGia", SqlDbType.NVarChar).Value = model.TacGia == null ? DBNull.Value : model.TacGia;
                        cmd.Parameters.Add("@NgayDang", SqlDbType.DateTime).Value = model.NgayDang == default ? DBNull.Value : model.NgayDang;
                        cmd.Parameters.Add("@TraLoi", SqlDbType.NVarChar).Value = model.TraLoi == default ? DBNull.Value : model.TraLoi;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = date;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });

            }
            if (i < 0)
            {
                return StatusCode(299, new { status = false, message = "Không chỉnh sửa được thông tin cấu hình họp" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Chỉnh sửa thông tin cấu hình họp thành công " });
            }
        }

        /// <summary>
        /// Người chủ trì, Thư ký, Đại biểu, Khách mời có thể chọn xem danh sách thông tin cấu hình trên mobile, hệ thống lấy danh sách cấu hình và hiển thị danh sách thông tin cấu hình trên mobile
        /// </summary>
        /// <param name="strSearch"></param>
        /// <param name="dateFrom"></param>
        /// <param name="dateTo"></param>
        /// <returns></returns>
        [HttpGet("danhsach")]
        public IActionResult GetAll(string search, DateTime dateFrom, DateTime dateTo)
        {
            return Ok(new { status = true, data = new MeetingSupportContext().GetAll(search, dateFrom, dateTo) });
        }


        [HttpGet("chitiet")]
        public IActionResult GetItemById(Guid id)
        {
            return Ok(new { status = true, data = new MeetingSupportContext().GetById(id) });
        }

        #endregion
    }
}
