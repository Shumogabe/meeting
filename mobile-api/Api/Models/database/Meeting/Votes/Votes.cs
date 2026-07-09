using DocumentFormat.OpenXml.Office2010.ExcelAc;
using QTHT.Api.Models.database.Meeting.Schedule;
using QTHT.Api.Models.database.Meeting.Voted;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QTHT.Api.Models.database.Meeting.Votes
{
    public class Meeting_Votes
    {
        [Key]
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public Guid ScheduleId { get; set; }
        public bool? Status { get; set; }
        public bool? Type { get; set; } //0 |radio(chọn 1) -1|checkbox (chọn nhiều)
        public bool? End { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
        [NotMapped]
        public List<Meeting_Voted>? Meetingvoted { get; set; } = new List<Meeting_Voted>();
        public List<Meeting_Voted>? myvoted { get; set; } = new List<Meeting_Voted>();
    }
    public class Meeting_Votes_Insert
    {
        public string Title { get; set; }
        public bool Status { get; set; }
        public bool Type { get; set; }
        public bool End { get; set; }
        public Guid ScheduleId { get; set; }

    }
    public class Meeting_Votes_Update
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid ScheduleId { get; set; }
        public bool Type { get; set; }
        public bool Status { get; set; }
        public bool End{get; set;}

    }

    public class Meeting_Votes_End_Update
    {
        public bool End { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
    }
}
