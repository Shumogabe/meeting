using System;
using System.Collections.Generic;

namespace QTHT.Api.Models.database.Admin
{
    public class Config
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public long RowNumber { get; set; }
        public int TotalRecord { get; set; }
    }
}
