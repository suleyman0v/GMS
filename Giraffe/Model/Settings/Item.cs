using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Settings
{
    public class Item
    {
        [Required]
        public int id { get; set; }
        [Required]
        public int groupId { get; set; }
        public string name { get; set; }
        public int unitId { get; set; }
        public bool priceOnRequest { get; set; }
        public string price { get; set; }
        public string desc { get; set; }
        public bool calculation { get; set; }
    }
}
