using QTHT.Api.Models;
using QTHT.Api.Models.Admin;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QTHT.Api.Models.database.Meeting.Member
{
    public class Meeting_Member
    {
        [Key]
        public Guid Id { get; set; }
        public Guid ScheduleId { get; set; }
        public int UserId { get; set; }
        public string Email { get; set; }
        public bool Activated { get; set; } //0-F | 1-T
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int? DeletedBy { get; set; }
        [NotMapped]public UserInfo? User { get; set; }
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
}
