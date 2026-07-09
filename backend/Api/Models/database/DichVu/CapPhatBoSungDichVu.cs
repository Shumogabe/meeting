using DocumentFormat.OpenXml.Office2010.ExcelAc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QTHT.Api.Models.database.DichVu
{
    public class CapPhatBoSungDichVu
    {
        [Key]
        public Guid Id { get; set; }
        public Guid? Id_DangKy { get; set; }
        [NotMapped] public string? TenDichVu { get; set; }
        [NotMapped] public string? NguoiDangKy { get; set; }
        public string? DonVi { get; set; }
        public long? NgayBatDau { get; set; }
        public long? NgayKetThuc { get; set; }
        public string? TaiKhoan { get; set; }
        public string? MayChu { get; set; }
        public int? HoatDong { get; set; }
        public DateTime? CreatedDate { get; set; }
        [NotMapped] public long? CreatedDateLong { get; set; }
        public int? CreatedBy { get; set; }
        [NotMapped] public string? CreatedByName { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }
    }
    public class CapPhatBoSungDichVu_Insert
    {
        public Guid? Id_DangKy { get; set; }
        public string? DonVi { get; set; }
        public long? NgayBatDau { get; set; }
        public long? NgayKetThuc { get; set; }
        public string? TaiKhoan { get; set; }
        public string? MayChu { get; set; }
        public int? HoatDong { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
    }
    public class CapPhatBoSungDichVu_Update
    {
        public Guid Id { get; set; }
        public Guid? Id_DangKy { get; set; }
        public string? DonVi { get; set; }
        public long? NgayBatDau { get; set; }
        public long? NgayKetThuc { get; set; }
        public string? TaiKhoan { get; set; }
        public string? MayChu { get; set; }
        public int? HoatDong { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedBy { get; set; }

    }
}
