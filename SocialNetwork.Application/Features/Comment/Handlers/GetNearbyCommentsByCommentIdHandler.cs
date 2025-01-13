

using MediatR;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Exceptions;
using SocialNetwork.Application.Features.Comment.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Entity;

namespace SocialNetwork.Application.Features.Comment.Handlers
{
    public class GetNearbyCommentsByCommentIdHandler : IRequestHandler<GetNearbyCommentsByCommentIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetNearbyCommentsByCommentIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetNearbyCommentsByCommentIdQuery request, CancellationToken cancellationToken)
        {

            var comment = await _unitOfWork.CommentRepository
                .GetCommentByIdAsync(request.CommentId)
                    ?? throw new NotFoundException("Bình luận không tồn tại");

            var response = new List<CommentResponse>();

            // Root comment
            var rootComments = await _unitOfWork.CommentRepository.GetAllRootCommentsByPostIdAsync(request.PostId);
            if (comment.ParentCommentId == null)
            {
              
                var index = rootComments.FindIndex(cmt => cmt.Id == request.CommentId);
                var nearbyComments = rootComments
                    .Skip(Math.Max(0, index - 5))
                    .Take(11)
                    .ToList();

                response = nearbyComments.Select(ApplicationMapper.MapToComment).ToList();

            } else
            {
                var findCommentId = comment.Id;
                var findParentCommentId = comment.ParentCommentId;

                while (comment.ParentCommentId != null)
                {
                    var parentComment = await _unitOfWork.CommentRepository.GetCommentByIdAsync(comment.ParentCommentId.Value); 
                    comment = parentComment;
                }

                var indexRoot = rootComments.FindIndex(cmt => cmt.Id == comment.Id);
                var nearbyRootComments = rootComments
                    .Skip(Math.Max(0, indexRoot - 5))
                    .Take(11)
                    .ToList();

                response = nearbyRootComments.Select(ApplicationMapper.MapToComment).ToList();

                var currentComment = response[indexRoot];
                var haveChildren = currentComment.IsHaveChildren;
                while (haveChildren)
                {
                    var childComments = await _unitOfWork.CommentRepository.GetAllRepliesByCommentIdAsync(currentComment.Id);
                    var indexChild = childComments.FindIndex(cmt => cmt.Id == findCommentId);

                    if (indexChild != -1)
                    {
                        var nearbyChildComments = childComments
                            .Skip(Math.Max(0, indexChild - 5))
                            .Take(11)
                            .ToList();

                        currentComment.Replies ??= new List<CommentResponse>();
                        currentComment.Replies = nearbyChildComments.Select(ApplicationMapper.MapToComment).ToList();
                        break;
                    } 

                    var indexParentComment = childComments.FindIndex(cmt => cmt.Id == findParentCommentId);
                    var nearbyParentComment = childComments
                           .Skip(Math.Max(0, indexParentComment - 5))
                           .Take(11)
                           .ToList();
                   

                    currentComment.Replies = nearbyParentComment.Select(ApplicationMapper.MapToComment).ToList();
                    currentComment = currentComment.Replies.Find(cmt => cmt.Id == findParentCommentId);
                    currentComment.IsHaveChildren = haveChildren = true;
                }
            }

            return new DataResponse<List<CommentResponse>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách bình luận thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
      
    }
}
