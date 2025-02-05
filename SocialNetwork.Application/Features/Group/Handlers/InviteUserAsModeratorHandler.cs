
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
    public class InviteUserAsModeratorHandler : IRequestHandler<InviteUserAsModeratorCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public InviteUserAsModeratorHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(InviteUserAsModeratorCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var memberAsAdmin = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByIdAsync(request.MemberId)
                    ?? throw new NotFoundException("Người này không phải là thành viên của nhóm");

            var member = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(memberAsAdmin.GroupId, userId);

            if (member == null || member.Role != MemberRole.ADMIN)
                throw new AppException("Bạn không có quyền mời thành viên khác làm QTV");

            var existedInvitations = await _unitOfWork.GroupRoleInvitationRepository
                           .AnyRoleInvitaionAsync(memberAsAdmin.UserId, memberAsAdmin.GroupId);

            if (existedInvitations)
                throw new AppException("Người này đã được gửi lời mời trước đó");

            if (memberAsAdmin.Role != MemberRole.MEMBER)
                throw new AppException("Thành viên này đã đang làm người kiểm duyệt hoặc QTV");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var inviteAdmin = new GroupRoleInvitation()
            {
                Role = MemberRole.MODERATOR,
                InviteeId = memberAsAdmin.UserId,
                InviterId = userId,
                GroupId = memberAsAdmin.GroupId,
            };

            await _unitOfWork.GroupRoleInvitationRepository.CreateNewInvitationAsync(inviteAdmin);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Gửi lời mời thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
