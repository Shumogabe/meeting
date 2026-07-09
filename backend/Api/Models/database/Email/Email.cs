namespace HTT.Api.Models
{
    public class Email
    {
        public string Host { get; set; }
        public string Port { get; set; }
        public string SenderMail { get; set; }
        public string SenderMailPassword { get; set; }
        public string ReceiveMail { get; set; }
        public string MailHead { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string FilePath { get; set; }
    }
}
