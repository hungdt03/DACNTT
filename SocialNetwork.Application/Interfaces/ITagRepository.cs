using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface ITagRepository
    {
        Task<Tag?> GetTagByIdAsync(Guid id);
        void DeleteTag(Tag tag);
    }
}
