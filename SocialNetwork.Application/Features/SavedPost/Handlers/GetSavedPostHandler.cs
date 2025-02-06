

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.SavedPost.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.SavedPost.Handlers
{
    public class GetSavedPostHandler : IRequestHandler<GetSavedPostsQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetSavedPostHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetSavedPostsQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var savedPosts = await _unitOfWork.SavedPostRepository
                .GetAllSavedPostsByUserIdAsync(userId);

            var takeSavedPost = savedPosts
                .Skip((request.Page - 1) * request.Size)
                .Take(request.Size)
                .ToList();

            var posts = new List<PostResponse>();

            foreach (var savedPost in takeSavedPost)
            {
                var findPost = await _unitOfWork.PostRepository.GetPostByIdAsync(savedPost.Id);

                if (findPost == null) continue;
                var postItem = ApplicationMapper.MapToPost(findPost);

                var haveStory = await _unitOfWork.StoryRepository
                   .IsUserHaveStoryAsync(findPost.UserId);
                    postItem.User.HaveStory = haveStory;
              
                posts.Add(postItem);
            }

            return new PaginationResponse<List<PostResponse>>()
            {
                Data = posts,
                IsSuccess = true,
                Message = "Lấy danh sách bài viết đã lưu thành công",
                Pagination = new Pagination()
                {
                    HasMore = request.Page * request.Size < savedPosts.Count,
                    Size = request.Size,
                    Page = request.Page,
                }
            };
        }
    }
}
