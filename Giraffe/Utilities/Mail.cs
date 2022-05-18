using Giraffe.Helpers.Global;
using Giraffe.Model.Lead;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Giraffe.Utilities
{
    public class Mail
    {
        public bool SendMail(string to, string subject, string message, List<string> CC, string replyMail, bool replyFunction = true)
        {
            String sReplyToadd = replyMail;
            try
            {
                GlobalDataBind gdb = new GlobalDataBind();
                var mi = gdb.GetGeneralInfoList()[0];
                using (MailMessage mm = new MailMessage())
                {
                    mm.Subject = subject;
                    mm.Body = message;
                    mm.IsBodyHtml = true;
                    for (int i = 0; i < CC.Count; i++)
                    {
                        if (CC[i].ToString() != "")
                        {
                            mm.CC.Add(CC[i].ToString());
                        }
                    }
                    SmtpClient smtp = new SmtpClient();
                    smtp.Host = mi.server;
                    NetworkCredential NetworkCred = new NetworkCredential(mi.mail, mi.password);
                    mm.From = new MailAddress(mi.mail, mi.username);
                    if (replyFunction)
                    {
                        mm.ReplyToList.Add(sReplyToadd);
                    }
                    mm.To.Add(to);
                    smtp.UseDefaultCredentials = true;
                    smtp.Credentials = NetworkCred;
                    smtp.EnableSsl = true;
                    smtp.Port = mi.port;
                    smtp.Send(mm);
                }
                return true;
            }
            catch (Exception ex)
            {
                string a = "";
                a = ex.Message.ToString();
                return false;
            }
        }
        public bool SystemSendMail(string to, string subject, string message, List<string> CC, string replyMail, bool replyFunction = true)
        {
            String sReplyToadd = replyMail;
            try
            {
                GlobalDataBind gdb = new GlobalDataBind();
                var mi = gdb.GetSystemGeneralInfoList()[0];
                using (MailMessage mm = new MailMessage())
                {
                    mm.Subject = subject;
                    mm.Body = message;
                    mm.IsBodyHtml = true;
                    for (int i = 0; i < CC.Count; i++)
                    {
                        if (CC[i].ToString() != "")
                        {
                            mm.CC.Add(CC[i].ToString());
                        }
                    }
                    SmtpClient smtp = new SmtpClient();
                    smtp.Host = mi.server;
                    NetworkCredential NetworkCred = new NetworkCredential(mi.mail, mi.password);
                    mm.From = new MailAddress(mi.mail, mi.username);
                    if (replyFunction)
                    {
                        mm.ReplyToList.Add(sReplyToadd);
                    }
                    mm.To.Add(to);
                    smtp.UseDefaultCredentials = true;
                    smtp.Credentials = NetworkCred;
                    smtp.EnableSsl = true;
                    smtp.Port = mi.port;
                    smtp.Send(mm);
                }
                return true;
            }
            catch (Exception ex)
            {
                string a = "";
                a = ex.Message.ToString();
                return false;
            }
        }
    }
}
