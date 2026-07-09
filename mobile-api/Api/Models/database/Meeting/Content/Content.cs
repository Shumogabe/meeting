using QTHT.Api.Models;
using QTHT.Api.Models.Admin;
using System;

namespace QTHT.Api.Models.database.Meeting.Content
{
    public class Meeting_Content
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid ScheduleId { get; set; }
        public string Content_ { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int Presenters { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public int DeletedBy { get; set; }
        public UserInfo UserPresenters { get; set; }

    }
    public class Meeting_Content_Insert
    {
        public string Title { get; set; }
        public Guid ScheduleId { get; set; }
        public string Content_ { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int Presenters { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
    }
    public class Meeting_Content_Update
    {
        public string Title { get; set; }
        public string Content_ { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int Presenters { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
    }

}
