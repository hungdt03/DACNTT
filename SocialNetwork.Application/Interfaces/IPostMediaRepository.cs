

using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface IPostMediaRepository
    {
        Task<PostMedia?> GetPostMediaByIdAsync(Guid postId);
        void DeletePostMedia(PostMedia media);
    }
}
