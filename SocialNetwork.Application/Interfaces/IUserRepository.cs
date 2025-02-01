using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByIdAsync(string userId);
        Task<IEnumerable<User>> GetAllUsersContainsKeyAsync(string key);
    }
}
