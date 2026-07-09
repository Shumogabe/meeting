using System;

namespace QTHT.Api.Models.database.Meeting.Voted
{
    public class Meeting_Voted_Chart
    {

        public string Title { get; set; }
        public Guid VoteId { get; set; }
        public int Vote { get; set; }

    }
}