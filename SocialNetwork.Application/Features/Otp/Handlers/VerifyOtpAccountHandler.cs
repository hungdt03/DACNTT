
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Otp.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Otp.Handlers
{
    public class VerifyOtpAccountHandler : IRequestHandler<VerifyOtpAccountCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<Domain.Entity.System.User> _userManager;

        public VerifyOtpAccountHandler(IUnitOfWork unitOfWork, UserManager<Domain.Entity.System.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        public async Task<BaseResponse> Handle(VerifyOtpAccountCommand request, CancellationToken cancellationToken)
        {
            var otp = await _unitOfWork.OTPRepository.GetLastOtpByEmailAndTypeAsync(request.Email, OTPType.ACCOUNT_VERIFICATION)
                ?? throw new AppException("Mã OTP không hợp lệ");

            if (otp.Code != request.OtpCode) throw new AppException("Mã OTP không hợp lệ");

            var user = await _userManager.FindByEmailAsync(request.Email)
                ?? throw new NotFoundException("Địa chỉ email chưa tồn tại");

            user.IsVerification = true;

            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
                throw new AppException("Có lỗi trong quá trình xác thực. Vui lòng thử lại");

                
            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.OTPRepository.DeleteOtp(otp);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Xác thực tài khoản thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
