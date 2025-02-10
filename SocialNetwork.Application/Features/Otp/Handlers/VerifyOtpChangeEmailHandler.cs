

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Otp.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Otp.Handlers
{
    public class VerifyOtpChangeEmailHandler : IRequestHandler<VerifyOtpChangeEmailCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<Domain.Entity.System.User> _userManager;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ITokenService _tokenService;

        public VerifyOtpChangeEmailHandler(IUnitOfWork unitOfWork, UserManager<Domain.Entity.System.User> userManager, IHttpContextAccessor contextAccessor, ITokenService tokenService)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _contextAccessor = contextAccessor;
            _tokenService = tokenService;
        }

        public async Task<BaseResponse> Handle(VerifyOtpChangeEmailCommand request, CancellationToken cancellationToken)
        {
            var userEmail = _contextAccessor.HttpContext.User.GetUserEmail();
            var otp = await _unitOfWork.OTPRepository.GetLastOtpByEmailAndTypeAsync(userEmail, OTPType.CHANGE_EMAIL)
               ?? throw new AppException("Mã OTP không hợp lệ");

            if (otp.Code != request.OtpCode) throw new AppException("Mã OTP không hợp lệ");

            var user = await _userManager.FindByIdAsync(otp.UserId)
                ?? throw new NotFoundException("Mã OTP không hợp lệ");

            if (user.Email == request.Email)
                throw new AppException("Vui lòng nhập địa chỉ email mới");

            var existedEmail = await _userManager.FindByEmailAsync(request.Email);

            if (existedEmail != null) throw new AppException("Email đã tồn tại trong hệ thống");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.OTPRepository.DeleteOtp(otp);
            user.Email = request.Email;
            user.UserName = request.Email;
            var updateUserResult = await _userManager.UpdateAsync(user);

            if (!updateUserResult.Succeeded)
                throw new AppException("Cập nhật thông tin email thất bại");

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            var tokens = await _tokenService.GenerateTokenAsync(user);

            var response = new AuthResponse
            {
                Token = tokens,
                User = ApplicationMapper.MapToUser(user),
            };

            var haveStory = await _unitOfWork.StoryRepository
                   .IsUserHaveStoryAsync(user.Id);
            response.User.HaveStory = haveStory;

            return new DataResponse<AuthResponse>
            {
                Data = response,
                IsSuccess = true,
                Message = "Thay đổi email tài khoản thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
