using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using QTHT.Api.Models;
using QTHT.Api.Models.database.Meeting.Voted;
using QTHT.Api.Models.database.Meeting.Votes;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Security.Claims;
using static QTHT.Api.Models.QTHT_HTT_Context;

namespace QTHT.Api.Controllers.MobileApi
{
    [Route("[controller]")]
    [ApiController]
    public class QuanLyBieuQuyetController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly QTHT_HTT_Context _context;
        private readonly HTT_Context _datacontext;
        public QuanLyBieuQuyetController(IConfiguration configuration, QTHT_HTT_Context context, HTT_Context datacontext)
        {
            _configuration = configuration;
            _context = context;
            _datacontext = datacontext;
        }
        #region
        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn xem danh sách chờ biểu quyết trên thiết bị di động, hệ thống lấy danh sách biểu quyết chờ duyệt và hiển thị danh sách  chờ biểu quyết
        /// </summary>
        /// <param name="voteId">Id của danh mục biểu quyết </param>
        /// <returns>Trả về danh sách chờ biểu quyết </returns>
        [HttpGet("danhsachchobieuquyet")]
        public IActionResult GetWaitingVoteList(Guid scheduleId, string? search, int pageSize = 10, int pageNumber = 1)
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            List<Meeting_Votes> items = new List<Meeting_Votes>();
            var meeting_votes = _datacontext.Meeting_Votes
                .Where(x => x.IsDeleted == false
                            && x.ScheduleId == scheduleId
                            && x.End == false
                            && x.Status == true)
                .AsQueryable();
            if (!string.IsNullOrEmpty(search))
            {
                meeting_votes = meeting_votes.Where(x => x.Title.Contains(search));
            }
            var result = meeting_votes
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new
                {
                    c.Id,
                    c.Title,
                    c.ScheduleId,
                    c.Status,
                    c.Type,
                    c.End,
                    c.CreatedDate,
                    c.CreatedBy,
                    c.ModifiedDate,
                    c.ModifiedBy,
                    c.DeletedDate,
                    c.DeletedBy,
                    c.IsDeleted,
                    Meetingvoted = new MeetingVotedContext().GetByVoteId(c.Id),
                    myvoted = new MeetingVotedContext().GetByVoteIdCreatedBy(c.Id, user)
                })
                .ToList();

            return Ok(new { status = true, data = result });
        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn xem danh sách kết quả biểu quyết trên thiết bị di động, hệ thống lấy danh sách kết quả biểu quyết và hiển thị danh sách  kết quả biểu quyết
        /// </summary>
        /// <param name="voteId">Id của danh mục biểu quyết </param>
        /// <returns>Trả về danh sách chờ biểu quyết </returns>
        [HttpGet("danhsachdabieuquyet")]
        public IActionResult GetVotedList(Guid scheduleId, string? search, int pageSize = 10, int pageNumber = 1)
        {
            var userCurrentClaim = User?.FindFirst(ClaimTypes.Name);
            var user_current = userCurrentClaim?.Value;

            if (string.IsNullOrEmpty(user_current))
            {
                var usernameClaim = User?.FindFirst("username");
                user_current = usernameClaim?.Value;
            }
            var user = _context.thong_tin_nguoi_dung.Where(x => x.ten_dangnhap == user_current).Select(x => x.id).FirstOrDefault();
            List<Meeting_Votes> items = new List<Meeting_Votes>();
            var meeting_votes = _datacontext.Meeting_Votes
                .Where(x => x.IsDeleted == false
                            && x.ScheduleId == scheduleId
                            && x.End == true
                            && x.Status == true)
                .AsQueryable();
            if (!string.IsNullOrEmpty(search))
            {
                meeting_votes = meeting_votes.Where(x => x.Title.Contains(search));
            }
            var result = meeting_votes
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(c => new
                {
                    c.Id,
                    c.Title,
                    c.ScheduleId,
                    c.Status,
                    c.Type,
                    c.End,
                    c.CreatedDate,
                    c.CreatedBy,
                    c.ModifiedDate,
                    c.ModifiedBy,
                    c.DeletedDate,
                    c.DeletedBy,
                    c.IsDeleted,
                    Meetingvoted = new MeetingVotedContext().GetByVoteId(c.Id),
                    myvoted = new MeetingVotedContext().GetByVoteIdCreatedBy(c.Id, user)
                })
                .ToList();

            return Ok(new { status = true, data = result });
        }

        /// <summary>
        /// Người quản lý họp trực tuyến có thể chọn xem thông tin danh mục biểu quyết trên thiết bị di động, hệ thống lấy thông tin chi tiết danh mục biểu quyết và hiển thị thông tin
        /// </summary>
        /// <param name="id"></param>
        /// <returns>Thông tin danh mục biểu quyết</returns>
        [HttpGet("xemchitiet")]
        public IActionResult GetVoteById(Guid id)
        {
            var meeting_votes = new MeetingVotesContext().GetById(id);
            if (meeting_votes == null)
            {
                return NotFound(new { status = false, message = "Không có dữ liệu" });
            }
            return Ok(new { status = true, data = meeting_votes });
        }

        /// <summary>
        /// Người quản lí họp trực tuyến có thể tìm kiếm biểu quyết trên thiết bị di động, hệ thống tìm kiếm biểu quyết và hiển thị kết quả
        /// </summary>
        /// <param name="search"></param>
        /// <param name="pageSize"></param>
        /// <param name="pageNumber"></param>
        /// <returns></returns>
        [HttpGet("timkiem")]
        public IActionResult Search(string search)
        {
            var meeting_voted = new MeetingVotedContext().Search(search);
            if (meeting_voted == null)
            {
                return NotFound(new { status = false, message = "Không có dữ liệu" });
            }
            return Ok(new { status = true, data = meeting_voted });
        }

        #endregion
    }
}
