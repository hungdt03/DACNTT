

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
    public class GetAllAcceptedPostByGroupIdAndCurrentUserHandler : IRequestHandler<GetAllAcceptedPostByGroupIdAndCurrentUserQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllAcceptedPostByGroupIdAndCurrentUserHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllAcceptedPostByGroupIdAndCurrentUserQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var (posts, totalCount) = await _unitOfWork.PostRepository
                .GetAllGroupPostsByGroupIdAndUserIdAndStatus(request.GroupId, userId, ApprovalStatus.APPROVED, request.Page, request.Size);

            var response = new List<PostResponse>();
            foreach (var post in posts)
            {
                var postItem = ApplicationMapper.MapToPost(post);
                if (post.PostType == PostType.ORIGINAL_POST)
                {
                    var shares = await _unitOfWork.PostRepository.CountSharesByPostIdAsync(post.Id);
                    postItem.Shares = shares;
                };

                var haveStory = await _unitOfWork.StoryRepository
                    .IsUserHaveStoryAsync(post.UserId);
                postItem.User.HaveStory = haveStory;

                var savedPost = await _unitOfWork.SavedPostRepository
                 .GetSavedPostByPostIdAndUserId(post.Id, userId);

                postItem.IsSaved = savedPost != null;

                response.Add(postItem);
            }

            return new PaginationResponse<List<PostResponse>>()
            {
                IsSuccess = true,
                Data = response,
                Message = "Lấy danh sách bài viết đã đăng thành công",
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
