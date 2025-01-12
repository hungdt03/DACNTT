
namespace SocialNetwork.Application.Interfaces.Services
{
    public interface IMailkitService
    {
        Task SendAsync(string to, string subject);
    }
}
