
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs.Search;
using SocialNetwork.Application.Features.Search.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Search.Handlers
{
    public class SearchAllHandler : IRequestHandler<SearchAllQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public SearchAllHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<BaseResponse> Handle(SearchAllQuery request, CancellationToken cancellationToken)
        {
            var users = await _unitOfWork.UserRepository.GetAllUsersContainsKeyAsync(request.Query.ToLower());
            var groups = await _unitOfWork.GroupRepository.GetAllGroupsContainsKey(request.Query.ToLower());
            var posts = await _unitOfWork.PostRepository.GetAllPostsContainsKey(request.Query.ToLower());

            var response = new SearchAllResponse()
            {
                Groups = groups.Select(ApplicationMapper.MapToGroup).ToList(),
                Posts = posts.Select(ApplicationMapper.MapToPost).ToList(),
                Users = users.Select(ApplicationMapper.MapToUser).ToList(),
            };

            var countResult = users.Count() + groups.Count() + posts.Count;
            return new DataResponse<SearchAllResponse>
            {
                Data = response,
                IsSuccess = true,
                Message = $"Tìm thấy {countResult} kết quả cho '{countResult}'",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
