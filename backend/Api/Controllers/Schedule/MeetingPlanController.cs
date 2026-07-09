using Api;
using DocumentFormat.OpenXml.Drawing.Charts;
using HTT.Api.Helpers;
using HTT.Api.Models;
using HTT.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Data;
using System.Linq;

namespace HTT.Api.Controllers
{
    [Route("meeting/[controller]")]
    [ApiController]
    public class MeetingPlanController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly IConfiguration _configuration;

        public MeetingPlanController(IConfiguration configuration, QTHT_HTT_Context context)
        {
            _context = context;
            _configuration = configuration;
        }


        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối lập kế hoạch họp, hội thảo, hội nghị, hệ thống thêm mới kế hoạch họp, hội thảo, hội nghị và trả về thông báo thành công  
        /// </summary>
        /// <param name="model"></param>
        /// <returns>Trả về thông báo thêm kế hoạch họp thành công </returns>
        [HttpPost("InsertPlanSchedule")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult InsertPlanSchedule(Meeting_Plan_Insert model)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var don_vi_ten = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.ten).FirstOrDefault();

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var id = 0;

            var plan = new MeetingPlanContext().GetBySymbol(model.Symbol);

            if (plan.Id != Guid.Empty) return StatusCode(299, new { message = "Dữ liệu đã tồn tại trong hệ thống" });

