using System.ComponentModel.DataAnnotations;
using System;

namespace QTHT.Api.Models.database
{
    public class thong_tin_chuc_vu
    {
        [Key] 
        public string? ma { get; set; }
        public string? ten { get; set; }
        public string? ma_hanhchinh { get; set; }
        public int? thutu { get; set; }
        public string? mota { get; set; }
        public string? trangthai_hoatdong { get; set; }
        public Int64 thoigian_tao { get; set; }
        public bool daxoa { get; set; } = false;
        public void Assign(thong_tin_chuc_vu candidate)
        {
            ten = candidate.ten;
            ma_hanhchinh = candidate.ma_hanhchinh;
            mota = candidate.mota;
            trangthai_hoatdong = candidate.trangthai_hoatdong;
        }
    }
}
