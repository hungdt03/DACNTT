using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Commands;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetTop1FollowersHandler : IRequestHandler<GetTop1FollowersQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public GetTop1FollowersHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetTop1FollowersQuery request, CancellationToken cancellationToken)
        {
            var top1Followers = await unitOfWork.UserRepository.GetTop1UserFollowers();

            return new DataResponse<UserResponse>()
            {
                Data = ApplicationMapper.MapToUser(top1Followers),
                IsSuccess = true,
                Message = "Lấy thông tin user top 1 follower thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
