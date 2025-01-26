using MediatR;
using SocialNetwork.Application.Contracts.Requests;
using SocialNetwork.Application.Contracts.Responses;
using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Application.Features.User.Commands
{
    public class UpdateUserEducationCommand : IRequest<BaseResponse>
    {
        public Guid UserSchoolId { get; set; }
        public UpdateUserEducationRequest UserSchool { get; set; }

        public UpdateUserEducationCommand(Guid userSchoolId, UpdateUserEducationRequest userSchool)
        {
            UserSchoolId = userSchoolId;
            UserSchool = userSchool;
        }
    }
}
