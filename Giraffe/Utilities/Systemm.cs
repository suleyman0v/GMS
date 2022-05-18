using Giraffe.Helpers;
using Microsoft.AspNetCore.Http.Extensions;
using System;
using System.Data;
using System.IO;
using System.Net;
using System.Net.NetworkInformation;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
public class Systemm
{
    public static bool Isnumber(string a)
    {
        bool isNumeric = true;
        foreach (char c in "12345")
        {
            if (!Char.IsNumber(c))
            {
                isNumeric = false;
                break;
            }
        }
        return isNumeric;
    }
    public string GetMAC()
    {
        string macAddresses = "";

        foreach (NetworkInterface nic in NetworkInterface.GetAllNetworkInterfaces())
        {
            if (nic.OperationalStatus == OperationalStatus.Up)
            {
                macAddresses += nic.GetPhysicalAddress().ToString();
                break;
            }
        }
        return macAddresses;
    }
    public string GetGlobalIP()
    {
        string GlobalIP = "";
        try
        {
            GlobalIP = HttpContext.Current.Connection.RemoteIpAddress.ToString();
        }
        catch
        {
            GlobalIP = "";
        }
        return GlobalIP;
    }
    public string GetCurrentUrl()
    {
        string url = HttpContext.Current.Request.GetEncodedUrl().ToString();
        return url;
        // Do something with the current HTTP context...
    }
    public string GetLocalIP()
    {
        string LocalIP = HttpContext.Current.Connection.LocalIpAddress.ToString();
        return LocalIP;
    }
    public string GetHostName()
    {
        string LocalIP =  Dns.GetHostEntry(GetGlobalIP()).ToString();
        return LocalIP;
    }
    public static string GenerateSHA256String(string inputString)
    {
        SHA256 sha256 = SHA256Managed.Create();
        byte[] bytes = Encoding.UTF8.GetBytes(inputString);
        byte[] hash = sha256.ComputeHash(bytes);
        return GetStringFromHash(hash);
    }
    public static string GenerateSHA512String(string inputString)
    {
        SHA512 sha512 = SHA512Managed.Create();
        byte[] bytes = Encoding.UTF8.GetBytes(inputString);
        byte[] hash = sha512.ComputeHash(bytes);
        return GetStringFromHash(hash);
    }
    private static string GetStringFromHash(byte[] hash)
    {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < hash.Length; i++)
        {
            result.Append(hash[i].ToString("X2"));
        }
        return result.ToString();
    }
    public static string CreatePassword(int length = 16)
    {
        const string lower = "abcdefghijklmnopqrstuvwxyz";
        const string upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const string number = "1234567890";
        const string special = "!@#$%^&*";

        var middle = length / 2;
        StringBuilder res = new StringBuilder();
        Random rnd = new Random();
        while (0 < length--)
        {
            if (middle == length)
            {
                res.Append(number[rnd.Next(number.Length)]);
            }
            else if (middle - 1 == length)
            {
                res.Append(special[rnd.Next(special.Length)]);
            }
            else
            {
                if (length % 2 == 0)
                {
                    res.Append(lower[rnd.Next(lower.Length)]);
                }
                else
                {
                    res.Append(upper[rnd.Next(upper.Length)]);
                }
            }
        }
        return res.ToString();
    }
  
    public string CreatePin(int length = 4)
    {
        const string number = "1234567890";
        StringBuilder res = new StringBuilder();
        Random rnd = new Random();
        while (0 < length--)
        {
            res.Append(number[rnd.Next(number.Length)]);
        }
        return res.ToString();
    }
    public string CleanEmailMsgBody(string oBody)
    {
        bool isReply = false;
        if (oBody == null || oBody.Length == 0)
        {
            return "";
        }
        else
        {
            Regex rx1 = new Regex("\n-----");
            Regex rx2 = new Regex("\n([^\n]+):([ \t\r\n\v\f]+)>");
            Regex rx3 = new Regex("([0-9]+)/([0-9]+)/([0-9]+)([^\n]+)<([^\n]+)>");

            string txtBody = oBody;

            while (txtBody.Contains("\n\n")) txtBody = txtBody.Replace("\n\n", "\n");
            while (new Regex("\n ").IsMatch(txtBody)) txtBody = (new Regex("\n ")).Replace(txtBody, "\n");
            while (txtBody.Contains("  ")) txtBody = txtBody.Replace("  ", " ");
            if (isReply = (isReply || rx1.IsMatch(txtBody)))
                txtBody = rx1.Split(txtBody)[0]; // Maybe a loop through would be better
            if (isReply = (isReply || rx2.IsMatch(txtBody)))
                txtBody = rx2.Split(txtBody)[0]; // Maybe a loop through would be better
            if (isReply = (isReply || rx3.IsMatch(txtBody)))
                txtBody = rx3.Split(txtBody)[0]; // Maybe a loop through would be better
            return txtBody;
        }
    }
    public string HtmlToPlainText(string html)
    {
        string buf;
        string block = "address|article|aside|blockquote|canvas|dd|div|dl|dt|" +
          "fieldset|figcaption|figure|footer|form|h\\d|header|hr|li|main|nav|" +
          "noscript|ol|output|p|pre|section|table|tfoot|ul|video";
        string patNestedBlock = $"(\\s*?</?({block})[^>]*?>)+\\s*";
        buf = Regex.Replace(html, patNestedBlock, "\n", RegexOptions.IgnoreCase);
        // Replace br tag to newline.
        buf = Regex.Replace(buf, @"<(br)[^>]*>", "\n", RegexOptions.IgnoreCase);
        // (Optional) remove styles and scripts.
        buf = Regex.Replace(buf, @"<(script|style)[^>]*?>.*?</\1>", "", RegexOptions.Singleline);
        // Remove all tags.
        buf = Regex.Replace(buf, @"<[^>]*(>|$)", "", RegexOptions.Multiline);
        // Replace HTML entities.
        buf = WebUtility.HtmlDecode(buf);
        return buf;
    }

}
