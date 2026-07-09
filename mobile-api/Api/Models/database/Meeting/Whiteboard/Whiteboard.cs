using System;
using System.ComponentModel.DataAnnotations;

namespace QTHT.Api.Models.database.Meeting.Whiteboard
{
    public class Whiteboard
    {
        public class Meeting_Whiteboard
        {
            [Key]
            public Guid Id { get; set; }
            public string? Title { get; set; }
            public Guid? ScheduleId { get; set; }
            public string? Content { get; set; }         
            public DateTime? CreatedDate { get; set; }
            public int? CreatedBy { get; set; }
            public DateTime? ModifiedDate { get; set; }
            public int? ModifiedBy { get; set; }
            public DateTime? DeletedDate { get; set; }
            public int? DeletedBy { get; set; }            

        }
        public class Meeting_Whiteboard_Insert
        {
            public string Title { get; set; }
            public Guid ScheduleId { get; set; }
            public string Content { get; set; }
        }
        public class Meeting_Whiteboard_Update
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Content { get; set; }
            public Guid ScheduleId { get; set; }
        }
    }
}
