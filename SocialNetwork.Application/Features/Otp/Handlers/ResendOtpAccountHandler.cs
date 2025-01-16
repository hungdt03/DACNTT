
using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Common.Helpers;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Otp.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Otp.Handlers
{
    public class ResendOtpAccountHandler : IRequestHandler<ResendOtpAccountCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<Domain.Entity.User> _userManager;
        private readonly IMailkitService _mailkitService;

        public ResendOtpAccountHandler(IUnitOfWork unitOfWork, UserManager<Domain.Entity.User> userManager, IMailkitService mailkitService)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _mailkitService = mailkitService;
        }

        public async Task<BaseResponse> Handle(ResendOtpAccountCommand request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(request.Email)
                ?? throw new AppException("Địa chỉ email không tồn tại");

            bool isExisted;
            string otpCode;

            do
            {
                otpCode = OtpHelper.GenerateSecureOTP();
                isExisted = await _unitOfWork.OTPRepository.IsExistOtpAsync(user.Id, otpCode, OTPType.ACCOUNT_VERIFICATION);
            } while (isExisted);

            var otp = new Domain.Entity.OTP()
            {
                Code = otpCode,
                ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(5),
                UserId = user.Id,
                Type = OTPType.ACCOUNT_VERIFICATION
            };

            var lastOtp = await _unitOfWork.OTPRepository.GetLastOtpByEmailAndTypeAsync(request.Email, OTPType.ACCOUNT_VERIFICATION);

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.OTPRepository.CreateNewOTPAsync(otp);
            if(lastOtp != null)
            {
                _unitOfWork.OTPRepository.DeleteOtp(lastOtp);
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            await _mailkitService.SendOtpAccountVerificationAsync(user.Email, otpCode, user.FullName);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Vui lòng kiểm tra hộp thư gmail của bạn",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
