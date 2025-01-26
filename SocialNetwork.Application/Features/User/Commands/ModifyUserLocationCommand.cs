
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.User.Commands
{
    public class ModifyUserLocationCommand : IRequest<BaseResponse>
    { 
        public string? Address { get; set; }
        public Guid? LocationId { get; set; }
    }
}
