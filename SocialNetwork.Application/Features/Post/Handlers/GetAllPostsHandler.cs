
using MediatR;
using SocialNetwork.Application.Contracts.Responses;
using SocialNetwork.Application.DTOs;
using SocialNetwork.Application.Features.Post.Queries;
using SocialNetwork.Application.Interfaces;
using SocialNetwork.Application.Mappers;

namespace SocialNetwork.Application.Features.Post.Handlers
{
    public class GetAllPostsHandler : IRequestHandler<GetAllPostQuery, BaseResponse>
    {
        private readonly IUnitOfWork unitOfWork;

        public GetAllPostsHandler(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public async Task<BaseResponse> Handle(GetAllPostQuery request, CancellationToken cancellationToken)
        {
            var posts = await unitOfWork.PostRepository.GetAllPostsAsync();
            var response = posts.Select(ApplicationMapper.MapToPost).ToList();

            return new DataResponse<List<PostResponse>>()
            {
                Data = response,
                IsSuccess = true,
                Message = "Lấy danh sách bài viết thành công",
                StatusCode = System.Net.HttpStatusCode.OK
            };
        }
    }
}
