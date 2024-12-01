using MediatR;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.API.Extensions;
using SocialNetwork.API.Filters;
using SocialNetwork.API.Middlewares;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Infrastructure.Configuration;
using System.Reflection;

namespace SocialNetwork.API.DI
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection RegisterDependencies(this IServiceCollection services, IConfiguration configuration)
        {
            
            services.ConfigureInfrastructure(configuration);
            services.ConfigureApplication();
            

            services.AddScoped<InputValidationFilter>();
            services.Configure<ApiBehaviorOptions>(options
                => options.SuppressModelStateInvalidFilter = true);
            services.AddTransient<ExceptionHandlerMiddleware>();

            services.AddHttpContextAccessor();

            services.AddMediatR(Assembly.GetExecutingAssembly());

            services.AddCorsPolicy();
            services.AddSwaggerGen();

            return services;
        }
    }
}
