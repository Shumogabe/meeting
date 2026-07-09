using System;
using System.Collections.Generic;

namespace HTT.Api.Models
{
    public class thong_ke_tai_khoan
    {
        public int tong { get; set; }
        public List<tai_khoan_thong_ke> danh_sach { get; set; }
    }

    public class thong_ke_request_time
    {
        public DateTime dateFrom { get; set; }
        public DateTime dateTo { get; set; }
        public int? id { get; set; }
    }

    public class tai_khoan_Report
    {
        public tai_khoan_Report(List<tai_khoan_thong_ke> solieu)
        {
            this.solieu = solieu;
        }

        public List<tai_khoan_thong_ke> solieu { get; set; }
    }

    public class tai_khoan_thong_ke
    {
        /// <summary>
        /// Hộ tên
        /// </summary>
        public string ho_ten { get; set; }

        /// <summary>
        /// Điện thoại
        /// </summary>
        public string mobile { get; set; }

        /// <summary>
        /// email
        /// </summary>
        public string email { get; set; }

        /// <summary>
		/// tên đăng nhập
		/// </summary>
        public string ad_user_name { get; set; }
    }

    public class multi_login_Report
    {
        public multi_login_Report(List<multi_login> solieu)
        {
            this.solieu = solieu;
        }

        public List<multi_login> solieu { get; set; }
    }

    public class multi_incorrect_Report
    {
        public multi_incorrect_Report(List<multi_login> solieu)
        {
            this.solieu = solieu;
        }

        public List<multi_login> solieu { get; set; }
    }

    public class disable_Report
    {
        public disable_Report(List<disable> solieu)
        {
            this.solieu = solieu;
        }

        public List<disable> solieu { get; set; }
    }

    #region lịch họp
    public class MeetingScheduleStatistic
    {
        public DateTime Date { get; set; }
        public int Count { get; set; }
    }
    #endregion
    #region biểu quyết
    public class MeetingVotesStatistic
    {
        public DateTime Date { get; set; }
        public int Count { get; set; }
    }
    #endregion
    #region điểm cầu
    public class MeetingServerStatistic
    {
        public DateTime Date { get; set; }
        public int Count { get; set; }
        
    }

    #endregion
    #region thống kê tổng hợp
    public class ThongKeTongHopStatistic
    {
        public DateTime Date { get; set; }
        public int Count { get; set; }

    }
    public class ThongKeTongSoNguoiThamGiaCuocHopDangDienRa
    {
        public string Name { get; set; }
        public int Count { get; set; }
    }
    public class ThongKeSoNguoiThamGiaCuocHop
    {
        public string Name { get; set; }
        public int MemberCount { get; set; }
    }
    public class ThongKeCuocHop
    {
        public string dayDate { get; set; }   
        public int Count { get; set; }
    }
    public class ThongKeTaiLieu
    {
        public string dayDate { get; set; }
        public int Count { get; set; }
    }

    public class ThongKeThamGiaCuocHop
    {
        public string RoomName { get; set; }
        public Guid Id { get; set; }    
    }
    #endregion
}