

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Notification.Commands;
using SocialNetwork.Application.Interfaces;

namespace SocialNetwork.Application.Features.Notification.Handlers
{
    public class MarkNotificationAsReadHandler : IRequestHandler<MarkNotificationAsReadCommand, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public MarkNotificationAsReadHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(MarkNotificationAsReadCommand request, CancellationToken cancellationToken)
        {
            var notification = await _unitOfWork.NotificationRepository.GetNotificationByIdAsync(request.NotificationId)
                ?? throw new AppException("Không tìm thấy thông báo");

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            notification.IsRead = true;
            await _unitOfWork.CommitTransactionAsync(cancellationToken);


            return new BaseResponse()
            {
                IsSuccess = true,
                Message = "Cập nhật trạng thái thông báo thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
