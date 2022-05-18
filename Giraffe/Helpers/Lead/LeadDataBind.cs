using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
//using Giraffe.Model.Lead;
using Newtonsoft.Json;
using System.Data;

namespace Giraffe.Helpers.Lead
{
    public class LeadDataBind
    {
        public string GetCustomerData(int count, string searchtext)
        {
            string sql = @"SP_SEARCH_CUSTOMERS @COUNT=" + count + ",@SEARCHTEXT='" + searchtext + "'";
            return JsonConvert.SerializeObject(conn.dbRun(sql));
        }
        public string GetLeadData(int tab, string filter)
        {
            string sql = @"SP_LEAD @USER =" + conn.getUserId() + ", @TAB =" + tab + ", @FILTER='" + filter + "'";
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }
        public string GetReturnLeadData(int id)
        {
            string sql = @"SP_RETURNED_LEAD @ID =" + id;
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }
        public string GetLeadReturnActivities(int id)
        {
            string sql = @"SP_LEAD_RETURNED_ACTIVITIES @ID =" + id;
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }
        public string GetLeadReturnProposal(int id, int proposal)
        {
            string sql = @"SP_LEAD_RETURNED_PROPOSAL @ID =" + id + ",@PROPOSAL = " + proposal;
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }
        public string GetLeadDetail(int id)
        {
            string sql = @"SP_LEAD_D @ID =" + id;
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }

        public string GetActivityDetail(int id)
        {
            string sql = @"SP_ACTIVITY_D @ID =" + id + ", @USER=" + conn.getUserId();
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }
        public string GetSearchLead(int count, int size, string searchtext)
        {
            string sql = @"SP_LEAD_SEARCH @COUNT=" + count + ",@SIZE=" + size + ",@SEARCHTEXT='" + searchtext + "',@USER=" + conn.getUserId() + "";
            return JsonConvert.SerializeObject(conn.dbRun(sql));
        }
        public string GetLeadCalendarEvent(int id)
        {
            string sql = @"SP_CALENDAR_EVENT @ID =" + id;
            string returnedVal = "[]";
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                returnedVal = dt.Rows[0][0].ToString();
            }
            return returnedVal;
        }
        public string GetLeadReturnCalendar(int id)
        {
            string sql = @"SP_LEAD_RETURNED_CALENDAR @ID =" + id;
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }
        public string GetProposalDetail(int id, int lead)
        {
            string sql = @"SP_PROPOSAL_D @ID =" + id + ",  @LEAD =" + lead + ", @USER=" + conn.getUserId();
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }
        public string GetProposalTemplateData(int id)
        {
            string sql = "SP_PROPOSAL_TEMPLATE_DATA @ID=" + id;
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }
        public int GetProposalTransaction(int id, string type)
        {
            string sql = "SP_TRANSACTIONS @ID=" + id + ", @TYPE='" + type + "'";
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return int.Parse(dt.Rows[0][0].ToString());
            }
            return 1;
        }
        public string LeadCheckActivity(string startDate, int duration, int acid)
        {
            string sql = @"SP_CHK_ACTIVITY @START_DATE_TIME ='" + startDate + "' , @DURATION_MIN =" + duration + " ,@UID=" + conn.getUserId() + " , @ACID = " + acid + "";
            return JsonConvert.SerializeObject(conn.dbRun(sql));
        }

        public string LeadCheckCalendarActivity(string startDate, string endDate, int acid)
        {
            string sql = @"SP_CHK_CALENDAR_ACTIVITY @START_DATE_TIME ='" + startDate + "' , @END_DATE_TIME ='" + endDate + "' ,@UID=" + conn.getUserId() + " , @ACID = " + acid + "";
            return JsonConvert.SerializeObject(conn.dbRun(sql));
        }
        public string GetFilterModalData(string type)
        {
            string sql = @"SP_MODAL_FILTER @UID =" + conn.getUserId() + " , @TYPE =" + type;
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }
        public string GetFilterSavedModalData(int id,string type)
        {
            string sql = @"SP_SAVED_FILTERS @ID =" + id + " , @TYPE =" + type;
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }
    }
}
