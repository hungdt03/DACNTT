

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetAllPostByUserIdHandler : IRequestHandler<GetAllPostByUserIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllPostByUserIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllPostByUserIdQuery request, CancellationToken cancellationToken)
        {

            var (posts, totalCount) = await _unitOfWork.PostRepository.GetAllPostsByUserIdByAdminAsync(request.UserId, request.Page, request.Size, request.Search, request.SortOrder, request.ContentType, request.FromDate, request.ToDate);

            return new PaginationResponse<List<PostResponse>>()
            {
                Data = ApplicationMapper.MapToListPost(posts),
                IsSuccess = true,
                Message = "Lấy thông tin posts thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    HasMore = request.Page * request.Size < totalCount,
                    Page = request.Page,
                    Size = request.Size,
                    TotalCount = totalCount,
                    TotalPages = (int)Math.Ceiling((double)totalCount / request.Size),
                }
            };
        }
    }
}
