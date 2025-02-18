
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
using SocialNetwork.Domain.Constants;
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
                var checkBlock = await _unitOfWork.BlockListRepository
                       .GetBlockListByUserIdAndUserIdAsync(friend.UserId, userId);

                response.Friend = ApplicationMapper.MapToUser(friend.User);
                response.IsOnline = friend.User.IsOnline;

                if (checkBlock != null)
                {
                    response.Friend.HaveStory = false;
                    response.Friend.IsShowStatus = false;
                    response.Friend.IsOnline = false;
                }
                else
                {
                    var haveStory = await _unitOfWork.StoryRepository
                       .IsUserHaveStoryAsync(friend.UserId);
                    response.Friend.HaveStory = haveStory;
                }

                var friendShip = await _unitOfWork.FriendShipRepository
                       .GetFriendShipByUserIdAndFriendIdAsync(userId, friend.UserId);

                if (friendShip != null && friendShip.IsConnect && friendShip.Status != FriendShipStatus.ACCEPTED)
                {
                    response.IsConnect = true;
                }
                else if (friendShip != null && friendShip.Status != FriendShipStatus.ACCEPTED)
                {
                    response.IsFriend = true;
                }


                response.IsAccept = chatRoom.Members.FirstOrDefault(s => s.UserId == userId).IsAccepted;
                response.IsRecipientAccepted = chatRoom.Members.FirstOrDefault(s => s.UserId != userId)?.IsAccepted ?? false;
                
                if (!response.IsOnline)
                {
                    response.RecentOnlineTime = response.Friend.RecentOnlineTime;
                }
            }
            else
            {
                DateTimeOffset lastOnlineTime = DateTimeOffset.MinValue;

                foreach (var member in chatRoom.Members)
                {
                    if (member.UserId == userId) continue;
                    if (member.User.IsOnline)
                    {
                        response.IsOnline = true;
                        break;
                    }

                    if (member.User.RecentOnlineTime > lastOnlineTime)
                    {
                        lastOnlineTime = member.User.RecentOnlineTime;
                    }
                }

                response.RecentOnlineTime = lastOnlineTime;
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
