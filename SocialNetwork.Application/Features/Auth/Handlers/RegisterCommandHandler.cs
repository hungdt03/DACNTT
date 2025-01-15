using MediatR;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Common.Helpers;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Auth.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Auth.Handlers
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, BaseResponse>
    {
        public const string AVATAR_URL = "https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-1024x1024.jpeg";
        private readonly UserManager<Domain.Entity.User> userManager;
        private readonly IUnitOfWork unitOfWork;
        private readonly IMailkitService mailkitService;

        public RegisterCommandHandler(UserManager<Domain.Entity.User> userManager, IUnitOfWork unitOfWork, IMailkitService mailkitService)
        {
            this.userManager = userManager;
            this.unitOfWork = unitOfWork;
            this.mailkitService = mailkitService;
        }

        public async Task<BaseResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var checkUser = await userManager.FindByNameAsync(request.Email);

            if (checkUser != null && checkUser.IsVerification)
                throw new AppException("Thông tin email đã tồn tại");

            if (checkUser != null && !checkUser.IsVerification)
            {
                var deleteResult = await userManager.DeleteAsync(checkUser);
                if (!deleteResult.Succeeded) throw new AppException("Có lỗi xảy ra trong quá trình đăng kí");
            }
                

            var user = new Domain.Entity.User();
            user.FullName = request.FullName;
            user.Email = request.Email;
            user.UserName = request.Email;
            user.Avatar = AVATAR_URL;
            user.IsVerification = false;

            var result = await userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
                throw new AppException(result.Errors.First().Description);

            string otpCode;
            bool isExisted;

            do
            {
                otpCode = OtpHelper.GenerateSecureOTP();
                isExisted = await unitOfWork.OTPRepository.IsExistOtpAsync(user.Id, otpCode, OTPType.ACCOUNT_VERIFICATION);
            } while (isExisted);

            var otp = new Domain.Entity.OTP
            {
                Code = otpCode,
                ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(5),
                Type = OTPType.ACCOUNT_VERIFICATION,
                UserId = user.Id,
            };

            await unitOfWork.BeginTransactionAsync(cancellationToken);
            await unitOfWork.OTPRepository.CreateNewOTPAsync(otp);
            await unitOfWork.CommitTransactionAsync(cancellationToken);

            await mailkitService.SendOtpAccountVerificationAsync(user.Email, otpCode, user.FullName);

            return new BaseResponse()
            {
                Message = "Vui lòng kiểm tra hộp thư gmail của bạn",
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
            
        }
    }
}
