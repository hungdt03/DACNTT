
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Auth.Commands;

namespace SocialNetwork.Application.Features.Auth.Handlers
{
    public class ChangePasswordHandler : IRequestHandler<ChangePasswordCommand, BaseResponse>
    {
        private readonly UserManager<Domain.Entity.System.User> _userManager;
        private readonly IHttpContextAccessor _contextAccessor;

        public ChangePasswordHandler(UserManager<Domain.Entity.System.User> userManager, IHttpContextAccessor contextAccessor)
        {
            _userManager = userManager;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var user = await _userManager.FindByIdAsync(userId)
                ?? throw new AppException("Vui lòng đăng nhập lại");

            var matchPassword = _userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, request.OldPassword);

            if (matchPassword == PasswordVerificationResult.Failed)
                throw new AppException("Mật khẩu cũ không đúng");

            var changePasswordResult = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
            if (!changePasswordResult.Succeeded)
                throw new AppException("Đổi mật khẩu thất bại");

            return new BaseResponse ()
            {
                IsSuccess = true,
                Message = "Thay đổi mật khẩu thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
