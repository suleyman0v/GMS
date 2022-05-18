using Giraffe.Controllers;
using Giraffe.Helpers;
using Giraffe.Model.Auth;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Security.Claims;
using System.Threading.Tasks;
public class conn
{
    public static string projectip = GetProjectAddress();
    public static string GetProjectAddress()
    {
        IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
        configurationBuilder.AddJsonFile("AppSettings.json");
        IConfiguration configuration = configurationBuilder.Build();
        string projeectAddress = configuration.GetConnectionString("ProjectAddress");
        return projeectAddress;
    }
    public static int getUserId()
    {
        return int.Parse(HttpContext.Current.User.FindFirst("uid")?.Value.ToString());
    }
    public static int getUserType()
    {
        return int.Parse(HttpContext.Current.User.FindFirst("utype")?.Value.ToString());
    }
    private static string getConnStr()
    {
        return HttpContext.Current.User.FindFirst("connStr")?.Value;
    }
    public static int getCompanyId()
    {
        return int.Parse(HttpContext.Current.User.FindFirst("companyId")?.Value.ToString());
    }
    public static string getFolderName()
    {
        string folderName = HttpContext.Current.User.FindFirst("fileFolder")?.Value;
        return folderName;
    }
    public static DataTable dbRun(string sql)
    {
        DataTable dt = new DataTable();
        using (SqlConnection con = new SqlConnection(getConnStr()))
        {
            var cmd = new SqlCommand(sql, con);
            cmd.Connection.Open();
            cmd.CommandTimeout = 1800;
            var sqlReader = cmd.ExecuteReader();
            dt.Load(sqlReader);
            sqlReader.Close();
            cmd.Connection.Close();
            cmd.Dispose();
            con.Close();
        }
        return dt;
    }
    public static DataTable dbSysRun(string sql, int type = 0)
    {
        DataTable dt = new DataTable();
        using (SqlConnection con = new SqlConnection(login.getConnStr()))
        {
            var cmd = new SqlCommand(sql, con);
            cmd.Connection.Open();
            cmd.CommandTimeout = 1800;
            var sqlReader = cmd.ExecuteReader();
            if (type == 1)
            {
                dt.Load(sqlReader);
            }
            sqlReader.Close();
            cmd.Connection.Close();
            cmd.Dispose();
            con.Close();
        }

        return dt;
    }


