using DocumentFormat.OpenXml.Office2010.ExcelAc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HTT.Api.Models
{
    public class Meeting_Voted
    {
        [Key]
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public Guid? VoteId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int? DeletedBy { get; set; }
        public bool? IsCreatedByAd { get; set; }
        [NotMapped] public int? count { get; set; }
        [NotMapped] public int? Vote { get; set; }
        [NotMapped] public thong_tin_nguoi_dung? UserCreatedBy { get; set; }

    }
    public class Meeting_Voted_Detail
    {
        public int TotalVoted { get; set; }
        public int TotalMember { get; set; }
        public int TotalUnvoted { get; set; }
        public List<thong_tin_nguoi_dung> Member { get; set; } = new List<thong_tin_nguoi_dung>();

    }
    public class Meeting_Voted_Insert
    {
        public string Title { get; set; }
        public Guid VoteId { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public bool IsCreatedByAd { get; set; }
    }
    public class Meeting_Voted_Update
    {
        public string Title { get; set; }
        public Guid VoteId { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
    }
    public class Meeting_Voted_Chart
    {
        public string Title { get; set; }
        public Guid VoteId { get; set; }
        public int Vote { get; set; }
    }
}
