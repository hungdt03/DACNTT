

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.ChatRoom.Queries
{
    public class SearchChatRoomByNameQuery : IRequest<BaseResponse>
    {
        public string Name { get; set; }

        public SearchChatRoomByNameQuery(string name)
        {
            Name = name;
        }
    }
}
