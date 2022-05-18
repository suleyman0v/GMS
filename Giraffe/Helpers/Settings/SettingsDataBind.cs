using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Helpers.Settings
{
    public class SettingsDataBind
    {
        public string GetUserData(int type)
        {
            string sql = @"SP_USERS @ID=" + conn.getUserId() + ", @TYPE=" + type;
            return JsonConvert.SerializeObject(conn.GetJson(sql));
        }
        public string GetSettingsViewData(string type)
        {
            string sql = @"SP_SETTINGS_VIEW  @TYPE='" + type + "',@UID=" + conn.getUserId() + "";
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }
        public string GetSettingsEditData(int id, string type)
        {
            string sql = @"SP_SETTINGS_EDIT @ID=" + id + ", @TYPE='" + type + "'";
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "{}";
        }
        public string GetSettingsReturnData(int id, string type)
        {
            string sql = @"SP_SETTINGS_RETURN @ID=" + id + ", @TYPE='" + type + "'";
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "{}";
        }
        public string GetItemServiceGroup(int type)
        {
            string sql = @"SP_ITEMSERVICE_GROUP @TYPE=" + type;
            return JsonConvert.SerializeObject(conn.GetJson(sql));
        }
        public string GetPresentationEditData(int id)
        {
            string sql = @"SP_PRESENTATIONS_D @ID=" + id;
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "{}";
        }
        public string GetItemService(int count, int size, int type, int group, string searchtxt)
        {
            string sql = @"SP_ITEMSERVICE @COUNT=" + count + ", @SIZE=" + size + ", @TYPE=" + type + ", @GROUP=" + group + ",@SEARCHTXT='" + searchtxt + "'";
            return JsonConvert.SerializeObject(conn.GetJson(sql));
        }
    }
}
