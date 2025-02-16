
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class UploadGroupCoverHandler : IRequestHandler<UploadGroupCoverCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ICloudinaryService _cloudinaryService;

        public UploadGroupCoverHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ICloudinaryService cloudinaryService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _cloudinaryService = cloudinaryService;
        }

        public async Task<BaseResponse> Handle(UploadGroupCoverCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var groupMember = await _unitOfWork
                .GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(request.GroupId, userId);

            if (groupMember == null || groupMember.Role != MemberRole.ADMIN)
            {
                throw new AppException("Chỉ có quản trị viên mới được thay đổi ảnh nhóm");
            }

            var group = await _unitOfWork.GroupRepository
                .GetGroupByIdAsync(request.GroupId)
                ?? throw new AppException("Nhóm không tồn tại");

            var imageUrl = await _cloudinaryService.UploadImageAsync(request.Image);

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            group.CoverImage = imageUrl;

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Cập nhật ảnh nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
