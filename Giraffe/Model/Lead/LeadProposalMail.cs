using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Lead
{
    public class LeadProposalMail
    {
        public int leadId { get; set; }
        public int proposalId { get; set; }
        public int customer { get; set; }
        public string subject { get; set; }
        public string message { get; set; }
        public string to { get; set; }
        public string cc { get; set; }
    }
}
