using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using DinkToPdf.Contracts;
using Giraffe.Model.Global;
using Giraffe.Utilities;
using Newtonsoft.Json;
namespace Giraffe.Helpers.Global
{
    public class GlobalDataBind
    {
        public string ChangeStatus(Status changeStatus)
        {
            string sql = @"SP_CHANGE_STATUS @PARAM='" + changeStatus.param + "',@ID=" + changeStatus.id + ",@STATUS=" + changeStatus.status;
            return JsonConvert.SerializeObject(conn.dbRun(sql));
        }
        public string SetBulkActions(BulkActions bulkAction)
        {
            string sql = @"SP_BULK_OPERATIONS @IDS='" + bulkAction.ids + "',@TYPE='" + bulkAction.type + "'";
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }
        public string GetDuration(string begdate, string enddate)
        {
            string duration = "0";
            string sql = "SELECT DATEDIFF(HOUR,   '" + begdate + "', '" + enddate + "') AS  duration";
            foreach (DataRow dtr in conn.dbRun(sql).Rows)
            {
                duration = dtr["duration"].ToString();
            }
            return duration;
        }
        public string GetDurationMinute(string begdate, string enddate)
        {
            string durationminute = "0";
            string sql = "SELECT DATEDIFF(MINUTE,   '" + begdate + "', '" + enddate + "')%60 AS  durationminute";
            foreach (DataRow dtr in conn.dbRun(sql).Rows)
            {
                durationminute = dtr["durationminute"].ToString();
            }
            return durationminute;
        }
        public string GetSpecodes(string type)
        {
            string sql = @"SP_SPECODE @TYPE='" + type + "'";
            return JsonConvert.SerializeObject(conn.dbRun(sql));
        }

        public string GetPresentations(string type)
        {
            string sql = @"SP_PRESENTATIONS @TYPE='" + type + "'";
            return JsonConvert.SerializeObject(conn.dbRun(sql));
        }
        public string GetMailTemplate(string type, int id)
        {
            string sql = @"SP_EMAIL_TEMPLATES @TYPE='" + type + "',@ID=" + id;
            return JsonConvert.SerializeObject(conn.dbRun(sql));
        }
        public List<GeneralInfo> GetGeneralInfoList()
        {
            string sql = @"SP_GENERAL_INFO";
            List<GeneralInfo> gi = new List<GeneralInfo>();
            foreach (DataRow d in conn.dbRun(sql).Rows)
            {
                gi.Add(new GeneralInfo()
                {
                    id = int.Parse(d["id"].ToString()),
                    mail = d["mail"].ToString(),
                    server = d["server"].ToString(),
                    username = d["username"].ToString(),
                    password = d["password"].ToString(),
                    port = int.Parse(d["port"].ToString())
                });
            }
            return gi;
        }
        public List<GeneralInfo> GetSystemGeneralInfoList()
        {
            string sql = @"SP_GENERAL_INFO";
            List<GeneralInfo> gi = new List<GeneralInfo>();
            foreach (DataRow d in conn.dbSysRun(sql,1).Rows)
            {
                gi.Add(new GeneralInfo()
                {
                    id = int.Parse(d["id"].ToString()),
                    mail = d["mail"].ToString(),
                    server = d["server"].ToString(),
                    username = d["username"].ToString(),
                    password = d["password"].ToString(),
                    port = int.Parse(d["port"].ToString())
                });
            }
            return gi;
        }
        public string CheckPageOpe(string page)
        {
            string sql = @"SP_CHECK_PAGE_OPE @PAGE='" + page + "', @USERTYPE="+conn.getUserType();
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "{}";
        }
        public string GetPrintViewHtml(HtmlToPdf htmlPdf)
        {
            string sql = "";
            if (htmlPdf.type == "proposal")
            {
                sql = @"SP_PROPOSAL_PRINT @PROJECTIP='"+conn.projectip+"', @PARAMETRS='" + htmlPdf.parameters+"'";
            }
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "";
        }
        public byte[] HtmlToPdf(HtmlToPdf htmlPdf, IConverter converter)
        {
            ConvertHtmlToPdf cp = new ConvertHtmlToPdf(converter);
            if (htmlPdf.type == "proposal")
            {
                return cp.CreatePDF(DateTime.Now.ToString("MM-dd-yyyy HH:mm:ss").Replace(" ", "").Replace(":", "_") + ".pdf", GetPrintViewHtml(htmlPdf));
            }
            else
            {
                return null;
            }
        }
    }
}
