

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
    public class RejectJoinGroupRequestHandler : IRequestHandler<RejectJoinGroupRequestCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public RejectJoinGroupRequestHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(RejectJoinGroupRequestCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var joinRequest = await _unitOfWork.JoinGroupRequestRepository
                .GetJoinGroupRequestByIdAsync(request.RequestId)
                    ?? throw new NotFoundException("Yêu cầu không tồn tại");

            var groupMember = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(joinRequest.GroupId, userId);

            if (groupMember == null || (groupMember.Group.OnlyAdminCanApprovalMember && groupMember.Role == MemberRole.MEMBER))
                throw new AppException("Bạn không có quyền từ chối yêu cầu này");
          
            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.JoinGroupRequestRepository.RemoveJoinGroupRequest(joinRequest);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                Message = "Từ chối phê duyệt yêu cầu thành công",
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
