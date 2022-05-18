using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Job
{
    public class Jobs
    {
        public int id { get; set; }
        public string name { get; set; }
        public int tid { get; set; }
        public int sid { get; set; }
        public int status { get; set; }
    }
}
