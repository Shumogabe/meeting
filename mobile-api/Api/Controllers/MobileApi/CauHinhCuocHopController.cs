using Api;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using QTHT.Api.Models;
using QTHT.Api.Models.database.Meeting.Option;
using System;
using System.Data;
using System.Linq;
using System.Security.Claims;
using static QTHT.Api.Models.QTHT_HTT_Context;

namespace QTHT.Api.Controllers.MobileApi
{
    [Route("[controller]")]
    [Authorize]
    [ApiController]
    public class CauHinhCuocHopController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _datacontext;
        public CauHinhCuocHopController(IConfiguration configuration, QTHT_HTT_Context context, HTT_Context datacontext)
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
        [Authorize]
        public IActionResult Insert(Meeting_Option_Insert model)
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
                Meeting_Option model1 = new Meeting_Option
                {
                    label_en = model.label_en,
                    label_vn = model.label_vn,
                    status = model.status,
                    value = model.value,
                    id = id,
                    IsDeleted = false,
                    CreatedBy = user,
                    CreatedDate = date
                };
                _datacontext.Meeting_Option.Add(model1);
                _datacontext.SaveChanges();
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }

            // Return success response
            return Ok(new { status = true, data = id, message = "Thêm cấu hình cuộc họp thành công" });
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Option_Delete", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@deleteddate", SqlDbType.DateTime).Value = date;
                        cmd.Parameters.Add("@deletedby", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Không xóa được cấu hình họp" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa cấu hình họp thành công " });
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
        public IActionResult Update(Meeting_Option_Update model)
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
                    using (SqlCommand cmd = new SqlCommand("Meeting_Option_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = model.Id;
                        cmd.Parameters.Add("@label_vn", SqlDbType.NVarChar).Value = model.label_vn == null ? DBNull.Value : model.label_vn;
                        cmd.Parameters.Add("@label_en", SqlDbType.NVarChar).Value = model.label_en == null ? DBNull.Value : model.label_en;
                        cmd.Parameters.Add("@status", SqlDbType.Bit).Value = model.status;
                        cmd.Parameters.Add("@value", SqlDbType.NVarChar).Value = model.value == default ? DBNull.Value : model.value;
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
            return Ok(new { status = true, data = new MeetingOptionContext().GetAll(search, dateFrom, dateTo) });
        }


        [HttpGet("chitiet")]
        public IActionResult GetItemById(Guid id)
        {
            return Ok(new { status = true, data = new MeetingOptionContext().GetById(id) });
        }
        [HttpGet("laytheoten")]
        public IActionResult GetItemByName(string name)
        {
            return Ok(new { status = true, data = new MeetingOptionContext().GetByName(name) });
        }
        #endregion
    }
}