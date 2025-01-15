using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Auth.Commands;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Auth.Handlers
{
    public class LoginCommandHandler : IRequestHandler<LoginCommand, BaseResponse>
    {
        private readonly UserManager<SocialNetwork.Domain.Entity.User> userManager;
        private readonly ITokenService tokenService;

        public LoginCommandHandler(UserManager<Domain.Entity.User> userManager, ITokenService tokenService)
        {
            this.userManager = userManager;
            this.tokenService = tokenService;
        }

        public async Task<BaseResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await userManager.FindByNameAsync(request.Email)
                ?? throw new AppException("Sai thông tin đăng nhập");

            if (!user.IsVerification)
                throw new AppException("Tài khoản chưa được xác thực");

            var isMatchPassword = await userManager.CheckPasswordAsync(user, request.Password);

            if (!isMatchPassword)
                throw new AppException("Sai thông tin đăng nhập");

            var tokens = await tokenService.GenerateTokenAsync(user);

            var response = new AuthResponse
            {
                Token = tokens,
                User = ApplicationMapper.MapToUser(user),
            };

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
