
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Search.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Search.Handlers
{
    public class SearchPostHandler : IRequestHandler<SearchPostQuery, BaseResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public SearchPostHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(SearchPostQuery request, CancellationToken cancellationToken)
        {
            var posts = await _unitOfWork.PostRepository.GetAllPostsContainsKey(request.Query);

            var response = posts.Select(ApplicationMapper.MapToPost).ToList();
            var countPosts = response.Count;

            return new DataResponse<List<PostResponse>>
            {
                Data = response,
                IsSuccess = true,
                Message = $"Tìm thấy {countPosts} kết quả cho '{request.Query}'",
                StatusCode = System.Net.HttpStatusCode.OK,
            };
        }
    }
}
