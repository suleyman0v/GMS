using Giraffe.Model.Layout;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Giraffe.Helpers.Layout
{
    public class LayoutDataBind
    {
        public string GetMenus()
        {
            string sql = @"SP_MENUS @USER=" + conn.getUserId() + ",@MENU=0, @TYPE='MENU'";
            List<Menus> menus = new List<Menus>();
            foreach (DataRow dt in conn.dbRun(sql).Rows)
            {
                sql = @"SP_MENUS @USER=" + conn.getUserId() + ",@MENU=" + int.Parse(dt["id"].ToString()) + ", @TYPE='SUBMENU'";
                List<SubMenu> submenus = new List<SubMenu>();
                foreach (DataRow dtr in conn.dbRun(sql).Rows)
                {
                    submenus.Add(new SubMenu()
                    {
                        id = int.Parse(dtr["id"].ToString()),
                        name = dtr["name"].ToString(),
                        icon = dtr["icon"].ToString(),
                        css = dtr["css"].ToString(),
                        url = dtr["url"].ToString(),
                        targetope = int.Parse(dtr["targetope"].ToString()),
                        subtype = int.Parse(dtr["subtype"].ToString()),
                        favoritetope = int.Parse(dtr["favoritetope"].ToString()),
                    });
                }
                menus.Add(new Menus()
                {
                    id = int.Parse(dt["id"].ToString()),
                    name = dt["name"].ToString(),
                    icon = dt["icon"].ToString(),
                    css = dt["css"].ToString(),
                    url = dt["url"].ToString(),
                    targetope = int.Parse(dt["targetope"].ToString()),
                    subtype = int.Parse(dt["subtype"].ToString()),
                    submenus = submenus,
                });
            }
            return JsonConvert.SerializeObject(menus);
        }
        public string GetFavoritetMenus()
        {
            string sql = @"SP_MENUS @USER=" + conn.getUserId() + ",@MENU=0, @TYPE='PIN'";
            List<Menus> menus = new List<Menus>();
            foreach (DataRow dt in conn.dbRun(sql).Rows)
            {
                menus.Add(new Menus()
                {
                    id = int.Parse(dt["id"].ToString()),
                    name = dt["name"].ToString(),
                    icon = dt["icon"].ToString(),
                    css = dt["css"].ToString(),
                    url = dt["url"].ToString(),
                    targetope = int.Parse(dt["targetope"].ToString()),
                });
            }
            return JsonConvert.SerializeObject(menus);
        }
    }
}
