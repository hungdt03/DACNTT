

using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface IMessageMediaRepository
    {
        Task<(IEnumerable<MessageMedia> medias, int TotalCount)> GetAllMessageMediasByChatRoomIdAsync(Guid chatRoomId, int page, int size);
    }
}
