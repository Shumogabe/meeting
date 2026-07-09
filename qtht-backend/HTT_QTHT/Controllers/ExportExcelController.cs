using HTT_QTHT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    public class ExportExcelController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        public ExportExcelController(QTHT_HTT_Context context)
        {
            _context = context;
        }

        /// <summary>
        /// POST: api/nghiepvu/log_ql_dangnhap/export_excel
        /// <param name="tu_khoa">Search by words.</param> by ten or ten_dangnhap or noi_dung
        /// <param name="limit">limit records size</param>
        /// <param name="don_vi">Search by words.</param>
        /// <param name="anchor">Last record id.</param>
        /// <param name="filter_time_from">time from</param>
        /// <param name="filter_time_to">time from</param>
        [HttpPost("log_ql_dangnhap/export_excel")]
        [AllowAnonymous]
        public IActionResult Export_log_truycapphanmem(CommonRequest req)
        {
            var qr = _context.log_truycapphanmem.AsQueryable();
            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.ten_dangnhap.ToUpper().Contains(tuKhoaUpper) || t.ten_ung_dung.ToUpper().Contains(tuKhoaUpper)
                   || t.ip_dangnhap.ToUpper().Contains(tuKhoaUpper));
            }
            if (req?.filter_time_from > 0)
            {
                qr = qr.Where(t => t.thoigian_dangnhap >= req.filter_time_from);
            }
            if (req?.filter_time_to > 0)
            {
                qr = qr.Where(t => t.thoigian_dangnhap <= req.filter_time_to);
            }
            if (!string.IsNullOrEmpty(req?.don_vi))
            {
                var tukhoa_don_vi = req?.don_vi;
                var don_vi = _context.thong_tin_don_vi.Where(t => t.ten.ToUpper().Contains(tukhoa_don_vi) || t.ma_hanhchinh.ToUpper().Contains(tukhoa_don_vi)
                   || t.diachi.ToUpper().Contains(tukhoa_don_vi) || t.dienthoai.ToUpper().Contains(tukhoa_don_vi)
                   || t.mail.ToUpper().Contains(tukhoa_don_vi) || t.fax.ToUpper().Contains(tukhoa_don_vi)
                   || t.website.ToUpper().Contains(tukhoa_don_vi)).Select(x => x.ma).ToList();
                var nguoi_dung = _context.thong_tin_nguoi_dung.Where(x => don_vi.Contains(x.ma_tochuc)).Select(x => x.ten_dangnhap).ToList();
                qr = qr.Where(t => nguoi_dung.Contains(t.ten_dangnhap));
            }

            var data = qr.ToList();
            var sttInit = 1;
            foreach (var d in data)
            {
                d.stt = sttInit;
                if (d.thoigian_dangnhap > 0)
                {
                    DateTime dateTime = DateTimeOffset.FromUnixTimeMilliseconds(d.thoigian_dangnhap).DateTime;
                    d.thoi_gian_gui_datetimestr = dateTime.ToString("yyyy-MM-dd HH:mm:ss");
                }
                sttInit++;
            }

            var stream = new MemoryStream();

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var package = new ExcelPackage(stream))
            {
                var sheet = package.Workbook.Worksheets.Add("Thống kê đăng nhập");
                //sheet.Cells.LoadFromCollection(data, true);
                sheet.Cells[1, 1].Value = "STT";
                sheet.Cells[1, 2].Value = "Mã";
                sheet.Cells[1, 3].Value = "Tên đăng nhập";
                sheet.Cells[1, 4].Value = "Tên ứng dụng";
                sheet.Cells[1, 5].Value = "IP đăng nhập";
                sheet.Cells[1, 6].Value = "Trạng thái đăng nhập";
                sheet.Cells[1, 7].Value = "Thời gian đăng nhập";

                int rowIdx = 2;
                foreach (var d in data)
                {
                    sheet.Cells[rowIdx, 1].Value = d.stt;
                    sheet.Cells[rowIdx, 2].Value = d.ma;
                    sheet.Cells[rowIdx, 3].Value = d.ten_dangnhap;
                    sheet.Cells[rowIdx, 4].Value = d.ten_ung_dung;
                    sheet.Cells[rowIdx, 5].Value = d.ip_dangnhap;
                    sheet.Cells[rowIdx, 6].Value = d.trangthai_dangnhap;
                    sheet.Cells[rowIdx, 7].Value = d.thoi_gian_gui_datetimestr;
                    rowIdx++;
                }
                // Style cho hàng header
                var headerRange = sheet.Cells[1, 1, 1, 7];
                headerRange.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                headerRange.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Yellow);
                headerRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                headerRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                headerRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                //headerRange.Style.Border.BorderAround(ExcelBorderStyle.Thin);
                // Set column widths
                sheet.Column(1).Width = 7; // STT
                sheet.Column(2).Width = 25; // Mã
                sheet.Column(3).Width = 25; // Tên đăng nhập
                sheet.Column(4).Width = 25; // Tên ứng dụng
                sheet.Column(5).Width = 35; // IP đăng nhập
                sheet.Column(6).Width = 50; // Trạng thái đăng nhập
                sheet.Column(7).Width = 30; // Thời gian đăng nhập

                package.Save();
            }
            stream.Position = 0;

            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "log_dangnhap.xlsx");
        }

        /// <summary>
        /// POST: api/nghiepvu/log_ql_nhat_ky_loi/export_excel
        /// <param name="tu_khoa">Search by words.</param> by ten or ten_dangnhap or noi_dung
        /// <param name="limit">limit records size</param>
        /// <param name="don_vi">Search by words.</param>
        /// <param name="anchor">Last record id.</param>
        /// <param name="filter_time_from">time from</param>
        /// <param name="filter_time_to">time from</param>
        [HttpPost("log_ql_nhat_ky_loi/export_excel")]
        [AllowAnonymous]
        public IActionResult Export_log_ql_nhat_ky_loi(CommonRequest req)
        {
            var qr = _context.log_ql_nhat_ky_loi.AsQueryable();
            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.noi_dung.ToUpper().Contains(tuKhoaUpper));
            }
            if (req?.filter_time_from > 0)
            {
                qr = qr.Where(t => t.thoigian_loi >= req.filter_time_from);
            }
            if (req?.filter_time_to > 0)
            {
                qr = qr.Where(t => t.thoigian_loi <= req.filter_time_to);
            }

            var data = qr.ToList();
            var sttInit = 1;
            foreach (var d in data)
            {
                d.stt = sttInit;
                if (d.thoigian_loi > 0)
                {
                    DateTime dateTime = DateTimeOffset.FromUnixTimeMilliseconds(d.thoigian_loi).DateTime;
                    d.thoi_gian_gui_datetimestr = dateTime.ToString("yyyy-MM-dd HH:mm:ss");
                }
                sttInit++;
            }

            var stream = new MemoryStream();

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var package = new ExcelPackage(stream))
            {
                var sheet = package.Workbook.Worksheets.Add("Thống kê đăng nhập");
                //sheet.Cells.LoadFromCollection(data, true);
                sheet.Cells[1, 1].Value = "STT";
                sheet.Cells[1, 2].Value = "Thời gian lỗi";
                sheet.Cells[1, 3].Value = "Nội dung";

                int rowIdx = 2;
                foreach (var d in data)
                {
                    sheet.Cells[rowIdx, 1].Value = d.stt;
                    sheet.Cells[rowIdx, 2].Value = d.thoi_gian_gui_datetimestr;
                    sheet.Cells[rowIdx, 3].Value = d.noi_dung;
                    rowIdx++;
                }
                // Style cho hàng header
                var headerRange = sheet.Cells[1, 1, 1, 3];
                headerRange.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                headerRange.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Yellow);
                headerRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                headerRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                headerRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                //headerRange.Style.Border.BorderAround(ExcelBorderStyle.Thin);
                // Set column widths
                sheet.Column(1).Width = 7; // STT
                sheet.Column(2).Width = 25; // Thời gian lỗi
                sheet.Column(3).Width = 25; // Nội dung

                package.Save();
            }
            stream.Position = 0;

            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "log_dangnhap.xlsx");
        }

        /// <summary>
        /// POST: api/nghiepvu/log_ql_dangkydichvu/export_excel
        /// <param name="tu_khoa">Search by words.</param> by ten or ten_dangnhap or noi_dung
        /// <param name="limit">limit records size</param>
        /// <param name="don_vi">Search by words.</param>
        /// <param name="anchor">Last record id.</param>
        /// <param name="filter_time_from">time from</param>
        /// <param name="filter_time_to">time from</param>
        [HttpPost("log_ql_dangkydichvu/export_excel")]
        [AllowAnonymous]
        public IActionResult Export_log_ql_dangkydichvu(CommonRequest req)
        {
            var qr = _context.log_ql_dangkydichvu.AsQueryable();
            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.tai_khoan.ToUpper().Contains(tuKhoaUpper) || t.noi_dung.ToUpper().Contains(tuKhoaUpper)
                   || t.ip_may.ToUpper().Contains(tuKhoaUpper));
            }
            if (!string.IsNullOrEmpty(req.tai_khoan))
            {
                req.tai_khoan = req.tai_khoan.Trim();
                var tuKhoaUpper = req.tai_khoan.ToUpper();
                qr = qr.Where(t => t.tai_khoan.ToUpper().Contains(tuKhoaUpper));
            }
            if (!string.IsNullOrEmpty(req.don_vi))
            {
                req.don_vi = req.don_vi.Trim();
                var tuKhoaUpper = req.don_vi.ToUpper();
                var don_vi = _context.thong_tin_don_vi.Where(t => t.ten.ToUpper().Contains(tuKhoaUpper) || t.ma_hanhchinh.ToUpper().Contains(tuKhoaUpper)
                   || t.diachi.ToUpper().Contains(tuKhoaUpper) || t.dienthoai.ToUpper().Contains(tuKhoaUpper)
                   || t.mail.ToUpper().Contains(tuKhoaUpper) || t.fax.ToUpper().Contains(tuKhoaUpper)
                   || t.website.ToUpper().Contains(tuKhoaUpper)).Select(x => x.ma).ToList();
                var nguoi_dung = _context.thong_tin_nguoi_dung.Where(x => don_vi.Contains(x.ma_tochuc)).Select(x => x.ten_dangnhap).ToList();
                qr = qr.Where(t => nguoi_dung.Contains(t.tai_khoan));
            }
            if (req?.filter_time_from > 0)
            {
                qr = qr.Where(t => t.thoigian_tao >= req.filter_time_from);
            }
            if (req?.filter_time_to > 0)
            {
                qr = qr.Where(t => t.thoigian_tao <= req.filter_time_to);
            }

            var data = qr.ToList();
            var sttInit = 1;
            foreach (var d in data)
            {
                d.stt = sttInit;
                if (d.thoigian_tao > 0)
                {
                    DateTime dateTime = DateTimeOffset.FromUnixTimeMilliseconds(d.thoigian_tao).DateTime;
                    d.thoi_gian_gui_datetimestr = dateTime.ToString("yyyy-MM-dd HH:mm:ss");
                }
                sttInit++;
            }

            var stream = new MemoryStream();

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var package = new ExcelPackage(stream))
            {
                var sheet = package.Workbook.Worksheets.Add("Thống kê đăng nhập");
                //sheet.Cells.LoadFromCollection(data, true);
                sheet.Cells[1, 1].Value = "STT";
                sheet.Cells[1, 2].Value = "Mã";
                sheet.Cells[1, 3].Value = "Tên tài khoản";
                sheet.Cells[1, 4].Value = "Nội dung";
                sheet.Cells[1, 5].Value = "IP máy";
                sheet.Cells[1, 6].Value = "Chức năng";
                sheet.Cells[1, 7].Value = "Loại hoạt động";
                sheet.Cells[1, 8].Value = "Thời gian tạo";

                int rowIdx = 2;
                foreach (var d in data)
                {
                    sheet.Cells[rowIdx, 1].Value = d.stt;
                    sheet.Cells[rowIdx, 2].Value = d.ma;
                    sheet.Cells[rowIdx, 3].Value = d.tai_khoan;
                    sheet.Cells[rowIdx, 4].Value = d.noi_dung;
                    sheet.Cells[rowIdx, 5].Value = d.ip_may;
                    sheet.Cells[rowIdx, 6].Value = d.chuc_nang;
                    sheet.Cells[rowIdx, 7].Value = d.loai_hoatdong;
                    sheet.Cells[rowIdx, 8].Value = d.thoi_gian_gui_datetimestr;
                    rowIdx++;
                }
                // Style cho hàng header
                var headerRange = sheet.Cells[1, 1, 1, 8];
                headerRange.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                headerRange.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.Yellow);
                headerRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                headerRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                headerRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                //headerRange.Style.Border.BorderAround(ExcelBorderStyle.Thin);
                // Set column widths
                sheet.Column(1).Width = 7; // STT
                sheet.Column(2).Width = 25; // Mã
                sheet.Column(3).Width = 25; // Tên tài khoản
                sheet.Column(4).Width = 25; // Nội dung
                sheet.Column(5).Width = 35; // IP máy
                sheet.Column(6).Width = 50; // Chức năng
                sheet.Column(7).Width = 30; // Loại hoạt động
                sheet.Column(8).Width = 30; // Thời gian tạo

                package.Save();
            }
            stream.Position = 0;

            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "log_dangnhap.xlsx");
        }

    }
}
