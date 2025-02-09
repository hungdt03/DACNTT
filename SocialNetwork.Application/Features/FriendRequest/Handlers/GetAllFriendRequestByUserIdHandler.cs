using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.FriendRequest.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.FriendRequest.Handlers
{
    public class GetAllFriendRequestByUserIdHandler : IRequestHandler<GetAllFriendRequestByUserIdQuery, BaseResponse>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IUnitOfWork _unitOfWork;

        public GetAllFriendRequestByUserIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
            _unitOfWork = unitOfWork;   
        }
        public async Task<BaseResponse> Handle(GetAllFriendRequestByUserIdQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var (friendRequests, totalCount) = await _unitOfWork.FriendShipRepository.GetAllPendingFriendRequestByUserId(userId, request.Page, request.Size);

            return new PaginationResponse<List<FriendRequestResponse>>
            {
                Data = ApplicationMapper.MapToFriendRequestList(friendRequests.ToList()),
                IsSuccess = true,
                Message = "Lấy thông tin lời kết bạn thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    Size = request.Size,
                    Page = request.Page,
                    HasMore = request.Page * request.Size < totalCount
                }
            };
        }
    }
}
