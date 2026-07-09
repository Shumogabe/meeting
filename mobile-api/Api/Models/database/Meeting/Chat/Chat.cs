using System;

namespace QTHT.Api.Models.database.Meeting.Chat
{
    public class Meeting_Chat
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public Guid ScheduleId { get; set; }
        public bool Type { get; set; } //0-publich | 1-private
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public int DeletedBy { get; set; }
    }
    public class Meeting_Chat_Insert
    {
        public string Content { get; set; }
        public Guid ScheduleId { get; set; }
        public bool Type { get; set; } //0-publich | 1-private
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
    }
}
