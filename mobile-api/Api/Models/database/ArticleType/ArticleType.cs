using System;
using System.Collections.Generic;

namespace QTHT.Api.Models.database.Admin
{
    public class ArticleType
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Lang { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public long RowNumber { get; set; }
        public int TotalRecord { get; set; }
    }
    public class ArticleTypeModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Lang { get; set; }
        public int? UserId { get; set; }
    }
}
