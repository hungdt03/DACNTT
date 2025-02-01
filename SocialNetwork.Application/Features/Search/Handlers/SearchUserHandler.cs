
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Search.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Search.Handlers
{
    public class SearchUserHandler : IRequestHandler<SearchUserQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public SearchUserHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(SearchUserQuery request, CancellationToken cancellationToken)
        {
            var users = await _unitOfWork.UserRepository.GetAllUsersContainsKeyAsync(request.Query);

            var response = users.Select(ApplicationMapper.MapToUser).ToList();
            var countUsers = response.Count;

            return new DataResponse<List<UserResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = $"Tìm thấy {countUsers} kết quả cho '{request.Query}'",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
