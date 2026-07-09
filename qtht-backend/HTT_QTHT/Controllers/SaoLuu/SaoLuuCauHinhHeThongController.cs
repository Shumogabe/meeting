using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Minio;
using Minio.DataModel.Args;
using Minio.Exceptions;
using HTT_QTHT.Api.Services;
using HTT_QTHT.Api.Utils;
using HTT_QTHT.Models;
using Newtonsoft.Json;
using System.Text;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Text.Json;
using Swashbuckle.AspNetCore.SwaggerUI;

namespace HTT_QTHT.Controllers
{
    [Route("api/htt_qtht")]
    [ApiController]
    [Authorize]
    public class SaoLuuCauHinhHeThongController : ControllerBase
    {
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _httcontext;
        private IConfiguration _configuration;
        public SaoLuuCauHinhHeThongController(IConfiguration configuration, HTT_Context httcontext, QTHT_HTT_Context context)
        {
            _httcontext = httcontext;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("sao_luu_cau_hinh_he_thong/upsert")]
        public IActionResult Upsert_saoluu_ch_hethong(sao_luu_cau_hinh_he_thong dataSend)
        {
            if (dataSend.ten_bang.Count() < 0 || string.IsNullOrEmpty(dataSend.tenfile_saoluu))
            {
                return StatusCode(400, "ten_bang_and_tenfile_saoluu_required");
            }
            var thoigian = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
            var maCreate = Utils.ToID(string.Join("-", dataSend.ten_bang) + "-" + dataSend.tenfile_saoluu + "-" + thoigian);
            var _DbItem = _context.sao_luu_cau_hinh_he_thong.Find(maCreate);
            if (_DbItem == null)
            {
                if (!string.IsNullOrEmpty(dataSend.ma) && dataSend.ma != maCreate)
                {
                    var obj_delete = _context.sao_luu_cau_hinh_he_thong.Find(dataSend.ma);
                    if (obj_delete != null)
                        _context.sao_luu_cau_hinh_he_thong.Remove(obj_delete);
                }
                dataSend.ma = maCreate;
                dataSend.thoigian_saoluu = thoigian;
                _context.sao_luu_cau_hinh_he_thong.Add(dataSend);
            }
            else
            {
                _DbItem.Assign(dataSend);
                _context.sao_luu_cau_hinh_he_thong.Update(_DbItem);
            }
            _context.SaveChanges();

            return Ok(dataSend);
        }

        [HttpPost("sao_luu_cau_hinh_he_thong-downloadfile")]
        public async Task<IActionResult> DownloadFile_saoluu_ch_hethong(sao_luu_cau_hinh_he_thong dataSend)
        {
            try
            {
                string content = "";
                List<string> items = new List<string>();

                var cf = _configuration.GetSection("CauHinh:HeThong");
                List<CauHinhItem> list = new List<CauHinhItem>();
                cf.Bind(list);
                foreach (var c in list)
                {
                    if (c.tencauhinh != null || c.tenhienthi != null || c.giatri != null)
                    {
                        tl_ch_baocaothongke model = new tl_ch_baocaothongke();
                        model.tencauhinh = c.tencauhinh;
                        model.tenhienthi = c.tenhienthi;
                        model.giatri = c.giatri;
                        if (!string.IsNullOrEmpty(model.tencauhinh))
                        {
                            //var space = "\n" + new string('-', 1000) + "\n";
                            var space = ", \n";
                            content += !content.Contains(model.tencauhinh) ? JsonConvert.SerializeObject(model) + space : "";
                            content += space;
                        }
                    }
                }

                var filePath = dataSend.tenfile_saoluu + ".json";

                var byteArray = Encoding.UTF8.GetBytes(content);

                var stream = new MemoryStream(byteArray);

                var file = File(stream, "application/octet-stream", filePath);

                return file;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Chi tiết lỗi: {ex.Message}");
            }
        }

