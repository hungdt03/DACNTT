

using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Otp.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Otp.Handlers
{
    public class VerifyOtpForgotPasswordHandler : IRequestHandler<VerifyOtpForgotPasswordCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<Domain.Entity.User> _userManager;

        public VerifyOtpForgotPasswordHandler(IUnitOfWork unitOfWork, UserManager<Domain.Entity.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        public async Task<BaseResponse> Handle(VerifyOtpForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            var otp = await _unitOfWork.OTPRepository.GetOtpByCodeAndEmailAndTypeAsync(request.OtpCode, request.Email, OTPType.FORGOT_PASSWORD)
               ?? throw new AppException("Mã OTP không hợp lệ");

            var user = await _userManager.FindByIdAsync(otp.UserId)
                ?? throw new NotFoundException("User không tồn tại");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.OTPRepository.DeleteOtp(otp);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            var resetPasswordToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            return new DataResponse<string>
            {
                Data = resetPasswordToken,
                IsSuccess = true,
                Message = "OTP hợp lệ",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
