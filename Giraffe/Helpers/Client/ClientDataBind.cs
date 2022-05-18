using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Helpers.Client
{
    public class ClientDataBind
    {

        public static string GetACSConnStr()
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();
            string conn = configuration.GetConnectionString("DefaultConnection");
            return conn;
        }
        public string GetConnStrById(int id) {

            string connStr = GetACSConnStr();
            string sql = "EXEC SP_SYS_COMPANY_INFO @ID=" + id;
            DataTable dt = new DataTable();
            using (SqlConnection con = new SqlConnection(connStr))
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
            return dt.Rows[0]["connStr"].ToString();
        }
        public string GetFolderNameById(int id)
        {

            string connStr = GetACSConnStr();
            string sql = "EXEC SP_SYS_COMPANY_INFO @ID=" + id;
            DataTable dt = new DataTable();
            using (SqlConnection con = new SqlConnection(connStr))
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
            return dt.Rows[0]["fileFolder"].ToString();
        }

        public bool CheckProposalCode(int id, string code, string connStr) {
            string sql = "EXEC SP_CHECK_PROPOSAL_COMFIRMATION @CODE ='" + code + "',@ID=" + id;
            DataTable dt = new DataTable();
            using (SqlConnection con = new SqlConnection(connStr))
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
            if (dt.Rows.Count == 0)
            {
                return false;
            }
            else { 
              return true;
            }
        }
        public string ClientProposal(int id, int company,string code)
        {
            if (id == 0 && company == 0 && code == "") {
                return "[]";
            }
            string connStr = GetConnStrById(company);
            if (connStr == "") {
                return "[]";
            }
            if (CheckProposalCode(id, code, connStr))
            {
                string sql = "EXEC SP_CLIENT_PROPOSAL_DATA @LEAD=" + id;
                DataTable dt = new DataTable();
                using (SqlConnection con = new SqlConnection(connStr))
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
                return dt.Rows[0][0].ToString();
            }
            else {
                return "[]";
            }
        }

        public string ClientLead(int company) {
           
            if (company == 0)
            {
                return "[]";
            }
            string connStr = GetConnStrById(company);
            if (connStr == "")
            {
                return "[]";
            }
                string sql = "SP_WEB_LEAD";
                DataTable dt = new DataTable();
                using (SqlConnection con = new SqlConnection(connStr))
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
                return dt.Rows[0][0].ToString();
        }
    }
}
