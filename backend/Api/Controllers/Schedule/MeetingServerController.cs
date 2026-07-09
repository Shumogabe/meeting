using Api;
using HTT.Api.Helpers;
using HTT.Api.Models;
using HTT.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace HTT.Api.Controllers
{
    [Route("meeting/[controller]")]
    [ApiController]
    public class MeetingServerController : Controller
    {
        private readonly QTHT_HTT_Context _context;
        public IConfiguration _config { get; }
        public MeetingServerController(IConfiguration Configuration, QTHT_HTT_Context context)
        {
            _context = context;
            _config = Configuration;
        }

        [HttpGet("GetAll")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SERVER)]
        public IActionResult GetAllItem()
        {
            return Ok(new { status = true, data = new MeetingServerContext().GetAll() });
        }

        [HttpGet("GetById")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SERVER)]
        public IActionResult GetItemById(int id)
        {
            return Ok(new { status = true, data = new MeetingServerContext().GetById(id) });
        }

        [HttpGet("GetByDefault")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SERVER)]
        public IActionResult GetByDefault()
        {
            return Ok(new { status = true, data = new MeetingServerContext().GetByDefault() });
        }

        [HttpPost("GetAllFilter")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SERVER)]
        public IActionResult GetAllFilter(OptionFilter option)
        {
            var items = new MeetingServerContext().GetAll(option);
            if (items.Count > 0)
            {
                var totalpage = (int)(items.FirstOrDefault().TotalRecord / option.PageSize);
                return Ok(new { data = items, totalcount = items.FirstOrDefault().TotalRecord, totalpage = totalpage, currentpage = option.PageNumber, nextpage = totalpage > option.PageNumber ? option.PageNumber + 1 : option.PageNumber, prevouspage = option.PageNumber > 1 ? option.PageNumber - 1 : 1, pagesize = option.PageSize });
            }
            else
            {
                return Ok(new { state = false, message = "Thông báo, không truy vấn được dữ liệu" });
            }
        }

        [HttpPost("Insert")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.SERVER)]
        public IActionResult Insert(Meeting_Server_Insert model)
        {
            var id = 0;
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var don_vi = _context.thong_tin_nguoi_dung
                 .Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current)
                 .Select(x => x.ma_tochuc)
                 .FirstOrDefault();
            var don_vi_id = _context.thong_tin_don_vi.Where(x => x.ma == don_vi).Select(x => x.id).FirstOrDefault();

            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            if (don_vi == null)
            {
                return StatusCode(299, new { status = false, message = "Thiếu thông tin đơn vị, yêu cầu bổ sung" });
            }
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Server_Insert", con))
                    {
                        List<Meeting_Server> list = new MeetingServerContext().GetAll();
                        foreach (var c in list)
                        {
                            if (c.IP == model.IP)
                            {
                                return StatusCode(299, "Không được trùng IP Server");
                            }
                        }

                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@IP", SqlDbType.NVarChar).Value = model.IP == default ? DBNull.Value : model.IP;
                        cmd.Parameters.Add("@activated", SqlDbType.Bit).Value = model.Activated;
                        cmd.Parameters.Add("@default", SqlDbType.Bit).Value = model.Default;
                        cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = model.CreatedDate == default ? DBNull.Value : model.CreatedDate;
                        cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = user;
                        con.Open();
                        id = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }
            if (id < 0)
            {
                return StatusCode(299, new { status = false, message = "Thêm nội dung không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Thêm nội dung thành công" });
            }

        }

        [HttpPost("Update")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.SERVER)]
        public IActionResult Update(int id, Meeting_Server_Update model)
        {
            var i = 0;
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
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Server_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == default ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@IP", SqlDbType.NVarChar).Value = model.IP == default ? DBNull.Value : model.IP;
                        cmd.Parameters.Add("@activated", SqlDbType.Bit).Value = model.Activated;
                        cmd.Parameters.Add("@default", SqlDbType.Bit).Value = model.Default;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        con.Open();
                        id = cmd.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e)
            {
                return StatusCode(500, new { status = false, message = e.Message });
            }
            if (id < 0)
            {
                return StatusCode(299, new { status = false, message = "Cập nhật nội dung không thành công" });
            }
            else
            {
                return StatusCode(200, new { status = true, message = "Cập nhật nội dung thành công" });
            }

        }

        [HttpPost("Remove")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.SERVER)]
        public IActionResult Remove(int id)
        {
            var i = 0;
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
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Server_Remove", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        cmd.Parameters.Add("@deletedBy", SqlDbType.Int).Value = user;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Cập nhật nội dung không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Cập nhật nội dung thành công" });
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
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost("Delete")]
        [Authorize]
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.SERVER)]
        public IActionResult Delete(int id)
        {
            var i = 0;
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
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Server_Delete", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;

                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Cập nhật nội dung không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Cập nhật nội dung thành công" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }

        }

        [HttpPost("Restore")]
        [Authorize]
        [ClaimRequirement(BaseRole.EDIT, ModuleHelper.SERVER)]
        public IActionResult Restore(int id)
        {
            var i = 0;
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
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Server_Restore", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = user;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.Int).Value = DateTime.Now;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (i < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Khôi phục nội dung không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Khôi phục nội dung thành công" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Ok(new { data = i, message = ex.ToString() });
            }

        }
    }
}
