
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.BlockList.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.BlockList.Handlers
{
    public class AddBlockUserHandler : IRequestHandler<AddBlockUserCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly UserManager<Domain.Entity.System.User> _userManager;

        public AddBlockUserHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor, UserManager<Domain.Entity.System.User> userManager)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
            _userManager = userManager;
        }

        public async Task<BaseResponse> Handle(AddBlockUserCommand request, CancellationToken cancellationToken)
        {
          
            var blockeeUser = await _userManager.FindByIdAsync(request.UserId)
                ?? throw new NotFoundException("Thông tin người bị chặn không tồn tại");

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var existedBlockeeUser = await _unitOfWork.BlockListRepository
                .GetBlockListByBlockeeIdAndBlockerIdAsync(request.UserId, userId);

            if (existedBlockeeUser != null) throw new AppException("Người này đã có trong danh sách chặn của bạn");
            
            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var friendShip = await _unitOfWork
                .FriendShipRepository.GetFriendShipByUserIdAndFriendIdAsync(request.UserId, userId, FriendShipStatus.ACCEPTED);

            if(friendShip != null)
            {
                var notifications = await _unitOfWork.NotificationRepository.GetAllNotificationsByFriendShipId(friendShip.Id);
                _unitOfWork.NotificationRepository.RemoveRange(notifications);
                _unitOfWork.FriendShipRepository.DeleteFriendShip(friendShip);
            }

            var newBlock = new Domain.Entity.UserInfo.BlockList()
            {
                BlockeeId = request.UserId,
                BlockerId = userId,
            };

            await _unitOfWork.BlockListRepository.CreateNewBlockAsync(newBlock);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = $"Bạn đã chặn {blockeeUser.FullName}",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
