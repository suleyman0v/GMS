using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Giraffe.Helpers.Layout;
using Giraffe.Helpers.Lead;
using Giraffe.Model.Global;
using Giraffe.Helpers.Settings;
using Giraffe.Model.Layout;
using Giraffe.Model.Lead;
using Giraffe.Utilities;
using Giraffe.Model.Settings;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Giraffe.Helpers.Global;
using Giraffe.Model.Auth;
using Giraffe.Helpers.Users;
using DinkToPdf.Contracts;
using Giraffe.Helpers.Customer;
using Giraffe.Helpers.Job;
using Giraffe.Model.Job;

namespace Giraffe.Controllers
{
    [Produces("application/json")]
    [Authorize]
    public class ApiController : Controller
    {
        private IConverter _converter { get; }
        public ApiController(IConverter converter)
        {
            _converter = converter;
        }
        #region Global
        [HttpPost]
        [RequestSizeLimit(52428800)]
        [Route("Global/UploadFile/")]
        public async Task<IActionResult> UploadFile(FileUpload fileUpload)
        {
            List<Files> files = await FileOperation.UploadFile(fileUpload);
            return Ok(files);
        }
        [HttpPost]
        [Route("Global/ChangeStatus/")]
        public IActionResult ChangeStatus([FromBody] Status changeStatus)
        {
            GlobalDataBind gdb = new GlobalDataBind();
            return Content(gdb.ChangeStatus(changeStatus), "application/json");
        }
        [HttpPost]
        [Route("Global/SetBulkActions/")]
        public IActionResult SetBulkActions([FromBody] BulkActions bulkActions)
        {
            GlobalDataBind gdb = new GlobalDataBind();
            return Content(gdb.SetBulkActions(bulkActions), "application/json");
        }
        [HttpPost]
        [Route("/Global/CalendarDateUpd")]
        public string CalendarDateUpd([FromBody] CalendarDateUpdate calendarUpd)
        {
            LeadDataOption dop = new LeadDataOption();
            return dop.CalendarDateUpd(calendarUpd);
        }
 
        
        [HttpGet]
        [Route("Global/GetSpecodes/{type?}")]
        public IActionResult GetSpecodes(string type)
        {
            GlobalDataBind dtb = new GlobalDataBind();
            return Content(dtb.GetSpecodes(type), "application/json");
        }

        [HttpGet]
        [Route("Global/GetMailTemplate/{type?}/{id?}")]
        public IActionResult GetMailTemplate(string type,int id)
        {
            GlobalDataBind dtb = new GlobalDataBind();
            return Content(dtb.GetMailTemplate(type, id), "application/json");
        }
        [HttpGet]
        [Route("Global/GetPresentations/{type?}")]
        public IActionResult GetPresentations(string type)
        {
            GlobalDataBind dtb = new GlobalDataBind();
            return Content(dtb.GetPresentations(type), "application/json");
        }
        [HttpPost]
        [Route("Global/HtmlToPdf")]
        public byte[] HtmlToPdf([FromBody] HtmlToPdf htmlPdf)
        {
            GlobalDataBind dtb = new GlobalDataBind();
            return dtb.HtmlToPdf(htmlPdf, _converter);
        }
        [HttpGet]
        [Route("Global/CheckPageOpe/{page?}")]
        public IActionResult CheckPageOpe(string page)
        {
            GlobalDataBind dtb = new GlobalDataBind();
            return Content(dtb.CheckPageOpe(page), "application/json");
        }
        #endregion

