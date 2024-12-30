
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.ChatRoom.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Features.ChatRoom.Handlers
{
    public class GetChatRoomByIdHandler : IRequestHandler<GetChatRoomByIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetChatRoomByIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(GetChatRoomByIdQuery request, CancellationToken cancellationToken)
        {
            var chatRoom = await _unitOfWork.ChatRoomRepository.GetChatRoomByIdAsync(request.ChatRoomId)
                ?? throw new NotFoundException("Không tìm cuộc hội thoại");

            var response = ApplicationMapper.MapToChatRoom(chatRoom);
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var friend = chatRoom.Members.Count == 2 ? chatRoom.Members.SingleOrDefault(m => m.UserId != userId) : null;
            response.Friend = friend != null ? ApplicationMapper.MapToUser(friend.User) : null;

            return new DataResponse<ChatRoomResponse>
            {
                Data = response,
                Message = "Lấy thông tin cuộc hội thoại thành công",
                IsSuccess = true
            };
        }
    }
}
