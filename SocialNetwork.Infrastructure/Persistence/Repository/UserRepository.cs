using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Infrastructure.Persistence.Repository
{
    public class UserRepository : IUserRepository
    {
        public Task<User> GetUserByEmail(string email)
        {
            throw new NotImplementedException();
        }

        public List<string> GetUsers()
        {
            return new List<string>()
            {
                "Trần Phan Hoàn Vịt",
                "Bùi Vịt Bù Khu Lòn Chim"
            };
        }
    }
}
