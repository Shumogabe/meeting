using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HTT_QTHT.Models
{
    public partial class thong_tin_don_vi
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        [Key] public string? ma { get; set; }
        public string? ten { get; set; }
        public string? ma_hanhchinh { get; set; }
        public string? diachi { get; set; }
        public string? dienthoai { get; set; }
        public string? mail { get; set; }
        public string? fax { get; set; }
        public string? website { get; set; }
        public string? mota { get; set; }
        public string? trangthai_hoatdong { get; set; }
        public Int64 thoigian_tao { get; set; }
        public bool? daxoa { get; set; } = false;
        public void Assign(thong_tin_don_vi candidate)
        {
            ten = candidate.ten;
            ma_hanhchinh = candidate.ma_hanhchinh;
            diachi = candidate.diachi;
            dienthoai = candidate.dienthoai;
            mail = candidate.mail;
            fax = candidate.fax;
            website = candidate.website;
            mota = candidate.mota;
            trangthai_hoatdong = candidate.trangthai_hoatdong;
        }
    }
    public partial class thong_tin_nguoi_dung
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        [Key] public string? ten_dangnhap { get; set; }
        public string? ten_day_du { get; set; }
        public string? ma_tochuc { get; set; }
        public string? ma_chucvu { get; set; }
        public string? so_dien_thoai { get; set; }
        public string? email { get; set; }
        public Int64 thoigian_tao { get; set; }
        public string? id_wso2 { get; set; }
        public bool? daxoa { get; set; } = false;
        [NotMapped] public thong_tin_don_vi? thong_tin_don_vi { get; set; }
        [NotMapped] public thong_tin_chuc_vu? thong_tin_chuc_vu { get; set; }
        public void Assign(thong_tin_nguoi_dung candidate)
        {
            ten_day_du = candidate.ten_day_du;
            ma_tochuc = candidate.ma_tochuc;
            ma_chucvu = candidate.ma_chucvu;
            so_dien_thoai = candidate.so_dien_thoai;
            email = candidate.email;
        }
    }
    public partial class thong_tin_chuc_vu
    {
        [Key] public string? ma { get; set; }
        public string? ten { get; set; }
        public string? ma_hanhchinh { get; set; }
        public int? thutu { get; set; }
        public string? mota { get; set; }
        public string? trangthai_hoatdong { get; set; }
        public Int64 thoigian_tao { get; set; }
        public bool daxoa { get; set; } = false;
        public void Assign(thong_tin_chuc_vu candidate)
        {
            ten = candidate.ten;
            ma_hanhchinh = candidate.ma_hanhchinh;
            thutu = candidate.thutu;
            mota = candidate.mota;
            trangthai_hoatdong = candidate.trangthai_hoatdong;
        }
    }
    public partial class vai_tro_nguoi_dung
    {
        [Key] public string? ma { get; set; }
        public string? ten { get; set; }
        public string? mota { get; set; }
        public List<string>? ma_ds_thong_tin_chuc_nangs { get; set; }
        [NotMapped] public List<thong_tin_chuc_nang>? ds_thong_tin_chuc_nangs { get; set; }
        public Int64 thoi_gian_dk { get; set; }
        public Int64 thoigian_tao { get; set; }
        public bool? daxoa { get; set; } = false;
        public void Assign(vai_tro_nguoi_dung candidate)
        {
            ten = candidate.ten;
            mota = candidate.mota;
            ma_ds_thong_tin_chuc_nangs = candidate.ma_ds_thong_tin_chuc_nangs;
        }
    }
    public partial class thong_tin_chuc_nang
    {
        [Key] public string? ma { get; set; }
        public string? ten { get; set; }
        public string? mota { get; set; }
        public Int64 thoigian_tao { get; set; }
        public void Assign(thong_tin_chuc_nang candidate)
        {
            ten = candidate.ten;
            mota = candidate.mota;
        }
    }
    public partial class phan_quyen_vai_tro_nguoi_dung
    {
        [Key] public string? ten_dangnhap_nguoidung { get; set; }
        [NotMapped] public thong_tin_nguoi_dung? nguoidung { get; set; }
        public List<string>? ma_ds_vaitros { get; set; }
        [NotMapped] public List<vai_tro_nguoi_dung>? ds_vaitros { get; set; }
        public string? mota { get; set; }
        public Int64 thoigian_tao { get; set; }
        public bool? daxoa { get; set; } = false;
        public void Assign(phan_quyen_vai_tro_nguoi_dung candidate)
        {
            ma_ds_vaitros = candidate.ma_ds_vaitros;
            mota = candidate.mota;
        }
    }
    public partial class chan_truy_cap
    {
        [Key] public string? ma { get; set; }
        public string? ten { get; set; }
        public string? loai { get; set; }
        public string? noidung_giamsat_json { get; set; }
        [NotMapped] public noidung_giamsat? noidung_giamsat { get; set; }
        public string? trangthai_xoa { get; set; } = "Chưa xóa";
        public Int64 thoigian_tao { get; set; }
        public void Assign(chan_truy_cap candidate)
        {
            ten = candidate.ten;
            loai = candidate.loai;
            noidung_giamsat = candidate.noidung_giamsat;
            trangthai_xoa = candidate.trangthai_xoa;
        }
        public void Deserialize()
        {
            if (noidung_giamsat_json != null && noidung_giamsat_json.Length > 0)
            {
                noidung_giamsat = System.Text.Json.JsonSerializer.Deserialize<noidung_giamsat>(noidung_giamsat_json);
            }
        }
        public void Serialize()
        {
            noidung_giamsat_json = System.Text.Json.JsonSerializer.Serialize(noidung_giamsat);
        }
    }
    public partial class noidung_giamsat
    {
        public List<ds_thoigian_batthuong>? ds_thoigian_batthuongs { get; set; }
        public int soluot_dangnhapqua { get; set; } // số lượt đăng nhập quá trong ngày
        public List<string>? ds_ip_nuocngoai { get; set; }
    }
    public partial class ds_thoigian_batthuong
    {
        public Int64 thoigian_batthuong_from { get; set; }
        public Int64 thoigian_batthuong_to { get; set; }
    }
    public partial class giam_sat_thong_tin_ip_quan_tri
    {
        [Key] public string? ip { get; set; }
        public string? ten { get; set; }
        public string? thiet_bi { get; set; }
        public string? mac { get; set; }
        public Int64 thoigian_tao { get; set; }
        public string? trangthai_xoa { get; set; } = "Chưa xóa";
        public void Assign(giam_sat_thong_tin_ip_quan_tri candidate)
        {
            ten = candidate.ten;
            thiet_bi = candidate.thiet_bi;
            mac = candidate.mac;
            trangthai_xoa = candidate.trangthai_xoa;
        }
    }
    public partial class dieu_kien_loc
    {
        [Key] public string? ma { get; set; }
        public string? bang { get; set; }
        public string? noi_dung { get; set; }
        public Int64 thoi_gian_tao { get; set; }
        public void Assign(dieu_kien_loc candidate)
        {
            noi_dung = candidate.noi_dung;
        }
    }

    // CommonList
    public partial class thong_tin_don_vis : CommonList
    {
        public List<thong_tin_don_vi>? Records { get; set; }
    }
    public partial class thong_tin_nguoi_dungs : CommonList
    {
        public List<thong_tin_nguoi_dung>? Records { get; set; }
    }
    public partial class thong_tin_chuc_vus : CommonList
    {
        public List<thong_tin_chuc_vu>? Records { get; set; }
    }
    public partial class vai_tro_nguoi_dungs : CommonList
    {
        public List<vai_tro_nguoi_dung>? Records { get; set; }
    }
    public partial class thong_tin_chuc_nangs : CommonList
    {
        public List<thong_tin_chuc_nang>? Records { get; set; }
    }
    public partial class phan_quyen_vai_tro_nguoi_dungs : CommonList
    {
        public List<phan_quyen_vai_tro_nguoi_dung>? Records { get; set; }
    }
    public partial class chan_truy_caps : CommonList
    {
        public List<chan_truy_cap>? Records { get; set; }
    }
    public partial class giam_sat_thong_tin_ip_quan_tris : CommonList
    {
        public List<giam_sat_thong_tin_ip_quan_tri>? Records { get; set; }
    }
    public partial class dieu_kien_locs : CommonList
    {
        public List<dieu_kien_loc>? Records { get; set; }
    }
}
