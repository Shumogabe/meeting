using HTT.Api.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MimeKit;
using System;

namespace HTT.Api.Controllers
{
    //[Authorize]
    [Route("meeting/[controller]")]
    [ApiController]
    public class MeetingSendMailController : Controller
    {
        private IConfiguration _config { get; }
        public MeetingSendMailController(IConfiguration Configuration)
        {
            _config = Configuration;
        }

        //NOT TO USE
        //[HttpGet("GetAll")]
        //[ClaimRequirement(BaseRole.READ, ModuleHelper.SENDMAIL)]
        //public IActionResult GetAllItem()
        //{
        //    return Ok(new { data = new MeetingSendMailContext().GetAll() });
        //}

        //[HttpGet("GetById")]
        //[ClaimRequirement(BaseRole.READ, ModuleHelper.SENDMAIL)]
        //public IActionResult GetItemById(int id)
        //{
        //    return Ok(new { data = new MeetingSendMailContext().GetById(id) });
        //}

        //[HttpPost("GetAllFilter")]
        //[ClaimRequirement(BaseRole.READ, ModuleHelper.SENDMAIL)]
        //public IActionResult GetAllFilter(OptionFilter option)
        //{
        //    var items = new MeetingSendMailContext().GetAll(option);
        //    if (items.Count > 0)
        //    {
        //        var totalpage = (int)(items.FirstOrDefault().TotalRecord / option.PageSize);
        //        return Ok(new { data = items, totalcount = items.FirstOrDefault().TotalRecord, totalpage = totalpage, currentpage = option.PageNumber, nextpage = totalpage > option.PageNumber ? option.PageNumber + 1 : option.PageNumber, prevouspage = option.PageNumber > 1 ? option.PageNumber - 1 : 1, pagesize = option.PageSize });
        //    }
        //    else
        //    {
        //        return Ok(new { state = false, message = "Thông báo, không truy vấn được dữ liệu" });
        //    }
        //}

        //[HttpPost("Insert")]
        //[ClaimRequirement(BaseRole.CREATE, ModuleHelper.SENDMAIL)]
        //public IActionResult Insert(SendMailCreate model)
        //{
        //    var id = 0;
        //    try
        //    {
        //        using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
        //        {
        //            using (SqlCommand cmd = new SqlCommand("Meeting_SendMail_Insert", con))
        //            {
        //                cmd.CommandType = System.Data.CommandType.StoredProcedure;
        //                cmd.Parameters.Add("@email", SqlDbType.NVarChar).Value = model.Email == null ? DBNull.Value : model.Email;
        //                cmd.Parameters.Add("@password", SqlDbType.NVarChar).Value = model.Password == default ? DBNull.Value : model.Password;
        //                cmd.Parameters.Add("@default", SqlDbType.Bit).Value = model.Default == default ? DBNull.Value : model.Default;
        //                cmd.Parameters.Add("@createddate", SqlDbType.DateTime).Value = model.CreatedDate == default ? DBNull.Value : model.CreatedDate;
        //                cmd.Parameters.Add("@createdby", SqlDbType.Int).Value = model.CreatedBy == 0 ? DBNull.Value : model.CreatedBy;
        //                con.Open();
        //                id = cmd.ExecuteNonQuery();
        //            }
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        return Ok(new { data = id, message = e.Message });
        //    }
        //    return Ok(new { data = id, message = id > 0 ? "Thêm nội dung thành công" : "Không thêm được nội dung" });

        //}

        //[HttpPost("Update")]
        //[ClaimRequirement(BaseRole.CREATE, ModuleHelper.SENDMAIL)]
        //public IActionResult Update(int id, SendMailUpdate model)
        //{
        //    try
        //    {
        //        using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
        //        {
        //            using (SqlCommand cmd = new SqlCommand("Meeting_SendMail_Update", con))
        //            {
        //                cmd.CommandType = System.Data.CommandType.StoredProcedure;
        //                cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
        //                cmd.Parameters.Add("@email", SqlDbType.NVarChar).Value = model.Email == null ? DBNull.Value : model.Email;
        //                cmd.Parameters.Add("@password", SqlDbType.NVarChar).Value = model.Password == default ? DBNull.Value : model.Password;
        //                cmd.Parameters.Add("@default", SqlDbType.Bit).Value = model.Default == default ? DBNull.Value : model.Default;
        //                cmd.Parameters.Add("@modifieddate", SqlDbType.DateTime).Value = model.ModifiedDate == default ? DBNull.Value : model.ModifiedDate;
        //                cmd.Parameters.Add("@modifiedby", SqlDbType.Int).Value = model.ModifiedBy == 0 ? DBNull.Value : model.ModifiedBy;
        //                con.Open();
        //                id = cmd.ExecuteNonQuery();
        //            }
        //        }
        //    }
        //    catch (Exception e)
        //    {
        //        return Ok(new { data = id, message = e.Message });
        //    }
        //    return Ok(new { data = id, message = id > 0 ? "Cập nhật nội dung thành công" : "Không cập nhật được nội dung" }); 

        //}

        //[HttpPost("Remove")]
        //[ClaimRequirement(BaseRole.DELETE, ModuleHelper.SENDMAIL)]
        //public IActionResult Remove(int id)
        //{
        //    var i = 0;
        //    try
        //    {
        //        using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
        //        {
        //            using (SqlCommand cmd = new SqlCommand("Meeting_SendMail_Remove", con))
        //            {
        //                cmd.CommandType = System.Data.CommandType.StoredProcedure;
        //                cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
        //                con.Open();
        //                i = cmd.ExecuteNonQuery();
        //                return Ok(new { data = i, message = i > 0 ? "Xóa thành công" : "Khống xóa được dữ liệu" });
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return Ok(new { data = i, message = ex.ToString() });
        //    }

        //}

        [HttpPost("SendMail")]
        [Authorize]
        public IActionResult SendMail(SendMail model)
        {

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_config["SendMail:Meeting:From"] + " <" + _config["SendMail:Meeting:FromMail"] + "@" + _config["SendMail:Meeting:DomainName"] + ">"));
            email.To.Add(MailboxAddress.Parse(model.To));
            email.Subject = model.Sub;

            var builder = new BodyBuilder();
            builder.HtmlBody = model.Body;
            email.Body = builder.ToMessageBody();
            //email.Body = new TextPart(TextFormat.Html) { Text = model.Body };

            using var smtp = new SmtpClient();
            smtp.Connect(_config["SendMail:Meeting:Host"], Convert.ToInt32(_config["SendMail:Meeting:Port"]), SecureSocketOptions.None);
            smtp.Authenticate(_config["SendMail:Meeting:FromMail"], _config["SendMail:Meeting:Password"]);
            smtp.Send(email);
            smtp.Disconnect(true);
            return Ok();
        }
    }
}
