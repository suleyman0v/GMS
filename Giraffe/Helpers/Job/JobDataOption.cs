using Giraffe.Model.Job;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Helpers.Job
{
    public class JobDataOption
    {
        public string JobOperation(Jobs job)
        {
            int id = job.id;
            if (id == 0)
            {
                List<Parameters> INS_JOB = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="J_NAME",Parametr_value=job.name},
                       new Parameters(){ Parametr_name="J_TEMPLATE",Parametr_value=job.tid.ToString()},
                       new Parameters(){ Parametr_name="J_S_ID",Parametr_value=job.sid.ToString()},
                       new Parameters(){ Parametr_name="J_STATUS",Parametr_value="1"},
                       new Parameters(){ Parametr_name="J_U_ID",Parametr_value=conn.getUserId().ToString()}
                    };
                conn.dbExecute(INS_JOB, "JOB_JOBS", "INS");
            }
            else
            {
                List<Parameters> UPD_JOB = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="J_NAME",Parametr_value=job.name},
                       new Parameters(){ Parametr_name="J_TEMPLATE",Parametr_value=job.tid.ToString()},
                       new Parameters(){ Parametr_name="J_S_ID",Parametr_value=job.sid.ToString()},
                    };
                conn.dbExecute(UPD_JOB, "JOB_JOBS", "UPD", job.id, "J_ID");
            }

            return "[]";
        }
    }
}
