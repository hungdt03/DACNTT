
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Group.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.GroupInfo;


namespace SocialNetwork.Application.Features.Group.Handlers
{
    public class InviteFriendsHandler : IRequestHandler<InviteFriendsCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public InviteFriendsHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(InviteFriendsCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var meInGroup = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(request.GroupId, userId)
                ?? throw new AppException("Bạn không phải là thành viên của nhóm");

            var group = await _unitOfWork.GroupRepository.GetGroupByIdAsync(request.GroupId)
                ?? throw new NotFoundException("Nhóm không tồn tại");

            var pushNotiUsers = new List<NotificationResponse>();
            var userAvatar = _contextAccessor.HttpContext.User.GetAvatar();
            var userFullName = _contextAccessor.HttpContext.User.GetFullName();
            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            foreach(var inviteeId in request.InviteeIds)
            {
                var invitation = new GroupInvitation()
                {
                    GroupId = request.GroupId,
                    InviterId = userId,
                    InviteeId = inviteeId,
                    Status = false,
                };

                var user = await _unitOfWork.UserRepository.GetUserByIdAsync(inviteeId)
                    ?? throw new NotFoundException("User trong danh sách mời không tồn tại");

                var groupMember = await _unitOfWork.GroupMemberRepository.GetGroupMemberByGroupIdAndUserId(request.GroupId, inviteeId);
                if (groupMember != null) throw new AppException("Tồn tại user đã là thành viên của nhóm");

                var existedInvitation = await _unitOfWork.GroupInvitationRepository.GetGroupInvitationByInviterIdAndInviteeIdAndGroupIdAsync(userId, inviteeId, request.GroupId);
                if(existedInvitation != null) throw new AppException("Đã tồn tại lời mời tham gia");

                await _unitOfWork.GroupInvitationRepository.CreateNewGroupInvitationAsync(invitation);

                var notification = new Domain.Entity.System.Notification()
                {
                    GroupId = request.GroupId,
                    GroupInvitationId = invitation.Id,
                    ImageUrl = userAvatar,
                    Content = $"{userFullName} đã mời bạn tham gia nhóm {group.Name}",
                    IsRead = false,
                    Title = "Mời tham gia nhóm",
                    RecipientId = inviteeId,
                    Recipient = user,
                    Type = NotificationType.INVITE_JOIN_GROUP,
                    DateSent = DateTimeOffset.UtcNow,
                };

                await _unitOfWork.NotificationRepository.CreateNotificationAsync(notification);

                pushNotiUsers.Add(ApplicationMapper.MapToNotification(notification));
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            foreach(var item in pushNotiUsers)
            {
                await _signalRService.SendNotificationToSpecificUser(item.Recipient.Email, item);
            }


            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Gửi lời mời tham gia nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
