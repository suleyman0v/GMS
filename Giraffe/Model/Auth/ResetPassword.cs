using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Auth
{
    public class ResetPassword
    {
        [Required]
        public string password { get; set; }
        [Required]
        public string token { get; set; }
    }
}
