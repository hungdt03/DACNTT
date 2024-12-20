

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
    public class GetAllChatRoomsHandler : IRequestHandler<GetAllChatRoomsQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllChatRoomsHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllChatRoomsQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var chatRooms = await _unitOfWork.ChatRoomRepository.GetAllChatRoomsByUserIdAsync(userId);

            var response = new List<ChatRoomResponse>();

            foreach(var chatRoom in chatRooms)
            {
                var item = ApplicationMapper.MapToChatRoom(chatRoom);
                var friend = chatRoom.Members.Count == 2 ? chatRoom.Members.SingleOrDefault(m => m.UserId != userId) : null;
                item.Friend = friend != null ? ApplicationMapper.MapToUser(friend.User) : null;
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
