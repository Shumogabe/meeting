using System.ComponentModel.DataAnnotations;
using System;

namespace QTHT.Api.Models.database
{
    public partial class thong_tin_chuc_nang
    {
        [Key] public string? ma { get; set; }
        public string? ten { get; set; }
        public string? mota { get; set; }
        public Int64 thoigian_tao { get; set; }
        public void Assign(thong_tin_chuc_nang candidate)
        {
            ten = candidate.ten;
            mota = candidate.mota;
        }
    }
}
