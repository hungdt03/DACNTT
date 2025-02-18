
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Requests;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Message.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Interfaces.Services.Redis;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.MessageInfo;

namespace SocialNetwork.Application.Features.Message.Handlers
{
    public class CreateMessageHandler : IRequestHandler<CreateMessageCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISignalRService _signalRService;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ICloudinaryService _cloudinaryService;
        private readonly UserManager<Domain.Entity.System.User> _userManager;
        private readonly IUserStatusService _userStatusService;


        public CreateMessageHandler(IUnitOfWork unitOfWork, ISignalRService signalRService, IHttpContextAccessor contextAccessor, ICloudinaryService cloudinaryService, UserManager<Domain.Entity.System.User> userManager, IUserStatusService userStatusService)
        {
            _unitOfWork = unitOfWork;
            _signalRService = signalRService;
            _contextAccessor = contextAccessor;
            _cloudinaryService = cloudinaryService;
            _userManager = userManager;
            _userStatusService = userStatusService;
        }

        public async Task<BaseResponse> Handle(CreateMessageCommand request, CancellationToken cancellationToken)
        {
            Domain.Entity.ChatRoomInfo.ChatRoom chatRoom = await _unitOfWork.ChatRoomRepository.GetChatRoomByUniqueNameAsync(request.ChatRoomName)
                ?? throw new AppException("Nhóm chat không tồn tại");

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var senderUser = await _userManager.FindByIdAsync(userId)
               ?? throw new AppException("Thông tin người gửi không tồn tại");

            if (!chatRoom.IsPrivate)
            {
                var chatRoomMember = await _unitOfWork
                    .ChatRoomMemberRepository.GetChatRoomMemberByRoomIdAndUserId(chatRoom.Id, userId);

                if (chatRoomMember == null)
                {
                    var errorMessage = new MessageResponse()
                    {
                        Id = Guid.NewGuid(),
                        ChatRoomId = chatRoom.Id,
                        Content = "Bạn không còn là thành viên của nhóm nữa",
                        MessageType = MessageType.ERROR,
                        SentAt = request.SentAt,
                        SenderId = userId,
                        Sender = ApplicationMapper.MapToUser(senderUser)
                    };

                    return new DataResponse<MessageResponse>()
                    {
                        Data = errorMessage,
                        IsSuccess = true,
                        Message = "Bạn không còn là thành viên của nhóm nữa",
                        StatusCode = System.Net.HttpStatusCode.OK
                    };
                }
            }

            var medias = new List<MessageMedia>();

            if (request.Images?.Any() == true)
            {
                var images = await _cloudinaryService.UploadMultipleImagesAsync(request.Images);
                medias.AddRange(images.Select(image => new MessageMedia
                {
                    MediaType = MediaType.IMAGE,
                    MediaUrl = image
                }));
            }

            if (request.Videos?.Any() == true)
            {
                var videos = await _cloudinaryService.UploadMultipleVideosAsync(request.Videos);
                medias.AddRange(videos.Select(video => new MessageMedia
                {
                    MediaType = MediaType.VIDEO,
                    MediaUrl = video
                }));
            }

            await _unitOfWork.BeginTransactionAsync();

            var recentReadStatus = await _unitOfWork.MessageReadStatusRepository.GetMessageReadStatusByUserAndChatRoomId(userId, chatRoom.Id);

            var message = new Domain.Entity.MessageInfo.Message()
            {
                ChatRoomId = chatRoom.Id,
                Content = request.Content,
                SenderId = userId,
                MessageType = MessageType.NORMAL,
                SentAt = request.SentAt,
                Medias = medias
            };

            await _unitOfWork.MessageRepository.CreateMessageAsync(message);

            if (recentReadStatus == null)
            {
                recentReadStatus = new MessageReadStatus()
                {
                    UserId = userId,
                    IsRead = true,
                    ReadAt = DateTimeOffset.UtcNow,
                    MessageId = message.Id,
                };

                await _unitOfWork.MessageReadStatusRepository.CreateMessageReadStatusAsync(recentReadStatus);
            }
            else
            {
                recentReadStatus.MessageId = message.Id;
                recentReadStatus.ReadAt = DateTimeOffset.UtcNow;
            }

            if(message.Medias.Count > 0)
            {
                var fullName = _contextAccessor.HttpContext.User.GetFullName();
                chatRoom.LastMessage = $"{fullName} đã gửi {medias.Count} tập tin đính kèm";

            } else if(string.IsNullOrEmpty(message.Content))
                chatRoom.LastMessage = message.Content;

            chatRoom.LastMessageDate = DateTimeOffset.UtcNow;

            Domain.Entity.MessageInfo.Message systemMessage = null;

            if (chatRoom.IsPrivate)
            {
                var senderMember = chatRoom.Members.FirstOrDefault(x => x.UserId == userId);
                var recipientMember = chatRoom.Members.FirstOrDefault(x => x.UserId != userId);

                if (senderMember != null && recipientMember != null && !senderMember.IsAccepted)
                {
                    if (recipientMember.IsAccepted)
                    {
                        string content = "Giờ đây, các bạn có thể nhắn tin cho nhau, xem những thông tin như Trạng thái hoạt động và thời điểm đọc tin nhắn.";

                        systemMessage = new Domain.Entity.MessageInfo.Message()
                        {
                            ChatRoomId = chatRoom.Id,
                            Content = content,
                            MessageType = MessageType.SYSTEM,
                            SentAt = DateTimeOffset.UtcNow,
                        };

                        var friendShip = await _unitOfWork.FriendShipRepository
                            .GetFriendShipByUserIdAndFriendIdAsync(senderMember.UserId, recipientMember.UserId);

                        if (friendShip != null)
                        {
                            friendShip.IsConnect = true;
                        }
                        else
                        {
                            friendShip = new Domain.Entity.UserInfo.FriendShip()
                            {
                                UserId = userId,
                                FriendId = recipientMember.UserId,
                                Status = FriendShipStatus.NONE,
                                IsConnect = true
                            };

                            await _unitOfWork.FriendShipRepository.CreateFriendShipAsync(friendShip);
                        }

                        await _unitOfWork.MessageRepository.CreateMessageAsync(systemMessage);
                    }
                    senderMember.IsAccepted = true;

                    await _signalRService.JoinGroup(userId, chatRoom.UniqueName);

                }
                else if (senderMember != null && recipientMember != null && senderMember.IsAccepted)
                {
                    var block = await _unitOfWork.BlockListRepository
                        .GetBlockListByUserIdAndUserIdAsync(senderMember.UserId, recipientMember.UserId);

                    if (block != null)
                    {
                        throw new AppException("Bạn không thể nhắn tin cho người này");
                    }
                }
            }

            await _unitOfWork.CommitTransactionAsync();

            await _signalRService.SendMessageToSpecificGroup(chatRoom.UniqueName, ApplicationMapper.MapToMessage(message));

            if (systemMessage != null)
            {
                var mapSystemMsg = ApplicationMapper.MapToMessage(systemMessage);
                mapSystemMsg.IsFetch = true;
                await _signalRService.SendMessageToSpecificGroup(chatRoom.UniqueName, mapSystemMsg);
            }

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Gửi tin nhắn thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
