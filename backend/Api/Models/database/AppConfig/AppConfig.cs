using System;

namespace HTT.Api.Models
{
    public class AppConfig
    {
        public Guid Id { get; set; }    
        public string root { get; set; }
        public string us { get; set; }
        public string hash { get; set; }
        public string domain { get; set; }
        public string description { get; set; }
        public int appconfig_id { get; set; }
    }
}
