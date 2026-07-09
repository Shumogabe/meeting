using System;
using System.Linq;
using System.Net;

namespace HTT.Api.Utils
{
    public class Util
    {
        private static Random random = new Random();
        public static string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public static string RandomStringUpper(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public static string RandomStringNumber(int length)
        {
            const string chars = "0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
        public static bool sendSMS(string sodienthoai, string content, string serviceurl)
        {
            try
            {
                //string serviceurl = "http://dvcapi.monre.gov.vn/api/SMSDVC/sendSMS?reqid=1";
                string httpservice_new = @"" + serviceurl + "&mobilelist=" + sodienthoai + "&content=" + content;

                Uri address = new Uri(httpservice_new);
                HttpWebRequest request = WebRequest.Create(address) as HttpWebRequest;
                request.Method = "POST";
                request.ContentType = "application/x-www-form-urlencoded";
                request.ContentLength = 0;
                //WebResponse authResponseTwitter = request.GetResponse();
                if (!string.IsNullOrWhiteSpace(sodienthoai))
                {
                    HttpWebResponse myHttpWebResponse = (HttpWebResponse)request.GetResponse();
                    if (myHttpWebResponse.StatusCode != HttpStatusCode.OK)
                        return false;
                    else
                        return true;
                }
                else return false;
            }
            catch (Exception) { throw; }
        }

        public static string NonUnicode(string text)
        {
            string[] arr1 = new string[] { "á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ",
            "đ",
            "é","è","ẻ","ẽ","ẹ","ê","ế","ề","ể","ễ","ệ",
            "í","ì","ỉ","ĩ","ị",
            "ó","ò","ỏ","õ","ọ","ô","ố","ồ","ổ","ỗ","ộ","ơ","ớ","ờ","ở","ỡ","ợ",
            "ú","ù","ủ","ũ","ụ","ư","ứ","ừ","ử","ữ","ự",
            "ý","ỳ","ỷ","ỹ","ỵ",};
            string[] arr2 = new string[] { "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
            "d",
            "e","e","e","e","e","e","e","e","e","e","e",
            "i","i","i","i","i",
            "o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o",
            "u","u","u","u","u","u","u","u","u","u","u",
            "y","y","y","y","y",};
            for (int i = 0; i < arr1.Length; i++)
            {
                text = text.Replace(arr1[i], arr2[i]);
                text = text.Replace(arr1[i].ToUpper(), arr2[i].ToUpper());
            }
            return text;
        }
        public static string ToID(string name)
        {
            name = name.Trim().ToLower();
            var arr = name.ToCharArray();
            var arrout = new char[arr.Length];
            // remove accents
            Lucene.FoldToASCII(arr, 0, arrout, 0, arr.Length);
            name = new string(arrout);
            return new string(name.Where((c, i) => c == '-' || ('0' <= c && c <= '9') || ('a' <= c && c <= 'z')).ToArray());
        }

        public static long DateTimeToUnixTimeMilliseconds(DateTime dtDateTime)
        {
            return new DateTimeOffset(dtDateTime).ToUnixTimeMilliseconds();
        }

        public static long DateTimeToUnixTimeStamp(DateTime dtDateTime)
        {
            return new DateTimeOffset(dtDateTime).ToUnixTimeSeconds();
        }
    }
}
