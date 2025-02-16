

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Friend.Queries
{
    public class GetInvitableConnectedUserQuery : IRequest<BaseResponse>
    {
        public Guid ChatRoomId { get; set; }
        public string Query { get; set; }
        public int Page {  get; set; }
        public int Size { get; set; }

        public GetInvitableConnectedUserQuery(Guid chatRoomId, string query, int page, int size)
        {
            Query = query;  
            ChatRoomId = chatRoomId;
            Page = page;
            Size = size;
        }
    }
}
