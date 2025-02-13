
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
    public class LeaveChatRoomHandler : IRequestHandler<LeaveChatRoomCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISignalRService _signalRService;

        public LeaveChatRoomHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(LeaveChatRoomCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var chatRoomMember = await _unitOfWork
                .ChatRoomMemberRepository.GetChatRoomMemberByRoomIdAndUserId(request.ChatRoomId, userId)
                ?? throw new AppException("ID nhóm không hợp lệ");

            var countLeaders = await _unitOfWork.ChatRoomMemberRepository
                .CountLeaderByChatRoomId(chatRoomMember.ChatRoomId);

            var countMember = await _unitOfWork.ChatRoomMemberRepository
                .CountMembersByChatRoomId(chatRoomMember.ChatRoomId);

            if (countLeaders == 1 && countMember > 1)
                throw new AppException("Bạn cần chọn một nhóm trưởng mới trước khi rời nhóm");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            _unitOfWork.ChatRoomMemberRepository.DeleteMember(chatRoomMember);
            var userFullName = _contextAccessor.HttpContext.User.GetFullName();
            var message = new Domain.Entity.MessageInfo
                .Message()
            {
                Content = $"{userFullName} đã rời nhóm",
                ChatRoomId = chatRoomMember.ChatRoomId,
                MessageType = MessageType.SYSTEM,
                SentAt = DateTimeOffset.UtcNow,
            };

            await _unitOfWork.MessageRepository.CreateMessageAsync(message);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            await _signalRService.SendMessageToSpecificGroup(chatRoomMember.ChatRoom.UniqueName, ApplicationMapper.MapToMessage(message));
            await _signalRService.LeaveGroup(userId, chatRoomMember.ChatRoom.UniqueName);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Rời nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
