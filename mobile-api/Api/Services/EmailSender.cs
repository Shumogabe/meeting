using QTHT.Api.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System;
using System.Threading.Tasks;

namespace QTHT.Api.Services
{
    public class EmailSender : IEmailSender
    {
        public Task SendEmailAsync(email_config cf, string email, string subject, string body, bool is_html)
        {
            try
            {
                // smtp của mailkit Dành cho gửi bằng exchange
                var message = new MimeMessage();
                message.From.Add(MailboxAddress.Parse(cf.sender_email));
                message.To.Add(MailboxAddress.Parse(email));
                message.Subject = subject;

                var builder = new BodyBuilder();
                builder.HtmlBody = body;
                message.Body = builder.ToMessageBody();

                using var smtp = new SmtpClient();
                int port = cf.email_port;
                smtp.Connect(cf.email_smtp, port, SecureSocketOptions.Auto);
                smtp.Authenticate(cf.sender_user, cf.sender_password);
                smtp.Send(message);
                smtp.Disconnect(true);

                return Task.CompletedTask;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
