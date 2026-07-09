using MimeKit;
using QTHT.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QTHT.Api.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(email_config cf, string email, string subject, string body, bool is_html);
    }
    public interface IEmailSenders
    {
        Task SendEmailAsyncs(email_config cf, InternetAddressList email, string subject, string body, bool is_html);
    }
}
