

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetAllFolloweesByUserIdHandler : IRequestHandler<GetAllFolloweesByUserIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllFolloweesByUserIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllFolloweesByUserIdQuery request, CancellationToken cancellationToken)
        {
            var (followees, totalCount) = await _unitOfWork.FollowRepository.GetAllFolloweesByUserIdAsync(request.UserId, request.Page, request.Size, request.Search);

            return new PaginationResponse<List<UserResponse>>()
            {
                Data = followees.Select(fl => ApplicationMapper.MapToUser(fl.Followee)).ToList(),
                IsSuccess = true,
                Message = "Lấy thông tin người đang theo dõi thành công",
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
