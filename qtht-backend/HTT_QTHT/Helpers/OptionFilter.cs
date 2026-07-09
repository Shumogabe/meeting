using Api;

namespace HTT_QTHT.Api.Helpers
{
    public class OptionFilter
    {
        public DateTime? StartDate { get; set; }
        public int PageSize { get; set; } = Program.PageSize;
        public int PageNumber { get; set; } = 1;
        public int PageFirst { get; set; } = 1;
        public string KeyWord { get; set; } = null;
        public string Lang { get; set; } = null;

        public string StartDateString
        {
            get
            {
                return StartDate == null ? null : StartDate.Value.ToString("yyyy-MM-dd h:mm tt");
            }
            set
            {
                //var startdatepre = startdate == null ? null : startdate.Value.ToString("yyyy-MM-dd h:mm tt");
                //Convert.ToDateTime(startdatepre);
            }
        }
        public DateTime? EndDate { get; set; } = null;
        public string EndDateString
        {
            get
            {
                return EndDate == null ? null : EndDate.Value.ToString("yyyy-MM-dd h:mm tt");
            }
            set
            {
                //var enddatepre = enddate == null ? null : enddate.Value.ToString("yyyy-MM-dd h:mm tt");
                //Convert.ToDateTime(enddatepre);
            }
        }
    }
}
