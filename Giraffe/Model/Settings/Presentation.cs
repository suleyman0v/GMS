using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Giraffe.Model.Settings
{
    public class Presentation
    {
        public int id { get; set; }
        public string name { get; set; }
        public string desc { get; set; }
        public string type { get; set; }
        public string file { get; set; }

    }
}
