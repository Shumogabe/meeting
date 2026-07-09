using System.Collections.Generic;

namespace HTT.Api.Models
{
    public class cauhinh
    {
       public List<CauHinhItem> BaoCaoThongKe { get; set; }

        
    }
    public class CauHinhItem
    {
        public string tenhienthi { get; set; }
        public string tencauhinh { get; set; }
        public string giatri { get; set; }
    }
}
