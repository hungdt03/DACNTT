
using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Common.Helpers;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Otp.Commands;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;

namespace SocialNetwork.Application.Features.Otp.Handlers
{
    public class ResendOtpChangeEmailHandler : IRequestHandler<ResendOtpChangeEmailCommand, BaseResponse>
    {

        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<Domain.Entity.System.User> _userManager;
        private readonly IMailkitService _mailkitService;
        private readonly IHttpContextAccessor _contextAccessor;

        public ResendOtpChangeEmailHandler(IUnitOfWork unitOfWork, UserManager<Domain.Entity.System.User> userManager, IMailkitService mailkitService, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _mailkitService = mailkitService;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(ResendOtpChangeEmailCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var userFullname = _contextAccessor.HttpContext.User.GetFullName();

            bool isExisted;
            string otpCode;

            do
            {
                otpCode = OtpHelper.GenerateSecureOTP();
                isExisted = await _unitOfWork.OTPRepository.IsExistOtpAsync(userId, otpCode, OTPType.CHANGE_EMAIL);
            } while (isExisted);

            var otp = new Domain.Entity.System.OTP()
            {
                Code = otpCode,
                ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(5),
                UserId = userId,
                Type = OTPType.CHANGE_EMAIL
            };

            var lastOtp = await _unitOfWork.OTPRepository.GetLastOtpByEmailAndTypeAsync(request.Email, OTPType.CHANGE_EMAIL);

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            if (lastOtp != null)
            {
                _unitOfWork.OTPRepository.DeleteOtp(lastOtp);
            }

            await _unitOfWork.OTPRepository.CreateNewOTPAsync(otp);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);
            await _mailkitService.SendOtpChangeEmailAsync(request.Email, otpCode, userFullname);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Vui lòng kiểm tra hộp thư gmail của bạn",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
