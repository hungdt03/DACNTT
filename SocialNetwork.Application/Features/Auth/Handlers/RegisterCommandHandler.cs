using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using SocialNetwork.Application.Common.Helpers;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Auth.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Common;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Auth.Handlers
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, BaseResponse>
    {
       
        private readonly UserManager<Domain.Entity.System.User> userManager;
        private readonly IUnitOfWork unitOfWork;
        private readonly IMailkitService mailkitService;
        private readonly IConfiguration configuration;
        private readonly IHttpContextAccessor contextAccessor;

        public RegisterCommandHandler(IHttpContextAccessor contextAccessor,UserManager<Domain.Entity.System.User> userManager, IUnitOfWork unitOfWork, IMailkitService mailkitService, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.unitOfWork = unitOfWork;
            this.mailkitService = mailkitService;
            this.configuration = configuration;
            this.contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var checkUser = await unitOfWork.UserRepository.GetUserByEmailIgnoreQuery(request.Email);
            var getCurrentUserRole = contextAccessor.HttpContext.User.GetUserRole();

            if (checkUser != null && checkUser.IsVerification)
                throw new AppException("Thông tin email đã tồn tại");
            
            await unitOfWork.BeginTransactionAsync(cancellationToken);
            if (checkUser != null && !checkUser.IsVerification)
            {
                await unitOfWork.UserRepository.DeleteUserPermanentlyByEmail(request.Email);
            }

            var user = new Domain.Entity.System.User();
            user.FullName = request.FullName;
            user.Email = request.Email;
            user.UserName = request.Email;
            user.Avatar = configuration["ServerHost"] + ShareConstant.PREFIX_FILE_API + ShareConstant.AVATAR_FILENAME;
            user.CoverImage = configuration["ServerHost"] + ShareConstant.PREFIX_FILE_API + ShareConstant.COVER_FILENAME;
            user.IsVerification = false;
            user.DateJoined = DateTime.Now;

            if (getCurrentUserRole.Equals("ADMIN"))
            {
                user.IsVerification = true;
            }
           
            var result = await userManager.CreateAsync(user, request.Password);

            if (getCurrentUserRole.Equals("ADMIN"))
            {
                if (request.Role != "ADMIN" && request.Role != "USER")
                    throw new AppException("Quyền không hợp lệ");

                await userManager.AddToRoleAsync(user, request.Role);
            }
            else
            {
                await userManager.AddToRoleAsync(user, "USER");
            }

            if (!result.Succeeded)
                throw new AppException(result.Errors.First().Description);

            string? otpCode = null;
            bool isExisted;

            if (!user.IsVerification)
            {
                do
                {
                    otpCode = OtpHelper.GenerateSecureOTP();
                    isExisted = await unitOfWork.OTPRepository.IsExistOtpAsync(user.Id, otpCode, OTPType.ACCOUNT_VERIFICATION);
                } while (isExisted);

                var otp = new Domain.Entity.System.OTP
                {
                    Code = otpCode,
                    ExpiresAt = DateTimeOffset.UtcNow.AddMinutes(5),
                    Type = OTPType.ACCOUNT_VERIFICATION,
                    UserId = user.Id,
                };


                await unitOfWork.OTPRepository.CreateNewOTPAsync(otp);
            }

            await unitOfWork.CommitTransactionAsync(cancellationToken);

           if(!user.IsVerification && otpCode != null)
            {
                await mailkitService.SendOtpAccountVerificationAsync(user.Email, otpCode, user.FullName);
            }

            return new BaseResponse()
            {
                Message = "Vui lòng kiểm tra hộp thư gmail của bạn",
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
            
        }
    }
}
