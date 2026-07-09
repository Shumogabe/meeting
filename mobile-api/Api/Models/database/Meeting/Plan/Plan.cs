using System;
using System.ComponentModel.DataAnnotations;

namespace HTT.Api.Models
{
    public class Meeting_Plan
    {
        [Key]
        public Guid Id { get; set; }
        public string? Symbol { get; set; }
        public string? Abstract { get; set; }
        public string? Content { get; set; }
        public DateTime? DateIssued { get; set; }
        public string? AgencyIssued { get; set; }   
        public string? Signer { get; set; }
        public DateTime? EffectiveDate { get; set; }
        public string? File { get; set; }
        public int? Status { get; set; } // 1-Đang chờ duyệt | 2-Chưa duyêt | 3-Đã duyệt   
        public string? ApprovedBy { get; set; }
        public string? BelongToUnit { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set;}
        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public bool? IsDeleted { get; set; } 
        public int? don_vi { get;set; }

    }
    public class Meeting_Plan_Insert
    {
        public string Symbol { get; set; }
        public string Abstract { get; set; }
        public string Content { get; set; }
        public DateTime DateIssued { get; set; }
        public string AgencyIssued { get; set; }   
        public string Signer { get; set; }
        public DateTime EffectiveDate { get; set; }
        public string File { get; set; }
        public int Status { get; set; } // 1-Đang chờ duyệt | 2-Đã duyệt   
        public string ApprovedBy { get; set; }
        public string BelongToUnit { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set;}
        
    }
    public class Meeting_Plan_Update
    {
        public Guid Id { get; set; }
        public string Symbol { get; set; }
        public string Abstract { get; set; }
        public string Content { get; set; }
        public DateTime DateIssued { get; set; }
        public string AgencyIssued { get; set; }
        public string Signer { get; set; }
        public DateTime EffectiveDate { get; set; }
        public string File { get; set; }
        public int Status { get; set; } // 1-Đang chờ duyệt | 2-Đã duyệt   
        public string ApprovedBy { get; set; }
        public string BelongToUnit { get; set; }
        public DateTime ModifiedDate { get;set; }
        public int ModifiedBy { get;set;}
    }
    public class Meeting_Plan_Delete
    {
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
    }
    public class Meeting_Plan_Status
    {
        public int Status { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
