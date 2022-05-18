using Giraffe.Model.Auth;
using Giraffe.Model.Settings;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Giraffe.Utilities;
using System.Data;
using Newtonsoft.Json;
using System.Data.SqlClient;

namespace Giraffe.Helpers.Settings
{
    public class SettingsDataOption
    {
        public string UserOperation(UserSettings u)
        {
            List<Parameters> UPD_USER = new List<Parameters>();
            List<LocalStorage> localStorage = new List<LocalStorage>();
            string sql = "";
            if (u.ope == 1) //userInfo
            {
                //App
                UPD_USER = new List<Parameters>()
                       {
                           new Parameters(){ Parametr_name="U_NAME",Parametr_value=u.firstName.ToString() },
                           new Parameters(){ Parametr_name="U_SURNAME",Parametr_value=u.lastName.ToString() },
                           new Parameters(){ Parametr_name="U_EMAIL",Parametr_value=u.email.ToLower().ToString() },
                           new Parameters(){ Parametr_name="U_PHONE",Parametr_value=u.phone.ToString()},
                       };
                //fileUpload
                string uploadingFIle;
                if (u.imgPath.Length > 300)
                {
                    FileOperation img = new FileOperation();
                    uploadingFIle = img.SaveBase64Img(conn.getUserId(), u.imgPath, "UserProfile");
                    UPD_USER.Add(
                      new Parameters() { Parametr_name = "U_IMG", Parametr_value = uploadingFIle }
                    );
                }
                else
                {
                    uploadingFIle = u.imgPath;
                    UPD_USER.Add(
                      new Parameters() { Parametr_name = "U_IMG", Parametr_value = uploadingFIle }
                    );
                }

                //Acs
                sql = "UPDATE SYS_USER " +
                              "SET " +
                              "U_NAME ='" + u.firstName.ToString() +
                              "',U_SURNAME='" + u.lastName.ToString() +
                              "',U_EMAIL='" + Systemm.GenerateSHA256String(u.email.ToLower()).ToString() +
                              "',U_IMG='" + uploadingFIle.ToString() +
                              "' WHERE U_REF_ID = " + conn.getUserId() + " AND U_COMPANY = " + conn.getCompanyId();

                localStorage.Add(new LocalStorage()
                {
                    id = conn.getUserId(),
                    email = u.email,
                    firstName = u.firstName,
                    lastName = u.lastName,
                    imgPath = uploadingFIle,
                    companyImage = ""
                });

                conn.dbExecute(UPD_USER, "SYS_USER", "UPD", conn.getUserId(), "U_ID");
                conn.dbSysRun(sql);
                return JsonConvert.SerializeObject(localStorage);
            }
            else //auth
            {
                //App
                //password validation
                string password = "";
                string sqlPassword = @"SP_USERS @ID=" + conn.getUserId() + ", @TYPE=1";
                foreach (DataRow row in conn.dbRun(sqlPassword).Rows)
                {
                    password = row["password"].ToString();
                }
                if (Systemm.GenerateSHA256String(u.oldPassword) == password)
                {
                    UPD_USER = new List<Parameters>()
                       {
                           new Parameters(){ Parametr_name="U_PASS",Parametr_value=Systemm.GenerateSHA256String(u.newPassword).ToString() },
                       };
                    //Acs

                    sql = "UPDATE SYS_USER " +
                                 "SET " +
                                 "U_PASS='" + Systemm.GenerateSHA256String(u.newPassword).ToString() +
                                 "' WHERE U_REF_ID = " + conn.getUserId() + " AND U_COMPANY = " + conn.getCompanyId();
                }
                else
                {
                    return "Error";
                }
                conn.dbExecute(UPD_USER, "SYS_USER", "UPD", conn.getUserId(), "U_ID");
                conn.dbSysRun(sql);
                return "[]";
            }
        }
        public string ItemGroupOperation(ItemGroup ig)
        {
            int id = ig.id;
            if (id == 0)
            {
                List<Parameters> INS_ITEMGROUP = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="IG_NAME",Parametr_value=ig.name },
                       new Parameters(){ Parametr_name="IG_DESC",Parametr_value=ig.desc },
                       new Parameters(){ Parametr_name="IG_STATUS",Parametr_value="1" },
                       new Parameters(){ Parametr_name="IG_U_ID",Parametr_value=conn.getUserId().ToString() },
                    };
                id = conn.dbExecute(INS_ITEMGROUP, "ITM_ITEM_GROUP", "INS");
            }
            else
            {
                List<Parameters> UPD_ITEMGROUP = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="IG_NAME",Parametr_value=ig.name },
                       new Parameters(){ Parametr_name="IG_DESC",Parametr_value=ig.desc },
                    };
                conn.dbExecute(UPD_ITEMGROUP, "ITM_ITEM_GROUP", "UPD", id, "IG_ID");
            }
            SettingsDataBind sdtb = new SettingsDataBind();
            return sdtb.GetSettingsReturnData(id, "itemGroup");
        }
        public string ServiceGroupOperation(ServiceGroup sg)
        {
            int id = sg.id;
            if (id == 0)
            {
                List<Parameters> INS_SERVICEGROUP = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="SG_NAME",Parametr_value=sg.name },
                       new Parameters(){ Parametr_name="SG_DESC",Parametr_value=sg.desc },
                       new Parameters(){ Parametr_name="SG_STATUS",Parametr_value="1" },
                       new Parameters(){ Parametr_name="SG_U_ID",Parametr_value=conn.getUserId().ToString() },
                    };
                id = conn.dbExecute(INS_SERVICEGROUP, "ITM_SERVICE_GROUP", "INS");
            }
            else
            {
                List<Parameters> UPD_SERVICEGROUP = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="SG_NAME",Parametr_value=sg.name },
                       new Parameters(){ Parametr_name="SG_DESC",Parametr_value=sg.desc },
                    };
                conn.dbExecute(UPD_SERVICEGROUP, "ITM_SERVICE_GROUP", "UPD", id, "SG_ID");
            }
            SettingsDataBind sdtb = new SettingsDataBind();
            return sdtb.GetSettingsReturnData(id, "serviceGroup");
        }
        public string ItemOperation(Item i)
        {
            int id = i.id;
            if (id == 0)
            {
                List<Parameters> INS_ITEM = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="I_IG_ID",Parametr_value=i.groupId.ToString() },
                       new Parameters(){ Parametr_name="I_NAME",Parametr_value=i.name },
                       new Parameters(){ Parametr_name="I_UNIT",Parametr_value= i.unitId.ToString() },
                       new Parameters(){ Parametr_name="I_PRICE_ON_REQUEST",Parametr_value= i.priceOnRequest.ToString() },
                       new Parameters(){ Parametr_name="I_PRICE",Parametr_value= i.price.ToString() },
                       new Parameters(){ Parametr_name="I_STATUS",Parametr_value="1" },
                       new Parameters(){ Parametr_name="I_DESC",Parametr_value=i.desc},
                       new Parameters(){ Parametr_name="I_CALCULATION",Parametr_value=i.calculation.ToString()},
                       new Parameters(){ Parametr_name="I_U_ID",Parametr_value=conn.getUserId().ToString() },
                    };
                id = conn.dbExecute(INS_ITEM, "ITM_ITEM", "INS");
            }
            else
            {
                List<Parameters> UPD_ITEM = new List<Parameters>()
                    {
                      new Parameters(){ Parametr_name="I_IG_ID",Parametr_value=i.groupId.ToString() },
                      new Parameters(){ Parametr_name="I_NAME",Parametr_value=i.name },
                      new Parameters(){ Parametr_name="I_UNIT",Parametr_value= i.unitId.ToString() },
                      new Parameters(){ Parametr_name="I_PRICE_ON_REQUEST",Parametr_value= i.priceOnRequest.ToString() },
                      new Parameters(){ Parametr_name="I_PRICE",Parametr_value= i.price.ToString() },
                      new Parameters(){ Parametr_name="I_DESC",Parametr_value=i.desc},
                      new Parameters(){ Parametr_name="I_CALCULATION",Parametr_value=i.calculation.ToString()},
                    };
                conn.dbExecute(UPD_ITEM, "ITM_ITEM", "UPD", id, "I_ID");
            }
            SettingsDataBind sdtb = new SettingsDataBind();
            return sdtb.GetSettingsReturnData(id, "item");
        }
        public string ServiceOperation(Service s)
        {
            int id = s.id;
            if (id == 0)
            {
                List<Parameters> INS_SERVICE = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="S_SG_ID",Parametr_value=s.groupId.ToString() },
                       new Parameters(){ Parametr_name="S_NAME",Parametr_value=s.name },
                       new Parameters(){ Parametr_name="S_UNIT",Parametr_value= s.unitId.ToString() },
                       new Parameters(){ Parametr_name="S_PRICE_ON_REQUEST",Parametr_value= s.priceOnRequest.ToString() },
                       new Parameters(){ Parametr_name="S_PRICE",Parametr_value= s.price.ToString()},
                       new Parameters(){ Parametr_name="S_STATUS",Parametr_value="1" },
                       new Parameters(){ Parametr_name="S_DESC",Parametr_value=s.desc},
                       new Parameters(){ Parametr_name="S_CALCULATION",Parametr_value=s.calculation.ToString()},
                       new Parameters(){ Parametr_name="S_U_ID",Parametr_value=conn.getUserId().ToString() },
                    };
                id = conn.dbExecute(INS_SERVICE, "ITM_SERVICE", "INS");
            }
            else
            {
                List<Parameters> UPD_SERVICE = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="S_SG_ID",Parametr_value=s.groupId.ToString() },
                       new Parameters(){ Parametr_name="S_NAME",Parametr_value=s.name },
                       new Parameters(){ Parametr_name="S_UNIT",Parametr_value= s.unitId.ToString() },
                       new Parameters(){ Parametr_name="S_PRICE_ON_REQUEST",Parametr_value= s.priceOnRequest.ToString() },
                       new Parameters(){ Parametr_name="S_PRICE",Parametr_value= s.price.ToString()},
                       new Parameters(){ Parametr_name="S_DESC",Parametr_value=s.desc},
                       new Parameters(){ Parametr_name="S_CALCULATION",Parametr_value=s.calculation.ToString()},
                    };
                conn.dbExecute(UPD_SERVICE, "ITM_SERVICE", "UPD", id, "S_ID");
            }
            SettingsDataBind sdtb = new SettingsDataBind();
            return sdtb.GetSettingsReturnData(id, "service");
        }
        public string ProposalTemplateOperation(ProposalTemplate pt)
        {
            int id = pt.id;
            if (id == 0)
            {
                List<Parameters> INS_PROPOSALTEMPLATE = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="PT_TITLE",Parametr_value=pt.title },
                       new Parameters(){ Parametr_name="PT_U_ID",Parametr_value=conn.getUserId().ToString() },
                       new Parameters(){ Parametr_name="PT_PRICING_OPE",Parametr_value=pt.groupPricing.ToString() },
                       new Parameters(){ Parametr_name="PT_STATUS",Parametr_value="1" },
                    };
                id = conn.dbExecute(INS_PROPOSALTEMPLATE, "LED_PROPOSAL_TEMPLATE", "INS");
                foreach (var st in pt.steps)
                {
                    int stepid = st.id;
                    if (st.status == 1)
                    {
                        List<Parameters> INS_PROPOSAL_TEMPLATE_STEP = new List<Parameters>()
                        {
                           new Parameters(){ Parametr_name="PTS_PT_ID",Parametr_value=id.ToString() },
                           new Parameters(){ Parametr_name="PTS_NAME",Parametr_value=st.name },
                           new Parameters(){ Parametr_name="PTS_FACTORS",Parametr_value=st.factors },
                           new Parameters(){ Parametr_name="PTS_STATUS",Parametr_value="1" },
                           new Parameters(){ Parametr_name="PTS_ORDERBY",Parametr_value=st.orderby.ToString() },
                           new Parameters(){ Parametr_name="PTS_U_ID",Parametr_value=conn.getUserId().ToString() },
                        };
                        stepid = conn.dbExecute(INS_PROPOSAL_TEMPLATE_STEP, "LED_PROPOSAL_TEMPLATE_STEP", "INS");
                    }

                    foreach (var std in st.stepdetails)
                    {
                        if (std.status == 1)
                        {
                            List<Parameters> INS_PROPOSAL_TEMPLATE_STEP_D = new List<Parameters>()
                            {
                               new Parameters(){ Parametr_name="PTSD_PTS_ID",Parametr_value=stepid.ToString() },
                               new Parameters(){ Parametr_name="PTSD_TYPE",Parametr_value=std.type.ToString() },
                               new Parameters(){ Parametr_name="PTSD_ITEM_SERVICE",Parametr_value=std.itemservice.ToString() },
                               new Parameters(){ Parametr_name="PTSD_QTY_OPE",Parametr_value= std.qtyope.ToString() },
                               new Parameters(){ Parametr_name="PTSD_VISIBLE_OPE",Parametr_value=std.visibleope.ToString() },
                               new Parameters(){ Parametr_name="PTSD_STATUS",Parametr_value="1" },
                               new Parameters(){ Parametr_name="PTSD_U_ID",Parametr_value=conn.getUserId().ToString() },
                               new Parameters(){ Parametr_name="PTSD_ORDERBY",Parametr_value=std.orderby.ToString() },
                            };
                            conn.dbExecute(INS_PROPOSAL_TEMPLATE_STEP_D, "LED_PROPOSAL_TEMPLATE_STEP_D", "INS");
                        }
                    }
                }

            }
            else
            {
                List<Parameters> UPD_PROPOSALTEMPLATE = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="PT_TITLE",Parametr_value=pt.title },
                         new Parameters(){ Parametr_name="PT_PRICING_OPE",Parametr_value=pt.groupPricing.ToString() },
                    };
                conn.dbExecute(UPD_PROPOSALTEMPLATE, "LED_PROPOSAL_TEMPLATE", "UPD", id, "PT_ID");
                foreach (var st in pt.steps)
                {
                    int stepid = st.id;
                    if (st.status == 1)
                    {
                        List<Parameters> INS_PROPOSAL_TEMPLATE_STEP = new List<Parameters>()
                        {
                           new Parameters(){ Parametr_name="PTS_PT_ID",Parametr_value=id.ToString() },
                           new Parameters(){ Parametr_name="PTS_NAME",Parametr_value=st.name },
                           new Parameters(){ Parametr_name="PTS_FACTORS",Parametr_value=st.factors },
                           new Parameters(){ Parametr_name="PTS_STATUS",Parametr_value="1" },
                           new Parameters(){ Parametr_name="PTS_ORDERBY",Parametr_value=st.orderby.ToString() },
                           new Parameters(){ Parametr_name="PTS_U_ID",Parametr_value=conn.getUserId().ToString() },
                        };
                        stepid = conn.dbExecute(INS_PROPOSAL_TEMPLATE_STEP, "LED_PROPOSAL_TEMPLATE_STEP", "INS");
                    }
                    else if (st.status == 0)
                    {
                        List<Parameters> UPD_PROPOSAL_TEMPLATE_STEP = new List<Parameters>()
                        {
                           new Parameters(){ Parametr_name="PTS_NAME",Parametr_value=st.name },
                           new Parameters(){ Parametr_name="PTS_FACTORS",Parametr_value=st.factors },
                           new Parameters(){ Parametr_name="PTS_ORDERBY",Parametr_value=st.orderby.ToString() },
                        };
                        conn.dbExecute(UPD_PROPOSAL_TEMPLATE_STEP, "LED_PROPOSAL_TEMPLATE_STEP", "UPD", stepid, "PTS_ID");
                    }
                    else
                    {
                        List<Parameters> DEL_PROPOSAL_TEMPLATE_STEP = new List<Parameters>()
                        {
                           new Parameters(){ Parametr_name="PTS_STATUS",Parametr_value="-1" },
                        };
                        conn.dbExecute(DEL_PROPOSAL_TEMPLATE_STEP, "LED_PROPOSAL_TEMPLATE_STEP", "UPD", stepid, "PTS_ID");
                    }

                    foreach (var std in st.stepdetails)
                    {
                        if (std.status == 1)
                        {
                            List<Parameters> INS_PROPOSAL_TEMPLATE_STEP_D = new List<Parameters>()
                            {
                               new Parameters(){ Parametr_name="PTSD_PTS_ID",Parametr_value=stepid.ToString() },
                               new Parameters(){ Parametr_name="PTSD_TYPE",Parametr_value=std.type.ToString() },
                               new Parameters(){ Parametr_name="PTSD_ITEM_SERVICE",Parametr_value=std.itemservice.ToString() },
                               new Parameters(){ Parametr_name="PTSD_QTY_OPE",Parametr_value= std.qtyope.ToString() },
                               new Parameters(){ Parametr_name="PTSD_VISIBLE_OPE",Parametr_value=std.visibleope.ToString() },
                               new Parameters(){ Parametr_name="PTSD_STATUS",Parametr_value="1" },
                               new Parameters(){ Parametr_name="PTSD_U_ID",Parametr_value=conn.getUserId().ToString() },
                               new Parameters(){ Parametr_name="PTSD_ORDERBY",Parametr_value=std.orderby.ToString() },
                            };
                            conn.dbExecute(INS_PROPOSAL_TEMPLATE_STEP_D, "LED_PROPOSAL_TEMPLATE_STEP_D", "INS");
                        }
                        else if (std.status == 0)
                        {
                            List<Parameters> UPD_PROPOSAL_TEMPLATE_STEP_D = new List<Parameters>()
                            {
                               new Parameters(){ Parametr_name="PTSD_PTS_ID",Parametr_value=stepid.ToString() },
                               new Parameters(){ Parametr_name="PTSD_TYPE",Parametr_value=std.type.ToString() },
                               new Parameters(){ Parametr_name="PTSD_ITEM_SERVICE",Parametr_value=std.itemservice.ToString() },
                               new Parameters(){ Parametr_name="PTSD_QTY_OPE",Parametr_value= std.qtyope.ToString() },
                               new Parameters(){ Parametr_name="PTSD_VISIBLE_OPE",Parametr_value=std.visibleope.ToString() },
                               new Parameters(){ Parametr_name="PTSD_ORDERBY",Parametr_value=std.orderby.ToString() },
                            };
                            conn.dbExecute(UPD_PROPOSAL_TEMPLATE_STEP_D, "LED_PROPOSAL_TEMPLATE_STEP_D", "UPD", std.id, "PTSD_ID");
                        }
                        else
                        {
                            List<Parameters> DEL_PROPOSAL_TEMPLATE_STEP_D = new List<Parameters>()
                            {
                               new Parameters(){ Parametr_name="PTSD_STATUS",Parametr_value="-1" },
                            };
                            conn.dbExecute(DEL_PROPOSAL_TEMPLATE_STEP_D, "LED_PROPOSAL_TEMPLATE_STEP_D", "UPD", std.id, "PTSD_ID");
                        }
                    }
                }
            }
            SettingsDataBind sdtb = new SettingsDataBind();
            return sdtb.GetSettingsReturnData(id, "proposalTemplate");
        }
        public string ProjectTypeOperation(ProjectType pt)
        {
            int id = pt.id;
            if (id == 0)
            {
                List<Parameters> INS_PROJECTTYPE = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="PT_NAME",Parametr_value=pt.name },
                       new Parameters(){ Parametr_name="PT_STATUS",Parametr_value="1" },
                       new Parameters(){ Parametr_name="PT_ORDERBY",Parametr_value= "0" },
                    };
                id = conn.dbExecute(INS_PROJECTTYPE, "LED_PROJECT_TYPE", "INS");
            }
            else
            {
                List<Parameters> UPD_PROJECTTYPE = new List<Parameters>()
                    {
                      new Parameters(){ Parametr_name="PT_NAME",Parametr_value=pt.name },
                    };
                conn.dbExecute(UPD_PROJECTTYPE, "LED_PROJECT_TYPE", "UPD", id, "PT_ID");
            }
            SettingsDataBind sdtb = new SettingsDataBind();
            return sdtb.GetSettingsReturnData(id, "projectType");
        }
        public string SourceOperation(Source s)
        {
            int id = s.id;
            if (id == 0)
            {
                List<Parameters> INS_SOURCE = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="SRC_NAME",Parametr_value=s.name },
                       new Parameters(){ Parametr_name="SRC_STATUS",Parametr_value="1" },
                       new Parameters(){ Parametr_name="SRC_ORDERBY",Parametr_value= "0" },
                    };
                id = conn.dbExecute(INS_SOURCE, "LED_SOURCE", "INS");
            }
            else
            {
                List<Parameters> UPD_SOURCE = new List<Parameters>()
                    {
                      new Parameters(){ Parametr_name="SRC_NAME",Parametr_value=s.name },
                    };
                conn.dbExecute(UPD_SOURCE, "LED_SOURCE", "UPD", id, "SRC_ID");
            }
            SettingsDataBind sdtb = new SettingsDataBind();
            return sdtb.GetSettingsReturnData(id, "source");
        }
        public string ActivityOperation(Activity act)
        {
            int id = act.id;
            if (id == 0)
            {
                List<Parameters> INS_ACTIVITY = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="LAT_NAME",Parametr_value=act.name },
                       new Parameters(){ Parametr_name="LAT_COLOR",Parametr_value=act.color.ToString() },
                       new Parameters(){ Parametr_name="LAT_STATUS",Parametr_value= "1" },
                       new Parameters(){ Parametr_name="LAT_ORDERBY",Parametr_value= "0" },
                       new Parameters(){ Parametr_name="LAT_DEFAULT_DURATION",Parametr_value=((act.defaultDurationDay*24)+act.defaultDurationHour).ToString() },
                       new Parameters(){ Parametr_name="LAT_DEFAULT_DURATION_MINUTE",Parametr_value=act.defaultDurationMinute.ToString() },
                       new Parameters(){ Parametr_name="LAT_DEFAULT_REMINDER",Parametr_value= act.defaultReminder.ToString() },
                    };
                id = conn.dbExecute(INS_ACTIVITY, "LED_ACTIVITY_TYPE", "INS");
            }
            else
            {
                List<Parameters> UPD_ACTIVITY = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="LAT_NAME",Parametr_value=act.name },
                       new Parameters(){ Parametr_name="LAT_COLOR",Parametr_value=act.color.ToString() },
                       new Parameters(){ Parametr_name="LAT_DEFAULT_DURATION",Parametr_value=((act.defaultDurationDay*24)+act.defaultDurationHour).ToString() },
                       new Parameters(){ Parametr_name="LAT_DEFAULT_DURATION_MINUTE",Parametr_value=act.defaultDurationMinute.ToString() },
                       new Parameters(){ Parametr_name="LAT_DEFAULT_REMINDER",Parametr_value= act.defaultReminder.ToString() },
                    };
                conn.dbExecute(UPD_ACTIVITY, "LED_ACTIVITY_TYPE", "UPD", id, "LAT_ID");
            }
            SettingsDataBind sdtb = new SettingsDataBind();
            return sdtb.GetSettingsReturnData(id, "activity");
        }
        public string SaveRole(UserRole role)
        {
            int id = role.id;
            if (id == 0)
            {
                List<Parameters> INS_ROLE = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="UT_NAME",Parametr_value=role.name},
                       new Parameters(){ Parametr_name="UT_TYPE",Parametr_value="1"},
                       new Parameters(){ Parametr_name="UT_STATUS",Parametr_value="1"},
                       new Parameters(){ Parametr_name="UT_ORDERBY",Parametr_value="1"},
                       new Parameters(){ Parametr_name="UT_U_ID",Parametr_value=conn.getUserId().ToString()},
                    };
                id = conn.dbExecute(INS_ROLE, "SYS_USER_TYPE", "INS");
            }
            else
            {
                List<Parameters> UPD_ROLE = new List<Parameters>()
                {
                       new Parameters(){ Parametr_name="UT_NAME",Parametr_value=role.name},
                };
                conn.dbExecute(UPD_ROLE, "SYS_USER_TYPE", "UPD", role.id, "UT_ID");
            }
            foreach (var mn in role.menus)
            {
                string query = @"DELETE FROM SYS_MENU_USER_TYPE WHERE MUT_M_ID=" + mn.id + " AND MUT_UT_ID=" + id;
                conn.dbRun(query);
                if (mn.status)
                {
                    List<Parameters> UPD_MENU_PERMISSION = new List<Parameters>()
                                {
                                   new Parameters(){ Parametr_name="MUT_M_ID",Parametr_value=mn.id.ToString()},
                                   new Parameters(){ Parametr_name="MUT_UT_ID",Parametr_value=id.ToString()},
                                   new Parameters(){ Parametr_name="MUT_STATUS",Parametr_value="1"},
                                   new Parameters(){ Parametr_name="MUT_CREATED_BY",Parametr_value=conn.getUserId().ToString()},
                                };
                    conn.dbExecute(UPD_MENU_PERMISSION, "SYS_MENU_USER_TYPE", "INS");

                    foreach (var sbm in mn.subMenus)
                    {
                        query = @"DELETE FROM SYS_MENU_USER_TYPE WHERE MUT_M_ID=" + sbm.id + " AND MUT_UT_ID=" + id;
                        conn.dbRun(query);

                        List<Parameters> UPD_SUBMENU_PERMISSION = new List<Parameters>()
                                {
                                   new Parameters(){ Parametr_name="MUT_M_ID",Parametr_value=sbm.id.ToString()},
                                   new Parameters(){ Parametr_name="MUT_UT_ID",Parametr_value=id.ToString()},
                                   new Parameters(){ Parametr_name="MUT_STATUS",Parametr_value="1"},
                                   new Parameters(){ Parametr_name="MUT_CREATED_BY",Parametr_value=conn.getUserId().ToString()},
                                   new Parameters(){ Parametr_name="MUT_SEE_OWN",Parametr_value=sbm.seeOwn.ToString()},
                                   new Parameters(){ Parametr_name="MUT_SEE_ALL",Parametr_value=sbm.seeAll.ToString()},
                                };
                        conn.dbExecute(UPD_SUBMENU_PERMISSION, "SYS_MENU_USER_TYPE", "INS");
                    }
                }
            }
            SettingsDataBind sdtb = new SettingsDataBind();
            return sdtb.GetSettingsReturnData(id, "role");
        }

        public string SavePresentationOperation(Presentation pre)
        {
            int id = pre.id;
            if (id == 0)
            {
                List<Parameters> INS_PRESENTATION = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="LPR_NAME",Parametr_value=pre.name.ToString() },
                       new Parameters(){ Parametr_name="LPR_TYPE",Parametr_value="Lead" },
                       new Parameters(){ Parametr_name="LPR_DESCRIPTION",Parametr_value=pre.desc },
                       new Parameters(){ Parametr_name="LPR_FILE",Parametr_value=pre.file.ToString() },
                       new Parameters(){ Parametr_name="LPR_U_ID",Parametr_value=conn.getUserId().ToString() },
                       new Parameters(){ Parametr_name="LPR_STATUS",Parametr_value="1" },
                    };
                conn.dbExecute(INS_PRESENTATION, "LED_PRESENTATIONS", "INS");
            }
            else
            {
                List<Parameters> UPD_PRESENTATION = new List<Parameters>()
                    {
                       new Parameters(){ Parametr_name="LPR_NAME",Parametr_value=pre.name.ToString() },
                       new Parameters(){ Parametr_name="LPR_DESCRIPTION",Parametr_value=pre.desc },
                       new Parameters(){ Parametr_name="LPR_FILE",Parametr_value=pre.file.ToString() }
                    };
                conn.dbExecute(UPD_PRESENTATION, "LED_PRESENTATIONS", "UPD", id, "LPR_ID");
            }
            //SettingsDataBind sdtb = new SettingsDataBind();
            //return sdtb.GetSettingsReturnData(id, "activity");
            return "[]";
        }
    }
}
