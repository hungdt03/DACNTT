

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Comment.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Comment.Handlers
{
    public class GetAllRepliesByCommentIdHandler : IRequestHandler<GetAllRepliesByCommentIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllRepliesByCommentIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllRepliesByCommentIdQuery request, CancellationToken cancellationToken)
        {
            var (comments, totalCount) = await _unitOfWork.CommentRepository
                .GetAllRepliesByCommentIdAsync(request.CommentId, request.Page, request.Size);

            var response = comments.Select(ApplicationMapper.MapToComment).ToList();
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
