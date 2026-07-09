using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace QTHT.Api.Models.database.Log
{
    
    public class log_truycapphanmem 
    {
        [Key]
        public string ma { get; set; }
        public string ten_dangnhap {  get; set; }    
        public string ten_ung_dung { get; set; }
        public string ip_dangnhap { get; set; }
        public string trangthai_dangnhap { get;set; }
        public bool da_xoa { get; set; }
        public long thoigian_dangnhap { get; set; }
    }
}
