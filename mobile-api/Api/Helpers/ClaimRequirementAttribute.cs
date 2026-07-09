using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using System.Security.Claims;

namespace QTHT.Api.Helpers
{
    public class ClaimRequirementAttribute : TypeFilterAttribute
    {
        public ClaimRequirementAttribute(string claimType, string claimValue) : base(typeof(ClaimRequirementFilter))
        {
            Arguments = new object[] { new Claim(claimType, claimValue) };
        }
    }

    public class ClaimRequirementFilter : IAuthorizationFilter
    {
        private readonly Claim _claim;

        public ClaimRequirementFilter(Claim claim)
        {
            _claim = claim;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            //Tính năng này chỉ áp dụng cho MVC hoặc ReactJS nhúng C#
            var claims = context.HttpContext.User.Claims;
            if (claims != null)
            {
                if (claims.FirstOrDefault(x => x.Type == _claim.Type) == null)
                {
                    context.Result = new ObjectResult(new { status = 0, data = 0, message = "Bạn chưa được cấp quyền truy cập chức năng" }); ;
                }
                else
                {
                    var hasClaim = claims.FirstOrDefault(x => x.Type == _claim.Type).Value.ToString().Split(",").ToList().Contains(_claim.Value);
                    if (!hasClaim)
                    {
                        context.Result = new ObjectResult(new { status = 0, data = 0, message = "Bạn chưa được cấp quyền truy cập chức năng" }); ;
                    }
                }
            }
            else
            {
                context.Result = new ObjectResult(new { status = 0, data = 0, message = "Hệ thống không xác thực được thông tin" });
            }
        }
    }
}