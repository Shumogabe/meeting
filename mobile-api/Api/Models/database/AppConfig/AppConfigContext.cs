using Api;
using DocumentFormat.OpenXml.Office2010.ExcelAc;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;

namespace QTHT.Api.Models.database.AppConfig
{
    public class AppConfigContext
    {
        public List<AppConfig> GetMinioConfig()
        {
            List<AppConfig> items = new List<AppConfig>();
            using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("AppConfig_Minio", con))
                {
                    try
                    {
                        con.Open();
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            AppConfig item = new AppConfig();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.root = dr.IsDBNull("root") == true ? null : (string)dr["root"];
                            item.us = dr.IsDBNull("us") == true ? null : (string)dr["us"];
                            item.hash = dr.IsDBNull("hash") == true ? null : (string)dr["hash"];
                            item.domain = dr.IsDBNull("domain") == true ? null : (string)dr["domain"];
                            item.description = dr.IsDBNull("description") == true ? null : (string)dr["description"];
                            item.appconfig_id = dr.IsDBNull("appconfig_id") == true ? 0 : (int)dr["appconfig_id"];
                            items.Add(item);

                        }
                        cmd.Dispose();
                        dr.Close();
                    }
                    catch (Exception ex)
                    {
                        //throw e;
                    }

                    con.Close();
                }
                return items;
            }
            
        }
    }
}
