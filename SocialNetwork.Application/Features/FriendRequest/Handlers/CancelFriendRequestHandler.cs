
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.FriendShip.Commands;
using SocialNetwork.Application.Interfaces;
using MediatR;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.FriendShip.Handlers
{
    public class CancelFriendRequestHandler : IRequestHandler<CancelFriendRequestCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        public CancelFriendRequestHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(CancelFriendRequestCommand request, CancellationToken cancellationToken)
        {
            var friendRequest = await _unitOfWork.FriendShipRepository.GetFriendShipByIdAsync(request.RequestId)
                ?? throw new AppException("Lời mời kết bạn không tồn tại");

            if (friendRequest.Status == FriendRequestStatus.ACCEPTED)
                throw new AppException("Yêu cầu không hợp lệ");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);

            _unitOfWork.FriendShipRepository.DeleteFriendShip(friendRequest);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Hủy bỏ lời mời kết bạn thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
