using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.ChatRoom.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Interfaces.Services.Redis;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Application.Utils;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.ChatRoomInfo;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Features.ChatRoom.Handlers
{
    public class CreateChatRoomHandler : IRequestHandler<CreateChatRoomCommand, BaseResponse>
    {
        private const string PREFIX_FILE_API = "/api/files/images/";
        private const string GROUP_FILENAME = "group.png";
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;
        private readonly IConfiguration _configuration;

        public CreateChatRoomHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
            _configuration = configuration;
        }
        public async Task<BaseResponse> Handle(CreateChatRoomCommand request, CancellationToken cancellationToken)
        {
           
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var userFullname = _contextAccessor.HttpContext.User.GetFullName();
            var friendShips = await _unitOfWork.FriendShipRepository.GetAllFriendShipsAsyncByUserId(userId, FriendShipStatus.ACCEPTED);

            var members = new List<ChatRoomMember>
            {
                new ChatRoomMember()
                {
                    UserId = userId,
                    IsLeader = true,
                }
            };

            foreach (var friendId in request.MemberIds)
            {
                if (!friendShips.Any(friendship => friendship.UserId == userId ? friendship.FriendId == friendId : friendship.UserId == friendId)) throw new AppException($"Bạn không thể thêm {friendId} vì không phải là bạn bè");
                var friend = await _unitOfWork.UserRepository
                    .GetUserByIdAsync(friendId);

                if (friend == null) throw new AppException("Vui lòng kiểm tra lại ID bạn bè thêm vào");

                members.Add(new ChatRoomMember()
                {
                    UserId = friendId,
                    User = friend,
                    IsAccepted = true,
                    IsLeader = false
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
                Members = members,
                ImageUrl = _configuration["ServerHost"] + PREFIX_FILE_API + GROUP_FILENAME
        };

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            await _unitOfWork.ChatRoomRepository.CreateChatRoom(chatRoom);

            var listMsg = new List<Domain.Entity.MessageInfo.Message>();
            var message = new Domain.Entity.MessageInfo.Message()
            {
                MessageType = MessageType.SYSTEM,
                Content = $"{userFullname} đã tạo nhóm",
                ChatRoomId = chatRoom.Id,
                SentAt = DateTimeOffset.UtcNow,
            };

            await _unitOfWork.MessageRepository.CreateMessageAsync(message);

            listMsg.Add(message);

            foreach (var member in members)
            {
                var messageItem = new Domain.Entity.MessageInfo.Message()
                {
                    MessageType = MessageType.SYSTEM,
                    Content = $"{userFullname} đã thêm {member.User.FullName} vào nhóm",
                    ChatRoomId = chatRoom.Id,
                    SentAt = DateTimeOffset.UtcNow,
                };

                await _unitOfWork.MessageRepository.CreateMessageAsync(messageItem);
                listMsg.Add(messageItem);
            }
         
            await _unitOfWork.CommitTransactionAsync(cancellationToken);
            
            foreach(var member in members)
            {
                await _signalRService.JoinGroup(member.UserId, chatRoomName);
            }

            foreach (var msg in listMsg.AsEnumerable().Reverse().ToList())
            {
                await _signalRService.SendMessageToSpecificGroup(chatRoomName, ApplicationMapper.MapToMessage(msg));
            }

            return new BaseResponse()
            {
                Message = "Tạo nhóm chat thành công",
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
