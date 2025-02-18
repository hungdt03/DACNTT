
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Friend.Commands;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Friend.Handlers
{
    public class DeleteFriendHandler : IRequestHandler<DeleteFriendCommand, BaseResponse>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUnitOfWork _unitOfWork;

        public DeleteFriendHandler(IHttpContextAccessor contextAccessor, IUnitOfWork unitOfWork)
        {
            _contextAccessor = contextAccessor;
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(DeleteFriendCommand request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var friendRequest = await _unitOfWork.FriendShipRepository
                .GetFriendShipByUserIdAndFriendIdAsync(userId, request.FriendId)
                    ?? throw new AppException("Các bạn chưa là bạn bè");

            if (friendRequest?.Status == FriendShipStatus.PENDING) throw new AppException("Bạn và người này chưa là bạn bè");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            friendRequest.Status = FriendShipStatus.NONE;

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Hủy kết bạn thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