        [HttpPost("sao_luu_cau_hinh_he_thong-uploadfile")]
        public async Task<IActionResult> UploadFile_saoluu_ch_hethong(sao_luu_cau_hinh_he_thong dataSend)
        {

            try
            {
                var content = dataSend.ds_ten_bang;

                var filePath = dataSend.tenfile_saoluu + ".json";

                var byteArray = Encoding.UTF8.GetBytes(System.Text.Json.JsonSerializer.Serialize(content, new JsonSerializerOptions { WriteIndented = true }));

                var stream = new MemoryStream(byteArray);

                var file = File(stream, "application/octet-stream", filePath);

                
                try
                {
                    var cf = _configuration.GetSection("HeThong:HeThong_minio");
                    string minioAccessKey, minioSecretKey, minioBucket, minioEndpoint;

                    using (JsonDocument document = JsonDocument.Parse(cf.Get<CauHinhItem>().giatri))
                    {
                        JsonElement root = document.RootElement;
                        minioAccessKey = root.GetProperty("usr").GetString();
                        minioSecretKey = root.GetProperty("pw").GetString();
                        minioBucket = root.GetProperty("bucket").GetString();
                        minioEndpoint = root.GetProperty("domain").GetString();
                    }

                    var minioDataSecretKey = EncryptionHelper.Decrypt(minioAccessKey, minioSecretKey);

                    // Create MinIO client
                    var minio = new MinioClient()
                        .WithEndpoint(minioEndpoint)
                        .WithCredentials(minioAccessKey, minioDataSecretKey)
                        .Build();
                    if (file == null || file.FileStream.Length <= 0)
                    {
                        return StatusCode(299, "Chưa có file để đẩy lên");
                    }
                    var thoigian = Utils.DateTimeToUnixTimeStamp(DateTime.Now);
                    var maCreate = Utils.ToID(string.Join("-", dataSend.ten_bang) + "-" + dataSend.tenfile_saoluu + "-" + thoigian);

                    var putObjectArgs = new PutObjectArgs()
                            .WithBucket(minioBucket)
                            .WithObject("saoluu_ch_hethong/" + maCreate + ".json")
                            .WithStreamData(stream) // Use the stream directly
                            .WithContentType(file.ContentType)
                            .WithObjectSize(file.FileStream.Length);

                    await minio.PutObjectAsync(putObjectArgs).ConfigureAwait(false); // Upload the object
                    return Ok(new { Message = $"\nSuccessfully uploaded \n" });
                }
                catch (MinioException ex)
                {
                    return StatusCode(500, $"Lỗi Minio:: {ex.Message}");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Chi tiết lỗi: {ex.Message}");
            }
        }

        [HttpGet("sao_luu_cau_hinh_he_thong/{id}")]
        public IActionResult Get_saoluu_ch_hethong_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var _DbItem = _context.sao_luu_cau_hinh_he_thong.Find(id);
            if (_DbItem == null)
                return StatusCode(400, "id_notFound");
            if (_DbItem != null && _DbItem.ten_bang != null)
            {

                var ListBangDuLieu = _context.tl_ch_hethong
                .Where(t => _DbItem.ten_bang.Contains(t.tencauhinh))
                .ToList();
                _DbItem.ds_ten_bang = ListBangDuLieu;
            }
            return Ok(_DbItem);
        }

        [HttpPost("sao_luu_cau_hinh_he_thong/delete/{id}")]
        public IActionResult Delete_saoluu_ch_hethong_ById(string id)
        {
            if (string.IsNullOrEmpty(id))
                return StatusCode(400, "id_required");
            var db_item = _context.sao_luu_cau_hinh_he_thong.Find(id);
            if (db_item == null)
                return StatusCode(400, "id_notFound");
            _context.sao_luu_cau_hinh_he_thong.Remove(db_item);
            _context.SaveChanges();
            return Ok("Xóa thành công");
        }

        [HttpPost("sao_luu_cau_hinh_he_thongs")]
        public IActionResult List_saoluu_ch_hethongs(CommonRequest req)
        {
            var qr = _context.sao_luu_cau_hinh_he_thong.AsQueryable();

            if (!string.IsNullOrEmpty(req.tu_khoa))
            {
                req.tu_khoa = req.tu_khoa.Trim();
                var tuKhoaUpper = req.tu_khoa.ToUpper();
                qr = qr.Where(t => t.ten_bang.ToString().ToUpper().Contains(tuKhoaUpper) || t.tenfile_saoluu.ToUpper().Contains(tuKhoaUpper));
            }
            if (req?.filter_time_from > 0)
            {
                qr = qr.Where(t => t.thoigian_saoluu >= req.filter_time_from);
            }
            if (req?.filter_time_to > 0)
            {
                qr = qr.Where(t => t.thoigian_saoluu <= req.filter_time_to);
            }

            var recordCount = 0;
            if (string.IsNullOrEmpty(req.anchor))
            {
                recordCount = qr.Count();
            }
            qr = qr.OrderByDescending(k => k.thoigian_saoluu).ThenBy(k => k.ma);
            if (req.anchor != null && req.anchor.Trim() != "")
            {
                string[] parts = req.anchor.Split('#');
                if (parts.Length >= 2)
                {
                    if (long.TryParse(parts[0], out long anchorCreated))
                    {
                        string anchorMaDinhDanh = parts[1];
                        qr = qr.Where(k => k.thoigian_saoluu < anchorCreated || (k.thoigian_saoluu == anchorCreated && k.ma.CompareTo(anchorMaDinhDanh) > 0));
                    }
                }
            }

            if (req.limit < 1)
            {
                req.limit = 10000;
            }
            qr = qr.Take(req.limit + 1);

            var listRecords = qr.ToList();

            var res = new sao_luu_cau_hinh_he_thongs
            {
                limit = req.limit
            };
            if (listRecords.Count > req.limit)
            {
                var anchorResMaDinhDanh = listRecords[req.limit - 1].ma;
                var anchorCreatedNumber = listRecords[req.limit - 1].thoigian_saoluu;
                var anchorResCreated = "";
                // Chuyển đổi số thành chuỗi nếu số lớn hơn 0, ngược lại giữ nguyên chuỗi rỗng
                anchorResCreated = anchorCreatedNumber > 0 ? anchorCreatedNumber.ToString() : "";

                res.anchor = String.Concat(anchorResCreated, "#", anchorResMaDinhDanh);
                res.Records = listRecords.Take(req.limit).ToList();
            }
            else
            {
                res.Records = listRecords;
            }
            res.count = recordCount;

            //foreach (var record in listRecords)
            //{
            //    record.ds_ten_bang = string.Join("-", record.ten_bang);
            //}

            return Ok(res);
        }

    }
}
