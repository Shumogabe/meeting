using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QTHT.Api.Models.database.Role
{
    public class RoleDetail
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
    }
    public class UserRole:RoleDetail
    {        
        public bool Set { get; set; }
        public string Icon { get; set; }
    }
}
