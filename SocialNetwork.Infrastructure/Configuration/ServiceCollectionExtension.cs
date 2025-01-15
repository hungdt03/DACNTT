using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Domain.Entity;
using SocialNetwork.Infrastructure.DBContext;
using SocialNetwork.Infrastructure.Options;
using SocialNetwork.Infrastructure.Persistence.Interceptors;
using SocialNetwork.Infrastructure.Persistence.Repository;
using SocialNetwork.Infrastructure.JsonWebToken;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SocialNetwork.Infrastructure.Cloudinary;
using SocialNetwork.Infrastructure.SignalR;
using StackExchange.Redis;
using SocialNetwork.Application.Interfaces.Services.Redis;
using SocialNetwork.Infrastructure.Redis;
using SocialNetwork.Infrastructure.Mailkit;

namespace SocialNetwork.Infrastructure.Configuration
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection ConfigureInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            // Registry Options Pattern
            services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));
            services.Configure<CloudinaryOptions>(configuration.GetSection(nameof(CloudinaryOptions)));
            services.Configure<EmailOptions>(configuration.GetSection(nameof(EmailOptions)));

            // Register repository
            services.AddScoped<ISaveChangesInterceptor, AuditEntityInterceptor>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IPostRepository, PostRepository>();
            services.AddScoped<ICommentRepository, CommentRepository>();
            services.AddScoped<IReactionRepository, ReactionRepository>();
            services.AddScoped<IPostMediaRepository, PostMediaRepository>();
            services.AddScoped<IFriendShipRepository, FriendShipRepository>();
            services.AddScoped<INotificationRepository, NotificationRepository>();
            services.AddScoped<ITagRepository, TagRepository>();
            services.AddScoped<IChatRoomMemberRepository, ChatRoomMemberRepository>();
            services.AddScoped<IChatRoomRepository, ChatRoomRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<IStoryRepository, StoryRepository>();
            services.AddScoped<IMessageReadStatusRepository, MessageReadStatusRepository>();
            services.AddScoped<IViewerRepository, ViewerRepository>();
            services.AddScoped<IFollowRepository, FollowRepository>();
            services.AddScoped<IMessageMediaRepository, MessageMediaRepository>();
            services.AddScoped<IOTPRepository, OTPRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            services.AddSingleton<IConnectionMultiplexer>(sp =>
            {
                var redisOptions = new RedisOptions();
                configuration.GetSection(nameof(RedisOptions)).Bind(redisOptions);
                return ConnectionMultiplexer.Connect(redisOptions.ConnectionStrings);
            });

            // Dependency injection

            services.AddScoped<IUserStatusService, UserStatusService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<ISignalRService, SignalRService>();
            services.AddScoped<ICloudinaryService, CloudinaryService>();
            services.AddScoped<IMailkitService, MailkitService>();

            services.AddSingleton<ConnectionManager>();


            // Register DbContext 
            services.AddDbContext<AppDbContext>((serviceProvider, options) =>
            {
                var interceptor = serviceProvider.GetRequiredService<ISaveChangesInterceptor>();
                options.AddInterceptors(interceptor);
                options.UseSqlServer(configuration.GetConnectionString("MyDbConnection"));
            });

            // Register Identity
            services.AddIdentity<User, IdentityRole>()
                .AddEntityFrameworkStores<AppDbContext>()
                .AddDefaultTokenProviders();

            services.Configure<IdentityOptions>(options =>
            {
                options.Tokens.PasswordResetTokenProvider = TokenOptions.DefaultProvider;
            });

            // Set lifeTime of reset token
            services.Configure<DataProtectionTokenProviderOptions>(options =>
            {
                options.TokenLifespan = TimeSpan.FromMinutes(10);
            });

            services.Configure<IdentityOptions>(options => {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 6;
                options.Password.RequiredUniqueChars = 1;

                options.User.AllowedUserNameCharacters =
                    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
            });

            // Register Authentication (JWT)
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = configuration["JwtOptions:Issuer"],
                        ValidateAudience = true,
                        ValidAudience = configuration["JwtOptions:Audience"],
                        ValidateIssuerSigningKey = true,
                        ValidateLifetime = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtOptions:SecretKey"]!))
                    };


                    // Hanlde SignalR Event with JWT in header
                    options.Events = new JwtBearerEvents
                    {
                       
                        OnMessageReceived = context =>
                        {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;
                            if (!string.IsNullOrEmpty(accessToken)
                                && path.StartsWithSegments("/serverHub"))
                            {
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }

                    };

                });

           
            return services;

        }
    }
}
