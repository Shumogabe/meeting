using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace HTT.Api.Models
{
    public class Meeting_Votes
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public bool Status { get; set; }
        public bool Type { get; set; } // 0:radio, 1:checkbox
        public bool End { get; set; }
        public Guid ScheduleId { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public int DeletedBy { get; set; }
        public bool IsDeleted { get; set; }
        public List<Meeting_Voted> Meetingvoted { get; set; } = new List<Meeting_Voted>();
        [NotMapped] public List<Meeting_Voted> MeetingVoted { get; set; } = new List<Meeting_Voted>();
        [NotMapped] public List<Meeting_Voted_Chart> MeetingVotedCount { get; set; } = new List<Meeting_Voted_Chart>();
        public int count { get; set; }
    }
    public class Meeting_Votes_Insert
    {
        public string Title { get; set; }
        public bool Status { get; set; }
        public bool Type { get; set; }
        public bool End { get; set; }
        public Guid ScheduleId { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
    }
    public class Meeting_Votes_Update
    {
        public string Title { get; set; }
        public Guid ScheduleId { get; set; }
        public bool Type { get; set; }
        public bool Status { get; set; }
        public bool End { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
    }
    public class Meeting_Votes_Status_Update
    {
        public bool Status { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
    }
    public class Meeting_Votes_End_Update
    {
        public bool End { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
    }
    public class Meeting_Votes_Type_Update
    {
        public bool Type { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
    }
}
