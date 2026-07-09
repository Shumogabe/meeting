using HTT.Api.Models;
using MimeKit;
using System.Threading.Tasks;

namespace HTT.Api.Services
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
