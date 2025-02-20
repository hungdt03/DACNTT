
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Post.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class GetAllMemberPostByMemberHandler : IRequestHandler<GetAllMemberPostByMemberQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllMemberPostByMemberHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllMemberPostByMemberQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();

            var member = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByIdAsync(request.MemberId)
                ?? throw new AppException("Không tìm thấy thông tin nào");

            if(member.UserId != userId)
            {
                var block = await _unitOfWork.BlockListRepository
                    .GetBlockListByUserIdAndUserIdAsync(userId, member.UserId);

                if (member.Role == MemberRole.MEMBER && block != null)
                    throw new AppException("Bạn không thể thông tin của người này trong nhóm");
            }

            var meInGroup = await _unitOfWork.GroupMemberRepository
                .GetGroupMemberByGroupIdAndUserId(member.GroupId, userId);

            if (meInGroup == null && member.Group.Privacy == GroupPrivacy.PRIVATE)
                throw new AppException("Quyền truy cập bị từ chối");

            var (posts, totalCount) = await _unitOfWork.PostRepository
                .GetAllMemberGroupPostsByGroupIdAsync(member.GroupId, member.UserId, request.Page, request.Size);

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

                // Group
                if (post.IsGroupPost && post.Group != null)
                {
                    var groupMember = await _unitOfWork.GroupMemberRepository
                        .GetGroupMemberByGroupIdAndUserId(post.Group.Id, userId);

                    if (groupMember != null)
                    {
                        postItem.Group.IsMine = groupMember.Role == MemberRole.ADMIN;
                        postItem.Group.IsMember = true;
                        postItem.Group.IsModerator = groupMember.Role == MemberRole.MODERATOR;
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

            return new PaginationResponse<List<PostResponse>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách bài viết của thành viên trong nhóm thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    Page = request.Page,
                    Size = request.Size,
                    HasMore = request.Page * request.Size < totalCount,
                }
            };

        }
    }
}
