
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.Comment.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Comment.Handlers
{
    public class GetNextCommentsHandler : IRequestHandler<GetNextCommentsQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetNextCommentsHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetNextCommentsQuery request, CancellationToken cancellationToken)
        {
            const int pageSize = 5; 
            var comments = await _unitOfWork.CommentRepository.GetAllCommentsByPostIdAndParentCommentIdAsync(request.PostId, request.ParentCommentId);
            var skip = (request.Page - 1) * pageSize;
            var nextComments = comments
                .Skip(skip)
                .Take(pageSize)
                .ToList();

            return new CommentMentionPaginationResponse()
            {
                Data = nextComments.Select(ApplicationMapper.MapToComment).ToList(),
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
