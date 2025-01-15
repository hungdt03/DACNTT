

using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Auth.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Auth.Handlers
{
    public class ResetPasswordHandler : IRequestHandler<ResetPasswordCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<Domain.Entity.User> _userManager;

        public ResetPasswordHandler(IUnitOfWork unitOfWork, UserManager<Domain.Entity.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        public async Task<BaseResponse> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email)
                ?? throw new NotFoundException("Địa chỉ email không tồn tại");

            var isValid = await _userManager.VerifyUserTokenAsync(
                user,
                _userManager.Options.Tokens.PasswordResetTokenProvider,
                "ResetPassword",
                request.ResetPasswordToken
            );

            if (!isValid) throw new AppException("Reset password token không hợp lệ");

            var hashedPassword = _userManager.PasswordHasher.HashPassword(user, request.NewPassword);
            user.PasswordHash = hashedPassword;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
                throw new AppException("Cập nhật mật khẩu mới thất bại");

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Reset mật khẩu thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
