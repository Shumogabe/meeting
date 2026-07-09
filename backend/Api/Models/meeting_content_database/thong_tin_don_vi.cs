using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;

namespace HTT.Api.Models
{
    public partial class thong_tin_don_vi
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        [Key] public string? ma { get; set; }
        public string? ma_parent { get; set; }
        public string? ten { get; set; }
        public string? ma_hanhchinh { get; set; }
        public string? diachi { get; set; }
        public string? dienthoai { get; set; }
        public string? mail { get; set; }
        public string? fax { get; set; }
        public string? website { get; set; }
        public string? mota { get; set; }
        public string? trangthai_hoatdong { get; set; }
        public Int64 thoigian_tao { get; set; }
        public bool? daxoa { get; set; } = false;
        public void Assign(thong_tin_don_vi candidate)
        {
            ten = candidate.ten;
            ma_hanhchinh = candidate.ma_hanhchinh;
            diachi = candidate.diachi;
            dienthoai = candidate.dienthoai;
            mail = candidate.mail;
            fax = candidate.fax;
            website = candidate.website;
            mota = candidate.mota;
            trangthai_hoatdong = candidate.trangthai_hoatdong;
        }
    }
    public partial class thong_tin_don_vis : CommonList
    {
        public List<thong_tin_don_vi>? Records { get; set; }
    }
}
