
using MediatR;
using SocialNetwork.Application.Contracts.Requests;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.User.Commands
{
    public class UpdateUserWorkPlaceCommand : IRequest<BaseResponse>
    {
        public Guid UserWorkPlaceId { get; set; }
        public UpdateUserWorkPlaceRequest UserWorkPlace { get; set; }

        public UpdateUserWorkPlaceCommand(Guid userWorkPlaceId, UpdateUserWorkPlaceRequest userWorkPlace)
        {
            UserWorkPlaceId = userWorkPlaceId;
            UserWorkPlace = userWorkPlace;
        }
    }
}
