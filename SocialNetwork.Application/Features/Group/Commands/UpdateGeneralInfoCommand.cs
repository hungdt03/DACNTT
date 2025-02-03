

using MediatR;
using SocialNetwork.Application.Contracts.Requests;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.Group.Commands
{
    public class UpdateGeneralInfoCommand : IRequest<BaseResponse>
    {
       public Guid GroupId { get; set; }
        public UpdateGroupRequest Group { get; set; }

        public UpdateGeneralInfoCommand(Guid groupId, UpdateGroupRequest group)
        {
            GroupId = groupId;
            Group = group;
        }
    }
}
