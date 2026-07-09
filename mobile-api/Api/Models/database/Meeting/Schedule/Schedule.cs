using QTHT.Api.Models.database.Meeting.Server;
using QTHT.Api.Models.database.Meeting.Type;
using QTHT.Api.Models;
using System;
using QTHT.Api.Models.Admin;
using DocumentFormat.OpenXml.Office2010.ExcelAc;
using QTHT.Api.Models.database.Meeting.Voted;
using System.Collections.Generic;
using QTHT.Api.Models.database.Meeting.Member;
using QTHT.Api.Models.database.Meeting.Document;
using QTHT.Api.Models.database.Meeting.Votes;
using QTHT.Api.Models.database.Meeting.Conslusion;
using QTHT.Api.Models.database.Meeting.Content;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using QTHT.Api.Models.meeting_content_database;

namespace QTHT.Api.Models.database.Meeting.Schedule
{
    public class Meeting_Schedule
    {
        [Key]
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int ChairMan { get; set; }
        public string RoomName { get; set; }
        public string Place { get; set; }
        public int Status { get; set; } //0-Draft | 1-Chưa duyệt | 2-Đã duyệt | 3-Published
        public bool Start { get; set; }  //0-false | 1-true
        public string Token { get; set; }
        public int ServerId { get; set; }
        public int TypeId { get; set; }
        public int SharedRole { get; set; }
        public bool? IsLobby { get; set; } 
        public bool IsPublished { get; set; }
        public string? Password { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
        [NotMapped]
        public thong_tin_nguoi_dung? UserChairMan { get; set; }
        [NotMapped]
        public thong_tin_nguoi_dung? UserCreatedBy { get; set; }
        [NotMapped]
        public thong_tin_nguoi_dung? UserShareRole { get; set; }
        [NotMapped]
        public Meeting_Server Server { get; set; }
        
        public Int64? don_vi { get; set; }
        [NotMapped]
        public List<Meeting_Votes> MeetingVotes { get; set; } = new List<Meeting_Votes>();
        [NotMapped]
        public List<Meeting_Member> MeetingMember { get; set; } = new List<Meeting_Member>();
        [NotMapped]
        public List<Meeting_Document> MeetingDocument { get; set; } = new List<Meeting_Document>();
        [NotMapped]
        public List<Meeting_Conclusion> MeetingConslusion { get; set; } = new List<Meeting_Conclusion>();
        [NotMapped]
        public List<Meeting_Content> MeetingContent { get; set; } = new List<Meeting_Content>();
    }
    public class Meeting_Schedule_Insert
    {
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int ChairMan { get; set; }
        public string RoomName { get; set; }
        public string Place { get; set; }
        public int Status { get; set; } //0-Draft | 1-Chưa duyệt | 2-Đã duyệt | 3-Published
        public bool Start { get; set; }  //0-false | 1-true
        public string Token { get; set; }
        public int ServerId { get; set; }
        public int TypeId { get; set; }
        public int SharedRole { get; set; }
        public string Password { get; set; }
        public bool IsLobby { get; set; }
        public bool IsPublished { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public Int64 don_vi { get; set; }
    }
    public class Meeting_Schedule_Update
    {
        public Guid id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int ChairMan { get; set; }
        public string RoomName { get; set; }
        public string Place { get; set; }
        public int Status { get; set; } //0-Draft | 1-Chưa duyệt | 2-Đã duyệt | 3-Published
        public bool Start { get; set; }  //0-false | 1-true
        public string Token { get; set; }
        public int ServerId { get; set; }
        public int TypeId { get; set; }
        public int SharedRole { get; set; }
        public bool IsLobby { get; set; }
        public bool IsPublished { get; set; }
        public string Password { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public Int64 don_vi { get; set; }
    }
    public class Meeting_Schedule_Delete
    {
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
    }
    public class Meeting_Schedule_Restore
    {
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
    public class Meeting_Schedule_SharedRole
    {
        public int SharedRole { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
    public class Meeting_Schedule_Start
    {
        public bool Start { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
   
    public class Meeting_Schedule_Password
    {
        public string Password { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
    public class Meeting_Schedule_IsPublished
    {
        public bool IsPublished { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
    public class Meeting_Schedule_IsLobby
    {
        public bool IsLobby { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
