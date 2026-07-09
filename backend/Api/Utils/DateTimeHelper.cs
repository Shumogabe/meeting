using System;
namespace HTT.Api.Utils
{
    public static class DateTimeHelper
    {
        /// <summary>
        /// Get the number of milliseconds from 1970-01-01 to the present.
        /// </summary>
        /// <returns></returns>
        public static long GetTimeStamp()
        {
            DateTime DateTime1970 = new DateTime(1970, 1, 1, 0, 0, 0);
            return (long)(DateTime.Now - DateTime1970).TotalMilliseconds;
        }

        /// <summary>
        /// Calculate the number of milliseconds from 1970-01-01 to the specified <see cref="DateTime"/>.
        /// </summary>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public static long GetTimeStamp(DateTime dateTime)
        {
            try
            {
                DateTime DateTime1970 = new DateTime(1970, 1, 1, 0, 0, 0);
                return (long)(dateTime - DateTime1970).TotalMilliseconds;
            }
            catch (Exception){throw;}
        }
        public static long GetTimeStampSecond(DateTime dateTime)
        {
            try
            {
                DateTime DateTime1970 = new DateTime(1970, 1, 1, 0, 0, 0);
                return (long)(dateTime - DateTime1970).TotalSeconds;
            }
            catch (Exception){throw;}
        }
    }
}