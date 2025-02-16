
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class DeleteGroupCommand : IRequest<BaseResponse>
    {
        public Guid GroupId { get; set; }

        public DeleteGroupCommand(Guid groupId)
        {
            GroupId = groupId;
        }
    }
}
