using System;

namespace QTHT.Api.Models.database.thong_ke
{
    public class thong_ke
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int TypeId { get; set; }
        public string FileUrl { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public bool IsDeleted { get; set; }
        public int Status { get; set; }

        ///
    }

    public class thongke_hoinghihoithao
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
        public int? don_vi { get; set; }
    }

    public class thongke_dinhki
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public bool IsDeleted { get; set; }
        public int Status { get; set; }
    }
    public class thongke_diemcau
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
        public int? don_vi { get; set; }
    }
    public class thongke_tonghop
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
        public int? don_vi { get; set; }
    }
    public class thongke_tongsocuochopdangdienra
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public bool IsDeleted { get; set; }
        public int Status { get; set; }
    }
    public class thongke_socuochoptheolichsutrentongthehethong
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public bool IsDeleted { get; set; }
        public int Status { get; set; }
    }
    public class thongke_tongsocuochoptrentungmaychu
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public bool IsDeleted { get; set; }
        public int Status { get; set; }
    }
    public class thongke_socuochoptheolichsutrentungmaychu
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public bool IsDeleted { get; set; }
        public int Status { get; set; }
    }
    public class thongke_tongsonguoithamgiacuochoptheolichsu
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public bool IsDeleted { get; set; }
        public int Status { get; set; }
    }
    public class thongke_songuoithamgiatrongmotcuochop
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public bool IsDeleted { get; set; }
        public int Status { get; set; }
    }
    public class thongke_socuochopcuamotdaibieuthamgiadenthoidiemhientai
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public bool IsDeleted { get; set; }
        public int Status { get; set; }
    }

    public class thongke_tailieuhopcaccuochop
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public bool IsDeleted { get; set; }
        public int Status { get; set; }
    }
    public class thongke_ghihinhcuochop
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
        public int? don_vi { get; set; }
    }
    public class thongke_bieuquyet
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
        public int? don_vi { get; set; }
    }
    public class thongke_ketluancuochop
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public bool IsDeleted { get; set; }
        public int Status { get; set; }
    }
}
