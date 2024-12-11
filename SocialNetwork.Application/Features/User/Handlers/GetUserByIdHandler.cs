
using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.User.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, BaseResponse>
    {
        private readonly UserManager<Domain.Entity.User> userManager;
        private readonly IUnitOfWork unitOfWork;

        public GetUserByIdHandler(UserManager<Domain.Entity.User> userManager, IUnitOfWork unitOfWork)
        {
            this.userManager = userManager;
            this.unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            var user = await unitOfWork.UserRepository.GetUserByIdAsync(request.UserId)
                ?? throw new AppException("Thông tin user không tồn tại");

            var response = ApplicationMapper.MapToUser(user);
            //response.FollowerCount = user?.Followers?.Count ?? 0;
            //response.FollowingCount = user?.Followings?.Count ?? 0;
            //response.PostCount = user?.Posts?.Count ?? 0;
            //response.FriendCount = user?.Friends?.Count ?? 0;

            return new DataResponse<UserResponse>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy thông tin user thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
