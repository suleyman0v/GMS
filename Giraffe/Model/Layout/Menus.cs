using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Layout
{
    public class Menus
    {
        [Required]
        public int id { get; set; }
        [Required]
        public string name { get; set; }
        [Required]
        public string icon { get; set; }
        [Required]
        public string css { get; set; }
        [Required]
        public string url { get; set; }
        [Required]
        public int? targetope { get; set; }
        [Required]
        public int? subtype { get; set; }
        [Required]
        public int? favoritetope { get; set; }
        public List<SubMenu> submenus { get; set; }
    }
    public class SubMenu
    {
        [Required]
        public int id { get; set; }
        [Required]
        public string name { get; set; }
        [Required]
        public string icon { get; set; }
        [Required]
        public string css { get; set; }
        [Required]
        public string url { get; set; }
        [Required]
        public int? targetope { get; set; }
        [Required]
        public int? subtype { get; set; }
        [Required]
        public int? favoritetope { get; set; }
        public string ope { get; set; }
    }
}
