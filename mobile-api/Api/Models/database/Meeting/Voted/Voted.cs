using DocumentFormat.OpenXml.Office2010.ExcelAc;
using QTHT.Api.Models.database.Meeting.Votes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QTHT.Api.Models.database.Meeting.Voted
{
    public class Meeting_Voted
    {
        
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
        [NotMapped]
        public int? count { get; set; }
        
    }
    public class Meeting_Voted_Insert
    {
        public string Title { get; set; }
        public Guid VoteId { get; set; }
        public int CreatedBy { get; set; }
        public bool IsCreatedByAd { get; set; }
    }
    public class Meeting_Voted_Update
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid VoteId { get; set; }
    }

}
