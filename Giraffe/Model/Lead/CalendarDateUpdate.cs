using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Lead
{
    public class CalendarDateUpdate
    {
        public int id { get; set; }
        public string begdate { get; set; }
        public string enddate { get; set; }
        public string ope { get; set; }
    }
}
