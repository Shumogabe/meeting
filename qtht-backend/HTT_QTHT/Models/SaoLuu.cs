using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HTT_QTHT.Models
{

    public partial class sao_luu_cau_hinh_he_thong
    {
        [Key] public string? ma { get; set; }
        public List<string>? ten_bang { get; set; }
        public string? tenfile_saoluu { get; set; }
        public string? mo_ta { get; set; }
        public Int64 thoigian_saoluu { get; set; }
        [NotMapped] public List<tl_ch_hethong>? ds_ten_bang { get; set; }
        public void Assign(sao_luu_cau_hinh_he_thong candidate)
        {
            ten_bang = candidate.ten_bang;
            tenfile_saoluu = candidate.tenfile_saoluu;
            mo_ta = candidate.mo_ta;
        }
    }
    public partial class dulieu_gannhan_saoluu
    {
        [Key] public string ten_bang { get; set; }
        public string? mo_ta { get; set; }
        public string? trangthai_xoa { get; set; }
        public long thoigian_tao { get; set; }
        [NotMapped] public bangdulieu? bangdulieu { get; set; }
        public void Assign(dulieu_gannhan_saoluu candidate)
        {
            ten_bang = candidate.ten_bang;
            mo_ta = candidate.mo_ta;
            trangthai_xoa = candidate.trangthai_xoa;
        }
    }
    public partial class sao_luu_bang_du_lieu
    {
        [Key] public string? ma { get; set; }
        public List<string>? ten_bang { get; set; }
        public string? tenfile_saoluu { get; set; }
        public string? mo_ta { get; set; }
        public Int64 thoigian_saoluu { get; set; }
        [NotMapped] public List<bangdulieu>? ds_ten_bang { get; set; }
        public void Assign(sao_luu_bang_du_lieu candidate)
        {
            ten_bang = candidate.ten_bang;
            tenfile_saoluu = candidate.tenfile_saoluu;
            mo_ta = candidate.mo_ta;
        }
    }
    public partial class sao_luu_tep_tin
    {
        [Key] public string? ma { get; set; }
        public List<string>? ten_file { get; set; }
        public string? thu_muc { get; set; }
        public string? tenfile_saoluu { get; set; }
        public string? mo_ta { get; set; }
        public Int64 thoigian_saoluu { get; set; }
        [NotMapped] public thumuc? thumuc { get; set; }
        [NotMapped] public teptin? tenfile { get; set; }
        [NotMapped] public List<teptin>? tends_tenfilefile { get; set; }
        [NotMapped] public List<teptin>? ds_tenfile { get; set; }
        public void Assign(sao_luu_tep_tin candidate)
        {
            ten_file = candidate.ten_file;
            thu_muc = candidate.thu_muc;
            tenfile_saoluu = candidate.tenfile_saoluu;
            mo_ta = candidate.mo_ta;
        }
    }
    public partial class thiet_lap_co_che_sao_luu
    {
        [Key] public string? ma { get; set; }
        public string? ten_bang { get; set; }
        public string? tenfile_saoluu { get; set; }
        public string? dinh_dang { get; set; }
        public string? mo_ta { get; set; }
        public Int64 thoigian_tao { get; set; }
        [NotMapped] public bangdulieu? bangdulieu { get; set; }
        public void Assign(thiet_lap_co_che_sao_luu candidate)
        {
            ten_bang = candidate.ten_bang;
            tenfile_saoluu = candidate.tenfile_saoluu;
            dinh_dang = candidate.dinh_dang;
            mo_ta = candidate.mo_ta;
        }
    }
    // CommonList
    public partial class dulieu_gannhan_saoluus : CommonList
    {
        public List<dulieu_gannhan_saoluu>? Records { get; set; }
    }
    public partial class sao_luu_cau_hinh_he_thongs : CommonList
    {
        public List<sao_luu_cau_hinh_he_thong>? Records { get; set; }
    }
    public partial class sao_luu_bang_du_lieus : CommonList
    {
        public List<sao_luu_bang_du_lieu>? Records { get; set; }
    }
    public partial class sao_luu_tep_tins : CommonList
    {
        public List<sao_luu_tep_tin>? Records { get; set; }
    }
    public partial class thiet_lap_co_che_sao_luus : CommonList
    {
        public List<thiet_lap_co_che_sao_luu>? Records { get; set; }
    }
}
