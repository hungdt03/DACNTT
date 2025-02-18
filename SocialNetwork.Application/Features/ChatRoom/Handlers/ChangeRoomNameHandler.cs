using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.ChatRoom.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.ChatRoom.Handlers
{
    public class ChangeRoomNameHandler : IRequestHandler<ChangeRoomNameCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public ChangeRoomNameHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async  Task<BaseResponse> Handle(ChangeRoomNameCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var chatRoom = await _unitOfWork
              .ChatRoomRepository
              .GetChatRoomByIdAsync(request.ChatRoomId)
              ?? throw new NotFoundException("Nhóm chat không tồn tại");

            var userInChatRoom = await _unitOfWork.ChatRoomMemberRepository
                .GetChatRoomMemberByRoomIdAndUserId(chatRoom.Id, userId);

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            chatRoom.Name = request.Name;

            var userFullname = _contextAccessor.HttpContext.User.GetFullName();
            var message = new Domain.Entity.MessageInfo
             .Message()
            {
                Content = $"{userFullname} đã thay đổi tên nhóm thành {request.Name}",
                ChatRoomId = chatRoom.Id,
                MessageType = MessageType.SYSTEM,
                SentAt = DateTimeOffset.UtcNow,
            };

            chatRoom.LastMessage = $"{userFullname} đã thay đổi tên nhóm thành {request.Name}";
            chatRoom.LastMessageDate = DateTimeOffset.UtcNow;

            await _unitOfWork.MessageRepository.CreateMessageAsync(message);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            await _signalRService.SendMessageToSpecificGroup(chatRoom.UniqueName, ApplicationMapper.MapToMessage(message));

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Thay đổi tên nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
