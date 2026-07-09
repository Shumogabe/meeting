namespace HTT_QTHT.Api.Helpers
{
    public enum ApprovalStatus
    {
        Draft = 0, // bản nháp
        PendingApprove = 1, //Chờ duyệt
        Approved = 2, // đã duyệt
        Unapproved = 3,//Đã hủy duyệt
        Published = 4, // đã công bố
        Unpublished = 5  // hủy công bố
    }
    public enum FileType
    {
        ArticleImage = 1, // Ảnh bài viết
        ArticleVideo = 2,// Video bài viết,
        ArticleData = 9,//Tư liệu bài viết
        Laws = 3,  // file văn bản
        Link = 4,  // ảnh đại diện của liên kết,
        Document = 5, // file tư liệu
        Procedure = 6, //file thủ tục hành chính,
        Question = 7,  //file trả lời câu hỏi (nếu có)
        Answer = 8,  //file trả lời câu hỏi (nếu có)
        WorkingSchedule = 11, //Lịch công tác
        ProjectInfo = 12,//Thông tin dự án
        InfoCommunication = 13//Thông tin tuyên truyền

    }
    public enum Interaction //tương tác
    {
        View = 0,
        Comment = 1,
        Rate = 2
    }

}
