using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Settings
{
    public class UserSettings
    {
        public int ope { get; set; }
        [Required]
        public string lastName { get; set; }
        [Required]
        public string firstName { get; set; }
        [Required]
        [EmailAddress]
        public string email { get; set; }
        [Required]
        public string oldPassword { get; set; }
        [Required]
        public string newPassword { get; set; }
        [Required]
        [Compare(nameof(newPassword))]
        public string confirmPassword { get; set; }
        public string phone { get; set; }
        public string imgPath { get; set; }
    }
}
