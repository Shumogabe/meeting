using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using QTHT.Api.Helpers;
using QTHT.Api.Models.database.Admin;
using Api;

namespace QTHT.Api.Models.database.Models
{
    public class OrganContext
    {
        //lấy danh sách dạng cha con
        public List<TreeViewNode> GetSelectTreeViewNode()
        {
            var items = GetAll().Select(x => new TreeViewNode
            {
                id = (int)x.Id,
                parentid = (int?)x.Parent.Id,
                title = x.Title
            }).ToList();
            var parents = items.Where(x => x.parentid == 0 || x.parentid == null).ToList();
            return SelectSortNodes(items, parents);
        }
        static List<TreeViewNode> SelectSortNodes(List<TreeViewNode> nodes, List<TreeViewNode> root)
        {
            for (int i = 0; i < root.Count; i++)
            {
                List<TreeViewNode> children = nodes.FindAll(node => node.parentid == root[i].id);
                SelectSortNodes(nodes, children);
                root[i].subs = children;
            }
            return root;
        }
        //lấy danh sách category
        public List<Organ> GetAll(OptionFilter option)
        {
            List<Organ> items = new List<Organ>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Organ_GetAll_Filter", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pagenumber", SqlDbType.Int).Value = option.PageNumber;
                        cmd.Parameters.Add("@pagesize", SqlDbType.Int).Value = option.PageSize;
                        cmd.Parameters.Add("@txtsearch", SqlDbType.NVarChar).Value = option.KeyWord == null ? DBNull.Value : option.KeyWord;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Organ item = new Organ();
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (long)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? "" : (string)dr["Title"];
                            item.Code = dr.IsDBNull("Code") == true ? "" : (string)dr["Code"];
                            item.ParentId = dr.IsDBNull("ParentId") == true ? 0 : (int)dr["ParentId"];
                            item.Url = dr.IsDBNull("Url") == true ? "" : (string)dr["Url"];
                            item.Fax = dr.IsDBNull("Fax") == true ? "" : (string)dr["Fax"];
                            item.Email = dr.IsDBNull("Email") == true ? "" : (string)dr["Email"];
                            item.Address = dr.IsDBNull("Address") == true ? "" : (string)dr["Address"];
                            item.PhoneNumber = dr.IsDBNull("PhoneNumber") == true ? "" : (string)dr["PhoneNumber"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.Parent = new OrganContext().GetById(item.ParentId);
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
        public List<Organ> GetAll()
        {
            List<Organ> items = new List<Organ>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Organ_GetAll", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Organ item = new Organ();
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (long)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? "" : (string)dr["Title"];
                            item.Code = dr.IsDBNull("Code") == true ? "" : (string)dr["Code"];
                            item.Url = dr.IsDBNull("Url") == true ? "" : (string)dr["Url"];
                            item.Fax = dr.IsDBNull("Fax") == true ? "" : (string)dr["Fax"];
                            item.Email = dr.IsDBNull("Email") == true ? "" : (string)dr["Email"];
                            item.Address = dr.IsDBNull("Address") == true ? "" : (string)dr["Address"];
                            item.PhoneNumber = dr.IsDBNull("PhoneNumber") == true ? "" : (string)dr["PhoneNumber"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            items.Add(item);

                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();

                    }
                }
            }
            catch (Exception e)
            {

            }
            
            return items;
        }
        public Organ GetById(long id)
        {
            Organ item = new Organ();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Organ_GetBy_Id", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.BigInt).Value = id;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (long)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? "" : (string)dr["Title"];
                            item.Code = dr.IsDBNull("Code") == true ? "" : (string)dr["Code"];
                            item.ParentId = dr.IsDBNull("ParentId") == true ? 0 : (int)dr["ParentId"];
                            item.Address = dr.IsDBNull("Address") == true ? "" : (string)dr["Address"];
                            item.PhoneNumber = dr.IsDBNull("PhoneNumber") == true ? "" : (string)dr["PhoneNumber"];
                            item.Fax = dr.IsDBNull("Fax") == true ? "" : (string)dr["Fax"];
                            item.Email = dr.IsDBNull("Email") == true ? "" : (string)dr["Email"];
                            item.Url = dr.IsDBNull("Url") == true ? "" : (string)dr["Url"];
                            item.Parent = new OrganContext().GetById(item.ParentId);
                            break;
                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                    }
                }
            }
            catch (Exception e)
            {

            }

            return item;
        }
    }
}
