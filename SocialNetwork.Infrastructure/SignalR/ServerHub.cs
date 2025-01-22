
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Requests;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services.Redis;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity;
using SocialNetwork.Infrastructure.SignalR.Payload;

namespace SocialNetwork.Infrastructure.SignalR
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ServerHub : Hub
    {
        private readonly UserManager<Domain.Entity.User> userManager;
        private readonly IUnitOfWork unitOfWork;
        private readonly IUserStatusService userStatusService;
        private readonly ILogger<ServerHub> logger;

        public ServerHub(UserManager<Domain.Entity.User> userManager, IUnitOfWork unitOfWork, IUserStatusService userStatusService, ILogger<ServerHub> logger)
        {
            this.userManager = userManager;
            this.unitOfWork = unitOfWork;
            this.userStatusService = userStatusService;
            this.logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User.GetUserId();
            logger.LogInformation("============NEW CONNECTED=============");
            logger.LogInformation(userId);
            logger.LogInformation(Context.ConnectionId);

            await userStatusService.AddConnectionAsync(userId, Context.ConnectionId);

            var chatRooms = await unitOfWork.ChatRoomRepository.GetAllChatRoomsByUserIdAsync(userId);
            await JoinChatRooms(chatRooms);
            await base.OnConnectedAsync();
        }

        private async Task JoinChatRooms(List<ChatRoom> chatRooms)
        {
            foreach (var chatRoom in chatRooms)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, chatRoom.UniqueName);
            }
        }

        public async Task SendMessage(MessageRequest messageRequest)
        {
            var userId = Context.User.GetUserId();

            User senderUser = await userManager.FindByIdAsync(userId)
                ?? throw new AppException("Thông tin người gửi không tồn tại");

            ChatRoom chatRoom = await unitOfWork.ChatRoomRepository.GetChatRoomByUniqueNameAsync(messageRequest.ChatRoomName)
                ?? throw new AppException("Nhóm chat không tồn tại");

            await unitOfWork.BeginTransactionAsync();

            var recentReadStatus = await unitOfWork.MessageReadStatusRepository.GetMessageReadStatusByUserAndChatRoomId(userId, chatRoom.Id);

            var message = new Message()
            {
                ChatRoomId = chatRoom.Id,
                Content = messageRequest.Content,
                Sender = senderUser,
                SenderId = userId,
                MessageType = MessageType.NORMAL,
                SentAt = messageRequest.SentAt,
            };

            await unitOfWork.MessageRepository.CreateMessageAsync(message);

            if (recentReadStatus == null)
            {
                recentReadStatus = new MessageReadStatus()
                {
                    UserId = userId,
                    User = senderUser,
                    IsRead = true,
                    ReadAt = DateTimeOffset.UtcNow,
                    MessageId = message.Id,
                };

                await unitOfWork.MessageReadStatusRepository.CreateMessageReadStatusAsync(recentReadStatus);
            }
            else 
            {
                recentReadStatus.MessageId = message.Id;
                recentReadStatus.ReadAt = DateTimeOffset.UtcNow;
            }

            chatRoom.LastMessage = message.Content;
            chatRoom.LastMessageDate = DateTimeOffset.UtcNow;

            await unitOfWork.CommitTransactionAsync();

            await Clients.Group(chatRoom.UniqueName).SendAsync("NewMessage", ApplicationMapper.MapToMessage(message));
        }

        public async Task TypingMessage(string groupName, string fullName)
        {
            var content = fullName + " đang soạn tin nhắn";
            await Clients.OthersInGroup(groupName).SendAsync("TypingMessage", groupName, content);
        }

        public async Task StopTypingMessage(string groupName)
        {
            await Clients.OthersInGroup(groupName).SendAsync("StopTypingMessage", groupName);
        }

        public async Task CallFriend(CallPayload payload)
        {
            var user = await userManager.FindByIdAsync(Context.User.GetUserId());
            await Clients.OthersInGroup(payload.ChatRoomName).SendAsync("CallFriend", new
            {
                SignalData = payload.SignalData,
                ChatRoomName = payload.ChatRoomName,
                From = ApplicationMapper.MapToUser(user),
            });
        }

        public async Task AnswerCall(AnswerPayload payload)
        {
            var user = await userManager.FindByIdAsync(Context.User.GetUserId());
            await Clients.OthersInGroup(payload.ChatRoomName).SendAsync("AcceptCall", new {
                SignalData = payload.SignalData,
                From = ApplicationMapper.MapToUser(user),
            });
        }

        public async Task LeaveCall(string chatRoomName)
        {
            await Clients.Group(chatRoomName).SendAsync("LeaveCall");
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User.GetUserId();
            logger.LogInformation("============DISCONNECTED=============");
            logger.LogInformation(userId);
            logger.LogInformation(Context.ConnectionId);
            await userStatusService.RemoveConnectionAsync(userId, Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
