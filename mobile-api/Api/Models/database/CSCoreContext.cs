using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HTT.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using QTHT.Api.Models.Admin;
using QTHT.Api.Models.database;
using QTHT.Api.Models.database.Log;
using QTHT.Api.Models.database.Meeting.Conslusion;
using QTHT.Api.Models.database.Meeting.Document;
using QTHT.Api.Models.database.Meeting.Member;
using QTHT.Api.Models.database.Meeting.Option;
using QTHT.Api.Models.database.Meeting.Schedule;
using QTHT.Api.Models.database.Meeting.Support;
using QTHT.Api.Models.database.Meeting.Voted;
using QTHT.Api.Models.database.Meeting.Votes;
using QTHT.Api.Models.database.thong_ke;
using QTHT.Api.Models.meeting_content_database;
using static QTHT.Api.Models.database.Meeting.Whiteboard.Whiteboard;

namespace QTHT.Api.Models
{
    public class QTHT_HTT_Context : DbContext
    {
        public QTHT_HTT_Context(DbContextOptions<QTHT_HTT_Context> options)
            : base(options)
        {
        }
        public DbSet<thong_tin_don_vi> thong_tin_don_vi { get; set; }
        public DbSet<thong_tin_chuc_nang> thong_tin_chuc_nang { get; set; }
        public DbSet<vai_tro_nguoi_dung> vai_tro_nguoi_dung { get; set; }
        public DbSet<phan_quyen_vai_tro_nguoi_dung> phan_quyen_vai_tro_nguoi_dung { get; set; } 
        public DbSet<thong_tin_chuc_vu> thong_tin_chuc_vu { get; set; }
        public DbSet<log_ql_nguoidung> log_ql_nguoidung { get; set; }
        public DbSet<log_ql_dangkydichvu> log_ql_dangkydichvu { get; set; }
        public DbSet<log_ql_dangnhap> log_ql_dangnhap { get; set; }
        public DbSet<tl_ch_hethong> tl_ch_hethong { get; set; }
        public DbSet<log_ql_laplich> log_ql_laplich { get; set; }
        public DbSet<log_ql_nhat_ky_loi> log_ql_nhat_ky_loi { get; set; }
        public DbSet<log_ql_sukien> log_ql_sukien { get; set; }
        public DbSet<tl_ch_thongbaolichhop> tl_ch_thongbaolichhop { get; set; } 
        public DbSet<log_ql_thamgiaphonghop> log_ql_thamgiaphonghop { get; set; }
        public DbSet<log_truycapphanmem> log_truycapphanmem { get; set; }
        public DbSet<thong_tin_nguoi_dung> thong_tin_nguoi_dung { get; set; }
        public DbSet<he_thong_sms> he_thong_sms { get; set; }
        public DbSet<chuc_vu> chuc_vu { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }

        public class HTT_Context : DbContext
        {
            public HTT_Context(DbContextOptions<HTT_Context> options)
                : base(options)
            {
            }
            public DbSet<Meeting_Support>Meeting_Support { get; set; }
            public DbSet<Meeting_Option>Meeting_Option { get; set; }
            public DbSet<ThongTinDangKyDichVu> ThongTinDangKyDichVu { get; set; }
            
            public DbSet<Meeting_Schedule> Meeting_Schedule { get; set; }
            public DbSet<Meeting_Conclusion> Meeting_Conclusion { get; set; }
            public DbSet<Meeting_Plan> Meeting_Plan { get; set; }
            public DbSet<Meeting_Voted> Meeting_Voted { get; set; }
            public DbSet<Meeting_Whiteboard> Meeting_Whiteboard { get; set; }
            public DbSet<Meeting_Member> Meeting_Member { get; set; }
            public DbSet<cau_hinh_he_thong> cau_hinh_he_thong { get; set; }
            public DbSet<he_thong_sms> he_thong_sms { get; set; }
            public DbSet<thongke_hoinghihoithao> thongke_hoinghihoithao { get; set; }
            public DbSet<thongke_dinhki> thongke_dinhki { get; set; }
            public DbSet<Meeting_Votes> Meeting_Votes { get; set; }
            public DbSet<thongke_diemcau> thongke_diemcau { get; set; }
            public DbSet<Meeting_Document> Meeting_Document { get; set; }
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

            protected override void OnModelCreating(ModelBuilder builder)
            {
                base.OnModelCreating(builder);
            }



        }
    }
}
