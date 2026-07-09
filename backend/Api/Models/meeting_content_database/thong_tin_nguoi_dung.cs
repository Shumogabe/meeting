using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;

namespace HTT.Api.Models
{
    public partial class thong_tin_nguoi_dung
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        [Key] public string? ten_dangnhap { get; set; }
        public string? ten_day_du { get; set; }
        public string? ma_tochuc { get; set; }
        public string? ma_chucvu { get; set; }
        public string? so_dien_thoai { get; set; }
        public string? email { get; set; }
        public Int64 thoigian_tao { get; set; }
        public string? id_wso2 { get; set; }
        public bool? daxoa { get; set; } = false;
        public string? ma_dinhdanh { get; set; }
        [NotMapped] public thong_tin_don_vi? thong_tin_don_vi { get; set; }
        [NotMapped] public thong_tin_chuc_vu? thong_tin_chuc_vu { get; set; }
        public void Assign(thong_tin_nguoi_dung candidate)
        {
            ten_day_du = candidate.ten_day_du;
            ma_tochuc = candidate.ma_tochuc;
            ma_chucvu = candidate.ma_chucvu;
            so_dien_thoai = candidate.so_dien_thoai;
            email = candidate.email;
        }
    }

    public partial class thong_tin_nguoi_dungs : CommonList
    {
        public List<thong_tin_nguoi_dung>? Records { get; set; }
    }
}
