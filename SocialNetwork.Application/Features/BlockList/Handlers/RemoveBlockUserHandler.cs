

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.BlockList.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Interfaces.Services;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.BlockList.Handlers
{
    public class RemoveBlockUserHandler : IRequestHandler<RemoveBlockUserCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.System.User> _userManager;
        private readonly ISignalRService _signalRService;

        public RemoveBlockUserHandler(IUnitOfWork unitOfWork, ISignalRService signalRService, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.System.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(RemoveBlockUserCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var user = await _userManager.FindByIdAsync(request.UserId)
                ?? throw new NotFoundException("Thông tin người dùng bạn cung cấp không tồn tại");

            var blockUser = await _unitOfWork.BlockListRepository
                .GetBlockListByBlockeeIdAndBlockerIdAsync(request.UserId, userId)
                    ?? throw new AppException("Bạn chưa chặn người dùng này");

           
            await _unitOfWork.BeginTransactionAsync(cancellationToken);


            var chatRoom = await _unitOfWork.ChatRoomRepository
                .GetPrivateChatRoomByMemberIds(new List<string> { userId, user.Id });

            var friendShip = await _unitOfWork
                .FriendShipRepository.GetFriendShipByUserIdAndFriendIdAsync(request.UserId, userId);

            if (friendShip != null)
            {
                friendShip.Status = FriendShipStatus.NONE;

                if (chatRoom?.LastMessage != null)
                {
                    friendShip.IsConnect = true;
                }
            }

            _unitOfWork.BlockListRepository.RemoveBlockList(blockUser);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            if(chatRoom != null)
            {
                await _signalRService.SendBlockSignalToSpecificUser(user.UserName, chatRoom.Id);
            }

            return new BaseResponse()
            {
                Message = $"Bạn đã bỏ chặn {user.FullName}",
                IsSuccess = true,
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
