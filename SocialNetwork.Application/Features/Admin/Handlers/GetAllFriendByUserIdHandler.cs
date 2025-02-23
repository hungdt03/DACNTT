

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetAllFriendByUserIdHandler : IRequestHandler<GetAllFriendsByUserIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;


        public GetAllFriendByUserIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(GetAllFriendsByUserIdQuery request, CancellationToken cancellationToken)
        {

            var (friends, totalCount) = await _unitOfWork.FriendShipRepository.GetAllFriendsAsyncByUserId(request.UserId, request.Page, request.Size, request.Search);

            return new PaginationResponse<List<FriendResponse>>()
            {
                Data = friends.Select(friend => ApplicationMapper.MapToFriend(friend.UserId == request.UserId ? friend.Friend : friend.User)).ToList(),
                IsSuccess = true,
                Message = "Lấy thông tin bạn bè thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    HasMore = request.Page * request.Size < totalCount,
                    Page = request.Page,
                    Size = request.Size,
                    TotalCount = totalCount,
                    TotalPages = (int)Math.Ceiling((double)totalCount / request.Size),
                }
            };
        }
    }
}
