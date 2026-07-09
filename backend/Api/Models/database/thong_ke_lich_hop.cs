using System;

namespace HTT.Api.Models
{
    public class thong_ke_lich_hop
    {
        public Guid id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int TypeId { get; set; } = 0;
        public string FileUrl { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }   
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }  
        public DateTime DeletedDate { get; set;}
        public bool IsDeleted { get; set; }
        public int Status { get; set; }
    }

    public class thong_ke_bieu_quyet
    {
        public Guid id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int TypeId { get; set; } = 1;
        public string FileUrl { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public bool IsDeleted { get; set; }
        public int Status { get; set; }
    }
    public class thong_ke_diem_cau
    {
        public Guid id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int TypeId { get; set; } = 2;
        public string FileUrl { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public bool IsDeleted { get; set; }
        public int Status { get; set; }
    }

    public class thong_ke_tong_hop
    {
        public Guid id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public int TypeId { get; set; } = 3;
        public string FileUrl { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public DateTime DeletedDate { get; set; }
        public bool IsDeleted { get; set; }
        public int Status { get; set; }
    }
}
