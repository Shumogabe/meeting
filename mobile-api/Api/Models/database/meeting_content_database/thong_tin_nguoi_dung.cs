using QTHT.Api.Models.database;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QTHT.Api.Models.meeting_content_database
{
    public class thong_tin_nguoi_dung
    {
        [Key]
        public int id { get; set; }
        public string? ten_dangnhap { get; set; }
        public string? ten_day_du { get; set; }
        public string? ma_tochuc { get; set; }
        public string? ma_chucvu { get; set; }   
        public long? thoigian_tao { get; set; }
        public string? so_dien_thoai { get; set; }
        public string? email { get; set; }   
        public string? id_wso2 { get; set; }
        public bool? daxoa { get; set; }
        public string? ma_dinhdanh { get; set; }
        [NotMapped]
        public thong_tin_don_vi thong_tin_don_vi { get; set; }
        [NotMapped]
        public thong_tin_chuc_vu thong_tin_chuc_vu { get; set; }
    }
}
