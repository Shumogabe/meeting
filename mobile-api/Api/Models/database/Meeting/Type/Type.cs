using QTHT.Api.Models.database.Meeting.Schedule;
using System;

namespace QTHT.Api.Models.database.Meeting.Type
{
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
        public long RowNumber { get; set; }
        public int TotalRecord { get; set; }
    }
    public class Meeting_Type_Insert
    {
        public string Title { get; set; }
        public DateTime CreatedDate { get; set; }
        public int CreatedBy { get; set; }
    }
    public class Meeting_Type_Update
    {
        public string Title { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
    }
}
