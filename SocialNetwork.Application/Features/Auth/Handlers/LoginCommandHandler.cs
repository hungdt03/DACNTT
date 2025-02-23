using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Auth.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Interfaces.Services.Redis;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Auth.Handlers
{
    public class LoginCommandHandler : IRequestHandler<LoginCommand, BaseResponse>
    {
        private readonly UserManager<Domain.Entity.System.User> userManager;
        private readonly ITokenService tokenService;
        private readonly IUnitOfWork unitOfWork;
        private readonly IUserStatusService userStatusService;

        public LoginCommandHandler(UserManager<Domain.Entity.System.User> userManager, ITokenService tokenService, IUnitOfWork unitOfWork, IUserStatusService userStatusService)
        {
            this.userManager = userManager;
            this.tokenService = tokenService;
            this.unitOfWork = unitOfWork;
            this.userStatusService = userStatusService;
        }

        public async Task<BaseResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByEmailAsync(request.Email)
                ?? throw new AppException("Sai thông tin đăng nhập");

            if (!user.IsVerification)
                throw new AppException("Tài khoản chưa được xác thực");

            var isMatchPassword = await userManager.CheckPasswordAsync(user, request.Password);

            if (!isMatchPassword)
                throw new AppException("Sai thông tin đăng nhập");

            if (user.IsLock) throw new AppException("Tài khoản này đã bị khóa");

            var tokens = await tokenService.GenerateTokenAsync(user);
            var mapUser = ApplicationMapper.MapToUser(user);

            mapUser.FriendCount = await unitOfWork.FriendShipRepository.CountFriendsByUserIdAsync(user.Id);
            mapUser.FollowerCount = await unitOfWork.FollowRepository.CountFollowersByUserIdAsync(user.Id);
            mapUser.FollowingCount = await unitOfWork.FollowRepository.CountFolloweesByUserIdAsync(user.Id);

            mapUser.IsOnline = await userStatusService.HasConnectionsAsync(user.Id);

            mapUser.Role = "USER";

            var roles = await userManager.GetRolesAsync(user);
            if (roles != null && roles.Count == 1)
            {
                mapUser.Role = roles[0];
            }

            var response = new AuthResponse
            {
                Token = tokens,
                User = mapUser,
            };

            var haveStory = await unitOfWork.StoryRepository
                   .IsUserHaveStoryAsync(user.Id);
            response.User.HaveStory = haveStory;

            return new DataResponse<AuthResponse>
            {
                Data = response,
                IsSuccess = true,
                Message = "Đăng nhập thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
