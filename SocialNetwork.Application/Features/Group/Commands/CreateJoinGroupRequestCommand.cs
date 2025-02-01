

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class CreateJoinGroupRequestCommand : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }

        public CreateJoinGroupRequestCommand(Guid groupId)
        {
            GroupId = groupId;
        }
    }
}
