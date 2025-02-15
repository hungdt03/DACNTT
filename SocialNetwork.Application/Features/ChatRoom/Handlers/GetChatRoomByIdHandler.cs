﻿
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.ChatRoom.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services.Redis;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Features.ChatRoom.Handlers
{
    public class GetChatRoomByIdHandler : IRequestHandler<GetChatRoomByIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUserStatusService _userStatusService;

        public GetChatRoomByIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, IUserStatusService userStatusService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _userStatusService = userStatusService;
        }
        public async Task<BaseResponse> Handle(GetChatRoomByIdQuery request, CancellationToken cancellationToken)
        {
            var chatRoom = await _unitOfWork.ChatRoomRepository.GetChatRoomByIdAsync(request.ChatRoomId)
                ?? throw new NotFoundException("Không tìm cuộc hội thoại");

            var response = ApplicationMapper.MapToChatRoom(chatRoom);
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var friend = chatRoom.IsPrivate ? chatRoom.Members.SingleOrDefault(m => m.UserId != userId) : null;

            if (friend != null)
            {
                var isOnline = await _userStatusService.HasConnectionsAsync(friend.UserId);
                response.Friend = ApplicationMapper.MapToUser(friend.User);
                response.Friend.IsOnline = response.IsOnline = isOnline;

                var haveStory = await _unitOfWork.StoryRepository
                       .IsUserHaveStoryAsync(friend.UserId);

                response.Friend.HaveStory = haveStory;
                response.IsAccept = chatRoom.Members.FirstOrDefault(s => s.UserId == userId).IsAccepted;
                response.IsRecipientAccepted = chatRoom.Members.FirstOrDefault(s => s.UserId != userId)?.IsAccepted ?? false;
                
                if (!isOnline)
                {
                    response.RecentOnlineTime = response.Friend.RecentOnlineTime;
                }
            }
            else
            {
                DateTimeOffset? lastOnlineTime = null;

                foreach (var member in chatRoom.Members)
                {
                    if (member.UserId == userId) continue;
                    var hasConnections = await _userStatusService.HasConnectionsAsync(member.UserId);
                    if (hasConnections)
                    {
                        response.IsOnline = true;
                        break;
                    }

                    if (member.User.RecentOnlineTime > lastOnlineTime)
                    {
                        lastOnlineTime = member.User.RecentOnlineTime;
                    }
                }

                var chatRoomMember = await _unitOfWork.ChatRoomMemberRepository
                        .GetChatRoomMemberByRoomIdAndUserId(chatRoom.Id, userId);

                response.IsMember = chatRoomMember != null;
                response.IsAdmin = chatRoomMember != null && chatRoomMember.IsLeader;
            }

            return new DataResponse<ChatRoomResponse>
            {
                Data = response,
                Message = "Lấy thông tin cuộc hội thoại thành công",
                IsSuccess = true
            };
        }
    }
}
