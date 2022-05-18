using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Model.Global
{
    public class FileUpload
    {
        [Required]
        public string type { set; get; }
        public int company { set; get; }
        public IFormCollection collection { get; set; }
    }
}
