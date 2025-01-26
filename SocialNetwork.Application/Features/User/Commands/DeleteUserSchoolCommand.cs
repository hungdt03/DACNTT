
using MediatR;
using SocialNetwork.Application.Contracts.Responses;

namespace SocialNetwork.Application.Features.User.Commands
{
    public class DeleteUserSchoolCommand : IRequest<BaseResponse>
    {
        public Guid UserSchoolId { get; set; }

        public DeleteUserSchoolCommand(Guid userSchoolId)
        {
            UserSchoolId = userSchoolId;
        }
    }
}
