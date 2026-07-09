using System.ComponentModel.DataAnnotations;

namespace QTHT.Api.Models.database.Log
{
    public class log_ql_nhat_ky_loi
    {
        [Key]
        public long thoigian_loi { get; set; }
        public string noi_dung {  get; set; }
    }
}
