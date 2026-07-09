using System.ComponentModel.DataAnnotations;
using System;

namespace HTT.Api.Models
{
    public partial class log_ql_dangnhap
    {
        [Key] public string? ma { get; set; }
        public string? ten_dangnhap { get; set; }
        public string? ten_ung_dung { get; set; }
        public string? ip_dangnhap { get; set; }
        public string? trangthai_dangnhap { get; set; }
        public bool da_xoa { get; set; }
        public Int64 thoigian_dangnhap { get; set; }
        public void Assign(log_ql_dangnhap candidate)
        {
            ten_dangnhap = candidate.ten_dangnhap;
            ten_ung_dung = candidate.ten_ung_dung;
            ip_dangnhap = candidate.ip_dangnhap;
            trangthai_dangnhap = candidate.trangthai_dangnhap;
            da_xoa = candidate.da_xoa;
        }
    }
}
