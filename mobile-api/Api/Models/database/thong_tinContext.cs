using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq.Dynamic.Core;
using System.Linq;
using QTHT.Api.Models.meeting_content_database;
namespace QTHT.Api.Models.database
{
    public class thong_tinContext
    {
        public object GetThongtinDonVi(string ma_tochuc, QTHT_HTT_Context _context)
        {
            var tochuc = _context.thong_tin_don_vi
                .Where(x => x.ma == ma_tochuc)
                .Select(x => new
                {
                    x.Id,
                    x.ma,
                    x.ten,
                    x.ma_hanhchinh,
                    x.diachi,
                    x.dienthoai,
                    x.mail,
                    x.fax,
                    x.website
                })
                .FirstOrDefault();

            return tochuc;
        }



        public object GetThongTinChucVu(string ma_chucvu, QTHT_HTT_Context _context)
        {
            var chucvu = _context.thong_tin_chuc_vu
                .Where(x => x.ma == ma_chucvu)
                .Select(x => new
                {
                    x.ma,
                    x.ten,
                    x.ma_hanhchinh
                })
                .FirstOrDefault();

            return chucvu;
        }

    }
}
