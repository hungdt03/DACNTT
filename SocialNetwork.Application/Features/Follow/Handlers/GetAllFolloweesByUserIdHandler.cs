
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Follow.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Follow.Handlers
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
            var (followees, totalCount) = await _unitOfWork.FollowRepository.GetAllFolloweesByUserIdAsync(request.UserId, request.Page, request.Size);
            var response = followees.Select(f => ApplicationMapper.MapToUser(f.Followee)).ToList();

            return new PaginationResponse<List<UserResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách người đang theo dõi thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
                Pagination = new Pagination()
                {
                    Page = request.Page,
                    Size = request.Size,
                    HasMore = request.Page * request.Size < totalCount
                }
            };
        }
    }
}