        #region Layout
        [HttpGet]
        [Route("Layout/GetMenus")]
        public IActionResult GetMenus()
        {
            LayoutDataBind dtb = new LayoutDataBind();
            return Content(dtb.GetMenus(), "application/json");
        }
        [HttpGet]
        [Route("Layout/GetFavoritetMenus")]
        public IActionResult GetFavoritetMenus()
        {
            LayoutDataBind dtb = new LayoutDataBind();
            return Content(dtb.GetFavoritetMenus(), "application/json");
        }
        [HttpPost]
        [Route("Layout/MenuOperation")]
        public IActionResult MenuOperation([FromBody]SubMenu m)
        {
            LayoutDataOption dop = new LayoutDataOption();
            return Content(dop.MenuOperation(m), "application/json");
        }
        #endregion
        #region Lead
        [HttpGet]
        [Route("Lead/GetCustomerData/{count?}/{searchText?}")]
        public IActionResult GetCustomerData(int count, string searchText)
        {
            LeadDataBind dtb = new LeadDataBind();
            return Content(dtb.GetCustomerData(count, searchText), "application/json");
        }
        [HttpGet]
        [Route("Lead/GetLeadData/{tab?}/{filter?}")]
        public IActionResult GetLeadData(int tab,string filter)
        {
            LeadDataBind dtb = new LeadDataBind();
            return Content(dtb.GetLeadData(tab, filter), "application/json");
        }
        [HttpGet]
        [Route("Lead/GetLeadDetail/{id?}")]
        public IActionResult GetLeadDetail(int id)
        {
            LeadDataBind dtb = new LeadDataBind();
            return Content(dtb.GetLeadDetail(id), "application/json");
        }
        [HttpGet]
        [Route("Lead/GetLeadReturnActivities/{id?}")]
        public IActionResult GetLeadReturnActivities(int id)
        {
            LeadDataBind dtb = new LeadDataBind();
            return Content(dtb.GetLeadReturnActivities(id), "application/json");
        }
        [HttpGet]
        [Route("Lead/GetLeadReturnProposal/{id?}/{proposal?}")]
        public IActionResult GetLeadReturnProposal(int id,int proposal)
        {
            LeadDataBind dtb = new LeadDataBind();
            return Content(dtb.GetLeadReturnProposal(id, proposal), "application/json");
        }
        [HttpGet]
        [Route("Lead/GetSearchLead/{count?}/{size?}/{searchtext?}")]
        public IActionResult GetSearchLead(int count, int size, string searchtext)
        {
            LeadDataBind dtb = new LeadDataBind();
            return Content(dtb.GetSearchLead(count,size, searchtext), "application/json");
        }
        [HttpPost]
        [Route("Lead/LeadOperation")]
        public IActionResult LeadOperation([FromBody]Leads l)
        {
            LeadDataOption dop = new LeadDataOption();
            return Content(dop.LeadOperation(l), "application/json");
        }
        [HttpGet]
        [Route("Lead/GetLeadCalendarEvent/{id?}")]
        public IActionResult GetLeadCalendarEvent(int id)
        {
            LeadDataBind dtb = new LeadDataBind();
            return Content(dtb.GetLeadCalendarEvent(id), "application/json");
        }
        [HttpPost]
        [Route("/Lead/SendProposalMail")]
        public string SendProposalMail([FromBody] LeadProposalMail lpm)
        {
            LeadDataOption dop = new LeadDataOption();
            return dop.SendProposalMail(lpm);
        }
        #endregion
        #region Lead Activity
        [HttpGet]
        [Route("Lead/GetActivityDetail/{id?}")]
        public IActionResult GetActivityDetail(int id)
        {
            LeadDataBind dtb = new LeadDataBind();
            return Content(dtb.GetActivityDetail(id), "application/json");
        }
        [HttpPost]
        [Route("Lead/LeadActivityOperation")]
        public IActionResult LeadActivityOperation([FromBody]LeadActivity la)
        {
            LeadDataOption dop = new LeadDataOption();
            return Content(dop.LeadActivityOperation(la), "application/json");
        }
        [HttpGet]
        [Route("Lead/GetProposalDetail/{id?}/{lead?}")]
        public IActionResult GetProposalDetail(int id, int lead)
        {
            LeadDataBind dtb = new LeadDataBind();
            return Content(dtb.GetProposalDetail(id, lead), "application/json");
        }
        [HttpGet]
        [Route("Lead/GetProposalTemplateData/{id?}")]
        public IActionResult GetProposalTemplateData(int id)
        {
            LeadDataBind dtb = new LeadDataBind();
            return Content(dtb.GetProposalTemplateData(id), "application/json");
        }
        
        [HttpPost]
        [Route("Lead/LeadProposalOperation")]
        public IActionResult LeadProposalOperation([FromBody]LeadProposal lp)
        {
            LeadDataOption dop = new LeadDataOption();
            return Content(dop.LeadProposalOperation(lp), "application/json");
        }
        [HttpGet]
        [Route("Lead/LeadCheckActivity/{startDate?}/{duration?}/{acid?}")]
        public IActionResult LeadCheckActivity(string startDate, int duration,int acid)
        {
            LeadDataBind dtb = new LeadDataBind();
            return Content(dtb.LeadCheckActivity(startDate, duration, acid), "application/json");
        }

