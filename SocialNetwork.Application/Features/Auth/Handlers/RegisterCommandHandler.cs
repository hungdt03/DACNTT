using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Auth.Commands;

namespace SocialNetwork.Application.Features.Auth.Handlers
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, BaseResponse>
    {
        private readonly UserManager<SocialNetwork.Domain.Entity.User> userManager;

        public RegisterCommandHandler(UserManager<Domain.Entity.User> userManager)
        {
            this.userManager = userManager;
        }

        public async Task<BaseResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var checkUser = await userManager.FindByNameAsync(request.Email);

            if (checkUser != null)
                throw new AppException("Thông tin email đã tồn tại");

            var user = new Domain.Entity.User();
            user.FullName = request.FullName;
            user.Email = request.Email;
            user.UserName = request.Email;

            var result = await userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
                throw new AppException(result.Errors.First().Description);

            return new BaseResponse()
            {
                Message = "Đăng kí tài khoản thành công",
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
            
        }
    }
}
