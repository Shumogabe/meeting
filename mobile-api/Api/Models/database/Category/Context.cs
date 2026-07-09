using Api;
using QTHT.Api.Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Linq;

namespace QTHT.Api.Models.database.Admin
{
    public class CategoryContext // chuyên mục bài viết
    {
        public List<TreeViewNode> GetSelectTreeViewNode(string lang)
        {
            var items = GetAll(lang).Select(x => new TreeViewNode
            {
                id = x.Id,
                parentid = x.ParentId,
                title = x.Title,
                target = "#item" + x.Id,
                targetid = "item" + x.ParentId,
                module = x.Module,
                alias = x.Alias,
                url = x.Url,
                showinhome = x.DisplayInHome
            }).ToList();
            var parents = items.Where(x => x.parentid == 0 || x.parentid == null).ToList();
            return SelectSortNodes(items, parents);
        }
        static List<TreeViewNode> SelectSortNodes(List<TreeViewNode> nodes, List<TreeViewNode> items)
        {
            for (int i = 0; i < items.Count; i++)
            {
                List<TreeViewNode> children = nodes.FindAll(node => node.parentid == items[i].id);
                SelectSortNodes(nodes, children);
                items[i].subs = children;
            }
            return items;
        }
        //lấy danh sách category
        public List<Category> GetAll(string lang, OptionFilter option )
        {
            List<Category> items = new List<Category>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(lang.ToUpper() + "_Category_GetListCategory", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pagenumber", SqlDbType.Int).Value = option.PageNumber;
                        cmd.Parameters.Add("@pagesize", SqlDbType.Int).Value = option.PageSize;
                        cmd.Parameters.Add("@txtsearch", SqlDbType.NVarChar).Value = option.KeyWord == null ? DBNull.Value : option.KeyWord;
                        cmd.Parameters.Add("@startdate", SqlDbType.DateTime).Value = option.StartDate == null ? DBNull.Value : option.StartDate;
                        cmd.Parameters.Add("@enddate", SqlDbType.DateTime).Value = option.EndDate == null ? DBNull.Value : option.EndDate;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Category item = new Category();
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (int)dr["Id"];
                            item.ParentId = dr.IsDBNull("ParentId") == true ? 0 : (int)dr["ParentId"];
                            Category parent = GetById(lang, item.ParentId);
                            item.ParentTitle = parent.Title;
                            item.Title = dr.IsDBNull("Title") == true ? "" : (string)dr["Title"];
                            item.Url = dr.IsDBNull("Url") == true ? "" : (string)dr["Url"];
                            item.Module = dr.IsDBNull("Module") == true ? "" : (string)dr["Module"];
                            item.DisplayInHome = dr.IsDBNull("DisplayInHome") == true ? false : (bool)dr["DisplayInHome"];
                            item.Alias = Common.GenerateUrl(item.Title);
                            items.Add(item);

                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                    }
                }
            }
            catch
            {
                //throw e;
            }
            
            return items;
        }
        public Category GetById(string lang, int id)
        {
            Category item = new Category();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(lang.ToUpper() + "_Category_GetBy_ID", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (int)dr["Id"];
                            item.ParentId = dr.IsDBNull("ParentId") == true ? 0 : (int)dr["ParentId"];
                            Category parent = GetById(lang, item.ParentId);
                            item.ParentTitle = parent.Title;
                            item.Title = dr.IsDBNull("Title") == true ? "" : (string)dr["Title"];
                            item.Url = dr.IsDBNull("Url") == true ? "" : (string)dr["Url"];
                            item.Module = dr.IsDBNull("Module") == true ? "" : (string)dr["Module"];
                            item.DisplayInHome = dr.IsDBNull("DisplayInHome") == true ? false : (bool)dr["DisplayInHome"];
                            item.Alias = Common.GenerateUrl(item.Title);
                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                    }
                }
            }
            catch
            {
                //throw e;
            }
            
            return item;
        }
        public List<TreView> GetTree(string lang)
        {
            List<TreView> items = new List<TreView>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(lang.ToUpper() + "_Category_GetAll", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            TreView item = new TreView();
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (int)dr["Id"];
                            item.ParentId = dr.IsDBNull("ParentId") == true ? 0 : (int)dr["ParentId"];
                            item.Title = dr.IsDBNull("Title") == true ? "" : (string)dr["Title"];
                            items.Add(item);

                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                    }
                }
            }
            catch
            {
                //throw e;
            }
            
            return items;
        }
        public List<Category> GetAll(string lang)
        {
            List<Category> items = new List<Category>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(lang.ToUpper() + "_Category_GetAll", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Category item = new Category();
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (int)dr["Id"];
                            item.ParentId = dr.IsDBNull("ParentId") == true ? 0 : (int)dr["ParentId"];
                            Category parent = GetById(lang, item.ParentId);
                            item.ParentTitle = parent.Title;
                            item.Title = dr.IsDBNull("Title") == true ? "" : (string)dr["Title"];
                            item.Module = dr.IsDBNull("Module") == true ? "" : (string)dr["Module"];
                            item.Url = dr.IsDBNull("Url") == true ? "" : (string)dr["Url"];
                            item.DisplayInHome = dr.IsDBNull("DisplayInHome") == true ? false : (bool)dr["DisplayInHome"];
                            item.Alias = Common.GenerateUrl(item.Title);
                            items.Add(item);

                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                //throw e;
            }
            
            return items;
        }
        
        public List<GridTree> GetListTreeViewNode(string lang)
        {
            var items = GetAll(lang).Select(x => new GridTree
            {
                Id = x.Id,
                ParentId = x.ParentId,
                Title = x.Title,
                DisplayForArticle = x.DisplayForArticle

            }).ToList();
            return items;
        }
        
        public List<Category> GetByNode(string lang, int id)
        {
            List<Category> items = new List<Category>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(lang.ToUpper() + "_Category_GetBy_Node", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Category item = new Category();
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (int)dr["Id"];
                            item.ParentId = dr.IsDBNull("ParentId") == true ? 0 : (int)dr["ParentId"];
                            Category parent = GetById(lang, item.ParentId);
                            item.ParentTitle = parent.Title;
                            item.Title = dr.IsDBNull("Title") == true ? "" : (string)dr["Title"];
                            item.Module = dr.IsDBNull("Module") == true ? "" : (string)dr["Module"];
                            item.Url = dr.IsDBNull("Url") == true ? "" : (string)dr["Url"];
                            item.DisplayInHome = dr.IsDBNull("DisplayInHome") == true ? false : (bool)dr["DisplayInHome"];
                            item.Alias = Common.GenerateUrl(item.Title);
                            items.Add(item);
                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                    }
                }
            }
            catch
            {
                //throw e;
            }
            
            return items;
        }
    }
}
