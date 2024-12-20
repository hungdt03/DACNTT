
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Message.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Features.Message.Handlers
{
    public class CreateMessageHandler : IRequestHandler<CreateMessageCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISignalRService _signalRService;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ICloudinaryService _cloudinaryService;


        public CreateMessageHandler(IUnitOfWork unitOfWork, ISignalRService signalRService, IHttpContextAccessor contextAccessor, ICloudinaryService cloudinaryService)
        {
            _unitOfWork = unitOfWork;
            _signalRService = signalRService;
            _contextAccessor = contextAccessor;
            _cloudinaryService = cloudinaryService;
        }

        public async Task<BaseResponse> Handle(CreateMessageCommand request, CancellationToken cancellationToken)
        {
            Domain.Entity.ChatRoom chatRoom = await _unitOfWork.ChatRoomRepository.GetChatRoomByUniqueNameAsync(request.ChatRoomName)
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

            var message = new Domain.Entity.Message()
            {
                ChatRoomId = chatRoom.Id,
                Content = request.Content,
                SenderId = userId,
                MessageType = MessageType.NORMAL,
                Medias = medias
            };

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            await _unitOfWork.MessageRepository.CreateMessageAsync(message);
            chatRoom.LastMessage = message.Content;
            chatRoom.LastMessageDate = DateTimeOffset.UtcNow;

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

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
