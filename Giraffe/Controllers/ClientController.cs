using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Giraffe.Helpers.Client;
using Giraffe.Model.Client;
using Giraffe.Utilities;
using Giraffe.Model.Global;

namespace Giraffe.Controllers
{
    [Produces("application/json")]
    public class ClientController : Controller
    {
        #region Proposal
        [HttpGet]
        [Route("Client/GetProposalData/{id?}/{cmpn?}/{code?}")]
        public IActionResult GetProposal(int id,int cmpn, string code)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            IActionResult response = Unauthorized();
            ClientDataBind cdb = new ClientDataBind();
            return Content(cdb.ClientProposal(id, cmpn, code), "application/json");
        }

        [HttpPost]
        [Route("Client/ClientProposalSave")]
        public IActionResult ClientProposalSave([FromBody] ClientProposal cp)
        {if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            IActionResult response = Unauthorized();
            ClientDataOption cdp = new ClientDataOption();
            return Content(cdp.ClientProposalSave(cp), "application/json");
        }
        #endregion Proposal
        #region Lead
        [HttpGet]
        [Route("Client/GetWebLeadData/{cmpn?}")]
        public IActionResult ClientLead(int cmpn)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            IActionResult response = Unauthorized();
            ClientDataBind cdb = new ClientDataBind();
            return Content(cdb.ClientLead(cmpn), "application/json");
        }

        [HttpPost]
        [Route("Client/ClientWebLeadData")]
        public IActionResult ClientWebLeadData([FromBody] ClientWebLead cwl)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            IActionResult response = Unauthorized();
            ClientDataOption cdp = new ClientDataOption();
            return Content(cdp.ClientWebLeadData(cwl), "application/json");
        }

        [HttpPost]
        [RequestSizeLimit(52428800)]
        [Route("Client/UploadFile/")]
        public async Task<IActionResult> UploadFile(FileUpload fileUpload)
        {
            List<ClientFiles> files = await FileOperation._UploadFile(fileUpload);
            return Ok(files);
        }
        #endregion Lead
    }
}
