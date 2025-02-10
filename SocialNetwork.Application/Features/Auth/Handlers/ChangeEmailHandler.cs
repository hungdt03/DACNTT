

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Common.Helpers;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Auth.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Auth.Handlers
{
    public class ChangeEmailHandler : IRequestHandler<ChangeEmailCommand, BaseResponse>
    {
        private readonly UserManager<Domain.Entity.System.User> _userManager;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMailkitService _mailkitService;

        public ChangeEmailHandler(UserManager<Domain.Entity.System.User> userManager, IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork, IMailkitService mailkitService)
        {
            _userManager = userManager;
            _contextAccessor = contextAccessor;
            _unitOfWork = unitOfWork;
            _mailkitService = mailkitService;
        }

        public async Task<BaseResponse> Handle(ChangeEmailCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();


            var user = await _userManager.FindByIdAsync(userId)
                ?? throw new AppException("Vui lòng đăng nhập lại");

            if (user.Email == request.Email)
                throw new AppException("Vui lòng nhập địa chỉ email mới");

            var existedEmail = await _userManager.FindByEmailAsync(request.Email);

            if (existedEmail != null) throw new AppException("Email đã tồn tại trong hệ thống");

            var matchPassword = _userManager.PasswordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

            if (matchPassword == PasswordVerificationResult.Failed)
                throw new AppException("Mật khẩu không đúng");

            bool isExisted;
            string otpCode;

            do
            {
                otpCode = OtpHelper.GenerateSecureOTP();
                isExisted = await _unitOfWork.OTPRepository.IsExistOtpAsync(user.Id, otpCode, OTPType.CHANGE_EMAIL);
            } while (isExisted);

            var otp = new Domain.Entity.System.OTP()
            {
                Code = otpCode,
                ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(5),
                UserId = user.Id,
                Type = OTPType.CHANGE_EMAIL
            };

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.OTPRepository.CreateNewOTPAsync(otp);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);


            await _mailkitService.SendOtpChangeEmailAsync(request.Email, otpCode, user.FullName);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Vui lòng kiểm tra hộp thư gmail mới của bạn",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
