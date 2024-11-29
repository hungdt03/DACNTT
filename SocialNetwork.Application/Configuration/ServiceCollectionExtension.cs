using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using SocialNetwork.Application.Behaviors;
using System.Reflection;

namespace SocialNetwork.Application.Configuration
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection ConfigureApplication(this IServiceCollection services)
        {
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            services.AddMediatR(Assembly.GetExecutingAssembly());

            return services;
        }
    }
}
