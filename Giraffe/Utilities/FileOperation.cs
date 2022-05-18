//using SixLabors.ImageSharp.Processing.Processors.Quantization;
using Giraffe.Helpers.Client;
using Giraffe.Model.Client;
using Giraffe.Model.Global;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Utilities
{
    public class FileOperation
    {
        public string SaveBase64Img(int uid, string imgbase64, string fileFolder)
        {
            try
            {
                var myfilename = string.Format(@"{0}", Guid.NewGuid());
                string base64 = imgbase64.Split(',')[1];
                string smallPath = "/wwwroot/Files/" + conn.getFolderName() +"/"+ fileFolder;
                string folderPath = System.IO.Directory.GetCurrentDirectory() + smallPath;
                string insertDirection = "Files/" + conn.getFolderName() + "/"+ fileFolder + "/" + myfilename + ".jpg";
                string fullPath = folderPath + "/" + myfilename + ".jpg";
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }
                byte[] bytes = Convert.FromBase64String(base64);
                using (var imageFile = new FileStream(fullPath, FileMode.Create))
                {
                    imageFile.Write(bytes, 0, bytes.Length);
                    imageFile.Flush();
                }
                return insertDirection.ToString();
            }
            catch
            {
                return "Error";
            }
        }

        public async static Task<List<Files>> UploadFile(FileUpload fileUpload)
        {
            List<Files> Attach = new List<Files>();
            var f = fileUpload.collection.Files;
            if (f == null)
            {
                Attach.Add(new Files()
                {
                    error = "Not selected files",
                });
                return Attach;
            }
            else
            {
                foreach (var file in f)
                {
                    try
                    {
                        var myfilename = string.Format(@"{0}", Guid.NewGuid());
                        string smallPath = "/wwwroot/Files/" + conn.getFolderName() + "/" + fileUpload.type;
                        string folderPath = System.IO.Directory.GetCurrentDirectory() + smallPath;
                        string fullPath = folderPath + "/" + myfilename + Path.GetExtension(file.FileName);
                        string savedPath = "Files/" + conn.getFolderName() + "/" + fileUpload.type + "/" + myfilename + Path.GetExtension(file.FileName);
                        if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }
                        Attach.Add(new Files()
                        {
                            name = file.FileName,
                            url = savedPath,
                            size = int.Parse(file.Length.ToString()),
                            type = file.ContentType,
                            ope = 1
                        });
                    }
                    catch (Exception ex)
                    {
                        Attach.Add(new Files()
                        {
                            error = ex.ToString(),
                        });
                        return Attach;
                    }
                }
            }
            return Attach;
        }
        public async static Task<List<ClientFiles>> _UploadFile(FileUpload fileUpload)
        {
            List<ClientFiles> Attach = new List<ClientFiles>();
            var f = fileUpload.collection.Files;
            ClientDataBind cdb = new ClientDataBind();
            string fileFolder = cdb.GetFolderNameById(fileUpload.company);
            if (f == null)
            {
                Attach.Add(new ClientFiles()
                {
                    error = "Not selected files",
                });
                return Attach;
            }
            else
            {
                foreach (var file in f)
                {
                    try
                    {
                        var myfilename = string.Format(@"{0}", Guid.NewGuid());
                        string smallPath = "/wwwroot/Files/" + fileFolder + "/" + fileUpload.type;
                        string folderPath = System.IO.Directory.GetCurrentDirectory() + smallPath;
                        string fullPath = folderPath + "/" + myfilename + Path.GetExtension(file.FileName);
                        string savedPath = "Files/" + fileFolder + "/" + fileUpload.type + "/" + myfilename + Path.GetExtension(file.FileName);
                        if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }
                        Attach.Add(new ClientFiles()
                        {
                            name = file.FileName,
                            url = savedPath,
                            size = int.Parse(file.Length.ToString()),
                            type = file.ContentType,
                            ope = 1
                        });
                    }
                    catch (Exception ex)
                    {
                        Attach.Add(new ClientFiles()
                        {
                            error = ex.ToString(),
                        });
                        return Attach;
                    }
                }
            }
            return Attach;
        }
    }

}
