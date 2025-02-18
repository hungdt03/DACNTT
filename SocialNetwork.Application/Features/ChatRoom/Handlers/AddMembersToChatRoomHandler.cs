
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
using SocialNetwork.Domain.Entity.ChatRoomInfo;

namespace SocialNetwork.Application.Features.ChatRoom.Handlers
{
    public class AddMembersToChatRoomHandler : IRequestHandler<AddMembersToChatRoomCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.System.User> _userManager;
        private readonly ISignalRService _signalRService;

        public AddMembersToChatRoomHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.System.User> userManager, ISignalRService signalRService)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(AddMembersToChatRoomCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var userFullname = _contextAccessor.HttpContext.User.GetFullName();

            var chatRoom = await _unitOfWork
                .ChatRoomRepository
                .GetChatRoomByIdAsync(request.ChatRoomId)
                ?? throw new NotFoundException("Nhóm chat không tồn tại");

            var userInChatRoom = await _unitOfWork.ChatRoomMemberRepository
                .GetChatRoomMemberByRoomIdAndUserId(chatRoom.Id, userId);


            if (userInChatRoom == null || !userInChatRoom.IsLeader)
                throw new AppException("Chỉ nhóm trưởng mới được thêm thành viên vào nhóm");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var allMembers = await _unitOfWork.ChatRoomMemberRepository.GetAllMembersByChatRoomIdAsync(chatRoom.Id);
            var messages = new List<Domain.Entity.MessageInfo.Message>();

            var listRoomMembers = new List<Domain.Entity.ChatRoomInfo.ChatRoomMember>();
            foreach(var memberId in request.UserIds)
            {
                var memberUser = await _userManager.FindByIdAsync(memberId)
                    ?? throw new AppException("Vui lòng kiểm tra lại danh sách userIds");

                var chatRoomMember = await _unitOfWork.ChatRoomMemberRepository
                    .GetChatRoomMemberByRoomIdAndUserId(chatRoom.Id, memberId);

                if(chatRoomMember == null)
                {
                    var member = new ChatRoomMember()
                    {
                        IsLeader = false,
                        UserId = memberId,
                        User = memberUser,
                        ChatRoomId = chatRoom.Id,
                        IsAccepted = true,
                    };

                    await _unitOfWork.ChatRoomMemberRepository.CreateChatRoomMember(member);

                    listRoomMembers.Add(member);
                } 

                var message = new Domain.Entity.MessageInfo
                    .Message()
                {
                    Content = $"{userFullname} đã thêm {memberUser.FullName} vào nhóm",
                    ChatRoomId = chatRoom.Id,
                    MessageType = MessageType.SYSTEM,
                    SentAt = DateTimeOffset.UtcNow,
                };

                await _unitOfWork.MessageRepository.CreateMessageAsync(message);       
                
                messages.Add(message);
            }
           
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            listRoomMembers.ForEach(async member =>
            {
                await _signalRService.JoinGroup(member.UserId, chatRoom.UniqueName);
            });

            for(int i = 0; i < messages.Count; i++)
            {
                var mapMessage = ApplicationMapper.MapToMessage(messages[i]);
                await _signalRService.SendMessageToSpecificGroup(chatRoom.UniqueName, mapMessage);
            }

            foreach(var mem in listRoomMembers)
            {
                await _signalRService.SendActionGroupToSpecificUser(mem.User.UserName, chatRoom.Id);
            } 

            

            return new BaseResponse()
            {
                Message = "Thêm thành viên vào nhóm chat thành công",
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
