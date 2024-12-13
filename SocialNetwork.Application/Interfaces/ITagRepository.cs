

using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface ITagRepository
    {
        Task<Tag?> GetTagByIdAsync(Guid id);
        void DeleteTag(Tag tag);
    }
}
