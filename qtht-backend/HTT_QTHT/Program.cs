using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;
using HTT_QTHT.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.AspNetCore.Http.Features;

namespace Api
{
    public class Program
    {
        public static string ConnectionString { get; private set; }
        public static string QTHTConnection { get; private set; }
        public static string NghiepVuConnection { get; private set; }
        public static int PageSize { get; private set; }
        public static string SupperAdmin { get; private set; }
        public static int AuthMethod { get; private set; }

        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((context, config) =>
                {
                    var Configuration = config.Build();
                    ConnectionString = Configuration.GetConnectionString("DefaultConnection");
                    QTHTConnection = Configuration.GetConnectionString("QTHTConnection");
                    NghiepVuConnection = Configuration.GetConnectionString("NghiepVuConnection");
                    PageSize = Convert.ToInt32(Configuration.GetValue<string>("Pagination:PageSize"));
                    SupperAdmin = Configuration.GetValue<string>("Authentication:SupperAdmin");
                    AuthMethod = Convert.ToInt32(Configuration.GetValue<string>("Authentication:AuthMethod"));
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.ConfigureServices((context, services) =>
                    {
                        var Configuration = context.Configuration;
                        var CurrentEnvironment = context.HostingEnvironment;

                        services.AddControllers().AddNewtonsoftJson();
                        services.Configure<ForwardedHeadersOptions>(options =>
                        {
                            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
                        });
                        services.AddDbContext<HTT_Context>(options =>
                            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));
                        services.AddDbContext<QTHT_HTT_Context>(options =>
                            options.UseSqlServer(Configuration.GetConnectionString("QTHTConnection")));

                        services.AddHttpClient();

                        // Authentication setup
                        services.AddAuthentication(options =>
                        {
                            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                        })
                        .AddJwtBearer(options =>
                        {
                            options.Authority = Configuration.GetValue<string>("Idp_Address") + "oauth2/authorize";
                            options.Audience = Configuration.GetValue<string>("Idp_Audience");
                            options.RequireHttpsMetadata = true;
                            options.TokenValidationParameters = new TokenValidationParameters
                            {
                                ValidateIssuer = true,
                                ValidateAudience = false,
                                ValidateIssuerSigningKey = false,
                                SignatureValidator = delegate (string token, TokenValidationParameters parameters)
                                {
                                    var jwt = new JsonWebToken(token); // here was JwtSecurityToken
                                    if (parameters.ValidateIssuer && parameters.ValidIssuer != jwt.Issuer)
                                        return null;
                                    return jwt;
                                },
                                ValidIssuer = Configuration.GetValue<string>("Idp_Address") + "oauth2/token",
                                ValidAudience = Configuration.GetValue<string>("Idp_Audience"),
                                RequireSignedTokens = false
                            };

                            // ?o?n này dùng ?? xem bug c?a Authentication
                            options.IncludeErrorDetails = true;
                            options.Events = new JwtBearerEvents
                            {
                                OnAuthenticationFailed = async ctx =>
                                {
                                    var putBreakpointHere = true;
                                    var exceptionMessage = ctx.Exception;
                                },
                            };
                        });

                        // Additional services
                        services.AddControllersWithViews()
                             .AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

                        services.AddSwaggerGen(options =>
                        {
                            options.SwaggerDoc("v1", new OpenApiInfo
                            {
                                Title = "HTT QTHT API",
                                Version = "v1",
                                Description = "HTT QTHT API"
                            });
                        });

                        services.AddCors(options =>
                        {
                            options.AddPolicy("default", policy =>
                            {
                                if (CurrentEnvironment.IsDevelopment())
                                {
                                    policy.AllowAnyOrigin()
                                        .AllowAnyHeader()
                                        .AllowAnyMethod();
                                }
                                else
                                {
                                    policy.AllowAnyOrigin()
                                        .AllowAnyHeader()
                                        .AllowAnyMethod();
                                }
                            });
                        });
                    })
                    .Configure((context, app) =>
                    {
                        var env = context.HostingEnvironment;

                        app.UseForwardedHeaders(new ForwardedHeadersOptions
                        {
                            ForwardedHeaders = ForwardedHeaders.XForwardedProto
                        });

                        if (env.IsDevelopment())
                        {
                            app.UseSwagger();
                            app.UseSwaggerUI(c =>
                            {
                                c.SwaggerEndpoint("/swagger/v1/swagger.json", "API HTT QTHT V1");
                            });
                        }
                        else
                        {
                            app.UseHsts();
                            app.UseSwagger();
                            app.UseSwaggerUI(c =>
                            {
                                c.SwaggerEndpoint("/swagger/v1/swagger.json", "API HTT QTHT V1");
                            });
                        }
                        app.Use(async (context, next) =>
                        {
                            context.Features.Get<IHttpMaxRequestBodySizeFeature>().MaxRequestBodySize = null; // Remove limit
                            await next.Invoke();
                        });
                        app.Use(async (context, next) =>
                        {
                            context.Response.Headers.Add("X-Frame-Options", "DENY");
                            context.Response.Headers.Add("Content-Security-Policy", "default-src 'self';");
                            await next();
                        });
                        app.UseHttpsRedirection();
                        app.UseCors(c => c.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
                        app.UseRouting();
                        app.UseAuthentication();
                        app.UseAuthorization();

                        app.UseEndpoints(endpoints =>
                        {
                            endpoints.MapControllers();
                        });
                    });
                });
    }
}
