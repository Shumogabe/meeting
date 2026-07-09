using Api;
using QTHT.Api.Models.database.Meeting.Chat;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;

namespace QTHT.Api.Models.database.Meeting.Chat
{
    public class MeetingChatContext
    {
        public List<Meeting_Chat> GetByScheduleId(Guid scheduleid)
        {
            List<Meeting_Chat> items = new List<Meeting_Chat>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Chat_GetBy_ScheduleId", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = scheduleid;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Chat item = new Meeting_Chat();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Type = dr.IsDBNull("Type") == true ? false : (bool)dr["Type"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? 0 : (int)dr["CreatedBy"];
                            item.ModifiedDate = dr.IsDBNull("ModifiedDate") == true ? DateTime.Now : (DateTime)dr["ModifiedDate"];
                            item.ModifiedBy = dr.IsDBNull("ModifiedBy") == true ? 0 : (int)dr["ModifiedBy"];
                            item.DeletedDate = dr.IsDBNull("DeletedDate") == true ? DateTime.Now : (DateTime)dr["DeletedDate"];
                            item.DeletedBy = dr.IsDBNull("DeletedBy") == true ? 0 : (int)dr["DeletedBy"];
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
