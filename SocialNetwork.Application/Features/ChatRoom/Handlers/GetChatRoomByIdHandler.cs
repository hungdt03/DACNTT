
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
            var friend = chatRoom.Members.Count == 2 ? chatRoom.Members.SingleOrDefault(m => m.UserId != userId) : null;

            if (friend != null)
            {
                var isOnline = await _userStatusService.IsUserActiveAsync(friend.UserId);
                response.Friend = ApplicationMapper.MapToUser(friend.User);
                response.Friend.IsOnline = response.IsOnline = isOnline;

                if (!isOnline)
                {
                    var recentOnlineTime = await _userStatusService.GetLastActiveTimeAsync(userId);
                    DateTimeOffset utcDateTimeOffset = DateTimeOffset.Parse(recentOnlineTime).ToUniversalTime();
                    response.Friend.RecentOnlineTime = response.RecentOnlineTime = utcDateTimeOffset;
                }
            }
            else
            {
                DateTimeOffset? mostRecentOnlineTime = null;

                foreach (var member in chatRoom.Members)
                {
                    var isMemberOnline = await _userStatusService.IsUserActiveAsync(member.UserId);
                    if(isMemberOnline)
                    {
                        response.IsOnline = true;
                        break;
                    }

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
                    response.RecentOnlineTime = mostRecentOnlineTime.Value;
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
