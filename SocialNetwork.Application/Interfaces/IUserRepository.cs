

using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByIdAsync(string userId);
    }
}
