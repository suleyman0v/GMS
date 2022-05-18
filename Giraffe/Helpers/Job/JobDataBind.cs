using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Helpers.Job
{
    public class JobDataBind
    {
        public string GetJobsData(int type)
        {
            string sql = @"SP_JOBS @TYPE=" + type;
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }

        public string GetJobDetail(int id)
        {
            string sql = @"SP_JOB_D @ID=" + id;
            DataTable dt = conn.dbRun(sql);
            if (dt.Rows.Count != 0)
            {
                return dt.Rows[0][0].ToString();
            }
            return "[]";
        }
    }
}
