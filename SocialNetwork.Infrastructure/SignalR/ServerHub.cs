
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
using SocialNetwork.Application.Utils;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.ChatRoomInfo;
using SocialNetwork.Domain.Entity.System;
using SocialNetwork.Infrastructure.SignalR.Payload;
using System.Runtime.InteropServices;

namespace SocialNetwork.Infrastructure.SignalR
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ServerHub : Hub
    {
        private readonly UserManager<User> userManager;
        private readonly IUnitOfWork unitOfWork;
        private readonly IUserStatusService userStatusService;
        private readonly ILogger<ServerHub> logger;

        public ServerHub(UserManager<User> userManager, IUnitOfWork unitOfWork, IUserStatusService userStatusService, ILogger<ServerHub> logger)
        {
            this.userManager = userManager;
            this.unitOfWork = unitOfWork;
            this.userStatusService = userStatusService;
            this.logger = logger;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User.GetUserId();
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
                ?? throw new NotFoundException("Hội thoại không tồn tại");
            
            await unitOfWork.BeginTransactionAsync();
            var recentReadStatus = await unitOfWork.MessageReadStatusRepository.GetMessageReadStatusByUserAndChatRoomId(userId, chatRoom.Id);

            var message = new Domain.Entity.MessageInfo.Message()
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
                recentReadStatus = new Domain.Entity.MessageInfo.MessageReadStatus()
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

            Domain.Entity.MessageInfo.Message systemMessage = null;

            if (chatRoom.IsPrivate)
            {
                var senderMember = chatRoom.Members.FirstOrDefault(x => x.UserId == userId);
                var recipientMember = chatRoom.Members.FirstOrDefault(x => x.UserId != userId);

                if (senderMember != null && recipientMember != null && !senderMember.IsAccepted)
                {
                    if(recipientMember.IsAccepted)
                    {
                        string content = "Giờ đây, các bạn có thể nhắn tin cho nhau, xem những thông tin như Trạng thái hoạt động và thời điểm đọc tin nhắn.";

                        systemMessage = new Domain.Entity.MessageInfo.Message()
                        {
                            ChatRoomId = chatRoom.Id,
                            Content = content,
                            MessageType = MessageType.SYSTEM,
                            SentAt = DateTimeOffset.UtcNow,
                        };

                        var friendShip = await unitOfWork.FriendShipRepository
                            .GetFriendShipByUserIdAndFriendIdAsync(senderMember.UserId, recipientMember.UserId);

                        if(friendShip != null)
                        {
                            friendShip.IsConnect = true;
                        } else
                        {
                            friendShip = new Domain.Entity.UserInfo.FriendShip()
                            {
                                UserId = userId,
                                FriendId = recipientMember.UserId,
                                Status = FriendShipStatus.NONE,
                                IsConnect = true
                            };

                            await unitOfWork.FriendShipRepository.CreateFriendShipAsync(friendShip);
                        }

                        await unitOfWork.MessageRepository.CreateMessageAsync(systemMessage);
                    }
                    
                    senderMember.IsAccepted = true;

                    var connections = await userStatusService.GetAllConnections(userId);
                    connections.ForEach(async connection =>
                    {
                        await Groups.AddToGroupAsync(Context.ConnectionId, chatRoom.UniqueName);
                    });
                }
            }

            await unitOfWork.CommitTransactionAsync();

            await Clients.Group(chatRoom.UniqueName).SendAsync("NewMessage", ApplicationMapper.MapToMessage(message));
            
            if(systemMessage != null)
            {
                await Clients.Group(chatRoom.UniqueName).SendAsync("NewMessage", ApplicationMapper.MapToMessage(systemMessage));
            }
           
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
            await userStatusService.RemoveConnectionAsync(userId, Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
