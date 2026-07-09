using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QTHT.Api.Utils
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
    public static class Constant
    {
        public const string Nameidentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
    }
}