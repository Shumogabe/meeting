using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace QTHT.Api.Models.database
{
    public partial class vai_tro_nguoi_dung
    {
        [Key]
        public string? ma { get; set; }
        public string? ten { get; set; }
        public string? mota { get; set; }
        public string? ma_ds_thong_tin_chuc_nangs { get; set; }
        [NotMapped] public List<thong_tin_chuc_nang>? ds_thong_tin_chuc_nangs { get; set; }
        public Int64 thoi_gian_dk { get; set; }
        public Int64 thoigian_tao { get; set; }
        public bool? daxoa { get; set; } = false;
        public void Assign(vai_tro_nguoi_dung candidate)
        {
            ten = candidate.ten;
            mota = candidate.mota;
            ma_ds_thong_tin_chuc_nangs = candidate.ma_ds_thong_tin_chuc_nangs;
        }
    }
}
