
using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IUserSchoolRepository
    {
        Task CreateUserSchoolAsync(UserSchool userSchool);
        Task<List<UserSchool>> GetAllUserSchoolsAsync(string userId);
        Task<UserSchool?> GetUserSchoolsByIdAsync(Guid userSchoolId);
        void DeleteUserSchool(UserSchool userSchool);
    }
}
