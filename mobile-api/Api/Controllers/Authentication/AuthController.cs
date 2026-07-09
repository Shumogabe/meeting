using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Novell.Directory.Ldap;
using QTHT.Api.Helpers;
using QTHT.Api.Models;
using QTHT.Api.Models.database;
using QTHT.Api.Models.meeting_content_database;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace QTHT.Api.Controllers.Schedule
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        public IConfiguration Configuration { get; }

        public AuthController(QTHT_HTT_Context context, IConfiguration configuration)
        {
            _context = context;
            Configuration = configuration;
        }


        [HttpGet("phan_quyen_vai_tro_nguoi_dung/quyen_nguoi_dung")]
        [Authorize]
        public IActionResult Get_phanquyen_vaitro_ByToken()
        {
            var sub = User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
            var usrname = User.Claims.FirstOrDefault(c => c.Type == "username")?.Value;
            var userCurrentClaim = User.FindFirst(ClaimTypes.Name)?.Value;

            //var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            //var user_current = userCurrentClaim?.Value;

            //if (string.IsNullOrEmpty(user_current))
            //{
            //    var usernameClaim = User?.FindFirst("username");
            //    user_current = usernameClaim?.Value;
            //}


            var user_current = sub ?? usrname ?? userCurrentClaim;

            if (string.IsNullOrEmpty(user_current)) return StatusCode(299, "Cần đăng nhập để thực hiện chức năng này");


            List<thong_tin_chuc_nang> list_thong_tin_chuc_nang = new List<thong_tin_chuc_nang>();

            var ma_ds_vaitros_jsonstring = _context.phan_quyen_vai_tro_nguoi_dung.Where(x => x.daxoa == false && x.ten_dangnhap_nguoidung == user_current).Select(x => x.ma_ds_vaitros).FirstOrDefault();

            if (ma_ds_vaitros_jsonstring == null) return Ok(new { status = false, message = "Không có danh sách vai trò" });

            string[] ma_ds_vaitros = JsonConvert.DeserializeObject<string[]>(ma_ds_vaitros_jsonstring);

            foreach (var item_ma_ds_vaitros in ma_ds_vaitros)
            {
                var ma_ds_thong_tin_chuc_nangs_jsonstring = _context.vai_tro_nguoi_dung.Where(x => x.ma == item_ma_ds_vaitros).Select(x => x.ma_ds_thong_tin_chuc_nangs).FirstOrDefault();

                if (ma_ds_thong_tin_chuc_nangs_jsonstring == null) return Ok(new { status = false, message = "Không có danh sách vai trò" });

                string[] ma_ds_thong_tin_chuc_nangs = JsonConvert.DeserializeObject<string[]>(ma_ds_thong_tin_chuc_nangs_jsonstring);

                foreach (var item_ma_ds_thong_tin_chuc_nangs in ma_ds_thong_tin_chuc_nangs)
                {
                    var thong_tin_chuc_nang = _context.thong_tin_chuc_nang.Where(x => x.ma == item_ma_ds_thong_tin_chuc_nangs).FirstOrDefault();
                    if (thong_tin_chuc_nang != null)
                        list_thong_tin_chuc_nang.Add(thong_tin_chuc_nang);
                }
            }

            return Ok(new { status = true, data = list_thong_tin_chuc_nang });
        }
        /// <summary>
        /// Đăng nhập để lấy token
        /// </summary>
        /// <param name="model">username và password của người dùng </param>
        /// <returns>Token và thông tin người đăng nhập </returns>
        [HttpPost("dang_nhap")]
        public async Task<IActionResult> GetAuthenToken(Login model)
        {
            try
            {
                if (!string.IsNullOrEmpty(model.username) && !string.IsNullOrEmpty(model.password))
                {
                    List<Claim> claims = null;
                    if (Configuration.GetValue<string>("Authentication:AuthMethod") == "1")
                    {
                        var domainName = Configuration.GetValue<string>("Authentication:DomainName");
                        var IP = Configuration.GetValue<string>("Authentication:IP");
                        //string userDn = $"{model.usr}";
                        string userDn = $"{model.username}@{domainName}";

                        using (var connection = new Novell.Directory.Ldap.LdapConnection())
                        {
                            connection.Connect(IP, Novell.Directory.Ldap.LdapConnection.DefaultPort);
                            connection.Bind(
                                QTHT.Api.Services.EncryptionHelper.Decrypt(
                                    Configuration.GetValue<string>("Authentication:u"),
                                    Configuration.GetValue<string>("Authentication:o")),
                                QTHT.Api.Services.EncryptionHelper.Decrypt(
                                    QTHT.Api.Services.EncryptionHelper.Decrypt(
                                        Configuration.GetValue<string>("Authentication:u"),
                                        Configuration.GetValue<string>("Authentication:o")),
                                    Configuration.GetValue<string>("Authentication:u"))
                                );
                            // Perform the search to find the user
                            var results = connection.Search(
                                Configuration.GetValue<string>("Authentication:OU"),
                                Novell.Directory.Ldap.LdapConnection.ScopeSub,
                                "(sAMAccountName=" + model.username + ")",
                                ["sAMAccountName", "displayName", "telephoneNumber", "voiceTelephoneNumber", "mail"],
                                false
                            );
                            if (results.HasMore())
                            {
                                var userEntry = results.Next();
                                userDn = userEntry.Dn;

                                // Now bind with the user's DN and password
                                connection.Bind(userDn, model.password);

                                if (connection.Bound)
                                {
                                    var uservalidate = _context.thong_tin_nguoi_dung
                                        .Where(x => x.ten_dangnhap == model.username)
                                        .Select(x => new
                                        {
                                            x.id,
                                            x.ten_dangnhap,
                                            x.ten_day_du,
                                            x.ma_tochuc,
                                            donvi = new thong_tinContext().GetThongtinDonVi(x.ma_tochuc, _context),
                                            chucvu = new thong_tinContext().GetThongTinChucVu(x.ma_chucvu, _context),
                                            x.email,
                                            x.so_dien_thoai,
                                        })
                                        .FirstOrDefault();

                                    if (uservalidate == null)
                                    {
                                        // Search for the user in the LDAP directory
                                        ILdapSearchResults searchResults = connection.Search(
                                            Configuration.GetValue<string>("Authentication:OU"),
                                            Novell.Directory.Ldap.LdapConnection.ScopeSub,
                                            "(sAMAccountName=" + model.username + ")",
                                            ["sAMAccountName", "displayName", "telephoneNumber", "voiceTelephoneNumber", "mail"],
                                            false
                                        );

                                        thong_tin_nguoi_dung new_tai_khoan = new thong_tin_nguoi_dung();
                                        // Iterate over search results
                                        while (searchResults.HasMore())
                                        {
                                            LdapEntry nextEntry = searchResults.Next();
                                            LdapAttributeSet attributesSet = nextEntry.GetAttributeSet();
                                            new_tai_khoan.ma_tochuc = null;
                                            new_tai_khoan.ma_chucvu = null;
                                            new_tai_khoan.ma_dinhdanh = null;
                                            new_tai_khoan.id_wso2 = null;
                                            new_tai_khoan.daxoa = false;
                                            DateTime now = DateTime.UtcNow;
                                            new_tai_khoan.thoigian_tao = DateTimeHelper.GetTimeStamp(now);
                                            foreach (LdapAttribute attribute in attributesSet)
                                            {
                                                Console.WriteLine($"{attribute.Name}: {attribute.StringValue}");
                                                if (attribute.Name == "sAMAccountName")
                                                {
                                                    new_tai_khoan.ten_dangnhap = attribute.StringValue;
                                                }
                                                if (attribute.Name == "displayName")
                                                {
                                                    new_tai_khoan.ten_day_du = attribute.StringValue;
                                                }
                                                if (attribute.Name == "telephoneNumber")
                                                {
                                                    new_tai_khoan.so_dien_thoai = attribute.StringValue;
                                                }
                                                if (attribute.Name == "voiceTelephoneNumber")
                                                {
                                                    new_tai_khoan.so_dien_thoai = attribute.StringValue;
                                                }
                                                if (attribute.Name == "mail")
                                                {
                                                    new_tai_khoan.email = attribute.StringValue;
                                                }
                                            }
                                            _context.thong_tin_nguoi_dung.Add(new_tai_khoan);
                                            _context.SaveChanges();

                                            // Close the connection
                                            connection.Disconnect();

                                            claims = new List<Claim>
                                            {
                                                new Claim(ClaimTypes.NameIdentifier, new_tai_khoan.ten_dangnhap),
                                                new Claim(ClaimTypes.Name, new_tai_khoan.ten_dangnhap),
                                                new Claim("sub", new_tai_khoan.ten_dangnhap),
                                                new Claim("Email", !string.IsNullOrEmpty(new_tai_khoan.email) ? new_tai_khoan.email:"" ),
                                                new Claim("UserId", !string.IsNullOrEmpty( new_tai_khoan.id.ToString())?new_tai_khoan.id.ToString():"")
                                            };
                                            // Uncomment and properly handle userRole logic if needed
                                            // if (new_tai_khoan.id > 0)
                                            // {
                                            //     // Populate claims based on userRole and new_tai_khoan data
                                            // }

                                            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:SecurityKey"]));
                                            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                                            var expiry = DateTime.Now.AddDays(Convert.ToInt32(Configuration["JWT:ExpiresAt"]));

                                            var token = new JwtSecurityToken(
                                                issuer: Configuration["JWT:Issuer"],
                                                audience: Configuration["JWT:Audience"],
                                                claims: claims,
                                                expires: expiry,
                                                signingCredentials: creds
                                            );

                                            List<thong_tin_chuc_nang> list_thong_tin_chuc_nang = new List<thong_tin_chuc_nang>();

                                            var ma_ds_vaitros_jsonstring = _context.phan_quyen_vai_tro_nguoi_dung.Where(x => x.daxoa == false && x.ten_dangnhap_nguoidung == model.username).Select(x => x.ma_ds_vaitros).FirstOrDefault();
                                            if (ma_ds_vaitros_jsonstring != null)
                                            {
                                                string[] ma_ds_vaitros = JsonConvert.DeserializeObject<string[]>(ma_ds_vaitros_jsonstring);

                                                foreach (var item_ma_ds_vaitros in ma_ds_vaitros)
                                                {
                                                    var ma_ds_thong_tin_chuc_nangs_jsonstring = _context.vai_tro_nguoi_dung.Where(x => x.ma == item_ma_ds_vaitros).Select(x => x.ma_ds_thong_tin_chuc_nangs).FirstOrDefault();

                                                    if (ma_ds_thong_tin_chuc_nangs_jsonstring == null) return StatusCode(299, "ma_ds_thong_tin_chuc_nangs_jsonstring_notFound");

                                                    string[] ma_ds_thong_tin_chuc_nangs = JsonConvert.DeserializeObject<string[]>(ma_ds_thong_tin_chuc_nangs_jsonstring);

                                                    foreach (var item_ma_ds_thong_tin_chuc_nangs in ma_ds_thong_tin_chuc_nangs)
                                                    {
                                                        var thong_tin_chuc_nang = _context.thong_tin_chuc_nang.Where(x => x.ma == item_ma_ds_thong_tin_chuc_nangs).FirstOrDefault();
                                                        if (thong_tin_chuc_nang != null)
                                                            list_thong_tin_chuc_nang.Add(thong_tin_chuc_nang);
                                                    }
                                                }
                                            }
                                            return Ok(new { state = true, token = new JwtSecurityTokenHandler().WriteToken(token), data = new_tai_khoan, role = list_thong_tin_chuc_nang });
                                        }
                                    }

                                    // Ensure uservalidate is not null
                                    if (uservalidate != null)
                                    {
                                        claims = new List<Claim>
                                        {
                                            new Claim(ClaimTypes.NameIdentifier, uservalidate.ten_dangnhap),
                                            new Claim(ClaimTypes.Name, uservalidate.ten_dangnhap),
                                            new Claim("sub", uservalidate.ten_dangnhap),
                                            new Claim("Email", !string.IsNullOrEmpty(uservalidate.email) ? uservalidate.email:"" ),
                                            new Claim("UserId", !string.IsNullOrEmpty( uservalidate.id.ToString())?uservalidate.id.ToString():"")
                                        };
                                        // Uncomment and properly handle userRole logic if needed
                                        // if (uservalidate.id > 0)
                                        // {
                                        //     // Populate claims based on userRole and uservalidate data
                                        // }

                                        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:SecurityKey"]));
                                        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                                        var expiry = DateTime.Now.AddDays(Convert.ToInt32(Configuration["JWT:ExpiresAt"]));

                                        var token = new JwtSecurityToken(
                                            issuer: Configuration["JWT:Issuer"],
                                            audience: Configuration["JWT:Audience"],
                                            claims: claims,
                                            expires: expiry,
                                            signingCredentials: creds
                                        );

                                        List<thong_tin_chuc_nang> list_thong_tin_chuc_nang = new List<thong_tin_chuc_nang>();

                                        var ma_ds_vaitros_jsonstring = _context.phan_quyen_vai_tro_nguoi_dung.Where(x => x.daxoa == false && x.ten_dangnhap_nguoidung == model.username).Select(x => x.ma_ds_vaitros).FirstOrDefault();
                                        if (ma_ds_vaitros_jsonstring != null)
                                        {
                                            string[] ma_ds_vaitros = JsonConvert.DeserializeObject<string[]>(ma_ds_vaitros_jsonstring);

                                            foreach (var item_ma_ds_vaitros in ma_ds_vaitros)
                                            {
                                                var ma_ds_thong_tin_chuc_nangs_jsonstring = _context.vai_tro_nguoi_dung.Where(x => x.ma == item_ma_ds_vaitros).Select(x => x.ma_ds_thong_tin_chuc_nangs).FirstOrDefault();

                                                if (ma_ds_thong_tin_chuc_nangs_jsonstring == null) return StatusCode(299, "ma_ds_thong_tin_chuc_nangs_jsonstring_notFound");

                                                string[] ma_ds_thong_tin_chuc_nangs = JsonConvert.DeserializeObject<string[]>(ma_ds_thong_tin_chuc_nangs_jsonstring);

                                                foreach (var item_ma_ds_thong_tin_chuc_nangs in ma_ds_thong_tin_chuc_nangs)
                                                {
                                                    var thong_tin_chuc_nang = _context.thong_tin_chuc_nang.Where(x => x.ma == item_ma_ds_thong_tin_chuc_nangs).FirstOrDefault();
                                                    if (thong_tin_chuc_nang != null)
                                                        list_thong_tin_chuc_nang.Add(thong_tin_chuc_nang);
                                                }
                                            }
                                        }
                                        return Ok(new { state = true, token = new JwtSecurityTokenHandler().WriteToken(token), data = uservalidate, role = list_thong_tin_chuc_nang });
                                    }
                                    else
                                    {
                                        return StatusCode(299, new { state = false, message = "Thông tin người dùng không tồn tại" });
                                    }
                                }
                                else
                                {
                                    return StatusCode(299, new { state = false, message = "Không kết nối xác thực" });
                                }
                            }
                            return StatusCode(299, new { state = false, message = "Không kết nối xác thực" });
                        }
                    }
                    else
                    {
                        return StatusCode(299, new { state = false, message = "Không xác định phương pháp xác thực" });
                    }
                }
                else
                {
                    return StatusCode(299, new { state = false, message = "Tài khoản hoặc mật khẩu không đúng" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(299, new { status = false, message = "Tài khoản hoặc mật khẩu không đúng. Vui lòng thử lại" });
            }
        }
    }
}