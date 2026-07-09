using HTT.Api.Models;
using HTT.Api.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Novell.Directory.Ldap;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.DirectoryServices;
using System.DirectoryServices.AccountManagement;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
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

        public AuthController(IConfiguration configuration, QTHT_HTT_Context context)
        {
            Configuration = configuration;
            _context = context;
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
                                HTT.Api.Services.EncryptionHelper.Decrypt(
                                    Configuration.GetValue<string>("Authentication:u"),
                                    Configuration.GetValue<string>("Authentication:o")),
                                HTT.Api.Services.EncryptionHelper.Decrypt(
                                    HTT.Api.Services.EncryptionHelper.Decrypt(
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
                                            donvi = _context.thong_tin_don_vi
                                                .Where(y => y.ma == x.ma_tochuc)
                                                .Select(x => new
                                                {
                                                    x.id,
                                                    x.ma,
                                                    x.ten,
                                                    x.ma_hanhchinh,
                                                    x.diachi,
                                                    x.dienthoai,
                                                    x.mail,
                                                    x.fax,
                                                    x.website
                                                })
                                                .FirstOrDefault(),
                                            chucvu = _context.thong_tin_chuc_vu
                                                .Where(y => y.ma == x.ma_chucvu)
                                                .Select(x => new
                                                {
                                                    x.ma,
                                                    x.ten,
                                                    x.ma_hanhchinh
                                                })
                                                .FirstOrDefault(),
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

        [HttpGet("test_dang_nhap")]
        [Authorize]
        public async Task<IActionResult> GetUser()
        {
            var user_current = User.FindFirst(new Constant(Configuration).Nameidentifier()).Value;
            return Ok(user_current);
        }

        //[HttpGet("DownAllUserFromAD")]
        //[AllowAnonymous]
        [NonAction]
        public IActionResult ExportExcelUserFromAD()
        {

            var data = DownAllUserFromAD();
            var column = new List<string>() { "Họ tên", "Tài khoản", "Mail", "OU" };
            var stream = new MemoryStream();

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var package = new ExcelPackage(stream))
            {
                var sheet = package.Workbook.Worksheets.Add("Danh sách người dùng");
                //sheet.Cells.LoadFromCollection(data, true);
                sheet.Cells[1, 1].Value = "STT";
                var i_column = 2;
                List<string> column_arr_key = new List<string>() { "hoten", "tk", "mail", "ou" };
                foreach (var item in column)
                {
                    string keyValue = item.ToString();
                    sheet.Cells[1, i_column].Value = keyValue;
                    i_column++;
                }
                var count_cell_row = i_column;

                int rowIdx = 2;
                int stt = 1;

                foreach (dynamic d in data)
                {

                    sheet.Cells[rowIdx, 1].Value = stt;
                    i_column = 2;
                    foreach (string item in column_arr_key)
                    {
                        PropertyInfo propertyInfo = d.GetType().GetProperty(item);

                        var keyValue = propertyInfo?.GetValue(d, null) != null ? propertyInfo?.GetValue(d, null).ToString() : "";
                        sheet.Cells[rowIdx, i_column].Value = keyValue;
                        i_column++;
                    }
                    stt++;
                    rowIdx++;
                }
                // Style cho hàng header
                var headerRange = sheet.Cells[1, 1, 1, count_cell_row - 1];
                //
                headerRange.Style.Font.Bold = true;
                headerRange.Style.Font.Size = 12;
                //headerRange.Style.Font.Color.SetColor(System.Drawing.Color.Black);
                //
                headerRange.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                //headerRange.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Yellow);
                //
                headerRange.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                headerRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                headerRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                headerRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                //
                headerRange.Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                headerRange.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                headerRange.Style.Border.Left.Color.SetColor(System.Drawing.Color.Black);
                headerRange.Style.Border.Right.Color.SetColor(System.Drawing.Color.Black);
                //headerRange.Style.Border.BorderAround(ExcelBorderStyle.Thin);

                // Style cho hàng còn lại
                headerRange = sheet.Cells[1, 1, rowIdx - 1, count_cell_row - 1];
                headerRange.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                headerRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                headerRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                headerRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                //
                headerRange.Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                headerRange.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                headerRange.Style.Border.Left.Color.SetColor(System.Drawing.Color.Black);
                headerRange.Style.Border.Right.Color.SetColor(System.Drawing.Color.Black);

                // Style table
                var table = sheet.Tables.Add(headerRange, "MyTable");
                table.TableStyle = OfficeOpenXml.Table.TableStyles.Medium1;

                // Style all
                sheet.Cells[sheet.Dimension.Address].AutoFitColumns();
                sheet.Cells[sheet.Dimension.Address].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                package.Save();
            }
            stream.Position = 0;

            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "danh_sach_nguoi_dung.xlsx");
        }

        //[HttpGet("DownAllUserFromAD")]
        //[AllowAnonymous]
        [NonAction]
        public List<dynamic> DownAllUserFromAD()
        {
            try
            {
                var domain = "10.1.10.9";
                var default_ou = "DC=monre,DC=gov,DC=vn";
                var service_user = "detai-qltk";
                var service_password = "Passw0rdAdminTaikhoan@123";
                var time_tao = Util.DateTimeToUnixTimeStamp(DateTime.Now);
                PrincipalContext oPrincipalContext = new PrincipalContext(ContextType.Domain, domain, default_ou, service_user, service_password);

                var lst = new List<dynamic>();
                using (oPrincipalContext)
                {
                    using (var searcher = new PrincipalSearcher(new UserPrincipal(oPrincipalContext)))
                    {
                        foreach (var result in searcher.FindAll())
                        {
                            DirectoryEntry de = result.GetUnderlyingObject() as DirectoryEntry;
                            if (de.Properties["distinguishedName"].Value.ToString().Contains("OU="))
                                lst.Add(new
                                {
                                    tk = de.Properties["samAccountName"].Value,
                                    ho = de.Properties["givenName"].Value,
                                    ten = de.Properties["sn"].Value,
                                    hoten = (de.Properties["givenName"].Value == null ? "" : de.Properties["givenName"].Value.ToString())
                                        + " " +
                                        (de.Properties["sn"].Value == null ? "" : de.Properties["sn"].Value.ToString()),
                                    sdt = de.Properties["telephoneNumber"].Value,
                                    mail = de.Properties["userPrincipalName"].Value,
                                    ou = de.Properties["distinguishedName"].Value == null ? "" : de.Properties["distinguishedName"].Value.ToString().Split(",")[1].Replace("OU=", "")
                                });
                            //thong_tin_nguoi_dung ttnd = new thong_tin_nguoi_dung();
                            //ttnd.ten_dangnhap =
                            //    de.Properties["samAccountName"].Value == null
                            //    ? ""
                            //    : de.Properties["samAccountName"].Value.ToString();
                            //ttnd.ten_day_du =
                            //    (de.Properties["givenName"].Value == null
                            //    ? ""
                            //    : de.Properties["givenName"].Value.ToString())
                            //    + " " +
                            //    (de.Properties["sn"].Value == null
                            //    ? ""
                            //    : de.Properties["sn"].Value.ToString());
                            //ttnd.so_dien_thoai =
                            //    de.Properties["telephoneNumber"].Value == null
                            //    ? ""
                            //    : de.Properties["telephoneNumber"].Value.ToString();
                            //ttnd.email =
                            //    de.Properties["userPrincipalName"].Value == null
                            //    ? ""
                            //    : de.Properties["userPrincipalName"].Value.ToString();
                            //ttnd.thoigian_tao = time_tao;
                            //var check_exist = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == ttnd.ten_dangnhap).FirstOrDefault();
                            //if (check_exist != null)
                            //{
                            //    check_exist.ten_day_du = ttnd.ten_day_du;
                            //    check_exist.so_dien_thoai = ttnd.so_dien_thoai;
                            //    check_exist.email = ttnd.email;
                            //    check_exist.thoigian_tao = time_tao;
                            //    _context.thong_tin_nguoi_dung.Update(check_exist).Property(e => e.id).IsModified = false;
                            //    _context.SaveChanges();
                            //}
                            //else
                            //{
                            //    _context.thong_tin_nguoi_dung.Add(ttnd);
                            //    _context.SaveChanges();
                            //}
                            //time_tao++;
                        }
                    }
                }
                return lst;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //[HttpGet("DownAllDonVi")]
        //[AllowAnonymous]
        [NonAction]
        public async Task<IActionResult> DownAllDonVi()
        {
            try
            {
                var domain = "https://api.qlcb.ungdungtructuyen.vn/api/dept/getlistdonvi";
                var accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0Y2hzY2IiLCJzY29wZSI6InN0cmluZyIsImp0aSI6ImE0N2Y0MzhlLTE3MDItNDQyMi05ZTQ0LTMzNmVjZmNkZTgwZCIsImV4cCI6MTcyOTU4NTg0MywiaXNzIjoiTXlBcHBJc3N1ZXIiLCJhdWQiOiJNeUFwcEF1ZGllbmNlIn0.f_qW11X8Ezr_dCX-SIKmCePWl9_er9BleQxUrT_-0xQ";
                var handler = new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
                };

                using (HttpClient client = new HttpClient(handler))
                {
                    // Set the authorization header with the Bearer token
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                    // Make the GET request
                    HttpResponseMessage response = await client.GetAsync(domain);

                    if (response.IsSuccessStatusCode)
                    {
                        // Read the response content
                        string responseData = await response.Content.ReadAsStringAsync();
                        //Console.WriteLine("Response Data: " + responseData);
                        var result = JsonConvert.DeserializeObject<dynamic>(responseData);

                        var time = 1729581675;
                        var i = 1;
                        foreach (var item in result)
                        {
                            thong_tin_don_vi thong_tin_don_vi = new thong_tin_don_vi();
                            thong_tin_don_vi.ma = i.ToString();
                            thong_tin_don_vi.ma_hanhchinh = item?.deptCode;
                            thong_tin_don_vi.ten = item?.deptName;
                            thong_tin_don_vi.ma_parent = item?.parentCode;
                            thong_tin_don_vi.diachi = item?.address;
                            thong_tin_don_vi.dienthoai = item?.mobile;
                            thong_tin_don_vi.mail = item?.email;
                            thong_tin_don_vi.fax = "";
                            thong_tin_don_vi.website = "";
                            thong_tin_don_vi.mota = "";
                            thong_tin_don_vi.trangthai_hoatdong = "Đang hoạt động";
                            thong_tin_don_vi.thoigian_tao = time;
                            thong_tin_don_vi.daxoa = false;

                            _context.thong_tin_don_vi.Add(thong_tin_don_vi);
                            _context.SaveChanges();
                            time++;
                            i++;
                        }

                        return Ok(result);
                    }
                    else
                    {
                        //Console.WriteLine("Error: " + response.StatusCode);
                        return Ok();
                    }
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex });
            }
        }

        [NonAction]
        public bool ValidateCredentials(string sUserName, string sPassword)
        {
            var domain = "10.1.10.9";
            var default_ou = "DC=monre,DC=gov,DC=vn";
            var service_user = "detai-qltk";
            var service_password = "Passw0rdAdminTaikhoan@123";

            PrincipalContext oPrincipalContext = new PrincipalContext(ContextType.Domain, domain, default_ou, service_user, service_password);
            if (oPrincipalContext == null) return false;
            return oPrincipalContext.ValidateCredentials(sUserName, sPassword);
        }
    }
}