

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
    public class ForgotPasswordHandler : IRequestHandler<ForgotPasswordCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMailkitService _mailkitService;
        private readonly UserManager<Domain.Entity.System.User> _userManager;

        public ForgotPasswordHandler(IUnitOfWork unitOfWork, IMailkitService mailkitService, UserManager<Domain.Entity.System.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _mailkitService = mailkitService;
            _userManager = userManager;
        }

        public async Task<BaseResponse> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email)
                ?? throw new NotFoundException("Địa chỉ email không tồn tại");

            bool isExisted;
            string otpCode;

            do
            {
                otpCode = OtpHelper.GenerateSecureOTP();
                isExisted = await _unitOfWork.OTPRepository.IsExistOtpAsync(user.Id, otpCode, OTPType.FORGOT_PASSWORD);
            } while (isExisted);

            var otp = new Domain.Entity.System.OTP()
            {
                Code = otpCode,
                ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(5),
                UserId = user.Id,
                Type = OTPType.FORGOT_PASSWORD
            };

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.OTPRepository.CreateNewOTPAsync(otp);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

          
            await _mailkitService.SendOtpForgotPasswordAsync(user.Email, otpCode, user.FullName);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Vui lòng kiểm tra hộp thư gmail của bạn",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
