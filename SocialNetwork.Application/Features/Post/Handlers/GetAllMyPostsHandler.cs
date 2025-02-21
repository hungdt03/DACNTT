
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
    public class GetAllMyPostsHandler : IRequestHandler<GetAllMyPostsQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllMyPostsHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllMyPostsQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var (posts, totalCount) = await _unitOfWork.PostRepository
                .GetAllMyPostsAsync(userId, request.Page, request.Size, request.Search, request.SortOrder, request.ContentType, request.FromDate, request.ToDate);

            var response = new List<PostResponse>();
            foreach (var post in posts)
            {
                var postItem = ApplicationMapper.MapToPost(post);
                if (post.PostType == PostType.ORIGINAL_POST)
                {
                    var shares = await _unitOfWork.PostRepository.CountSharesByPostIdAsync(post.Id);
                    postItem.Shares = shares;
                };

                if (post.OriginalPost != null)
                {
                    // Story
                    var originalPostStory = await _unitOfWork.StoryRepository
                            .IsUserHaveStoryAsync(post.OriginalPost.UserId);
                    postItem.OriginalPost.User.HaveStory = originalPostStory;
                }

                // Story
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
