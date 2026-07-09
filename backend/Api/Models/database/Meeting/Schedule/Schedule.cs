using Api;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Office2013.Excel;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Linq.Dynamic.Core;

namespace HTT.Api.Models
{
    public class Meeting_Schedule
    {
        [Key]
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int ChairMan { get; set; }
        public string RoomName { get; set; }
        public string Place { get; set; }
        public int Status { get; set; } //0-Draft | 1-Chưa duyệt | 2-Đã duyệt | 3-Đã hết
        public bool Start { get; set; }  //0-false | 1-true
        public string Token { get; set; }
        public int ServerId { get; set; }
        public int TypeId { get; set; }
        public int SharedRole { get; set; }
        public bool IsLobby { get; set; }
        public bool IsPublished { get; set; }
        public string Password { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
        [NotMapped]
        public Meeting_Server Server { get; set; }
        [NotMapped]
        public Meeting_Type Type { get; set; }
        public Int64? don_vi { get; set; }
        [NotMapped]
        public List<Meeting_Votes> MeetingVotes { get; set; } = new List<Meeting_Votes>();
        [NotMapped]
        public List<Meeting_Member>? MeetingMemberOutside { get; set; } = new List<Meeting_Member>();
        [NotMapped]
        public List<Meeting_Member>? MeetingMemberInside { get; set; } = new List<Meeting_Member>();
        [NotMapped] public List<Meeting_Document>? MeetingDocument { get; set; } = new List<Meeting_Document>();
        [NotMapped] public List<Meeting_Document>? MeetingDocumentConclusion { get; set; } = new List<Meeting_Document>();
        [NotMapped] public List<Meeting_Conslusion>? MeetingConslusion { get; set; } = new List<Meeting_Conslusion>();
        [NotMapped] public List<Meeting_Content>? MeetingContent { get; set; } = new List<Meeting_Content>();
        [NotMapped] public List<Meeting_Video>? MeetingVideo { get; set; } = new List<Meeting_Video>();
        [NotMapped] public thong_tin_nguoi_dung UserChairMan { get; set; }
        [NotMapped] public thong_tin_nguoi_dung UserCreatedBy { get; set; }
        [NotMapped] public thong_tin_nguoi_dung UserShareRole { get; set; }
        [NotMapped] public int MeetingMemberCount { get; set; }
    }
    public class Meeting_Schedule_Insert
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int ChairMan { get; set; }
        public string RoomName { get; set; }
        public string Place { get; set; }
        public int Status { get; set; } // | 1-Chưa duyệt | 2-Đã duyệt | 3-Published
        public bool Start { get; set; }  //0-false | 1-true
        public string Token { get; set; }
        public int ServerId { get; set; }
        public int TypeId { get; set; }
        public int SharedRole { get; set; }
        public string Password { get; set; }
        public bool IsLobby { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public Int64 don_vi { get; set; }
        [NotMapped] public thong_tin_nguoi_dung? user { get; set; }
    }
    public class Meeting_Schedule_Update
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int ChairMan { get; set; }
        public string RoomName { get; set; }
        public string Place { get; set; }
        public int Status { get; set; } //0-Draft | 1-Chưa duyệt | 2-Đã duyệt | 3-Published
        public bool Start { get; set; }  //0-false | 1-true
        public string Token { get; set; }
        public int ServerId { get; set; }
        public int TypeId { get; set; }
        public int SharedRole { get; set; }
        public bool IsLobby { get; set; }
        public bool IsPublished { get; set; }
        public string Password { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public Int64 don_vi { get; set; }
    }
    public class Meeting_Schedule_Delete
    {
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
    }
    public class Meeting_Schedule_Restore
    {
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
    public class Meeting_Schedule_SharedRole
    {
        public int SharedRole { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
    public class Meeting_Schedule_ChairMan
    {
        public int ChairMan { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
    public class Meeting_Schedule_Start
    {
        public bool Start { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
    public class Meeting_Schedule_Status
    {
        public int Status { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
    public class Meeting_Schedule_Password
    {
        public string Password { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
    public class Meeting_Schedule_IsPublished
    {
        public bool IsPublished { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
    public class Meeting_Schedule_IsLobby
    {
        public bool IsLobby { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
    public class Meeting_Schedule_ThongKeThanhVien_TheoDonVi
    {
        public int Stt { get; set; }
        public string TenBaoCao { get; set; }
        public string NguoiBaoCao { get; set; }
        public string TenDonVi { get; set; }
        public string TenCuocHop { get; set; }
        public DateTime NgayBaoCao { get; set; }
        public int SoLuong { get; set; }
    }
    public class Meeting_Schedule_ThongKeDanhSachLichHop_ThanhVien
    {
        public int Stt { get; set; }
        public string TenBaoCao { get; set; }
        public string NguoiBaoCao { get; set; }
        public string TenThanhVien { get; set; }
        public DateTime NgayBaoCao { get; set; }
        public int SoLuong { get; set; }
    }
    public class Meeting_Schedule_ThongKeCuocHop_MayChu
    {
        public int Stt { get; set; }
        public string NguoiBaoCao { get; set; }
        public string TenMayChu { get; set; }
        public DateTime NgayBaoCao { get; set; }
        public int SoLuong { get; set; }
    }
    public class Meeting_Schedule_ThongKeLich_TheoDonVi
    {
        private readonly QTHT_HTT_Context _context;
        private readonly IConfiguration _config;
        public Meeting_Schedule_ThongKeLich_TheoDonVi(IConfiguration config)
        {
            _config = config;
        }
        public int Stt { get; set; }
        public string TenBaoCao { get; set; }
        public string TenDonVi { get; set; }
        public string NguoiBaoCao { get; set; }
        public DateTime NgayBaoCao { get; set; }
        public int SoLuong { get; set; }
        public List<Meeting_Schedule_ThongKeLich_TheoDonVi> ThongKeLich_TheoDonVi(QTHT_HTT_Context _context, string username, bool thongketatca, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule_ThongKeLich_TheoDonVi> items = new List<Meeting_Schedule_ThongKeLich_TheoDonVi>();
            //var donvi = _context.thong_tin_don_vi.ToList();
            try
            {
                //var dsdonvi = _context.thong_tin_don_vi.Where(x => x.ma_parent == "G13").ToList();
                var dsdonvi = thongketatca == false ? _context.thong_tin_don_vi.Where(x => x.ma_parent == "G13").ToList() : _context.thong_tin_don_vi.Where(x => x.trangthai_hoatdong == "1").ToList();
                int i = 1;
                foreach (var donvi in dsdonvi)
                {
                    Meeting_Schedule_ThongKeLich_TheoDonVi item = new Meeting_Schedule_ThongKeLich_TheoDonVi(_config);
                    item.Stt = i++;
                    item.TenDonVi = donvi.ten;
                    item.NguoiBaoCao = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == username).Select(x => x.ten_day_du).FirstOrDefault().ToString();
                    item.NgayBaoCao = DateTime.Now;
                    item.SoLuong = LayThongKeTheoDonVi(donvi.id, dateFrom, dateTo);
                    items.Add(item);
                }
            }
            catch
            {

            }


            return items;

        }
        public List<Meeting_Schedule_ThongKeLich_TheoDonVi> ThongKeCuocHopDaDienRa_TheoDonVi(QTHT_HTT_Context _context, string username, bool thongketatca, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule_ThongKeLich_TheoDonVi> items = new List<Meeting_Schedule_ThongKeLich_TheoDonVi>();
            //var donvi = _context.thong_tin_don_vi.ToList();
            try
            {
                //var dsdonvi = _context.thong_tin_don_vi.Where(x => x.ma_parent == "G13").ToList();
                var dsdonvi = thongketatca == false ? _context.thong_tin_don_vi.Where(x => x.ma_parent == "G13").ToList() : _context.thong_tin_don_vi.Where(x => x.trangthai_hoatdong == "1").ToList();
                int i = 1;
                foreach (var donvi in dsdonvi)
                {
                    Meeting_Schedule_ThongKeLich_TheoDonVi item = new Meeting_Schedule_ThongKeLich_TheoDonVi(_config);
                    item.Stt = i++;
                    item.TenDonVi = donvi.ten;
                    item.NguoiBaoCao = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == username).Select(x => x.ten_day_du).FirstOrDefault().ToString();
                    item.NgayBaoCao = DateTime.Now;
                    item.SoLuong = LayThongKeTheoDonViDaKetThuc(donvi.id, dateFrom, dateTo);
                    items.Add(item);
                }
            }
            catch
            {

            }


            return items;

        }
        public List<Meeting_Schedule_ThongKeLich_TheoDonVi> ThongKeLich_TheoDonViId(QTHT_HTT_Context _context, string username, bool thongketatca, int don_vi_id, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule_ThongKeLich_TheoDonVi> items = new List<Meeting_Schedule_ThongKeLich_TheoDonVi>();
            try
            {

                var don_Vi = _context.thong_tin_don_vi.Where(x => x.id == don_vi_id).FirstOrDefault();
                if (don_Vi != null)
                {

                    int i = 1;

                    Meeting_Schedule_ThongKeLich_TheoDonVi item = new Meeting_Schedule_ThongKeLich_TheoDonVi(_config);
                    item.Stt = i++;
                    item.TenDonVi = don_Vi.ten;
                    item.NguoiBaoCao = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == username).Select(x => x.ten_day_du).FirstOrDefault().ToString();
                    item.NgayBaoCao = DateTime.Now;
                    item.SoLuong = LayThongKeTheoDonVi(don_Vi.id, dateFrom, dateTo);
                    items.Add(item);
                }

            }
            catch
            {

            }
            return items;

        }

        public List<Meeting_Schedule_ThongKeLich_TheoDonVi> ThongKeLichHopDangDienRa_TheoDonViId(QTHT_HTT_Context _context, string username, bool thongketatca, int don_vi_id, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule_ThongKeLich_TheoDonVi> items = new List<Meeting_Schedule_ThongKeLich_TheoDonVi>();
            try
            {

                var don_Vi = _context.thong_tin_don_vi.Where(x => x.id == don_vi_id).FirstOrDefault();
                if (don_Vi != null)
                {
                    int i = 1;

                    Meeting_Schedule_ThongKeLich_TheoDonVi item = new Meeting_Schedule_ThongKeLich_TheoDonVi(_config);
                    item.Stt = i++;
                    item.TenDonVi = don_Vi.ten;
                    item.NguoiBaoCao = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == username).Select(x => x.ten_day_du).FirstOrDefault().ToString();
                    item.NgayBaoCao = DateTime.Now;
                    item.SoLuong = LayThongKeCuocHopDangDienRa(don_Vi.id, dateFrom, dateTo);
                    items.Add(item);

                }

            }
            catch
            {

            }
            return items;

        }

        public List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi> ThongKeThanhVienCuocHop(HTT_Context _dataContext, QTHT_HTT_Context _context, string username, bool thongketatca, int don_vi_id, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi> items = new List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi>();
            try
            {
                var list = new MeetingScheduleContext().GetAllDateTime(_context, dateFrom, dateTo);
                foreach (var c in list)
                {
                    var don_Vi = _context.thong_tin_don_vi.Where(x => x.id == don_vi_id).FirstOrDefault();
                    if (don_Vi != null)
                    {
                        int i = 1;

                        Meeting_Schedule_ThongKeThanhVien_TheoDonVi item = new Meeting_Schedule_ThongKeThanhVien_TheoDonVi();
                        item.Stt = i++;
                        item.TenDonVi = don_Vi.ten;
                        item.TenCuocHop = c.Title;
                        item.NguoiBaoCao = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == username).Select(x => x.ten_day_du).FirstOrDefault().ToString();
                        item.NgayBaoCao = DateTime.Now;
                        item.SoLuong = _dataContext.Meeting_Member.Where(x => x.ScheduleId == c.Id).Count();
                        items.Add(item);

                    }
                }
            }
            catch
            {

            }
            return items;

        }
        public List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi> ThongKeThanhVien_CuocHop(HTT_Context _dataContext, QTHT_HTT_Context _context, string username, bool thongketatca, int don_vi_id, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi> items = new List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi>();
            try
            {

                var list = new MeetingScheduleContext().GetAllDateTime(_context, dateFrom, dateTo);
                foreach (var c in list)
                {
                    int count = 0;
                    var don_Vi = _context.thong_tin_don_vi.Where(x => x.id == don_vi_id).FirstOrDefault();
                    if (don_Vi != null)
                    {
                        int i = 1;
                        var list_member = _dataContext.Meeting_Member.Where(x => x.ScheduleId == c.Id && x.Activated == true).ToList();
                        foreach (var member in list_member)
                        {
                            thong_tin_nguoi_dung user = _context.thong_tin_nguoi_dung.Where(x => x.id == member.UserId).FirstOrDefault();
                            var user_don_vi = _context.thong_tin_don_vi.Where(x => x.ma == user.ma_tochuc).Select(x => x.id).FirstOrDefault();
                            if (user_don_vi == don_vi_id)
                            {
                                count++;
                            }
                        }
                        Meeting_Schedule_ThongKeThanhVien_TheoDonVi item = new Meeting_Schedule_ThongKeThanhVien_TheoDonVi();
                        item.Stt = i++;
                        item.TenDonVi = don_Vi.ten;
                        item.TenCuocHop = c.Title;
                        item.NguoiBaoCao = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == username).Select(x => x.ten_day_du).FirstOrDefault().ToString();
                        item.NgayBaoCao = DateTime.Now;
                        item.SoLuong = count;
                        items.Add(item);
                    }
                }
            }
            catch
            {

            }
            return items;

        }

        public List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi> ThongKeThanhVienCuocHopTrucTuyen(HTT_Context _dataContext, QTHT_HTT_Context _context, string username, bool thongketatca, int don_vi_id, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi> items = new List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi>();
            try
            {
                var list = new MeetingScheduleContext().GetListActive(_context, don_vi_id);
                foreach (var c in list)
                {
                    var don_Vi = _context.thong_tin_don_vi.Where(x => x.id == don_vi_id).FirstOrDefault();
                    if (don_Vi != null)
                    {
                        int i = 1;

                        Meeting_Schedule_ThongKeThanhVien_TheoDonVi item = new Meeting_Schedule_ThongKeThanhVien_TheoDonVi();
                        item.Stt = i++;
                        item.TenDonVi = don_Vi.ten;
                        item.TenCuocHop = c.Title;
                        item.NguoiBaoCao = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == username).Select(x => x.ten_day_du).FirstOrDefault().ToString();
                        item.NgayBaoCao = DateTime.Now;
                        item.SoLuong = _dataContext.Meeting_Member.Where(x => x.ScheduleId == c.Id && x.Activated == true).Count();
                        items.Add(item);

                    }
                }



            }
            catch
            {

            }
            return items;

        }
        public List<Meeting_Schedule_ThongKeDanhSachLichHop_ThanhVien> ThongKeDanhSachLichHop(HTT_Context _dataContext, QTHT_HTT_Context _context, int? userId, string username, int don_vi_id, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule_ThongKeDanhSachLichHop_ThanhVien> items = new List<Meeting_Schedule_ThongKeDanhSachLichHop_ThanhVien>();
            try
            {
                var user = _context.thong_tin_nguoi_dung.Where(x => x.id == userId).FirstOrDefault();
                if (user != null)
                {
                    var list = new MeetingScheduleContext().GetListActive(_context, don_vi_id);

                    var don_Vi = _context.thong_tin_don_vi.Where(x => x.id == don_vi_id).FirstOrDefault();
                    if (don_Vi != null)
                    {
                        int i = 1;

                        Meeting_Schedule_ThongKeDanhSachLichHop_ThanhVien item = new Meeting_Schedule_ThongKeDanhSachLichHop_ThanhVien();
                        item.Stt = i++;
                        item.TenThanhVien = user?.ten_day_du;
                        item.NguoiBaoCao = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == username).Select(x => x.ten_day_du).FirstOrDefault().ToString();
                        item.NgayBaoCao = DateTime.Now;
                        item.SoLuong = _dataContext.Meeting_Member
                                .Where(x => x.UserId == userId && x.CreatedDate >= dateFrom && x.CreatedDate <= dateTo)
                                .Select(x => x.ScheduleId)

                                .Count();
                        items.Add(item);

                    }
                }
            }
            catch
            {

            }
            return items;

        }
        public List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi> ThongKeThanhVienCuocHopDaDienRa(HTT_Context _dataContext, QTHT_HTT_Context _context, string username, bool thongketatca, int don_vi_id, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi> items = new List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi>();
            try
            {
                var list = new MeetingScheduleContext().GetListUnactive(_context, don_vi_id);
                foreach (var c in list)
                {
                    var don_Vi = _context.thong_tin_don_vi.Where(x => x.id == don_vi_id).FirstOrDefault();
                    if (don_Vi != null)
                    {
                        int i = 1;

                        Meeting_Schedule_ThongKeThanhVien_TheoDonVi item = new Meeting_Schedule_ThongKeThanhVien_TheoDonVi();
                        item.Stt = i++;
                        item.TenDonVi = don_Vi.ten;
                        item.TenCuocHop = c.Title;
                        item.NguoiBaoCao = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == username).Select(x => x.ten_day_du).FirstOrDefault().ToString();
                        item.NgayBaoCao = DateTime.Now;
                        item.SoLuong = _dataContext.Meeting_Member.Where(x => x.ScheduleId == c.Id && x.Activated == true).Count();
                        items.Add(item);

                    }
                }

            }
            catch
            {

            }
            return items;

        }
        public List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi> ThongKeTaiLieuTheoCuocHop(HTT_Context _dataContext, QTHT_HTT_Context _context, string username, bool thongketatca, int don_vi_id, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi> items = new List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi>();
            try
            {
                var list = new MeetingScheduleContext().GetAllDateTimeDonVi(_context, dateFrom, dateTo, don_vi_id);
                foreach (var c in list)
                {
                    var don_Vi = _context.thong_tin_don_vi.Where(x => x.id == don_vi_id).FirstOrDefault();
                    if (don_Vi != null)
                    {

                        int i = 1;

                        Meeting_Schedule_ThongKeThanhVien_TheoDonVi item = new Meeting_Schedule_ThongKeThanhVien_TheoDonVi();
                        item.Stt = i++;
                        item.TenDonVi = don_Vi.ten;
                        item.TenCuocHop = c.Title;
                        item.NguoiBaoCao = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == username).Select(x => x.ten_day_du).FirstOrDefault().ToString();
                        item.NgayBaoCao = DateTime.Now;
                        item.SoLuong = _dataContext.Meeting_Document.Where(x => x.ScheduleId == c.Id && x.IsDeleted == false).Count();
                        items.Add(item);
                    }
                }



            }
            catch
            {

            }
            return items;

        }
        public List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi> ThongKeKetLuanCuocHop(HTT_Context _dataContext, QTHT_HTT_Context _context, string username, bool thongketatca, int don_vi_id, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi> items = new List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi>();
            try
            {
                var list = new MeetingScheduleContext().GetAllDateTimeDonVi(_context, dateFrom, dateTo, don_vi_id);
                foreach (var c in list)
                {
                    var don_Vi = _context.thong_tin_don_vi.Where(x => x.id == don_vi_id).FirstOrDefault();
                    if (don_Vi != null)
                    {
                        int i = 1;

                        Meeting_Schedule_ThongKeThanhVien_TheoDonVi item = new Meeting_Schedule_ThongKeThanhVien_TheoDonVi();
                        item.Stt = i++;
                        item.TenDonVi = don_Vi.ten;
                        item.TenCuocHop = c.Title;
                        item.NguoiBaoCao = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == username).Select(x => x.ten_day_du).FirstOrDefault().ToString();
                        item.NgayBaoCao = DateTime.Now;
                        item.SoLuong = _dataContext.Meeting_Conclusion.Where(x => x.ScheduleId == c.Id && x.IsDeleted == false).Count();
                        items.Add(item);

                    }
                }



            }
            catch
            {

            }
            return items;

        }
        public List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi> ThongKeGhiHinhCuocHop(HTT_Context _dataContext, QTHT_HTT_Context _context, string username, bool thongketatca, int don_vi_id, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi> items = new List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi>();
            try
            {
                var list = new MeetingScheduleContext().GetAllDateTimeDonVi(_context, dateFrom, dateTo, don_vi_id);
                foreach (var c in list)
                {
                    var don_Vi = _context.thong_tin_don_vi.Where(x => x.id == don_vi_id).FirstOrDefault();
                    if (don_Vi != null)
                    {
                        int i = 1;

                        Meeting_Schedule_ThongKeThanhVien_TheoDonVi item = new Meeting_Schedule_ThongKeThanhVien_TheoDonVi();
                        item.Stt = i++;
                        item.TenDonVi = don_Vi.ten;
                        item.TenCuocHop = c.Title;
                        item.NguoiBaoCao = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == username).Select(x => x.ten_day_du).FirstOrDefault().ToString();
                        item.NgayBaoCao = DateTime.Now;
                        item.SoLuong = _dataContext.Meeting_Video.Where(x => x.ScheduleId == c.Id && x.IsDeleted == false).Count();
                        items.Add(item);

                    }
                }



            }
            catch
            {

            }
            return items;

        }
        public List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi> ThongKeBieuQuyetCuocHop(HTT_Context _dataContext, QTHT_HTT_Context _context, string username, bool thongketatca, int don_vi_id, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi> items = new List<Meeting_Schedule_ThongKeThanhVien_TheoDonVi>();
            try
            {
                var list = new MeetingScheduleContext().GetAllDateTimeDonVi(_context, dateFrom, dateTo, don_vi_id);
                foreach (var c in list)
                {
                    var don_Vi = _context.thong_tin_don_vi.Where(x => x.id == don_vi_id).FirstOrDefault();
                    if (don_Vi != null)
                    {
                        int i = 1;

                        Meeting_Schedule_ThongKeThanhVien_TheoDonVi item = new Meeting_Schedule_ThongKeThanhVien_TheoDonVi();
                        item.Stt = i++;
                        item.TenDonVi = don_Vi.ten;
                        item.TenCuocHop = c.Title;
                        item.NguoiBaoCao = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == username).Select(x => x.ten_day_du).FirstOrDefault().ToString();
                        item.NgayBaoCao = DateTime.Now;
                        item.SoLuong = _dataContext.Meeting_Votes.Where(x => x.ScheduleId == c.Id && x.IsDeleted == false).Count();
                        items.Add(item);

                    }
                }
            }
            catch
            {

            }
            return items;

        }


        public List<Meeting_Schedule_ThongKeCuocHop_MayChu> ThongKeCuocHopTheoMayChu(HTT_Context _dataContext, QTHT_HTT_Context _context, string username, int? id, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule_ThongKeCuocHop_MayChu> items = new List<Meeting_Schedule_ThongKeCuocHop_MayChu>();
            try
            {
                var server = _dataContext.Meeting_Server.Where(x => x.Id == id).FirstOrDefault();
                if (server != null)
                {
                    int i = 1;

                    Meeting_Schedule_ThongKeCuocHop_MayChu item = new Meeting_Schedule_ThongKeCuocHop_MayChu();
                    item.Stt = i++;
                    item.TenMayChu = server.Title;
                    item.NguoiBaoCao = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == username).Select(x => x.ten_day_du).FirstOrDefault().ToString();
                    item.NgayBaoCao = DateTime.Now;
                    item.SoLuong = LayThongKeTheoMayChu(id, dateFrom, dateTo);
                    items.Add(item);
                }
            }
            catch
            {

            }
            return items;

        }

