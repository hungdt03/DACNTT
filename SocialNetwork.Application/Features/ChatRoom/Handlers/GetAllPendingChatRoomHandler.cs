
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.ChatRoom.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.ChatRoom.Handlers
{
    public class GetAllPendingChatRoomHandler : IRequestHandler<GetAllPendingChatRoomQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllPendingChatRoomHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllPendingChatRoomQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var chatRooms = await _unitOfWork.ChatRoomRepository.GetAllPrivateChatRoomsByUserIdAsync(userId);

            var response = new List<ChatRoomResponse>();

            foreach (var chatRoom in chatRooms)
            {
                var isAccepted = chatRoom.Members.FirstOrDefault(s => s.UserId == userId)?.IsAccepted ?? false;
                if(isAccepted || string.IsNullOrEmpty(chatRoom.LastMessage)) continue;

                var friend = chatRoom.Members.Count == 2 ? chatRoom.Members.SingleOrDefault(m => m.UserId != userId) : null;
                var item = ApplicationMapper.MapToChatRoom(chatRoom);
                if(friend != null)
                {
                    item.Friend = ApplicationMapper.MapToFriend(friend.User);
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
                Message = "Lấy tất cả nhóm chat đang chờ thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
