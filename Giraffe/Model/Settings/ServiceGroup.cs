using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Settings
{
    public class ServiceGroup
    {
        [Required]
        public int id { get; set; }
        public string name { get; set; }
        public string desc { get; set; }
    }
}
