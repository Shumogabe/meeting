using System.ComponentModel.DataAnnotations;

namespace QTHT.Api.Models.database.Log
{
    public class log_ql_nguoidung
    {
        [Key]
        public string ma { get; set; }
        public string tai_khoan { get; set; }
        public string noi_dung { get; set; }
        public string ip_may { get; set; }
        public long thoigian_tao { get; set; }
        public string chuc_nang { get; set; }
        public string loai_hoatdong { get; set; }
    }
}
