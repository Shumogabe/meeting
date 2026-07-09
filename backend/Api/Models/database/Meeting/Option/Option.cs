using System;

namespace HTT.Api.Models
{
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
}
