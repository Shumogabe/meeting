using System;
using System.ComponentModel.DataAnnotations;

namespace QTHT.Api.Models.database.Meeting.Support
{
    public class Meeting_Support
    {
        [Key]
        public Guid id {  get; set; }    
        public string? Mail { get; set; }
        public string? DienThoai { get; set; }
        public string? NoiDung { get; set; }
        public string? TacGia { get; set; }
        public DateTime? NgayDang { get; set; }
        public string? TraLoi { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
    }

    public class Meeting_Support_Insert
    {
        public string? Mail { get; set; }
        public string? DienThoai { get; set; }
        public string? NoiDung { get; set; }
        public string? TacGia { get; set; }
        public DateTime? NgayDang { get; set; }
        public string? TraLoi { get; set; }
    }

    public class Meeting_Support_Update
    {
        public Guid id {  get; set; }    
        public string? Mail { get; set; }
        public string? DienThoai { get; set; }
        public string? NoiDung { get; set; }
        public string? TacGia { get; set; }
        public DateTime? NgayDang { get; set; }
        public string? TraLoi { get; set; }
    }
}
