using Microsoft.EntityFrameworkCore;
using NPOI.SS.Formula.Functions;
using System.ComponentModel.DataAnnotations;
namespace HTT_QTHT.Models
{
    public class QTHT_HTT_Context : DbContext
    {
        public QTHT_HTT_Context(DbContextOptions<QTHT_HTT_Context> options) : base(options) { }

        #region model thiet lap cau hinh       
        public DbSet<tl_ch_kehoach> tl_ch_kehoach { get; set; }
        public DbSet<tl_ch_chuongtrinh> tl_ch_chuongtrinh { get; set; }
        public DbSet<tl_ch_tailieuhop> tl_ch_tailieuhop { get; set; }
        public DbSet<tl_ch_thanhphanthamgia> tl_ch_thanhphanthamgia { get; set; }
        public DbSet<tl_ch_bieuquyet> tl_ch_bieuquyet { get; set; }
        public DbSet<tl_ch_baocaothongke> tl_ch_baocaothongke { get; set; }
        public DbSet<tl_ch_sukien> tl_ch_sukien { get; set; }
        public DbSet<tl_ch_nguoidung> tl_ch_nguoidung { get; set; }
        public DbSet<tl_ch_hethong> tl_ch_hethong { get; set; }
        public DbSet<tl_ch_dichvusms> tl_ch_dichvusms { get; set; }
        public DbSet<tl_ch_thongbaolichhop> tl_ch_thongbaolichhop { get; set; }
        public DbSet<tl_ch_thoigiancho> tl_ch_thoigiancho { get; set; }
        public DbSet<tl_ch_lichhop> tl_ch_lichhop { get; set; }
        #endregion

        #region model nhat ky
        public DbSet<log_truycapphanmem> log_truycapphanmem { get; set; }
        public DbSet<log_ql_nguoidung> log_ql_nguoidung { get; set; }
        public DbSet<log_ql_laplich> log_ql_laplich { get; set; }
        public DbSet<log_ql_sukien> log_ql_sukien { get; set; }
        public DbSet<log_ql_thamgiaphonghop> log_ql_thamgiaphonghop { get; set; }
        public DbSet<log_ql_nhat_ky_loi> log_ql_nhat_ky_loi { get; set; }
        public DbSet<log_ql_dangkydichvu> log_ql_dangkydichvu { get; set; }
        public DbSet<log_ql_dangnhap> log_ql_dangnhap { get; set; }
        #endregion

        #region model sao luu
        public DbSet<sao_luu_cau_hinh_he_thong> sao_luu_cau_hinh_he_thong { get; set; }
        public DbSet<dulieu_gannhan_saoluu> dulieu_gannhan_saoluu { get; set; }
        public DbSet<sao_luu_bang_du_lieu> sao_luu_bang_du_lieu { get; set; }
        public DbSet<sao_luu_tep_tin> sao_luu_tep_tin { get; set; }
        public DbSet<thiet_lap_co_che_sao_luu> thiet_lap_co_che_sao_luu { get; set; }
        #endregion

        #region model khac
        public DbSet<thong_tin_don_vi> thong_tin_don_vi { get; set; }
        public DbSet<thong_tin_nguoi_dung> thong_tin_nguoi_dung { get; set; }
        public DbSet<thong_tin_chuc_vu> thong_tin_chuc_vu { get; set; }
        public DbSet<vai_tro_nguoi_dung> vai_tro_nguoi_dung { get; set; }
        public DbSet<thong_tin_chuc_nang> thong_tin_chuc_nang { get; set; }
        public DbSet<phan_quyen_vai_tro_nguoi_dung> phan_quyen_vai_tro_nguoi_dung { get; set; }
        public DbSet<chan_truy_cap> chan_truy_cap { get; set; }        
        public DbSet<giam_sat_thong_tin_ip_quan_tri> giam_sat_thong_tin_ip_quan_tri { get; set; }
        #endregion

        public DbSet<dieu_kien_loc> dieu_kien_loc { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
