using System;

namespace HTT.Api.Models
{
    public class ThongTinDangKyDichVu
    {
        public Guid ID { get; set; }
        public Guid ID_ThongTinDangKyDichVu { get; set; }
        public string TieuDe { get; set; }
        public string DienThoai { get; set; }
        public string Email { get; set; }
        public string TenHeThongThongTin { get; set; }
        public string TenDuAn { get; set; }
        public string CanBoKyThuat { get; set; }
        public Int64 DonViQuanTriVanHanh { get; set; }
        public Int64 DonViChuQuan { get; set; }
        public Int64 NgayKetThucSuDung { get; set; }
        public int CapDoHeThongThongTin { get; set; }
        public int TinhTrang { get; set; } //(1: Đang cập nhật, 2: Đã gửi đăng ký, 3: Yêu cầu bổ sung, 4: Đã duyệt và chờ cấp, 5: Đã hủy, 6: Đã tiếp nhận, 7: Đã cấp, 8: Hủy cấp)
        public int LoaiDichVu { get; set; } //(1: cấp, 2: đổi, 3: hủy, 4: nhu cầu sử dụng)
        public string YKienPhanHoi { get; set; }
        public string YKienLanhDao { get; set; }
        public string GhiChu { get; set; }
        public string CreatedBy { get; set; }
        public Int64 CreatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public Int64 UpdatedAt { get; set; }
        public string DeletedBy { get; set; }
        public Int64 DeletedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class ThongTinDangKyDichVu_List
    {
        public Guid ID { get; set; }
        public Guid ID_ThongTinDangKyDichVu { get; set; }
        public string TieuDe { get; set; }
        public string DienThoai { get; set; }
        public string Email { get; set; }
        public string TenHeThongThongTin { get; set; }
        public string TenDuAn { get; set; }
        public string CanBoKyThuat { get; set; }
        public Int64 DonViQuanTriVanHanh { get; set; }
        public string TenDonViQuanTriVanHanh { get; set; }
        public Int64 DonViChuQuan { get; set; }
        public string TenDonViChuQuan { get; set; }
        public Int64 NgayKetThucSuDung { get; set; }
        public int CapDoHeThongThongTin { get; set; }
        public int TinhTrang { get; set; } //(1: Đang cập nhật, 2: Đã gửi đăng ký, 3: Yêu cầu bổ sung, 4: Đã duyệt và chờ cấp, 5: Đã hủy, 6: Đã tiếp nhận, 7: Đã cấp, 8: Hủy cấp)
        public int LoaiDichVu { get; set; } //(1: cấp, 2: đổi, 3: hủy, 4: nhu cầu sử dụng)
        public string YKienPhanHoi { get; set; }
        public string YKienLanhDao { get; set; }
        public string GhiChu { get; set; }
        public string CreatedBy { get; set; }
        public Int64 CreatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public Int64 UpdatedAt { get; set; }
        public string DeletedBy { get; set; }
        public Int64 DeletedAt { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class ThongTinDangKyDichVu_BaoCaoThongKe
    {
        public Guid ID { get; set; }
        public string? TieuDe { get; set; } 
        public string? DienThoai { get; set; }
        public string? Email { get; set; }
        public string? TenHeThongThongTin { get; set; }
        public string? TenDuAn { get; set; }
        public string? CanBoKyThuat { get; set; }
        public Int64? DonViQuanTriVanHanh { get; set; }
        public Int64? DonViChuQuan { get; set; }
        public DateTime? NgayKetThucSuDung { get; set; }
        public int? CapDoHeThongThongTin { get; set; }
        public int? TinhTrang { get; set; } //(1: Đang cập nhật, 2: Đã gửi đăng ký, 3: Yêu cầu bổ sung, 4: Đã duyệt và chờ cấp, 5: Đã hủy, 6: Đã tiếp nhận, 7: Đã cấp, 8: Hủy cấp)
        public string? LoaiDichVu { get; set; } //(1: cấp, 2: đổi, 3: hủy)
        public string? YKienPhanHoi { get; set; }
        public string? YKienLanhDao { get; set; }
        public string? GhiChu { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        /// <summary>
        /// //////
        /// </summary>
        public string? Ten { get; set; }
        public string? MayChuVatLy { get; set; }
        public string? HeThongThongTin { get; set; }
        public string? TrungTamDuLieu { get; set; }
        public string? HeThong { get; set; }
        public DateTime? NgayCapMayChu { get; set; }
        public DateTime? NgayHetHanSuDung { get; set; }
        public int? SoCPUSocket { get; set; }
        public int? SoCoreMotCPUSocket { get; set; }
        public int? PhanTramSuDungTrungBinh { get; set; }
        public int? PhanTramSuDungThapNhat { get; set; }
        public int? PhanTramSuDungCaoNhat { get; set; }
        public int? SoCoreCPUMayChu { get; set; }
        public int? TongDungLuongRAM { get; set; }
        public int? DungLuongRAMDaDung { get; set; }
        public string? HeDieuHanh { get; set; }
        public int? BangThongUpload { get; set; }
        public int? BangThongDownLoad { get; set; }
    }
    public class ThongTinNhuCauHaTang_BaoCaoThongKe
    {
        public Guid ID { get; set; }
        public string? TieuDe { get; set; }
        public string? DienThoai { get; set; }
        public string? Email { get; set; }
        public string? TenHeThongThongTin { get; set; }
        public string? TenDuAn { get; set; }
        public string? CanBoKyThuat { get; set; }
        public Int64? DonViQuanTriVanHanh { get; set; }
        public Int64? DonViChuQuan { get; set; }
        public DateTime? NgayKetThucSuDung { get; set; }
        public int? CapDoHeThongThongTin { get; set; }
        public int? TinhTrang { get; set; } //(1: Đang cập nhật, 2: Đã gửi đăng ký, 3: Yêu cầu bổ sung, 4: Đã duyệt và chờ cấp, 5: Đã hủy, 6: Đã tiếp nhận, 7: Đã cấp, 8: Hủy cấp)
        public int? LoaiDichVu { get; set; } //(1: cấp, 2: đổi, 3: hủy)
        public string? YKienPhanHoi { get; set; }
        public string? YKienLanhDao { get; set; }
        public string? GhiChu { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        /// <summary>
        /// //////
        /// </summary>
        public string? CPU { get; set; }
        public string? RAM { get; set; }
        public string? OCung { get; set; }
        public string? HeDieuHanh { get; set; }
        public string? Upload { get; set; }
        public string? Download { get; set; }
        public string? CountIPv4 { get; set; }
        public string? CountIPv6 { get; set; }
        public string? PhanMem { get; set; }
    }
}
