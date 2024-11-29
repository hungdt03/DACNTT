
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface IPostRepository
    {
        Task CreatePostAsync(Post post);
    }
}
