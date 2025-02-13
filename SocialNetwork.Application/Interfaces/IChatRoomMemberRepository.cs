


using SocialNetwork.Domain.Entity.ChatRoomInfo;

namespace SocialNetwork.Application.Interfaces
{
    public interface IChatRoomMemberRepository
    {
        Task<List<ChatRoomMember>> GetAllMembersByChatRoomIdAsync(Guid chatRoomId);
        void DeleteMember(ChatRoomMember chatRoomMember);
        Task CreateChatRoomMember(ChatRoomMember chatRoomMember);
        Task<ChatRoomMember?> GetChatRoomMemberByRoomIdAndUserId(Guid chatRoomId, string userId);
        Task<ChatRoomMember?> GetChatRoomMemberById(Guid memberId);
        Task<int> CountLeaderByChatRoomId(Guid chatRoomId);
        Task<int> CountMembersByChatRoomId(Guid chatRoomId);
    }
}
