
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Friend.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Friend.Handlers
{
    public class GetAllConnectUsersHandler : IRequestHandler<GetAllConnectUsersQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllConnectUsersHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllConnectUsersQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var (connectedUsers, totalCount) = await _unitOfWork.FriendShipRepository
                .GetAllConnectedUsers(userId, request.Page, request.Size);

            var response = new List<FriendResponse>();

            foreach (var friend in connectedUsers)
            {
                var friendItem = friend.FriendId == userId ? friend.User : friend.Friend;
                var resource = ApplicationMapper.MapToFriend(friendItem);
                response.Add(resource);
            }

            return new PaginationResponse<List<FriendResponse>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách những người đã kết nối thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    HasMore = request.Page * request.Size < totalCount,
                    Page = request.Page,
                    Size = request.Size,
                }
            };

        }
    }
}
