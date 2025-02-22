
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
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Features.BlockList.Handlers
{
    public class AddBlockUserHandler : IRequestHandler<AddBlockUserCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.System.User> _userManager;
        private readonly ISignalRService _signalRService;

        public AddBlockUserHandler(IUnitOfWork unitOfWork, ISignalRService signalRService, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.System.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
            _signalRService = signalRService;
        }

        public async Task<BaseResponse> Handle(AddBlockUserCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            if (userId == request.UserId) throw new AppException("Không thể tự chặn chính mình");

            var blockeeUser = await _userManager.FindByIdAsync(request.UserId)
                ?? throw new NotFoundException("Thông tin người bị chặn không tồn tại");
           
            var existedBlockeeUser = await _unitOfWork.BlockListRepository
                .GetBlockListByBlockeeIdAndBlockerIdAsync(request.UserId, userId);

            if (existedBlockeeUser != null) throw new AppException("Người này đã có trong danh sách chặn của bạn");
            
            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var friendShip = await _unitOfWork
                .FriendShipRepository.GetFriendShipByUserIdAndFriendIdAsync(request.UserId, userId);

            var follow = await _unitOfWork.FollowRepository.GetFollowByFollowerIdAndFolloweeIdAsync(request.UserId, userId);
            var reverseFollow = await _unitOfWork.FollowRepository.GetFollowByFollowerIdAndFolloweeIdAsync(userId, request.UserId);

            if(follow != null)
            {
                _unitOfWork.FollowRepository.DeleteFollow(follow);
            }

            if (reverseFollow != null)
            {
                _unitOfWork.FollowRepository.DeleteFollow(reverseFollow);
            }

            if (friendShip != null)
            {
                friendShip.Status = FriendShipStatus.BLOCKED;
                friendShip.IsConnect = false;
            }

            var newBlock = new Domain.Entity.UserInfo.BlockList()
            {
                BlockeeId = request.UserId,
                BlockerId = userId,
            };

            await _unitOfWork.BlockListRepository.CreateNewBlockAsync(newBlock);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            var chatRoom = await _unitOfWork.ChatRoomRepository
               .GetPrivateChatRoomByMemberIds(new List<string> { userId, blockeeUser.Id });

            if(chatRoom != null)
            {
                await _signalRService.SendBlockSignalToSpecificUser(blockeeUser.UserName, chatRoom.Id);
            }

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = $"Bạn đã chặn {blockeeUser.FullName}",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
