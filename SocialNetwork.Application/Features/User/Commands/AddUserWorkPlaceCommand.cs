
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Features.User.Commands
{
    public class AddUserWorkPlaceCommand : IRequest<BaseResponse>
    {
        public Guid? PositionId { get; set; }
        public string Position { get; set; }
        public Guid? CompanyId { get; set; }
        public string Company { get; set; }
        public bool IsCurrent { get; set; }
        public int? StartYear { get; set; }
    }
}
