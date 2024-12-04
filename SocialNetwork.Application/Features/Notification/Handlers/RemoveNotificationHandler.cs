

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Notification.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Notification.Handlers
{
    public class RemoveNotificationHandler : IRequestHandler<RemoveNotificationCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public RemoveNotificationHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(RemoveNotificationCommand request, CancellationToken cancellationToken)
        {
            var notification = await _unitOfWork.NotificationRepository.GetNotificationByIdAsync(request.NotificationId)
                ?? throw new AppException("Không tìm thấy thông báo");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            _unitOfWork.NotificationRepository.DeleteNotification(notification);
            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Xóa thông báo thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
