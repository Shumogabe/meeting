using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace QTHT.Api.Models.database.Models
{
    public class Organ
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Code { get; set; }
        public int ParentId { get; set; }
        public Organ Parent { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string Url { get; set; }
        public List<Organ> Childs { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public DateTime DeletedDate { get; set; }
        public int CreatedBy { get; set; }
        public int ModifedBy { get; set; }
        public int DeletedBy { get; set; }        
    }
    public class OrganInsert
    {
        public string Title { get; set; }
        public string Code { get; set; }
        public int ParentId { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string Url { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }

    }
    public class OrganUpdate
    {
        public string Title { get; set; }
        public string Code { get; set; }
        public int ParentId { get; set; }
        public string Address { get; set; }
        public string PhoneNumber { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string Url { get; set; }
        public int ModifedBy { get; set; }
        public DateTime ModifiedDate { get; set; }

    }
}
