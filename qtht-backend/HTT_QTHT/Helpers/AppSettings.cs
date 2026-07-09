using HTT_QTHT.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace HTT_QTHT.Api.Helpers
{
    public class AppSettings
    {
        public string Secret { get; set; }
    }
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
    public class email_config_detail
    {
        public string contact_name { get; set; }
        public string contact_address { get; set; }
        public string contact_mobile { get; set; }
        public string contact_email { get; set; }
        public string domain { get; set; }
        public string email_name { get; set; }
        public string email_smtp { get; set; }
        public int email_port { get; set; }
        public bool email_ssl { get; set; }
        public string sender_user { get; set; }
        public string sender_email { get; set; }
        public string sender_password { get; set; }
        public string sender_app { get; set; }
    }
    public class wso2is_config
    {
        public string usr { get; set; }
        public string pw { get; set; }
    }
    public class wso2is_config_detail
    {
        public string usr { get; set; }
        public string pw { get; set; }
    }
    public class minio_config
    {
        public string domain { get; set; }
        public string bucket { get; set; }
        public string usr { get; set; }
        public string pw { get; set; }
    }
    public class minio_config_detail
    {
        public string domain { get; set; }
        public string bucket { get; set; }
        public string usr { get; set; }
        public string pw { get; set; }
    }

}


