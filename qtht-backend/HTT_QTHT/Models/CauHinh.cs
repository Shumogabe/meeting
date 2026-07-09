using HTT_QTHT.Api.Utils;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HTT_QTHT.Models
{
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
    public class tl_ch_lichhop
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
        [NotMapped] public long? thoigian_tao { get; set; } = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
        public void Deserialize()
        {
            if (CreatedDate != null && CreatedDate != default)
            {
                thoigian_tao = Utils.DateTimeToUnixTimeStamp(CreatedDate.Value);
            }
        }
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
    public class CauHinhItem
    {
        public string tenhienthi { get; set; }
        public string tencauhinh { get; set; }
        public string giatri { get; set; }
    }

    //Them - Sua
    public class tl_ch_Insert
    {
        public string tenhienthi { get; set; }
        public string tencauhinh { get; set; }
        public string giatri { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class tl_ch_Update
    {
        public Guid Id { get; set; }
        public string tenhienthi { get; set; }
        public string tencauhinh { get; set; }
        public string giatri { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string? ModifiedBy { get; set; }
    }
}
