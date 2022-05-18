using Giraffe.Model.Client;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Helpers.Client
{
    public class ClientDataOption
    {
        public string ClientProposalSave(ClientProposal cp)
        {
            ClientDataBind cdb = new ClientDataBind();
            string connStr = cdb.GetConnStrById(cp.cmp);

            if (cdb.CheckProposalCode(cp.leadId, cp.code, connStr))
            {
                string sql = "EXEC SP_CLIENT_PROPOSAL_CHANGE_STATUS @ID=" + cp.proposalId + ",@LEAD=" + cp.leadId + ", @STATUS=" + cp.status + ", @SIGNATURE='" + cp.signatureImage + "'";
                DataTable dt = new DataTable();
                using (SqlConnection con = new SqlConnection(connStr))
                {
                    var cmd = new SqlCommand(sql, con);
                    cmd.Connection.Open();
                    cmd.CommandTimeout = 1800;
                    var sqlReader = cmd.ExecuteReader();
                    dt.Load(sqlReader);
                    sqlReader.Close();
                    cmd.Connection.Close();
                    cmd.Dispose();
                    con.Close();
                }
                return dt.Rows[0][0].ToString();
            }
            else
            {
                return "[]";
            }
        }

        public string ClientWebLeadData(ClientWebLead cwl)
        {
            ClientDataBind cdb = new ClientDataBind();
            string connStr = cdb.GetConnStrById(cwl.cmpn);
            int id = 0;
            int customerid = 0;
               
                    List<Parameters> INS_CUSTOMER = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="C_NAME",Parametr_value=cwl.firstName },
                       new Parameters(){ Parametr_name="C_SURNAME",Parametr_value=cwl.lastName },
                       new Parameters(){ Parametr_name="C_COMPANY",Parametr_value=cwl.company },
                       new Parameters(){ Parametr_name="C_EMAIL",Parametr_value=cwl.email },
                       new Parameters(){ Parametr_name="C_PHONE",Parametr_value=cwl.phone },
                       new Parameters(){ Parametr_name="C_CELL_PHONE",Parametr_value=cwl.cellPhone},
                       new Parameters(){ Parametr_name="C_STREET",Parametr_value=cwl.street},
                       new Parameters(){ Parametr_name="C_ZIP",Parametr_value=cwl.zipCode },
                       new Parameters(){ Parametr_name="C_CITY",Parametr_value=cwl.city },
                       new Parameters(){ Parametr_name="C_STATE",Parametr_value=cwl.stateProvince },
                       new Parameters(){ Parametr_name="C_CONTRACTOR",Parametr_value="0" },
                       new Parameters(){ Parametr_name="C_U_ID",Parametr_value="0" },
                       new Parameters(){ Parametr_name="C_STATUS",Parametr_value="1" },
                    };
                    customerid = conn._dbExecute(INS_CUSTOMER, "CRM_CUSTOMERS", "INS", connStr);
              
                List<Parameters> INS_LEAD = new List<Parameters>()
                   {
                       new Parameters(){ Parametr_name="L_CODE",Parametr_value="null" },
                       new Parameters(){ Parametr_name="L_TITLE",Parametr_value=cwl.opportunityTitle },
                       new Parameters(){ Parametr_name="L_C_ID",Parametr_value=customerid.ToString() },
                       new Parameters(){ Parametr_name="L_OPEN_DATE",Parametr_value=cwl.openDate },
                       new Parameters(){ Parametr_name="L_CLOSED_DATE",Parametr_value= "null"},
                       new Parameters(){ Parametr_name="L_PT_ID",Parametr_value=cwl.projectType.ToString() },
                       new Parameters(){ Parametr_name="L_SOURCE",Parametr_value=cwl.source.ToString() },
                       new Parameters(){ Parametr_name="L_STATUS",Parametr_value="1"},
                       new Parameters(){ Parametr_name="L_L_STATUS",Parametr_value=cwl.status.ToString() },
                       new Parameters(){ Parametr_name="L_NOTE",Parametr_value=cwl.note },
                       new Parameters(){ Parametr_name="L_RATE",Parametr_value=cwl.saleProbality.ToString() },
                       new Parameters(){ Parametr_name="L_REVENUE",Parametr_value=cwl.budget.ToString() },
                       new Parameters(){ Parametr_name="L_OWNER",Parametr_value="0" },
                       new Parameters(){ Parametr_name="L_STREET",Parametr_value=cwl.projectStreet },
                       new Parameters(){ Parametr_name="L_ZIP",Parametr_value=cwl.projectZipCode },
                       new Parameters(){ Parametr_name="L_CITY",Parametr_value=cwl.projectCityTown },
                       new Parameters(){ Parametr_name="L_STATE",Parametr_value=cwl.projectStateProvince },
                       new Parameters(){ Parametr_name="L_U_ID",Parametr_value="0" },
                   };
                id = conn._dbExecute(INS_LEAD, "LED_LEADS", "INS", connStr);
             
                foreach (var dt in cwl.fileObj)
                {
                    if (dt.ope == 1)
                    {
                        List<Parameters> INS_FILE = new List<Parameters>()
                       {
                           new Parameters(){ Parametr_name="LF_L_ID",Parametr_value=id.ToString() },
                           new Parameters(){ Parametr_name="LF_URL",Parametr_value=dt.url },
                           new Parameters(){ Parametr_name="LF_NAME",Parametr_value=dt.name },
                           new Parameters(){ Parametr_name="LF_SIZE",Parametr_value=dt.size.ToString() },
                           new Parameters(){ Parametr_name="LF_TYPE",Parametr_value=dt.type.ToString() },
                           new Parameters(){ Parametr_name="LF_STATUS",Parametr_value="1" },
                           new Parameters(){ Parametr_name="LF_U_ID",Parametr_value="0" },
                       };
                        conn._dbExecute(INS_FILE, "LED_FILES", "INS", connStr);
                    }
                }
            return "[]";
        }
    }
}
