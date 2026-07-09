using QTHT.Api.Models.meeting_content_database;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace QTHT.Api.Models.database
{
    public partial class phan_quyen_vai_tro_nguoi_dung
    {
        [Key] public string? ten_dangnhap_nguoidung { get; set; }
        [NotMapped] public thong_tin_nguoi_dung? nguoidung { get; set; }
        public string? ma_ds_vaitros { get; set; }
        [NotMapped] public List<vai_tro_nguoi_dung>? ds_vaitros { get; set; }
        public string? mota { get; set; }
        public Int64 thoigian_tao { get; set; }
        public bool? daxoa { get; set; } = false;
        public void Assign(phan_quyen_vai_tro_nguoi_dung candidate)
        {
            ma_ds_vaitros = candidate.ma_ds_vaitros;
            mota = candidate.mota;
        }
    }
}
