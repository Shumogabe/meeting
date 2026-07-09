using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HTT_QTHT.Models
{
    public partial class log_truycapphanmem
    {
        [Key] public string? ma { get; set; }
        public string? ten_dangnhap { get; set; }
        public string? ten_ung_dung { get; set; }
        public string? ip_dangnhap { get; set; }
        public string? trangthai_dangnhap { get; set; }
        public bool da_xoa { get; set; }
        public Int64 thoigian_dangnhap { get; set; }
        [NotMapped] public int? stt { get; set; }
        [NotMapped] public string? thoi_gian_gui_datetimestr { get; set; }
        public void Assign(log_truycapphanmem candidate)
        {
            ten_dangnhap = candidate.ten_dangnhap;
            ten_ung_dung = candidate.ten_ung_dung;
            ip_dangnhap = candidate.ip_dangnhap;
            trangthai_dangnhap = candidate.trangthai_dangnhap;
            da_xoa = candidate.da_xoa;
        }
    }
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
    public partial class log_ql_laplich
    {
        [Key] public string? ma { get; set; }
        public string? tai_khoan { get; set; }
        public string? noi_dung { get; set; }
        public string? ip_may { get; set; }
        public Int64 thoigian_tao { get; set; }
        public string? loai_hoatdong { get; set; }
        public string? chuc_nang { get; set; }
        public void Assign(log_ql_laplich candidate)
        {
            tai_khoan = candidate.tai_khoan;
            noi_dung = candidate.noi_dung;
            ip_may = candidate.ip_may;
        }
    }
    public partial class log_ql_sukien
    {
        [Key] public string? ma { get; set; }
        public string? tai_khoan { get; set; }
        public string? noi_dung { get; set; }
        public string? ip_may { get; set; }
        public Int64 thoigian_tao { get; set; }
        public string? loai_hoatdong { get; set; }
        public string? chuc_nang { get; set; }
        public void Assign(log_ql_sukien candidate)
        {
            tai_khoan = candidate.tai_khoan;
            noi_dung = candidate.noi_dung;
            ip_may = candidate.ip_may;
        }
    }
    public partial class log_ql_thamgiaphonghop
    {
        [Key] public string? ma { get; set; }
        public string? tai_khoan { get; set; }
        public string? noi_dung { get; set; }
        public string? ip_may { get; set; }
        public Int64 thoigian_tao { get; set; }
        public string? loai_hoatdong { get; set; }
        public string? chuc_nang { get; set; }
        public void Assign(log_ql_thamgiaphonghop candidate)
        {
            tai_khoan = candidate.tai_khoan;
            noi_dung = candidate.noi_dung;
            ip_may = candidate.ip_may;
        }
    }
    public partial class log_ql_nhat_ky_loi
    {
        [Key] public long thoigian_loi { get; set; }
        public string? noi_dung { get; set; }
        [NotMapped] public int? stt { get; set; }
        [NotMapped] public string? thoi_gian_gui_datetimestr { get; set; }
    }
    public partial class log_ql_dangkydichvu
    {
        [Key] public string? ma { get; set; }
        public string? tai_khoan { get; set; }
        public string? noi_dung { get; set; }
        public string? ip_may { get; set; }
        public Int64 thoigian_tao { get; set; }
        public string? loai_hoatdong { get; set; }
        public string? chuc_nang { get; set; }
        public void Assign(log_ql_dangkydichvu candidate)
        {
            tai_khoan = candidate.tai_khoan;
            noi_dung = candidate.noi_dung;
            ip_may = candidate.ip_may;
        }
        [NotMapped] public int? stt { get; set; }
        [NotMapped] public string? thoi_gian_gui_datetimestr { get; set; }
    }
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
    // CommonList
    public partial class log_truycapphanmems : CommonList
    {
        public List<log_truycapphanmem>? Records { get; set; }
    }
    public partial class log_ql_nguoidungs : CommonList
    {
        public List<log_ql_nguoidung>? Records { get; set; }
    }
    public partial class log_ql_laplichs : CommonList
    {
        public List<log_ql_laplich>? Records { get; set; }
    }
    public partial class log_ql_sukiens : CommonList
    {
        public List<log_ql_sukien>? Records { get; set; }
    }
    public partial class log_ql_thamgiaphonghops : CommonList
    {
        public List<log_ql_thamgiaphonghop>? Records { get; set; }
    }
    public partial class log_ql_nhat_ky_lois : CommonList
    {
        public List<log_ql_nhat_ky_loi>? Records { get; set; }
    }
    public partial class log_ql_dangkydichvus : CommonList
    {
        public List<log_ql_dangkydichvu>? Records { get; set; }
    }
    public partial class log_ql_dangnhaps : CommonList
    {
        public List<log_ql_dangnhap>? Records { get; set; }
    }
}
