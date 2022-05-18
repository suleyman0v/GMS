using Giraffe.Model.Layout;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Helpers.Layout
{
    public class LayoutDataOption
    {
        public string MenuOperation(SubMenu sm)
        {
            if (sm.ope == "DEL")
            {
                List<Parameters> DEL_PINMENU = new List<Parameters>()
                {
                };
                conn.dbExecute(DEL_PINMENU, "SYS_USER_PINNED_MENU", "DEL", sm.id, "UPM_M_ID");
            }
            else if (sm.ope == "INS")
            {
                List<Parameters> INS_PINMENU = new List<Parameters>()
                   {
                       new Parameters(){ Parametr_name="UPM_U_ID",Parametr_value=conn.getUserId().ToString() },
                       new Parameters(){ Parametr_name="UPM_M_ID",Parametr_value=sm.id.ToString() },
                       new Parameters(){ Parametr_name="UPM_U_CREATED",Parametr_value=conn.getUserId().ToString() },
                       new Parameters(){ Parametr_name="UPM_STATUS",Parametr_value="1" }
                   };
                conn.dbExecute(INS_PINMENU, "SYS_USER_PINNED_MENU", "INS");
            }
            return "";
        }
    }
}
