
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
    public class ModifyGroupSettingHandler : IRequestHandler<ModifyGroupSettingCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public ModifyGroupSettingHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(ModifyGroupSettingCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var member = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(request.GroupId, userId);

            if (member == null || member.Role != MemberRole.ADMIN)
                throw new AppException("Bạn không có quyền chỉnh sửa thông tin nhóm này");

            var group = await _unitOfWork.GroupRepository
                .GetGroupByIdAsync(request.GroupId)
                    ?? throw new NotFoundException("Nhóm không tồn tại");
            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            group.RequireApproval = request.IsMemberApprovalRequired;
            group.RequirePostApproval = request.IsPostApprovalRequired;
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Cập nhật thông tin nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
