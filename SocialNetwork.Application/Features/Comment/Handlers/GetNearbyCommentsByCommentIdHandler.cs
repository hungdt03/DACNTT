

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

            bool isHavePrev = false;
            bool isHaveNext = false;

            var pageSize = 5;
            var rootCurrentPage = 1;

            // Root comment
            var rootComments = await _unitOfWork.CommentRepository.GetAllRootCommentsByPostIdAsync(request.PostId);
            if (comment.ParentCommentId == null)
            {
                var index = rootComments.FindIndex(cmt => cmt.Id == request.CommentId);
                rootCurrentPage = (index / pageSize) + 1;

                var nearbyComments = rootComments
                    .Skip((rootCurrentPage - 1) * pageSize)  
                    .Take(pageSize)                    
                    .ToList();

                response = nearbyComments.Select(ApplicationMapper.MapToComment).ToList();
                isHavePrev = rootCurrentPage > 1;
                isHaveNext = (rootCurrentPage * pageSize) < rootComments.Count;

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

                rootCurrentPage = (indexRoot / pageSize) + 1;
                var nearbyRootComments = rootComments
                    .Skip((rootCurrentPage - 1) * pageSize)
                    .Take(5)
                    .ToList();

                response = nearbyRootComments.Select(ApplicationMapper.MapToComment).ToList();

                isHavePrev = rootCurrentPage > 1;
                isHaveNext = (rootCurrentPage * pageSize) < rootComments.Count;

                var currentComment = response.Find(item => item.Id == rootComments[indexRoot].Id);
              
                var haveChildren = currentComment.IsHaveChildren;
                var currentPage = 1;
                while (haveChildren)
                {
                    var childComments = await _unitOfWork.CommentRepository.GetAllRepliesByCommentIdAsync(currentComment.Id);
                    var indexChild = childComments.FindIndex(cmt => cmt.Id == findCommentId);
                    currentPage = (indexChild / pageSize) + 1;
                    bool isChildHavePrev = currentPage > 1;
                    bool isChildHaveNext = (currentPage * pageSize) < childComments.Count;

                    if (indexChild != -1)
                    {
                       
                        var nearbyChildComments = childComments
                              .Skip((currentPage - 1) * pageSize)
                                .Take(pageSize)
                                .ToList();

                        currentComment.Pagination ??= new CommentMentionPagination();
                        currentComment.Pagination.HaveNextPage = isChildHaveNext;
                        currentComment.Pagination.HavePrevPage = isChildHavePrev;
                        currentComment.Pagination.NextPage = currentComment.Pagination.PrevPage = currentPage;
                        currentComment.Replies ??= new List<CommentResponse>();
                        currentComment.Replies = nearbyChildComments.Select(ApplicationMapper.MapToComment).ToList();
                        break;
                    } 

                    var indexParentComment = childComments.FindIndex(cmt => cmt.Id == findParentCommentId);
                    currentPage = (indexParentComment / pageSize) + 1;
                    var nearbyParentComment = childComments
                                .Skip((currentPage - 1) * pageSize)
                                .Take(pageSize)
                                .ToList();

                    isChildHavePrev = currentPage > 1;
                    isChildHaveNext = (currentPage * pageSize) < childComments.Count;

                    currentComment.Pagination ??= new CommentMentionPagination();
                    currentComment.Pagination.HaveNextPage = isChildHaveNext;
                    currentComment.Pagination.HavePrevPage = isChildHavePrev;
                    currentComment.Pagination.NextPage = currentComment.Pagination.PrevPage = currentPage;
                    currentComment.Replies = nearbyParentComment.Select(ApplicationMapper.MapToComment).ToList();
                    currentComment = currentComment.Replies.Find(cmt => cmt.Id == findParentCommentId);
                    currentComment.IsHaveChildren = haveChildren = true;
                }
            }

            return new CommentMentionPaginationResponse()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách bình luận thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new CommentMentionPagination {
                    HaveNextPage = isHaveNext,
                    HavePrevPage = isHavePrev,
                    PrevPage = rootCurrentPage,
                    NextPage = rootCurrentPage,
                }
            };
        }
      
    }
}
