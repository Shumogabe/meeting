using System;
using System.ComponentModel.DataAnnotations;

namespace HTT.Api.Models
{
    public class thong_ke
    {
        [Key] public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? TypeId { get; set; }
        public string? FileUrl { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class thongke_hoinghihoithao
    {
        [Key] public Guid Id { get; set; }
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
    public class thongke_lichhop
    {
        [Key] public Guid Id { get; set; } 
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
        public int? Status { get; set; }    
    }
    public class thongke_dinhky
    {
        [Key] public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? FileUrl { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class thongke_diemcau
    {
        [Key] public Guid Id { get; set; }
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
        public int? Status { get; set; }
    }
    public class thongke_tonghop
    {
        [Key] public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public string? FileUrl { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
        public int? don_vi { get; set; }
        public int? Status { get; set; }   
    }
    public class thongke_tongsocuochopdangdienra
    {
        [Key] public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class thongke_socuochoptheolichsutrentongthehethong
    {
        [Key] public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class thongke_tongsocuochoptrentungmaychu
    {
        [Key] public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class thongke_socuochoptheolichsutrentungmaychu
    {
        [Key] public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class thongke_tongsonguoithamgiacuochoptheolichsu
    {
        [Key] public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class thongke_thongketongsonguoithamgiacuochopdangdienra
    {
        [Key] public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class thongke_songuoithamgiatrongmotcuochop
    {
        [Key] public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class thongke_socuochopcuamotdaibieuthamgiadenthoidiemhientai
    {
        [Key] public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class thongke_tailieuhopcaccuochop
    {
        [Key] public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class thongke_ghihinhcuochop
    {
        [Key] public Guid Id { get; set; }
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
        [Key] public Guid Id { get; set; }
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
        public int? Status { get; set; }    
    }
    public class thongke_ketluancuochop
    {
        [Key] public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; }
    }
}
