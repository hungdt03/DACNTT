
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Notification.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Notification.Handlers
{
    public class GetAllNotificationsHandler : IRequestHandler<GetAllNotificationsQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllNotificationsHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllNotificationsQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var (notifications, totalCount) = await _unitOfWork.NotificationRepository
                .GetAllNotificationsAsync(userId, request.Page, request.Size);

            var response = notifications.Select(ApplicationMapper.MapToNotification).ToList();
            var hasMore = request.Page * request.Size < totalCount;

            return new PaginationResponse<List<NotificationResponse>>
            {
                Data = response,
                Pagination = new Pagination
                {
                    Size = request.Size,
                    Page = request.Page,
                    HasMore = hasMore,
                },
                IsSuccess = true,
                Message = "Lấy danh sách thông báo thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
