
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Requests;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Message.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
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


        public CreateMessageHandler(IUnitOfWork unitOfWork, ISignalRService signalRService, IHttpContextAccessor contextAccessor, ICloudinaryService cloudinaryService, UserManager<Domain.Entity.System.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _signalRService = signalRService;
            _contextAccessor = contextAccessor;
            _cloudinaryService = cloudinaryService;
            _userManager = userManager;
        }

        public async Task<BaseResponse> Handle(CreateMessageCommand request, CancellationToken cancellationToken)
        {
            Domain.Entity.ChatRoomInfo.ChatRoom chatRoom = await _unitOfWork.ChatRoomRepository.GetChatRoomByUniqueNameAsync(request.ChatRoomName)
                ?? throw new AppException("Nhóm chat không tồn tại");

            var userId = _contextAccessor.HttpContext.User.GetUserId();

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

            await _unitOfWork.CommitTransactionAsync();

            await _signalRService.SendMessageToSpecificGroup(chatRoom.UniqueName, ApplicationMapper.MapToMessage(message));

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Gửi tin nhắn thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
