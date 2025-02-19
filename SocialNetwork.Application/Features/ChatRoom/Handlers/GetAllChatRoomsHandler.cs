

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.ChatRoom.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services.Redis;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

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

            foreach (var chatRoom in chatRooms)
            {
                var friend = chatRoom.IsPrivate ? chatRoom.Members.SingleOrDefault(m => m.UserId != userId) : null;
                var item = ApplicationMapper.MapToChatRoom(chatRoom);

                if(friend != null)
                {
                    var checkBlock = await _unitOfWork.BlockListRepository
                        .GetBlockListByUserIdAndUserIdAsync(friend.UserId, userId);

                    item.Friend = ApplicationMapper.MapToUser(friend.User);
                    item.IsOnline = item.Friend.IsOnline;

                    if (checkBlock != null)
                    {
                        item.IsOnline = item.Friend.IsOnline = false;
                        item.Friend.IsShowStatus = false;
                        item.Friend.HaveStory = false;
                    }

                    var haveStory = await _unitOfWork.StoryRepository
                           .IsUserHaveStoryAsync(friend.UserId);
                    item.Friend.HaveStory = haveStory;

                    var friendShip = await _unitOfWork.FriendShipRepository
                        .GetFriendShipByUserIdAndFriendIdAsync(userId, friend.UserId);

                    if(friendShip != null && friendShip.IsConnect && friendShip.Status != FriendShipStatus.ACCEPTED)
                    {
                        item.IsConnect = true;
                    } else if(friendShip != null && friendShip.Status != FriendShipStatus.ACCEPTED)
                    {
                        item.IsFriend = true;
                    }

                    item.IsMember = true;
                    item.IsAccept = chatRoom.Members.FirstOrDefault(s => s.UserId == userId)?.IsAccepted ?? false;
                    item.IsRecipientAccepted = chatRoom.Members.FirstOrDefault(s => s.UserId != userId)?.IsAccepted ?? false;
                    item.RecentOnlineTime = friend.User.RecentOnlineTime;

                } else
                {
                    var chatRoomMember = await _unitOfWork.ChatRoomMemberRepository
                        .GetChatRoomMemberByRoomIdAndUserId(chatRoom.Id, userId);

                    item.IsMember = true;
                    item.IsAdmin = chatRoomMember != null && chatRoomMember.IsLeader;

                    DateTimeOffset lastOnlineTime = DateTimeOffset.MinValue;

                    foreach(var member in chatRoom.Members)
                    {
                        if (member.UserId == userId) continue;
                        if(member.User.IsOnline)
                        {
                            item.IsOnline = true;
                            break;
                        }

                        if (member.User.RecentOnlineTime > lastOnlineTime)
                        {
                            lastOnlineTime = member.User.RecentOnlineTime;
                        }
                    }

                    item.RecentOnlineTime = lastOnlineTime;
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
