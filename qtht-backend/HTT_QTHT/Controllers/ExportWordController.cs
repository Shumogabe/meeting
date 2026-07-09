using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using HTT_QTHT.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NPOI.XWPF.UserModel;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    public class ExportWordController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        public ExportWordController(QTHT_HTT_Context context)
        {
            _context = context;
        }

        /// <summary>
        /// POST: api/nghiepvu/log_ql_dangkydichvu/export_word
        /// <param name="tu_khoa">Search by words.</param> by ten or ten_dangnhap or noi_dung
        /// <param name="limit">limit records size</param>
        /// <param name="don_vi">Search by words.</param>
        /// <param name="anchor">Last record id.</param>
        /// <param name="filter_time_from">time from</param>
        /// <param name="filter_time_to">time from</param>
        //    [HttpPost("log_ql_dangkydichvu/export_word")]
        //    [AllowAnonymous]
        //    public IActionResult Export_log_ql_dangkydichvu_word(CommonRequest req)
        //    {

        //          //    using (var stream = new MemoryStream())
        //            //    {
        //            //        var qr = _context.log_ql_dangkydichvu.AsQueryable();
        //            //        if (!string.IsNullOrEmpty(req.tu_khoa))
        //            //        {
        //            //            req.tu_khoa = req.tu_khoa.Trim();
        //            //            var tuKhoaUpper = req.tu_khoa.ToUpper();
        //            //            qr = qr.Where(t => t.tai_khoan.ToUpper().Contains(tuKhoaUpper) || t.noi_dung.ToUpper().Contains(tuKhoaUpper)
        //            //               || t.ip_may.ToUpper().Contains(tuKhoaUpper));
        //            //        }
        //            //        if (!string.IsNullOrEmpty(req.tai_khoan))
        //            //        {
        //            //            req.tai_khoan = req.tai_khoan.Trim();
        //            //            var tuKhoaUpper = req.tai_khoan.ToUpper();
        //            //            qr = qr.Where(t => t.tai_khoan.ToUpper().Contains(tuKhoaUpper));
        //            //        }
        //            //        if (!string.IsNullOrEmpty(req.don_vi))
        //            //        {
        //            //            req.don_vi = req.don_vi.Trim();
        //            //            var tuKhoaUpper = req.don_vi.ToUpper();
        //            //            var don_vi = _context.thong_tin_don_vi.Where(t => t.ten.ToUpper().Contains(tuKhoaUpper) || t.ma_hanhchinh.ToUpper().Contains(tuKhoaUpper)
        //            //               || t.diachi.ToUpper().Contains(tuKhoaUpper) || t.dienthoai.ToUpper().Contains(tuKhoaUpper)
        //            //               || t.mail.ToUpper().Contains(tuKhoaUpper) || t.fax.ToUpper().Contains(tuKhoaUpper)
        //            //               || t.website.ToUpper().Contains(tuKhoaUpper)).Select(x => x.ma).ToList();
        //            //            var nguoi_dung = _context.thong_tin_nguoi_dung.Where(x => don_vi.Contains(x.ma_tochuc)).Select(x => x.ten_dangnhap).ToList();
        //            //            qr = qr.Where(t => nguoi_dung.Contains(t.tai_khoan));
        //            //        }
        //            //        if (req?.filter_time_from > 0)
        //            //        {
        //            //            qr = qr.Where(t => t.thoigian_tao >= req.filter_time_from);
        //            //        }
        //            //        if (req?.filter_time_to > 0)
        //            //        {
        //            //            qr = qr.Where(t => t.thoigian_tao <= req.filter_time_to);
        //            //        }

        //            //        var data = qr.ToList();
        //            //        var sttInit = 1;
        //            //        foreach (var d in data)
        //            //        {
        //            //            d.stt = sttInit;
        //            //            if (d.thoigian_tao > 0)
        //            //            {
        //            //                DateTime dateTime = DateTimeOffset.FromUnixTimeMilliseconds(d.thoigian_tao).DateTime;
        //            //                d.thoi_gian_gui_datetimestr = dateTime.ToString("yyyy-MM-dd HH:mm:ss");
        //            //            }
        //            //            sttInit++;
        //            //        }
        //            //        Create a Wordprocessing document
        //            //        using (WordprocessingDocument wordDocument = WordprocessingDocument.Create(stream, DocumentFormat.OpenXml.WordprocessingDocumentType.Document))
        //            //        {
        //            //            Add a main document part
        //            //           var mainPart = wordDocument.AddMainDocumentPart();
        //            //            mainPart.Document = new DocumentFormat.OpenXml.Wordprocessing.Document();
        //            //            var body = new Body();
        //            //            body.Append(new Paragraph(new Run(new Text("Hello, this is a DOCX document created in memory!"))));
        //            //            mainPart.Document.Append(body);
        //            //            mainPart.Document.Save();
        //            //        }

        //            //        Reset the stream position to the beginning
        //            //        stream.Position = 0;

        //            //        Return the document as a file
        //            //        return File(stream, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "Document.docx");
        //            //    }
        //            //}
        //            //catch (Exception e)
        //            //{
        //            //    return StatusCode(500, e);
        //            //}

        //            var stream = new MemoryStream();

        //            // Create a new document
        //            XWPFDocument document = new XWPFDocument();

        //            // Create a paragraph
        //            XWPFParagraph paragraph = document.CreateParagraph();
        //            paragraph.Alignment = ParagraphAlignment.CENTER;

        //            // Create a run to hold the text
        //            XWPFRun run = paragraph.CreateRun();
        //            run.FontFamily = "Arial";
        //            run.FontSize = 16;
        //            run.IsBold = true;
        //            run.SetText("Hello, NPOI Word Document!");

        //            XWPFTable table = document.CreateTable(3, 3); // 3 rows and 3 columns

        //            // Fill the table with data
        //            for (int row = 0; row < 3; row++)
        //            {
        //                for (int col = 0; col < 3; col++)
        //                {
        //                    table.GetRow(row).GetCell(col).SetText($"Row {row + 1}, Cell {col + 1}");
        //                }
        //            }

        //            document.Write(stream);

        //            stream.Position = 0;

        //            return File(stream, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "Document.docx");

        //            //return Ok();

        //            //int rowIdx = 1;

        //            //// Create table
        //            //Table table = new Table(rowIdx, 8);
        //            //// Apply styling
        //            //table.Zebra = new ZebraColor("FFFFFF", "dddddd");

        //            //// Populate table
        //            //table[0, 0] = new TableCell(new Text("STT"));
        //            //table[0, 1] = new TableCell(new Text("Mã"));
        //            //table[0, 2] = new TableCell(new Text("Tên tài khoản"));
        //            //table[0, 3] = new TableCell(new Text("Nội dung"));
        //            //table[0, 4] = new TableCell(new Text("IP máy"));
        //            //table[0, 5] = new TableCell(new Text("Chức năng"));
        //            //table[0, 6] = new TableCell(new Text("Loại hoạt động"));
        //            //table[0, 7] = new TableCell(new Text("Thời gian tạo"));

        //            //foreach (var d in data)
        //            //{
        //            //    table[rowIdx, 0].AddChild(new Text(d.stt.ToString()));
        //            //    table[rowIdx, 1].AddChild(new Text(d.ma));
        //            //    table[rowIdx, 2].AddChild(new Text(d.tai_khoan));
        //            //    table[rowIdx, 3].AddChild(new Text(d.noi_dung));
        //            //    table[rowIdx, 4].AddChild(new Text(d.ip_may));
        //            //    table[rowIdx, 5].AddChild(new Text(d.chuc_nang));
        //            //    table[rowIdx, 6].AddChild(new Text(d.loai_hoatdong));
        //            //    table[rowIdx, 7].AddChild(new Text(d.thoi_gian_gui_datetimestr));
        //            //    rowIdx++;
        //            //}

        //            //// Create new Word document from the table
        //            //WordDocument doc = new WordDocument(table);

        //            //// Export Word document
        //            //doc.SaveAs("Document.docx");


        //            //return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "log_dangnhap.xlsx");
        //        }
        [HttpPost("log_ql_dangkydichvu/export_word")]
        [AllowAnonymous]
        public IActionResult Export_log_ql_dangkydichvu_word(CommonRequest req)
        {
            try
            {
                // Step 1: Query the database based on request filters
                var qr = _context.log_ql_dangkydichvu.AsQueryable();

                if (!string.IsNullOrEmpty(req.tu_khoa))
                {
                    req.tu_khoa = req.tu_khoa.Trim();
                    var tuKhoaUpper = req.tu_khoa.ToUpper();
                    qr = qr.Where(t => t.tai_khoan.ToUpper().Contains(tuKhoaUpper) ||
                                       t.noi_dung.ToUpper().Contains(tuKhoaUpper) ||
                                       t.ip_may.ToUpper().Contains(tuKhoaUpper));
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

                    var don_vi = _context.thong_tin_don_vi
                        .Where(t => t.ten.ToUpper().Contains(tuKhoaUpper) ||
                                    t.ma_hanhchinh.ToUpper().Contains(tuKhoaUpper) ||
                                    t.diachi.ToUpper().Contains(tuKhoaUpper) ||
                                    t.dienthoai.ToUpper().Contains(tuKhoaUpper) ||
                                    t.mail.ToUpper().Contains(tuKhoaUpper) ||
                                    t.fax.ToUpper().Contains(tuKhoaUpper) ||
                                    t.website.ToUpper().Contains(tuKhoaUpper))
                        .Select(x => x.ma)
                        .ToList();

                    var nguoi_dung = _context.thong_tin_nguoi_dung
                        .Where(x => don_vi.Contains(x.ma_tochuc))
                        .Select(x => x.ten_dangnhap)
                        .ToList();

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

                // Add serial numbers and formatted timestamps
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

                // Step 2: Create a Word document
                byte[] fileContent;
                using (var stream = new MemoryStream())
                {
                    using (var document = new XWPFDocument())
                    {
                        // Create title
                        XWPFParagraph title = document.CreateParagraph();
                        title.Alignment = ParagraphAlignment.CENTER;
                        var titleRun = title.CreateRun();
                        titleRun.FontFamily = "Arial";
                        titleRun.FontSize = 20;
                        titleRun.IsBold = true;
                        titleRun.SetText("Export Log Đăng Ký Dịch Vụ");

                        // Add blank line
                        document.CreateParagraph().CreateRun().SetText("");

                        // Create table
                        var table = document.CreateTable(data.Count + 1, 8);
                        var headers = new[] { "STT", "Mã", "Tài Khoản", "Nội Dung", "IP Máy", "Chức Năng", "Loại Hoạt Động", "Thời Gian" };

                        // Add headers
                        for (int i = 0; i < headers.Length; i++)
                        {
                            table.GetRow(0).GetCell(i).SetText(headers[i]);
                        }

                        // Add rows
                        for (int i = 0; i < data.Count; i++)
                        {
                            var item = data[i];
                            table.GetRow(i + 1).GetCell(0).SetText(item.stt.ToString());
                            table.GetRow(i + 1).GetCell(1).SetText(item.ma ?? "");
                            table.GetRow(i + 1).GetCell(2).SetText(item.tai_khoan ?? "");
                            table.GetRow(i + 1).GetCell(3).SetText(item.noi_dung ?? "");
                            table.GetRow(i + 1).GetCell(4).SetText(item.ip_may ?? "");
                            table.GetRow(i + 1).GetCell(5).SetText(item.chuc_nang ?? "");
                            table.GetRow(i + 1).GetCell(6).SetText(item.loai_hoatdong ?? "");
                            table.GetRow(i + 1).GetCell(7).SetText(item.thoi_gian_gui_datetimestr ?? "");
                        }

                        document.Write(stream);
                    }

                    fileContent = stream.ToArray();
                }

                // Return as a file
                return new FileContentResult(fileContent, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                {
                    FileDownloadName = "Log_DangKyDichVu.docx"
                };
            }
            catch (Exception e)
            {
                // Handle exceptions
                return StatusCode(500, new { error = e.Message });
            }
        }

    }
}
