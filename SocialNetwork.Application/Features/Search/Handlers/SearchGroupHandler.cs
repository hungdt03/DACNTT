
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Search.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Search.Handlers
{
    public class SearchGroupHandler : IRequestHandler<SearchGroupQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public SearchGroupHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(SearchGroupQuery request, CancellationToken cancellationToken)
        {
            var groups = await _unitOfWork.GroupRepository.GetAllGroupsContainsKey(request.Query);

            var response = groups.Select(ApplicationMapper.MapToGroup).ToList();
            var countGroups = response.Count;

            return new DataResponse<List<GroupResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = $"Tìm thấy {countGroups} kết quả cho '{request.Query}'",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
