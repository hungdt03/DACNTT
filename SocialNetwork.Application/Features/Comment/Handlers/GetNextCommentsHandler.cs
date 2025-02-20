
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Comment.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Comment.Handlers
{
    public class GetNextCommentsHandler : IRequestHandler<GetNextCommentsQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetNextCommentsHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetNextCommentsQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            const int pageSize = 5; 
            var comments = await _unitOfWork.CommentRepository.GetAllCommentsByPostIdAndParentCommentIdAsync(request.PostId, request.ParentCommentId);
            
            var skip = (request.Page - 1) * pageSize;
            var nextComments = comments
                .Skip(skip)
                .Take(pageSize)
                .ToList();

            var response = new List<CommentResponse>();
            foreach (var comment in nextComments)
            {
                var commentItem = ApplicationMapper.MapToComment(comment);
                if (userId != comment.UserId)
                {
                    var block = await _unitOfWork.BlockListRepository
                    .GetBlockListByUserIdAndUserIdAsync(userId, comment.UserId);

                    var friendShip = await _unitOfWork.FriendShipRepository
                      .GetFriendShipByUserIdAndFriendIdAsync(comment.UserId, userId);

                    if (friendShip == null || !friendShip.IsConnect)
                    {
                        commentItem.User.IsShowStatus = false;
                        commentItem.User.IsOnline = false;
                    }

                    if (block != null)
                    {
                        commentItem.User.IsShowStory = false;
                        commentItem.User.HaveStory = false;
                        commentItem.User.IsBlock = true;
                    }
                    else
                    {
                        var haveStory = await _unitOfWork.StoryRepository
                          .IsUserHaveStoryAsync(comment.UserId);
                        commentItem.User.HaveStory = haveStory;
                    }
                }
                else
                {
                    var haveStory = await _unitOfWork.StoryRepository
                          .IsUserHaveStoryAsync(comment.UserId);
                    commentItem.User.HaveStory = haveStory;
                }

                response.Add(commentItem);
            }

            return new CommentMentionPaginationResponse()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy bình luận trang tiếp theo thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new CommentMentionPagination()
                {
                    NextPage = request.Page,
                    HavePrevPage = true,
                    HaveNextPage = request.Page * pageSize < comments.Count,
                }
            };
        }
    }
}
