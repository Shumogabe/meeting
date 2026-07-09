using QTHT.Api.Models;
using QTHT.Api.Models.Admin;
using QTHT.Api.Models.meeting_content_database;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QTHT.Api.Models.database.Meeting.Document
{
    public class Meeting_Document
    {
        [Key]
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public Guid ScheduleId { get; set; }
        public string? FileUrl { get; set; }
        public string? FileOriginalName { get; set; }
        public string? FileSystemName { get; set; }
        public int? FileSize { get; set; }
        public string? FileType { get; set; }
        public int? Status { get; set; } //0-Draft | 1-Approved | 2-Unapproved | 3-Published 
        public DateTime? CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
        [NotMapped]
        public thong_tin_nguoi_dung UserCreatedBy { get; set; }
    }
    public class Meeting_Document_Insert
    {
        public string Title { get; set; }
        public Guid ScheduleId { get; set; }
        public string Url { get; set; }
        public string OriginalName { get; set; }
        public string SystemName { get; set; }
        public string Type { get; set; }
        public int Size { get; set; }
        public int Status { get; set; } //0-Draft | 1-Approved | 2-Unapproved | 3-Published
        public DateTime CreatedDate { get; set; }
        public bool? IsDeleted { get; set; }
        public int CreatedBy { get; set; }
    }

    public class Meeting_Document_Update
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
