using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Lead
{
    public class LeadFilters
    {
        public int id { get; set; }
        public string name { get; set; }
        public string filters { get; set; }
        public int isDefault { get; set; }
    }
}
