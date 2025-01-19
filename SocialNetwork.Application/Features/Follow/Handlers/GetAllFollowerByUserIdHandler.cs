using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Follow.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Follow.Handlers
{
    public class GetAllFollowerByUserIdHandler : IRequestHandler<GetAllFollowerByUserIdQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public GetAllFollowerByUserIdHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllFollowerByUserIdQuery request, CancellationToken cancellationToken)
        {
            var followers = await _unitOfWork.FollowRepository.GetAllFollowersByUserIdAsync(request.UserId);
            var response = followers.Select(f => ApplicationMapper.MapToUser(f.Follower)).ToList();

            return new DataResponse<List<UserResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách người theo dõi thành công",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
