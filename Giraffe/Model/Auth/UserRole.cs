using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Giraffe.Model.Auth
{
    public class UserRole
    {
        [Required]
        public int id { get; set; }
        public string name { get; set; }
        public List<MenuPermission> menus { get; set; }
    }

    public class MenuPermission
    {
        [Required]
        public int id { get; set; }
        public string caption { get; set; }
        public List<SubMenuPermission> subMenus { get; set; }
        public bool status { get; set; }
    }
    public class SubMenuPermission
    {
        [Required]
        public int id { get; set; }
        public string caption { get; set; }
        public bool seeOwn { get; set; }
        public bool seeAll { get; set; }
    }
}



