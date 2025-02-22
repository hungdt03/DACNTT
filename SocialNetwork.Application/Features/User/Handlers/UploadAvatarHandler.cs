
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Common.Helpers;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.User.Commands;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class UploadAvatarHandler : IRequestHandler<UploadAvatarComand, BaseResponse>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.System.User> _userManager;
        private readonly ICloudinaryService _cloudinaryService;

        public UploadAvatarHandler(IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.System.User> userManager, ICloudinaryService cloudinaryService)
        {
            _contextAccessor = contextAccessor;
            _userManager = userManager;
            _cloudinaryService = cloudinaryService;
        }

        public async Task<BaseResponse> Handle(UploadAvatarComand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var user = await _userManager.FindByIdAsync(userId)
                ?? throw new AppException("User không tồn tại");

            long maxSizeInBytes = 4 * 1024 * 1024;
            if (FileValidationHelper.AreFilesTooLarge([request.File], maxSizeInBytes))
            {
                throw new AppException("Kích thước tệp vượt quá giới hạn 4MB.");
            }

            var avatar = await _cloudinaryService.UploadImageAsync(request.File);

            user.Avatar = avatar;
            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
                throw new AppException("Cập nhật ảnh đại diện thất bại");

            return new DataResponse<UserResponse>()
            {
                Data = ApplicationMapper.MapToUser(user),
                IsSuccess = true,
                Message = "Cập nhật ảnh đại diện thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
