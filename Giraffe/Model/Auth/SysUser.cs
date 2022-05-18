using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Auth
{
    public class SysUser
    {
        public int id { get; set; }
        [Required]
        public string name { get; set; }
        [Required]
        public string lastName { get; set; }
        [Required]
        [EmailAddress]
        public string email { get; set; }
        [Required]
        public int userType { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string password { get; set; }
        public string img { get; set; }
    }
}
