using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IPostMediaRepository
    {
        Task<PostMedia?> GetPostMediaByIdAsync(Guid postId);
        void DeletePostMedia(PostMedia media);
        Task<(List<PostMedia> Images, int TotalCount)> GetAllGroupImagesByGroupId(Guid groupId, int page, int size);
        Task<(List<PostMedia> Videos, int TotalCount)> GetAllGroupVideosByGroupId(Guid groupId, int page, int size);
        Task<(List<PostMedia> PostMedias, int TotalCount)> GetAllGroupPostMediaByGroupIdAsync(Guid groupId, int page, int size);
    }
}
