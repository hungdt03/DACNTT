﻿

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.ChatRoom.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services.Redis;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.ChatRoom.Handlers
{
    public class SearchChatRoomByNameHandler : IRequestHandler<SearchChatRoomByNameQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUserStatusService _userStatusService;

        public SearchChatRoomByNameHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, IUserStatusService userStatusService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _userStatusService = userStatusService;
        }

        public async Task<BaseResponse> Handle(SearchChatRoomByNameQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var chatRooms = await _unitOfWork.ChatRoomRepository.GetChatRoomsByNameAndUserIdAsync(request.Name, userId);

            var response = new List<ChatRoomResponse>();

            foreach (var chatRoom in chatRooms)
            {

                var friend = chatRoom.Members.Count == 2 ? chatRoom.Members.SingleOrDefault(m => m.UserId != userId) : null;
                var item = ApplicationMapper.MapToChatRoom(chatRoom);
                item.IsAccept = chatRoom.Members.FirstOrDefault(s => s.UserId == userId)?.IsAccepted ?? false;
                item.IsRecipientAccepted = chatRoom.Members.FirstOrDefault(s => s.UserId != userId)?.IsAccepted ?? false;

                if (friend != null)
                {
                    var isOnline = await _userStatusService.HasConnectionsAsync(friend.UserId);
                    item.Friend = ApplicationMapper.MapToUser(friend.User);
                    item.Friend.IsOnline = item.IsOnline = isOnline;

                    if (!isOnline)
                    {
                        item.RecentOnlineTime = friend.User.RecentOnlineTime;
                    }
                }
                else
                {
                    DateTimeOffset lastOnlineTime = DateTimeOffset.MinValue;

                    foreach (var member in chatRoom.Members)
                    {
                        var hasConnections = await _userStatusService.HasConnectionsAsync(member.UserId);
                        if (hasConnections)
                        {
                            item.IsOnline = true;
                            break;
                        }

                        if (member.User.RecentOnlineTime > lastOnlineTime)
                        {
                            lastOnlineTime = member.User.RecentOnlineTime;
                        }
                    }

                    if (!item.IsOnline)
                    {
                        item.RecentOnlineTime = lastOnlineTime;
                    }
                }

                var lastMessage = await _unitOfWork.MessageRepository.GetLastMessageByGroupIdAsync(chatRoom.Id);

                if (lastMessage != null)
                {
                    var readUsers = await _unitOfWork.MessageReadStatusRepository.GetMessageReadStatusesByMessageId(lastMessage.Id);
                    var isRead = readUsers.Any(s => s.UserId == userId);
                    item.IsRead = isRead;
                }

                response.Add(item);
            }

            return new DataResponse<List<ChatRoomResponse>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy tất cả nhóm chat thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
