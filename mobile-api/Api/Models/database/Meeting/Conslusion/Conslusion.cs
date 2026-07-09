using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QTHT.Api.Models.database.Meeting.Conslusion
{
    public class Meeting_Conclusion
    {
        [Key]
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public Guid? ScheduleId { get; set; }
        public string? Content { get; set; }
        public string? FileUrl { get; set; }
        public string? FileOriginalName { get; set; }
        public string? FileSystemName { get; set; }
        public string? FileType { get; set; }
        public int? FileSize { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
        public int? Status { get; set; }
    }

    public class Meeting_Conclusion_Insert
    {
        public string Title { get; set; }
        public Guid ScheduleId { get; set; }
        public string Content { get; set; }
        public string FileUrl { get; set; }
        public string FileOriginalName { get; set; }
        public string FileSystemName { get; set; }
        public string FileType { get; set; }
        public int FileSize { get; set; }
        public bool IsDeleted { get; set; } = false;    
        public bool Status { get; set; }
    }
    public class Meeting_Conclusion_Update
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid ScheduleId { get; set; }
        public string Content { get; set; }
        public string FileUrl { get; set; }
        public string FileOriginalName { get; set; }
        public string FileSystemName { get; set; }
        public string FileType { get; set; }
        public int FileSize { get; set; }
        public bool Status { get; set; }
    }
}