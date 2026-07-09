using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;

namespace HTT_QTHT.Api.Utils
{
    //public class Constant
    //{
    //    public static string TrangThaiDaXoa = "Có";
    //    public static string TranThaiChuaXoa = "Không";
    //    public const string Nameidentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
    //}
    public class Constant
    {
        public static string TrangThaiDaXoa = "Có";
        public static string TranThaiChuaXoa = "Không";
        public const string Nameidentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
        private IConfiguration _configuration;
        private readonly TokenValidationService _tokenValidationService;
        private readonly HttpRequest _request;

        public Constant(IConfiguration configuration, TokenValidationService tokenValidationService, HttpRequest request)
        {
            _configuration = configuration;
            _tokenValidationService = tokenValidationService;
            _request = request;
        }
        public string NameIdentifier()
        {
            var scheme = _tokenValidationService.GetScheme(_request);
            if (scheme == "Scheme_WSO2")
            {
                return _configuration.GetSection("Nameidentifier").Value;
            }
            return Nameidentifier;

        }
    }
    public class TokenValidationService
    {
        private readonly IConfiguration _configuration;

        public TokenValidationService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GetScheme(HttpRequest request)
        {
            var jwtHandler = new JwtSecurityTokenHandler();
            var token = request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
            if (!string.IsNullOrEmpty(token) && jwtHandler.CanReadToken(token))
            {
                var tokenIssuer = jwtHandler.ReadJwtToken(token).Issuer;

                if (tokenIssuer != _configuration["JWT:Issuer"])
                    return "Scheme_WSO2";
                else
                    return "Scheme_HTT";
            }
            return "Scheme_WSO2";
        }
    }
}
