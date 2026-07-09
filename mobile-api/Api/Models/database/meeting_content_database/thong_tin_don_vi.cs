using System.ComponentModel.DataAnnotations;

namespace QTHT.Api.Models.meeting_content_database
{
    public class thong_tin_don_vi
    {
        [Key]
        public int Id { get; set; } 
        public string ma {  get; set; }
        public string ten { get; set; }
        public string ma_hanhchinh {  get; set; }
        public string diachi { get; set; }
        public string dienthoai { get; set; }
        public string mail { get; set; }
        public string fax { get; set; }
        public string website { get; set; }
        public string mota { get; set; }
        public string trangthai_hoatdong { get; set; }
        public long thoigian_tao { get; set; }
        public bool daxoa { get; set; }
    }
}
