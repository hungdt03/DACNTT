
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
    public class GetAllFriendsByFullNameHandler : IRequestHandler<GetAllFriendsByFullNameQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllFriendsByFullNameHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllFriendsByFullNameQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var myFriends = await _unitOfWork.FriendShipRepository.GetAllFriendsByName(userId, request.FullName);

            var response = new List<FriendResponse>();

            foreach (var friend in myFriends)
            {
                var friendItem = friend.FriendId == userId ? friend.User : friend.Friend;
                var resource = ApplicationMapper.MapToFriend(friendItem);
                response.Add(resource);
            }

            return new DataResponse<List<FriendResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách bạn bè thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };

        }
    }
}
