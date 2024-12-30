
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface IMessageReadStatusRepository
    {
        Task<MessageReadStatus?> GetMessageReadStatusByUserAndChatRoomId(string userId, Guid chatRoomId);
        Task CreateMessageReadStatusAsync(MessageReadStatus messageReadStatus);
    }
}
