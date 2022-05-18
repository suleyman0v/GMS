using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace System.Web
{
    public static class HttpContext
    {
        private static IHttpContextAccessor _contextAccessor;
        private static ISession _session => _contextAccessor.HttpContext.Session;
        public static Microsoft.AspNetCore.Http.HttpContext Current => _contextAccessor.HttpContext;

        internal static void Configure(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
        }

        public static void SetString(string key, string value)
        {
            _session.SetString(key, value);
        }
        public static void Session_remove()
        {
            _session.Clear();
        }
        public static string GetString(string key)
        {
            return _session.GetString(key);
        }
    }


    public static class StaticHttpContextExtensions
    {
        public static void AddHttpContextAccessor(this IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        }

        public static IApplicationBuilder UseStaticHttpContext(this IApplicationBuilder app)
        {
            var httpContextAccessor = app.ApplicationServices.GetRequiredService<IHttpContextAccessor>();
            System.Web.HttpContext.Configure(httpContextAccessor);
            return app;
        }
    }
}