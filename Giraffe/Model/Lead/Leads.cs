using Giraffe.Model.Global;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Lead
{
    public class Leads
    {
        [Required]
        public int id { get; set; }
        public Customer customerObj { get; set; }
        public General generalObj { get; set; }
        public Owner ownerObj { get; set; }
        public List<Files> fileObj { get; set; }
    }
    public class Customer
    {
        [Required]
        public int id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string company { get; set; }
        public string city { get; set; }
        public string phone { get; set; }
        public string cellPhone { get; set; }
        [EmailAddress]
        public string email { get; set; }
        public string street { get; set; }
        public string stateProvince { get; set; }
        public string zipCode { get; set; }
    }
    public class General
    {
        public string opportunity { get; set; }
        public string closedDate { get; set; }
        public string openDate { get; set; }
        public int? estSaleRevenue { get; set; }
        public int projectType { get; set; }
        public int saleProbality { get; set; }
        public int source { get; set; }
        public int status { get; set; }
        public string projectStreet { get; set; }
        public string projectZipCode { get; set; }
        public string projectCityTown { get; set; }
        public string projectStateProvince { get; set; }
        public string note { get; set; }
    }
    public class Owner
    {
        public int owner { get; set; }
        public List<Assigner> assigner { get; set; }

    }
    public class Assigner
    {
        [Required]
        public int id { get; set; }
        public string img { get; set; }
        public string name { get; set; }
    }
}
