using System;
namespace QTHT.Api.Models.database.Meeting.Video
{
    public class Meeting_Video
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid ScheduleId { get; set; }
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
        public bool IsDeleted { get; set; }
    }
    public class Meeting_Video_Insert
    {
        public string Title { get; set; }
        public Guid ScheduleId { get; set; }
        public string Url { get; set; }
        public string OriginalName { get; set; }
        public string SystemName { get; set; }
        public string Type { get; set; }
        public int Size { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
    }
    public class Meeting_Video_Update
    {
        public Guid id { get; set; }
        public string Title { get; set; }
        public Guid ScheduleId { get; set; }
        public string FileUrl { get; set; }
        public string FileOriginalName { get; set; }
        public string FileSystemName { get; set; }
        public int FileSize { get; set; }
        public string FileType { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public bool Status { get; set; }
        public class ViewFileModel
        {
            public string FileName { get; set; }
            public string FileType { get; set; }
            public double FileSize { get; set; }
            public string FileContent { get; set; }
        }
    }
}