            DateTime date = DateTime.Now;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@symbol", SqlDbType.NVarChar).Value = model.Symbol == default ? DBNull.Value : model.Symbol;
                        cmd.Parameters.Add("@abstract", SqlDbType.NVarChar).Value = model.Abstract == default ? DBNull.Value : model.Abstract;
                        cmd.Parameters.Add("@Content", SqlDbType.NVarChar).Value = model.Content == default ? DBNull.Value : model.Content;
                        cmd.Parameters.Add("@dateissued", SqlDbType.DateTime).Value = model.DateIssued == default ? DBNull.Value : model.DateIssued;
                        cmd.Parameters.Add("@agencyissued", SqlDbType.NVarChar).Value = model.AgencyIssued == default ? DBNull.Value : model.AgencyIssued;
                        cmd.Parameters.Add("@signer", SqlDbType.NVarChar).Value = model.Signer == default ? DBNull.Value : model.Signer;
                        cmd.Parameters.Add("@effectivedate", SqlDbType.DateTime).Value = model.EffectiveDate == default ? DBNull.Value : model.EffectiveDate;
                        cmd.Parameters.Add("@file", SqlDbType.NVarChar).Value = model.File == default ? DBNull.Value : model.File;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = model.Status == default ? default : model.Status;
                        cmd.Parameters.Add("@approveby", SqlDbType.NVarChar).Value = model.ApprovedBy == default ? DBNull.Value : model.ApprovedBy;
                        cmd.Parameters.Add("@belongtounit", SqlDbType.NVarChar).Value = don_vi_ten;
                        cmd.Parameters.Add("@CreatedDate", SqlDbType.DateTime).Value = date;
                        cmd.Parameters.Add("@CreatedBy", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@don_vi", SqlDbType.Int).Value = don_vi_id;
                        con.Open();
                        id = cmd.ExecuteNonQuery();

                        if (id < 0) return StatusCode(299, new { message = "Không thêm được kế hoạch họp" });
                    }
                }
                return Ok(new { data = id, message = "Thêm kế hoạch họp thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, message = e.ToString() });
            }
            if (id < 0)
            {
                return StatusCode(299, new { status = false, message = "Thêm kế hoạch họp không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Thêm kế hoạch họp thành công " });
            }
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối sửa kế hoạch họp, hội thảo, hội nghị, hệ thống cập nhật kế hoạch họp, hội thảo, hội nghị và trả về thông báo thành công
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns>Thông báo chỉnh sửa kế hoạch họp thành công </returns>
        [HttpPut("UpdatePlanSchedule")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult UpdatePlanSchedule(Meeting_Plan_Update model)
        {
            var i = 0;
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
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

                        if (i < 0) return StatusCode(299, new { message = "Không chỉnh sửa được kế hoạch họp" });
                    }
                }
                return Ok(new { data = i, message = "Chỉnh sửa kế hoạch họp thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, message = e.ToString() });
            }
            if (i < 0)
            {
                return StatusCode(299, new { status = false, message = "Chỉnh sửa kế hoạch họp không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Chỉnh sửa kế hoạch họp thành công " });
            }
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem thông tin chi tiết kế hoạch họp, hội thảo, hội nghị, hệ thống lấy thông tin chi tiết kế hoạch họp, hội thảo, hội nghị và trả về thông tin chi tiết kế hoạch họp, hội thảo, hội nghị
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Trả về thông tin chi tiết kế hoạch họp </returns>
        [HttpGet("GetPlanScheduleDetail")]
        //[Authorize]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetPlanScheduleDetail(Guid Id)
        {
            return Ok(new { status = true, data = new MeetingPlanContext().GetById(Id) });
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem thông tin chi tiết kế hoạch họp, hội thảo, hội nghị, hệ thống lấy thông tin chi tiết kế hoạch họp, hội thảo, hội nghị và trả về thông tin chi tiết kế hoạch họp, hội thảo, hội nghị
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Trả về thông tin chi tiết kế hoạch họp </returns>
        [HttpGet("GetPlanScheduleId")]
        //[Authorize]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetPlanScheduleId(Guid Id)
        {
            return Ok(new { status = true, data = new MeetingPlanContext().GetById(Id) });
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem thông tin chi tiết kế hoạch họp, hội thảo, hội nghị, hệ thống lấy thông tin chi tiết kế hoạch họp, hội thảo, hội nghị và trả về thông tin chi tiết kế hoạch họp, hội thảo, hội nghị
        /// </summary>
        /// <param name="symbol"></param>
        /// <returns>Trả về thông tin chi tiết kế hoạch họp </returns>
        [HttpGet("GetPlanBySymbol")]
        //[Authorize]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetPlanBySymbol(string symbol)
        {
            return Ok(new { status = true, data = new MeetingPlanContext().GetBySymbol(symbol) });
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối gửi duyệt kế hoạch họp, hội thảo, hội nghị, hệ thống cập nhật trạng thái duyệt kế hoạch họp, hội thảo, hội nghị và trả về thông báo thành công
        /// </summary>
        /// <param name="Id"></param>
        /// <returns>Trả về thông báo cập nhật trạng thái thành công </returns>
        [HttpPost("ApprovePlanSchedule")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult ApprovePlanSchedule(Guid Id)
        {

            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
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

                        if (id < 0) return StatusCode(299, new { message = "Lỗi khi phê duyệt kế hoạch lịch" });
                    }
                }
                return Ok(new { data = id, message = "Phê duyệt kế hoạch lịch thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, message = e.ToString() });
            }
            if (id < 0)
            {
                return StatusCode(299, new { status = false, message = "Duyệt kế hoạch họp không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Duyệt kế hoạch họp thành công " });
            }
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối gửi duyệt kế hoạch họp, hội thảo, hội nghị, hệ thống cập nhật trạng thái duyệt kế hoạch họp, hội thảo, hội nghị và trả về thông báo thành công
        /// </summary>
        /// <param name="Id"></param>
        /// <returns>Trả về thông báo cập nhật trạng thái thành công </returns>
        [HttpPost("UnApprovePlanSchedule")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult UnApprovePlanSchedule(Guid Id)
        {

            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
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

                        if (id < 0) return StatusCode(299, new { message = "Lỗi khi gửi duyệt kế hoạch lịch" });
                    }
                }
                return Ok(new { data = id, message = "Gửi duyệt kế hoạch lịch thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, message = e.ToString() });
            }
            if (id < 0)
            {
                return StatusCode(299, new { status = false, message = "Hủy phê duyệt kế hoạch họp không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Hủy phê duyệt kế hoạch họp thành công " });
            }
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối gửi duyệt kế hoạch họp, hội thảo, hội nghị, hệ thống cập nhật trạng thái duyệt kế hoạch họp, hội thảo, hội nghị và trả về thông báo thành công
        /// </summary>
        /// <param name="Id"></param>
        /// <returns>Trả về thông báo cập nhật trạng thái thành công </returns>
        [HttpPost("DraftPlanSchedule")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult DraftPlanSchedule(Guid Id)
        {

            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            var id = 0;
            DateTime date = DateTime.Now;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_Draft", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = Id;
                        con.Open();
                        id = cmd.ExecuteNonQuery();
                        if (id < 0) return StatusCode(299, new { message = "Lỗi khi hủy gửi duyệt kế hoạch lịch" });
                    }
                }
                return Ok(new { data = id, message = "Hủy gửi duyệt kế hoạch lịch thành công" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = 500, message = e.ToString() });
            }
            if (id < 0)
            {
                return StatusCode(299, new { status = false, message = "Gửi duyệt kế hoạch họp không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Gửi duyệt kế hoạch họp thành công " });
            }
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt, hệ thống lấy danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt và trả về danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt
        /// </summary>
        /// <returns>Danh sách kế hoạch họp chờ duyệt</returns>
        [HttpGet("ListPlanScheduleUnapproved")]
        [Authorize]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetListPlanScheduleUnapproved(int page, int pageSize, int create, string search, DateTime dateFrom, DateTime dateTo, bool isdeleted)
        {
            var page_size = _context.tl_ch_kehoach.Where(x=>x.tencauhinh == "SoLuongBanGhiLayRa").Select(x=>x.giatri).FirstOrDefault();
            if (page_size != null)
            {
                if (int.TryParse(page_size, out int result))
                {
                    pageSize = Convert.ToInt32(page_size);
                }
            }
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var data = new MeetingPlanContext().GetListUnapprovedSchedulePlan(page, pageSize, create, search, dateFrom, dateTo, isdeleted, don_vi_id);
            return Ok(new
            {
                status = true,
                data = data,
                total = data.Count()
            });
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt, hệ thống lấy danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt và trả về danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt
        /// </summary>
        /// <returns>Danh sách kế hoạch họp chờ duyệt</returns>
        [HttpGet("ListPlanUnapproved")]
        [Authorize]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetListPlanUnapproved(int page, int pageSize, string search, DateTime dateFrom, DateTime dateTo, bool isdeleted)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var data = new MeetingPlanContext().GetListUnapprovedPlan(page, pageSize, search, dateFrom, dateTo, isdeleted);
            return Ok(new
            {
                status = true,
                data = data,
                total = data.Count()
            });
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt, hệ thống lấy danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt và trả về danh sách kế hoạch họp, hội thảo, hội nghị đã duyệt
        /// </summary>
        /// <returns>Danh sách kế hoạch họp đã được duyệt </returns>
        [HttpGet("ListPlanScheduleApproved")]
        [Authorize]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetListPlanScheduleApproved(int page, int pageSize, int create, string search, DateTime dateFrom, DateTime dateTo, bool isdeleted)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var data = new MeetingPlanContext().GetListApprovedSchedulePlan(page, pageSize, create, search, dateFrom, dateTo, isdeleted, don_vi_id);
            return Ok(new
            {
                status = true,
                data = data,
                total = data.Count()
            });
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt, hệ thống lấy danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt và trả về danh sách kế hoạch họp, hội thảo, hội nghị đã duyệt
        /// </summary>
        /// <returns>Danh sách kế hoạch họp đã được duyệt </returns>
        [HttpGet("ListPlanApproved")]
        [Authorize]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetListPlanApproved(int page, int pageSize, string search, DateTime dateFrom, DateTime dateTo, bool isdeleted)
        {

            var data = new MeetingPlanContext().GetListApprovedPlan(page, pageSize, search, dateFrom, dateTo, isdeleted);
            return Ok(new
            {
                status = true,
                data = data,
                total = data.Count()
            });
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt, hệ thống lấy danh sách kế hoạch họp, hội thảo, hội nghị chờ duyệt và trả về danh sách kế hoạch họp, hội thảo, hội nghị đã duyệt
        /// </summary>
        /// <returns>Danh sách kế hoạch họp đã được duyệt </returns>
        [HttpGet("ListPlanScheduleDraft")]
        [Authorize]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SCHEDULE)]
        public IActionResult GetListPlanScheduleDraft(int page, int pageSize, int create, string search, DateTime dateFrom, DateTime dateTo, bool isdeleted)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var data = new MeetingPlanContext().GetListDraftSchedulePlan(page, pageSize, create, search, dateFrom, dateTo, isdeleted, don_vi_id);
            return Ok(new
            {
                status = true,
                data = data,
                total = data.Count()
            });
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối xem danh sách kế hoạch họp, hội thảo, hội nghị đã xóa, hệ thống lấy danh sách kế hoạch họp, hội thảo, hội nghị đã xóa và trả về danh sách kế hoạch họp, hội thảo, hội nghị đã xóa
        /// </summary>
        /// <returns>Danh sách kế hoạch họp đã xóa</returns>
        [HttpGet("ListPlanScheduleDeleted")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.SCHEDULE)]
        public IActionResult GetListPlanScheduleDeleted(int page, int pageSize, int create, string search, DateTime dateFrom, DateTime dateTo, bool isdeleted)
        {
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var data = new MeetingPlanContext().GetListPlanScheduleDeleted(page, pageSize, create, search, dateFrom, dateTo, don_vi_id);
            return Ok(new
            {
                status = true,
                data = data.List,
                total = data.Count
            });
        }

        /// <summary>
        /// Hệ thống khác gửi yêu cầu kết nối khôi phục kế hoạch họp, hội thảo, hội nghị, hệ thống khôi phục kế hoạch họp, hội thảo, hội nghị và trả về thông báo thành công
        /// </summary>
        /// <param name="id"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("Restore")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult Restore(Guid id)
        {
            var i = 0;
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var chuc_vu = _context.thong_tin_nguoi_dung
                  .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                  .Select(x => x.ma_chucvu)
                  .FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null || chuc_vu == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
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
                            return StatusCode(299, new { status = false, message = "Khôi phục kế hoạch họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Khôi phục kế hoạch họp thành công " });
                        }
                    }
                }
                return Ok(new { data = i, message = "Khôi phục kế hoạch họp thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }
        
        [HttpPost("IsPublished")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SCHEDULE)]
        public IActionResult IsPublished(Guid id)
        {
            var i = 0;
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var chuc_vu = _context.thong_tin_nguoi_dung
                  .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                  .Select(x => x.ma_chucvu)
                  .FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null || chuc_vu == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            DateTime date = DateTime.Now;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_IsPublished", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = date;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Công bố kế hoạch họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Công bố kế hoạch họp thành công " });
                        }
                    }
                }
                return Ok(new { data = i, message = "Công bố kế hoạch họp thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }

        [HttpDelete("Delete")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.SCHEDULE)]
        public IActionResult Delete(Guid id)
        {
            var i = 0;
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
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
                            return StatusCode(299, new { status = false, message = "Xóa kế hoạch họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa kế hoạch họp thành công " });
                        }
                    }
                }
                return Ok(new { data = i, message = "Xóa kế hoạch họp thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }

        [HttpDelete("Remove")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.SCHEDULE)]
        public IActionResult Remove(Guid id)
        {
            var i = 0;
            var user_current = User.FindFirst(new Constant(_configuration).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _configuration.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { Message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_Remove", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        cmd.Parameters.Add("@DeletedDate", SqlDbType.Date).Value = DateTime.Now;
                        cmd.Parameters.Add("@DeletedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Xóa kế hoạch họp không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa kế hoạch họp thành công " });
                        }
                    }
                }
                return Ok(new { data = i, message = "Xóa kế hoạch họp thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.ToString() });
            }
        }
    }
}
