

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
    public class GetAllChatRoomsHandler : IRequestHandler<GetAllChatRoomsQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUserStatusService _userStatusService;

        public GetAllChatRoomsHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, IUserStatusService userStatusService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _userStatusService = userStatusService;
        }

        public async Task<BaseResponse> Handle(GetAllChatRoomsQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var chatRooms = await _unitOfWork.ChatRoomRepository.GetAllChatRoomsByUserIdAsync(userId);

            var response = new List<ChatRoomResponse>();

            var onlineUsers = await _userStatusService.GetAllActiveUsersAsync();
            foreach (var chatRoom in chatRooms)
            {
                var friend = chatRoom.Members.Count == 2 ? chatRoom.Members.SingleOrDefault(m => m.UserId != userId) : null;
                var item = ApplicationMapper.MapToChatRoom(chatRoom);

                if(friend != null)
                {
                    var isOnline = onlineUsers.Any(s => s == friend.UserId);
                    item.Friend = ApplicationMapper.MapToUser(friend.User);
                    item.Friend.IsOnline = item.IsOnline = isOnline;

                    var haveStory = await _unitOfWork.StoryRepository
                        .IsUserHaveStoryAsync(friend.UserId);

                    item.Friend.HaveStory = haveStory;

                    item.IsAccept = chatRoom.Members.FirstOrDefault(s => s.UserId == userId)?.IsAccepted ?? false;
                    item.IsRecipientAccepted = chatRoom.Members.FirstOrDefault(s => s.UserId != userId)?.IsAccepted ?? false;

                    if (!isOnline)
                    {
                        var recentOnlineTime = await _userStatusService.GetLastActiveTimeAsync(userId);
                        DateTimeOffset utcDateTimeOffset = DateTimeOffset.Parse(recentOnlineTime).ToUniversalTime();
                        item.Friend.RecentOnlineTime = item.RecentOnlineTime = utcDateTimeOffset;
                    }
                } else
                {
                    var offlineMembers = chatRoom.Members.Where(s => !onlineUsers.Any(m => m == s.UserId)).ToList();
                    var isOnline = offlineMembers.Count < item.Members.Count;
                    item.IsOnline = isOnline;

                    if (!isOnline)
                    {
                        DateTimeOffset? mostRecentOnlineTime = null;

                        foreach (var member in offlineMembers)
                        {
                            var recentOnlineTime = await _userStatusService.GetLastActiveTimeAsync(member.UserId);

                            if (DateTimeOffset.TryParse(recentOnlineTime.ToString(), out var parsedTime))
                            {
                                if (mostRecentOnlineTime == null || parsedTime > mostRecentOnlineTime)
                                {
                                    mostRecentOnlineTime = parsedTime;
                                }
                            }
                        }


                        if (mostRecentOnlineTime != null && mostRecentOnlineTime.HasValue)
                            item.RecentOnlineTime = mostRecentOnlineTime.Value;
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
