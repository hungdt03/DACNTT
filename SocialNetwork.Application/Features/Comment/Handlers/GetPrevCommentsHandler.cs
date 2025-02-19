using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Configuration;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Comment.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Entity.System;

namespace SocialNetwork.Application.Features.Comment.Handlers
{
    public class GetPrevCommentsHandler : IRequestHandler<GetPrevCommentsQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetPrevCommentsHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetPrevCommentsQuery request, CancellationToken cancellationToken)
        {
            const int pageSize = 5; 
            var comments = await _unitOfWork.CommentRepository.GetAllCommentsByPostIdAndParentCommentIdAsync(request.PostId, request.ParentCommentId);

            var skip = (request.Page - 1) * pageSize; 
            var prevComments = comments
                .Skip(skip)
                .Take(pageSize)
                .ToList();

            var userId = _contextAccessor.HttpContext.User.GetUserId();
            var response = new List<CommentResponse>();
            foreach (var comment in prevComments)
            {
                var commentItem = ApplicationMapper.MapToComment(comment);
                if (userId != comment.UserId)
                {
                    var block = await _unitOfWork.BlockListRepository
                    .GetBlockListByUserIdAndUserIdAsync(userId, comment.UserId);

                    if (block != null) continue;
                    var friendShip = await _unitOfWork.FriendShipRepository
                      .GetFriendShipByUserIdAndFriendIdAsync(comment.UserId, userId);

                    if (friendShip == null || !friendShip.IsConnect)
                    {
                        commentItem.User.IsShowStatus = false;
                        commentItem.User.IsOnline = false;
                    }
                }

                var haveStory = await _unitOfWork.StoryRepository
                          .IsUserHaveStoryAsync(comment.UserId);
                commentItem.User.HaveStory = haveStory;

                response.Add(commentItem);
            }

            return new CommentMentionPaginationResponse()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy bình luận trang trước thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new CommentMentionPagination()
                {
                    PrevPage = request.Page,
                    HavePrevPage = request.Page > 1,
                    HaveNextPage = true,
                }
            };
        }
    }
}
