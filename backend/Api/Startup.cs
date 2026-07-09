using HTT.Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Text;

namespace Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            CurrentEnvironment = env;
            ConnectionString = Configuration.GetConnectionString("DefaultConnection").ToString();
            QLTKConnection = Configuration.GetConnectionString("QTHTConnection").ToString();
            PageSize = Convert.ToInt32(Configuration.GetValue<string>("Pagination:PageSize"));
            SupperAdmin = Configuration.GetValue<string>("Authentication:SupperAdmin");
            AuthMethod = Convert.ToInt32(Configuration.GetValue<string>("Authentication:AuthMethod"));
        }

        public IConfiguration Configuration { get; }
        private IWebHostEnvironment CurrentEnvironment { get; set; }
        public static string ConnectionString = "";
        public static string QLTKConnection = "";
        public const string Cors_WithOrigins_Development = "Cors_WithOrigins_Development";
        public const string Cors_WithOrigins_Production = "Cors_WithOrigins_Production";
        public static int PageSize = 10;
        public static int AuthMethod = 0;
        public static string SupperAdmin = "";
        public static int IsLocal = 0;

        //const configure key
        public const string Cfg_DefaultConnection = "DefaultConnection";
        public const string Cfg_QTHTConnection = "QTHTConnection";
        public const string Cfg_Idp_Address = "Idp_Address";
        public const string Cfg_Idp_Audience = "Idp_Audience";
        public const string Cfg_Idp_MetadataAddress = "Idp_MetadataAddress";
        public const string Cfg_Cors_WithOrigins_Development = "Cors_WithOrigins_Development";
        public const string Cfg_Cors_WithOrigins_Production = "Cors_WithOrigins_Production";

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("RestrictiveCORS", builder =>
                {
                    builder.WithOrigins("https://trusted-domain.com", "https://another-trusted-domain.com")
                           .WithMethods("GET", "POST") // Hạn chế HTTP methods
                           .WithHeaders("Content-Type", "Authorization"); // Hạn chế header
                });
            });

            services.AddControllers();

            services.AddControllersWithViews();
            services.AddControllers().AddNewtonsoftJson();
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            });
            //db setting
            services.AddDbContext<HTT_Context>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString(Cfg_DefaultConnection));
                options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            });
            services.AddDbContext<QTHT_HTT_Context>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString(Cfg_QTHTConnection));
                options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            });

            // accepts any access token issued by identity server
            //https://github.com/sa-es-ir/AspNetMultipleAuth/blob/master/MultipleAuthSample/DIExtension.cs
            services
                //.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                // .AddJwtBearer(options =>
                // {
                //     options.MetadataAddress = Configuration.GetSection(Cfg_Idp_Address).Value + Configuration.GetSection(Cfg_Idp_MetadataAddress).Value;
                //     options.Audience = Configuration.GetSection(Cfg_Idp_Audience).Value;
                // });
                .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddPolicyScheme(JwtBearerDefaults.AuthenticationScheme, JwtBearerDefaults.AuthenticationScheme, option =>
            {
                option.ForwardDefaultSelector = context =>
                {
                    var jwtHandler = new JwtSecurityTokenHandler();
                    var token = context.Request.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
                    if (!string.IsNullOrEmpty(token) && jwtHandler.CanReadToken(token))
                    {
                        var tokenIssuer = jwtHandler.ReadJwtToken(token).Issuer;

                        if (tokenIssuer != Configuration["JWT:Issuer"])
                            return "Scheme_WSO2";
                        else
                            return "Scheme_HTT";
                    }
                    return "Scheme_WSO2";
                };
            })
            .AddJwtBearer("Scheme_WSO2", options =>
            {
                //options.MetadataAddress = Configuration.GetSection(Cfg_Idp_Address).Value + Configuration.GetSection(Cfg_Idp_MetadataAddress).Value;
                //options.Audience = Configuration.GetSection(Cfg_Idp_Audience).Value;
                //options.Authority = "https://10.1.15.146:9443/oauth2/authorize";
                //options.Audience = "6fV_ucUWf5yqFqk3ys1VpQnLDKga";
                options.Authority = Configuration.GetSection(Cfg_Idp_Address).Value + "oauth2/authorize";
                options.Audience = Configuration.GetSection(Cfg_Idp_Audience).Value;
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
                    //ValidIssuer = "https://10.1.15.146:9443/oauth2/token",
                    //ValidAudience = "6fV_ucUWf5yqFqk3ys1VpQnLDKga",
                    ValidIssuer = Configuration.GetSection(Cfg_Idp_Address).Value + "oauth2/token",
                    ValidAudience = Configuration.GetSection(Cfg_Idp_Audience).Value,
                    RequireSignedTokens = false
                };

                // đoạn này dùng để xem bug của Authentication
                options.IncludeErrorDetails = true;
                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = async ctx =>
                    {
                        var putBreakpointHere = true;
                        var exceptionMessage = ctx.Exception;
                    },
                };
            })
            .AddJwtBearer("Scheme_HTT", options =>
            {
                var Key = Encoding.UTF8.GetBytes(Configuration["JWT:SecurityKey"]);
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = Configuration["JWT:Issuer"],
                    ValidAudience = Configuration["JWT:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Key)
                };
            });

            // adds
            services.AddControllersWithViews()
                 .AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
             );
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "HTT API",
                    Version = "v1",
                    Description = "HTT API"
                });
            });
            services.AddCors(options =>
            {
                // this defines a CORS policy called "default"
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
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.Use(async (context, next) =>
            {
                context.Features.Get<IHttpMaxRequestBodySizeFeature>().MaxRequestBodySize = null; // Remove limit
                await next.Invoke();
            });

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedProto
            });
            //Mo chay cho publish
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API HTT V11");
                });
            }
            else
            {
                app.UseHsts();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API HTT V1");
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
            app.UseCors("default");
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}