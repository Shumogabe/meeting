using Microsoft.Extensions.Configuration;

namespace HTT.Api.Utils
{

    public enum TrangThaiKhoa_NguoiDung
    {
        Lock = 1,
        UnLock= 0
    }
    public enum TWOFA_AUTHENTICATION_METHOD
    {
        AUTHENTICATOR = 1,
        EMAIL = 2,
        PHONE = 3
    }
    public class Constant
    {
        private IConfiguration _configuration;

        public Constant(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        //public const string Nameidentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
        //public const string Nameidentifier = _configuration.GetValue<string>("domain");
        public string Nameidentifier()
        {
            return _configuration.GetSection("Nameidentifier").Value;
        }
    }
}