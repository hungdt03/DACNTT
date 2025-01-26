

using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.User.Commands
{
    public class DeleteUserWorkPlaceCommand : IRequest<BaseResponse>
    {
        public Guid UserWorkPlaceId { get; set; }

        public DeleteUserWorkPlaceCommand(Guid userWorkPlaceId)
        {
            UserWorkPlaceId = userWorkPlaceId;
        }
    }
}
