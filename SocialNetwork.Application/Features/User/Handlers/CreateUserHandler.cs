using MediatR;
using SocialNetwork.Application.Features.User.Commands;
using SocialNetwork.Application.Features.User.Payloads.Responses;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class CreateUserHandler : IRequestHandler<CreateUserCommand, UserResponse>
    {
        public async Task<UserResponse> Handle(Commands.CreateUserCommand request, CancellationToken cancellationToken)
        {
            return new UserResponse()
            {
                Email = request.Email,
                FullName = request.FullName,
                Password = request.Password,
                Username = request.Username,
            };
        }
    }
}
