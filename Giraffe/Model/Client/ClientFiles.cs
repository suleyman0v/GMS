using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Client
{
    public class ClientFiles
    {
        public int id { get; set; }
        public string name { get; set; }
        public int size { get; set; }
        public string type { get; set; }
        public string url { get; set; }
        public string error { get; set; }
        public int ope { get; set; }
    }
}
