using System.Text;
using System.Text.RegularExpressions;
namespace HTT_QTHT.Api.Helpers
{
    public class Common
    {
        public static DateTime UnixTimeStampToDateTime(double unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddMilliseconds(unixTimeStamp).ToLocalTime();
            return dtDateTime;
        }
        public DateTime FormatDateTimeToYYYYMMDD(DateTime dateTime)
        {
            string preformat = dateTime.ToString("yyyy-MM-dd h:mm tt");
            DateTime date = Convert.ToDateTime(dateTime);
            return date;
        }
        public static string GenerateUrl(string Url)
        {
            Url = ConvertToUnSign(Url);
            string UrlPeplaceSpecialWords = Regex.Replace(Url, @"&quot;|['"",&?%\.!()@$^_+=*:#/\\-]", " ").Trim();
            string RemoveMutipleSpaces = Regex.Replace(UrlPeplaceSpecialWords, @"\s+", " ");
            string ReplaceDashes = RemoveMutipleSpaces.Replace(" ", "-");
            string DuplicateDashesRemove = ReplaceDashes.Replace("--", "-");
            return DuplicateDashesRemove.ToLower();
        }
        public static string ConvertToUnSign(string s)
        {
            Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
            string temp = s.Normalize(NormalizationForm.FormD);
            return regex.Replace(temp, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');
        }
        /// <summary>
        /// Cắt truỗi trả về truối giới hạ số lượng word
        /// </summary>
        /// <param name="str"></param>
        /// <param name="number"></param>
        /// <returns></returns>
        public static string SplidBySpace(string str, int number)
        {
            StringBuilder sb = new StringBuilder();
            if (!str.Equals(null))
            {
                int limit = 0;
                string[] strSpl = str.Split(' ');
                if (strSpl.Length <= number) limit = strSpl.Length;
                else limit = number;
                for (int i = 0; i < limit; i++)
                {
                    sb.Append(strSpl[i] + " ");
                }
            }
            return sb.ToString();
        }

        /// <summary>
        /// Chuyển Text string thành Frindly Url
        /// </summary>
        /// <param name="str"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public static string FriendlyUrl(string str, int id)
        {
            string friendly = string.Empty;
            string[] strArr = str.Split(' ');
            string strFriendly = JoinArr("-", strArr);
            friendly = strFriendly + "-" + id.ToString();
            return friendly;
        }


        /// <summary>
        /// Kiem tra truoi la so
        /// </summary>
        /// <param name="pText"></param>
        /// <returns></returns>
        public bool IsNumber(string pText)
        {
            Regex regex = new Regex(@"^[-+]?[0-9]*\.?[0-9]+$");
            return regex.IsMatch(pText);
        }

        public static string GetDateFormat()
        {
            try
            {
                return System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.ShortDatePattern;
            }
            catch
            {

            }
            return "yyyy-MM-dd";
        }
        public static string GetTimeFormat()
        {
            try
            {
                return System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.ShortTimePattern;
            }
            catch
            {
            }
            return "hh:mm:ss";
        }

        public static string ConvertUnicode(string input)
        {
            string output = Regex.Replace(input, " +", "-");
            Regex regex = new Regex(@"\p{IsCombiningDiacriticalMarks}+");
            string strFormD = output.Normalize(System.Text.NormalizationForm.FormD);
            return regex.Replace(strFormD, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');
        }

        public static string GenShortGuid()
        {
            long i = 1;
            foreach (byte b in Guid.NewGuid().ToByteArray())
            {
                i *= ((int)b + 1);
            }
            return String.Format("{0:x}", i - DateTime.Now.Ticks);
        }

        public static string DecodePagingInfo(string pagingInfo)
        {
            return pagingInfo.Replace(";", "&");
        }

        public static string EncodePagingInfo(string pagingInfo)
        {
            return pagingInfo.Replace("&", ";");
        }

        /// <summary>
        /// Lay 1 phan tu tu string bang dau gach cheo
        /// </summary>
        /// <param name="str"></param>
        /// <param name="i"></param>
        /// <returns></returns>
        public static string SplitStringBySlash(string str, int i)
        {
            try
            {
                string[] arrUrl = str.Split('/');
                string outStr = arrUrl[i];//3=SitePages, 4=test.aspx?id=1
                return outStr;
            }
            catch (Exception)
            {
                return null;
            }
        }
        /// <summary>
        /// Tra ve mot phan tu tu string bang dau hai cham
        /// </summary>
        /// <param name="str"></param>
        /// <param name="i"></param>
        /// <returns></returns>
        public static string SplitStringByColon(string str, int i)
        {
            try
            {
                string[] arrUrl = str.Split(':');
                string outStr = arrUrl[i];//3=SitePages, 4=test.aspx?id=1
                return outStr;
            }
            catch (Exception)
            {
                return null;
            }
        }
        /// <summary>
        /// Tra ve phan tu tu string bang dau cham phay
        /// </summary>
        /// <param name="str"></param>
        /// <param name="i"></param>
        /// <returns></returns>
        public static string SplitStringBySemicolon(string str, int i)
        {
            try
            {
                string[] arrUrl = str.Split(';');
                string outStr = arrUrl[i];//3=SitePages, 4=test.aspx?id=1
                return outStr;
            }
            catch (Exception)
            {
                return null;
            }
        }
        /// <summary>
        /// Trả về phần tử bởi dấu #
        /// </summary>
        /// <param name="str"></param>
        /// <param name="i"></param>
        /// <returns></returns>
        public static string SplitStringByHashtag(string str, int i)
        {
            try
            {
                string[] arrUrl = str.Split('#');
                string outStr = arrUrl[i];//3=SitePages, 4=test.aspx?id=1
                return outStr;
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        /// Lay 1 phan tu tu string bang dau gach cheo
        /// </summary>
        /// <param name="str"></param>
        /// <param name="i"></param>
        /// <returns></returns>
        public static string SplitStringByMinute(string str, int i)
        {
            try
            {
                string[] arrUrl = str.Split('-');
                string outStr = arrUrl[i];//3=SitePages, 4=test.aspx?id=1
                return outStr;

            }
            catch (Exception)
            {
                return null;
            }
        }
        public static string SplitStringByMarkStood(string str, int i)
        {
            try
            {
                string[] arrUrl = str.Split('|');
                string outStr = arrUrl[i];//3=SitePages, 4=test.aspx?id=1
                return outStr;
            }
            catch (Exception)
            {
                return null;
            }
        }
        /// <summary>
        /// Lay 1 phan tu tu string bang dau gach cheo
        /// </summary>
        /// <param name="str"></param>
        /// <param name="i"></param>
        /// <returns></returns>
        public static string SplitStringLastByMinute(string str)
        {
            try
            {
                string outStr = str.Split('-').Last();
                return outStr;

            }
            catch (Exception)
            {
                return null;
            }
        }
        /// <summary>
        /// Lay 1 phan tu tu string bang dau cham
        /// </summary>
        /// <param name="str"></param>
        /// <param name="i"></param>
        /// <returns></returns>
        public static string SplitStringByDots(string str, int i)
        {
            try
            {
                string[] arrUrl = str.Split('.');
                string outStr = arrUrl[i];//3=SitePages, 4=test.aspx?id=1
                return outStr;

            }
            catch (Exception)
            {
                return null;
            }
        }
        /// <summary>
        /// Tra ve phan  tu thu i cua truoi duoc cat boi dau cach
        /// </summary>
        /// <param name="str"></param>
        /// <param name="i"></param>
        /// <returns></returns>
        public static string SplitStringBySpace(string str, int i)
        {
            try
            {
                string[] arrUrl = str.Split(' ');
                return arrUrl[i];
            }
            catch (Exception)
            {
                return null;
            }
        }
        /// <summary>
        /// Tra ve Array duoc cat boi dau cach
        /// </summary>
        /// <param name="str"></param>
        /// <param name="i"></param>
        /// <returns></returns>
        public static Array SplitStringBySpace(string str)
        {
            try
            {
                string[] arrUrl = str.Split(' ');
                return arrUrl;
            }
            catch (Exception)
            {
                return null;
            }
        }
        /// <summary>
        /// Join a key to array then convert array to string
        /// </summary>
        /// <param name="key"></param>
        /// <param name="array"></param>
        /// <returns></returns>
        public static string JoinArr(string key, string[] array)
        {
            return string.Join(key, array);
        }
        public static string RemoveHTMLTags(string Text)
        {
            return Regex.Replace(Text, "<[^>]*>", String.Empty);
        }
    }
}
