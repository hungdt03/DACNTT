
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class UpdateGeneralInfoHandler : IRequestHandler<UpdateGeneralInfoCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public UpdateGeneralInfoHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(UpdateGeneralInfoCommand request, CancellationToken cancellationToken)
        {
            var group = await _unitOfWork.GroupRepository
                .GetGroupByIdAsync(request.GroupId)
                    ?? throw new NotFoundException("Thông tin nhóm không tồn tại");

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var groupMember = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(request.GroupId, userId);
            if (groupMember.Role != MemberRole.ADMIN)
                throw new AppException("Bạn không có quyền cập nhật thông tin chung của nhóm");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            group.Name = request.Group.Name;
            group.Description = request.Group.Description;
           
            group.Privacy = request.Group.IsPublic ? GroupPrivacy.PUBLIC : GroupPrivacy.PRIVATE;

            if(request.Group.IsPublic)
            {
                group.RequireApproval = false;
                group.RequirePostApproval = false;
                group.OnlyAdminCanApprovalMember = false;
                group.OnlyAdminCanApprovalMember = false;
            } else
            {
                group.RequireApproval = request.Group.IsApprovalMember;
                group.RequirePostApproval = request.Group.IsApprovalPost;
                group.OnlyAdminCanApprovalMember = request.Group.OnlyAdminCanApprovalMember;
                group.OnlyAdminCanPost = request.Group.OnlyAdminCanPost;
                group.IsHidden = request.Group.IsHidden;
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Cập nhật thông tin chung của nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
