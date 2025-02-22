

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Common.Helpers;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.ChatRoom.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;
using SocialNetwork.Domain.Entity.ChatRoomInfo;

namespace SocialNetwork.Application.Features.ChatRoom.Handlers
{
    public class UploadAvatarChatRoomHandler : IRequestHandler<UploadAvatarChatRoomCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;
        private readonly ICloudinaryService _cloudinaryService;

        public UploadAvatarChatRoomHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService, ICloudinaryService cloudinaryService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
            _cloudinaryService = cloudinaryService;
        }

        public async Task<BaseResponse> Handle(UploadAvatarChatRoomCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var chatRoom = await _unitOfWork
              .ChatRoomRepository
              .GetChatRoomByIdAsync(request.ChatRoomId)
              ?? throw new NotFoundException("Nhóm chat không tồn tại");

            var userInChatRoom = await _unitOfWork.ChatRoomMemberRepository
                .GetChatRoomMemberByRoomIdAndUserId(chatRoom.Id, userId)
                ?? throw new AppException("Bạn không phải là thành viên của nhóm chat này");

            long maxSizeInBytes = 4 * 1024 * 1024;
            if (FileValidationHelper.AreFilesTooLarge([request.Image], maxSizeInBytes))
            {
                throw new AppException("Kích thước tệp vượt quá giới hạn 4MB.");
            }

            var image = await _cloudinaryService.UploadImageAsync(request.Image);

            await _unitOfWork.BeginTransactionAsync (cancellationToken);
            chatRoom.ImageUrl = image;

            var userFullname = _contextAccessor.HttpContext.User.GetFullName();
            var message = new Domain.Entity.MessageInfo
                .Message()
            {
                Content = $"{userFullname} đã thay đổi ảnh nhóm",
                ChatRoomId = chatRoom.Id,
                MessageType = MessageType.SYSTEM,
                SentAt = DateTimeOffset.UtcNow,
            };
            await _unitOfWork.MessageRepository.CreateMessageAsync(message);

            await _unitOfWork.CommitTransactionAsync (cancellationToken);
            await _signalRService.SendMessageToSpecificGroup(chatRoom.UniqueName, ApplicationMapper.MapToMessage(message));
           
            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Cập nhật ảnh nhóm chat thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };

        }
    }
}