        [HttpGet]
        [Route("Lead/LeadCheckCalendarActivity/{startDate?}/{endDate?}/{acid?}")]
        public IActionResult LeadCheckCalendarActivity(string startDate, string endDate,int acid)
        {
            LeadDataBind dtb = new LeadDataBind();
            return Content(dtb.LeadCheckCalendarActivity(startDate, endDate, acid), "application/json");
        }

        [HttpGet]
        [Route("Lead/GetFilterModalData/{type?}")]
        public IActionResult GetFilterModalData(string type)
        {
            LeadDataBind dtb = new LeadDataBind();
            return Content(dtb.GetFilterModalData(type), "application/json");
        }

        [HttpGet]
        [Route("Lead/GetFilterSavedModalData/{id?}/{type?}")]
        public IActionResult GetFilterSavedModalData(int id,string type)
        {
            LeadDataBind dtb = new LeadDataBind();
            return Content(dtb.GetFilterSavedModalData(id,type), "application/json");
        }


        [HttpPost]
        [Route("Lead/LeadFilterOperation")]
        public IActionResult LeadFilterOperation([FromBody] LeadFilters filter)
        {
            LeadDataOption dop = new LeadDataOption();
            return Content(dop.LeadFilterOperation(filter), "application/json");
        }
        #endregion
        #region Settings
        [HttpGet]
        [Route("Settings/GetUserData/{type?}")]
        public IActionResult GetUserData(int type)
        {
            SettingsDataBind dtb = new SettingsDataBind();
            return Content(dtb.GetUserData(type), "application/json");
        }
        [HttpGet]
        [Route("Settings/GetSettingsViewData/{type?}")]
        public IActionResult GetSettingsViewData(string type)
        {
            SettingsDataBind dtb = new SettingsDataBind();
            return Content(dtb.GetSettingsViewData(type), "application/json");
        }
        [HttpGet]
        [Route("Settings/GetSettingsEditData/{id?}/{type?}")]
        public IActionResult GetSettingsEditData(int id, string type)
        {
            SettingsDataBind dtb = new SettingsDataBind();
            return Content(dtb.GetSettingsEditData(id,type), "application/json");
        }
        [HttpGet]
        [Route("Settings/GetItemServiceGroup/{type?}")]
        public IActionResult GetItemServiceGroup(int type)
        {
            SettingsDataBind dtb = new SettingsDataBind();
            return Content(dtb.GetItemServiceGroup(type), "application/json");
        }
        [HttpGet]
        [Route("Settings/GetItemService/{count?}/{size?}/{type?}/{group?}/{searchtxt?}")]
        public IActionResult GetItemService(int count, int size, int type, int group,string searchtxt)
        {
            SettingsDataBind dtb = new SettingsDataBind();
            return Content(dtb.GetItemService(count,size,type,group, searchtxt), "application/json");
        }
        [HttpGet]
        [Route("Settings/GetPresentationEditData/{id?}")]
        public IActionResult GetPresentationEditData(int id)
        {
            SettingsDataBind dtb = new SettingsDataBind();
            return Content(dtb.GetPresentationEditData(id), "application/json");
        }
        [HttpPost]
        [Route("Settings/UserOperation")]
        public IActionResult UserOperation([FromBody] UserSettings u)
        {
            SettingsDataOption dtb = new SettingsDataOption();
            return Content(dtb.UserOperation(u), "application/json");
        }
        [HttpPost]
        [Route("Settings/ItemGroupOperation")]
        public IActionResult ItemGroupOperation([FromBody] ItemGroup ig)
        {
            SettingsDataOption dtb = new SettingsDataOption();
            return Content(dtb.ItemGroupOperation(ig), "application/json");
        }
        [HttpPost]
        [Route("Settings/ServiceGroupOperation")]
        public IActionResult ServiceGroupOperation([FromBody] ServiceGroup sg)
        {
            SettingsDataOption dtb = new SettingsDataOption();
            return Content(dtb.ServiceGroupOperation(sg), "application/json");
        }
        [HttpPost]
        [Route("Settings/ItemOperation")]
        public IActionResult ItemOperation([FromBody] Item i)
        {
            SettingsDataOption dtb = new SettingsDataOption();
            return Content(dtb.ItemOperation(i), "application/json");
        }
        [HttpPost]
        [Route("Settings/ServiceOperation")]
        public IActionResult ServiceOperation([FromBody] Service s)
        {
            SettingsDataOption dtb = new SettingsDataOption();
            return Content(dtb.ServiceOperation(s), "application/json");
        }
        [HttpPost]
        [Route("Settings/ProposalTemplateOperation")]
        public IActionResult ProposalTemplateOperation([FromBody] ProposalTemplate pt)
        {
            SettingsDataOption dtb = new SettingsDataOption();
            return Content(dtb.ProposalTemplateOperation(pt), "application/json");
        }
        [HttpPost]
        [Route("Settings/ProjectTypeOperation")]
        public IActionResult ProjectTypeOperation([FromBody] ProjectType pt)
        {
            SettingsDataOption dtb = new SettingsDataOption();
            return Content(dtb.ProjectTypeOperation(pt), "application/json");
        }
        [HttpPost]
        [Route("Settings/SourceOperation")]
        public IActionResult SourceOperation([FromBody] Source s)
        {
            SettingsDataOption dtb = new SettingsDataOption();
            return Content(dtb.SourceOperation(s), "application/json");
        }
        [HttpPost]
        [Route("Settings/ActivityOperation")]
        public IActionResult ActivityOperation([FromBody] Activity act)
        {
            SettingsDataOption dtb = new SettingsDataOption();
            return Content(dtb.ActivityOperation(act), "application/json");
        }
        [HttpPost]
        [Route("Settings/SaveRole")]
        public IActionResult SaveRole([FromBody] UserRole role)
        {
            SettingsDataOption dtb = new SettingsDataOption();
            return Content(dtb.SaveRole(role), "application/json");
        }

