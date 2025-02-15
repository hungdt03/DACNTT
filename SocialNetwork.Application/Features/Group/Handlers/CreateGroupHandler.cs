

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class CreateGroupHandler : IRequestHandler<CreateGroupCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ICloudinaryService _cloudinaryService;

        public CreateGroupHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ICloudinaryService cloudinaryService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _cloudinaryService = cloudinaryService;
        }
        public async Task<BaseResponse> Handle(CreateGroupCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            if (!request.Privacy.Equals(GroupPrivacy.PUBLIC) && !request.Privacy.Equals(GroupPrivacy.PRIVATE))
                throw new AppException("Quyền riêng tư không hợp lệ");

            var group = new Domain.Entity.GroupInfo.Group()
            {
                Privacy = request.Privacy,
                Description = request.Description,
                Name = request.Name,
                RequireApproval = false,
                RequirePostApproval = false,
                OnlyAdminCanApprovalMember = false,
                OnlyAdminCanPost = false,
                IsHidden = request.Privacy == GroupPrivacy.PUBLIC ? false : request.IsHidden,
            };

            if(request.IsHidden)
            {
                group.RequireApproval = true;
                group.OnlyAdminCanApprovalMember = true;
            }

            if (request.CoverImage != null)
            {
                var coverImage = await _cloudinaryService.UploadImageAsync(request.CoverImage);
                group.CoverImage = coverImage;
            }

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.GroupRepository.CreateGroupAsync(group);

            var leader = new GroupMember()
            {
                UserId = userId,
                Role = MemberRole.ADMIN,
                JoinDate = DateTimeOffset.UtcNow,
                GroupId = group.Id,
            };

            await _unitOfWork.GroupMemberRepository.CreateGroupMemberAsync(leader);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new DataResponse<Guid>()
            {
                Data = group.Id,
                IsSuccess = true,
                Message = "Tạo nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
