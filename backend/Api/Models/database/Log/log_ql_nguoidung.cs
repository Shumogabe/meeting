using System.ComponentModel.DataAnnotations;
using System;

namespace HTT.Api.Models
{
    public partial class log_ql_nguoidung
    {
        [Key] public string? ma { get; set; }
        public string? tai_khoan { get; set; }
        public string? noi_dung { get; set; }
        public string? ip_may { get; set; }
        public Int64 thoigian_tao { get; set; }
        public string? loai_hoatdong { get; set; }
        public string? chuc_nang { get; set; }
        public void Assign(log_ql_nguoidung candidate)
        {
            tai_khoan = candidate.tai_khoan;
            noi_dung = candidate.noi_dung;
            ip_may = candidate.ip_may;
        }
    }
}
