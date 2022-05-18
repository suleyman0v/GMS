using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Global
{
    public class GeneralInfo
    {
        public int id { set; get; }
        public string mail { set; get; }
        public string server { set; get; }
        public string username { set; get; }
        public string password { set; get; }
        public int port { set; get; }
    }
}
