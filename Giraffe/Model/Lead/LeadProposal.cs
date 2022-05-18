using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Lead
{
    public class LeadProposal
    {
        public int id { get; set; }
        [Required]
        public string title { get; set; }
        public string deadline { get; set; }
        public bool pricingOpe { get; set; }
        public string note  { get; set; }
        public int template { get; set; }
        public int leadId { get; set; }
        public string discount { get; set; }
        public string taxRate { get; set; }
        public string signatureImage { get; set; }
        public string ope { get; set; }
        public int discountReason { get; set; }
        public float total { get; set; }
        public List<LeadProposalSteps> steps { get; set; }

    }
    public class LeadProposalSteps
    {
        public int id { get; set; }
        public string name { get; set; }
        public string factorSave { get; set; }
        public float? factorValue { get; set; }
        public int orderBy { get; set; }
        public List<LeadProposalStepDetail> details { get; set; }
    }

    public class LeadProposalStepDetail
    {
        public int id { get; set; }
        public int itemType { get; set; }
        public int itemId { get; set; }
        public string itemName { get; set; }
        public string itemDesc { get; set; }
        public int unitId { get; set; }
        public float qty { get; set; }
        public float price { get; set; }
        public bool priceOnRequestOpe { get; set; }
        public bool qtyOpe { get; set; }
        public bool visibleOpe { get; set; }
        public bool calcOpe { get; set; }
        public string calcObj { get; set; }
        public int orderBy { get; set; }

    }

}
