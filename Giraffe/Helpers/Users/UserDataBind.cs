using Giraffe.Model.Global;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using Newtonsoft.Json;
using Giraffe.Model.Auth;
using Giraffe.Model.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Giraffe.Utilities;
using System.Data.SqlClient;

namespace Giraffe.Helpers.Users
{
    public class UserDataBind
    {
        public string ChangeUserStatus(Status changeStatus)
        {
            //acs
            string query = "UPDATE SYS_USER SET U_STATUS =" + changeStatus.status + " WHERE U_REF_ID = " + changeStatus.id + " AND U_COMPANY = " + conn.getCompanyId();
            conn.dbSysRun(query);
            //app
            string sql = @"SP_CHANGE_STATUS @PARAM='" + changeStatus.param + "',@ID=" + changeStatus.id + ",@STATUS=" + changeStatus.status;
            return JsonConvert.SerializeObject(conn.dbRun(sql));
        }
        public string SetUserBulkActions(BulkActions bulkAction)
        {
            //acs
            string query = "UPDATE SYS_USER SET U_STATUS=-1 WHERE U_REF_ID IN ( select i.value('text()[1]','int') from (select cast('<i>'+replace('" + bulkAction.ids + "',',','</i><i>')+'</i>' as xml) as xlist) s cross apply s.xlist.nodes('/i') X(I)) AND U_COMPANY = " + conn.getCompanyId();
            conn.dbSysRun(query);
            //app
            string sql = @"SP_BULK_OPERATIONS @IDS='" + bulkAction.ids + "',@TYPE='" + bulkAction.type + "'";
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }
        public string GetUserEditData(int id, string type)
        {
            string sql = @"SP_USER_EDIT @ID=" + id + ", @TYPE='" + type + "'";
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "{}";
        }
        public string GetUserStaticData(string type, int id, string email = "")
        {
            string query = (type == "UserLimit") ?
                @"SELECT CMP_USER_LIMIT [userLimit] FROM SYS_COMPANY WHERE CMP_ID=" + conn.getCompanyId()
                : @"IF (" + id + "=0) BEGIN  SELECT CASE WHEN COUNT(U_ID)=0 THEN 0 ELSE 1 END chkOpe FROM SYS_USER  WHERE U_STATUS<>-1  AND U_EMAIL='" + Systemm.GenerateSHA256String(email.ToLower()).ToString() + "' END ELSE  BEGIN SELECT CASE WHEN COUNT(U_ID)=0 THEN 0 ELSE 1 END chkOpe FROM SYS_USER  WHERE U_STATUS<>-1   AND U_EMAIL='" + Systemm.GenerateSHA256String(email.ToLower()).ToString() + "' AND U_REF_ID<>" + id + " END";
            return JsonConvert.SerializeObject(conn.dbSysRun(query, 1));
        }
    }
}
