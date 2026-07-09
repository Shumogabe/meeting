using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using QTHT.Api.Models;
using System;

namespace Api
{
    public class Program
    {
        //public static void Main(string[] args)
        //{
        //    BuildWebHost(args).Run();
        //}

        //public static IWebHost BuildWebHost(string[] args) =>
        //    WebHost.CreateDefaultBuilder(args)
        //        .UseStartup<Startup>()
        //        .Build();
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            try
            {
                using (var scope = host.Services.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<QTHT_HTT_Context>();
                    db.Database.Migrate();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Migration Error: " + ex.StackTrace);
            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}