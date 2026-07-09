using Api;
using HTT.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using QTHT.Api.Models;
using System;
using System.Data;
using System.Linq;
using System.Security.Claims;
using static QTHT.Api.Models.QTHT_HTT_Context;

namespace QTHT.Api.Controllers.MobileApi
{
    [Route("[controller]")]
    [ApiController]
    public class KeHoachHopController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly IConfiguration _configuration;
        private readonly HTT_Context _datacontext;
        public KeHoachHopController(QTHT_HTT_Context context, HTT_Context datacontext, IConfiguration configuration)
        {
            _datacontext = datacontext;
            _context = context;
            _configuration = configuration;
        }
        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối lập kế hoạch họp, hội thảo, hội nghị, hệ thống thêm mới kế hoạch họp, hội thảo, hội nghị và trả về thông báo thành công  
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Trả về thông báo thêm kế hoạch họp thành công </returns>
        [HttpPost("them")]
        [Authorize]
        public IActionResult InsertPlanSchedule(Meeting_Plan_Insert model)
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi
                .Where(x => x.ma == don_vi)
                .Select(x => x.Id)
                .FirstOrDefault();

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            Guid id = Guid.NewGuid();
            DateTime date = DateTime.Now;
            try
            {
                Meeting_Plan model1 = new Meeting_Plan();
                model1.Symbol = model.Symbol;
                model1.ApprovedBy = model.ApprovedBy;
                model1.Status = model.Status;
                model1.DateIssued = model.DateIssued;
                model1.AgencyIssued = model.AgencyIssued;
                model1.Signer = model.Signer;
                model1.EffectiveDate = model.EffectiveDate;
                model1.File = model.File;
                model1.Abstract = model.Abstract;
                model1.BelongToUnit = model.BelongToUnit;
                model1.Content = model.Content;
                model1.Id = id;
                model1.CreatedDate = date;
                model1.CreatedBy = user;
                model1.don_vi = don_vi_id;
                _datacontext.Meeting_Plan.Add(model1);
                _datacontext.SaveChanges();
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, message = e.Message });
            }
            return Ok(new { status = 200, data = id, message = "Thêm kế hoạch họp thành công" });
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối sửa kế hoạch họp, hội thảo, hội nghị, hệ thống cập nhật kế hoạch họp, hội thảo, hội nghị và trả về thông báo thành công
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns>Thông báo chỉnh sửa kế hoạch họp thành công </returns>
        [HttpPut("chinhsua")]
        [Authorize]
        public IActionResult UpdatePlanSchedule(Meeting_Plan_Update model)
        {
            var i = 0;
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var don_vi_id = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            DateTime date = DateTime.Now;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = model.Id;
                        cmd.Parameters.Add("@symbol", SqlDbType.NVarChar).Value = model.Symbol == default ? DBNull.Value : model.Symbol;
                        cmd.Parameters.Add("@abstract", SqlDbType.NVarChar).Value = model.Abstract == default ? DBNull.Value : model.Abstract;
                        cmd.Parameters.Add("@Content", SqlDbType.NVarChar).Value = model.Content == default ? DBNull.Value : model.Content;
                        cmd.Parameters.Add("@dateissued", SqlDbType.DateTime).Value = model.DateIssued == default ? DBNull.Value : model.DateIssued;
                        cmd.Parameters.Add("@agencyissued", SqlDbType.NVarChar).Value = model.AgencyIssued == default ? DBNull.Value : model.AgencyIssued;
                        cmd.Parameters.Add("@signer", SqlDbType.NVarChar).Value = model.Signer == default ? DBNull.Value : model.Signer;
                        cmd.Parameters.Add("@effectivedate", SqlDbType.DateTime).Value = model.EffectiveDate == default ? DBNull.Value : model.EffectiveDate;
                        cmd.Parameters.Add("@file", SqlDbType.NVarChar).Value = model.File == default ? DBNull.Value : model.File;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = model.Status == default ? default : model.Status;
                        cmd.Parameters.Add("@approvedby", SqlDbType.NVarChar).Value = model.ApprovedBy == default ? DBNull.Value : model.ApprovedBy;
                        cmd.Parameters.Add("@belongtounit", SqlDbType.NVarChar).Value = model.BelongToUnit == default ? DBNull.Value : model.BelongToUnit;
                        cmd.Parameters.Add("@ModifiedDate", SqlDbType.DateTime).Value = date;
                        cmd.Parameters.Add("@ModifiedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, message = e.Message });
            }
            if (i < 0)
            {
                return StatusCode(299, new { status = 299, message = "Chỉnh sửa kế hoạch họp không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = 200, message = "Chỉnh sửa kế hoạch họp thành công " });
            }
        }



        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem thông tin chi tiết kế hoạch họp, hội thảo, hội nghị, hệ thống lấy thông tin chi tiết kế hoạch họp, hội thảo, hội nghị và trả về thông tin chi tiết kế hoạch họp, hội thảo, hội nghị
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Trả về thông tin chi tiết kế hoạch họp </returns>
        [HttpGet("xemchitiet")]
        //[Authorize]
        public IActionResult GetPlanScheduleId(Guid Id)
        {
            return Ok(new { data = new MeetingPlanContext().GetById(Id) });
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem thông tin chi tiết kế hoạch họp, hội thảo, hội nghị, hệ thống lấy thông tin chi tiết kế hoạch họp, hội thảo, hội nghị và trả về thông tin chi tiết kế hoạch họp, hội thảo, hội nghị
        /// </summary>
        /// <param name="symbol"></param>
        /// <returns>Trả về thông tin chi tiết kế hoạch họp </returns>
        [HttpGet("xemchitiet(sovanban)")]
        //[Authorize]
        public IActionResult GetPlanBySymbol(string symbol)
        {
            return Ok(new { data = new MeetingPlanContext().GetBySymbol(symbol) });
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối gửi duyệt kế hoạch họp, hội thảo, hội nghị, hệ thống cập nhật trạng thái duyệt kế hoạch họp, hội thảo, hội nghị và trả về thông báo thành công
        /// </summary>
        /// <param name="Id"></param>
        /// <returns>Trả về thông báo cập nhật trạng thái thành công </returns>
        [HttpPut("xacnhan")]
        [Authorize]
        public IActionResult ApprovePlanSchedule(Guid Id)
        {

            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var don_vi_id = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            var id = 0;
            DateTime date = DateTime.Now;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_Approve", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = Id;
                        con.Open();
                        id = cmd.ExecuteNonQuery();
                    }

                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, message = e.Message });
            }
            if (id < 0)
            {
                return StatusCode(299, new { status = 299, message = "Phê duyệt kế hoạch họp không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = 200, message = "Phê duyệt kế hoạch họp thành công " });
            }
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối gửi hủy duyệt kế hoạch họp, hội thảo, hội nghị, hệ thống cập nhật trạng thái duyệt kế hoạch họp, hội thảo, hội nghị và trả về thông báo thành công
        /// </summary>
        /// <param name="Id"></param>
        /// <returns>Trả về thông báo cập nhật trạng thái thành công </returns>
        [HttpPut("huyxacnhan")]
        [Authorize]
        public IActionResult UnApprovePlanSchedule(Guid Id)
        {

            var user_current = User.FindFirst(ClaimTypes.Name).Value;
            var don_vi_id = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc);
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            var id = 0;
            DateTime date = DateTime.Now;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_UnApprove", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = Id;
                        con.Open();
                        id = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, message = e.Message });
            }
            if (id < 0)
            {
                return StatusCode(299, new { status = 299, message = "Gửi duyệt kế hoạch họp không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = 200, message = "Gửi duyệt kế hoạch họp thành công" });
            }
        }




        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt, hệ thống lấy danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt và trả về danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt
        /// </summary>
        /// <returns>Danh sách kế hoạch họp chờ duyệt</returns>
        [HttpGet("danhsachkhongduocduyet")]
        //[Authorize]
        public IActionResult GetListPlanScheduleUnapproved(int create, string search, DateTime dateFrom, DateTime dateTo, bool isdeleted, int pageNumber = 1, int pageSize = 10)
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc).FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.Id).FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            var data = new MeetingPlanContext().GetListUnapprovedSchedulePlan(pageNumber, pageSize, create, search, dateFrom, dateTo, isdeleted, don_vi_id);
            return Ok(new
            {
                data = data,
                total = data.Count()
            });
        }



        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt, hệ thống lấy danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt và trả về danh sách kế hoạch họp, hội thảo, hội nghị đã duyệt
        /// </summary>
        /// <returns>Danh sách kế hoạch họp đã được duyệt </returns>
        [HttpGet("danhsachdaduyet")]
        //[Authorize]
        public IActionResult GetListPlanScheduleApproved(int create, string search, DateTime dateFrom, DateTime dateTo, bool isdeleted, int pageNumber = 1, int pageSize = 10)
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc).FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.Id).FirstOrDefault();
            var data = new MeetingPlanContext().GetListApprovedSchedulePlan(pageNumber, pageSize, create, search, dateFrom, dateTo, isdeleted, don_vi_id);
            return Ok(new
            {
                data = data,
                total = data.Count()
            });
        }



        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt, hệ thống lấy danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt và trả về danh sách kế hoạch họp, hội thảo, hội nghị đã duyệt
        /// </summary>
        /// <returns>Danh sách kế hoạch họp đã được duyệt </returns>
        [HttpGet("danhsachchoduyet")]
        //[Authorize]
        public IActionResult GetListPlanScheduleDraft(int pageNumber, int pageSize, int create, string search, DateTime dateFrom, DateTime dateTo, bool isdeleted)
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc).FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.Id).FirstOrDefault();
            var data = new MeetingPlanContext().GetListDraftSchedulePlan(pageNumber, pageSize, create, search, dateFrom, dateTo, isdeleted, don_vi_id);
            return Ok(new
            {
                data = data,
                total = data.Count()
            });
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem danh sách kế hoạch họp, hội thảo, hội nghị đã xóa, hệ thống lấy danh sách kế hoạch họp, hội thảo, hội nghị đã xóa và trả về danh sách kế hoạch họp, hội thảo, hội nghị đã xóa
        /// </summary>
        /// <returns>Danh sách kế hoạch họp đã xóa</returns>
        [HttpGet("danhsachdaxoa")]
        //[Authorize]
        public IActionResult GetListPlanScheduleDeleted()
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc).FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.Id).FirstOrDefault();
            var data = new MeetingPlanContext().GetListPlanScheduleDeleted(don_vi_id);
            return Ok(new
            {
                data = data,
                total = data.Count()
            });
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối khôi phục kế hoạch họp, hội thảo, hội nghị, hệ thống khôi phục kế hoạch họp, hội thảo, hội nghị và trả về thông báo thành công
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("khoiphuc")]
        [Authorize]
        public IActionResult Restore(Guid id)
        {
            var i = 0;
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var don_vi_id = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            DateTime date = DateTime.Now;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_Restore", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = date;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = 299, message = "Khôi phục kế hoạch họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = 200, message = "Khôi kế hoạch họp thành công " });
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = ex.Message });
            }
        }

        [HttpDelete("xoahoantoan")]
        [Authorize]
        public IActionResult Delete(Guid id)
        {
            var i = 0;
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var don_vi_id = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc).FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            DateTime date = DateTime.Now;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_Delete", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = 299, message = "Không xóa được kế hoạch họp" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = 200, message = "Xóa kế hoạch họp thành công" });
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = ex.Message });
            }
        }

        [HttpDelete("xoa")]
        [Authorize]
        public IActionResult Remove(Guid id)
        {
            var i = 0;
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var don_vi_id = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            DateTime date = DateTime.Now;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_Remove", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@DeletedDate", SqlDbType.Date).Value = date;
                        cmd.Parameters.Add("@DeletedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = 299, message = "Không xóa được kế hoạch họp" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = 200, message = "Xóa kế hoạch họp thành công" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = 500, message = ex.Message });
            }
        }
    }
}

