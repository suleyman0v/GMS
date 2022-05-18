using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Client
{
    public class ClientWebLead
    {
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string phone { get; set; }
        public string cellPhone { get; set; }
        public string email { get; set; }
        public string city { get; set; }
        public string zipCode { get; set; }
        public string note { get; set; }
        public object budget { get; set; }
        public object closedDate { get; set; }
        public string openDate { get; set; }
        public string street { get; set; }
        public string stateProvince { get; set; }
        public string company { get; set; }
        public int projectType { get; set; }
        public string opportunityTitle { get; set; }
        public int saleProbality { get; set; }
        public int source { get; set; }
        public int status { get; set; }
        public string projectStreet { get; set; }
        public string projectZipCode { get; set; }
        public string projectCityTown { get; set; }
        public string projectStateProvince { get; set; }
        public int owner { get; set; }
        public List<ClientFiles> fileObj { get; set; }
        public int cmpn { get; set; }
    }
}
