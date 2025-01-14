using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.Features.Comment.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Comment.Handlers
{
    public class GetPrevCommentsHandler : IRequestHandler<GetPrevCommentsQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetPrevCommentsHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
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

            return new CommentMentionPaginationResponse()
            {
                Data = prevComments.Select(ApplicationMapper.MapToComment).ToList(),
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
