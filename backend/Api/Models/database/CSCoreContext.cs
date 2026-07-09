using Microsoft.EntityFrameworkCore;
using QTHT.Api.Models.database.DichVu;
using QTHT.Api.Models.database.Meeting.Support;
using System.Reflection.Emit;

namespace HTT.Api.Models
{
    public class QTHT_HTT_Context : DbContext
    {
        public QTHT_HTT_Context(DbContextOptions<QTHT_HTT_Context> options)
            : base(options)
        {
        }

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
        //       
        public DbSet<log_ql_dangkydichvu> log_ql_dangkydichvu { get; set; }
        public DbSet<log_ql_dangnhap> log_ql_dangnhap { get; set; }
        public DbSet<log_ql_laplich> log_ql_laplich { get; set; }
        public DbSet<log_ql_nguoidung> log_ql_nguoidung { get; set; }
        public DbSet<log_ql_nhat_ky_loi> log_ql_nhat_ky_loi { get; set; }
        public DbSet<log_ql_sukien> log_ql_sukien { get; set; }
        public DbSet<log_ql_thamgiaphonghop> log_ql_thamgiaphonghop { get; set; }
        public DbSet<log_truycapphanmem> log_truycapphanmem { get; set; }
        public DbSet<phan_quyen_vai_tro_nguoi_dung> phan_quyen_vai_tro_nguoi_dung { get; set; }
        public DbSet<thong_tin_chuc_nang> thong_tin_chuc_nang { get; set; }
        public DbSet<thong_tin_chuc_vu> thong_tin_chuc_vu { get; set; }
        public DbSet<thong_tin_don_vi> thong_tin_don_vi { get; set; }
        public DbSet<thong_tin_nguoi_dung> thong_tin_nguoi_dung { get; set; }
        public DbSet<vai_tro_nguoi_dung> vai_tro_nguoi_dung { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
    public class HTT_Context : DbContext
    {
        public HTT_Context(DbContextOptions<HTT_Context> options)
            : base(options)
        {
        }
        public DbSet<Meeting_Support>Meeting_Support { get; set; }
        public DbSet<Meeting_Member> Meeting_Member { get; set; }
        public DbSet<DangKyCapPhatDichVu> DangKyCapPhatDichVu { get; set; }
        public DbSet<Meeting_Conslusion> Meeting_Conclusion { get; set; }
        public DbSet<Meeting_Votes> Meeting_Votes { get; set; }
        public DbSet<Meeting_Video> Meeting_Video { get; set; }

        public DbSet<Meeting_Schedule> Meeting_Schedule { get; set; }
        public DbSet<Meeting_Document> Meeting_Document { get; set; }
        public DbSet<Meeting_Voted> Meeting_Voted { get; set; }
        public DbSet<DangKyHuyDichVu> DangKyHuyDichVu { get; set; }
        public DbSet<Meeting_Server> Meeting_Server { get; set; }
        public DbSet<DangKyCapPhatBoSungDichVu> DangKyCapPhatBoSungDichVu { get; set; }
        public DbSet<Meeting_Content> Meeting_Content { get; set; }
        public DbSet<CapPhatBoSungDichVu> CapPhatBoSungDichVu { get; set; }
        public DbSet<HuyDichVu> HuyDichVu { get; set; }
        public DbSet<CapPhatDichVu> CapPhatDichVu { get; set; }
        public DbSet<DangKyCapPhatDichVu> DangKyDichVu { get; set; }
        public DbSet<ThongTinDangKyDichVu> ThongTinDangKyDichVu { get; set; }
        public DbSet<cau_hinh_he_thong> cau_hinh_he_thong { get; set; }
        public DbSet<he_thong_sms> he_thong_sms { get; set; }
        public DbSet<thongke_hoinghihoithao> thongke_hoinghihoithao { get; set; }
        public DbSet<thongke_lichhop> thongke_lichhop { get; set; }
        public DbSet<thongke_dinhky> thongke_dinhky { get; set; }
        public DbSet<thongke_diemcau> thongke_diemcau { get; set; }
        public DbSet<thongke_tonghop> thongke_tonghop { get; set; }
        public DbSet<thongke_tongsocuochopdangdienra> thongke_tongsocuochopdangdienra { get; set; }
        public DbSet<thongke_socuochoptheolichsutrentongthehethong> thongke_socuochoptheolichsutrentongthehethong { get; set; }
        public DbSet<thongke_tongsocuochoptrentungmaychu> thongke_tongsocuochoptrentungmaychu { get; set; }
        public DbSet<thongke_socuochoptheolichsutrentungmaychu> thongke_socuochoptheolichsutrentungmaychu { get; set; }
        public DbSet<thongke_tongsonguoithamgiacuochoptheolichsu> thongke_tongsonguoithamgiacuochoptheolichsu { get; set; }
        public DbSet<thongke_songuoithamgiatrongmotcuochop> thongke_songuoithamgiatrongmotcuochop { get; set; }
        public DbSet<thongke_tailieuhopcaccuochop> thongke_tailieuhopcaccuochop { get; set; }
        public DbSet<thongke_ghihinhcuochop> thongke_ghihinhcuochop { get; set; }
        public DbSet<thongke_bieuquyet> thongke_bieuquyet { get; set; }

        public DbSet<thongke_ketluancuochop> thongke_ketluancuochop { get; set; }
        public DbSet<thongke_socuochopcuamotdaibieuthamgiadenthoidiemhientai> thongke_socuochopcuamotdaibieuthamgiadenthoidiemhientai { get; set; }
        public DbSet<thongke_thongketongsonguoithamgiacuochopdangdienra> thongke_thongketongsonguoithamgiacuochopdangdienra { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Meeting_Voted>().HasKey(m => m.Id); 
            builder.Entity<Meeting_Voted>().Property(m => m.Title).HasColumnName("Title"); 
            builder.Entity<Meeting_Voted>().Property(m => m.VoteId).HasColumnName("VoteId");
            builder.Entity<Meeting_Voted>().Property(m => m.VoteId).HasColumnName("CreatedDate");
            builder.Entity<Meeting_Voted>().Property(m => m.VoteId).HasColumnName("CreatedBy");
            builder.Entity<Meeting_Voted>().Property(m => m.VoteId).HasColumnName("ModifiedDate");
            builder.Entity<Meeting_Voted>().Property(m => m.VoteId).HasColumnName("ModifiedBy");
            builder.Entity<Meeting_Voted>().Property(m => m.VoteId).HasColumnName("DeletedDate");
            builder.Entity<Meeting_Voted>().Property(m => m.VoteId).HasColumnName("DeletedBy");
            builder.Entity<Meeting_Voted>().Property(m => m.VoteId).HasColumnName("ModifiedBy");
            builder.Entity<Meeting_Voted>().Property(m => m.VoteId).HasColumnName("ModifiedBy");
            builder.Entity<Meeting_Voted>().Property(m => m.VoteId).HasColumnName("ModifiedBy");
        }
    }
}
