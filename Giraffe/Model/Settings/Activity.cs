using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Settings
{
    public class Activity
    {
        [Required]
        public int id { get; set; }
        public string name { get; set; }
        public int color { get; set; }
        public int orderby { get; set; }
        public int defaultDurationDay { get; set; }
        public int defaultDurationHour { get; set; }
        public int defaultDurationMinute { get; set; }
        public int defaultReminder { get; set; }
    }
}
