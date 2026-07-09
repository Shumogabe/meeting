using System.Collections.Generic;

namespace QTHT.Api.Models
{
    public class thong_ke_tai_khoan
    {
        public int tong { get; set; }
        public List<tai_khoan_thong_ke> danh_sach { get; set; }
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

    public class foreign_Report
    {
        public foreign_Report(List<lich_su_login> solieu)
        {
            this.solieu = solieu;
        }

        public List<lich_su_login> solieu { get; set; }
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
}