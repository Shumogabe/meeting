using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using HTT.Api.Utils;
using System.Collections.Generic;

namespace HTT.Api.Models
{
    public class input_dangky
    {
        public string ho_ten { get; set; }
        public string mobile { get; set; }
        public string email { get; set; }
        public Int64? don_vi_id { get; set; }
        public Int64? chuc_vu_id { get; set; }
        public string don_vi_name { get; set; }
        public string address { get; set; }
    }
    public class input_doi_thong_tin
    {
        public Int64 tai_khoan_id { get; set; }
        public Int64 don_vi_id { get; set; }
        public string mobile { get; set; }
        public string email { get; set; }
        public string otp { get; set; }
    }
    public class input_doi_mat_khau
    {
        public Int64 tai_khoan_id { get; set; }
        public string mat_khau_cu { get; set; }
        public string mat_khau { get; set; }
        public string otp { get; set; }
    }
    public class input_doi_mat_khau_KHCN
    {
        public string ad_user_name { get; set; }
        public string mat_khau_cu { get; set; }
        public string mat_khau { get; set; }
        public string otp { get; set; }
    }
    public class input_khoi_phuc_mat_khau
    {
        public string mat_khau { get; set; }
        public string email { get; set; }
        public string username { get; set; }
        public string otp { get; set; }
    }
    public class cau_hinh_he_thong_input
    {
        public int? id { get; set; }
        public thong_so thong_so { get; set; }
        public int su_dung { get; set; }
    }
    public class thong_so
    {
        public email_config_detail email_config_detail { get; set; }
    }
    public class email_config_detail
    {
        public string contact_name { get; set; }
        public string contact_address { get; set; }
        public string contact_mobile { get; set; }
        public string contact_email { get; set; }
        public string domain { get; set; }
        public string email_name { get; set; }
        public string email_smtp { get; set; }
        public int email_port { get; set; }
        public bool email_ssl { get; set; }
        public string sender_user { get; set; }
        public string sender_email { get; set; }
        public string sender_password { get; set; }
        public string sender_app { get; set; }
    }
    public class he_thong_dinh_danh_input
    {
        public Int64? id { get; set; }
        public string ten { get; set; }
        public string mo_ta { get; set; }
        public string url { get; set; }
        public string domain { get; set; }
        public string default_ou { get; set; }
        public string default_root_ou { get; set; }
        public string service_user { get; set; }
        public string service_password { get; set; }
        /// <summary>
        /// 1: rồi, 2: chưa
        /// </summary>
        public int kich_hoat { get; set; }
    }
    public class he_thong_sms_input
    {
        public Int64? id { get; set; }
        public string ten { get; set; }
        public string mo_ta { get; set; }
        public thong_tin_he_thong_sms thong_tin { get; set; }
        /// <summary>
        /// 1: rồi, 2: chưa
        /// </summary>
        public int kich_hoat { get; set; }
    }
    public class thong_tin_he_thong_sms
    {
        public string api { get; set; }
    }
    public class thiet_bi_sms_input
    {
        public Int64? id { get; set; }
        public string ten { get; set; }
        public string mo_ta { get; set; }
        public thong_tin_thiet_bi_sms thong_tin { get; set; }
        /// <summary>
        /// 1: rồi, 2: chưa
        /// </summary>
        public int kich_hoat { get; set; }
    }
    public class thong_tin_thiet_bi_sms
    {
        /// <summary>
        /// địa chỉ ip
        /// </summary>
        public string ip { get; set; }
        /// <summary>
        /// cổng
        /// </summary>
        public string port { get; set; }
        /// <summary>
        /// tài khoản
        /// </summary>
        public string user { get; set; }
        /// <summary>
        /// mật khẩu
        /// </summary>
        public string pass { get; set; }
        /// <summary>
        /// số điện thoại
        /// </summary>
        public string mobile { get; set; }
    }
    public class cau_hinh_canh_bao_input
    {
        public Int64? id { get; set; }
        public string ten { get; set; }
        public string mo_ta { get; set; }
        /// <summary>
        /// "loại cảnh báo:
        /// multi: nhiều lần
        /// foreign: nước ngoài
        /// change_pass: đổi pass
        /// multi_incorrect: sai pass nhiều lần
        /// no_use: ko sử dụng
        /// special_time: giờ đặc biệt"
        /// </summary>
        public string loai { get; set; }
        /// <summary>
        /// số lần đăng nhập sẽ cảnh báo
        /// hiển thị khi người dùng chọn loai: multi
        /// </summary>
        public int so_lan_login { get; set; }
        /// <summary>
        /// số lần đăng nhập thất bại sẽ cảnh báo
        /// hiển thị khi người dùng chọn loai: multi_incorrect
        /// </summary>
        public int so_lan_sai_pass { get; set; }
        /// <summary>
        /// danh sách ip nước ngoài, cách nhau  bởi dấy, ví duh
        /// hiển thị khi người dùng chọn loai: foreign
        /// </summary>
        public string ip_nuoc_ngoai_ds { get; set; }
        /// <summary>
        /// danh sách khung giờ đặc biệt, cách nhau bởi dấu phẩy, ví dụ: [2-4],[20-23]
        /// hiển thị khi người dùng chọn loai: special_time
        /// </summary>
        public string khung_gio_dac_biet_ds { get; set; }
        /// <summary>
        /// 1: không thông báo, 2: có thông báo
        /// </summary>
        public int kich_hoat { get; set; }
    }
    public class multi_login
    {
        /// <summary>
        /// Tài khoản
        /// </summary>
        public string tai_khoan { get; set; }
        /// <summary>
        /// số lần đăng nhập
        /// </summary>
        public int so_lan_dang_nhap { get; set; }

    }
    public class change_pass_login
    {
        /// <summary>
        /// Tài khoản
        /// </summary>
        public string tai_khoan { get; set; }
        /// <summary>
        /// Thời gian đổi
        /// </summary>
        public Int64 time_doi { get; set; }

    }
    public class disable
    {
        /// <summary>
        /// Tên đăng nhập
        /// </summary>
        public string ad_user_name { get; set; }
        /// <summary>
        /// Họ tên
        /// </summary>
        public string ho_ten { get; set; }
    }
    public class special_time
    {
        public Int64 id { get; set; }
        public string user_name { get; set; }
        public string service_provider_name { get; set; }
        public string remote_address { get; set; }
        public DateTime time { get; set; }
        public int hour { get; set; }
    }
    public partial class to_chuc_and_chuc_vu_Request
    {
        public int limit { get; set; }
        public string? anchor { get; set; }
        public string? tu_khoa { get; set; }
        public string? trangthai_hoatdong { get; set; }
        public string? trangthai_xoa { get; set; }
    }
    public partial class CommonRequest
    {
        public int limit { get; set; }
        public string? anchor { get; set; }
        public string? tu_khoa { get; set; }
        public string? don_vi { get; set; }
        public string? tai_khoan { get; set; }
        public int? filter_time_from { get; set; }
        public int? filter_time_to { get; set; }
        public string? trangthai_xoa { get; set; }
    }
    public partial class CommonList
    {
        public int limit { get; set; }
        public string? anchor { get; set; }
        public Int64 count { get; set; }
    }
    public class wso2is_config
    {
        public string usr { get; set; }
        public string pw { get; set; }
    }
    public class wso2is_config_detail
    {
        public string usr { get; set; }
        public string pw { get; set; }
    }
    public class tl_ch_hethong
    {
        [Key] public Guid Id { get; set; }
        public string? tenhienthi { get; set; }
        public string? tencauhinh { get; set; }
        public string? giatri { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
        [NotMapped] public string? trangthai_hoatdong { get; set; }
        [NotMapped] public long? thoigian_tao { get; set; } = Util.DateTimeToUnixTimeStamp(DateTime.Now);
        public void Deserialize()
        {
            if (CreatedDate != null && CreatedDate != default)
            {
                thoigian_tao = Util.DateTimeToUnixTimeStamp(CreatedDate.Value);
            }
        }
    }
    public class tl_ch_thongbaolichhop
    {
        [Key] public Guid Id { get; set; }
        public string? tenhienthi { get; set; }
        public string? tencauhinh { get; set; }
        public string? giatri { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class tl_ch_kehoach
    {
        [Key] public Guid Id { get; set; }
        public string? tenhienthi { get; set; }
        public string? tencauhinh { get; set; }
        public string? giatri { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class tl_ch_chuongtrinh
    {
        [Key] public Guid Id { get; set; }
        public string? tenhienthi { get; set; }
        public string? tencauhinh { get; set; }
        public string? giatri { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class tl_ch_tailieuhop
    {
        [Key] public Guid Id { get; set; }
        public string? tenhienthi { get; set; }
        public string? tencauhinh { get; set; }
        public string? giatri { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class tl_ch_thanhphanthamgia
    {
        [Key] public Guid Id { get; set; }
        public string? tenhienthi { get; set; }
        public string? tencauhinh { get; set; }
        public string? giatri { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class tl_ch_bieuquyet
    {
        [Key] public Guid Id { get; set; }
        public string? tenhienthi { get; set; }
        public string? tencauhinh { get; set; }
        public string? giatri { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class tl_ch_baocaothongke
    {
        [Key] public Guid Id { get; set; }
        public string? tenhienthi { get; set; }
        public string? tencauhinh { get; set; }
        public string? giatri { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class tl_ch_sukien
    {
        [Key] public Guid Id { get; set; }
        public string? tenhienthi { get; set; }
        public string? tencauhinh { get; set; }
        public string? giatri { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class tl_ch_nguoidung
    {
        [Key] public Guid Id { get; set; }
        public string? tenhienthi { get; set; }
        public string? tencauhinh { get; set; }
        public string? giatri { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
    }    
    public partial class tl_ch_hethongs : CommonList
    {
        public List<tl_ch_hethong>? Records { get; set; }
    }
    public class tl_ch_dichvusms
    {
        [Key] public Guid Id { get; set; }
        public string? tenhienthi { get; set; }
        public string? tencauhinh { get; set; }
        public string? giatri { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
    }    
    public class tl_ch_thoigiancho
    {
        [Key] public Guid Id { get; set; }
        public string? tenhienthi { get; set; }
        public string? tencauhinh { get; set; }
        public string? giatri { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public string? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class Login
    {
        public string username { get; set; }
        public string password { get; set; }
        public bool rememberme { get; set; }
    }
}
