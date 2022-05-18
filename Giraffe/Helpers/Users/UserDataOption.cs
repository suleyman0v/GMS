using System;
using System.Collections.Generic;
using Giraffe.Model.Auth;
using System.Data.SqlClient;
using Newtonsoft.Json;

namespace Giraffe.Helpers.Users
{
    public class UserDataOption
    {
        public string SaveUser(SysUser user)
        {
            int id = user.id;
            string sql = "";
            int userId = 0;
            List<LocalStorage> localStorage = new List<LocalStorage>();
            if (id == 0)
            {
                List<Parameters> INS_USER = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="U_TYPE",Parametr_value=user.userType.ToString()},
                       new Parameters(){ Parametr_name="U_EMAIL",Parametr_value=user.email},
                       new Parameters(){ Parametr_name="U_PASS",Parametr_value=Systemm.GenerateSHA256String(user.password.ToLower()).ToString()},
                       new Parameters(){ Parametr_name="U_NAME",Parametr_value=user.name},
                       new Parameters(){ Parametr_name="U_SURNAME",Parametr_value=user.lastName},
                       new Parameters(){ Parametr_name="U_STATUS",Parametr_value="1"},
                       new Parameters(){ Parametr_name="U_SEX",Parametr_value="1"}
                    };
                userId = conn.dbExecute(INS_USER, "SYS_USER", "INS");
                //acs
                sql = @"INSERT INTO SYS_USER(U_REF_ID, U_PASS, U_EMAIL,U_NAME,U_SURNAME,U_COMPANY,U_TYPE,U_STATUS) 
                        VALUES(" + userId + ", '" + Systemm.GenerateSHA256String(user.password.ToLower()).ToString() + "', '" + Systemm.GenerateSHA256String(user.email.ToLower()).ToString() + "', '" + user.name + "', '" + user.lastName + "', " + conn.getCompanyId() + ", " + user.userType + ",1)";
            }
            else
            {
                List<Parameters> UPD_USER = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="U_TYPE",Parametr_value=user.userType.ToString()},
                       new Parameters(){ Parametr_name="U_EMAIL",Parametr_value=user.email},
                       new Parameters(){ Parametr_name="U_NAME",Parametr_value=user.name},
                       new Parameters(){ Parametr_name="U_SURNAME",Parametr_value=user.lastName},
                    };

                if (user.password != "")
                {
                    UPD_USER.Add(
                     new Parameters() { Parametr_name = "U_PASS", Parametr_value = Systemm.GenerateSHA256String(user.password.ToLower()).ToString() }
                     );
                }
                conn.dbExecute(UPD_USER, "SYS_USER", "UPD", user.id, "U_ID");
                //acs

                sql = (user.password != "") ?
                "UPDATE SYS_USER " +
                "SET " +
                "U_NAME ='" + user.name.ToString() +
                "',U_SURNAME='" + user.lastName.ToString() +
                "',U_EMAIL='" + Systemm.GenerateSHA256String(user.email.ToLower()).ToString() +
                "',U_PASS='" + Systemm.GenerateSHA256String(user.password.ToLower()).ToString() +
                "',U_TYPE='" + user.userType +
                "' WHERE U_REF_ID = " + user.id + " AND U_COMPANY = " + conn.getCompanyId()
                :
                "UPDATE SYS_USER " +
                "SET " +
                "U_NAME ='" + user.name.ToString() +
                "',U_SURNAME='" + user.lastName.ToString() +
                "',U_EMAIL='" + Systemm.GenerateSHA256String(user.email.ToLower()).ToString() +
                "',U_TYPE='" + user.userType +
                "' WHERE U_REF_ID = " + user.id + " AND U_COMPANY = " + conn.getCompanyId();

                if (user.id == conn.getUserId())
                {
                    localStorage.Add(new LocalStorage()
                    {
                        id = conn.getUserId(),
                        email = user.email,
                        firstName = user.name,
                        lastName = user.lastName,
                        imgPath = user.img,
                        companyImage = ""
                    });
                }
            }
            //acs
            conn.dbSysRun(sql);
            return JsonConvert.SerializeObject(localStorage);
        }
    }
}
