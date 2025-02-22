
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.GroupInfo;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class AcceptInviteFriendHandler : IRequestHandler<AcceptInviteFriendCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public AcceptInviteFriendHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
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

            var isAllowJoin = true;
            var inviterInGroup = await _unitOfWork.GroupMemberRepository
                 .GetGroupMemberByGroupIdAndUserId(invitation.Group.Id, invitation.InviterId);

            if (invitation.Group.OnlyAdminCanApprovalMember)
            {
             
                if (inviterInGroup != null && inviterInGroup.Role == MemberRole.MEMBER)
                {
                    invitation.Status = true;
                    isAllowJoin = false;
                }
                else
                {
                    isAllowJoin = true;
                }
            }

            Domain.Entity.System.Notification? notification = null;
            if (isAllowJoin) {
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

                //notification = new Domain.Entity.System.Notification()
                //{
                //    Title = "Phê duyệt lời mời",
                //    Content = $"Yêu cầu tham gia nhóm {invitation.Group.Name} của bạn đã được phê duyệt",
                //    GroupInvitationId = request.InviteId,
                //    GroupId = invitation.GroupId,
                //    ImageUrl = invitation.Group.CoverImage,
                //    DateSent = DateTimeOffset.UtcNow,
                //    IsRead = false,
                //    Type = NotificationType.APPROVAL_GROUP_INVITATION,
                //    RecipientId = invitation.InviteeId,
                //};

                //await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

           
            //if (notification != null)
            //    await _signalRService.SendNotificationToSpecificUser(invitation.Invitee.UserName, ApplicationMapper.MapToNotification(notification));

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = (invitation.Group.OnlyAdminCanApprovalMember && inviterInGroup?.Role == MemberRole.MEMBER) ? "Bạn phải chờ quản trị viên hoặc người kiểm duyệt phê duyệt" : "Chấp nhận tham gia nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };

        }
    }
}
