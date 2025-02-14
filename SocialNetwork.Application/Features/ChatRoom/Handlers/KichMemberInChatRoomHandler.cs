

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
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
    public class KichMemberInChatRoomHandler : IRequestHandler<KickMemberInChatRoomCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISignalRService _signalRService;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.System.User> _userManager;

        public KichMemberInChatRoomHandler(IUnitOfWork unitOfWork, ISignalRService signalRService, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.System.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _signalRService = signalRService;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
        }

        public async Task<BaseResponse> Handle(KickMemberInChatRoomCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var chatRoomMember = await _unitOfWork
                .ChatRoomMemberRepository
                .GetChatRoomMemberById(request.MemberId)
                ?? throw new NotFoundException("ID của thành viên không tồn tại");

            var userInChatRoom = await _unitOfWork.ChatRoomMemberRepository
                .GetChatRoomMemberByRoomIdAndUserId(chatRoomMember.ChatRoomId, userId);

            if (userInChatRoom == null || !userInChatRoom.IsLeader)
                throw new AppException("Chỉ nhóm trưởng mới được xóa thành viên khác khỏi nhóm");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var userFullname = _contextAccessor.HttpContext.User.GetFullName();
            var message = new Domain.Entity.MessageInfo
                .Message()
            {
                Content = $"{userFullname} đã xóa {chatRoomMember.User.FullName} khỏi nhóm",
                ChatRoomId = chatRoomMember.ChatRoomId,
                MessageType = MessageType.SYSTEM,
                SentAt = DateTimeOffset.UtcNow,
            };

            _unitOfWork.ChatRoomMemberRepository.DeleteMember(chatRoomMember);
            await _unitOfWork.MessageRepository.CreateMessageAsync(message);

            chatRoomMember.IsLeader = false;

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            var mapMessage = ApplicationMapper.MapToMessage(message);
            mapMessage.IsRemove = true;
            mapMessage.MemberId = chatRoomMember.UserId;
            await _signalRService.SendMessageToSpecificGroup(chatRoomMember.ChatRoom.UniqueName, mapMessage);
            await _signalRService.LeaveGroup(chatRoomMember.UserId, chatRoomMember.ChatRoom.UniqueName);

            return new BaseResponse()
            {
                Message = "Xóa thành viên khỏi nhóm chat thành công",
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
