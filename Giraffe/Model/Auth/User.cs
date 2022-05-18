using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Auth
{
    public class User
    {
        public int id { get; set; }
        [Required]
        [EmailAddress]
        public string email { get; set; }
        [Required]
        public string password { get; set; }
        public string lastName { get; set; }
        public string firstName { get; set; }
        public string image { get; set; }
        public int typeid { get; set; }
        public string position { get; set; }
        public string connStr { get; set; }
        public int companyId { get; set; }
        public string fileFolder { get; set; }
        public string companyImage { get; set; }
        public string companyName { get; set; }

    }
}
