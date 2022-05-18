using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Client
{
    public class ClientProposal
    {
        public int leadId { get; set; }
        public int proposalId { get; set; }
        public string code { get; set; }
        public int cmp { get; set; }
        public int status { get; set; }
        public string signatureImage { get; set; }
    }
}
