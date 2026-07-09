using HTT.Api.Models;
using HTT.Api.Services;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Linq;

namespace HTT.Api.Controllers
{
    public class EmailSenderC
    {
        private readonly IConfiguration _configuration;
        private const string CONST_EMAIL_CONFIG = "email_config";
        private readonly HTT_Context _context;

        public EmailSenderC(HTT_Context context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        /// <summary>
        /// lấy email config từ appsettings.json
        /// </summary>
        /// <returns>email config</returns>
        public email_config GetEmail_Config()
        {
            try
            {
                email_config email_cf = new email_config();
                var config = _context.cau_hinh_he_thong.Where(x => x.su_dung == 1).FirstOrDefault();

                // lấy từ cấu hình
                if (config != null)
                {
                    var cf = JsonConvert.DeserializeObject<thong_so>(config.thong_so);
                    email_cf.contact_address = cf.email_config_detail.contact_address;
                    email_cf.contact_email = cf.email_config_detail.contact_email;
                    email_cf.contact_mobile = cf.email_config_detail.contact_mobile;
                    email_cf.contact_name = cf.email_config_detail.contact_name;
                    email_cf.domain = cf.email_config_detail.domain;
                    email_cf.email_name = cf.email_config_detail.email_name;
                    email_cf.email_port = cf.email_config_detail.email_port;
                    email_cf.email_smtp = cf.email_config_detail.email_smtp;
                    email_cf.email_ssl = cf.email_config_detail.email_ssl.ToString();
                    email_cf.sender_email = cf.email_config_detail.sender_email;
                    email_cf.sender_password = cf.email_config_detail.sender_password;
                    email_cf.sender_user = cf.email_config_detail.sender_user;
                    email_cf.sender_app = cf.email_config_detail.sender_app;

                }
                // lấy mặc định
                else
                {
                    var cf = _configuration.GetSection(CONST_EMAIL_CONFIG);
                    email_cf.contact_address = cf.GetValue<string>("contact_address");
                    email_cf.contact_email = cf.GetValue<string>("contact_email");
                    email_cf.contact_mobile = cf.GetValue<string>("contact_mobile");
                    email_cf.contact_name = cf.GetValue<string>("contact_name");
                    email_cf.domain = cf.GetValue<string>("domain");
                    email_cf.email_name = cf.GetValue<string>("email_name");
                    email_cf.email_port = cf.GetValue<int>("email_port");
                    email_cf.email_smtp = cf.GetValue<string>("email_smtp");
                    email_cf.email_ssl = cf.GetValue<string>("email_ssl");
                    email_cf.sender_email = cf.GetValue<string>("sender_email");
                    email_cf.sender_password = cf.GetValue<string>("sender_password");
                    email_cf.sender_user = cf.GetValue<string>("sender_user");
                    email_cf.sender_app = cf.GetValue<string>("sender_app");
                }
                return email_cf;
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// lấy email config từ appsettings.json
        /// </summary>
        /// <returns>email config</returns>
        public email_config GetEmail_Config1()
        {
            try
            {
                email_config email_cf = new email_config();
                //var config = _context.cau_hinh_he_thong.Where(x => x.su_dung == 1).FirstOrDefault();
                var config = _configuration.GetSection("CauHinh:HeThong:HeThong_mail").Get<CauHinhItem>();

                // lấy từ cấu hình
                if (config != null)
                {
                    var cf = JsonConvert.DeserializeObject<email_config>(config.giatri);

                    //var cf = JsonConvert.DeserializeObject<thong_so>(config.thong_so);
                    email_cf.contact_address = cf.contact_address;
                    email_cf.contact_email = cf.contact_email;
                    email_cf.contact_mobile = cf.contact_mobile;
                    email_cf.contact_name = cf.contact_name;
                    email_cf.domain = cf.domain;
                    email_cf.email_name = cf.email_name;
                    email_cf.email_port = cf.email_port;
                    email_cf.email_smtp = cf.email_smtp;
                    email_cf.email_ssl = cf.email_ssl.ToString();
                    email_cf.sender_email = cf.sender_email;
                    email_cf.sender_password = EncryptionHelper.Decrypt(cf.sender_user, cf.sender_password);
                    email_cf.sender_user = cf.sender_user;
                    email_cf.sender_app = cf.sender_app;

                }
                // lấy mặc định
                else
                {
                    var cf = _configuration.GetSection(CONST_EMAIL_CONFIG);
                    email_cf.contact_address = cf.GetValue<string>("contact_address");
                    email_cf.contact_email = cf.GetValue<string>("contact_email");
                    email_cf.contact_mobile = cf.GetValue<string>("contact_mobile");
                    email_cf.contact_name = cf.GetValue<string>("contact_name");
                    email_cf.domain = cf.GetValue<string>("domain");
                    email_cf.email_name = cf.GetValue<string>("email_name");
                    email_cf.email_port = cf.GetValue<int>("email_port");
                    email_cf.email_smtp = cf.GetValue<string>("email_smtp");
                    email_cf.email_ssl = cf.GetValue<string>("email_ssl");
                    email_cf.sender_email = cf.GetValue<string>("sender_email");
                    email_cf.sender_password = cf.GetValue<string>("sender_password");
                    email_cf.sender_user = cf.GetValue<string>("sender_user");
                    email_cf.sender_app = cf.GetValue<string>("sender_app");
                }
                return email_cf;
            }
            catch (Exception)
            {
                throw;
            }
        }

        ///// <summary>
        ///// POST: api/EmailSender/SendEmail_DoanhNghiep?appname=cscore_quantrac_spa
        ///// </summary>
        //[HttpPost]
        //[Route("SendEmail_DoanhNghiep")]

        //public async Task<IActionResult> SendEmail_DoanhNghiep([FromBody] List<Email_DoanhNghiep_Data> data, string appname)
        //{
        //    try
        //    {
        //        if (data == null || data.Count == 0)
        //            return StatusCode(299, "Không có dữ liệu.");
        //        //lay url app
        //        var app = _context.CSCore_Apps.Where(x => x.Code.Trim().ToLower() == appname.Trim().ToLower()).FirstOrDefault();
        //        foreach (var item in data)
        //        {
        //            var user = await _userManager.FindByIdAsync(item.userid);
        //            if (user == null) continue;
        //            //
        //            EmailSender sender = new EmailSender();
        //            email_config email_cf = GetEmail_Config();
        //            await sender.SendEmailAsync_Email_DoanhNghiep(email_cf, user.Email, user.UserName, app.PostLogoutRedirectUris.Trim(),item.subject, item.message);
        //        }
        //        return Ok(new { result = "Đã thực hiện thành công." });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, "Nội dung lỗi chi tiết: " + Environment.NewLine + ex.Message);
        //    }
        //}
    }
}