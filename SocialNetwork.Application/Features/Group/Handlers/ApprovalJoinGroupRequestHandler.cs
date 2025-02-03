

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.GroupInfo;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class ApprovalJoinGroupRequestHandler : IRequestHandler<ApprovalJoinGroupRequestCommand, BaseResponse>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUnitOfWork _unitOfWork;

        public ApprovalJoinGroupRequestHandler(IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork)
        {
            _contextAccessor = contextAccessor;
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(ApprovalJoinGroupRequestCommand request, CancellationToken cancellationToken)
        {
            var joinGroupRequest = await _unitOfWork.JoinGroupRequestRepository.GetJoinGroupRequestByIdAsync(request.RequestId);

            if (joinGroupRequest == null || joinGroupRequest.Status) throw new NotFoundException("Yêu cầu không tồn tại hoặc đã được phê duyệt");

            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var groupMember = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(joinGroupRequest.GroupId, userId);

            if (groupMember == null || (groupMember.Group.OnlyAdminCanApprovalMember && groupMember.Role == MemberRole.MEMBER)) throw new AppException("Bạn không có quyền phê duyệt ở nhóm này");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            _unitOfWork.JoinGroupRequestRepository.RemoveJoinGroupRequest(joinGroupRequest);

            var newGroupMember = new GroupMember()
            {
                GroupId = joinGroupRequest.GroupId,
                Role = MemberRole.MEMBER,
                JoinDate = DateTimeOffset.UtcNow,
                UserId = joinGroupRequest.UserId,
            };
          
            await _unitOfWork.GroupMemberRepository.CreateGroupMemberAsync(newGroupMember);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Phê duyệt thành viên vào nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
