using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Settings
{
    public class ProposalTemplate
    {
        [Required]
        public int id { get; set; }
        public string title { get; set; }
        public int groupPricing { get; set; }

        public List<ProposalTemplateSteps> steps { get; set; }
    }
    public class ProposalTemplateSteps
    {
        [Required]
        public int id { get; set; }
        public string name { get; set; }
        public string factors { get; set; }
        public int orderby { get; set; }
        public int status { get; set; }
        public List<ProposalTemplateStepsD> stepdetails { get; set; }
    }
    public class ProposalTemplateStepsD
    {
        [Required]
        public int id { get; set; }
        public int type { get; set; }
        public int itemservice { get; set; }
        public bool qtyope { get; set; }
        public bool visibleope { get; set; }
        public int status { get; set; }
        public int orderby { get; set; }
    }
}
