using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Auth.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Auth.Handlers
{
    public class GetPrincipalHandler : IRequestHandler<GetPrincipalQuery, BaseResponse>
    {
        private readonly UserManager<Domain.Entity.User> userManager;
        private readonly IUnitOfWork unitOfWork;
        private readonly IHttpContextAccessor contextAccessor;

        public GetPrincipalHandler(UserManager<Domain.Entity.User> userManager, IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork)
        {
            this.userManager = userManager;
            this.contextAccessor = contextAccessor;
            this.unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetPrincipalQuery request, CancellationToken cancellationToken)
        {
            var userId = contextAccessor.HttpContext.User.GetUserId();
            var user = await unitOfWork.UserRepository.GetUserByIdAsync("20923a91-8535-4ce8-a672-25ca843514d5")
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
