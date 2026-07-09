using System;

namespace QTHT.Api.Models.database.DichVu
{
    public class DangKyCapPhatDichVu
    {
        public Guid Id { get; set; }
        public string TenDichVu { get; set; }
        public string NoiDung { get; set; }
        public string DonVi { get; set; }
        public string DienThoai { get; set; }
        public string Email { get; set; }
        public string TepTin { get; set; }
        public string NguoiDangKy { get; set; }
        public long? NgayDangKy { get; set; }
        public string NguoiDuyet { get; set; }
        public long? NgayDuyet { get; set; }
        public long? NgayBatDau { get; set; }
        public long? NgayKetThuc { get; set; }
        public int? SoLuongTaiKhoan { get; set; }
        public int? Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? DeletedDate { get; set; }
        public int? DeletedBy { get; set; }
        public bool? IsDeleted { get; set; }

    }
    public class DangKyCapPhatDichVu_Insert
    {
        public string TenDichVu { get; set; }
        public string NoiDung { get; set; }
        public string DonVi { get; set; }
        public string DienThoai { get; set; }
        public string Email { get; set; }
        public string NguoiDangKy { get; set; }
        public long? NgayDangKy { get; set; }
        public string NguoiDuyet { get; set; }
        public long? NgayDuyet { get; set; }
        public string? TepTin { get; set; }
        public long? NgayBatDau { get; set; }
        public long? NgayKetThuc { get; set; }
        public int? SoLuongTaiKhoan { get; set; }
        public int? Status { get; set; }
        public bool? IsDeleted { get; set; }

    }
    public class DangKyCapPhatDichVu_Update
    {
        public Guid Id { get; set; }
        public string TenDichVu { get; set; }
        public string NoiDung { get; set; }
        public string DonVi { get; set; }
        public string DienThoai { get; set; }
        public string Email { get; set; }
        public string NguoiDangKy { get; set; }
        public long? NgayDangKy { get; set; }
        public string NguoiDuyet { get; set; }
        public long? NgayDuyet { get; set; }
        public long? NgayBatDau { get; set; }
        public long? NgayKetThuc { get; set; }
        public string? TepTin { get; set; }
        public int? SoLuongTaiKhoan { get; set; }
        public int? Status { get; set; }
        public bool? IsDeleted { get; set; }

    }
}
