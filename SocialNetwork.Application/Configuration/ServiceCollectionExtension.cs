using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace SocialNetwork.Application.Configuration
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection ConfigureApplication(this IServiceCollection services)
        {
            services.AddMediatR(Assembly.GetExecutingAssembly());

            return services;
        }
    }
}
