
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Message.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Features.Message.Handlers
{
    public class ReadMessageHandler : IRequestHandler<ReadMessageCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;
        private readonly ILogger<ReadMessageHandler> _logger;

        public ReadMessageHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService, ILogger<ReadMessageHandler> logger) { 
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
            _logger = logger;
        }

        public async Task<BaseResponse> Handle(ReadMessageCommand request, CancellationToken cancellationToken)
        {
            var message = await _unitOfWork.MessageRepository.GetLastMessageByGroupIdAsync(request.ChatRoomId)
                ?? throw new NotFoundException("Không tìm thấy tin nhắn");

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            if (message.SenderId == userId) throw new AppException("Tin nhắn đã được đọc lúc gửi");
            var recentReadStatus = await _unitOfWork.MessageReadStatusRepository.GetMessageReadStatusByUserAndChatRoomId(userId, message.ChatRoomId);

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var isNoti = false;
            if(recentReadStatus == null)
            {
                recentReadStatus = new MessageReadStatus()
                {
                    UserId = userId,
                    IsRead = true,
                    ReadAt = DateTimeOffset.UtcNow,
                    MessageId = message.Id,
                };

                await _unitOfWork.MessageReadStatusRepository.CreateMessageReadStatusAsync(recentReadStatus);
                isNoti = true;
            }
            else if (recentReadStatus.MessageId != message.Id)
            {
                recentReadStatus.MessageId = message.Id;
                recentReadStatus.ReadAt = DateTimeOffset.UtcNow;
                isNoti = true;
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            if(isNoti)
            {
                var updatedMessage = await _unitOfWork.MessageRepository.GetMessageByIdAsync(message.Id);
                await _signalRService.SendReadStatusToSpecificGroup(message.ChatRoom.UniqueName, ApplicationMapper.MapToMessage(updatedMessage), userId);
            }

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Tin nhắn đã được đọc",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
