using SocialNetwork.Application.Contracts.Requests;
using SocialNetwork.Application.DTOs.Admin;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Interfaces
{
    public interface IUserRepository
    {
        Task DeleteUserPermanentlyByEmail(string email);
        Task<User?> GetUserByEmailIgnoreQuery(string email);
        Task<List<User>> GetAllUsers();
        Task<List<User>> GetAllRoleUser();
        Task<List<User>> GetAllRoleAdmin();
        Task<(List<User> Users, int TotalCount)> GetAllRoleAdmin(int page, int size, string search);
        Task<(List<User> Users, int TotalCount)> GetAllRoleUser(int page, int size, string search);
        Task DeleteUser(string id); 
        Task DeleteAllUser();
        Task DeleteManyUser(List<string> listUserId);
        Task UnLockAndLockOneAccount(string userId);
        Task UnLockAndLockManyAccount(List<string> users, string number);
        Task<User?> GetUserByIdAsync(string userId);
        Task<(IEnumerable<User> Users, int TotalCount)> GetAllUsersContainsKeyAsync(string key, int page, int size);
        Task<int> CountAllUser();
        Task<int> CountAllUserIsLock();
        Task<List<int>> GetRegistrationYears();
        Task<List<MonthlyRegistrationStatsResponse>> GetRegistrationStatsByYear(int year);
        Task<List<UserFollow>> GetTop5UserFollowers();
        Task<int> CountOnlineUsersAsync();
        Task<int> CountOfflineUsersAsync();
    }
}
