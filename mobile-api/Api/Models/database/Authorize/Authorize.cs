using QTHT.Api.Models.database.Admin;
using QTHT.Api.Models.database.Role;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;

namespace QTHT.Api.Models.database.Authorize
{
    public class GetPermisionOption
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public int FunctionId { get; set; }
        public string FunctionName { get; set; }
        public string Action { get; set; }
        public bool Value { get; set; }
        public int ModifiedBy { get; set; }
    }
    public class Authorize
    {
        public int Id { get; set; }
        public int FunctionId { get; set; } //
        public int RoleId { get; set; } //
        public bool Read { get; set; }
        public bool Create { get; set; }
        public bool Edit { get; set; }
        public bool Delete { get; set; }
        public bool Approve { get; set; }
        public bool Publish { get; set; }
        public bool SetPermission { get; set; }
        public string FunctionName { get; set; }
        public string RoleName { get; set; }
        
    }
    public class RolePermission
    {
        public RoleDetail Role { get; set; }
        public List<Permission> Permission { get; set; } 
        public string tabcss { get; set; }
        public string tabid { get; set; }
        public string tabidtab { get; set; }
        public string tabhref { get; set; }
        public string tabpanecss { get; set; }
    }
    public class Permission
    {
        [Key]
        public string Module { get; set; }
        public Module Function { get; set; }
        public RoleDetail Role { get; set; }
        public bool Read { get; set; }
        public bool Create { get; set; }
        public bool Edit { get; set; }
        public bool Delete { get; set; }
        public bool Approve { get; set; }
        public bool Publish { get; set; }
        public bool Authorize { get; set; }
    }
}
