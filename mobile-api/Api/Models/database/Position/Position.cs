using Api;
using Microsoft.Data.SqlClient;
using QTHT.Api.Helpers;
using System;
using System.Collections.Generic;
using System.Data;

namespace QTHT.Api.Models.database.Models
{
    public class Position
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
        public long rownumber { get; set; }
        public int totalrecord { get; set; }

        public List<Position> GetAll(OptionFilter option)
        {
            List<Position> items = new List<Position>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Position_GetAll_Filter", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@pagenumber", SqlDbType.Int).Value = option.PageNumber;
                        cmd.Parameters.Add("@pagesize", SqlDbType.Int).Value = option.PageSize;
                        cmd.Parameters.Add("@txtsearch", SqlDbType.NVarChar).Value = option.KeyWord == null ? DBNull.Value : option.KeyWord;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Position item = new Position();
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (long)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.totalrecord = dr.IsDBNull("totalrecord") == true ? 0 : (int)dr["totalrecord"];
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

        public List<Position> GetAll()
        {
            List<Position> items = new List<Position>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Position_GetAll", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Position item = new Position();
                            item.Id = dr.IsDBNull("Id") == true ? 0 : (long)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
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

        public Position GetById(long id)
        {
            Position config = new Position();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Position_GetBy_Id", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.BigInt).Value = id;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            config.Id = id;
                            config.Title = dr.IsDBNull("Title") == true ? "" : (string)dr["Title"];
                            config.Name = dr.IsDBNull("Name") == true ? "" : (string)dr["Name"];
                            break;
                        }
                        cmd.Dispose();
                        dr.Close();
                        con.Close();
                        {
                        }
                    }
                }
            }
            catch
            {
                //throw e;
            }

            return config;
        }
    }
}