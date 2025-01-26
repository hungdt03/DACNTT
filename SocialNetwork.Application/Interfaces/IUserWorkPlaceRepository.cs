

using SocialNetwork.Domain.Entity.UserInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IUserWorkPlaceRepository
    {
        Task CreateUserWorkPlaceAsync(UserWorkPlace userWorkPlace);
        Task<List<UserWorkPlace>> GetAllUserWorkPlacesAsync(string userId);
        Task<UserWorkPlace?> GetUserWorkPlaceByIdAsync(Guid userWorkPlace);
        void DeleteUserWorkPlace(UserWorkPlace userWorkPlaceId);
    }
}
