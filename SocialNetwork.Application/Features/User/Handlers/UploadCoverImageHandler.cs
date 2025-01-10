﻿

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.User.Commands;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.User.Handlers
{
    public class UploadCoverImageHandler : IRequestHandler<UploadCoverImageCommand, BaseResponse>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.User> _userManager;
        private readonly ICloudinaryService _cloudinaryService;

        public UploadCoverImageHandler(IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.User> userManager, ICloudinaryService cloudinaryService)
        {
            _contextAccessor = contextAccessor;
            _userManager = userManager;
            _cloudinaryService = cloudinaryService;
        }

        public async Task<BaseResponse> Handle(UploadCoverImageCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var user = await _userManager.FindByIdAsync(userId)
                ?? throw new AppException("User không tồn tại");

            var coverImage = await _cloudinaryService.UploadImageAsync(request.File);

            user.CoverImage = coverImage;
            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
                throw new AppException("Cập nhật ảnh bìa thất bại");

            return new DataResponse<UserResponse>()
            {
                Data = ApplicationMapper.MapToUser(user),
                IsSuccess = true,
                Message = "Cập nhật ảnh bìa thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
