

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
    public class ChooseNewLeaderInChatRoomHandler : IRequestHandler<ChooseNewLeaderInChatRoomCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISignalRService _signalRService;
        private readonly IHttpContextAccessor _contextAccessor;

        public ChooseNewLeaderInChatRoomHandler(IUnitOfWork unitOfWork, ISignalRService signalRService, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _signalRService = signalRService;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(ChooseNewLeaderInChatRoomCommand request, CancellationToken cancellationToken)
        {
           var userId = _contextAccessor.HttpContext.User.GetUserId();

            var chatRoomMember = await _unitOfWork
               .ChatRoomMemberRepository
               .GetChatRoomMemberById(request.MemberId)
               ?? throw new NotFoundException("ID của thành viên không tồn tại");

            if (chatRoomMember.IsLeader)
                throw new AppException("Thành viên này đã đang làm trưởng nhóm");

            var userInChatRoom = await _unitOfWork.ChatRoomMemberRepository
                .GetChatRoomMemberByRoomIdAndUserId(chatRoomMember.ChatRoomId, userId);

            if (userInChatRoom == null || !userInChatRoom.IsLeader)
                throw new AppException("Chỉ nhóm trưởng mới được chọn thành viên khác làm trưởng nhóm");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            chatRoomMember.IsLeader = true;

            var userFullName = _contextAccessor.HttpContext.User.GetFullName();
            var message = new Domain.Entity.MessageInfo
               .Message()
            {
                Content = $"{userFullName} đã thêm {chatRoomMember.User.FullName} vào danh sách trưởng nhóm",
                ChatRoomId = chatRoomMember.ChatRoomId,
                MessageType = MessageType.SYSTEM,
                SentAt = DateTimeOffset.UtcNow,
            };

            await _unitOfWork.MessageRepository.CreateMessageAsync(message);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            await _signalRService.SendMessageToSpecificGroup(chatRoomMember.ChatRoom.UniqueName, ApplicationMapper.MapToMessage(message));

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Thêm trưởng nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
