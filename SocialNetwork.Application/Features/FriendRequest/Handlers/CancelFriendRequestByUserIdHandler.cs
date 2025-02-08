
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.FriendRequest.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.FriendRequest.Handlers
{
    public class CancelFriendRequestByUserIdHandler : IRequestHandler<CancelFriendRequestByUserIdCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public CancelFriendRequestByUserIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(CancelFriendRequestByUserIdCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var friendRequest = await _unitOfWork.FriendShipRepository.GetFriendShipByUserIdAndFriendIdAsync(userId, request.UserId);

            if (friendRequest == null) throw new AppException("Chưa có lời mời kết bạn giữa 2 bạn");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            friendRequest.Status = FriendShipStatus.NONE;
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Hủy bỏ lời mời kết bạn thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
