using MediatR;
using SocialNetwork.Application.Features.User.Payloads.Responses;


namespace SocialNetwork.Application.Features.User.Commands
{
    public class CreateUserCommand : IRequest<UserResponse>
    {
        public string Username { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
