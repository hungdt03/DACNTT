

using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Admin.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Admin.Handlers
{
    public class GetAllFollowerByUserIdHandler : IRequestHandler<GetAllFollowersByUserIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllFollowerByUserIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllFollowersByUserIdQuery request, CancellationToken cancellationToken)
        {
            var (followers, totalCount) = await _unitOfWork.FollowRepository.GetAllFollowersByUserIdAsync(request.UserId, request.Page, request.Size, request.Search);

            return new PaginationResponse<List<UserResponse>>()
            {
                Data = followers.Select(fl => ApplicationMapper.MapToUser(fl.Follower)).ToList(),
                IsSuccess = true,
                Message = "Lấy thông tin người theo dõi thành công",
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
