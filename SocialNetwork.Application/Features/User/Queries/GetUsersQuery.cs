using MediatR;


namespace SocialNetwork.Application.Features.User.Queries
{
    public class GetUsersQuery : IRequest<List<string>>
    {
    }
}
