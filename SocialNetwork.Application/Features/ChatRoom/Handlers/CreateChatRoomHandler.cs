using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.ChatRoom.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Utils;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.ChatRoomInfo;

namespace SocialNetwork.Application.Features.ChatRoom.Handlers
{
    public class CreateChatRoomHandler : IRequestHandler<CreateChatRoomCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public CreateChatRoomHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }
        public async Task<BaseResponse> Handle(CreateChatRoomCommand request, CancellationToken cancellationToken)
        {
           
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var friendShips = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(userId, FriendShipStatus.ACCEPTED);

            var members = new List<ChatRoomMember>();
            members.Add(new ChatRoomMember()
            {
                UserId = userId,
            });
            foreach (var friendId in request.MemberIds)
            {
                if (!friendShips.Any(friendship => friendship.UserId == userId ? friendship.FriendId == friendId : friendship.UserId == friendId)) throw new AppException($"Bạn không thể thêm {friendId} vì không phải là bạn bè");
                members.Add(new ChatRoomMember()
                {
                    UserId = friendId,
                });
            }

            var chatRoomName = ChatUtils.GenerateChatRoomName(request.MemberIds);
            var chatRoom = new Domain.Entity.ChatRoomInfo.ChatRoom()
            {
                IsPrivate = false,
                LastMessageDate = DateTimeOffset.UtcNow,
                UniqueName = chatRoomName,
                Name = request.GroupName,
                LastMessage = "Các bạn hiện đã được kết nối với nhau",
                Members = members
            };

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            await _unitOfWork.ChatRoomRepository.CreateChatRoom(chatRoom);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                Message = "Tạo nhóm chat thành công",
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
