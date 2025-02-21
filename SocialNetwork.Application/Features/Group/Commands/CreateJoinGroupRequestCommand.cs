

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

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
