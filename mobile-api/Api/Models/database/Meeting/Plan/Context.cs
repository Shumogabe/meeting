using Api;
using ClosedXML.Report.Options;
using Microsoft.Data.SqlClient;
using QTHT.Api.Models;
using System;
using System.Collections.Generic;
using System.Data;

namespace HTT.Api.Models
{
    public class MeetingPlanContext
    {
        public Meeting_Plan GetBySymbol(string symbol)
        {
            Meeting_Plan item = new Meeting_Plan();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_GetBy_Symbol", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@symbol", SqlDbType.NVarChar).Value = symbol;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Symbol = dr.IsDBNull("Symbol") == true ? null : (string)dr["Symbol"];
                            item.Abstract = dr.IsDBNull("Abstract") == true ? null : (string)dr["Abstract"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.DateIssued = dr.IsDBNull("DateIssued") == true ? DateTime.Now : (DateTime)dr["DateIssued"];
                            item.AgencyIssued = dr.IsDBNull("AgencyIssued") == true ? null : (string)dr["AgencyIssued"];
                            item.Signer = dr.IsDBNull("Signer") == true ? null : (string)dr["Signer"];
                            item.EffectiveDate = dr.IsDBNull("EffectiveDate") == true ? DateTime.Now : (DateTime)dr["EffectiveDate"];
                            item.File = dr.IsDBNull("File") == true ? null : (string)dr["File"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.ApprovedBy = dr.IsDBNull("ApprovedBy") == true ? null : (string)dr["ApprovedBy"];
                            item.BelongToUnit = dr.IsDBNull("BelongToUnit") == true ? null : (string)dr["BelongToUnit"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.don_vi = dr.IsDBNull("don_vi") == true ? 0 : (int)dr["don_vi"];
                            break;
                        }
                    }
                }
            }
            catch
            {

            }
            return item;
        }
        public Meeting_Plan GetById(Guid id)
        {
            Meeting_Plan item = new Meeting_Plan();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_GetBy_Id", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Symbol = dr.IsDBNull("Symbol") == true ? null : (string)dr["Symbol"];
                            item.Abstract = dr.IsDBNull("Abstract") == true ? null : (string)dr["Abstract"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.DateIssued = dr.IsDBNull("DateIssued") == true ? DateTime.Now : (DateTime)dr["DateIssued"];
                            item.AgencyIssued = dr.IsDBNull("AgencyIssued") == true ? null : (string)dr["AgencyIssued"];
                            item.Signer = dr.IsDBNull("Signer") == true ? null : (string)dr["Signer"];
                            item.EffectiveDate = dr.IsDBNull("EffectiveDate") == true ? DateTime.Now : (DateTime)dr["EffectiveDate"];
                            item.File = dr.IsDBNull("File") == true ? null : (string)dr["File"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.ApprovedBy = dr.IsDBNull("ApprovedBy") == true ? null : (string)dr["ApprovedBy"];
                            item.BelongToUnit = dr.IsDBNull("BelongToUnit") == true ? null : (string)dr["BelongToUnit"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.don_vi = dr.IsDBNull("don_vi") == true ? 0 : (int)dr["don_vi"];
                            break;
                        }
                    }
                }
            }
            catch
            {

            }
            return item;
        }

        public Meeting_Plan GetByScheduleId(Guid id)
        {
            Meeting_Plan item = new Meeting_Plan();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_GetBy_Schedule_Id", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id", SqlDbType.UniqueIdentifier).Value = id;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Symbol = dr.IsDBNull("Symbol") == true ? null : (string)dr["Symbol"];
                            item.Abstract = dr.IsDBNull("Abstract") == true ? null : (string)dr["Abstract"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.DateIssued = dr.IsDBNull("DateIssued") == true ? DateTime.Now : (DateTime)dr["DateIssued"];
                            item.AgencyIssued = dr.IsDBNull("AgencyIssued") == true ? null : (string)dr["AgencyIssued"];
                            item.Signer = dr.IsDBNull("Signer") == true ? null : (string)dr["Signer"];
                            item.EffectiveDate = dr.IsDBNull("EffectiveDate") == true ? DateTime.Now : (DateTime)dr["EffectiveDate"];
                            item.File = dr.IsDBNull("File") == true ? null : (string)dr["File"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.ApprovedBy = dr.IsDBNull("ApprovedBy") == true ? null : (string)dr["ApprovedBy"];
                            item.BelongToUnit = dr.IsDBNull("BelongToUnit") == true ? null : (string)dr["BelongToUnit"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.don_vi = dr.IsDBNull("don_vi") == true ? 0 : (int)dr["don_vi"];
                            break;
                        }
                    }
                }
            }
            catch
            {

            }
            return item;
        }

        public List<Meeting_Plan> GetListPlanScheduleDeleted(int don_vi)
        {
            List < Meeting_Plan> list = new List<Meeting_Plan>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_Deleted", con))
                    {
                        
                        con.Open();
                        cmd.Parameters.Add("@don_vi", SqlDbType.Int).Value = don_vi;
                        cmd.CommandType = CommandType.StoredProcedure;
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            Meeting_Plan item = new Meeting_Plan();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Symbol = dr.IsDBNull("Symbol") == true ? null : (string)dr["Symbol"];
                            item.Abstract = dr.IsDBNull("Abstract") == true ? null : (string)dr["Abstract"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.DateIssued = dr.IsDBNull("DateIssued") == true ? DateTime.Now : (DateTime)dr["DateIssued"];
                            item.AgencyIssued = dr.IsDBNull("AgencyIssued") == true ? null : (string)dr["AgencyIssued"];
                            item.Signer = dr.IsDBNull("Signer") == true ? null : (string)dr["Signer"];
                            item.EffectiveDate = dr.IsDBNull("EffectiveDate") == true ? DateTime.Now : (DateTime)dr["EffectiveDate"];
                            item.File = dr.IsDBNull("File") == true ? null : (string)dr["File"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.ApprovedBy = dr.IsDBNull("ApprovedBy") == true ? null : (string)dr["ApprovedBy"];
                            item.BelongToUnit = dr.IsDBNull("BelongToUnit") == true ? null : (string)dr["BelongToUnit"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.don_vi = dr.IsDBNull("don_vi") == true ? 0 : (int)dr["don_vi"];
                            list.Add(item);
                        }
                        
                    }
                }
            
            }
            catch
            {

            }
            return list;
        }

        public List<Meeting_Plan> GetListUnapprovedPlan(int page, int pageSize, string search, DateTime dateFrom, DateTime dateTo, bool isdeleted)
        {
            List<Meeting_Plan> items = new List<Meeting_Plan>();
            try
            {
                int status = 1;
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_Status_All", con))
                    {

                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@search", SqlDbType.NVarChar).Value = search == null ? DBNull.Value : search;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";
                        cmd.Parameters.Add("@pageNumber", SqlDbType.Int).Value = page;
                        cmd.Parameters.Add("@pageSize", SqlDbType.Int).Value = pageSize;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = status;
                        cmd.Parameters.Add("@isdeleted", SqlDbType.Bit).Value = isdeleted;

                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            Meeting_Plan item = new Meeting_Plan();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Symbol = dr.IsDBNull("Symbol") == true ? null : (string)dr["Symbol"];
                            item.Abstract = dr.IsDBNull("Abstract") == true ? null : (string)dr["Abstract"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.DateIssued = dr.IsDBNull("DateIssued") == true ? DateTime.Now : (DateTime)dr["DateIssued"];
                            item.AgencyIssued = dr.IsDBNull("AgencyIssued") == true ? null : (string)dr["AgencyIssued"];
                            item.Signer = dr.IsDBNull("Signer") == true ? null : (string)dr["Signer"];
                            item.EffectiveDate = dr.IsDBNull("EffectiveDate") == true ? DateTime.Now : (DateTime)dr["EffectiveDate"];
                            item.File = dr.IsDBNull("File") == true ? null : (string)dr["File"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.ApprovedBy = dr.IsDBNull("ApprovedBy") == true ? null : (string)dr["ApprovedBy"];
                            item.BelongToUnit = dr.IsDBNull("BelongToUnit") == true ? null : (string)dr["BelongToUnit"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.don_vi = dr.IsDBNull("don_vi") == true ? 0 : (int)dr["don_vi"];
                            items.Add(item);
                        }

                    }
                }

            }
            catch
            {

            }
            return (items);
        }

        public List<Meeting_Plan> GetListUnapprovedSchedulePlan(int page, int pageSize, int create, string search, DateTime dateFrom, DateTime dateTo, bool isdeleted,int don_vi)
        {
            List<Meeting_Plan> items = new List<Meeting_Plan>();
            try
            {
                int status = 1;
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_Status", con))
                    {
                       
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@create", SqlDbType.Int).Value = create;
                        cmd.Parameters.Add("@search", SqlDbType.NVarChar).Value = search == null ? DBNull.Value : search;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";
                        cmd.Parameters.Add("@pageNumber", SqlDbType.Int).Value = page;
                        cmd.Parameters.Add("@pageSize", SqlDbType.Int).Value = pageSize;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = status;
                        cmd.Parameters.Add("@isdeleted", SqlDbType.Bit).Value = isdeleted;
                        cmd.Parameters.Add("@don_vi", SqlDbType.Int).Value = don_vi;
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            Meeting_Plan item = new Meeting_Plan();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Symbol = dr.IsDBNull("Symbol") == true ? null : (string)dr["Symbol"];
                            item.Abstract = dr.IsDBNull("Abstract") == true ? null : (string)dr["Abstract"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.DateIssued = dr.IsDBNull("DateIssued") == true ? DateTime.Now : (DateTime)dr["DateIssued"];
                            item.AgencyIssued = dr.IsDBNull("AgencyIssued") == true ? null : (string)dr["AgencyIssued"];
                            item.Signer = dr.IsDBNull("Signer") == true ? null : (string)dr["Signer"];
                            item.EffectiveDate = dr.IsDBNull("EffectiveDate") == true ? DateTime.Now : (DateTime)dr["EffectiveDate"];
                            item.File = dr.IsDBNull("File") == true ? null : (string)dr["File"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.ApprovedBy = dr.IsDBNull("ApprovedBy") == true ? null : (string)dr["ApprovedBy"];
                            item.BelongToUnit = dr.IsDBNull("BelongToUnit") == true ? null : (string)dr["BelongToUnit"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.don_vi = dr.IsDBNull("don_vi") == true ? 0 : (int)dr["don_vi"];
                            items.Add(item);
                        }
                        
                    }
                }

            }
            catch
            {

            }
            return (items);
        }

        public List<Meeting_Plan> GetListApprovedSchedulePlan(int page, int pageSize, int create, string search, DateTime dateFrom, DateTime dateTo, bool isdeleted,int don_vi)
        {
            List<Meeting_Plan> items = new List<Meeting_Plan>();
            try
            {
                int status = 2;
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_Status", con))
                    {

                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@create", SqlDbType.Int).Value = create;
                        cmd.Parameters.Add("@search", SqlDbType.NVarChar).Value = search == null ? DBNull.Value : search;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";
                        cmd.Parameters.Add("@pageNumber", SqlDbType.Int).Value = page;
                        cmd.Parameters.Add("@pageSize", SqlDbType.Int).Value = pageSize;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = status;
                        cmd.Parameters.Add("@isdeleted", SqlDbType.Bit).Value = isdeleted;
                        cmd.Parameters.Add("@don_vi", SqlDbType.Int).Value = don_vi;
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            Meeting_Plan item = new Meeting_Plan();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Symbol = dr.IsDBNull("Symbol") == true ? null : (string)dr["Symbol"];
                            item.Abstract = dr.IsDBNull("Abstract") == true ? null : (string)dr["Abstract"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.DateIssued = dr.IsDBNull("DateIssued") == true ? DateTime.Now : (DateTime)dr["DateIssued"];
                            item.AgencyIssued = dr.IsDBNull("AgencyIssued") == true ? null : (string)dr["AgencyIssued"];
                            item.Signer = dr.IsDBNull("Signer") == true ? null : (string)dr["Signer"];
                            item.EffectiveDate = dr.IsDBNull("EffectiveDate") == true ? DateTime.Now : (DateTime)dr["EffectiveDate"];
                            item.File = dr.IsDBNull("File") == true ? null : (string)dr["File"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.ApprovedBy = dr.IsDBNull("ApprovedBy") == true ? null : (string)dr["ApprovedBy"];
                            item.BelongToUnit = dr.IsDBNull("BelongToUnit") == true ? null : (string)dr["BelongToUnit"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.don_vi = dr.IsDBNull("don_vi") == true ? 0 : (int)dr["don_vi"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.don_vi = dr.IsDBNull("don_vi") == true ? 0 : (int)dr["don_vi"];
                            items.Add(item);
                        }

                    }
                }

            }
            catch
            {

            }
            return (items);
        }

        public List<Meeting_Plan> GetListApprovedPlan(int page, int pageSize, string search, DateTime dateFrom, DateTime dateTo, bool isdeleted)
        {
            List<Meeting_Plan> items = new List<Meeting_Plan>();
            try
            {
                int status = 2;
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_Status_All", con))
                    {

                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@search", SqlDbType.NVarChar).Value = search == null ? DBNull.Value : search;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";
                        cmd.Parameters.Add("@pageNumber", SqlDbType.Int).Value = page;
                        cmd.Parameters.Add("@pageSize", SqlDbType.Int).Value = pageSize;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = status;
                        cmd.Parameters.Add("@isdeleted", SqlDbType.Bit).Value = isdeleted;

                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            Meeting_Plan item = new Meeting_Plan();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Symbol = dr.IsDBNull("Symbol") == true ? null : (string)dr["Symbol"];
                            item.Abstract = dr.IsDBNull("Abstract") == true ? null : (string)dr["Abstract"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.DateIssued = dr.IsDBNull("DateIssued") == true ? DateTime.Now : (DateTime)dr["DateIssued"];
                            item.AgencyIssued = dr.IsDBNull("AgencyIssued") == true ? null : (string)dr["AgencyIssued"];
                            item.Signer = dr.IsDBNull("Signer") == true ? null : (string)dr["Signer"];
                            item.EffectiveDate = dr.IsDBNull("EffectiveDate") == true ? DateTime.Now : (DateTime)dr["EffectiveDate"];
                            item.File = dr.IsDBNull("File") == true ? null : (string)dr["File"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.ApprovedBy = dr.IsDBNull("ApprovedBy") == true ? null : (string)dr["ApprovedBy"];
                            item.BelongToUnit = dr.IsDBNull("BelongToUnit") == true ? null : (string)dr["BelongToUnit"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.don_vi = dr.IsDBNull("don_vi") == true ? 0 : (int)dr["don_vi"];
                            items.Add(item);
                        }

                    }
                }

            }
            catch
            {

            }
            return (items);
        }

        public List<Meeting_Plan> GetListDraftSchedulePlan(int page, int pageSize, int create, string search, DateTime dateFrom, DateTime dateTo, bool isdeleted,int don_vi)
        {
            List<Meeting_Plan> items = new List<Meeting_Plan>();
            try
            {
                int status = 0;
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Plan_Status", con))
                    {
                        
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@create", SqlDbType.Int).Value = create;
                        cmd.Parameters.Add("@search", SqlDbType.NVarChar).Value = search == default ? DBNull.Value : search;
                        cmd.Parameters.Add("@dateFrom", SqlDbType.DateTime).Value = dateFrom == default ? null : dateFrom.Year.ToString() + "-" + dateFrom.Month.ToString() + "-" + dateFrom.Day.ToString();
                        cmd.Parameters.Add("@dateTo", SqlDbType.DateTime).Value = dateTo == default ? null : dateTo.Year.ToString() + "-" + dateTo.Month.ToString() + "-" + dateTo.Day.ToString() + " 23:59:59";
                        cmd.Parameters.Add("@pageNumber", SqlDbType.Int).Value = page;
                        cmd.Parameters.Add("@pageSize",SqlDbType.Int).Value = pageSize;
                        cmd.Parameters.Add("@status", SqlDbType.Int).Value = status;
                        cmd.Parameters.Add("@isdeleted", SqlDbType.Bit).Value = isdeleted;
                        cmd.Parameters.Add("@don_vi", SqlDbType.Int).Value = don_vi;
                        SqlDataReader dr = cmd.ExecuteReader();
                        while (dr.Read())
                        {
                            Meeting_Plan item = new Meeting_Plan();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Symbol = dr.IsDBNull("Symbol") == true ? null : (string)dr["Symbol"];
                            item.Abstract = dr.IsDBNull("Abstract") == true ? null : (string)dr["Abstract"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.DateIssued = dr.IsDBNull("DateIssued") == true ? DateTime.Now : (DateTime)dr["DateIssued"];
                            item.AgencyIssued = dr.IsDBNull("AgencyIssued") == true ? null : (string)dr["AgencyIssued"];
                            item.Signer = dr.IsDBNull("Signer") == true ? null : (string)dr["Signer"];
                            item.EffectiveDate = dr.IsDBNull("EffectiveDate") == true ? DateTime.Now : (DateTime)dr["EffectiveDate"];
                            item.File = dr.IsDBNull("File") == true ? null : (string)dr["File"];
                            item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                            item.ApprovedBy = dr.IsDBNull("ApprovedBy") == true ? null : (string)dr["ApprovedBy"];
                            item.BelongToUnit = dr.IsDBNull("BelongToUnit") == true ? null : (string)dr["BelongToUnit"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.IsDeleted = (bool)dr["IsDeleted"];
                            item.don_vi = dr.IsDBNull("don_vi") == true ? 0 : (int)dr["don_vi"];
                            items.Add(item);
                        }
                        
                    }
                }

            }
            catch
            {

            }
            return (items);
        }
        
        public List<Meeting_Plan> GetListSchedulePlan()
        {
            {
                List<Meeting_Plan> items = new List<Meeting_Plan>();
                try
                {
                    using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                    {
                        using (SqlCommand cmd = new SqlCommand("Meeting_Plan_GetAll", con))
                        {

                            con.Open();
                            SqlDataReader dr = cmd.ExecuteReader();
                            while (dr.Read())
                            {
                                Meeting_Plan item = new Meeting_Plan();
                                item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                                item.Symbol = dr.IsDBNull("Symbol") == true ? null : (string)dr["Symbol"];
                                item.Abstract = dr.IsDBNull("Abstract") == true ? null : (string)dr["Abstract"];
                                item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                                item.DateIssued = dr.IsDBNull("DateIssued") == true ? DateTime.Now : (DateTime)dr["DateIssued"];
                                item.AgencyIssued = dr.IsDBNull("AgencyIssued") == true ? null : (string)dr["AgencyIssued"];
                                item.Signer = dr.IsDBNull("Signer") == true ? null : (string)dr["Signer"];
                                item.EffectiveDate = dr.IsDBNull("EffectiveDate") == true ? DateTime.Now : (DateTime)dr["EffectiveDate"];
                                item.File = dr.IsDBNull("File") == true ? null : (string)dr["File"];
                                item.Status = dr.IsDBNull("Status") == true ? 0 : (int)dr["Status"];
                                item.ApprovedBy = dr.IsDBNull("ApprovedBy") == true ? null : (string)dr["ApprovedBy"];
                                item.BelongToUnit = dr.IsDBNull("BelongToUnit") == true ? null : (string)dr["BelongToUnit"];
                                item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                                item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                                item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                                item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                                item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
                                item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                                item.IsDeleted = (bool)dr["IsDeleted"];
                                item.don_vi = dr.IsDBNull("don_vi") == true ? 0 : (int)dr["don_vi"];
                                items.Add(item);
                            }

                        }
                    }

                }
                catch
                {

                }
                return (items);
            }
        }
    }
}
