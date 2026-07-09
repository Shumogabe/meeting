using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace HTT.Api.Models
{
    public class Meeting_Member
    {
        public Guid Id { get; set; }
        public Guid ScheduleId { get; set; }
        public int? UserId { get; set; }
        public string? Email { get; set; }
        public bool? Activated { get; set; } //0-F | 1-T
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int? DeletedBy { get; set; }
        [NotMapped] public thong_tin_nguoi_dung? user { get; set; }
    }
    public class Meeting_Member_Insert
    {
        public Guid ScheduleId { get; set; }
        public int UserId { get; set; }
        public string Email { get; set; }
        public bool Activated { get; set; } //0-F | 1-T
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }  
    }

    public class Meeting_Member_Update
    {
        public Guid id { get; set; }
        public Guid ScheduleId { get; set; }
        public int UserId { get; set; }
        public string Email { get; set; }
        public bool Activated { get; set; } //0-F | 1-T
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
    }
}