        [HttpPost]
        [Route("Settings/SavePresentationOperation")]
        public IActionResult SavePresentationOperation([FromBody] Presentation pre)
        {
            SettingsDataOption dtb = new SettingsDataOption();
            return Content(dtb.SavePresentationOperation(pre), "application/json");
        }

        #endregion
        #region User
        [HttpPost]
        [Route("User/ChangeUserStatus/")]
        public IActionResult ChangeUserStatus([FromBody] Status changeStatus)
        {
            UserDataBind gdb = new UserDataBind();
            return Content(gdb.ChangeUserStatus(changeStatus), "application/json");
        }
        [HttpPost]
        [Route("User/SetUserBulkActions/")]
        public IActionResult SetUserBulkActions([FromBody] BulkActions bulkActions)
        {
            UserDataBind gdb = new UserDataBind();
            return Content(gdb.SetUserBulkActions(bulkActions), "application/json");
        }

        [HttpGet]
        [Route("User/GetUserEditData/{id?}/{type?}")]
        public IActionResult GetUserEditData(int id, string type)
        {
            UserDataBind dtb = new UserDataBind();
            return Content(dtb.GetUserEditData(id, type), "application/json");
        }

        [HttpGet]
        [Route("User/GetUserStaticData/{type?}/{id?}/{email?}")]
        public IActionResult GetUserStaticData(string type,int id, string email)
        {
            UserDataBind dtb = new UserDataBind();
            return Content(dtb.GetUserStaticData(type,id, email), "application/json");
        }

        [HttpPost]
        [Route("User/SaveUser")]
        public IActionResult SaveUser([FromBody] SysUser user)
        {
            UserDataOption udo = new UserDataOption();
            return Content(udo.SaveUser(user), "application/json");
        }
        #endregion
        #region Customers
        [HttpGet]
        [Route("Customer/GetCustomersData/{tab?}")]
        public IActionResult GetCustomersData(int tab)
        {
            CustomerDataBind dtb = new CustomerDataBind();
            return Content(dtb.GetCustomersData(tab), "application/json");
        }
        #endregion
        #region Jobs
        [HttpGet]
        [Route("Job/GetJobsData/{type?}")]
        public IActionResult GetJobsData(int type)
        {
            JobDataBind dtb = new JobDataBind();
            return Content(dtb.GetJobsData(type), "application/json");
        }
        [HttpGet]
        [Route("Job/GetJobDetail/{id?}")]
        public IActionResult GetJobDetail(int id)
        {
            JobDataBind dtb = new JobDataBind();
            return Content(dtb.GetJobDetail(id), "application/json");
        }

        [HttpPost]
        [Route("Job/JobOperation")]
        public IActionResult JobOperation([FromBody] Jobs job)
        {
            JobDataOption udo = new JobDataOption();
            return Content(udo.JobOperation(job), "application/json");
        }
        #endregion
    }
}
