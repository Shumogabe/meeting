using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace HTT_QTHT.Models
{
    public partial class thumuc_and_teptin_Request
    {
        public int limit { get; set; }
        public string? anchor { get; set; }
        public string? tu_khoa { get; set; }
        public string? thumuc { get; set; }
        public string? don_vi { get; set; }
        public int? filter_time_from { get; set; }
        public int? filter_time_to { get; set; }
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
    public partial class to_chuc_and_chuc_vu_Request
    {
        public int limit { get; set; }
        public string? anchor { get; set; }
        public string? tu_khoa { get; set; }
        public string? trangthai_hoatdong { get; set; }
        public string? trangthai_xoa { get; set; }
    }
    public partial class giamsat_truycap_Request
    {
        public int limit { get; set; }
        public string? anchor { get; set; }
        public string? tu_khoa { get; set; }
        public string? trangthai_xoa { get; set; }
    }
    public partial class nhat_ky_request
    {
        public int limit { get; set; }
        public string? anchor { get; set; }
        public string? tu_khoa { get; set; }
        public int? filter_time_from { get; set; }
        public int? filter_time_to { get; set; }
        public string? loai_hoatdong { get; set; }//loai_hoatdong=them,sua,xoa,dinhchi,kichhoat
        public string? chuc_nang { get; set; }//tk_ccvc,tk_tochuc,tk_admin
        public string? don_vi { get; set; }
        public string? tai_khoan { get; set; }
    }
    public class Statistic
    {
        public Int64 Date { get; set; }
        public int Count { get; set; }
    }
    public partial class CommonList
    {
        public int limit { get; set; }
        public string? anchor { get; set; }
        public Int64 count { get; set; }
    }
    public partial class thong_so
    {
        public string? email { get; set; }
        public string? so_dienthoai { get; set; }
    }
    public partial class bangdulieu
    {
        [Key] public string? ma { get; set; }
        public string? ten_bang { get; set; }
        public Int64 thoigian_saoluu { get; set; }
    }
    public partial class bangdulieus : CommonList
    {
        public List<bangdulieu>? Records { get; set; }
    }
    public partial class thumuc
    {
        [Key] public string? ma { get; set; }
        public string? ten { get; set; }
        public Int64 thoigian_saoluu { get; set; }
    }
    public partial class thumucs : CommonList
    {
        public List<thumuc>? Records { get; set; }
    }
    public partial class teptin
    {
        [Key] public string? ma { get; set; }
        public string? ten { get; set; }
        public Int64 thoigian_saoluu { get; set; }
    }
    public partial class teptins : CommonList
    {
        public List<teptin>? Records { get; set; }
    }

    #region Thongke
    public partial class tonghop_ls_thongke
    {
        public string? ma { get; set; }//tendangnhap_thoiigian
        public string? ten { get; set; }
        public string? ten_dangnhap { get; set; }
        public string? don_vi { get; set; }
        public DateTime thoigian { get; set; } = DateTime.Now;
        public string? noi_dung { get; set; }
        public string? nguoi_duyet { get; set; } //ls_pheduyet_dk_tk_ccvc,ls_pheduyet_dk_tk_tochuc,ls_pheduyet_dk_bosung_tk_ccvc,ls_pheduyet_dk_bosung_tk_tochucls_pheduyet_dk_huy_tk_ccvc,
        public string? trang_thai_duyet { get; set; }//ls_pheduyet_dk_tk_ccvc,ls_pheduyet_dk_tk_tochuc,ls_pheduyet_dk_bosung_tk_ccvc,ls_pheduyet_dk_bosung_tk_tochuc,ls_pheduyet_dk_huy_tk_ccvc
        public string? ten_bang { get; set; }


    }
    public class lgsp_app
    {
        public string applicationId { get; set; }
        public string name { get; set; }
        public string throttlingPolicy { get; set; }
        public string tokenType { get; set; }
        public string description { get; set; }
    }
    #endregion

    #region User from WSO2
    public class Meta
    {
        public DateTime created { get; set; }
        public string location { get; set; }
        public DateTime lastModified { get; set; }
        public string resourceType { get; set; }
    }

    public class Name
    {
        public string givenName { get; set; }
        public string familyName { get; set; }
    }

    public class Role
    {
        public string audienceValue { get; set; }
        public string display { get; set; }
        public string audienceType { get; set; }
        public string value { get; set; }

        [JsonProperty("$ref")]
        public string @ref { get; set; }
        public string audienceDisplay { get; set; }
    }

    public class RootUser
    {
        public List<string> emails { get; set; }
        public Meta meta { get; set; }
        public List<string> schemas { get; set; }
        public List<Role> roles { get; set; }
        public Name name { get; set; }
        public string id { get; set; }
        public string userName { get; set; }
    }


    public partial class UserUpdate
    {
        public string? userID { get; set; }
        public string? userName { get; set; }
        public string? firstName { get; set; }
        public string? lastName { get; set; }
        public string? emails { get; set; }
        public string? phoneNumbers { get; set; }
        public string? mobile { get; set; }
    }
    #endregion

    #region roles from WSO2

    public class Audience
    {
        public string? display { get; set; }
        public string? type { get; set; }
        public string? value { get; set; }
    }

    public class MetaRole
    {
        public string? location { get; set; }
    }

    public class ResourceRole
    {
        public Audience? audience { get; set; }
        public string? displayName { get; set; }
        public MetaRole? meta { get; set; }
        public string? id { get; set; }
    }

    public class Roles
    {
        public int totalResults { get; set; }
        public int startIndex { get; set; }
        public int itemsPerPage { get; set; }
        public List<string>? schemas { get; set; }
        public List<ResourceRole>? resources { get; set; }
    }
    public partial class RoleUpdate
    {
        public string? id { get; set; }
        public string? displayName { get; set; }
    }
    public partial class RoleCreate
    {
        public string? displayName { get; set; }
    }

    #endregion

}