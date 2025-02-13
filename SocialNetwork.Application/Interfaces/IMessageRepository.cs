using SocialNetwork.Domain.Entity.MessageInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IMessageRepository
    {
        Task CreateMessageAsync(Message message);
        Task<(List<Message>, int)> GetAllMessagesByChatRoomIdAsync(Guid chatRoomId, int page, int size, DateTimeOffset? lastMessageDate);
        Task<Message?> GetMessageByIdAsync(Guid messageId);
        Task<Message?> GetLastMessageByGroupIdAsync(Guid groupId);
    }
}
