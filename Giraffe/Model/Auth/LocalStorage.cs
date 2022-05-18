using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Auth
{
    public class LocalStorage
    {
        public int id { get; set; }
        public string email { get; set; }
        public string lastName { get; set; }
        public string firstName { get; set; }
        public string imgPath { get; set; }
        public string companyImage{ get; set; }
        public string companyName { get; set; }
    }
}
