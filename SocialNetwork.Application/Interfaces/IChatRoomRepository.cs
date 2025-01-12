
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Interfaces
{
    public interface IChatRoomRepository
    {
        Task CreateChatRoom(ChatRoom chatRoom);
        Task<List<ChatRoom>> GetAllChatRoomsByUserIdAsync(string userId);
        Task<ChatRoom?> GetChatRoomByUniqueNameAsync(string uniqueName);
        Task<ChatRoom?> GetChatRoomByIdAsync(Guid id);
        Task<ChatRoom?> GetPrivateChatRoomByMemberIds(List<string> memberIds);
    }
}
