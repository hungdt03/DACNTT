

using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Comment.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Entity.PostInfo;

namespace SocialNetwork.Application.Features.Comment.Handlers
{
    public class GetAllRepliesByCommentIdHandler : IRequestHandler<GetAllRepliesByCommentIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllRepliesByCommentIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllRepliesByCommentIdQuery request, CancellationToken cancellationToken)
        {
            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var (comments, totalCount) = await _unitOfWork.CommentRepository
                .GetAllRepliesByCommentIdAsync(request.CommentId, request.Page, request.Size);

            var response = new List<CommentResponse>();
            foreach (var comment in comments)
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

                    if(block != null)
                    {
                        commentItem.User.IsShowStory = false;
                        commentItem.User.HaveStory = false;
                        commentItem.User.IsBlock = true;
                    } else
                    {
                        var haveStory = await _unitOfWork.StoryRepository
                          .IsUserHaveStoryAsync(comment.UserId);
                        commentItem.User.HaveStory = haveStory;

                    }
                } else
                {
                    var haveStory = await _unitOfWork.StoryRepository
                          .IsUserHaveStoryAsync(comment.UserId);
                    commentItem.User.HaveStory = haveStory;

                }


                response.Add(commentItem);
            }
            var hasMore = request.Page * request.Size < totalCount;

            return new PaginationResponse<List<CommentResponse>>
            {
                Data = response,
                Pagination = new Pagination
                {
                    Size = request.Size,
                    Page = request.Page,
                    HasMore = hasMore,
                },
                IsSuccess = true,
                Message = "Lấy các phản hồi bình luận thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
