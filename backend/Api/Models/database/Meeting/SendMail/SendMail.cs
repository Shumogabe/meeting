using System;

namespace HTT.Api.Models
{
    public class SendMailList
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool Default{ get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public int DeletedBy { get; set; }
        public long RowNumber { get; set; }
        public int TotalRecord { get; set; }
    }
    public class SendMailCreate
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public bool Default { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
    }
    public class SendMailUpdate
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public bool Default { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
    }
    public class SendMail
    {                
        public string To { get; set; }
        public string Sub { get; set; }
        public string Body { get; set; }
    }
}
