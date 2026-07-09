using System;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;

namespace HTT.Api.Helpers
{
    public class EmailHelper
    {
        public static void SendEmail(string fromEmail, string password, string toEmail, string mailSubject, string mailBody, string filepath)
        {
            SmtpClient client = new SmtpClient();
            client.Host = "smtp.gmail.com";
            client.Port = 587;
            client.EnableSsl = true;
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential(fromEmail, password);
            client.Timeout = 60000; // 20s

            MailMessage mail = new MailMessage(fromEmail, toEmail);
            mail.Subject = mailSubject;
            mail.Body = mailBody;
            if (!string.IsNullOrEmpty(filepath))
            {
                mail.Attachments.Add(new Attachment(filepath));
            }
            mail.BodyEncoding = UTF8Encoding.UTF8;
            mail.IsBodyHtml = true;

            client.Send(mail);
        }
        public bool SendEmailPasswordReset(string userEmail, string link)
        {
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("care@yogihosting.com");
            mailMessage.To.Add(new MailAddress(userEmail));

            mailMessage.Subject = "Password Reset";
            mailMessage.IsBodyHtml = true;
            mailMessage.Body = link;

            SmtpClient client = new SmtpClient();
            client.Credentials = new System.Net.NetworkCredential("info@rainpuddleslabradoodles.com", "Mydoodles!");
            client.Host = "smtpout.secureserver.net";
            client.Port = 80;

            try
            {
                client.Send(mailMessage);
                return true;
            }
            catch 
            {
                // log exception
            }
            return false;
        }

        public bool SendEmailTwoFactorCode(string userEmail, string code)
        {
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("care@yogihosting.com");
            mailMessage.To.Add(new MailAddress(userEmail));

            mailMessage.Subject = "Two Factor Code";
            mailMessage.IsBodyHtml = true;
            mailMessage.Body = code;

            SmtpClient client = new SmtpClient();
            client.Credentials = new System.Net.NetworkCredential("info@rainpuddleslabradoodles.com", "Mydoodles!");
            client.Host = "smtpout.secureserver.net";
            client.Port = 80;

            try
            {
                client.Send(mailMessage);
                return true;
            }
            catch 
            {
                // log exception
            }
            return false;
        }
        public static bool Validdate(string email)
        {
            try
            {
                Regex regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
                Match match = regex.Match(email);

                return match.Success;
            }
            catch (FormatException)
            {
                Regex regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
                Match match = regex.Match(email);

                return match.Success;
            }
        }
    }
}
