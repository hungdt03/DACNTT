using SocialNetwork.API.DI;
using SocialNetwork.API.Middlewares;
using SocialNetwork.Infrastructure.SignalR;
using System.Text.Json;

namespace SocialNetwork.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddSignalR();
            // Add services to the container.
            builder.Services.RegisterDependencies(builder.Configuration);
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseMiddleware<ExceptionHandlerMiddleware>();
            app.UseCors("AllowAll");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.MapHub<ServerHub>("/serverHub");

            app.Run();
        }
    }
}
