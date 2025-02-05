

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
    public class CancelRoleInvitationHandler : IRequestHandler<CancelRoleInvitationCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public CancelRoleInvitationHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(CancelRoleInvitationCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var memberInvitation = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByIdAsync(request.MemberId)
                    ?? throw new AppException("Người này không phải thành viên của nhóm");

            var member = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(memberInvitation.GroupId, userId);

            if (member == null || member.Role != MemberRole.ADMIN)
                throw new AppException("Bạn không có quyền gỡ lời mời này");


            var invitation = await _unitOfWork.GroupRoleInvitationRepository
                .GetInvitationByInviteeAndGroupIdAsync(memberInvitation.UserId, member.GroupId)
                    ?? throw new NotFoundException("Lời mời không tồn tại");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.GroupRoleInvitationRepository.RemoveRoleInvitation(invitation);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Bạn đã gỡ lời mời",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
