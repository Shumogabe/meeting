using System;
using System.Collections.Generic;
using System.Data;
using Api;
using Microsoft.Data.SqlClient;
using static QTHT.Api.Models.database.Meeting.Whiteboard.Whiteboard;

namespace QTHT.Api.Models.database.Meeting.Whiteboard
{
    public class MeetingWhiteboardContext
    {
        public List<Meeting_Whiteboard> GetByScheduleId(Guid scheduleid)
        {
            List<Meeting_Whiteboard> items = new List<Meeting_Whiteboard>();
            try
            {
                using (SqlConnection con = new SqlConnection(Startup.ConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("Meeting_Whiteboard_GetBy_ScheduleId", con))
                    {
                        con.Open();
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@scheduleid", SqlDbType.UniqueIdentifier).Value = scheduleid;
                        SqlDataReader dr = cmd.ExecuteReader();

                        while (dr.Read())
                        {
                            Meeting_Whiteboard item = new Meeting_Whiteboard();
                            item.Id = dr.IsDBNull("Id") == true ? default : (Guid)dr["Id"];
                            item.Title = dr.IsDBNull("Title") == true ? null : (string)dr["Title"];
                            item.ScheduleId = dr.IsDBNull("ScheduleId") == true ? default : (Guid)dr["ScheduleId"];
                            item.Content = dr.IsDBNull("Content") == true ? null : (string)dr["Content"];
                            item.CreatedDate = dr.IsDBNull("CreatedDate") == true ? DateTime.Now : (DateTime)dr["CreatedDate"];
                            item.CreatedBy = dr.IsDBNull("CreatedBy") == true ? default : (int)dr["CreatedBy"];
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