        public List<Meeting_Schedule_ThongKeCuocHop_MayChu> ThongKeCuocHopDaKetThucTheoMayChu(HTT_Context _dataContext, QTHT_HTT_Context _context, string username, int? id, DateTime dateFrom, DateTime dateTo)
        {
            List<Meeting_Schedule_ThongKeCuocHop_MayChu> items = new List<Meeting_Schedule_ThongKeCuocHop_MayChu>();
            try
            {
                var server = _dataContext.Meeting_Server.Where(x => x.Id == id).FirstOrDefault();
                if (server != null)
                {
                    int i = 1;

                    Meeting_Schedule_ThongKeCuocHop_MayChu item = new Meeting_Schedule_ThongKeCuocHop_MayChu();
                    item.Stt = i++;
                    item.TenMayChu = server.Title;
                    item.NguoiBaoCao = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == username).Select(x => x.ten_day_du).FirstOrDefault().ToString();
                    item.NgayBaoCao = DateTime.Now;
                    item.SoLuong = LayThongKeCuocHopDaKetThucTheoMayChu(id, dateFrom, dateTo);
                    items.Add(item);

                }
            }
            catch
            {

            }
            return items;

        }

        public int LayThongKeTheoDonViDaKetThuc(int id, DateTime dateFrom, DateTime dateTo)
        {
            int count = 0;
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_LaySoCuocHop_TheoDonVi_DaKetThuc", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@donvi", SqlDbType.Int).Value = id;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            count = dr.IsDBNull("TotalRecord") == true ? 0 : (int)dr["TotalRecord"];
                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                    }
                }
            }
            catch
            {
                //throw e;
            }

            return count;
        }
        public int LayThongKeCuocHopDangDienRa(int id, DateTime dateFrom, DateTime dateTo)
        {
            int count = 0;
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_LaySoCuocHop_DangDienRa", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@donvi", SqlDbType.Int).Value = id;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            count = dr.IsDBNull("TotalRecord") == true ? 0 : (int)dr["TotalRecord"];
                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                    }
                }
            }
            catch
            {
                //throw e;
            }

            return count;
        }
        public int LayThongKeTheoMayChu(int? id, DateTime dateFrom, DateTime dateTo)
        {
            int count = 0;
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_LaySoCuocHop_TheoMayChu", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@serverid", SqlDbType.Int).Value = id;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            count = dr.IsDBNull("TotalRecord") == true ? 0 : (int)dr["TotalRecord"];
                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                    }
                }
            }
            catch
            {
                //throw e;
            }

            return count;
        }
        public int LayThongKeCuocHopDaKetThucTheoMayChu(int? id, DateTime dateFrom, DateTime dateTo)
        {
            int count = 0;
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_LaySoCuocHopDaKetThuc_TheoMayChu", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@serverid", SqlDbType.Int).Value = id;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            count = dr.IsDBNull("TotalRecord") == true ? 0 : (int)dr["TotalRecord"];
                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                    }
                }
            }
            catch
            {
                //throw e;
            }

            return count;
        }
        public int LayThongKeTheoDonVi(int id, DateTime dateFrom, DateTime dateTo)
        {
            int count = 0;
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_LaySoLich_TheoDonVi", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@donvi", SqlDbType.Int).Value = id;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            count = dr.IsDBNull("TotalRecord") == true ? 0 : (int)dr["TotalRecord"];
                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                    }
                }
            }
            catch
            {
                //throw e;
            }

            return count;
        }
    }
    public class Meeting_Schedule_DiemCau
    {
        private readonly QTHT_HTT_Context _context;
        private readonly IConfiguration _config;
        public Meeting_Schedule_DiemCau(IConfiguration config, int donvi)
        {
            _config = config;
        }
        public int Stt { get; set; }
        public string TenBaoCao { get; set; }
        public string TenLichHop { get; set; }
        public string NguoiBaoCao { get; set; }
        public DateTime NgayBaoCao { get; set; }
        public int SoLuong { get; set; }
        public List<Meeting_Schedule_ThongKeLich_TheoDonVi> ThongKeLich_TheoDonVi(QTHT_HTT_Context _context, string username, bool thongketatca)
        {
            List<Meeting_Schedule_ThongKeLich_TheoDonVi> items = new List<Meeting_Schedule_ThongKeLich_TheoDonVi>();
            var donvilist = _context.thong_tin_don_vi.ToList();
            try
            {
                //var dsdonvi = _context.thong_tin_don_vi.Where(x => x.ma_parent == "G13").ToList();
                var dsdonvi = thongketatca == false ? _context.thong_tin_don_vi.Where(x => x.ma_parent == "G13").ToList() : _context.thong_tin_don_vi.Where(x => x.trangthai_hoatdong == "1").ToList();
                int i = 1;
                foreach (var donvi in dsdonvi)
                {
                    Meeting_Schedule_ThongKeLich_TheoDonVi item = new Meeting_Schedule_ThongKeLich_TheoDonVi(_config);
                    item.Stt = i++;
                    item.TenDonVi = donvi.ten;
                    item.NguoiBaoCao = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == username).Select(x => x.ten_day_du).FirstOrDefault().ToString();
                    item.NgayBaoCao = DateTime.Now;
                    item.SoLuong = LayThongKeTheoDonVi(donvi.id);
                    items.Add(item);
                }
            }
            catch
            {

            }


            return items;

        }
        public int LayThongKeTheoDonVi(int id)
        {
            int count = 0;
            List<Meeting_Schedule> items = new List<Meeting_Schedule>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Schedule_LaySoLich_TheoDonVi", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@donvi", SqlDbType.Int).Value = id;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            count = dr.IsDBNull("TotalRecord") == true ? 0 : (int)dr["TotalRecord"];
                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                    }
                }
            }
            catch
            {
                //throw e;
            }

            return count;
        }


    };
}

