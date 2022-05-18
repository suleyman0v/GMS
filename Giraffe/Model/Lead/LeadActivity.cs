using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Lead
{
    public class LeadActivity
    {
        public int id { get; set; }
        public int leadId { get; set; }
        public int status { get; set; }
        public string begDate { get; set; }
        public string begTime { get; set; }
        public string description { get; set; }
        public int durationDay { get; set; }
        public int durationHour { get; set; }
        public int durationMinute { get; set; }
        public int reminder { get; set; }
        public int activityTypeId { get; set; }
        public List<Assigner> assigner { get; set; }
        public int followUpActivityType { get; set; }
        public string followUpBegDate { get; set; }
        public string followUpBegTime { get; set; }
        public int followUpDurationDay { get; set; }
        public int followUpDurationHour { get; set; }
        public int followUpDurationMinute { get; set; }
        public string actionType { get; set; }
    }
}
