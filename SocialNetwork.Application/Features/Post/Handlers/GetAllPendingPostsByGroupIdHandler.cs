
using MediatR;
using Microsoft.AspNetCore.Http;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Post.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class GetAllPendingPostsByGroupIdHandler : IRequestHandler<GetAllPendingPostsByGroupIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _contextAccessor;

        public GetAllPendingPostsByGroupIdHandler(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
        {
            _unitOfWork = unitOfWork;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> Handle(GetAllPendingPostsByGroupIdQuery request, CancellationToken cancellationToken)
        {
            var (pendingPosts, totalCount) = await _unitOfWork.PostRepository.GetAllPendingPostsByGroupIdAsync(request.GroupId, request.Page, request.Size);
            var response = pendingPosts.Select(ApplicationMapper.MapToPost).ToList();

            return new PaginationResponse<List<PostResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách bài viết đang chờ phê duyệt thành công",
                Pagination = new Pagination()
                {
                    HasMore = request.Page * request.Size < totalCount,
                    Page = request.Page,
                    Size = request.Size,
                }
            };
        }
    }
}
