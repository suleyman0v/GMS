using Giraffe.Model.Lead;
using Giraffe.Helpers.Global;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using Giraffe.Utilities;
using Giraffe.Model.Global;

namespace Giraffe.Helpers.Lead
{
    public class LeadDataOption
    {
        public string LeadOperation(Leads l)
        {
            int id = l.id;
            if (id == 0)
            {
                int customerid = l.customerObj.id;
                if (customerid == 0 && (l.customerObj.firstName.Length > 0 || l.customerObj.lastName.Length > 0 || l.customerObj.company.Length > 0 || l.customerObj.email.Length > 0 || l.customerObj.phone.Length > 0 || l.customerObj.cellPhone.Length > 0))
                {
                    List<Parameters> INS_CUSTOMER = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="C_NAME",Parametr_value=l.customerObj.firstName },
                       new Parameters(){ Parametr_name="C_SURNAME",Parametr_value=l.customerObj.lastName },
                       new Parameters(){ Parametr_name="C_COMPANY",Parametr_value=l.customerObj.company },
                       new Parameters(){ Parametr_name="C_EMAIL",Parametr_value=l.customerObj.email },
                       new Parameters(){ Parametr_name="C_PHONE",Parametr_value=l.customerObj.phone },
                       new Parameters(){ Parametr_name="C_CELL_PHONE",Parametr_value=l.customerObj.cellPhone},
                       new Parameters(){ Parametr_name="C_STREET",Parametr_value=l.customerObj.street},
                       new Parameters(){ Parametr_name="C_ZIP",Parametr_value=l.customerObj.zipCode },
                       new Parameters(){ Parametr_name="C_CITY",Parametr_value=l.customerObj.city },
                       new Parameters(){ Parametr_name="C_STATE",Parametr_value=l.customerObj.stateProvince },
                       new Parameters(){ Parametr_name="C_CONTRACTOR",Parametr_value="0" },
                       new Parameters(){ Parametr_name="C_U_ID",Parametr_value=conn.getUserId().ToString() },
                       new Parameters(){ Parametr_name="C_STATUS",Parametr_value="1" },
                    };
                    customerid = conn.dbExecute(INS_CUSTOMER, "CRM_CUSTOMERS", "INS");
                }
                else if (customerid != 0 && (l.customerObj.firstName.Length > 0 || l.customerObj.lastName.Length > 0 || l.customerObj.company.Length > 0 || l.customerObj.email.Length > 0 || l.customerObj.phone.Length > 0 || l.customerObj.cellPhone.Length > 0))
                {
                    List<Parameters> INS_CUSTOMER = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="C_NAME",Parametr_value=l.customerObj.firstName },
                       new Parameters(){ Parametr_name="C_SURNAME",Parametr_value=l.customerObj.lastName },
                       new Parameters(){ Parametr_name="C_COMPANY",Parametr_value=l.customerObj.company },
                       new Parameters(){ Parametr_name="C_EMAIL",Parametr_value=l.customerObj.email },
                       new Parameters(){ Parametr_name="C_PHONE",Parametr_value=l.customerObj.phone },
                       new Parameters(){ Parametr_name="C_CELL_PHONE",Parametr_value=l.customerObj.cellPhone},
                       new Parameters(){ Parametr_name="C_STREET",Parametr_value=l.customerObj.street},
                       new Parameters(){ Parametr_name="C_ZIP",Parametr_value=l.customerObj.zipCode },
                       new Parameters(){ Parametr_name="C_CITY",Parametr_value=l.customerObj.city },
                       new Parameters(){ Parametr_name="C_STATE",Parametr_value=l.customerObj.stateProvince },
                       new Parameters(){ Parametr_name="C_CONTRACTOR",Parametr_value="0" },
                    };
                    conn.dbExecute(INS_CUSTOMER, "CRM_CUSTOMERS", "UPD", l.customerObj.id, "C_ID");
                }
                else
                {
                    customerid = 0;
                }
                List<Parameters> INS_LEAD = new List<Parameters>()
                   {
                       new Parameters(){ Parametr_name="L_CODE",Parametr_value="null" },
                       new Parameters(){ Parametr_name="L_TITLE",Parametr_value=l.generalObj.opportunity },
                       new Parameters(){ Parametr_name="L_C_ID",Parametr_value=customerid.ToString() },
                       new Parameters(){ Parametr_name="L_OPEN_DATE",Parametr_value=l.generalObj.openDate=="" || l.generalObj.openDate==null? "null":l.generalObj.openDate },
                       new Parameters(){ Parametr_name="L_CLOSED_DATE",Parametr_value= l.generalObj.closedDate=="" || l.generalObj.closedDate==null? "null":l.generalObj.closedDate},
                       new Parameters(){ Parametr_name="L_PT_ID",Parametr_value=l.generalObj.projectType.ToString() },
                       new Parameters(){ Parametr_name="L_SOURCE",Parametr_value=l.generalObj.source.ToString() },
                       new Parameters(){ Parametr_name="L_STATUS",Parametr_value="1"},
                       new Parameters(){ Parametr_name="L_L_STATUS",Parametr_value=l.generalObj.status.ToString() },
                       new Parameters(){ Parametr_name="L_NOTE",Parametr_value=l.generalObj.note },
                       new Parameters(){ Parametr_name="L_RATE",Parametr_value=l.generalObj.saleProbality.ToString() },
                       new Parameters(){ Parametr_name="L_REVENUE",Parametr_value=l.generalObj.estSaleRevenue.ToString() },
                       new Parameters(){ Parametr_name="L_OWNER",Parametr_value=l.ownerObj.owner.ToString() },
                       new Parameters(){ Parametr_name="L_STREET",Parametr_value=l.generalObj.projectStreet },
                       new Parameters(){ Parametr_name="L_ZIP",Parametr_value=l.generalObj.projectZipCode },
                       new Parameters(){ Parametr_name="L_CITY",Parametr_value=l.generalObj.projectCityTown },
                       new Parameters(){ Parametr_name="L_STATE",Parametr_value=l.generalObj.projectStateProvince },
                       new Parameters(){ Parametr_name="L_U_ID",Parametr_value=conn.getUserId().ToString() },
                   };
                id = conn.dbExecute(INS_LEAD, "LED_LEADS", "INS");
                foreach (var dt in l.ownerObj.assigner)
                {
                    List<Parameters> INS_LEADASSIGNER = new List<Parameters>()
                   {
                       new Parameters(){ Parametr_name="LA_L_ID",Parametr_value=id.ToString() },
                       new Parameters(){ Parametr_name="LA_U_ID",Parametr_value=dt.id.ToString() },
                       new Parameters(){ Parametr_name="LA_STATUS",Parametr_value="1" },
                       new Parameters(){ Parametr_name="LA_CREATEDBY",Parametr_value=conn.getUserId().ToString() },
                   };
                    conn.dbExecute(INS_LEADASSIGNER, "LED_ASSIGNER", "INS");
                }
                foreach (var dt in l.fileObj)
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
                           new Parameters(){ Parametr_name="LF_U_ID",Parametr_value=conn.getUserId().ToString() },

                       };
                        conn.dbExecute(INS_FILE, "LED_FILES", "INS");
                    }
                }

            }
            else if (l.id != 0)
            {
                int customerid = l.customerObj.id;
                if (customerid == 0 && (l.customerObj.firstName.Length > 0 || l.customerObj.lastName.Length > 0 || l.customerObj.company.Length > 0 || l.customerObj.email.Length > 0 || l.customerObj.phone.Length > 0 || l.customerObj.cellPhone.Length > 0))
                {
                    List<Parameters> INS_CUSTOMER = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="C_NAME",Parametr_value=l.customerObj.firstName },
                       new Parameters(){ Parametr_name="C_SURNAME",Parametr_value=l.customerObj.lastName },
                       new Parameters(){ Parametr_name="C_COMPANY",Parametr_value=l.customerObj.company },
                       new Parameters(){ Parametr_name="C_EMAIL",Parametr_value=l.customerObj.email },
                       new Parameters(){ Parametr_name="C_PHONE",Parametr_value=l.customerObj.phone },
                       new Parameters(){ Parametr_name="C_CELL_PHONE",Parametr_value=l.customerObj.cellPhone},
                       new Parameters(){ Parametr_name="C_STREET",Parametr_value=l.customerObj.street},
                       new Parameters(){ Parametr_name="C_ZIP",Parametr_value=l.customerObj.zipCode },
                       new Parameters(){ Parametr_name="C_CITY",Parametr_value=l.customerObj.city },
                       new Parameters(){ Parametr_name="C_STATE",Parametr_value=l.customerObj.stateProvince },
                       new Parameters(){ Parametr_name="C_CONTRACTOR",Parametr_value="0" },
                       new Parameters(){ Parametr_name="C_U_ID",Parametr_value=conn.getUserId().ToString() },
                       new Parameters(){ Parametr_name="C_STATUS",Parametr_value="1" },
                    };
                    customerid = conn.dbExecute(INS_CUSTOMER, "CRM_CUSTOMERS", "INS");
                }
                else if (customerid != 0 && (l.customerObj.firstName.Length > 0 || l.customerObj.lastName.Length > 0 || l.customerObj.company.Length > 0 || l.customerObj.email.Length > 0 || l.customerObj.phone.Length > 0 || l.customerObj.cellPhone.Length > 0))
                {
                    List<Parameters> INS_CUSTOMER = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="C_NAME",Parametr_value=l.customerObj.firstName },
                       new Parameters(){ Parametr_name="C_SURNAME",Parametr_value=l.customerObj.lastName },
                       new Parameters(){ Parametr_name="C_COMPANY",Parametr_value=l.customerObj.company },
                       new Parameters(){ Parametr_name="C_EMAIL",Parametr_value=l.customerObj.email },
                       new Parameters(){ Parametr_name="C_PHONE",Parametr_value=l.customerObj.phone },
                       new Parameters(){ Parametr_name="C_CELL_PHONE",Parametr_value=l.customerObj.cellPhone},
                       new Parameters(){ Parametr_name="C_STREET",Parametr_value=l.customerObj.street},
                       new Parameters(){ Parametr_name="C_ZIP",Parametr_value=l.customerObj.zipCode },
                       new Parameters(){ Parametr_name="C_CITY",Parametr_value=l.customerObj.city },
                       new Parameters(){ Parametr_name="C_STATE",Parametr_value=l.customerObj.stateProvince },
                       new Parameters(){ Parametr_name="C_CONTRACTOR",Parametr_value="0" },
                    };
                    conn.dbExecute(INS_CUSTOMER, "CRM_CUSTOMERS", "UPD", l.customerObj.id, "C_ID");
                }
                else
                {
                    customerid = 0;
                }
                List<Parameters> UPD_LEAD = new List<Parameters>()
                   {
                       new Parameters(){ Parametr_name="L_CODE",Parametr_value="null" },
                       new Parameters(){ Parametr_name="L_TITLE",Parametr_value=l.generalObj.opportunity },
                       new Parameters(){ Parametr_name="L_C_ID",Parametr_value=customerid.ToString() },
                       new Parameters(){ Parametr_name="L_OPEN_DATE",Parametr_value=l.generalObj.openDate==""|| l.generalObj.openDate==null? "null":l.generalObj.openDate },
                       new Parameters(){ Parametr_name="L_CLOSED_DATE",Parametr_value= l.generalObj.closedDate=="" || l.generalObj.closedDate==null? "null":l.generalObj.closedDate},
                       new Parameters(){ Parametr_name="L_PT_ID",Parametr_value=l.generalObj.projectType.ToString() },
                       new Parameters(){ Parametr_name="L_SOURCE",Parametr_value=l.generalObj.source.ToString() },
                       new Parameters(){ Parametr_name="L_STATUS",Parametr_value="1"},
                       new Parameters(){ Parametr_name="L_L_STATUS",Parametr_value=l.generalObj.status.ToString() },
                       new Parameters(){ Parametr_name="L_NOTE",Parametr_value=l.generalObj.note },
                       new Parameters(){ Parametr_name="L_RATE",Parametr_value=l.generalObj.saleProbality.ToString() },
                       new Parameters(){ Parametr_name="L_REVENUE",Parametr_value=l.generalObj.estSaleRevenue.ToString() },
                       new Parameters(){ Parametr_name="L_OWNER",Parametr_value=l.ownerObj.owner.ToString() },
                       new Parameters(){ Parametr_name="L_STREET",Parametr_value=l.generalObj.projectStreet },
                       new Parameters(){ Parametr_name="L_ZIP",Parametr_value=l.generalObj.projectZipCode },
                       new Parameters(){ Parametr_name="L_CITY",Parametr_value=l.generalObj.projectCityTown },
                       new Parameters(){ Parametr_name="L_STATE",Parametr_value=l.generalObj.projectStateProvince },
                   };
                conn.dbExecute(UPD_LEAD, "LED_LEADS", "UPD", id, "L_ID");
                List<Parameters> DEL_LEADASSIGNER = new List<Parameters>()
                { };
                conn.dbExecute(DEL_LEADASSIGNER, "LED_ASSIGNER", "DEL", id, "LA_L_ID");
                foreach (var dt in l.ownerObj.assigner)
                {
                    List<Parameters> INS_LEADASSIGNER = new List<Parameters>()
                       {
                           new Parameters(){ Parametr_name="LA_L_ID",Parametr_value=id.ToString() },
                           new Parameters(){ Parametr_name="LA_U_ID",Parametr_value=dt.id.ToString() },
                           new Parameters(){ Parametr_name="LA_STATUS",Parametr_value="1" },
                           new Parameters(){ Parametr_name="LA_CREATEDBY",Parametr_value=conn.getUserId().ToString() },
                       };
                    conn.dbExecute(INS_LEADASSIGNER, "LED_ASSIGNER", "INS");
                }
                foreach (var dt in l.fileObj)
                {
                    if (dt.ope == -1)
                    {
                        List<Parameters> INS_FILE = new List<Parameters>()
                           {
                               new Parameters(){ Parametr_name="LF_STATUS",Parametr_value="-1" },
                           };
                        conn.dbExecute(INS_FILE, "LED_FILES", "UPD", dt.id, "LF_ID");
                    }
                    else if (dt.ope == 1)
                    {
                        List<Parameters> INS_FILE = new List<Parameters>()
                           {
                               new Parameters(){ Parametr_name="LF_L_ID",Parametr_value=id.ToString() },
                               new Parameters(){ Parametr_name="LF_URL",Parametr_value=dt.url },
                               new Parameters(){ Parametr_name="LF_NAME",Parametr_value=dt.name },
                               new Parameters(){ Parametr_name="LF_SIZE",Parametr_value=dt.size.ToString() },
                               new Parameters(){ Parametr_name="LF_TYPE",Parametr_value=dt.type.ToString() },
                               new Parameters(){ Parametr_name="LF_STATUS",Parametr_value="1" },
                               new Parameters(){ Parametr_name="LF_U_ID",Parametr_value=conn.getUserId().ToString() },

                           };
                        conn.dbExecute(INS_FILE, "LED_FILES", "INS");
                    }
                }
            }
            LeadDataBind ldb = new LeadDataBind();
            return ldb.GetReturnLeadData(id);
        }
        public string LeadActivityOperation(LeadActivity la)
        {
            int id = la.id;
            if (la.begDate == "") { la.begDate = null; }
            if (la.begTime == "") { la.begTime = null; }
            if (la.followUpBegDate == "") { la.followUpBegDate = null; }
            if (la.followUpBegTime == "") { la.followUpBegTime = null; }
            if (id == 0)
            {
                List<Parameters> INS_ACTIVITY = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="LAC_L_ID",Parametr_value=la.leadId.ToString() },
                       new Parameters(){ Parametr_name="LAC_TYPE",Parametr_value=la.activityTypeId.ToString() },
                       new Parameters(){ Parametr_name="LAC_BEGDATE",Parametr_value=(la.begDate==null && la.begTime==null)? "null":la.begDate+" "+la.begTime },
                       new Parameters(){ Parametr_name="LAC_DURATION",Parametr_value=((la.durationDay*24)+la.durationHour).ToString() },
                       new Parameters(){ Parametr_name="LAC_DURATION_MINUTE",Parametr_value=la.durationMinute.ToString() },
                       new Parameters(){ Parametr_name="LAC_DESC",Parametr_value=la.description},
                       new Parameters(){ Parametr_name="LAC_REMINDER",Parametr_value=la.reminder.ToString()},
                       new Parameters(){ Parametr_name="LAC_LAC_STATUS",Parametr_value=la.status.ToString() },
                       new Parameters(){ Parametr_name="LAC_COMPLETED_BY",Parametr_value = la.status==1? "null": conn.getUserId().ToString() },
                       new Parameters(){ Parametr_name="LAC_COMPLETED_DATE",Parametr_value = la.status==1? "null": DateTime.Now.ToString() },
                       new Parameters(){ Parametr_name="LAC_STATUS",Parametr_value="1" },
                       new Parameters(){ Parametr_name="LAC_CREATED_BY",Parametr_value=conn.getUserId().ToString() },
                    };
                id = conn.dbExecute(INS_ACTIVITY, "LED_ACTIVITIES", "INS");
                int i = 0;
                foreach (var assigners in la.assigner)
                {
                    i++;
                    List<Parameters> INS_ASSIGNERS = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="LAA_L_ID",Parametr_value=la.leadId.ToString()},
                       new Parameters(){ Parametr_name="LAA_LA_ID",Parametr_value=id.ToString() },
                       new Parameters(){ Parametr_name="LAA_U_ID",Parametr_value=assigners.id.ToString() },
                       new Parameters(){ Parametr_name="LAA_STATUS",Parametr_value="1" },
                    };
                    conn.dbExecute(INS_ASSIGNERS, "LED_ACTIVITY_ASSIGNER", "INS");
                }
            }
            else
            {
                List<Parameters> INS_ACTIVITY = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="LAC_L_ID",Parametr_value=la.leadId.ToString() },
                       new Parameters(){ Parametr_name="LAC_TYPE",Parametr_value=la.activityTypeId.ToString() },
                       new Parameters(){ Parametr_name="LAC_BEGDATE",Parametr_value=(la.begDate=="" && la.begTime=="")|| (la.begDate==null && la.begTime==null)? "null":la.begDate+" "+la.begTime },
                       new Parameters(){ Parametr_name="LAC_DURATION",Parametr_value=((la.durationDay*24)+la.durationHour).ToString() },
                       new Parameters(){ Parametr_name="LAC_DURATION_MINUTE",Parametr_value=la.durationMinute.ToString() },
                       new Parameters(){ Parametr_name="LAC_DESC",Parametr_value=la.description},
                       new Parameters(){ Parametr_name="LAC_REMINDER",Parametr_value=la.reminder.ToString()},
                       new Parameters(){ Parametr_name="LAC_LAC_STATUS",Parametr_value=la.status.ToString() },
                       new Parameters(){ Parametr_name="LAC_COMPLETED_BY",Parametr_value = la.status==1? "null": conn.getUserId().ToString() },
                       new Parameters(){ Parametr_name="LAC_COMPLETED_DATE",Parametr_value = la.status==1? "null": DateTime.Now.ToString() },
                       new Parameters(){ Parametr_name="LAC_STATUS",Parametr_value="1" },
                    };
                conn.dbExecute(INS_ACTIVITY, "LED_ACTIVITIES", "UPD", id, "LAC_ID");

                List<Parameters> DEL_LEADASSIGNER = new List<Parameters>() { };
                conn.dbExecute(DEL_LEADASSIGNER, "LED_ACTIVITY_ASSIGNER", "DEL", id, "LAA_LA_ID");
                foreach (var assigners in la.assigner)
                {
                    List<Parameters> INS_ASSIGNERS = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="LAA_L_ID",Parametr_value=la.leadId.ToString()},
                       new Parameters(){ Parametr_name="LAA_LA_ID",Parametr_value=id.ToString() },
                       new Parameters(){ Parametr_name="LAA_U_ID",Parametr_value=assigners.id.ToString() },
                       new Parameters(){ Parametr_name="LAA_STATUS",Parametr_value="1" },
                    };
                    conn.dbExecute(INS_ASSIGNERS, "LED_ACTIVITY_ASSIGNER", "INS");
                }
            }

            int folowUpActivityId = 0;
            if (la.followUpActivityType != 0)
            {
                List<Parameters> INS_ACTIVITY = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="LAC_L_ID",Parametr_value=la.leadId.ToString() },
                       new Parameters(){ Parametr_name="LAC_TYPE",Parametr_value=la.followUpActivityType.ToString() },
                       new Parameters(){ Parametr_name="LAC_BEGDATE",Parametr_value=(la.followUpBegDate=="" && la.followUpBegTime=="")|| (la.followUpBegDate==null && la.followUpBegTime==null)? "null":la.followUpBegDate+" "+la.followUpBegTime },
                       new Parameters(){ Parametr_name="LAC_DURATION",Parametr_value=((la.followUpDurationDay*24)+la.followUpDurationHour).ToString() },
                       new Parameters(){ Parametr_name="LAC_DURATION_MINUTE",Parametr_value=la.followUpDurationMinute.ToString() },
                       new Parameters(){ Parametr_name="LAC_DESC",Parametr_value=""},
                       new Parameters(){ Parametr_name="LAC_REMINDER",Parametr_value=la.reminder.ToString()},
                       new Parameters(){ Parametr_name="LAC_LAC_STATUS",Parametr_value="1" },
                       new Parameters(){ Parametr_name="LAC_STATUS",Parametr_value="1" },
                       new Parameters(){ Parametr_name="LAC_FOLLOWUP_LAC_ID",Parametr_value=id.ToString() },
                       new Parameters(){ Parametr_name="LAC_CREATED_BY",Parametr_value=conn.getUserId().ToString() },
                    };
                folowUpActivityId = conn.dbExecute(INS_ACTIVITY, "LED_ACTIVITIES", "INS");
                int i = 0;
                foreach (var assigners in la.assigner)
                {
                    i++;
                    List<Parameters> INS_ASSIGNERS = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="LAA_L_ID",Parametr_value=la.leadId.ToString()},
                       new Parameters(){ Parametr_name="LAA_LA_ID",Parametr_value=folowUpActivityId.ToString() },
                       new Parameters(){ Parametr_name="LAA_U_ID",Parametr_value=assigners.id.ToString() },
                       new Parameters(){ Parametr_name="LAA_STATUS",Parametr_value="1" },
                    };
                    conn.dbExecute(INS_ASSIGNERS, "LED_ACTIVITY_ASSIGNER", "INS");
                }
            }
            LeadDataBind ldb = new LeadDataBind();
            if (la.actionType == "calendarIns" || la.actionType == "calendarEdit")
            {
                string returnedArray = ldb.GetLeadReturnCalendar(id);
                if (folowUpActivityId != 0)
                {
                    List<Parameters> INS_ACTIVITY = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="LAC_FOLLOWUP_LAC_ID",Parametr_value="null" },
                    };
                    conn.dbExecute(INS_ACTIVITY, "LED_ACTIVITIES", "UPD", folowUpActivityId, "LAC_ID");
                }
                return returnedArray;
            }
            else
            {
                return ldb.GetLeadReturnActivities(la.leadId);
            }
        }
        public string CalendarDateUpd(CalendarDateUpdate calendarUpd)
        {
            GlobalDataBind gdb = new GlobalDataBind();
            if (calendarUpd.ope == "lead")
            {
                List<Parameters> DATA_UPD = new List<Parameters>()
            {
                    new Parameters () { Parametr_name = "LAC_BEGDATE", Parametr_value = calendarUpd.begdate.Replace(",","") },
                    new Parameters () { Parametr_name = "LAC_DURATION", Parametr_value = gdb.GetDuration(calendarUpd.begdate.Replace(",",""),calendarUpd.enddate.Replace(",","")) },
                    new Parameters () { Parametr_name = "LAC_DURATION_MINUTE", Parametr_value = gdb.GetDurationMinute(calendarUpd.begdate.Replace(",",""),calendarUpd.enddate.Replace(",","")) },
            };
                conn.dbExecute(DATA_UPD, "LED_ACTIVITIES", "UPD", calendarUpd.id, "LAC_ID");
            }
            LeadDataBind ldb = new LeadDataBind();
            return ldb.GetLeadReturnCalendar(calendarUpd.id);
        }
        public string LeadProposalOperation(LeadProposal lp)
        {
            LeadDataBind ldb = new LeadDataBind();
            int stepId = 0;
            int id = lp.id;
            if (lp.deadline == "") { lp.deadline = null; }
            if (id == 0)
            {
                List<Parameters> INS_PROPOSAL = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="LP_TITLE",Parametr_value=lp.title.ToString() },
                       new Parameters(){ Parametr_name="LP_L_ID",Parametr_value=lp.leadId.ToString()},
                       new Parameters(){ Parametr_name="LP_PRICING_OPE",Parametr_value=lp.pricingOpe.ToString()},
                       new Parameters(){ Parametr_name="LP_DEADLINE",Parametr_value=(lp.deadline==null)? "null":lp.deadline },
                       new Parameters(){ Parametr_name="LP_TEMPLATE",Parametr_value=lp.template.ToString()},
                       new Parameters(){ Parametr_name="LP_NOTES",Parametr_value=lp.note.ToString() },
                       new Parameters(){ Parametr_name="LP_TOTAL",Parametr_value=lp.total.ToString() },
                       new Parameters(){ Parametr_name="LP_DISCOUNT_RATE",Parametr_value=lp.discount.ToString() },
                       new Parameters(){ Parametr_name="LP_DISCOUNT_REASON",Parametr_value=lp.discountReason.ToString()},
                       new Parameters(){ Parametr_name="LP_TAX_RATE",Parametr_value=lp.taxRate.ToString() },
                       new Parameters(){ Parametr_name="LP_STATUS",Parametr_value="1"},
                       new Parameters(){ Parametr_name="LP_U_ID",Parametr_value=conn.getUserId().ToString()},
                       new Parameters(){ Parametr_name="LP_LP_STATUS",Parametr_value="1"},
                    };
                id = conn.dbExecute(INS_PROPOSAL, "LED_PROPOSAL", "INS");

                foreach (var step in lp.steps)
                {

                    List<Parameters> INS_STEP = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="LPS_L_ID",Parametr_value=lp.leadId.ToString() },
                       new Parameters(){ Parametr_name="LPS_LP_ID",Parametr_value=id.ToString()},
                       new Parameters(){ Parametr_name="LPS_FACTORS",Parametr_value=step.factorSave.ToString() },
                       new Parameters(){ Parametr_name="LPS_FACTOR_VALUE",Parametr_value=step.factorValue.ToString() },
                       new Parameters(){ Parametr_name="LPS_NAME",Parametr_value=step.name.ToString() },
                       new Parameters(){ Parametr_name="LPS_ORDERBY",Parametr_value=step.orderBy.ToString() },
                       new Parameters(){ Parametr_name="LPS_STATUS",Parametr_value="1"},
                    };
                    stepId = conn.dbExecute(INS_STEP, "LED_PROPOSAL_STEP", "INS");

                    foreach (var detail in step.details)
                    {
                        List<Parameters> INS_STEP_D = new List<Parameters>()
                            {
                               new Parameters(){ Parametr_name= "LPSD_L_ID", Parametr_value=lp.leadId.ToString() },
                               new Parameters(){ Parametr_name="LPSD_LP_ID",Parametr_value=id.ToString()},
                               new Parameters(){ Parametr_name="LPSD_LPS_ID",Parametr_value=stepId.ToString()},
                               new Parameters(){ Parametr_name="LPSD_TRANSACTION",Parametr_value="1" },
                               new Parameters(){ Parametr_name="LPSD_ITEM_TYPE",Parametr_value=detail.itemType.ToString() },
                               new Parameters(){ Parametr_name="LPSD_ITEM_ID",Parametr_value=detail.itemId.ToString()},
                               new Parameters(){ Parametr_name="LPSD_ITEM_NAME",Parametr_value=detail.itemName.ToString() },
                               new Parameters(){ Parametr_name="LPSD_ITEM_DESCRIPTION",Parametr_value=detail.itemDesc.ToString() },
                               new Parameters(){ Parametr_name="LPSD_QTY",Parametr_value=detail.qty.ToString()},
                               new Parameters(){ Parametr_name="LPSD_PRICE",Parametr_value=detail.price.ToString()},
                               new Parameters(){ Parametr_name="LPSD_ITEM_UNIT",Parametr_value=detail.unitId.ToString() },
                               new Parameters(){ Parametr_name="LPSD_QTY_OPE",Parametr_value=detail.qtyOpe.ToString()},
                               new Parameters(){ Parametr_name="LPSD_VISIBLE_OPE",Parametr_value=detail.visibleOpe.ToString() },
                               new Parameters(){ Parametr_name="LPSD_CALC_OPE",Parametr_value=detail.calcOpe.ToString() },
                               new Parameters(){ Parametr_name="LPSD_CALC_OBJ",Parametr_value=detail.calcObj.ToString() },
                               new Parameters(){ Parametr_name="LPSD_PRICE_ON_REQUEST",Parametr_value=detail.priceOnRequestOpe.ToString() },
                               new Parameters(){ Parametr_name="LPSD_STATUS",Parametr_value="1"},
                               new Parameters(){ Parametr_name="LPSD_U_ID",Parametr_value=conn.getUserId().ToString()},
                               new Parameters(){ Parametr_name="LPSD_ORDER_BY",Parametr_value=detail.orderBy.ToString() },
                            };
                        conn.dbExecute(INS_STEP_D, "LED_PROPOSAL_STEP_D", "INS");
                    }
                }
            }
            else
            {
                List<Parameters> UPD_PROPOSAL = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="LP_TITLE",Parametr_value=lp.title.ToString() },
                       new Parameters(){ Parametr_name="LP_NOTES",Parametr_value=lp.note.ToString() },
                       new Parameters(){ Parametr_name="LP_DEADLINE",Parametr_value=(lp.deadline==null)? "null":lp.deadline },
                       new Parameters(){ Parametr_name="LP_TOTAL",Parametr_value=lp.total.ToString() },
                       new Parameters(){ Parametr_name="LP_DISCOUNT_RATE",Parametr_value=lp.discount.ToString() },
                       new Parameters(){ Parametr_name="LP_DISCOUNT_REASON",Parametr_value=lp.discountReason.ToString()},
                       new Parameters(){ Parametr_name="LP_TAX_RATE",Parametr_value=lp.taxRate.ToString() },
                       new Parameters(){ Parametr_name="LP_PRICING_OPE",Parametr_value=lp.pricingOpe.ToString()},
                       new Parameters(){ Parametr_name="LP_LAST_UPDATED",Parametr_value=conn.getUserId().ToString()},
                       new Parameters(){ Parametr_name="LP_LAST_UPDATED_DATE",Parametr_value=DateTime.Now.ToString()},
                       new Parameters(){ Parametr_name="LP_TEMPLATE",Parametr_value=lp.template.ToString()},
                    };

                if (lp.signatureImage != "")
                {
                    UPD_PROPOSAL.Add(new Parameters() { Parametr_name = "LP_SIGNATURE", Parametr_value = lp.signatureImage });
                    UPD_PROPOSAL.Add(new Parameters() { Parametr_name = "LP_APPROVED_DATE", Parametr_value = DateTime.Now.ToString() });
                }

                if (lp.ope == "decline")
                {
                    UPD_PROPOSAL.Add(new Parameters() { Parametr_name = "LP_DECLINED_DATE", Parametr_value = DateTime.Now.ToString() });
                }
                conn.dbExecute(UPD_PROPOSAL, "LED_PROPOSAL", "UPD", id, "LP_ID");

                int transaction = ldb.GetProposalTransaction(id, "PROPOSAL_STEP_DETAIL");
                foreach (var step in lp.steps)
                {

                    List<Parameters> UPD_STEP = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="LPS_FACTOR_VALUE",Parametr_value=step.factorValue.ToString() },
                    };
                    conn.dbExecute(UPD_STEP, "LED_PROPOSAL_STEP", "UPD", step.id, "LPS_ID");


                    foreach (var detail in step.details)
                    {
                        List<Parameters> INS_STEP_D = new List<Parameters>()
                            {
                               new Parameters(){ Parametr_name="LPSD_L_ID", Parametr_value=lp.leadId.ToString() },
                               new Parameters(){ Parametr_name="LPSD_LP_ID",Parametr_value=id.ToString()},
                               new Parameters(){ Parametr_name="LPSD_LPS_ID",Parametr_value=step.id.ToString()},
                               new Parameters(){ Parametr_name="LPSD_TRANSACTION",Parametr_value= transaction.ToString()},
                               new Parameters(){ Parametr_name="LPSD_ITEM_TYPE",Parametr_value=detail.itemType.ToString() },
                               new Parameters(){ Parametr_name="LPSD_ITEM_ID",Parametr_value=detail.itemId.ToString()},
                               new Parameters(){ Parametr_name="LPSD_ITEM_NAME",Parametr_value=detail.itemName.ToString() },
                               new Parameters(){ Parametr_name="LPSD_ITEM_DESCRIPTION",Parametr_value=detail.itemDesc.ToString() },
                               new Parameters(){ Parametr_name="LPSD_QTY",Parametr_value=detail.qty.ToString()},
                               new Parameters(){ Parametr_name="LPSD_PRICE",Parametr_value=detail.price.ToString()},
                               new Parameters(){ Parametr_name="LPSD_ITEM_UNIT",Parametr_value=detail.unitId.ToString() },
                               new Parameters(){ Parametr_name="LPSD_QTY_OPE",Parametr_value=detail.qtyOpe.ToString()},
                               new Parameters(){ Parametr_name="LPSD_VISIBLE_OPE",Parametr_value=detail.visibleOpe.ToString() },
                               new Parameters(){ Parametr_name="LPSD_CALC_OPE",Parametr_value=detail.calcOpe.ToString() },
                               new Parameters(){ Parametr_name="LPSD_CALC_OBJ",Parametr_value=detail.calcObj.ToString() },
                               new Parameters(){ Parametr_name="LPSD_PRICE_ON_REQUEST",Parametr_value=detail.priceOnRequestOpe.ToString() },
                               new Parameters(){ Parametr_name="LPSD_STATUS",Parametr_value="1"},
                               new Parameters(){ Parametr_name="LPSD_U_ID",Parametr_value=conn.getUserId().ToString()},
                               new Parameters(){ Parametr_name="LPSD_ORDER_BY",Parametr_value=detail.orderBy.ToString() },
                            };
                        conn.dbExecute(INS_STEP_D, "LED_PROPOSAL_STEP_D", "INS");
                    }
                }
            }
            return ldb.GetLeadReturnProposal(lp.leadId, id);
        }
        public string SendProposalMail(LeadProposalMail lpm)
        {
            if (lpm.to != "" || lpm.to != null)
            {
                List<string> CC = new List<string>();
                if (lpm.cc != "")
                {
                    foreach (var c in lpm.cc.Replace(" ", "").Split(","))
                    {
                        if (c != "")
                        {
                            CC.Add(c);
                        }
                    }
                }
                string generatedCode = Systemm.GenerateSHA256String(((lpm.leadId + lpm.leadId) * 11).ToString() + DateTime.Now.ToString());
                string template = "";
                string replyMail = "";
                if (lpm.message.Contains("##ProposalLink"))
                {
                    template = lpm.message.Replace("##ProposalLink", conn.projectip + "client/proposal/" + lpm.leadId + "/" + conn.getCompanyId().ToString() + "/" + generatedCode);
                }
                else
                {
                    template = (lpm.message + "<a target='_blank' href='##ProposalLink'>[Click Here]</a>").Replace("##ProposalLink", conn.projectip + "client/proposal/" + lpm.leadId + "/" + conn.getCompanyId().ToString() + "/" + generatedCode);
                }
                Mail ml = new Mail();
                if (ml.SendMail(lpm.to, lpm.subject, template, CC, replyMail, false))
                {
                    List<Parameters> UPD_PROPOSAL = new List<Parameters>()
                   {
                        new Parameters(){ Parametr_name="LP_SENT_OPE",Parametr_value="1" },
                        new Parameters(){ Parametr_name="LP_SENT_DATE",Parametr_value=DateTime.Now.ToString() },
                        new Parameters(){ Parametr_name="LP_APPROVED_OPE",Parametr_value="0" },
                        new Parameters(){ Parametr_name="LP_APPROVED_DATE",Parametr_value="" },
                        new Parameters(){ Parametr_name="LP_SIGNATURE",Parametr_value="" },
                        new Parameters(){ Parametr_name="LP_LP_STATUS",Parametr_value="2" },
                   };

                    conn.dbExecute(UPD_PROPOSAL, "LED_PROPOSAL", "UPD", lpm.proposalId, "LP_ID");

                    List<Parameters> UPD_LEAD = new List<Parameters>()
                   {
                        new Parameters(){ Parametr_name="L_PROPOSAL_SENT_OPE",Parametr_value="1" },
                        new Parameters(){ Parametr_name="L_PROPOSAL_SENT_DATE",Parametr_value=DateTime.Now.ToString() },
                        new Parameters(){ Parametr_name="L_PROPOSAL_APPROVED_OPE",Parametr_value="0" },
                        new Parameters(){ Parametr_name="L_PROPOSAL_COMFIRMATION",Parametr_value=generatedCode },
                   };
                    conn.dbExecute(UPD_LEAD, "LED_LEADS", "UPD", lpm.leadId, "L_ID");


                    List<Parameters> INS_MAIL_LOG = new List<Parameters>()
                   {
                        new Parameters(){ Parametr_name="SEL_TYPE",Parametr_value="PROPOSAL" },
                        new Parameters(){ Parametr_name="SEL_REF_ID",Parametr_value=lpm.proposalId.ToString() },
                        new Parameters(){ Parametr_name="SEL_COMFIRMATION_CODE",Parametr_value=generatedCode },
                        new Parameters(){ Parametr_name="SEL_C_EMAL",Parametr_value=lpm.to },
                        new Parameters(){ Parametr_name="SEL_SUBJECT",Parametr_value=lpm.subject },
                        new Parameters(){ Parametr_name="SEL_BODY",Parametr_value=template },
                        new Parameters(){ Parametr_name="SEL_STATUS",Parametr_value="1" },
                        new Parameters(){ Parametr_name="SEL_U_ID",Parametr_value=conn.getUserId().ToString() },
                        new Parameters(){ Parametr_name="SEL_OPE_TYPE",Parametr_value="1" },
                   };
                    conn.dbExecute(INS_MAIL_LOG, "SYS_SENDING_EMAIL_LOG", "INS");
                }
                LeadDataBind ldb = new LeadDataBind();
                return ldb.GetLeadReturnProposal(lpm.leadId, lpm.proposalId);
            }
            else
            {
                return "[]";
            }
        }

        public string LeadFilterOperation(LeadFilters filter)
        {
            int id = filter.id;
            LeadDataBind ldb = new LeadDataBind();
            if (filter.isDefault == 1)
            {
                GlobalDataBind glb = new GlobalDataBind();
                Status sts = new Status()
                {
                    id = conn.getUserId(),
                    status = 0,
                    param = "filterDefaultOperation"
                };
                glb.ChangeStatus(sts);
            }

            if (id == 0)
            {
                List<Parameters> INS_FILTERS = new List<Parameters>()
                        {
                           new Parameters(){ Parametr_name="F_NAME",Parametr_value=filter.name.ToString() },
                           new Parameters(){ Parametr_name="F_DEFAULT",Parametr_value=filter.isDefault.ToString()},
                           new Parameters(){ Parametr_name="F_FILTERS",Parametr_value=filter.filters.ToString()},
                           new Parameters(){ Parametr_name="F_U_ID",Parametr_value=conn.getUserId().ToString()},
                           new Parameters(){ Parametr_name="F_STATUS",Parametr_value="1"},
                        };
                id = conn.dbExecute(INS_FILTERS, "CRM_FILTERS", "INS");
            }
            else
            {
                List<Parameters> UPD_FILTERS = new List<Parameters>()
                        {
                           new Parameters(){ Parametr_name="F_NAME",Parametr_value=filter.name.ToString() },
                           new Parameters(){ Parametr_name="F_DEFAULT",Parametr_value=filter.isDefault.ToString()},
                        };
                conn.dbExecute(UPD_FILTERS, "CRM_FILTERS", "UPD", id, "F_ID");
            }
            return ldb.GetFilterSavedModalData(id, "Lead");
        }
    }
}
