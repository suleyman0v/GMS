using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Helpers.Customer
{
    public class CustomerDataBind
    {
        public string GetCustomersData(int tab)
        {
            string sql = @"SP_CUSTOMERS @TAB=" + tab;
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }
    }
}
