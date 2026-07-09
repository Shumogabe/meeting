namespace HTT.Api.Models
{
    public class email_config
    {
        public string domain { get; set; }
        public string email_name { get; set; }
        public string email_smtp { get; set; }
        public int email_port { get; set; }
        public string email_ssl { get; set; }
        public string sender_user { get; set; }
        public string sender_email { get; set; }
        public string sender_password { get; set; }
        public string sender_app { get; set; }
        public string contact_name { get; set; }
        public string contact_address { get; set; }
        public string contact_mobile { get; set; }
        public string contact_email { get; set; }
    }
}