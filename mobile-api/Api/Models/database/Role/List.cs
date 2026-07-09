using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QTHT.Api.Models.database.Role
{
    public class RoleList
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
        public int TotalRecord { get; set; }
        public long RowNumber { get; set; }
    }
}
