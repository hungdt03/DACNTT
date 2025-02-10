using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Interfaces
{
    public interface IUserRepository
    {
        Task DeleteUserPermanentlyByEmail(string email);
        Task<User?> GetUserByEmailIgnoreQuery(string email);
        Task<List<User>> GetAllUsers();
        Task<User?> GetUserByIdAsync(string userId);
        Task<(IEnumerable<User> Users, int TotalCount)> GetAllUsersContainsKeyAsync(string key, int page, int size);
    }
}
