

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Post.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;
using SocialNetwork.Domain.Constants;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class GetAllSharesByPostIdHandler : IRequestHandler<GetAllSharesByPostIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllSharesByPostIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllSharesByPostIdQuery request, CancellationToken cancellationToken)
        {
            var (posts, totalCount) = await _unitOfWork.PostRepository.GetAllSharesByPostIdAsync(request.PostId, request.Page, request.Size);

            var response = new List<PostResponse>();
            foreach (var post in posts)
            {
                var postItem = ApplicationMapper.MapToPost(post);
                response.Add(postItem);

            }

            var hasMore = request.Page * request.Size < totalCount;

            return new PaginationResponse<List<PostResponse>>
            {
                Data = response,
                Pagination = new Pagination
                {
                    Size = request.Size,
                    Page = request.Page,
                    HasMore = hasMore,
                },
                IsSuccess = true,
                Message = "Lấy danh sách chia sẻ bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
