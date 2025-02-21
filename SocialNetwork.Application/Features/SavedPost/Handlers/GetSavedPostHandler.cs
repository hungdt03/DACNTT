

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.SavedPost.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

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
                var findPost = await _unitOfWork.PostRepository.GetPostByIdAsync(savedPost.PostId.Value);
                if (findPost == null) continue;

                var postItem = ApplicationMapper.MapToPost(findPost);
                if (findPost.PostType == PostType.ORIGINAL_POST)
                {
                    var shares = await _unitOfWork.PostRepository.CountSharesByPostIdAsync(findPost.Id);
                    postItem.Shares = shares;
                };

                var checkIsBlock = await _unitOfWork.BlockListRepository
                        .CheckIsBlockAsync(findPost.UserId, userId);

                if (checkIsBlock) continue;

                var friendShip = await _unitOfWork.FriendShipRepository
                    .GetFriendShipByUserIdAndFriendIdAsync(findPost.UserId, userId);

                if ((findPost.Privacy == PrivacyConstant.PUBLIC || findPost.Privacy == PrivacyConstant.GROUP_PUBLIC || findPost.Privacy == PrivacyConstant.GROUP_PRIVATE) && (friendShip == null || !friendShip.IsConnect))
                {
                    postItem.User.IsShowStatus = false;
                    postItem.User.IsOnline = false;
                }

                if (findPost.OriginalPost != null)
                {
                    // Story
                    var originalPostStory = await _unitOfWork.StoryRepository
                            .IsUserHaveStoryAsync(findPost.OriginalPost.UserId);
                    postItem.OriginalPost.User.HaveStory = originalPostStory;
                }

                // Story
                var haveStory = await _unitOfWork.StoryRepository
                        .IsUserHaveStoryAsync(findPost.UserId);
                postItem.User.HaveStory = haveStory;

                // Group
                if (findPost.IsGroupPost && findPost.Group != null)
                {
                    var groupMember = await _unitOfWork.GroupMemberRepository
                        .GetGroupMemberByGroupIdAndUserId(findPost.Group.Id, userId);

                    if (groupMember != null)
                    {
                        postItem.Group.IsMine = groupMember.Role == MemberRole.ADMIN;
                        postItem.Group.IsMember = true;
                        postItem.Group.IsModerator = groupMember.Role == MemberRole.MODERATOR;
                    }
                }

                postItem.IsSaved = true;
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
