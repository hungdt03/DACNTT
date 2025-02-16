
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Friend.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using System.Collections.Generic;

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
            var connectedUsers = await _unitOfWork.FriendShipRepository.GetAllConnectedUsers(userId);

            if (!string.IsNullOrEmpty(request.Query))
            {
                string lowerQuery = request.Query.ToLower();
                connectedUsers = connectedUsers
                    .Where(friend =>
                        (friend.FriendId == userId && friend.User.FullName.ToLower().Contains(lowerQuery)) ||
                        (friend.UserId == userId && friend.Friend.FullName.ToLower().Contains(lowerQuery)))
                    .ToList();
            }

            var totalCount = connectedUsers.Count();

            var takeUsers = connectedUsers
                .Skip((request.Page - 1) * request.Size)
                .Take(request.Size)
                .Select(friend => ApplicationMapper.MapToFriend(friend.FriendId == userId ? friend.User : friend.Friend))
                .ToList();

            return new PaginationResponse<List<FriendResponse>>()
            {
                Data = takeUsers,
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
