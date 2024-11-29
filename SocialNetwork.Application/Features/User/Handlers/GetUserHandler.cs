using MediatR;
using SocialNetwork.Application.Features.User.Queries;
using SocialNetwork.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class GetUserHandler : IRequestHandler<GetUsersQuery, List<string>>
    {
        private readonly IUserRepository userRepository;

        public GetUserHandler(IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }

        public async Task<List<string>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
        {
            return userRepository.GetUsers();
        }
    }
}
