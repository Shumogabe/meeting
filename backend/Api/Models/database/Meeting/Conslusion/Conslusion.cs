using System;

namespace HTT.Api.Models
{
    public class Meeting_Conslusion
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid ScheduleId { get; set; }
        public string Content { get; set; }
        public string Url { get; set; }
        public string OriginalName { get; set; }
        public string SystemName { get; set; }
        public string Type { get; set; }
        public int Size { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public int DeletedBy { get; set; }
        public int Status { get; set; }
        public bool IsDeleted { get; set; }
    }

    public class Meeting_Conslusion_Insert
    {
        public string Title { get; set; }
        public Guid ScheduleId { get; set; }
        public string Content { get; set; }
        public string Url { get; set; }
        public string OriginalName { get; set; }
        public string SystemName { get; set; }
        public string Type { get; set; }
        public int Size { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public int DeletedBy { get; set; }
        public int Status { get; set; }
    }
}