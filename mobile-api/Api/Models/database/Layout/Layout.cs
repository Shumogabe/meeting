using System;
using System.Collections.Generic;

namespace QTHT.Api.Models.database.Admin
{
    public class Layout
    {
        public int Id { get; set; }
        public string Title { get; set; } //
        public string Name { get; set; } //
        public string Frame { get; set; } //Left-Body-Right
        public int CreatedBy { get; set; }
        public int ModifiedBy { get; set; }
        public int DeletedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public long RowNumber { get; set; }
        public long TotalRecord { get; set; }
    }


}
