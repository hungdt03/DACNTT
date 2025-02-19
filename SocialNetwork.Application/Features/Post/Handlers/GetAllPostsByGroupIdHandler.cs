

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Post.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class GetAllPostsByGroupIdHandler : IRequestHandler<GetAllPostsByGroupIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllPostsByGroupIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllPostsByGroupIdQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var (posts, totalCount) = await _unitOfWork.PostRepository.GetAllPostsByGroupIdAsync(request.GroupId, request.Page, request.Size);

            var response = new List<PostResponse>();
            foreach (var post in posts)
            {
                var postItem = ApplicationMapper.MapToPost(post);
                if (post.PostType == PostType.ORIGINAL_POST)
                {
                    var shares = await _unitOfWork.PostRepository.CountSharesByPostIdAsync(post.Id);
                    postItem.Shares = shares;
                };

                if (post.UserId != userId)
                {
                    var friendShip = await _unitOfWork.FriendShipRepository
                       .GetFriendShipByUserIdAndFriendIdAsync(post.UserId, userId);

                    if (friendShip == null || !friendShip.IsConnect)
                    {
                        postItem.User.IsShowStatus = false;
                        postItem.User.IsOnline = false;
                    }
                    
                }
            
                    var haveStory = await _unitOfWork.StoryRepository
                        .IsUserHaveStoryAsync(post.UserId);
                    postItem.User.HaveStory = haveStory;

                var savedPost = await _unitOfWork.SavedPostRepository
                 .GetSavedPostByPostIdAndUserId(post.Id, userId);

                postItem.IsSaved = savedPost != null;
                response.Add(postItem);

            }

            var hasMore = request.Page * request.Size < totalCount;

            return new PaginationResponse<List<PostResponse>>
            {
                Data = response,
                Pagination = new Pagination
                {
                    Size = request.Size,
                    Page = request.Page,
                    HasMore = hasMore,
                },
                IsSuccess = true,
                Message = "Lấy danh sách bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
