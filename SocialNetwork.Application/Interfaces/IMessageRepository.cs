
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface IMessageRepository
    {
        Task CreateMessageAsync(Message message);
        Task<List<Message>> GetAllMessagesByChatRoomIdAsync(Guid chatRoomId);
        Task<Message?> GetMessageByIdAsync(Guid messageId);
    }
}
