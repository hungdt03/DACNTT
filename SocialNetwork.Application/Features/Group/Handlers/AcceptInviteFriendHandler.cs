﻿
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
    public class AcceptInviteFriendHandler : IRequestHandler<AcceptInviteFriendCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public AcceptInviteFriendHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(AcceptInviteFriendCommand request, CancellationToken cancellationToken)
        {
            var invitation = await _unitOfWork.GroupInvitationRepository.GetGroupInvitationByIdAsync(request.InviteId);

            if (invitation == null || invitation.Status == true)
                throw new NotFoundException("Lời mời không tồn tại hoặc không còn nữa");

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            if (invitation.InviteeId != userId)
                throw new AppException("Bạn không có quyền chấp nhận lời mời này");

            if (invitation.Status == true)
                throw new AppException("Lời mời đang chờ phê duyệt");
           
            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            if(invitation.Group.OnlyAdminCanApprovalMember)
            {
                invitation.Status = true;

            } else
            {
                var joinGroupRequest = await _unitOfWork
                   .JoinGroupRequestRepository
                   .GetJoinGroupRequestByUserIdAndGroupIdAsync(userId, invitation.GroupId);

                if (joinGroupRequest != null)
                {
                    _unitOfWork.JoinGroupRequestRepository.RemoveJoinGroupRequest(joinGroupRequest);
                }

                _unitOfWork.GroupInvitationRepository
                    .RemoveGroupInvitation(invitation);

                var groupMember = new GroupMember()
                {
                    GroupId = invitation.GroupId,
                    Role = MemberRole.MEMBER,
                    JoinDate = DateTimeOffset.UtcNow,
                    UserId = userId,
                };

                await _unitOfWork.GroupMemberRepository.CreateGroupMemberAsync(groupMember);
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = invitation.Group.OnlyAdminCanApprovalMember ? "Bạn phải chờ quản trị viên hoặc người kiểm duyệt phê duyệt" : "Chấp nhận tham gia nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };

        }
    }
}
