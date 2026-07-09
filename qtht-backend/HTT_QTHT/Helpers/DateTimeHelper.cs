using System.Globalization;

namespace HTT_QTHT.Api.Helpers
{
    public class DateTimeHelper
    {
        /// <summary>
        /// Lấy ngày theo năm và tuần thứ
        /// </summary>
        /// <param name="year"></param>
        /// <param name="week"></param>
        /// <returns></returns>
        public static DateTime GetDay(int year, int week)
        {
            DateTime day;
            DateTime.TryParse(year.ToString() + "/01/01", out day);
            day = day.AddDays(7 * week);
            return day;
        }
        /// <summary>
        /// Lấy ngày đầu tuần theo hàm GetDay
        /// </summary>
        /// <param name="year"></param>
        /// <param name="week"></param>
        /// <returns></returns>
        public static DateTime Monday(int year, int week)
        {
            DateTime day = GetDay(year, week);
            while (day.DayOfWeek != DayOfWeek.Monday) day = day.AddDays(-1); // tìm đầu tuần
            return day;
        }
        public static DateTime Tuesday(int year, int week)
        {
            return Monday(year, week).AddDays(1);
        }
        public static DateTime Wednesday(int year, int week)
        {
            return Monday(year, week).AddDays(2);
        }
        public static DateTime Thursday(int year, int week)
        {
            return Monday(year, week).AddDays(3);
        }
        public static DateTime Friday(int year, int week)
        {
            return Monday(year, week).AddDays(4);
        }
        public static DateTime Saturday(int year, int week)
        {
            return Monday(year, week).AddDays(5);
        }
        public static DateTime Sunday(int year, int week)
        {
            return Monday(year, week).AddDays(6);
        }


        /// <summary>
        /// Lay nam hien tai
        /// </summary>
        /// <returns>Current Year</returns>
        public static int Year()
        {
            return DateTime.Now.Year;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <returns>Current Month</returns>
        public static int Month()
        {
            return System.DateTime.Now.Month;
        }
        /// <summary>
        /// Lay tuan thu hien tai
        /// </summary>
        /// <returns>week number</returns>
        public static int WeekNum()
        {
            int weekNum = 0;
            DateTime dateTime = DateTime.Now;
            CultureInfo ciCurr = CultureInfo.CurrentCulture;
            weekNum = ciCurr.Calendar.GetWeekOfYear(dateTime, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
            return weekNum;
        }
        /// <summary>
        /// Tra ve tuan thu theo datetime truyen vao
        /// </summary>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public static int WeekNum(DateTime dateTime)
        {
            int weekNum = 0;
            string mdy = Common.SplitStringBySpace(dateTime.ToString(), 0);
            string day = Common.SplitStringBySlash(mdy, 1);
            string month = Common.SplitStringBySlash(mdy, 0);
            string year = Common.SplitStringBySlash(mdy, 2);
            DateTimeFormatInfo dfi = DateTimeFormatInfo.CurrentInfo;
            DateTime date = new DateTime(Convert.ToInt32(year), Convert.ToInt32(month), Convert.ToInt32(day));
            Calendar calendar = dfi.Calendar;
            weekNum = calendar.GetWeekOfYear(date, dfi.CalendarWeekRule, dfi.FirstDayOfWeek);
            return weekNum;
        }
        /// <summary>
        /// Chuyển định dạng Month/Day/Year  Hour:Minute:Sec
        /// </summary>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public static string DayMonthYear(string dateTime)
        {
            string[] strDt = dateTime.Split(' ');
            string[] dt = strDt[0].Split('/');
            return dt[1] + "/" + dt[0] + "/" + dt[2];
        }

        public static string YearMonthDay(string dateTime, char markIn, string markOut)
        {
            string[] strDt = dateTime.Split(markIn);
            return strDt[2] + markOut + strDt[1] + markOut + strDt[0];
        }
        /// <summary>
        /// Chuyen so giay sang datetime
        /// </summary>
        /// <param name="number"></param>
        /// <returns></returns>
        public static DateTime IntToDateTime(int number)
        {
            DateTime dateTime = new DateTime(number);
            return dateTime;
        }
        /// <summary>
        /// DateTime dinh dang 6/25/2016 8:00:00 PM
        /// </summary>
        /// <param name="dt"></param>
        /// <returns></returns>
        public static int DateTimeToSecond(DateTime dt)
        {
            int second = 0;
            string[] strDt = dt.ToString().Split(' ');
            string[] strDMY = strDt[0].ToString().Split('/');
            string[] strHMS = strDt[1].ToString().Split(':');
            int y = Convert.ToInt32(strDMY[2].ToString());
            int m = Convert.ToInt32(strDMY[0].ToString());
            int d = Convert.ToInt32(strDMY[1].ToString());
            int h = Convert.ToInt32(strHMS[0].ToString());
            int mn = Convert.ToInt32(strHMS[1].ToString());
            int s = Convert.ToInt32(strHMS[2].ToString());
            if (strDt[2] == "PM")
            {
                h = h + 12;
            }
            second = (y * 365 * 24 * 60 * 60) + (m * 30 * 24 * 60 * 60) + (d * 24 * 60 * 60) + (h * 60 * 60) + (mn * 60) + s;
            return second;
        }
        public static string CurrentDate()
        {
            string str = string.Empty;
            DateTime thisDay = DateTime.Today;
            str = thisDay.ToString("d");
            return str;
        }
    }
}
