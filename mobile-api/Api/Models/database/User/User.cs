using QTHT.Api.Models.database.Authorize;
using QTHT.Api.Models.database.Models;
using QTHT.Api.Models.database.Role;
using System;
using System.Collections.Generic;

namespace QTHT.Api.Models.Admin
{
    public class User
    {
        public long Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public long OrganId { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Gender { get; set; }
        public long PositionId { get; set; }
        public string Roles { get; set; }
        public Nullable<DateTime> DateOfBirth { get; set; }
        public bool IsLocal { get; set; }
        public bool SupperAdmin { get; set; }
        public bool IsActivated { get; set; }
        public bool RememberMe { get; set; }
        public string ReturnUrl { get; set; }
        public int TotalRecord { get; set; }
        public int RowNumber { get; set; }
        public int PageSize { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public bool IsDeleted { get; set; }
        public Nullable<DateTime> DeletedDate { get; set; }
        public int DeletedBy { get; set; }
        public Position Position { get; set; }
        public Organ Organ { get; set; }
    }

    public class Users
    {
        public int? Id { get; set; }
        public string? Email { get; set; }
        public bool? EmailConfirmed { get; set; }
        public string? PasswordHash { get; set; }
        public string? SecurityStamp { get; set; }
        public string? PhoneNumber { get; set; }
        public bool? PhoneNumberConfirmed { get; set; }
        public bool? TwoFactorEnabled { get; set; }
        public DateTime? LockoutEndDateUtc { get; set; }
        public bool? LockoutEnabled { get; set; }
        public int? AccessFailedCount { get; set; }
        public string? UserName { get; set; }
        public string? FullName { get; set; }
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Organ { get; set; }
        public int? OrganId { get; set; }
        public int? PositionId { get; set; }
        public int Position { get; set; }
        public string? Roles { get; set; }
        public bool? SupperAdmin { get; set; }
        public bool? IsActivated { get; set; }
        public bool? IsLocal { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public bool? IsDeleted { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int? DeletedBy { get; set; }
    }

    public class UserInfo
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Gender { get; set; }
        public Nullable<DateTime> DateOfBirth { get; set; }
        public bool IsLocal { get; set; }
        public bool SupperAdmin { get; set; }
        public bool IsActivated { get; set; }
        public bool RememberMe { get; set; }
        public string ReturnUrl { get; set; }
        public int TotalRecord { get; set; }
        public int RowNumber { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public int CreatedBy { get; set; }
        public Nullable<DateTime> ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public bool IsDeleted { get; set; }
        public Nullable<DateTime> DeletedDate { get; set; }
        public int DeletedBy { get; set; }
        public Organ Organ { get; set; }
        public Position Position { get; set; }
        public List<RoleDetail> Roles { get; set; }
        public List<Permission> Permission { get; set; }
    }

    public class UpdateUserRole
    {
        public int Id { get; set; }
        public string[] Roles { get; set; }
        public int UserId { get; set; }
    }

    public class UpdateSetting
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public int UserId { get; set; }
    }

    public class GetFullName
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public int PositionId { get; set; }
        public Position Position { get; set; }
    }

    public class GetSearch
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public int PositionId { get; set; }
        public int OrganId { get; set; }
        public Position Position { get; set; }
        public Organ Organ { get; set; }
    }

    public class OptionGetFullName
    {
        public string KeyWord { get; set; } = null;
    }

    public class UpdateUser
    {
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
    }
}