using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Spreadsheet;
using HTT.Api.Controllers;
using HTT.Api.Models;
using HTT.Api.Services;
using HTT.Api.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace HTT.Api.Extensions
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
                    string subject = "Thông báo lịch họp";
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
                    string subject = "Thông báo lịch họp";
                    return emailSender.SendEmailAsync(cf, to_email, subject, template, true);
                }
            }
            catch { throw; }
        }

        public static Task SendEmailAsync_Email_XacNhanPhongHop(this IEmailSender emailSender, email_config cf, string to_email,string don_vi,string roomplace ,string username, string link, string roomname, DateTime starttime, string roompassword)
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
                    template = template.Replace("%UNIT%", don_vi);
                    template = template.Replace("%ROOM_NAME%", roomname);
                    template = template.Replace("%ROOM_PLACE%", roomplace);
                    template = template.Replace("%ROOM_PASSWORD%", roompassword);
                    template = template.Replace("%START_TIME%", starttime.ToString("H:mm") + " ngày " + starttime.ToString("dd/MM/yyyy"));
                    template = template.Replace("%LINK%", HtmlEncoder.Default.Encode(link));
                    template = template.Replace("%CONTACT_PHONE%", cf.contact_mobile);
                    template = template.Replace("%CONTACT_EMAIL%", cf.contact_email);
                    string subject = "Thư mời tham gia cuộc họp";
                    return emailSender.SendEmailAsync(cf, to_email, subject, template, true);
                }
            }
            catch { throw; }
        }
        public static Task SendEmailAsync_Email_XacNhanPhongHopNONPASS(this IEmailSender emailSender, email_config cf, string to_email, string don_vi, string roomplace, string username, string link, string roomname, DateTime starttime )
        {
            try
            {
                string dir = Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
                string file = dir + @"/" + "EmailTemplateS" + @"/" + "EMAIL_XacnhanlichhopNONPASS_TEMPLATE.html";
                using (StreamReader reader = File.OpenText(file))
                {
                    string template = reader.ReadToEnd();
                    template = template.Replace("%EMAIL_NAME%", cf.email_name);
                    template = template.Replace("%USER_NAME%", username);
                    template = template.Replace("%UNIT%", don_vi);
                    template = template.Replace("%ROOM_NAME%", roomname);
                    template = template.Replace("%ROOM_PLACE%", roomplace);

                    template = template.Replace("%START_TIME%", starttime.ToString("H:mm")+" ngày "+starttime.ToString("dd/MM/yyyy"));
                    template = template.Replace("%LINK%", HtmlEncoder.Default.Encode(link));
                    template = template.Replace("%CONTACT_PHONE%", cf.contact_mobile);
                    template = template.Replace("%CONTACT_EMAIL%", cf.contact_email);
                    string subject = "Thư mời tham gia cuộc họp";
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
                    string subject = "Thông báo lịch họp";
                    return emailSender.SendEmailAsync(cf, to_email, subject, template, true);
                }
            }
            catch { throw; }
        }


        public static async Task<string> SendFinalMail_Email_XacNhanLichHoc(Meeting_Schedule schedule, string schedule_link, string Email,string don_vi ,QTHT_HTT_Context _context, HTT_Context _context1, IConfiguration _config, thong_tin_nguoi_dung user_guest)
        {
            try
            {
                var ChoPhepGuiEmailThongBao = _context.tl_ch_thongbaolichhop.Where(x => x.tencauhinh == "ChoPhepGuiEmailThongBao").OrderByDescending(k => k.CreatedDate).FirstOrDefault();

                var ChoPhepGuiSMSThongBao = _context.tl_ch_thongbaolichhop.Where(x => x.tencauhinh == "ChoPhepGuiSMSThongBao").OrderByDescending(k => k.CreatedDate).FirstOrDefault();



                if (user_guest == null)
                {
                    if (ChoPhepGuiEmailThongBao != null && ChoPhepGuiEmailThongBao.giatri == "1")
                    {
                        EmailSender sender = new EmailSender();
                        EmailSenderC senderC = new EmailSenderC(_context1, _config);
                        email_config email_cf = senderC.GetEmail_Config1();
                        string content = "";
                        string ket_qua = $"Kính gửi: {Email} \r\nChúng tôi mời bạn tham gia họp trực truyến!\r\nTên phòng họp: {schedule.Title}\r\nThời gian bắt đầu: {schedule.StartTime}\r\nĐịa điểm: Phòng họp trực tuyến \"{schedule.RoomName}\"\r\nLink phòng họp: {schedule_link}\r\nMật khẩu phòng họp:  {schedule.Password}";
                        content += Util.NonUnicode(ket_qua);
                        await sender.SendEmailAsync_Email_XacNhanPhongHop(email_cf, Email,don_vi, schedule.Place, Email, schedule_link, schedule.Title, schedule.StartTime, schedule.Password);
                    }
                }
                else
                {
                    string ket_qua = $"Kính gửi: {user_guest.ten_day_du} \r\nChúng tôi mời bạn tham gia họp trực truyến!\r\nTên phòng họp: {schedule.Title}\r\nThời gian bắt đầu: {schedule.StartTime}\r\nĐịa điểm: Phòng họp trực tuyến \"{schedule.RoomName}\"\r\nLink phòng họp: {schedule_link}\r\nMật khẩu phòng họp:  {schedule.Password}";
                    if (ChoPhepGuiEmailThongBao != null && ChoPhepGuiEmailThongBao.giatri == "1")
                    {
                        EmailSender sender = new EmailSender();
                        EmailSenderC senderC = new EmailSenderC(_context1, _config);
                        email_config email_cf = senderC.GetEmail_Config1();
                        if (!String.IsNullOrEmpty(schedule.Password))
                        {
                            await sender.SendEmailAsync_Email_XacNhanPhongHop(email_cf, Email, don_vi, schedule.Place, user_guest.ten_day_du, schedule_link, schedule.Title, schedule.StartTime, schedule.Password);
                        }
                        else
                        {
                            await sender.SendEmailAsync_Email_XacNhanPhongHopNONPASS(email_cf, Email, don_vi, schedule.Place, user_guest.ten_day_du, schedule_link, schedule.Title, schedule.StartTime);
                        }

                    }

                    if (ChoPhepGuiSMSThongBao != null && ChoPhepGuiSMSThongBao.giatri == "1")
                    {
                        string content = "";
                        content += Util.NonUnicode(ket_qua);
                        //var ht_sms = _context1.he_thong_sms.Where(x => x.kich_hoat == 1).FirstOrDefault();
                        var ht_sms = _context.tl_ch_dichvusms.Where(x=>x.tencauhinh == "Sms_Sender").OrderByDescending(k => k.CreatedDate).FirstOrDefault();
                        if (ht_sms == null)
                            return "Chưa kết nối hệ thống SMS";

                        var thong_tin_ob = JsonConvert.DeserializeObject<thong_tin_he_thong_sms>(ht_sms.giatri);
                        if (!Util.sendSMS(user_guest.so_dien_thoai, content, thong_tin_ob.api))
                            return "Gửi SMS thất bại";
                    }

                }

                return "Email and SMS sent successfully";
            }
            catch (Exception ex)
            {
                return $"An error occurred: {ex.Message}";
            }
        }

        public static async Task<string> SendFinalMail_Email_HuyLichHop(Meeting_Member member, QTHT_HTT_Context _context, HTT_Context _context1, IConfiguration _config, Meeting_Schedule schedule, string member_hoten, string member_phone)

        {
            try
            {
                var ChoPhepGuiEmailThongBao = _context.tl_ch_thongbaolichhop.Where(x => x.tencauhinh == "ChoPhepGuiEmailThongBao").OrderByDescending(k => k.CreatedDate).FirstOrDefault();

                var ChoPhepGuiSMSThongBao = _context.tl_ch_thongbaolichhop.Where(x => x.tencauhinh == "ChoPhepGuiSMSThongBao").OrderByDescending(k => k.CreatedDate).FirstOrDefault();

                if (member.UserId == 0 && !String.IsNullOrEmpty(member.Email))
                {
                    if (ChoPhepGuiEmailThongBao != null && ChoPhepGuiEmailThongBao.giatri == "1")
                    {
                        string ket_qua = $"Kính gửi: {member.Email} \r\nChúng tôi đã hủy lịch họp trực truyến!!\r\nTên phòng họp: {schedule.RoomName}\r\nThời gian bắt đầu: {schedule.StartTime}";
                        EmailSender sender = new EmailSender();
                        EmailSenderC senderC = new EmailSenderC(_context1, _config);
                        email_config email_cf = senderC.GetEmail_Config1();
                        sender.SendEmailAsync_Email_Huylichhop(email_cf, member.Email, member.Email, schedule.RoomName, schedule.StartTime);
                    }
                }
                else
                {
                    string ket_qua = $"Kính gửi: {member_hoten} \r\nChúng tôi đã hủy lịch họp trực truyến!!\r\nTên phòng họp: {schedule.RoomName}\r\nThời gian bắt đầu: {schedule.StartTime}";
                    if (ChoPhepGuiEmailThongBao != null && ChoPhepGuiEmailThongBao.giatri == "1")
                    {
                        EmailSender sender = new EmailSender();
                        EmailSenderC senderC = new EmailSenderC(_context1, _config);
                        email_config email_cf = senderC.GetEmail_Config1();
                        sender.SendEmailAsync_Email_Huylichhop(email_cf, member.Email, member_hoten, schedule.RoomName, schedule.StartTime);
                    }
                    if (ChoPhepGuiSMSThongBao != null && ChoPhepGuiSMSThongBao.giatri == "1")
                    {
                        //var ht_sms = _context1.he_thong_sms.Where(x => x.kich_hoat == 1).FirstOrDefault();
                        var ht_sms = _context.tl_ch_dichvusms.Where(x=>x.tencauhinh == "Sms_Sender").OrderByDescending(k => k.CreatedDate).FirstOrDefault();
                        string content = "";
                        if (ht_sms == null)
                        {
                            return "Chưa kết nối hệ thống sms";
                        }
                        var thong_tin_ob = JsonConvert.DeserializeObject<thong_tin_he_thong_sms>(ht_sms.giatri);
                        content += Util.NonUnicode(ket_qua);
                        if (!Util.sendSMS(member_phone, content, thong_tin_ob.api))
                            return "Gửi sms thất bại";
                    }
                }
                return "Email and SMS sent successfully";
            }
            catch (Exception ex)
            {
                return $"An error occurred: {ex.Message}";
            }

        }
    }
}
