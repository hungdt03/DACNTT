
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface IUserRepository
    {
        List<string> GetUsers();
        Task<User> GetUserByEmail(string email);
    }
}
