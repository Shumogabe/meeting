using QTHT.Api.Models;
using QTHT.Api.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace QTHT.Api.Extensions
{
    public static class EmailSenderExtensions
    {
        public static Task SendEmailAsync_Email_ThongBao(this IEmailSender emailSender, email_config cf, string to_email, string username, string email_content)
        {
            try
            {
                string dir = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
                string file = dir + @"/" + "EmailTemplateS" + @"/" + "EMAIL_ThongBao.html";
                using (StreamReader reader = File.OpenText(file))
                {
                    string template = reader.ReadToEnd();
                    template = template.Replace("%EMAIL_NAME%", cf.email_name);
                    template = template.Replace("%USER_NAME%", username);
                    template = template.Replace("%EMAIL_CONTENT%", email_content);
                    template = template.Replace("%CONTACT_NAME%", cf.contact_name);
                    template = template.Replace("%CONTACT_ADDRESS%", cf.contact_address);
                    template = template.Replace("%CONTACT_MOBILE%", cf.contact_mobile);
                    template = template.Replace("%CONTACT_EMAIL%", cf.contact_email);
                    string subject = "Thông báo kết quả";
                    return emailSender.SendEmailAsync(cf, to_email, subject, template, true);
                }
            }
            catch { throw; }
        }
        public static Task SendEmailAsync_Email_XacNhanDangKy(this IEmailSender emailSender, email_config cf, string to_email, string username, string link, string email_content)
        {
            try
            {
                string dir = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
                string file = dir + @"/" + "EmailTemplateS" + @"/" + "EMAIL_XacNhanDangKy_MAIL_TEMPLATE.html";
                using (StreamReader reader = File.OpenText(file))
                {
                    string template = reader.ReadToEnd();
                    template = template.Replace("%EMAIL_NAME%", cf.email_name);
                    template = template.Replace("%USER_NAME%", username);
                    template = template.Replace("%EMAIL_CONTENT%", email_content);
                    template = template.Replace("%LINK%", HtmlEncoder.Default.Encode(link));
                    template = template.Replace("%CONTACT_NAME%", cf.contact_name);
                    template = template.Replace("%CONTACT_ADDRESS%", cf.contact_address);
                    template = template.Replace("%CONTACT_MOBILE%", cf.contact_mobile);
                    template = template.Replace("%CONTACT_EMAIL%", cf.contact_email);
                    string subject = "Thông báo kết quả";
                    return emailSender.SendEmailAsync(cf, to_email, subject, template, true);
                }
            }
            catch { throw; }
        }

        public static Task SendEmailAsync_Email_XacNhanPhongHop(this IEmailSender emailSender, email_config cf, string to_email, string username, string link, string roomname, DateTime starttime, string roompassword)
        {
            try
            {
                string dir = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
                string file = dir + @"/" + "EmailTemplateS" + @"/" + "EMAIL_Xacnhanlichhop_TEMPLATE.html";
                using (StreamReader reader = File.OpenText(file))
                {
                    string template = reader.ReadToEnd();
                    template = template.Replace("%EMAIL_NAME%", cf.email_name);
                    template = template.Replace("%USER_NAME%", username);
                    template = template.Replace("%ROOM_NAME%",roomname);
                    template = template.Replace("%ROOM_PASSWORD%", roompassword);
                    template = template.Replace("%START_TIME%", starttime.ToString());
                    template = template.Replace("%LINK%", HtmlEncoder.Default.Encode(link));
                    template = template.Replace("%CONTACT_PHONE%", cf.contact_mobile);
                    template = template.Replace("%CONTACT_EMAIL%", cf.contact_email);
                    string subject = "Thông báo kết quả";
                    return emailSender.SendEmailAsync(cf, to_email, subject, template, true);
                }
            }
            catch { throw; }
        }


        public static Task SendEmailAsync_Email_Huylichhop(this IEmailSender emailSender, email_config cf, string to_email, string username, string roomname, DateTime starttime)
        {
            try
            {
                string dir = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
                string file = dir + @"/" + "EmailTemplateS" + @"/" + "EMAIL_Huylichhop_TEMPLATE.html";
                using (StreamReader reader = File.OpenText(file))
                {
                    string template = reader.ReadToEnd();
                    template = template.Replace("%EMAIL_NAME%", cf.email_name);
                    template = template.Replace("%USER_NAME%", username);
                    template = template.Replace("%ROOM_NAME%", roomname);
                    template = template.Replace("%START_TIME%", starttime.ToString());
                    template = template.Replace("%CONTACT_PHONE%", cf.contact_mobile);
                    template = template.Replace("%CONTACT_EMAIL%", cf.contact_email);
                    string subject = "Thông báo kết quả";
                    return emailSender.SendEmailAsync(cf, to_email, subject, template, true);
                }
            }
            catch { throw; }
        }
    }
}
