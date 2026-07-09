using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace HTT.Api.Models
{
    public class Meeting_Server
    {
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
        [NotMapped]
        public long? RowNumber { get; set; }
        [NotMapped]
        public int? TotalRecord { get; set; }
    }
    public class Meeting_Server_Insert
    {
        public string Title { get; set; }
        public string IP { get; set; }
        public bool Activated { get; set; }
        public bool Default { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }        
    }
    public class Meeting_Server_Update
    {
        public string Title { get; set; }
        public string IP { get; set; }
        public bool Activated { get; set; }
        public bool Default { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
    }
}