    public static IEnumerable<object> GetJson(string sql)
    {
        var retObject = new List<dynamic>();
        using (SqlConnection con = new SqlConnection(getConnStr()))
        {
            var cmd = new SqlCommand(sql, con);
            cmd.Connection.Open();
            cmd.CommandTimeout = 1800;
            var sqlReader = cmd.ExecuteReader();
            while (sqlReader.Read())
            {
                var dataRow = new ExpandoObject() as IDictionary<string, object>;
                for (var iFiled = 0; iFiled < sqlReader.FieldCount; iFiled++)
                    dataRow.Add(
                        sqlReader.GetName(iFiled),
                        sqlReader.IsDBNull(iFiled) ? null : sqlReader[iFiled] // use null instead of {}
                    );
                retObject.Add((ExpandoObject)dataRow);
            }
            sqlReader.Close();
            cmd.Connection.Close();
            cmd.Dispose();
            con.Close();
        }
        return retObject;
    }
    public static int dbExecute(List<Parameters> Parameters, string Tablename, string Operation, int ID, string Field_NAME, bool Transaction = false)
    {
        string query = "";
        string fields = "";
        if (Operation == "UPD")
        {
            foreach (var data in Parameters)
            {
                fields += data.Parametr_name + "=@" + data.Parametr_name + ",";
            }
            fields = fields.Substring(0, fields.Length - 1);
            query = @"UPDATE  " + Tablename +
                " SET " + fields;
            query += @" where (" + Field_NAME + "=" + ID + ");";
        }
        else if (Operation == "DEL")
        {
            query = @"Delete FROM " + Tablename + "  WHERE " + Field_NAME + "=" + ID;
        }
        using (SqlConnection con = new SqlConnection(getConnStr()))
        {
            con.Open();
            using (SqlCommand command = new SqlCommand(query, con))
            {
                if (Transaction == true)
                {
                    SqlTransaction transaction;
                    transaction = con.BeginTransaction();
                    command.Transaction = transaction;
                    foreach (var data in Parameters)
                    {
                        command.Parameters.AddWithValue(data.Parametr_name, data.Parametr_value == "null" ? (object)DBNull.Value : data.Parametr_value);
                    }
                    var sqlreader = command.ExecuteReader();
                    if (sqlreader.Read())
                    {
                        ID = int.Parse(sqlreader["OID"].ToString());
                    }
                    sqlreader.Close();
                    transaction.Commit();
                    command.Connection.Close();
                    command.Dispose();
                }
                else
                {
                    foreach (var data in Parameters)
                    {
                        command.Parameters.AddWithValue(data.Parametr_name, data.Parametr_value == "null" ? (object)DBNull.Value : data.Parametr_value);
                    }
                    var sqlreader = command.ExecuteReader();
                    if (sqlreader.Read())
                    {
                        ID = int.Parse(sqlreader["OID"].ToString());
                    }
                    sqlreader.Close();
                    command.Connection.Close();
                }
            }
        }
        return ID;
    }
    public static int dbExecute(List<Parameters> Parameters, string Tablename, string Operation, bool Transaction = false)
    {
        string query = "";
        string fields = "";
        string pfields = "";
        int ID = -1;
        if (Operation == "INS")
        {
            foreach (var data in Parameters)
            {
                fields += data.Parametr_name + ",";
                pfields += "@" + data.Parametr_name + ",";
            }
            fields = fields.Substring(0, fields.Length - 1);
            pfields = pfields.Substring(0, pfields.Length - 1);

            query = @"INSERT into " + Tablename + "(" + fields + ")";
            query += @"VALUES (" + pfields + ");select SCOPE_IDENTITY() OID;";
        }
        using (SqlConnection con = new SqlConnection(getConnStr()))
        {
            con.Open();
            using (SqlCommand command = new SqlCommand(query, con))
            {
                if (Transaction == true)
                {
                    SqlTransaction transaction;
                    transaction = con.BeginTransaction();
                    command.Transaction = transaction;
                    foreach (var data in Parameters)
                    {
                        command.Parameters.AddWithValue(data.Parametr_name, data.Parametr_value == "null" ? (object)DBNull.Value : data.Parametr_value);
                    }
                    var sqlreader = command.ExecuteReader();
                    if (sqlreader.Read())
                    {
                        ID = int.Parse(sqlreader["OID"].ToString());
                    }
                    sqlreader.Close();
                    transaction.Commit();
                    command.Connection.Close();
                    command.Dispose();
                }
                else
                {
                    foreach (var data in Parameters)
                    {
                        command.Parameters.AddWithValue(data.Parametr_name, data.Parametr_value == "null" ? (object)DBNull.Value : data.Parametr_value);
                    }
                    var sqlreader = command.ExecuteReader();
                    if (sqlreader.Read())
                    {
                        ID = int.Parse(sqlreader["OID"].ToString());
                    }
                    sqlreader.Close();
                    command.Connection.Close();
                    command.Dispose();
                }
            }
            con.Close();
        }
        return ID;
    }

    public static int _dbExecute(List<Parameters> Parameters, string Tablename, string Operation, string connStr)
    {
        string query = "";
        string fields = "";
        string pfields = "";
        int ID = -1;
        if (Operation == "INS")
        {
            foreach (var data in Parameters)
            {
                fields += data.Parametr_name + ",";
                pfields += "@" + data.Parametr_name + ",";
            }
            fields = fields.Substring(0, fields.Length - 1);
            pfields = pfields.Substring(0, pfields.Length - 1);

            query = @"INSERT into " + Tablename + "(" + fields + ")";
            query += @"VALUES (" + pfields + ");select SCOPE_IDENTITY() OID;";
        }
        using (SqlConnection con = new SqlConnection(connStr))
        {
            con.Open();
            using (SqlCommand command = new SqlCommand(query, con))
            {
                
                    foreach (var data in Parameters)
                    {
                        command.Parameters.AddWithValue(data.Parametr_name, data.Parametr_value == "null" ? (object)DBNull.Value : data.Parametr_value);
                    }
                    var sqlreader = command.ExecuteReader();
                    if (sqlreader.Read())
                    {
                        ID = int.Parse(sqlreader["OID"].ToString());
                    }
                    sqlreader.Close();
                    command.Connection.Close();
                    command.Dispose();
            }
            con.Close();
        }
        return ID;
    }
}
