using Api;
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
    public class MeetingTypeController : Controller
    {
        private readonly QTHT_HTT_Context _context;
        public IConfiguration _config { get; }
        public MeetingTypeController(IConfiguration Configuration, QTHT_HTT_Context context)
        {
            _context = context;
            _config = Configuration;
        }
        [HttpGet("GetAll")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.TYPE)]
        public IActionResult GetAllItem()
        {
            return Ok(new { data = new MeetingTypeContext().GetAll() });
        }

        [HttpPost("GetAllFilter")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.SERVER)]
        public IActionResult GetAllFilter(OptionFilter option)
        {
            var items = new MeetingTypeContext().GetAll(option);
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

        [HttpGet("GetById")]
        [ClaimRequirement(BaseRole.READ, ModuleHelper.TYPE)]
        public IActionResult GetItemById(int id)
        {
            return Ok(new { status = true,data = new MeetingTypeContext().GetById(id) });
        }

        [HttpPost("Insert")]
        [Authorize]
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.TYPE)]
        public IActionResult Insert(Meeting_Type_Insert model)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            var id = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Type_Insert", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
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
        [ClaimRequirement(BaseRole.CREATE, ModuleHelper.TYPE)]
        public IActionResult Update(int id, Meeting_Type_Update model)
        {
            var user_current = User.FindFirst(new Constant(_config).Nameidentifier()).Value;
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current.Replace("@" + _config.GetValue<string>("domain"), "") || x.email == user_current).Select(x => x.id).FirstOrDefault();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Type_Update", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        cmd.Parameters.Add("@title", SqlDbType.NVarChar).Value = model.Title == null ? DBNull.Value : model.Title;
                        cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = DateTime.Now;
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
        [ClaimRequirement(BaseRole.DELETE, ModuleHelper.TYPE)]
        public IActionResult Remove(int id)
        {
            var i = 0;
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Type_Remove", con))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        con.Open();
                        i = cmd.ExecuteNonQuery();
                        if (id < 0)
                        {
                            return StatusCode(299, new { status = false, message = "Xóa không thành công" });
                        }
                        else
                        {
                            return StatusCode(200, new { status = true, message = "Xóa thành công" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }
    }
}