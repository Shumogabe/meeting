using System;
using System.Collections.Generic;
using QTHT.Api.Models.database.Admin;

namespace QTHT.Api.Models.database.Admin
{
    
    public class ParentCategory
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Alias { get; set; }
        public int ParentId { get; set; }
        public string ParentTitle { get; set; }
    }
    public class Category // chuyên mục bài viết
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Alias { get; set; }
        public string Code { get; set; }
        public int CreatedBy { get; set; }
        public int ParentId { get; set; }
        public string ParentTitle { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Description { get; set; }
        public string DeletedDateString { get; set; }
        public bool IsMain { get; set; }
        public bool DisplayInHome { get; set; }
        public bool DisplayForArticle { get; set; }
        public string Url { get; set; }
        public string Module { get; set; }
        public int Weight { get; set; }
        public List<ArticleType> Subs { get; set; }
        public List<Layout> Layouts { get; set; }
        public ParentCategory ParentCategory { get; set; }
        public string Lang { get; set; }
    }
    public class CategoryDelete // chuyên mục bài viết
    {
        public int Id { get; set; }
        public string Lang { get; set; }
    }
    public class TreeViewNode
    {
        public int id { get; set; }
        public int? parentid { get; set; }
        public string target { get; set; }
        public string targetid { get; set; }
        public List<TreeViewNode> subs { get; set; }
        public string title { get; set; }
        public string module { get; set; }
        public string alias { get; set; } // đường dẫn 
        public string url { get; set; }
        public bool showinhome { get; set; } // checkbox có hiển thị ngoài giao diện người dung ko
    }
    public class GridTree
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public string Title { get; set; }
        public bool DisplayForArticle { get; set; }
        public string Module { get; set; }
    }
    public class TreView
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public string Title { get; set; }
        public string Module { get; set; }
    }
}
