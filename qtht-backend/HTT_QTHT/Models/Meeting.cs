using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace HTT_QTHT.Models
{
    public class Meeting_Server
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? IP { get; set; }
        public string? Iss { get; set; }
        public string? Aud { get; set; }
        public bool? Activated { get; set; }
        public bool? Default { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
        public void Assign(Meeting_Server model)
        {
            Title = model.Title;
            IP = model.IP;
            Iss = model.Iss;
            Aud = model.Aud;
            Activated = model.Activated;
            Default = model.Default;
        }
    }
    public partial class Meeting_Servers : CommonList
    {
        public List<Meeting_Server>? Records { get; set; }
    }
    public class Meeting_Chat
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public Guid ScheduleId { get; set; }
        public string Url { get; set; }
        public string OriginalName { get; set; }
        public string SystemName { get; set; }
        public int Size { get; set; }
        public string Type { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public int DeletedBy { get; set; }
        public bool IsDeleted { get; set; }
        public bool Status { get; set; } //0-Unapproved | 1-Approved 
    }
    public class Meeting_Conclusion
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
        public bool Status { get; set; }
        public bool IsDeleted { get; set; }
    }
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
        public bool Status { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class Meeting_Document
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid ScheduleId { get; set; }
        public string Url { get; set; }
        public string OriginalName { get; set; }
        public string SystemName { get; set; }
        public int Size { get; set; }
        public string Type { get; set; }
        public bool Status { get; set; } //0-Unapproved | 1-Approved 
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public int DeletedBy { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class Meeting_Member
    {
        public Guid Id { get; set; }
        public Guid ScheduleId { get; set; }
        public int UserId { get; set; }
        public string Email { get; set; }
        public bool Activated { get; set; } //0-F | 1-T
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public int DeletedBy { get; set; }
    }
    public class Meeting_Option
    {
        public Guid id { get; set; }
        public string label_vn { get; set; }
        public string label_en { get; set; }
        public bool status { get; set; }
        public string value { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public int DeletedBy { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class Meeting_Plan
    {
        public Guid Id { get; set; }
        public string Symbol { get; set; }
        public string Abstract { get; set; }
        public string Content { get; set; }
        public DateTime DateIssued { get; set; }
        public string AgencyIssued { get; set; }
        public string Signer { get; set; }
        public DateTime EffectiveDate { get; set; }
        public string File { get; set; }
        public int Status { get; set; } // 1-Đang chờ duyệt | 2-Chưa duyêt | 3-Đã duyệt   
        public string ApprovedBy { get; set; }
        public string BelongToUnit { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class Meeting_Schedule
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int ChairMan { get; set; }
        public string RoomName { get; set; }
        public string Place { get; set; }
        public int Status { get; set; } //0-Draft | 1-Chưa duyệt | 2-Đã duyệt | 3-Đã hết
        public bool Start { get; set; }  //0-false | 1-true
        public string Token { get; set; }
        public int ServerId { get; set; }
        public int TypeId { get; set; }
        public int SharedRole { get; set; }
        public bool IsLobby { get; set; }
        public bool IsPublished { get; set; }
        public string Password { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public int DeletedBy { get; set; }
        public bool IsDeleted { get; set; }
        public Int64 don_vi { get; set; }
    }
    public class Meeting_Type
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public int DeletedBy { get; set; }
    }
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
    public class Meeting_Voted
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid VoteId { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public int DeletedBy { get; set; }
        public bool IsCreatedByAd { get; set; }
    }
    public class Meeting_Votes
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public bool Status { get; set; }
        public bool Type { get; set; } // 0:radio, 1:checkbox
        public bool End { get; set; }
        public Guid ScheduleId { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public int DeletedBy { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class Meeting_Whiteboard
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public Guid ScheduleId { get; set; }
        public string Content { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public int DeletedBy { get; set; }
    }
}
