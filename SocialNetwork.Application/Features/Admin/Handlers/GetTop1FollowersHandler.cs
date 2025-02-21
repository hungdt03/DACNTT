using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Admin.Commands;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Entity.System;

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
            var user = await unitOfWork.UserRepository.GetTop1UserFollowers();

            var mapper = ApplicationMapper.MapToUser(user);
            mapper.FollowingCount = await unitOfWork.FollowRepository.CountFollowersByUserIdAsync(mapper.Id);

            return new DataResponse<UserResponse>()
            {
                Data = mapper,
                IsSuccess = true,
                Message = "Lấy thông tin user top 1 follower thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
